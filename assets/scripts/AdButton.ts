import {
    _decorator, Component, Button, find, Node, director, Label, Color, UITransform,
    UIOpacity, tween, Vec3, Tween, view, Widget,
} from 'cc';
import { SharedBtnCounts } from './SharedBtnCounts';
import { PetInfoBar } from './PetInfoBar';
import { TogglePet } from './TogglePet';

const { ccclass, property } = _decorator;

/**
 * 道具入口（原 ad/签到节点）：显示三道具总数量；点击与底部麦克风互斥切换道具栏。
 */
@ccclass('AdButton')
export class AdButton extends Component {

    @property({ tooltip: 'Canvas/btn 根节点，留空则自动查找' })
    itemsRoot: Node | null = null;

    @property({ tooltip: 'Canvas/btn_micro，留空则自动查找' })
    micNode: Node | null = null;

    @property({ type: Label, tooltip: '总数量 Label，留空则在入口右上角自动创建' })
    totalCountLabel: Label | null = null;

    @property
    switchDuration = 0.28;

    private _open = false;
    private _itemsOpacity: UIOpacity | null = null;
    private _micOpacity: UIOpacity | null = null;
    private readonly _micBaseScale = new Vec3(1, 1, 1);
    private readonly _itemsBaseScale = new Vec3(1, 1, 1);
    private _itemsBaseX = 0;
    private _itemsBaseY = 0;
    private _backdrop: Node | null = null;
    private _backdropOpacity: UIOpacity | null = null;

    onLoad() {
        if (!this.itemsRoot) this.itemsRoot = find('Canvas/btn');
        if (!this.micNode) this.micNode = find('Canvas/btn_micro');

        this._ensureCountLabel();
        this._hookCountsRefresh();
        this._bindEntryClick();
        this._bindItemButtons();
        this._ensureBackdrop();

        if (this.itemsRoot) {
            this._itemsOpacity = this.itemsRoot.getComponent(UIOpacity)
                || this.itemsRoot.addComponent(UIOpacity);
            this._itemsBaseX = this.itemsRoot.position.x;
            this._itemsBaseY = this.itemsRoot.position.y;
            this._itemsBaseScale.set(this.itemsRoot.scale);
            this.itemsRoot.active = false;
            this._itemsOpacity.opacity = 0;
        }
        if (this.micNode) {
            this._micOpacity = this.micNode.getComponent(UIOpacity)
                || this.micNode.addComponent(UIOpacity);
            this._micBaseScale.set(this.micNode.scale);
            this.micNode.active = true;
            this._micOpacity.opacity = 255;
        }

        SharedBtnCounts.init();
        this._refreshTotalLabel();
    }

    onEnable() {
        SharedBtnCounts.init();
        this._refreshTotalLabel();
        if (!this._open) {
            this._applyMicVisibleImmediate(true);
            this._applyItemsVisibleImmediate(false);
            this._hideBackdropImmediate();
        }
    }

    onDestroy() {
        if (this._backdrop?.isValid) {
            this._backdrop.off(Node.EventType.TOUCH_END, this._onBackdropTap, this);
        }
    }

    private _hookCountsRefresh() {
        const prev = SharedBtnCounts.onChangeCallback;
        SharedBtnCounts.onChangeCallback = () => {
            prev?.();
            this._refreshTotalLabel();
        };
    }

    private _ensureCountLabel() {
        if (this.totalCountLabel?.isValid) return;
        let n = this.node.getChildByName('item_total');
        if (!n) {
            n = new Node('item_total');
            this.node.addChild(n);
            n.setPosition(46, 46, 0);
            const uit = n.addComponent(UITransform);
            uit.setContentSize(56, 40);
            const lb = n.addComponent(Label);
            lb.fontSize = 28;
            lb.lineHeight = 34;
            lb.horizontalAlign = Label.HorizontalAlign.CENTER;
            lb.verticalAlign = Label.VerticalAlign.CENTER;
            lb.color = new Color(255, 255, 255, 255);
            lb.enableOutline = true;
            lb.outlineColor = new Color(80, 60, 120, 255);
            lb.outlineWidth = 2;
            this.totalCountLabel = lb;
        } else {
            this.totalCountLabel = n.getComponent(Label);
        }
    }

    private _refreshTotalLabel() {
        if (!this.totalCountLabel) return;
        const total = SharedBtnCounts.btn1 + SharedBtnCounts.btn2 + SharedBtnCounts.btn3;
        this.totalCountLabel.string = String(total);
    }

    private _bindEntryClick() {
        const btn = this.node.getComponent(Button) || this.node.addComponent(Button);
        btn.node.off(Button.EventType.CLICK, this._onEntryClick, this);
        btn.node.on(Button.EventType.CLICK, this._onEntryClick, this);
    }

    /** 代码绑定道具键，避免场景事件在面板刚显示时失效 */
    private _bindItemButtons() {
        const toggle = find('Canvas/TogglePet')?.getComponent(TogglePet)
            ?? director.getScene()?.getComponentInChildren(TogglePet)
            ?? null;

        const bind = (path: string, handler: () => void) => {
            const n = find(path);
            if (!n) return;
            const b = n.getComponent(Button) || n.addComponent(Button);
            // 场景里 Button 的 clickEvents（狗/猫 onBtn1Click）无法被 node.off 移除，会连点两次：先扣次数再进广告
            b.clickEvents.length = 0;
            b.node.off(Button.EventType.CLICK);
            b.node.on(Button.EventType.CLICK, handler, this);
        };

        const useAndClose = (fn: (() => void) | undefined) => {
            if (!this._open) return;
            fn?.();
            this._closeItems();
        };
        bind('Canvas/btn/Button1', () => useAndClose(() => toggle?.onBtn1Click()));
        bind('Canvas/btn/Button2', () => useAndClose(() => toggle?.onBtn2Click()));
        bind('Canvas/btn/Button3', () => useAndClose(() => toggle?.onBtn3Click()));
    }

    private _ensureBackdrop() {
        if (this._backdrop?.isValid) return;
        const canvas = find('Canvas');
        if (!canvas) return;

        this._backdrop = new Node('item_backdrop');
        canvas.addChild(this._backdrop);
        const uit = this._backdrop.addComponent(UITransform);
        const vs = view.getVisibleSize();
        uit.setContentSize(vs.width, vs.height);
        const w = this._backdrop.addComponent(Widget);
        w.isAlignTop = w.isAlignBottom = w.isAlignLeft = w.isAlignRight = true;
        w.top = w.bottom = w.left = w.right = 0;

        this._backdropOpacity = this._backdrop.addComponent(UIOpacity);
        this._backdropOpacity.opacity = 255;
        this._backdrop.on(Node.EventType.TOUCH_END, this._onBackdropTap, this);
        this._backdrop.active = false;
    }

    private _onBackdropTap() {
        if (this._open) this._closeItems();
    }

    private _syncOverlayOrder() {
        const canvas = find('Canvas');
        if (!canvas || !this.itemsRoot) return;
        if (this._backdrop?.isValid) {
            this._backdrop.setSiblingIndex(Math.max(0, canvas.children.length - 2));
        }
        this.itemsRoot.setSiblingIndex(canvas.children.length - 1);
    }

    private _showBackdrop() {
        this._ensureBackdrop();
        if (!this._backdrop) return;
        this._syncOverlayOrder();
        this._backdrop.active = true;
    }

    private _hideBackdropImmediate() {
        if (!this._backdrop?.isValid) return;
        Tween.stopAllByTarget(this._backdropOpacity!);
        this._backdrop.active = false;
    }

    private _onEntryClick() {
        if (this._open) this._closeItems();
        else this._openItems();
    }

    private _openItems() {
        SharedBtnCounts.init();
        this._open = true;
        this._refreshTotalLabel();
        SharedBtnCounts.onChangeCallback?.();

        this._showBackdrop();
        if (this.itemsRoot) {
            this._playItemsShow();
        }
        this._playMicHide();
        PetInfoBar.setGlobalVisible(false);
    }

    private _closeItems() {
        if (!this._open) return;
        this._open = false;
        this._hideBackdropImmediate();
        this._playItemsHide();
        this._playMicShow();
        PetInfoBar.setGlobalVisible(true);
        this._refreshTotalLabel();
    }

    private _applyMicVisibleImmediate(visible: boolean) {
        if (!this.micNode) return;
        Tween.stopAllByTarget(this.micNode);
        if (this._micOpacity) Tween.stopAllByTarget(this._micOpacity);
        this.micNode.active = visible;
        this.micNode.setScale(this._micBaseScale);
        if (this._micOpacity) this._micOpacity.opacity = visible ? 255 : 0;
        const micBtn = this.micNode.getComponent(Button);
        if (micBtn) micBtn.interactable = visible;
    }

    private _applyItemsVisibleImmediate(visible: boolean) {
        if (!this.itemsRoot) return;
        Tween.stopAllByTarget(this.itemsRoot);
        if (this._itemsOpacity) Tween.stopAllByTarget(this._itemsOpacity);
        this.itemsRoot.active = visible;
        this.itemsRoot.setPosition(this._itemsBaseX, this._itemsBaseY, 0);
        this.itemsRoot.setScale(this._itemsBaseScale);
        if (this._itemsOpacity) this._itemsOpacity.opacity = visible ? 255 : 0;
    }

    private _playMicHide() {
        if (!this.micNode || !this._micOpacity) return;
        Tween.stopAllByTarget(this.micNode);
        Tween.stopAllByTarget(this._micOpacity);
        const micBtn = this.micNode.getComponent(Button);
        if (micBtn) micBtn.interactable = false;

        const dur = this.switchDuration;
        const shrunk = new Vec3(
            this._micBaseScale.x * 0.88,
            this._micBaseScale.y * 0.88,
            1,
        );
        tween(this.micNode)
            .to(dur, { scale: shrunk }, { easing: 'quadIn' })
            .start();
        tween(this._micOpacity)
            .to(dur, { opacity: 0 }, { easing: 'quadIn' })
            .call(() => {
                if (this.micNode?.isValid) this.micNode.active = false;
            })
            .start();
    }

    private _playMicShow() {
        if (!this.micNode || !this._micOpacity) return;
        Tween.stopAllByTarget(this.micNode);
        Tween.stopAllByTarget(this._micOpacity);
        this.micNode.active = true;
        this.micNode.setScale(
            this._micBaseScale.x * 0.88,
            this._micBaseScale.y * 0.88,
            1,
        );
        this._micOpacity.opacity = 0;
        const micBtn = this.micNode.getComponent(Button);
        if (micBtn) micBtn.interactable = true;

        const dur = this.switchDuration;
        tween(this.micNode)
            .to(dur, { scale: this._micBaseScale.clone() }, { easing: 'backOut' })
            .start();
        tween(this._micOpacity)
            .to(dur, { opacity: 255 }, { easing: 'quadOut' })
            .start();
    }

    private _playItemsShow() {
        if (!this.itemsRoot || !this._itemsOpacity) return;
        Tween.stopAllByTarget(this.itemsRoot);
        Tween.stopAllByTarget(this._itemsOpacity);

        this.itemsRoot.active = true;
        this.itemsRoot.setPosition(this._itemsBaseX, this._itemsBaseY - 36, 0);
        this.itemsRoot.setScale(
            this._itemsBaseScale.x * 0.82,
            this._itemsBaseScale.y * 0.82,
            1,
        );
        this._itemsOpacity.opacity = 0;

        const dur = this.switchDuration;
        tween(this.itemsRoot)
            .to(dur, {
                position: new Vec3(this._itemsBaseX, this._itemsBaseY, 0),
                scale: this._itemsBaseScale.clone(),
            }, { easing: 'backOut' })
            .start();
        tween(this._itemsOpacity)
            .to(dur, { opacity: 255 }, { easing: 'quadOut' })
            .start();
    }

    private _playItemsHide() {
        if (!this.itemsRoot || !this._itemsOpacity) return;
        Tween.stopAllByTarget(this.itemsRoot);
        Tween.stopAllByTarget(this._itemsOpacity);

        const dur = this.switchDuration * 0.85;
        const endY = this._itemsBaseY - 28;
        const endScale = new Vec3(
            this._itemsBaseScale.x * 0.88,
            this._itemsBaseScale.y * 0.88,
            1,
        );
        tween(this.itemsRoot)
            .to(dur, {
                position: new Vec3(this._itemsBaseX, endY, 0),
                scale: endScale,
            }, { easing: 'quadIn' })
            .start();
        tween(this._itemsOpacity)
            .to(dur, { opacity: 0 }, { easing: 'quadIn' })
            .call(() => {
                if (this.itemsRoot?.isValid) this.itemsRoot.active = false;
            })
            .start();
    }
}

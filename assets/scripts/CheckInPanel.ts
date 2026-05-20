import { _decorator, Component, Node, Button, BlockInputEvents, tween, Vec3, UIOpacity, view, find, Label, Color, UITransform } from 'cc';
import { SharedBtnCounts } from './SharedBtnCounts';
import { AudioManager } from './AudioManager';
import { PetValue } from './PetValue';
import { PetInfoBar } from './PetInfoBar';
import { HomePopupMask } from './HomePopupMask';
const { ccclass, property } = _decorator;

/**
 * 挂在 Check-in 节点上：
 * - 每次新打开游戏时显示；
 * - mask 节点（在 Check-in 外）：透明度 0→255；若绑定 popupMask（与 widget_choose 共用的 HomePopupMask），会同步控制遮罩显示以挡住下面点击。
 * - Check-in 从屏幕右侧滑入，带弹性；
 * - 点击 OK 按钮：领取次数、关闭节点。
 */
@ccclass('CheckInPanel')
export class CheckInPanel extends Component {

    @property(Button)
    okButton: Button | null = null;

    @property({ type: Node, tooltip: '遮罩节点（在 Check-in 外），需在 Inspector 绑定' })
    maskNode: Node | null = null;

    @property(HomePopupMask)
    popupMask: HomePopupMask | null = null;

    private _targetPos: Vec3 = new Vec3();

    onLoad() {
        this._targetPos.set(this.node.position);
        SharedBtnCounts.init();
        SharedBtnCounts.onPendingClaimCallback = this._refreshVisibility;
        if (!this.okButton) {
            const btnNode = this.node.getChildByName('Button');
            if (btnNode) this.okButton = btnNode.getComponent(Button);
        }
        if (this.okButton) {
            this.okButton.node.on(Button.EventType.CLICK, this.onOKClick, this);
        }
        this._ensureBlockInput();
        this._refreshVisibility();
    }

    /** 确保遮罩能阻挡下方按钮的点击 */
    private _ensureBlockInput() {
        const target = this.maskNode || this.node;
        if (!target.getComponent(BlockInputEvents)) {
            target.addComponent(BlockInputEvents);
        }
    }

    onDestroy() {
        SharedBtnCounts.onPendingClaimCallback = null;
        if (this.okButton?.node?.isValid) {
            this.okButton.node.off(Button.EventType.CLICK, this.onOKClick, this);
        }
    }

    onEnable() {
        this._refreshVisibility();
    }

    /** 不自动弹出；仅当节点已打开时刷新奖励格 */
    private _refreshVisibility = () => {
        if (!this.node.active) return;
        if (SharedBtnCounts.hasPendingClaim()) {
            this._updateRewardVisibility();
        }
    };

    /** 未连续签到时「今天没领到」的奖励格上显示的文案 */
    private static readonly TOMORROW_LABEL = 'Tomorrow';

    /** 三格都显示：连续签到时全部正常；未连续时中奖格正常，另外两格半透明并显示 "Tomorrow"。 */
    private _updateRewardVisibility() {
        const kind = SharedBtnCounts.getPendingRewardType();
        const container = this.node.getChildByName('Node');
        if (!container) return;
        const slot0 = container.getChildByName('Node1') ?? container.children[0];
        const slot1 = container.getChildByName('Node2') ?? container.children[1];
        const slot2 = container.getChildByName('Node3') ?? container.children[2];
        if (!slot0 || !slot1 || !slot2) return;
        const showAll = kind === 'all';
        const slots = [slot0, slot1, slot2] as Node[];
        for (let i = 0; i < 3; i++) {
            const slot = slots[i];
            slot.active = true;
            const isWon = showAll || kind === i;
            let opacity = slot.getComponent(UIOpacity);
            if (!opacity) opacity = slot.addComponent(UIOpacity);
            opacity.opacity = isWon ? 255 : 128;
            const countLabelNode = this._getSlotCountLabelNode(slot);
            const tomorrowNode = slot.getChildByName(CheckInPanel.TOMORROW_LABEL);
            if (isWon) {
                if (countLabelNode) countLabelNode.active = true;
                if (tomorrowNode) tomorrowNode.active = false;
            } else {
                if (countLabelNode) countLabelNode.active = false;
                const labelNode = this._getOrCreateTomorrowLabel(slot);
                if (labelNode) {
                    labelNode.active = true;
                    const label = labelNode.getComponent(Label);
                    if (label) label.string = CheckInPanel.TOMORROW_LABEL;
                }
            }
        }
    }

    /** 获取奖励格内显示数量的那个 Label 节点（非 Tomorrow），用于有 Tomorrow 时隐藏数量 */
    private _getSlotCountLabelNode(slot: Node): Node | null {
        for (const child of slot.children) {
            if (child.name === CheckInPanel.TOMORROW_LABEL) continue;
            if (child.getComponent(Label)) return child;
        }
        return null;
    }

    private _getOrCreateTomorrowLabel(slot: Node): Node | null {
        let node = slot.getChildByName(CheckInPanel.TOMORROW_LABEL);
        if (node) return node;
        node = new Node(CheckInPanel.TOMORROW_LABEL);
        if (!node.addComponent(UITransform)) return null;
        const label = node.addComponent(Label);
        label.string = CheckInPanel.TOMORROW_LABEL;
        label.fontSize = 24;
        label.color = new Color(255, 255, 255, 200);
        const ut = node.getComponent(UITransform);
        if (ut) {
            ut.setContentSize(120, 40);
        }
        node.setPosition(0, -70, 0);
        slot.addChild(node);
        return node;
    }

    /** 弹出动画：mask 渐显；Check-in 从右侧滑入（弹性） */
    private _playShowAnimation() {
        const offScreenX = this._targetPos.x + Math.max(800, view.getVisibleSize().width);

        if (this.maskNode) {
            let maskOpacity = this.maskNode.getComponent(UIOpacity);
            if (!maskOpacity) maskOpacity = this.maskNode.addComponent(UIOpacity);
            maskOpacity.opacity = 0;
            tween(maskOpacity)
                .to(0.3, { opacity: 255 })
                .start();
        }

        this.node.setPosition(offScreenX, this._targetPos.y, this._targetPos.z);

        AudioManager.playCheckInShowSound();

        tween(this.node)
            .to(0.5, { position: this._targetPos.clone() }, { easing: 'elasticOut' })
            .start();
    }

    /** OK 按钮点击：先领取（连续=三种奖励，未连续=随机一种），数量飞向对应 button，飞抵后关闭 */
    public onOKClick() {
        const granted = SharedBtnCounts.claim();
        if (!granted) return;

        const startNode = this.okButton?.node || this.node;
        const pv = find('Canvas/pet_value')?.getComponent(PetValue);
        const btn1 = find('Canvas/btn/Button1');
        const btn2 = find('Canvas/btn/Button2');
        const btn3 = find('Canvas/btn/Button3');
        const btn1Label = btn1?.getComponentInChildren(Label);
        const btn2Label = btn2?.getComponentInChildren(Label);
        const btn3Label = btn3?.getComponentInChildren(Label);

        const needFly = (granted.btn1 > 0 ? 1 : 0) + (granted.btn2 > 0 ? 1 : 0) + (granted.btn3 > 0 ? 1 : 0);
        const color = new Color(255, 255, 255, 255);
        let arrived = 0;
        const onAllArrived = () => {
            arrived++;
            if (arrived >= needFly) {
                this.node.active = false;
                if (this.popupMask && this.popupMask.isValid) this.popupMask.setCheckInShowing(false);
                else if (this.maskNode) this.maskNode.active = false;
                PetInfoBar.setGlobalVisible(true);
            }
        };

        if (pv && needFly > 0) {
            if (granted.btn1 > 0 && btn1Label) pv.spawnFlyingLabelDirect(startNode, btn1Label, granted.btn1, color, onAllArrived);
            if (granted.btn2 > 0 && btn2Label) pv.spawnFlyingLabelDirect(startNode, btn2Label, granted.btn2, color, onAllArrived);
            if (granted.btn3 > 0 && btn3Label) pv.spawnFlyingLabelDirect(startNode, btn3Label, granted.btn3, color, onAllArrived);
        } else {
            this.node.active = false;
            if (this.popupMask && this.popupMask.isValid) this.popupMask.setCheckInShowing(false);
            else if (this.maskNode) this.maskNode.active = false;
            PetInfoBar.setGlobalVisible(true);
        }
    }
}

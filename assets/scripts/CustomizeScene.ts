import {
    _decorator, Component, director, Node, Label, Color, UITransform, Button,
    Widget, view, BlockInputEvents,
} from 'cc';
import { getCustomizeComingSoonSubtitle, getCustomizeComingSoonTitle } from './TipCopy';
import { isZh } from './Lang';
import { isCustomizeUnlocked, markCustomPetReady, openShop } from './PetUnlock';

const { ccclass } = _decorator;

/**
 * 定制页（customize 场景）：暂为占位「即将开放」。挂在 Canvas 上。
 */
@ccclass('CustomizeScene')
export class CustomizeScene extends Component {

    onLoad() {
        if (!isCustomizeUnlocked()) {
            openShop('customize');
            return;
        }
        markCustomPetReady();
        this._buildUi();
    }

    private _buildUi() {
        const canvas = this.node;
        let root = canvas.getChildByName('customize_root');
        if (!root) {
            root = new Node('customize_root');
            canvas.addChild(root);
        }
        root.removeAllChildren();

        const visible = view.getVisibleSize();
        const rootUIT = root.getComponent(UITransform) || root.addComponent(UITransform);
        rootUIT.setContentSize(visible.width, visible.height);

        const widget = root.getComponent(Widget) || root.addComponent(Widget);
        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        widget.top = widget.bottom = widget.left = widget.right = 0;

        root.addComponent(BlockInputEvents);

        const bg = new Node('bg');
        root.addChild(bg);
        const bgUIT = bg.addComponent(UITransform);
        bgUIT.setContentSize(visible.width, visible.height);
        const bgW = bg.addComponent(Widget);
        bgW.isAlignTop = bgW.isAlignBottom = bgW.isAlignLeft = bgW.isAlignRight = true;
        bgW.top = bgW.bottom = bgW.left = bgW.right = 0;

        const title = new Node('title');
        root.addChild(title);
        const titleUIT = title.addComponent(UITransform);
        titleUIT.setContentSize(visible.width - 80, 120);
        title.setPosition(0, 80, 0);
        const titleLabel = title.addComponent(Label);
        titleLabel.string = getCustomizeComingSoonTitle();
        titleLabel.fontSize = 40;
        titleLabel.lineHeight = 52;
        titleLabel.color = new Color(45, 42, 38, 255);
        titleLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        titleLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
        titleLabel.enableWrapText = true;

        const sub = new Node('subtitle');
        root.addChild(sub);
        const subUIT = sub.addComponent(UITransform);
        subUIT.setContentSize(visible.width - 100, 80);
        sub.setPosition(0, 10, 0);
        const subLabel = sub.addComponent(Label);
        subLabel.string = getCustomizeComingSoonSubtitle();
        subLabel.fontSize = 28;
        subLabel.lineHeight = 38;
        subLabel.color = new Color(110, 105, 98, 255);
        subLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        subLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
        subLabel.enableWrapText = true;

        const back = new Node('btn_back');
        root.addChild(back);
        const backUIT = back.addComponent(UITransform);
        backUIT.setContentSize(200, 72);
        back.setPosition(0, -visible.height * 0.32, 0);
        const backBtn = back.addComponent(Button);
        backBtn.transition = Button.Transition.SCALE;
        backBtn.zoomScale = 1.05;
        const backLabelNode = new Node('Label');
        back.addChild(backLabelNode);
        const backLabelUIT = backLabelNode.addComponent(UITransform);
        backLabelUIT.setContentSize(200, 72);
        const backLabel = backLabelNode.addComponent(Label);
        backLabel.string = isZh() ? '返回' : 'Back';
        backLabel.fontSize = 32;
        backLabel.lineHeight = 40;
        backLabel.color = new Color(80, 120, 200, 255);
        backLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        back.on(Button.EventType.CLICK, this.onBackClick, this);
    }

    public onBackClick() {
        director.loadScene('home', (err) => {
            if (err) console.error('[CustomizeScene] 无法返回 home', err);
        });
    }
}

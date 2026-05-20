import { _decorator, Component, Node } from 'cc';
import { requestPinPetWidgetSmall } from './WidgetSync';
import { HomePopupMask } from './HomePopupMask';

const { ccclass, property } = _decorator;

/**
 * 首页 Widget 入口（已移除大号 Widget，仅保留小号）。
 * widget_btn 建议直接挂 HomeWidgetButton；若仍绑定 showChoose，则直接弹出添加小号 Widget。
 */
@ccclass('WidgetChoosePanel')
export class WidgetChoosePanel extends Component {

    @property(Node)
    panel: Node | null = null;

    @property(HomePopupMask)
    popupMask: HomePopupMask | null = null;

    onLoad() {
        if (this.panel) this.panel.active = false;
    }

    /** 兼容旧场景：点击 widget_btn 时直接添加小号 Widget */
    public showChoose() {
        requestPinPetWidgetSmall();
    }

    public closeChoose() {
        if (this.popupMask?.isValid) this.popupMask.setWidgetChooseShowing(false);
        if (this.panel) this.panel.active = false;
    }

    /** 兼容旧场景 widget_s 点击 */
    public onSelectSmall() {
        requestPinPetWidgetSmall();
        this.closeChoose();
    }

    /** 已废弃：大号 Widget 已移除 */
    public onSelectLarge() {
        requestPinPetWidgetSmall();
        this.closeChoose();
    }
}

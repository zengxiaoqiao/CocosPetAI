import { _decorator, Component, Node } from 'cc';
import { sys } from 'cc';
import { requestPinPetWidgetSmall, requestPinPetWidgetLarge } from './WidgetSync';
import { HomePopupMask } from './HomePopupMask';

const STORAGE_KEY_PET = 'petai_pet_choice';
const { ccclass, property } = _decorator;

/**
 * 首页 Widget 尺寸选择弹窗：
 * - 挂在「包含 widget_btn 和 widget_choose 的父节点」上，并把 widget_choose 拖到 panel 属性。
 * - popupMask 拖到 home 里与 Check-in 共用的那个 mask 上的 HomePopupMask 组件，用于挡住下面点击。
 * - widget_btn 的 Click 事件 -> showChoose
 * - widget_s 的 Click 事件 -> onSelectSmall
 * - widget_l 的 Click 事件 -> onSelectLarge
 */
@ccclass('WidgetChoosePanel')
export class WidgetChoosePanel extends Component {

    @property(Node)
    panel: Node | null = null;

    @property(HomePopupMask)
    popupMask: HomePopupMask | null = null;

    onLoad() {
        if (this.popupMask) {
            this.popupMask.setCloseWidgetChooseCallback(() => this.closeChoose());
        }
        if (this.panel) this.panel.active = false; // 默认隐藏，只有点击 widget_btn 调用 showChoose 后才显示
        this._refreshPetVisibility();
    }

    onDestroy() {
        if (this.popupMask && this.popupMask.isValid) {
            this.popupMask.setCloseWidgetChooseCallback(null);
            this.popupMask.setWidgetChooseShowing(false);
        }
    }

    /** 点击 widget_btn 时调用：显示尺寸选择（widget_choose） */
    public showChoose() {
        this._refreshPetVisibility();
        if (this.popupMask) this.popupMask.setWidgetChooseShowing(true);
        if (this.panel) this.panel.active = true;
    }

    /** 关闭选择面板（点击遮罩或选完尺寸时调用） */
    public closeChoose() {
        if (this.popupMask) this.popupMask.setWidgetChooseShowing(false);
        if (this.panel) this.panel.active = false;
    }

    /** 点击 widget_s 时调用：弹出系统添加小号 Widget 弹窗，并关闭选择面板 */
    public onSelectSmall() {
        requestPinPetWidgetSmall();
        this.closeChoose();
    }

    /** 点击 widget_l 时调用：弹出系统添加大号 Widget 弹窗，并关闭选择面板 */
    public onSelectLarge() {
        requestPinPetWidgetLarge();
        this.closeChoose();
    }

    /** 根据当前宠物（猫/狗）显示或隐藏 widget_choose 下小号/大号里的猫、狗节点 */
    private _refreshPetVisibility() {
        const root = this.panel;
        if (!root || !root.isValid) return;
        const pet = (sys.localStorage.getItem(STORAGE_KEY_PET) || 'dog').toLowerCase();
        const isDog = pet === 'dog';
        const widgetS = root.getChildByName('widget_s');
        const widgetL = root.getChildByName('widget_l');
        if (widgetS) {
            const dogS = widgetS.getChildByName('dog_s');
            const catS = widgetS.getChildByName('cat_s');
            if (dogS) dogS.active = isDog;
            if (catS) catS.active = !isDog;
        }
        if (widgetL) {
            const dogL = widgetL.getChildByName('dog_l');
            const catL = widgetL.getChildByName('cat_l');
            if (dogL) dogL.active = isDog;
            if (catL) catL.active = !isDog;
        }
    }
}

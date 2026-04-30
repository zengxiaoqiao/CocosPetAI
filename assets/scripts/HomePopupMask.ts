import { _decorator, Component, Node, BlockInputEvents } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 首页弹窗遮罩：widget_choose、Check-in 共用同一 mask 节点，避免点击穿透。
 * - 挂在 home 场景的 mask 节点上；CheckInPanel、WidgetChoosePanel 的 popupMask 都指向此组件。
 * - 任一弹窗显示时遮罩激活，都关闭时遮罩隐藏。
 * - Android 真机：仅在遮罩显示时才挂 BlockInputEvents 和触摸监听，避免未显示节点参与触摸导致卡死。
 */
@ccclass('HomePopupMask')
export class HomePopupMask extends Component {

    @property(Node)
    maskNode: Node | null = null;

    private _widgetChooseShowing = false;
    private _checkInShowing = false;

    onLoad() {
        this._updateActive();
    }

    onDestroy() {
        if (this.node.isValid) this._ensureMaskListeners(false);
    }

    private _onMaskTouchEnd() {
        if (this._widgetChooseShowing && this._closeWidgetChoose) {
            this._closeWidgetChoose();
        }
    }

    private _closeWidgetChoose: (() => void) | null = null;
    /** 由 WidgetChoosePanel 注册：点击遮罩时关闭选择面板 */
    public setCloseWidgetChooseCallback(cb: (() => void) | null) {
        this._closeWidgetChoose = cb;
    }

    /** widget_choose 显示/隐藏时调用 */
    public setWidgetChooseShowing(show: boolean) {
        this._widgetChooseShowing = show;
        this._updateActive();
    }

    /** Check-in 显示/隐藏时调用 */
    public setCheckInShowing(show: boolean) {
        this._checkInShowing = show;
        this._updateActive();
    }

    private _updateActive() {
        const target = this.maskNode || this.node;
        const shouldShow = this._widgetChooseShowing || this._checkInShowing;
        target.active = shouldShow;
        this._ensureMaskListeners(shouldShow);
    }

    /** 仅在实际显示时挂 BlockInputEvents 和 TOUCH_END，隐藏时移除监听，避免 Android 触摸链路卡死 */
    private _ensureMaskListeners(active: boolean) {
        const target = this.maskNode || this.node;
        if (!target.isValid) return;
        if (active) {
            if (!target.getComponent(BlockInputEvents)) {
                target.addComponent(BlockInputEvents);
            }
            target.off(Node.EventType.TOUCH_END, this._onMaskTouchEnd, this);
            target.on(Node.EventType.TOUCH_END, this._onMaskTouchEnd, this);
        } else {
            target.off(Node.EventType.TOUCH_END, this._onMaskTouchEnd, this);
        }
    }
}

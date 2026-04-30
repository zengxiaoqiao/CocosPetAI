import { _decorator, Component, native, sys } from 'cc';

const { ccclass } = _decorator;

/**
 * 高级设置脚本：提供一个按钮，一键跳转到系统的“通知访问/通知使用权”设置页，
 * 方便用户为宠物 App 开启系统通知监听权限。
 *
 * 使用方式：
 *  - 在场景里挂一个空节点，绑定本脚本；
 *  - 在按钮的 Click 事件里选择此节点，函数选 onOpenSystemNotificationAccessSettings。
 */
@ccclass('NotificationSettings')
export class NotificationSettings extends Component {

    public onOpenSystemNotificationAccessSettings() {
        if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;
        try {
            const nat = native as any;
            if (nat?.reflection?.callStaticMethod) {
                nat.reflection.callStaticMethod(
                    'com/cocos/game/AppActivity',
                    'openNotificationAccessSettings',
                    '()V',
                );
            }
        } catch (e) {
            console.warn('[NotificationSettings] openNotificationAccessSettings failed', e);
        }
    }

    /** 三个时间档的语音报时开关（整点报时功能已下线，开关目前无实际效果） */

    public onToggleTimeAnnounce8(toggle: any) {
        this._setHourEnabled(11, toggle);
    }

    public onToggleTimeAnnounce12(toggle: any) {
        this._setHourEnabled(12, toggle);
    }

    public onToggleTimeAnnounce18(toggle: any) {
        this._setHourEnabled(23, toggle);
    }

    private _setHourEnabled(hour: number, toggle: any) {
        // 整点报时能力已移除，保留方法只是为了兼容场景上的 Click 绑定，当前不做任何操作。
        void hour;
        void toggle;
        console.log('[NotificationSettings] time announce is disabled in this version');
    }
}


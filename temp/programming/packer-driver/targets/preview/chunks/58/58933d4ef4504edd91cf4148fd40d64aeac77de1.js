System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, native, sys, _dec, _class, _crd, ccclass, NotificationSettings;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      native = _cc.native;
      sys = _cc.sys;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9a5cacooF5FAIcrn9i8XCfd", "NotificationSettings", undefined);

      __checkObsolete__(['_decorator', 'Component', 'native', 'sys']);

      ({
        ccclass
      } = _decorator);
      /**
       * 高级设置脚本：提供一个按钮，一键跳转到系统的“通知访问/通知使用权”设置页，
       * 方便用户为宠物 App 开启系统通知监听权限。
       *
       * 使用方式：
       *  - 在场景里挂一个空节点，绑定本脚本；
       *  - 在按钮的 Click 事件里选择此节点，函数选 onOpenSystemNotificationAccessSettings。
       */

      _export("NotificationSettings", NotificationSettings = (_dec = ccclass('NotificationSettings'), _dec(_class = class NotificationSettings extends Component {
        onOpenSystemNotificationAccessSettings() {
          if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;

          try {
            var _nat$reflection;

            var nat = native;

            if (nat != null && (_nat$reflection = nat.reflection) != null && _nat$reflection.callStaticMethod) {
              nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'openNotificationAccessSettings', '()V');
            }
          } catch (e) {
            console.warn('[NotificationSettings] openNotificationAccessSettings failed', e);
          }
        }
        /** 三个时间档的语音报时开关（整点报时功能已下线，开关目前无实际效果） */


        onToggleTimeAnnounce8(toggle) {
          this._setHourEnabled(11, toggle);
        }

        onToggleTimeAnnounce12(toggle) {
          this._setHourEnabled(12, toggle);
        }

        onToggleTimeAnnounce18(toggle) {
          this._setHourEnabled(23, toggle);
        }

        _setHourEnabled(hour, toggle) {
          // 整点报时能力已移除，保留方法只是为了兼容场景上的 Click 绑定，当前不做任何操作。
          void hour;
          void toggle;
          console.log('[NotificationSettings] time announce is disabled in this version');
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=58933d4ef4504edd91cf4148fd40d64aeac77de1.js.map
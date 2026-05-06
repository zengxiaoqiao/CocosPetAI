System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, isZh, _crd, LEGAL_PRIVACY_URL, LEGAL_TERMS_URL;

  function getSettingsVersionPrefix() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '版本 ' : 'Version ';
  }
  /**
   * list-notification：说明开启通知读取后，任意 App 来通知时宠物会发声。
   */


  function getSettingsListNotification() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '来通知时宠物会叫' : 'Sound on any app notification';
  }

  function getSettingsListPrivacy() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '隐私政策' : 'Privacy Policy';
  }

  function getSettingsListTerms() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '用户协议' : 'Terms of Service';
  }

  function _reportPossibleCrUseOfisZh(extras) {
    _reporterNs.report("isZh", "./Lang", _context.meta, extras);
  }

  _export({
    getSettingsVersionPrefix: getSettingsVersionPrefix,
    getSettingsListNotification: getSettingsListNotification,
    getSettingsListPrivacy: getSettingsListPrivacy,
    getSettingsListTerms: getSettingsListTerms
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      isZh = _unresolved_2.isZh;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2f6a1yQXC1LjqHQEjRWeJq8", "SettingsCopy", undefined);
      /**
       * 设置页文案（与 Lang.isZh() 一致）。
       */


      /** 隐私政策 Web 页 */
      _export("LEGAL_PRIVACY_URL", LEGAL_PRIVACY_URL = 'https://umestudio.net/pet/privacy.html');
      /** 用户协议 Web 页 */


      _export("LEGAL_TERMS_URL", LEGAL_TERMS_URL = 'https://umestudio.net/pet/terms.html');

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=da580ce00aa44bf581f868c0e079bfe4f9650da4.js.map
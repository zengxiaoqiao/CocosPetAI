System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, native, sys, _crd;

  /** 原生包版本名（如 1.0.0）；非原生或失败返回空串。 */
  function getNativeAppVersionName() {
    if (!sys.isNative) return '';

    try {
      var _nat$reflection;

      const nat = native;
      if (!(nat != null && (_nat$reflection = nat.reflection) != null && _nat$reflection.callStaticMethod)) return '';

      if (sys.platform === sys.Platform.ANDROID) {
        return (nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'getAppVersionName', '()Ljava/lang/String;') || '').toString();
      }

      if (sys.platform === sys.Platform.IOS) {
        return (nat.reflection.callStaticMethod('PetNativeASR', 'getAppVersionName') || '').toString();
      }
    } catch {// ignore
    }

    return '';
  }

  _export("getNativeAppVersionName", getNativeAppVersionName);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      native = _cc.native;
      sys = _cc.sys;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3f7b22hbT5cn7LhI0VniavN", "AppVersion", undefined);

      __checkObsolete__(['native', 'sys']);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d971a784017e8e956a4a41a275553e10a7b99fd4.js.map
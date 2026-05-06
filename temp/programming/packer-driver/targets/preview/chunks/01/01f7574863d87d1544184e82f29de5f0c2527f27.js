System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, native, sys, getNativeAppVersionName, _crd, STORAGE_CHANNEL, STORAGE_FALLBACK_UID, DEFAULT_CHANNEL, DEFAULT_PKG;

  function callAndroidConfigString(method, signature) {
    if (!sys.isNative || sys.platform !== sys.Platform.ANDROID) return '';

    try {
      var _nat$reflection;

      var nat = native;
      if (!(nat != null && (_nat$reflection = nat.reflection) != null && _nat$reflection.callStaticMethod)) return '';
      var v = nat.reflection.callStaticMethod('com/cocos/game/AppActivity', method, signature);
      return v != null ? String(v) : '';
    } catch (_unused) {
      return '';
    }
  }

  function getOrCreateFallbackUid() {
    try {
      var u = sys.localStorage.getItem(STORAGE_FALLBACK_UID);
      if (u && u.length > 0) return u;
      u = "anon_" + Date.now() + "_" + Math.random().toString(36).slice(2, 12);
      sys.localStorage.setItem(STORAGE_FALLBACK_UID, u);
      return u;
    } catch (_unused2) {
      return "anon_" + Date.now();
    }
  }

  function resolveUid() {
    var androidId = callAndroidConfigString('getConfigUid', '()Ljava/lang/String;');
    if (androidId) return androidId;
    return getOrCreateFallbackUid();
  }

  function resolvePkg() {
    var p = callAndroidConfigString('getAppPackageName', '()Ljava/lang/String;');
    if (p) return p;
    return DEFAULT_PKG;
  }

  function resolveDevice() {
    var m = callAndroidConfigString('getDeviceManufacturerLower', '()Ljava/lang/String;');
    if (m) return m;

    try {
      var os = (sys.os || '').toString().toLowerCase();
      if (os) return os;
    } catch (_unused3) {// ignore
    }

    return 'unknown';
  }

  function resolvePlatform() {
    if (sys.platform === sys.Platform.ANDROID) return '1';
    if (sys.platform === sys.Platform.IOS) return '2';
    return '0';
  }

  function resolveVersionCode() {
    var code = callAndroidConfigString('getAppVersionCodeString', '()Ljava/lang/String;');
    if (code) return code;
    return '0';
  }

  function resolveChannel() {
    try {
      var fromStorage = sys.localStorage.getItem(STORAGE_CHANNEL);
      if (fromStorage && fromStorage.trim()) return fromStorage.trim();
    } catch (_unused4) {// ignore
    }

    var fromManifest = callAndroidConfigString('getDistributionChannel', '()Ljava/lang/String;');
    if (fromManifest && fromManifest.trim()) return fromManifest.trim();
    return DEFAULT_CHANNEL;
  }
  /**
   * 构建远程配置接口请求体（字段与后台约定一致，均可本地覆盖/自动采集）。
   */


  function buildLlmConfigRequestBody() {
    var channel = resolveChannel();
    var versionName = (_crd && getNativeAppVersionName === void 0 ? (_reportPossibleCrUseOfgetNativeAppVersionName({
      error: Error()
    }), getNativeAppVersionName) : getNativeAppVersionName)() || '0.0.0';
    return {
      channel,
      versionName,
      versionCode: resolveVersionCode(),
      uid: resolveUid(),
      pkg: resolvePkg(),
      device: resolveDevice(),
      platform: resolvePlatform()
    };
  }

  function _reportPossibleCrUseOfgetNativeAppVersionName(extras) {
    _reporterNs.report("getNativeAppVersionName", "../AppVersion", _context.meta, extras);
  }

  _export("buildLlmConfigRequestBody", buildLlmConfigRequestBody);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      native = _cc.native;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      getNativeAppVersionName = _unresolved_2.getNativeAppVersionName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f8a3bLBTV5vcKi5DB0uP0pb", "LlmConfigParams", undefined);

      __checkObsolete__(['native', 'sys']);

      /**
       * 渠道优先级：
       * 1) localStorage `petai_llm_channel`（联调/灰度临时覆盖）
       * 2) Android manifest meta-data `PETAI_DISTRIBUTION_CHANNEL`（由 Gradle `PROP_APP_CHANNEL` 注入）
       * 3) 兜底 DEFAULT_CHANNEL（非 Android 或 meta 未配置时）
       */
      STORAGE_CHANNEL = 'petai_llm_channel';
      STORAGE_FALLBACK_UID = 'petai_llm_config_uid_fallback';
      DEFAULT_CHANNEL = 'GP_PET';
      DEFAULT_PKG = 'com.ume.petai';

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=01f7574863d87d1544184e82f29de5f0c2527f27.js.map
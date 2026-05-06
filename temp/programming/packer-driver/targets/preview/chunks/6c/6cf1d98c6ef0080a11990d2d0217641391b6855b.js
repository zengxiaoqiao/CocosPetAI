System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Button, director, Label, sys, getNativeAppVersionName, LEGAL_PRIVACY_URL, LEGAL_TERMS_URL, getSettingsListNotification, getSettingsListPrivacy, getSettingsListTerms, getSettingsVersionPrefix, _crd, SETTINGS_LEGAL_BOUND;

  function bindLegalUrlRow(row, url) {
    if (!row || row[SETTINGS_LEGAL_BOUND]) return;
    var btn = row.getComponent(Button);
    if (!btn) return;
    row[SETTINGS_LEGAL_BOUND] = true;
    btn.node.on(Button.EventType.CLICK, () => {
      sys.openURL(url);
    });
  }
  /**
   * 设置场景加载后调用：版本号追加到 version 节点；三条列表多语言。
   */


  function applySettingsSceneLocale() {
    var scene = director.getScene();
    if (!scene || scene.name !== 'settings') return;
    var canvas = scene.getChildByName('Canvas');
    if (!canvas) return;
    var verNode = canvas.getChildByName('version');
    var verLabel = verNode == null ? void 0 : verNode.getComponent(Label);

    if (verLabel) {
      var v = (_crd && getNativeAppVersionName === void 0 ? (_reportPossibleCrUseOfgetNativeAppVersionName({
        error: Error()
      }), getNativeAppVersionName) : getNativeAppVersionName)().trim();
      verLabel.string = (_crd && getSettingsVersionPrefix === void 0 ? (_reportPossibleCrUseOfgetSettingsVersionPrefix({
        error: Error()
      }), getSettingsVersionPrefix) : getSettingsVersionPrefix)() + (v || '—');
    }

    var setRow = (rowName, text) => {
      var row = canvas.getChildByName(rowName);
      if (!row) return;
      var labNode = row.getChildByName('Label');
      var lab = labNode == null ? void 0 : labNode.getComponent(Label);
      if (lab) lab.string = text;
    };

    setRow('list-notification', (_crd && getSettingsListNotification === void 0 ? (_reportPossibleCrUseOfgetSettingsListNotification({
      error: Error()
    }), getSettingsListNotification) : getSettingsListNotification)());
    setRow('list-privacy', (_crd && getSettingsListPrivacy === void 0 ? (_reportPossibleCrUseOfgetSettingsListPrivacy({
      error: Error()
    }), getSettingsListPrivacy) : getSettingsListPrivacy)());
    setRow('list-terms', (_crd && getSettingsListTerms === void 0 ? (_reportPossibleCrUseOfgetSettingsListTerms({
      error: Error()
    }), getSettingsListTerms) : getSettingsListTerms)());
    bindLegalUrlRow(canvas.getChildByName('list-privacy'), _crd && LEGAL_PRIVACY_URL === void 0 ? (_reportPossibleCrUseOfLEGAL_PRIVACY_URL({
      error: Error()
    }), LEGAL_PRIVACY_URL) : LEGAL_PRIVACY_URL);
    bindLegalUrlRow(canvas.getChildByName('list-terms'), _crd && LEGAL_TERMS_URL === void 0 ? (_reportPossibleCrUseOfLEGAL_TERMS_URL({
      error: Error()
    }), LEGAL_TERMS_URL) : LEGAL_TERMS_URL);
  }

  function _reportPossibleCrUseOfgetNativeAppVersionName(extras) {
    _reporterNs.report("getNativeAppVersionName", "./AppVersion", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLEGAL_PRIVACY_URL(extras) {
    _reporterNs.report("LEGAL_PRIVACY_URL", "./SettingsCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLEGAL_TERMS_URL(extras) {
    _reporterNs.report("LEGAL_TERMS_URL", "./SettingsCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetSettingsListNotification(extras) {
    _reporterNs.report("getSettingsListNotification", "./SettingsCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetSettingsListPrivacy(extras) {
    _reporterNs.report("getSettingsListPrivacy", "./SettingsCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetSettingsListTerms(extras) {
    _reporterNs.report("getSettingsListTerms", "./SettingsCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetSettingsVersionPrefix(extras) {
    _reporterNs.report("getSettingsVersionPrefix", "./SettingsCopy", _context.meta, extras);
  }

  _export("applySettingsSceneLocale", applySettingsSceneLocale);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Button = _cc.Button;
      director = _cc.director;
      Label = _cc.Label;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      getNativeAppVersionName = _unresolved_2.getNativeAppVersionName;
    }, function (_unresolved_3) {
      LEGAL_PRIVACY_URL = _unresolved_3.LEGAL_PRIVACY_URL;
      LEGAL_TERMS_URL = _unresolved_3.LEGAL_TERMS_URL;
      getSettingsListNotification = _unresolved_3.getSettingsListNotification;
      getSettingsListPrivacy = _unresolved_3.getSettingsListPrivacy;
      getSettingsListTerms = _unresolved_3.getSettingsListTerms;
      getSettingsVersionPrefix = _unresolved_3.getSettingsVersionPrefix;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4f8c36yfk9toMPyNFZ4mrze", "SettingsLocale", undefined);

      __checkObsolete__(['Button', 'director', 'Label', 'Node', 'sys']);

      SETTINGS_LEGAL_BOUND = '_settingsLegalUrlBound';

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6cf1d98c6ef0080a11990d2d0217641391b6855b.js.map
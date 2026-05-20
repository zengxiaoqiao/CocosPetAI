System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, _crd, _lang;

  /**
   * 语言跟随系统语言：
   * - 若系统语言以 zh 开头，则使用中文；
   * - 否则使用英文。
   * 不做本地覆盖存储，切换系统语言后下次启动游戏即可自动生效。
   */
  function detectLang() {
    try {
      const code = (sys.languageCode || sys.language || 'zh').toString().toLowerCase();
      if (code.startsWith('zh')) return 'zh';
    } catch {// ignore
    }

    return 'en';
  }

  function getLang() {
    if (!_lang) {
      _lang = detectLang();
    }

    return _lang;
  }

  function isZh() {
    return getLang() === 'zh';
  }

  _export({
    getLang: getLang,
    isZh: isZh
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "135c4mASwtK95OKmbum0LgX", "Lang", undefined);

      __checkObsolete__(['sys']);

      _lang = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5dc8b73a332ccd39d270accff53b68a3d897f009.js.map
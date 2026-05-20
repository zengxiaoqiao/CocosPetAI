System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, LLM_HTTP_TIMEOUT_MS;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a3c4dXmcIGSo7TF1uf4CRor", "HttpTimeouts", undefined);

      /**
       * 原生上 XMLHttpRequest 会映射到引擎 HttpRequest → Android HttpURLConnection；
       * 须显式设置 xhr.timeout，否则底层默认约 10s，会与业务层 Promise.race 不一致。
       */
      _export("LLM_HTTP_TIMEOUT_MS", LLM_HTTP_TIMEOUT_MS = 60000);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a87a0c0b83e32fb6e1f2cfc6ec93cc4001c5f16f.js.map
System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, MotionTipService;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9db9aTWkdxLbahsElcW9Fsk", "MotionTipService", undefined);

      /**
       * 运动提示服务（TS 侧已停用）：
       * - Android 真机上改为原生侧直接在 Widget 中显示运动提示，不再经过 JS。
       * - Web/H5 也不再需要运动提示，避免调试时频繁弹文案。
       *
       * 因此这里保留空实现，只为兼容既有调用，始终返回空。
       */
      _export("MotionTipService", MotionTipService = {
        /** 空实现：不再在 TS 侧监听运动。 */
        startListening(callback) {
          void callback;
        },

        /** 永远返回空字符串：运动提示仅在 Android Widget 原生侧展示。 */
        getMotionTip() {
          return '';
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=32d1ed3c37b94c41193c09dd90d394ef458ec28f.js.map
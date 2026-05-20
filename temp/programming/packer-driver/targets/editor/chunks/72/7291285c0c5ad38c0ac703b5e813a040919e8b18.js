System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, SwipeState;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "66491+++KhE8510doOWzXUV", "SwipeState", undefined);

      /**
       * 滑动状态：PetButtons 触发滑动动画时置 true，
       * PetControllerBase.onBtn0Click 检查后跳过本次点击，避免滑动误触点击。
       */
      _export("SwipeState", SwipeState = {
        ignoreNextBtn0Click: false
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7291285c0c5ad38c0ac703b5e813a040919e8b18.js.map
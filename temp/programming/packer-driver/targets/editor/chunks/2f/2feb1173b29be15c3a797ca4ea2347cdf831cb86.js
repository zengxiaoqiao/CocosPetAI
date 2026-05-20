System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, requestPinPetWidget, _dec, _class, _crd, ccclass, HomeWidgetButton;

  function _reportPossibleCrUseOfrequestPinPetWidget(extras) {
    _reporterNs.report("requestPinPetWidget", "./WidgetSync", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      requestPinPetWidget = _unresolved_2.requestPinPetWidget;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "93849MsM7pFB72d7ZsrooGN", "HomeWidgetButton", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass
      } = _decorator);
      /**
       * 首页「Widget」按钮点击脚本：
       * - 挂在 home 场景里的那个 widget 按钮节点上
       * - 按钮的 Click 事件指向 onClickWidgetButton
       */

      _export("HomeWidgetButton", HomeWidgetButton = (_dec = ccclass('HomeWidgetButton'), _dec(_class = class HomeWidgetButton extends Component {
        onClickWidgetButton() {
          (_crd && requestPinPetWidget === void 0 ? (_reportPossibleCrUseOfrequestPinPetWidget({
            error: Error()
          }), requestPinPetWidget) : requestPinPetWidget)();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2feb1173b29be15c3a797ca4ea2347cdf831cb86.js.map
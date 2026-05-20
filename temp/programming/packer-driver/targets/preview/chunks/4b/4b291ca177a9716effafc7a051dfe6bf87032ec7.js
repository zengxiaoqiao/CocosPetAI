System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, _closeCarePanel;

  function registerCarePanelClose(handler) {
    _closeCarePanel = handler;
  }

  function requestCarePanelClose() {
    _closeCarePanel == null || _closeCarePanel();
  }

  _export({
    registerCarePanelClose: registerCarePanelClose,
    requestCarePanelClose: requestCarePanelClose
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d5e6feomwxNHi86S1xtfo+a", "CarePanelBridge", undefined);

      /** 打破 CarePanel 与 CheckInPanel 的循环引用 */
      _closeCarePanel = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4b291ca177a9716effafc7a051dfe6bf87032ec7.js.map
System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Button, find, SharedBtnCounts, PetInfoBar, getCheckinAlreadyClaimedTip, _dec, _class, _crd, AdButton;

  function _reportPossibleCrUseOfSharedBtnCounts(extras) {
    _reporterNs.report("SharedBtnCounts", "./SharedBtnCounts", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetInfoBar(extras) {
    _reporterNs.report("PetInfoBar", "./PetInfoBar", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetCheckinAlreadyClaimedTip(extras) {
    _reporterNs.report("getCheckinAlreadyClaimedTip", "./TipCopy", _context.meta, extras);
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
      Button = _cc.Button;
      find = _cc.find;
    }, function (_unresolved_2) {
      SharedBtnCounts = _unresolved_2.SharedBtnCounts;
    }, function (_unresolved_3) {
      PetInfoBar = _unresolved_3.PetInfoBar;
    }, function (_unresolved_4) {
      getCheckinAlreadyClaimedTip = _unresolved_4.getCheckinAlreadyClaimedTip;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4a7d9a3J75Djomh53QbBXtF", "AdButton", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Button', 'find']);

      /**
       * 挂在主场景的 ad 节点上：点击后弹出 Check-in；当日已领取过则提示「今天已经领过了」。
       */
      _export("AdButton", AdButton = (_dec = _decorator.ccclass('AdButton'), _dec(_class = class AdButton extends Component {
        onLoad() {
          var btn = this.node.getComponent(Button) || this.node.addComponent(Button);
          btn.node.on(Button.EventType.CLICK, this._onClick, this);
        }

        onDestroy() {
          var _btn$node;

          var btn = this.node.getComponent(Button);

          if (btn != null && (_btn$node = btn.node) != null && _btn$node.isValid) {
            btn.node.off(Button.EventType.CLICK, this._onClick, this);
          }
        }

        _onClick() {
          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).init();
          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).ensurePendingClaimWhenUserOpensCheckIn();

          if (!(_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).hasPendingClaim()) {
            var _instance;

            (_instance = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
              error: Error()
            }), PetInfoBar) : PetInfoBar).instance) == null || _instance.showPerMinuteLimitHint((_crd && getCheckinAlreadyClaimedTip === void 0 ? (_reportPossibleCrUseOfgetCheckinAlreadyClaimedTip({
              error: Error()
            }), getCheckinAlreadyClaimedTip) : getCheckinAlreadyClaimedTip)());
            return;
          }

          var checkInNode = find('Canvas/Check-in');
          if (checkInNode) checkInNode.active = true;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=18213386d44af8b7c12d80d096ae853ff03921f9.js.map
System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, director, sys, find, SharedBtnCounts, RandomPlayPetAni, _dec, _class, _crd, BtnAdGuard;

  function _reportPossibleCrUseOfSharedBtnCounts(extras) {
    _reporterNs.report("SharedBtnCounts", "./SharedBtnCounts", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRandomPlayPetAni(extras) {
    _reporterNs.report("RandomPlayPetAni", "./RandomPlayPetAni", _context.meta, extras);
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
      Node = _cc.Node;
      director = _cc.director;
      sys = _cc.sys;
      find = _cc.find;
    }, function (_unresolved_2) {
      SharedBtnCounts = _unresolved_2.SharedBtnCounts;
    }, function (_unresolved_3) {
      RandomPlayPetAni = _unresolved_3.RandomPlayPetAni;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "83286op8ohBHoLpb1pORfCM", "BtnAdGuard", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'director', 'sys', 'find']);

      /**
       * Button1/2/3 数量为 0 时点击仍能跳转 AD 场景。
       */
      _export("BtnAdGuard", BtnAdGuard = (_dec = _decorator.ccclass('BtnAdGuard'), _dec(_class = class BtnAdGuard extends Component {
        constructor() {
          super(...arguments);
          this._handlers = [];
          this._dogNode = null;
          this._catNode = null;
          this._isLoadingAd = false;
        }

        onLoad() {
          this._dogNode = find('Canvas/dog');
          this._catNode = find('Canvas/cat');
          var btn1 = find('Canvas/btn/Button1');
          var btn2 = find('Canvas/btn/Button2');
          var btn3 = find('Canvas/btn/Button3');
          [btn1, btn2, btn3].forEach((node, index) => {
            if (!node) return;
            var idx = index + 1;

            var cb = () => this._tryGotoAd(idx);

            node.on(Node.EventType.TOUCH_END, cb, this, true);

            this._handlers.push({
              node,
              idx,
              cb
            });
          });
        }

        onDestroy() {
          for (var {
            node,
            cb
          } of this._handlers) {
            if (!(node != null && node.isValid)) continue;
            node.off(Node.EventType.TOUCH_END, cb, this);
          }

          this._handlers = [];
        }

        _tryGotoAd(buttonIndex) {
          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).init();
          var count = buttonIndex === 1 ? (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn1 : buttonIndex === 2 ? (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn2 : (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn3;
          if (count >= 1) return;
          var rechargePanel = find('Canvas/recharge_panel');
          if (rechargePanel != null && rechargePanel.active) return;
          if (this._isLoadingAd) return;
          this._isLoadingAd = true;

          try {
            var _this$_dogNode, _this$_catNode;

            var pet = (_this$_dogNode = this._dogNode) != null && _this$_dogNode.active ? 'dog' : (_this$_catNode = this._catNode) != null && _this$_catNode.active ? 'cat' : 'dog';
            sys.localStorage.setItem('recharge_pet', pet);
            sys.localStorage.setItem('recharge_button', String(buttonIndex));
          } catch (e) {
            console.warn('[BtnAdGuard] 写入本地存储失败：', e);
          }

          (_crd && RandomPlayPetAni === void 0 ? (_reportPossibleCrUseOfRandomPlayPetAni({
            error: Error()
          }), RandomPlayPetAni) : RandomPlayPetAni).returnedFromAd = true;
          this.scheduleOnce(() => {
            if (!this.isValid) {
              this._isLoadingAd = false;
              return;
            }

            director.loadScene('ad', err => {
              this._isLoadingAd = false;
              if (err) console.error('[BtnAdGuard] 无法加载 ad 场景', err);
            });
          }, 0);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c05d890a99ce583c1cd448cfe9ae1765fee18e17.js.map
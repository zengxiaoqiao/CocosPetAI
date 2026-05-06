System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, director, sys, SharedBtnCounts, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, RechargePanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfSharedBtnCounts(extras) {
    _reporterNs.report("SharedBtnCounts", "./SharedBtnCounts", _context.meta, extras);
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
    }, function (_unresolved_2) {
      SharedBtnCounts = _unresolved_2.SharedBtnCounts;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ef6520tKONN6I84DSq2kVss", "RechargePanel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'director', 'sys']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 挂在广告（充值）界面节点上：关闭按钮若干秒后出现；点击关闭后根据记录的按钮编号 +1，然后切回 home。
       */

      _export("RechargePanel", RechargePanel = (_dec = ccclass('RechargePanel'), _dec2 = property(Node), _dec3 = property({
        tooltip: '关闭按钮在界面出现后多少秒显示'
      }), _dec(_class = (_class2 = class RechargePanel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "closeButton", _descriptor, this);

          _initializerDefineProperty(this, "closeButtonDelaySeconds", _descriptor2, this);
        }

        onEnable() {
          if (this.closeButton) this.closeButton.active = false;
          this.scheduleOnce(this._showCloseButton, this.closeButtonDelaySeconds);
        }

        onDisable() {
          this.unschedule(this._showCloseButton);
        }

        _showCloseButton() {
          if (this.closeButton) this.closeButton.active = true;
        }
        /** 关闭按钮点击时调用（在编辑器中把按钮的 Click Events 绑到此方法） */


        onCloseButtonClick() {
          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).init();
          const pet = sys.localStorage.getItem('recharge_pet');
          const btnStr = sys.localStorage.getItem('recharge_button');

          if (pet && btnStr) {
            const btn = parseInt(btnStr);

            if (btn === 1 || btn === 2 || btn === 3) {
              const key = `ad_reward_${pet}_btn${btn}`;
              const old = parseInt(sys.localStorage.getItem(key) || '0');
              sys.localStorage.setItem(key, String(old + 1));

              this._addCountAndClose(btn);
            } else {
              this._closeAndReturnHome();
            }
          } else {
            this._closeAndReturnHome();
          }
        }

        _addCountAndClose(buttonIndex) {
          if (buttonIndex === 1) (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn1++;else if (buttonIndex === 2) (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn2++;else (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn3++;
          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).save();

          this._closeAndReturnHome();
        }

        _closeAndReturnHome() {
          sys.localStorage.removeItem('recharge_pet');
          sys.localStorage.removeItem('recharge_button');
          director.loadScene('home', err => {
            if (err) console.error('[RechargePanel] 无法加载 home 场景', err);
          });
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "closeButton", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "closeButtonDelaySeconds", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2c03d5501b64dba56e51a34eafd781b4bec37483.js.map
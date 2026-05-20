System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, DogController, CatController, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, PetButtons;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDogController(extras) {
    _reporterNs.report("DogController", "./DogController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCatController(extras) {
    _reporterNs.report("CatController", "./CatController", _context.meta, extras);
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
    }, function (_unresolved_2) {
      DogController = _unresolved_2.DogController;
    }, function (_unresolved_3) {
      CatController = _unresolved_3.CatController;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ede32vRgLxIXpc6KHJpB3hE", "PetButtons", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'director', 'find']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 同一组按钮控制狗/猫：根据当前显示的是谁，把 btn1～btn3 转发给 DogController 或 CatController。
       * 点摸/滑动抚摸已移除；语音请长按宠物或使用麦克风按钮。
       */

      _export("PetButtons", PetButtons = (_dec = ccclass('PetButtons'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class PetButtons extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "dogNode", _descriptor, this);

          _initializerDefineProperty(this, "catNode", _descriptor2, this);

          /** 充值界面节点：当其 active 时，不把 btn1/2/3 点击转发给狗/猫，避免误触 */
          _initializerDefineProperty(this, "rechargePanel", _descriptor3, this);
        }

        _isDogActive() {
          return !!this.dogNode && this.dogNode.active;
        }

        _getDogController() {
          return this.dogNode ? this.dogNode.getComponent(_crd && DogController === void 0 ? (_reportPossibleCrUseOfDogController({
            error: Error()
          }), DogController) : DogController) : null;
        }

        _getCatController() {
          return this.catNode ? this.catNode.getComponent(_crd && CatController === void 0 ? (_reportPossibleCrUseOfCatController({
            error: Error()
          }), CatController) : CatController) : null;
        }
        /** 场景若仍绑定 Button0：仅睡觉时可点醒 */


        onBtn0Click() {
          if (this._isDogActive()) {
            var _this$_getDogControll;

            (_this$_getDogControll = this._getDogController()) == null || _this$_getDogControll.onBtn0Click();
          } else {
            var _this$_getCatControll;

            (_this$_getCatControll = this._getCatController()) == null || _this$_getCatControll.onBtn0Click();
          }
        }

        onBtn1Click() {
          if (this.rechargePanel && this.rechargePanel.active) return;

          if (this._isDogActive()) {
            var _this$_getDogControll2;

            (_this$_getDogControll2 = this._getDogController()) == null || _this$_getDogControll2.onBtn1Click();
          } else {
            var _this$_getCatControll2;

            (_this$_getCatControll2 = this._getCatController()) == null || _this$_getCatControll2.onBtn1Click();
          }
        }

        onBtn2Click() {
          if (this.rechargePanel && this.rechargePanel.active) return;

          if (this._isDogActive()) {
            var _this$_getDogControll3;

            (_this$_getDogControll3 = this._getDogController()) == null || _this$_getDogControll3.onBtn2Click();
          } else {
            var _this$_getCatControll3;

            (_this$_getCatControll3 = this._getCatController()) == null || _this$_getCatControll3.onBtn2Click();
          }
        }

        onBtn3Click() {
          if (this.rechargePanel && this.rechargePanel.active) return;

          if (this._isDogActive()) {
            var _this$_getDogControll4;

            (_this$_getDogControll4 = this._getDogController()) == null || _this$_getDogControll4.onBtn3Click();
          } else {
            var _this$_getCatControll4;

            (_this$_getCatControll4 = this._getCatController()) == null || _this$_getCatControll4.onBtn3Click();
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dogNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "catNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "rechargePanel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=947b24776972b37ec757e346c8c57bf9fb02e355.js.map
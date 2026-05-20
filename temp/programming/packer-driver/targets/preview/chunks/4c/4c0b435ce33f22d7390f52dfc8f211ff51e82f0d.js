System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Node, Label, PetControllerBase, PetValue, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _crd, ccclass, property, CatController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPetControllerBase(extras) {
    _reporterNs.report("PetControllerBase", "./PetControllerBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetValue(extras) {
    _reporterNs.report("PetValue", "./PetValue", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Animation = _cc.Animation;
      Node = _cc.Node;
      Label = _cc.Label;
    }, function (_unresolved_2) {
      PetControllerBase = _unresolved_2.PetControllerBase;
    }, function (_unresolved_3) {
      PetValue = _unresolved_3.PetValue;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ea96fx5gX5MG4Cy0Zgrp2xn", "CatController", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'Node', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CatController", CatController = (_dec = ccclass('CatController'), _dec2 = property(Animation), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
        error: Error()
      }), PetValue) : PetValue), _dec7 = property(Label), _dec8 = property(Label), _dec9 = property(Label), _dec(_class = (_class2 = class CatController extends (_crd && PetControllerBase === void 0 ? (_reportPossibleCrUseOfPetControllerBase({
        error: Error()
      }), PetControllerBase) : PetControllerBase) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "anim", _descriptor, this);

          _initializerDefineProperty(this, "scrollViewForSwipe", _descriptor2, this);

          _initializerDefineProperty(this, "swipeAreaNode", _descriptor3, this);

          _initializerDefineProperty(this, "swipeThreshold", _descriptor4, this);

          _initializerDefineProperty(this, "rechargePanel", _descriptor5, this);

          _initializerDefineProperty(this, "petValue", _descriptor6, this);

          _initializerDefineProperty(this, "btn1Label", _descriptor7, this);

          _initializerDefineProperty(this, "btn2Label", _descriptor8, this);

          _initializerDefineProperty(this, "btn3Label", _descriptor9, this);
        }

        get prefix() {
          return 'cat';
        }

        /** 兼容旧调用 */
        playCat12Sequence() {
          this.playSwipe12Sequence();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "anim", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "scrollViewForSwipe", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "swipeAreaNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "swipeThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 50;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "rechargePanel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "petValue", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "btn1Label", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "btn2Label", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "btn3Label", [_dec9], {
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
//# sourceMappingURL=4c0b435ce33f22d7390f52dfc8f211ff51e82f0d.js.map
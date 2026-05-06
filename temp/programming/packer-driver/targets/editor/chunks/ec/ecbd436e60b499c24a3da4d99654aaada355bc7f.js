System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, SpriteFrame, sys, Sprite, DogController, CatController, syncWidgetFromStorage, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, STORAGE_KEY, TogglePet;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDogController(extras) {
    _reporterNs.report("DogController", "./DogController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCatController(extras) {
    _reporterNs.report("CatController", "./CatController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsyncWidgetFromStorage(extras) {
    _reporterNs.report("syncWidgetFromStorage", "./WidgetSync", _context.meta, extras);
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
      SpriteFrame = _cc.SpriteFrame;
      sys = _cc.sys;
      Sprite = _cc.Sprite;
    }, function (_unresolved_2) {
      DogController = _unresolved_2.DogController;
    }, function (_unresolved_3) {
      CatController = _unresolved_3.CatController;
    }, function (_unresolved_4) {
      syncWidgetFromStorage = _unresolved_4.syncWidgetFromStorage;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1cdf4MVAo9Me784gx4uDRTk", "TogglePet", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'SpriteFrame', 'sys', 'Sprite']);

      ({
        ccclass,
        property
      } = _decorator);
      STORAGE_KEY = 'petai_pet_choice';
      /**
       * 猫/狗切换：用一个按钮在狗/猫节点、对应背景和 Button2 图片之间切换显示。
       * 用户选择后会持久化，下次进入自动显示上次选择的动物。
       * 同时提供 onBtn1/2/3Click 供按钮绑定，根据当前显示的宠物路由到对应 Controller。
       */

      _export("TogglePet", TogglePet = (_dec = ccclass('TogglePet'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(SpriteFrame), _dec8 = property(SpriteFrame), _dec9 = property({
        tooltip: '无持久化记录时，初始显示狗还是猫'
      }), _dec(_class = (_class2 = class TogglePet extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "dogNode", _descriptor, this);

          _initializerDefineProperty(this, "catNode", _descriptor2, this);

          _initializerDefineProperty(this, "dogBgNode", _descriptor3, this);

          _initializerDefineProperty(this, "catBgNode", _descriptor4, this);

          _initializerDefineProperty(this, "button2Node", _descriptor5, this);

          _initializerDefineProperty(this, "button2DogSprite", _descriptor6, this);

          _initializerDefineProperty(this, "button2CatSprite", _descriptor7, this);

          _initializerDefineProperty(this, "showDogFirst", _descriptor8, this);

          this._showingDog = true;
          this._dogController = null;
          this._catController = null;
        }

        onLoad() {
          this._ensureControllers();

          const saved = sys.localStorage.getItem(STORAGE_KEY);
          if (saved === 'cat') this._showingDog = false;else if (saved === 'dog') this._showingDog = true;else this._showingDog = this.showDogFirst;

          this._apply();
        }

        start() {
          this._ensureControllers();

          this._apply();
        }

        _ensureControllers() {
          if (!this._dogController && this.dogNode) this._dogController = this.dogNode.getComponent(_crd && DogController === void 0 ? (_reportPossibleCrUseOfDogController({
            error: Error()
          }), DogController) : DogController) || null;
          if (!this._catController && this.catNode) this._catController = this.catNode.getComponent(_crd && CatController === void 0 ? (_reportPossibleCrUseOfCatController({
            error: Error()
          }), CatController) : CatController) || null;
        }

        onSwitchPet() {
          this._showingDog = !this._showingDog;

          this._saveChoice();

          this._apply();
        }

        _saveChoice() {
          try {
            sys.localStorage.setItem(STORAGE_KEY, this._showingDog ? 'dog' : 'cat');
            (_crd && syncWidgetFromStorage === void 0 ? (_reportPossibleCrUseOfsyncWidgetFromStorage({
              error: Error()
            }), syncWidgetFromStorage) : syncWidgetFromStorage)();
          } catch (e) {
            console.warn('[TogglePet] 持久化失败：', e);
          }
        }

        _apply() {
          if (this.dogNode) this.dogNode.active = this._showingDog;
          if (this.catNode) this.catNode.active = !this._showingDog;
          if (this.dogBgNode) this.dogBgNode.active = this._showingDog;
          if (this.catBgNode) this.catBgNode.active = !this._showingDog;

          this._applyButton2Sprite();
        }

        _applyButton2Sprite() {
          if (!this.button2Node) return;
          const sprite = this.button2Node.getComponent(Sprite);

          if (sprite && (this.button2DogSprite || this.button2CatSprite)) {
            sprite.spriteFrame = this._showingDog ? this.button2DogSprite : this.button2CatSprite;
          }
        }
        /** 供 Button0 绑定：根据当前显示的宠物调用对应 Controller */


        onBtn0Click() {
          var _this$dogNode, _this$_dogController, _this$catNode, _this$_catController;

          this._ensureControllers();

          if ((_this$dogNode = this.dogNode) != null && _this$dogNode.active) (_this$_dogController = this._dogController) == null || _this$_dogController.onBtn0Click();else if ((_this$catNode = this.catNode) != null && _this$catNode.active) (_this$_catController = this._catController) == null || _this$_catController.onBtn0Click();
        }
        /** 供 Button1 绑定：根据当前显示的宠物调用对应 Controller */


        onBtn1Click() {
          var _this$dogNode2, _this$_dogController2, _this$catNode2, _this$_catController2;

          this._ensureControllers();

          if ((_this$dogNode2 = this.dogNode) != null && _this$dogNode2.active) (_this$_dogController2 = this._dogController) == null || _this$_dogController2.onBtn1Click();else if ((_this$catNode2 = this.catNode) != null && _this$catNode2.active) (_this$_catController2 = this._catController) == null || _this$_catController2.onBtn1Click();
        }
        /** 供 Button2 绑定：根据当前显示的宠物调用对应 Controller */


        onBtn2Click() {
          var _this$dogNode3, _this$_dogController3, _this$catNode3, _this$_catController3;

          this._ensureControllers();

          if ((_this$dogNode3 = this.dogNode) != null && _this$dogNode3.active) (_this$_dogController3 = this._dogController) == null || _this$_dogController3.onBtn2Click();else if ((_this$catNode3 = this.catNode) != null && _this$catNode3.active) (_this$_catController3 = this._catController) == null || _this$_catController3.onBtn2Click();
        }
        /** 供 Button3 绑定：根据当前显示的宠物调用对应 Controller */


        onBtn3Click() {
          var _this$dogNode4, _this$_dogController4, _this$catNode4, _this$_catController4;

          this._ensureControllers();

          if ((_this$dogNode4 = this.dogNode) != null && _this$dogNode4.active) (_this$_dogController4 = this._dogController) == null || _this$_dogController4.onBtn3Click();else if ((_this$catNode4 = this.catNode) != null && _this$catNode4.active) (_this$_catController4 = this._catController) == null || _this$_catController4.onBtn3Click();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dogNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "catNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "dogBgNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "catBgNode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "button2Node", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "button2DogSprite", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "button2CatSprite", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "showDogFirst", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ecbd436e60b499c24a3da4d99654aaada355bc7f.js.map
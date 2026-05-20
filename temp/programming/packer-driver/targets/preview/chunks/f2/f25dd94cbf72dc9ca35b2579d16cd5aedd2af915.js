System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, SpriteFrame, sys, Sprite, Button, find, instantiate, DogController, CatController, syncWidgetFromStorage, consumeSelectCatAfterUnlock, hasCustomPet, isCatUnlocked, openShop, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _crd, ccclass, property, STORAGE_KEY, PICKER_STEP_X, TogglePet;

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

  function _reportPossibleCrUseOfconsumeSelectCatAfterUnlock(extras) {
    _reporterNs.report("consumeSelectCatAfterUnlock", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfhasCustomPet(extras) {
    _reporterNs.report("hasCustomPet", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisCatUnlocked(extras) {
    _reporterNs.report("isCatUnlocked", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfopenShop(extras) {
    _reporterNs.report("openShop", "./PetUnlock", _context.meta, extras);
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
      Button = _cc.Button;
      find = _cc.find;
      instantiate = _cc.instantiate;
    }, function (_unresolved_2) {
      DogController = _unresolved_2.DogController;
    }, function (_unresolved_3) {
      CatController = _unresolved_3.CatController;
    }, function (_unresolved_4) {
      syncWidgetFromStorage = _unresolved_4.syncWidgetFromStorage;
    }, function (_unresolved_5) {
      consumeSelectCatAfterUnlock = _unresolved_5.consumeSelectCatAfterUnlock;
      hasCustomPet = _unresolved_5.hasCustomPet;
      isCatUnlocked = _unresolved_5.isCatUnlocked;
      openShop = _unresolved_5.openShop;
    }, function (_unresolved_6) {}],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1cdf4MVAo9Me784gx4uDRTk", "TogglePet", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'SpriteFrame', 'sys', 'Sprite', 'Button', 'find', 'instantiate']);

      ({
        ccclass,
        property
      } = _decorator);
      STORAGE_KEY = 'petai_pet_choice';
      PICKER_STEP_X = 80;

      /**
       * 宠物选择条（TogglePet：dog / cat / custom / mypet+）：
       * - 默认：狗 + 商店（+）
       * - 解锁猫后：狗 + 猫 + 商店
       * - 已有定制宠物：狗 + 猫 + 定制 + 商店
       */
      _export("TogglePet", TogglePet = (_dec = ccclass('TogglePet'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property({
        tooltip: '主场景定制宠物节点（可选，暂无则选中定制时仍显示狗）'
      }), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(SpriteFrame), _dec10 = property(SpriteFrame), _dec11 = property({
        tooltip: '选择条：狗'
      }), _dec12 = property({
        tooltip: '选择条：猫（未解锁时不显示）'
      }), _dec13 = property({
        tooltip: '选择条：定制宠物（无定制存档时不显示）'
      }), _dec14 = property({
        tooltip: '选择条：商店入口（+）'
      }), _dec15 = property({
        tooltip: '兼容旧字段，同 pickerShopNode'
      }), _dec16 = property({
        tooltip: '无持久化记录时，初始显示狗还是猫'
      }), _dec(_class = (_class2 = class TogglePet extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "dogNode", _descriptor, this);

          _initializerDefineProperty(this, "catNode", _descriptor2, this);

          _initializerDefineProperty(this, "customNode", _descriptor3, this);

          _initializerDefineProperty(this, "dogBgNode", _descriptor4, this);

          _initializerDefineProperty(this, "catBgNode", _descriptor5, this);

          _initializerDefineProperty(this, "customBgNode", _descriptor6, this);

          _initializerDefineProperty(this, "button2Node", _descriptor7, this);

          _initializerDefineProperty(this, "button2DogSprite", _descriptor8, this);

          _initializerDefineProperty(this, "button2CatSprite", _descriptor9, this);

          _initializerDefineProperty(this, "pickerDogNode", _descriptor10, this);

          _initializerDefineProperty(this, "pickerCatNode", _descriptor11, this);

          _initializerDefineProperty(this, "pickerCustomNode", _descriptor12, this);

          _initializerDefineProperty(this, "pickerShopNode", _descriptor13, this);

          _initializerDefineProperty(this, "pickerCustomizeNode", _descriptor14, this);

          _initializerDefineProperty(this, "showDogFirst", _descriptor15, this);

          this._activePet = 'dog';
          this._dogController = null;
          this._catController = null;
        }

        onLoad() {
          this._ensureButton2Refs();

          this._ensurePickerNodes();

          this._ensureCustomPickerNode();

          this._ensureControllers();

          this._disableLegacyToggleButton();

          this._bindPickerClicks();

          this._activePet = this._loadSavedPet();

          this._apply();

          this._refreshPickerVisuals();
        }

        start() {
          this._ensureControllers();

          this._applyAfterReturnFromShop();

          this._apply();

          this._refreshPickerVisuals();
        }

        onEnable() {
          this._applyAfterReturnFromShop();

          this._refreshPickerVisuals();
        }

        _applyAfterReturnFromShop() {
          if (!(_crd && consumeSelectCatAfterUnlock === void 0 ? (_reportPossibleCrUseOfconsumeSelectCatAfterUnlock({
            error: Error()
          }), consumeSelectCatAfterUnlock) : consumeSelectCatAfterUnlock)() || !(_crd && isCatUnlocked === void 0 ? (_reportPossibleCrUseOfisCatUnlocked({
            error: Error()
          }), isCatUnlocked) : isCatUnlocked)()) return;
          this._activePet = 'cat';

          this._saveChoice();

          this._apply();
        }

        _loadSavedPet() {
          var saved = sys.localStorage.getItem(STORAGE_KEY);
          if (saved === 'cat' && (_crd && isCatUnlocked === void 0 ? (_reportPossibleCrUseOfisCatUnlocked({
            error: Error()
          }), isCatUnlocked) : isCatUnlocked)()) return 'cat';
          if (saved === 'custom' && (_crd && hasCustomPet === void 0 ? (_reportPossibleCrUseOfhasCustomPet({
            error: Error()
          }), hasCustomPet) : hasCustomPet)()) return 'custom';
          if (saved === 'dog') return 'dog';
          return this.showDogFirst && (_crd && isCatUnlocked === void 0 ? (_reportPossibleCrUseOfisCatUnlocked({
            error: Error()
          }), isCatUnlocked) : isCatUnlocked)() ? 'dog' : 'dog';
        }

        _normalizeActivePet() {
          if (this._activePet === 'cat' && !(_crd && isCatUnlocked === void 0 ? (_reportPossibleCrUseOfisCatUnlocked({
            error: Error()
          }), isCatUnlocked) : isCatUnlocked)()) this._activePet = 'dog';
          if (this._activePet === 'custom' && !(_crd && hasCustomPet === void 0 ? (_reportPossibleCrUseOfhasCustomPet({
            error: Error()
          }), hasCustomPet) : hasCustomPet)()) this._activePet = 'dog';
        }

        _ensurePickerNodes() {
          if (!this.pickerDogNode) this.pickerDogNode = this.node.getChildByName('dog');
          if (!this.pickerCatNode) this.pickerCatNode = this.node.getChildByName('cat');

          if (!this.pickerShopNode) {
            var _this$pickerCustomize;

            this.pickerShopNode = (_this$pickerCustomize = this.pickerCustomizeNode) != null ? _this$pickerCustomize : this.node.getChildByName('mypet');
          }

          this.pickerCustomizeNode = this.pickerShopNode;
          if (!this.pickerCustomNode) this.pickerCustomNode = this.node.getChildByName('custom');
        }
        /** 无场景节点时，用狗图标克隆一只「定制」入口 */


        _ensureCustomPickerNode() {
          var _this$pickerCustomNod;

          if ((_this$pickerCustomNod = this.pickerCustomNode) != null && _this$pickerCustomNod.isValid) return;
          var template = this.pickerDogNode;
          if (!template) return;
          this.pickerCustomNode = instantiate(template);
          this.pickerCustomNode.name = 'custom';
          this.node.addChild(this.pickerCustomNode);
          this.pickerCustomNode.active = false;
        }

        _disableLegacyToggleButton() {
          var btn = this.node.getComponent(Button);

          if (btn) {
            btn.interactable = false;
            btn.clickEvents.length = 0;
          }
        }

        _bindPickerClicks() {
          this._bindPicker(this.pickerDogNode, () => this.onPickDog());

          this._bindPicker(this.pickerCatNode, () => this.onPickCat());

          this._bindPicker(this.pickerCustomNode, () => this.onPickCustom());

          this._bindPicker(this.pickerShopNode, () => this.onPickShop());
        }

        _bindPicker(node, handler) {
          if (!node) return;
          var btn = node.getComponent(Button);
          if (!btn) btn = node.addComponent(Button);
          btn.transition = Button.Transition.SCALE;
          btn.zoomScale = 1.08;
          btn.node.off(Button.EventType.CLICK);
          btn.node.on(Button.EventType.CLICK, handler, this);
        }

        onPickDog() {
          if (this._activePet === 'dog') {
            this._refreshPickerVisuals();

            return;
          }

          this._activePet = 'dog';

          this._saveChoice();

          this._apply();

          this._refreshPickerVisuals();
        }

        onPickCat() {
          if (!(_crd && isCatUnlocked === void 0 ? (_reportPossibleCrUseOfisCatUnlocked({
            error: Error()
          }), isCatUnlocked) : isCatUnlocked)()) return;

          if (this._activePet === 'cat') {
            this._refreshPickerVisuals();

            return;
          }

          this._activePet = 'cat';

          this._saveChoice();

          this._apply();

          this._refreshPickerVisuals();
        }

        onPickCustom() {
          if (!(_crd && hasCustomPet === void 0 ? (_reportPossibleCrUseOfhasCustomPet({
            error: Error()
          }), hasCustomPet) : hasCustomPet)()) return;

          if (this._activePet === 'custom') {
            this._refreshPickerVisuals();

            return;
          }

          this._activePet = 'custom';

          this._saveChoice();

          this._apply();

          this._refreshPickerVisuals();
        }

        onPickShop() {
          (_crd && openShop === void 0 ? (_reportPossibleCrUseOfopenShop({
            error: Error()
          }), openShop) : openShop)();
        }

        _saveChoice() {
          try {
            sys.localStorage.setItem(STORAGE_KEY, this._activePet);
            (_crd && syncWidgetFromStorage === void 0 ? (_reportPossibleCrUseOfsyncWidgetFromStorage({
              error: Error()
            }), syncWidgetFromStorage) : syncWidgetFromStorage)();
          } catch (e) {
            console.warn('[TogglePet] 持久化失败：', e);
          }
        }

        _apply() {
          this._normalizeActivePet();

          var isDog = this._activePet === 'dog';
          var isCat = this._activePet === 'cat';
          var isCustom = this._activePet === 'custom';
          var hasCustomDisplay = !!this.customNode;
          if (this.dogNode) this.dogNode.active = isDog || isCustom && !hasCustomDisplay;
          if (this.catNode) this.catNode.active = isCat;
          if (this.customNode) this.customNode.active = isCustom;
          if (this.dogBgNode) this.dogBgNode.active = isDog || isCustom && !hasCustomDisplay;
          if (this.catBgNode) this.catBgNode.active = isCat;
          if (this.customBgNode) this.customBgNode.active = isCustom && hasCustomDisplay;

          this._applyButton2Sprite();
        }

        _ensureButton2Refs() {
          if (!this.button2Node) {
            this.button2Node = find('Canvas/btn/Button2');
          }
        }

        _applyButton2Sprite() {
          var _this$button2Node$get, _this$button2Node$get2;

          this._ensureButton2Refs();

          if (!this.button2Node) return;
          var useDog = this._activePet !== 'cat';
          var frame = useDog ? this.button2DogSprite : this.button2CatSprite;
          if (!(frame != null && frame.isValid)) return;
          var sprite = (_this$button2Node$get = this.button2Node.getComponent(Sprite)) != null ? _this$button2Node$get : (_this$button2Node$get2 = this.button2Node.getChildByName('Sprite')) == null ? void 0 : _this$button2Node$get2.getComponent(Sprite);
          if (sprite) sprite.spriteFrame = frame;
        }
        /** 按解锁状态显示槽位并排布：狗 | 猫? | 定制? | + */


        _syncPickerLayout() {
          var _this$pickerDogNode, _this$pickerShopNode;

          var showCat = (_crd && isCatUnlocked === void 0 ? (_reportPossibleCrUseOfisCatUnlocked({
            error: Error()
          }), isCatUnlocked) : isCatUnlocked)();
          var showCustom = (_crd && hasCustomPet === void 0 ? (_reportPossibleCrUseOfhasCustomPet({
            error: Error()
          }), hasCustomPet) : hasCustomPet)();
          if (this.pickerDogNode) this.pickerDogNode.active = true;
          if (this.pickerCatNode) this.pickerCatNode.active = showCat;
          if (this.pickerCustomNode) this.pickerCustomNode.active = showCustom;
          if (this.pickerShopNode) this.pickerShopNode.active = true;
          var row = [];
          if ((_this$pickerDogNode = this.pickerDogNode) != null && _this$pickerDogNode.active) row.push(this.pickerDogNode);
          if (showCat && this.pickerCatNode) row.push(this.pickerCatNode);
          if (showCustom && this.pickerCustomNode) row.push(this.pickerCustomNode);
          if ((_this$pickerShopNode = this.pickerShopNode) != null && _this$pickerShopNode.active) row.push(this.pickerShopNode);
          row.forEach((n, i) => n.setPosition(i * PICKER_STEP_X, 0, 0));
        }

        _refreshPickerVisuals() {
          this._normalizeActivePet();

          this._syncPickerLayout();

          var scaleSel = 1.08;
          var scaleNorm = 1;

          this._setPickerScale(this.pickerDogNode, this._activePet === 'dog' ? scaleSel : scaleNorm);

          this._setPickerScale(this.pickerCatNode, this._activePet === 'cat' ? scaleSel : scaleNorm);

          this._setPickerScale(this.pickerCustomNode, this._activePet === 'custom' ? scaleSel : scaleNorm);

          this._setPickerScale(this.pickerShopNode, scaleNorm);
        }

        _setPickerScale(node, s) {
          if (!(node != null && node.active)) return;
          node.setScale(s, s, 1);
        }

        _ensureControllers() {
          if (!this._dogController && this.dogNode) {
            this._dogController = this.dogNode.getComponent(_crd && DogController === void 0 ? (_reportPossibleCrUseOfDogController({
              error: Error()
            }), DogController) : DogController) || null;
          }

          if (!this._catController && this.catNode) {
            this._catController = this.catNode.getComponent(_crd && CatController === void 0 ? (_reportPossibleCrUseOfCatController({
              error: Error()
            }), CatController) : CatController) || null;
          }
        }

        _routeActiveController(dogFn, catFn) {
          this._ensureControllers();

          if (this._activePet === 'cat') return catFn();
          return dogFn();
        }

        onBtn0Click() {
          this._routeActiveController(() => {
            var _this$_dogController;

            return (_this$_dogController = this._dogController) == null ? void 0 : _this$_dogController.onBtn0Click();
          }, () => {
            var _this$_catController;

            return (_this$_catController = this._catController) == null ? void 0 : _this$_catController.onBtn0Click();
          });
        }

        onBtn1Click() {
          this._routeActiveController(() => {
            var _this$_dogController2;

            return (_this$_dogController2 = this._dogController) == null ? void 0 : _this$_dogController2.onBtn1Click();
          }, () => {
            var _this$_catController2;

            return (_this$_catController2 = this._catController) == null ? void 0 : _this$_catController2.onBtn1Click();
          });
        }

        onBtn2Click() {
          this._routeActiveController(() => {
            var _this$_dogController3;

            return (_this$_dogController3 = this._dogController) == null ? void 0 : _this$_dogController3.onBtn2Click();
          }, () => {
            var _this$_catController3;

            return (_this$_catController3 = this._catController) == null ? void 0 : _this$_catController3.onBtn2Click();
          });
        }

        onBtn3Click() {
          this._routeActiveController(() => {
            var _this$_dogController4;

            return (_this$_dogController4 = this._dogController) == null ? void 0 : _this$_dogController4.onBtn3Click();
          }, () => {
            var _this$_catController4;

            return (_this$_catController4 = this._catController) == null ? void 0 : _this$_catController4.onBtn3Click();
          });
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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "customNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "dogBgNode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "catBgNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "customBgNode", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "button2Node", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "button2DogSprite", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "button2CatSprite", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "pickerDogNode", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "pickerCatNode", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "pickerCustomNode", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "pickerShopNode", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "pickerCustomizeNode", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "showDogFirst", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f25dd94cbf72dc9ca35b2579d16cd5aedd2af915.js.map
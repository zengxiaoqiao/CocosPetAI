System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Button, find, Node, director, Label, Color, UITransform, UIOpacity, tween, Vec3, Tween, view, Widget, SharedBtnCounts, PetInfoBar, TogglePet, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, AdButton;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfSharedBtnCounts(extras) {
    _reporterNs.report("SharedBtnCounts", "./SharedBtnCounts", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetInfoBar(extras) {
    _reporterNs.report("PetInfoBar", "./PetInfoBar", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTogglePet(extras) {
    _reporterNs.report("TogglePet", "./TogglePet", _context.meta, extras);
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
      Node = _cc.Node;
      director = _cc.director;
      Label = _cc.Label;
      Color = _cc.Color;
      UITransform = _cc.UITransform;
      UIOpacity = _cc.UIOpacity;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Tween = _cc.Tween;
      view = _cc.view;
      Widget = _cc.Widget;
    }, function (_unresolved_2) {
      SharedBtnCounts = _unresolved_2.SharedBtnCounts;
    }, function (_unresolved_3) {
      PetInfoBar = _unresolved_3.PetInfoBar;
    }, function (_unresolved_4) {
      TogglePet = _unresolved_4.TogglePet;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4a7d9a3J75Djomh53QbBXtF", "AdButton", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Button', 'find', 'Node', 'director', 'Label', 'Color', 'UITransform', 'UIOpacity', 'tween', 'Vec3', 'Tween', 'view', 'Widget']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 道具入口（原 ad/签到节点）：显示三道具总数量；点击与底部麦克风互斥切换道具栏。
       */

      _export("AdButton", AdButton = (_dec = ccclass('AdButton'), _dec2 = property({
        tooltip: 'Canvas/btn 根节点，留空则自动查找'
      }), _dec3 = property({
        tooltip: 'Canvas/btn_micro，留空则自动查找'
      }), _dec4 = property({
        type: Label,
        tooltip: '总数量 Label，留空则在入口右上角自动创建'
      }), _dec(_class = (_class2 = class AdButton extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "itemsRoot", _descriptor, this);

          _initializerDefineProperty(this, "micNode", _descriptor2, this);

          _initializerDefineProperty(this, "totalCountLabel", _descriptor3, this);

          _initializerDefineProperty(this, "switchDuration", _descriptor4, this);

          this._open = false;
          this._itemsOpacity = null;
          this._micOpacity = null;
          this._micBaseScale = new Vec3(1, 1, 1);
          this._itemsBaseScale = new Vec3(1, 1, 1);
          this._itemsBaseX = 0;
          this._itemsBaseY = 0;
          this._backdrop = null;
          this._backdropOpacity = null;
        }

        onLoad() {
          if (!this.itemsRoot) this.itemsRoot = find('Canvas/btn');
          if (!this.micNode) this.micNode = find('Canvas/btn_micro');

          this._ensureCountLabel();

          this._hookCountsRefresh();

          this._bindEntryClick();

          this._bindItemButtons();

          this._ensureBackdrop();

          if (this.itemsRoot) {
            this._itemsOpacity = this.itemsRoot.getComponent(UIOpacity) || this.itemsRoot.addComponent(UIOpacity);
            this._itemsBaseX = this.itemsRoot.position.x;
            this._itemsBaseY = this.itemsRoot.position.y;

            this._itemsBaseScale.set(this.itemsRoot.scale);

            this.itemsRoot.active = false;
            this._itemsOpacity.opacity = 0;
          }

          if (this.micNode) {
            this._micOpacity = this.micNode.getComponent(UIOpacity) || this.micNode.addComponent(UIOpacity);

            this._micBaseScale.set(this.micNode.scale);

            this.micNode.active = true;
            this._micOpacity.opacity = 255;
          }

          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).init();

          this._refreshTotalLabel();
        }

        onEnable() {
          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).init();

          this._refreshTotalLabel();

          if (!this._open) {
            this._applyMicVisibleImmediate(true);

            this._applyItemsVisibleImmediate(false);

            this._hideBackdropImmediate();
          }
        }

        onDestroy() {
          var _this$_backdrop;

          if ((_this$_backdrop = this._backdrop) != null && _this$_backdrop.isValid) {
            this._backdrop.off(Node.EventType.TOUCH_END, this._onBackdropTap, this);
          }
        }

        _hookCountsRefresh() {
          var prev = (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).onChangeCallback;

          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).onChangeCallback = () => {
            prev == null || prev();

            this._refreshTotalLabel();
          };
        }

        _ensureCountLabel() {
          var _this$totalCountLabel;

          if ((_this$totalCountLabel = this.totalCountLabel) != null && _this$totalCountLabel.isValid) return;
          var n = this.node.getChildByName('item_total');

          if (!n) {
            n = new Node('item_total');
            this.node.addChild(n);
            n.setPosition(46, 46, 0);
            var uit = n.addComponent(UITransform);
            uit.setContentSize(56, 40);
            var lb = n.addComponent(Label);
            lb.fontSize = 28;
            lb.lineHeight = 34;
            lb.horizontalAlign = Label.HorizontalAlign.CENTER;
            lb.verticalAlign = Label.VerticalAlign.CENTER;
            lb.color = new Color(255, 255, 255, 255);
            lb.enableOutline = true;
            lb.outlineColor = new Color(80, 60, 120, 255);
            lb.outlineWidth = 2;
            this.totalCountLabel = lb;
          } else {
            this.totalCountLabel = n.getComponent(Label);
          }
        }

        _refreshTotalLabel() {
          if (!this.totalCountLabel) return;
          var total = (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn1 + (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn2 + (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn3;
          this.totalCountLabel.string = String(total);
        }

        _bindEntryClick() {
          var btn = this.node.getComponent(Button) || this.node.addComponent(Button);
          btn.node.off(Button.EventType.CLICK, this._onEntryClick, this);
          btn.node.on(Button.EventType.CLICK, this._onEntryClick, this);
        }
        /** 代码绑定道具键，避免场景事件在面板刚显示时失效 */


        _bindItemButtons() {
          var _ref, _find$getComponent, _find, _director$getScene;

          var toggle = (_ref = (_find$getComponent = (_find = find('Canvas/TogglePet')) == null ? void 0 : _find.getComponent(_crd && TogglePet === void 0 ? (_reportPossibleCrUseOfTogglePet({
            error: Error()
          }), TogglePet) : TogglePet)) != null ? _find$getComponent : (_director$getScene = director.getScene()) == null ? void 0 : _director$getScene.getComponentInChildren(_crd && TogglePet === void 0 ? (_reportPossibleCrUseOfTogglePet({
            error: Error()
          }), TogglePet) : TogglePet)) != null ? _ref : null;

          var bind = (path, handler) => {
            var n = find(path);
            if (!n) return;
            var b = n.getComponent(Button) || n.addComponent(Button); // 场景里 Button 的 clickEvents（狗/猫 onBtn1Click）无法被 node.off 移除，会连点两次：先扣次数再进广告

            b.clickEvents.length = 0;
            b.node.off(Button.EventType.CLICK);
            b.node.on(Button.EventType.CLICK, handler, this);
          };

          var useAndClose = fn => {
            if (!this._open) return;
            fn == null || fn();

            this._closeItems();
          };

          bind('Canvas/btn/Button1', () => useAndClose(() => toggle == null ? void 0 : toggle.onBtn1Click()));
          bind('Canvas/btn/Button2', () => useAndClose(() => toggle == null ? void 0 : toggle.onBtn2Click()));
          bind('Canvas/btn/Button3', () => useAndClose(() => toggle == null ? void 0 : toggle.onBtn3Click()));
        }

        _ensureBackdrop() {
          var _this$_backdrop2;

          if ((_this$_backdrop2 = this._backdrop) != null && _this$_backdrop2.isValid) return;
          var canvas = find('Canvas');
          if (!canvas) return;
          this._backdrop = new Node('item_backdrop');
          canvas.addChild(this._backdrop);

          var uit = this._backdrop.addComponent(UITransform);

          var vs = view.getVisibleSize();
          uit.setContentSize(vs.width, vs.height);

          var w = this._backdrop.addComponent(Widget);

          w.isAlignTop = w.isAlignBottom = w.isAlignLeft = w.isAlignRight = true;
          w.top = w.bottom = w.left = w.right = 0;
          this._backdropOpacity = this._backdrop.addComponent(UIOpacity);
          this._backdropOpacity.opacity = 255;

          this._backdrop.on(Node.EventType.TOUCH_END, this._onBackdropTap, this);

          this._backdrop.active = false;
        }

        _onBackdropTap() {
          if (this._open) this._closeItems();
        }

        _syncOverlayOrder() {
          var _this$_backdrop3;

          var canvas = find('Canvas');
          if (!canvas || !this.itemsRoot) return;

          if ((_this$_backdrop3 = this._backdrop) != null && _this$_backdrop3.isValid) {
            this._backdrop.setSiblingIndex(Math.max(0, canvas.children.length - 2));
          }

          this.itemsRoot.setSiblingIndex(canvas.children.length - 1);
        }

        _showBackdrop() {
          this._ensureBackdrop();

          if (!this._backdrop) return;

          this._syncOverlayOrder();

          this._backdrop.active = true;
        }

        _hideBackdropImmediate() {
          var _this$_backdrop4;

          if (!((_this$_backdrop4 = this._backdrop) != null && _this$_backdrop4.isValid)) return;
          Tween.stopAllByTarget(this._backdropOpacity);
          this._backdrop.active = false;
        }

        _onEntryClick() {
          if (this._open) this._closeItems();else this._openItems();
        }

        _openItems() {
          var _onChangeCallback, _ref2;

          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).init();
          this._open = true;

          this._refreshTotalLabel();

          (_onChangeCallback = (_ref2 = _crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).onChangeCallback) == null || _onChangeCallback.call(_ref2);

          this._showBackdrop();

          if (this.itemsRoot) {
            this._playItemsShow();
          }

          this._playMicHide();

          (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
            error: Error()
          }), PetInfoBar) : PetInfoBar).setGlobalVisible(false);
        }

        _closeItems() {
          if (!this._open) return;
          this._open = false;

          this._hideBackdropImmediate();

          this._playItemsHide();

          this._playMicShow();

          (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
            error: Error()
          }), PetInfoBar) : PetInfoBar).setGlobalVisible(true);

          this._refreshTotalLabel();
        }

        _applyMicVisibleImmediate(visible) {
          if (!this.micNode) return;
          Tween.stopAllByTarget(this.micNode);
          if (this._micOpacity) Tween.stopAllByTarget(this._micOpacity);
          this.micNode.active = visible;
          this.micNode.setScale(this._micBaseScale);
          if (this._micOpacity) this._micOpacity.opacity = visible ? 255 : 0;
          var micBtn = this.micNode.getComponent(Button);
          if (micBtn) micBtn.interactable = visible;
        }

        _applyItemsVisibleImmediate(visible) {
          if (!this.itemsRoot) return;
          Tween.stopAllByTarget(this.itemsRoot);
          if (this._itemsOpacity) Tween.stopAllByTarget(this._itemsOpacity);
          this.itemsRoot.active = visible;
          this.itemsRoot.setPosition(this._itemsBaseX, this._itemsBaseY, 0);
          this.itemsRoot.setScale(this._itemsBaseScale);
          if (this._itemsOpacity) this._itemsOpacity.opacity = visible ? 255 : 0;
        }

        _playMicHide() {
          if (!this.micNode || !this._micOpacity) return;
          Tween.stopAllByTarget(this.micNode);
          Tween.stopAllByTarget(this._micOpacity);
          var micBtn = this.micNode.getComponent(Button);
          if (micBtn) micBtn.interactable = false;
          var dur = this.switchDuration;
          var shrunk = new Vec3(this._micBaseScale.x * 0.88, this._micBaseScale.y * 0.88, 1);
          tween(this.micNode).to(dur, {
            scale: shrunk
          }, {
            easing: 'quadIn'
          }).start();
          tween(this._micOpacity).to(dur, {
            opacity: 0
          }, {
            easing: 'quadIn'
          }).call(() => {
            var _this$micNode;

            if ((_this$micNode = this.micNode) != null && _this$micNode.isValid) this.micNode.active = false;
          }).start();
        }

        _playMicShow() {
          if (!this.micNode || !this._micOpacity) return;
          Tween.stopAllByTarget(this.micNode);
          Tween.stopAllByTarget(this._micOpacity);
          this.micNode.active = true;
          this.micNode.setScale(this._micBaseScale.x * 0.88, this._micBaseScale.y * 0.88, 1);
          this._micOpacity.opacity = 0;
          var micBtn = this.micNode.getComponent(Button);
          if (micBtn) micBtn.interactable = true;
          var dur = this.switchDuration;
          tween(this.micNode).to(dur, {
            scale: this._micBaseScale.clone()
          }, {
            easing: 'backOut'
          }).start();
          tween(this._micOpacity).to(dur, {
            opacity: 255
          }, {
            easing: 'quadOut'
          }).start();
        }

        _playItemsShow() {
          if (!this.itemsRoot || !this._itemsOpacity) return;
          Tween.stopAllByTarget(this.itemsRoot);
          Tween.stopAllByTarget(this._itemsOpacity);
          this.itemsRoot.active = true;
          this.itemsRoot.setPosition(this._itemsBaseX, this._itemsBaseY - 36, 0);
          this.itemsRoot.setScale(this._itemsBaseScale.x * 0.82, this._itemsBaseScale.y * 0.82, 1);
          this._itemsOpacity.opacity = 0;
          var dur = this.switchDuration;
          tween(this.itemsRoot).to(dur, {
            position: new Vec3(this._itemsBaseX, this._itemsBaseY, 0),
            scale: this._itemsBaseScale.clone()
          }, {
            easing: 'backOut'
          }).start();
          tween(this._itemsOpacity).to(dur, {
            opacity: 255
          }, {
            easing: 'quadOut'
          }).start();
        }

        _playItemsHide() {
          if (!this.itemsRoot || !this._itemsOpacity) return;
          Tween.stopAllByTarget(this.itemsRoot);
          Tween.stopAllByTarget(this._itemsOpacity);
          var dur = this.switchDuration * 0.85;
          var endY = this._itemsBaseY - 28;
          var endScale = new Vec3(this._itemsBaseScale.x * 0.88, this._itemsBaseScale.y * 0.88, 1);
          tween(this.itemsRoot).to(dur, {
            position: new Vec3(this._itemsBaseX, endY, 0),
            scale: endScale
          }, {
            easing: 'quadIn'
          }).start();
          tween(this._itemsOpacity).to(dur, {
            opacity: 0
          }, {
            easing: 'quadIn'
          }).call(() => {
            var _this$itemsRoot;

            if ((_this$itemsRoot = this.itemsRoot) != null && _this$itemsRoot.isValid) this.itemsRoot.active = false;
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemsRoot", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "micNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "totalCountLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "switchDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.28;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7aff75075808481f826aa7183f1e91ce3f4b0e74.js.map
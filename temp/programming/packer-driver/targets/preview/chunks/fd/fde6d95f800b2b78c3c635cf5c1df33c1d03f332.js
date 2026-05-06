System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Button, BlockInputEvents, tween, Vec3, UIOpacity, view, find, Label, Color, UITransform, SharedBtnCounts, AudioManager, PetValue, PetInfoBar, HomePopupMask, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _crd, ccclass, property, CheckInPanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfSharedBtnCounts(extras) {
    _reporterNs.report("SharedBtnCounts", "./SharedBtnCounts", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "./AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetValue(extras) {
    _reporterNs.report("PetValue", "./PetValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetInfoBar(extras) {
    _reporterNs.report("PetInfoBar", "./PetInfoBar", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHomePopupMask(extras) {
    _reporterNs.report("HomePopupMask", "./HomePopupMask", _context.meta, extras);
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
      Button = _cc.Button;
      BlockInputEvents = _cc.BlockInputEvents;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      UIOpacity = _cc.UIOpacity;
      view = _cc.view;
      find = _cc.find;
      Label = _cc.Label;
      Color = _cc.Color;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      SharedBtnCounts = _unresolved_2.SharedBtnCounts;
    }, function (_unresolved_3) {
      AudioManager = _unresolved_3.AudioManager;
    }, function (_unresolved_4) {
      PetValue = _unresolved_4.PetValue;
    }, function (_unresolved_5) {
      PetInfoBar = _unresolved_5.PetInfoBar;
    }, function (_unresolved_6) {
      HomePopupMask = _unresolved_6.HomePopupMask;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a1b2cPU5fZKW4ydDh8qO0xd", "CheckInPanel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Button', 'BlockInputEvents', 'tween', 'Vec3', 'UIOpacity', 'view', 'find', 'Label', 'Color', 'UITransform']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 挂在 Check-in 节点上：
       * - 每次新打开游戏时显示；
       * - mask 节点（在 Check-in 外）：透明度 0→255；若绑定 popupMask（与 widget_choose 共用的 HomePopupMask），会同步控制遮罩显示以挡住下面点击。
       * - Check-in 从屏幕右侧滑入，带弹性；
       * - 点击 OK 按钮：领取次数、关闭节点。
       */

      _export("CheckInPanel", CheckInPanel = (_dec = ccclass('CheckInPanel'), _dec2 = property(Button), _dec3 = property({
        type: Node,
        tooltip: '遮罩节点（在 Check-in 外），需在 Inspector 绑定'
      }), _dec4 = property(_crd && HomePopupMask === void 0 ? (_reportPossibleCrUseOfHomePopupMask({
        error: Error()
      }), HomePopupMask) : HomePopupMask), _dec(_class = (_class2 = (_class3 = class CheckInPanel extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "okButton", _descriptor, this);

          _initializerDefineProperty(this, "maskNode", _descriptor2, this);

          _initializerDefineProperty(this, "popupMask", _descriptor3, this);

          this._targetPos = new Vec3();

          this._refreshVisibility = () => {
            var show = (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
              error: Error()
            }), SharedBtnCounts) : SharedBtnCounts).hasPendingClaim();

            if (this.popupMask && this.popupMask.isValid) {
              this.popupMask.setCheckInShowing(show);
            } else if (this.maskNode) {
              this.maskNode.active = show;
            }

            this.node.active = show; // Check-in 显示时隐藏主界面的 info bar，关闭后再显示

            (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
              error: Error()
            }), PetInfoBar) : PetInfoBar).setGlobalVisible(!show);

            if (show) {
              this._updateRewardVisibility();

              this._playShowAnimation();
            }
          };
        }

        onLoad() {
          this._targetPos.set(this.node.position);

          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).init();
          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).onPendingClaimCallback = this._refreshVisibility;

          if (!this.okButton) {
            var btnNode = this.node.getChildByName('Button');
            if (btnNode) this.okButton = btnNode.getComponent(Button);
          }

          if (this.okButton) {
            this.okButton.node.on(Button.EventType.CLICK, this.onOKClick, this);
          }

          this._ensureBlockInput();

          this._refreshVisibility();
        }
        /** 确保遮罩能阻挡下方按钮的点击 */


        _ensureBlockInput() {
          var target = this.maskNode || this.node;

          if (!target.getComponent(BlockInputEvents)) {
            target.addComponent(BlockInputEvents);
          }
        }

        onDestroy() {
          var _this$okButton;

          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).onPendingClaimCallback = null;

          if ((_this$okButton = this.okButton) != null && (_this$okButton = _this$okButton.node) != null && _this$okButton.isValid) {
            this.okButton.node.off(Button.EventType.CLICK, this.onOKClick, this);
          }
        }

        onEnable() {
          this._refreshVisibility();
        }

        /** 三格都显示：连续签到时全部正常；未连续时中奖格正常，另外两格半透明并显示 "Tomorrow"。 */
        _updateRewardVisibility() {
          var _container$getChildBy, _container$getChildBy2, _container$getChildBy3;

          var kind = (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).getPendingRewardType();
          var container = this.node.getChildByName('Node');
          if (!container) return;
          var slot0 = (_container$getChildBy = container.getChildByName('Node1')) != null ? _container$getChildBy : container.children[0];
          var slot1 = (_container$getChildBy2 = container.getChildByName('Node2')) != null ? _container$getChildBy2 : container.children[1];
          var slot2 = (_container$getChildBy3 = container.getChildByName('Node3')) != null ? _container$getChildBy3 : container.children[2];
          if (!slot0 || !slot1 || !slot2) return;
          var showAll = kind === 'all';
          var slots = [slot0, slot1, slot2];

          for (var i = 0; i < 3; i++) {
            var slot = slots[i];
            slot.active = true;
            var isWon = showAll || kind === i;
            var opacity = slot.getComponent(UIOpacity);
            if (!opacity) opacity = slot.addComponent(UIOpacity);
            opacity.opacity = isWon ? 255 : 128;

            var countLabelNode = this._getSlotCountLabelNode(slot);

            var tomorrowNode = slot.getChildByName(CheckInPanel.TOMORROW_LABEL);

            if (isWon) {
              if (countLabelNode) countLabelNode.active = true;
              if (tomorrowNode) tomorrowNode.active = false;
            } else {
              if (countLabelNode) countLabelNode.active = false;

              var labelNode = this._getOrCreateTomorrowLabel(slot);

              if (labelNode) {
                labelNode.active = true;
                var label = labelNode.getComponent(Label);
                if (label) label.string = CheckInPanel.TOMORROW_LABEL;
              }
            }
          }
        }
        /** 获取奖励格内显示数量的那个 Label 节点（非 Tomorrow），用于有 Tomorrow 时隐藏数量 */


        _getSlotCountLabelNode(slot) {
          for (var child of slot.children) {
            if (child.name === CheckInPanel.TOMORROW_LABEL) continue;
            if (child.getComponent(Label)) return child;
          }

          return null;
        }

        _getOrCreateTomorrowLabel(slot) {
          var node = slot.getChildByName(CheckInPanel.TOMORROW_LABEL);
          if (node) return node;
          node = new Node(CheckInPanel.TOMORROW_LABEL);
          if (!node.addComponent(UITransform)) return null;
          var label = node.addComponent(Label);
          label.string = CheckInPanel.TOMORROW_LABEL;
          label.fontSize = 24;
          label.color = new Color(255, 255, 255, 200);
          var ut = node.getComponent(UITransform);

          if (ut) {
            ut.setContentSize(120, 40);
          }

          node.setPosition(0, -70, 0);
          slot.addChild(node);
          return node;
        }
        /** 弹出动画：mask 渐显；Check-in 从右侧滑入（弹性） */


        _playShowAnimation() {
          var offScreenX = this._targetPos.x + Math.max(800, view.getVisibleSize().width);

          if (this.maskNode) {
            var maskOpacity = this.maskNode.getComponent(UIOpacity);
            if (!maskOpacity) maskOpacity = this.maskNode.addComponent(UIOpacity);
            maskOpacity.opacity = 0;
            tween(maskOpacity).to(0.3, {
              opacity: 255
            }).start();
          }

          this.node.setPosition(offScreenX, this._targetPos.y, this._targetPos.z);
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).playCheckInShowSound();
          tween(this.node).to(0.5, {
            position: this._targetPos.clone()
          }, {
            easing: 'elasticOut'
          }).start();
        }
        /** OK 按钮点击：先领取（连续=三种奖励，未连续=随机一种），数量飞向对应 button，飞抵后关闭 */


        onOKClick() {
          var _this$okButton2, _find;

          var granted = (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).claim();
          if (!granted) return;
          var startNode = ((_this$okButton2 = this.okButton) == null ? void 0 : _this$okButton2.node) || this.node;
          var pv = (_find = find('Canvas/pet_value')) == null ? void 0 : _find.getComponent(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue);
          var btn1 = find('Canvas/btn/Button1');
          var btn2 = find('Canvas/btn/Button2');
          var btn3 = find('Canvas/btn/Button3');
          var btn1Label = btn1 == null ? void 0 : btn1.getComponentInChildren(Label);
          var btn2Label = btn2 == null ? void 0 : btn2.getComponentInChildren(Label);
          var btn3Label = btn3 == null ? void 0 : btn3.getComponentInChildren(Label);
          var needFly = (granted.btn1 > 0 ? 1 : 0) + (granted.btn2 > 0 ? 1 : 0) + (granted.btn3 > 0 ? 1 : 0);
          var color = new Color(255, 255, 255, 255);
          var arrived = 0;

          var onAllArrived = () => {
            arrived++;

            if (arrived >= needFly) {
              this.node.active = false;
              if (this.popupMask && this.popupMask.isValid) this.popupMask.setCheckInShowing(false);else if (this.maskNode) this.maskNode.active = false;
            }
          };

          if (pv && needFly > 0) {
            if (granted.btn1 > 0 && btn1Label) pv.spawnFlyingLabelDirect(startNode, btn1Label, granted.btn1, color, onAllArrived);
            if (granted.btn2 > 0 && btn2Label) pv.spawnFlyingLabelDirect(startNode, btn2Label, granted.btn2, color, onAllArrived);
            if (granted.btn3 > 0 && btn3Label) pv.spawnFlyingLabelDirect(startNode, btn3Label, granted.btn3, color, onAllArrived);
          } else {
            this.node.active = false;
            if (this.popupMask && this.popupMask.isValid) this.popupMask.setCheckInShowing(false);else if (this.maskNode) this.maskNode.active = false;
          }
        }

      }, _class3.TOMORROW_LABEL = 'Tomorrow', _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "okButton", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maskNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "popupMask", [_dec4], {
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
//# sourceMappingURL=fde6d95f800b2b78c3c635cf5c1df33c1d03f332.js.map
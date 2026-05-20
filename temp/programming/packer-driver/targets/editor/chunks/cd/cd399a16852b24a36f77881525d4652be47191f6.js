System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Button, find, BlockInputEvents, SharedBtnCounts, HomePopupMask, PetInfoBar, CheckInPanel, registerCarePanelClose, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _class3, _crd, ccclass, property, CarePanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfSharedBtnCounts(extras) {
    _reporterNs.report("SharedBtnCounts", "./SharedBtnCounts", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHomePopupMask(extras) {
    _reporterNs.report("HomePopupMask", "./HomePopupMask", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetInfoBar(extras) {
    _reporterNs.report("PetInfoBar", "./PetInfoBar", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCheckInPanel(extras) {
    _reporterNs.report("CheckInPanel", "./CheckInPanel", _context.meta, extras);
  }

  function _reportPossibleCrUseOfregisterCarePanelClose(extras) {
    _reporterNs.report("registerCarePanelClose", "./CarePanelBridge", _context.meta, extras);
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
      BlockInputEvents = _cc.BlockInputEvents;
    }, function (_unresolved_2) {
      SharedBtnCounts = _unresolved_2.SharedBtnCounts;
    }, function (_unresolved_3) {
      HomePopupMask = _unresolved_3.HomePopupMask;
    }, function (_unresolved_4) {
      PetInfoBar = _unresolved_4.PetInfoBar;
    }, function (_unresolved_5) {
      CheckInPanel = _unresolved_5.CheckInPanel;
    }, function (_unresolved_6) {
      registerCarePanelClose = _unresolved_6.registerCarePanelClose;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c4e5fani5xNDh8qO0xdbn+K", "CarePanel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Button', 'find', 'Label', 'BlockInputEvents']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 「照顾」弹层：展示喂食/玩耍/梳毛（复用 Canvas/btn 下三个按钮），可选展示签到领取区。
       * 挂在 Canvas/ad 或任意入口节点；由 AdButton 等调用 open()。
       */

      _export("CarePanel", CarePanel = (_dec = ccclass('CarePanel'), _dec2 = property({
        tooltip: '三个道具按钮的父节点，默认 Canvas/btn'
      }), _dec3 = property({
        tooltip: '签到区块（Check-in 节点），有待领取时才显示'
      }), _dec4 = property(Button), _dec5 = property(_crd && HomePopupMask === void 0 ? (_reportPossibleCrUseOfHomePopupMask({
        error: Error()
      }), HomePopupMask) : HomePopupMask), _dec6 = property({
        tooltip: '签到已领时可选提示 Label'
      }), _dec(_class = (_class2 = (_class3 = class CarePanel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "itemsRoot", _descriptor, this);

          _initializerDefineProperty(this, "checkInNode", _descriptor2, this);

          _initializerDefineProperty(this, "closeButton", _descriptor3, this);

          _initializerDefineProperty(this, "popupMask", _descriptor4, this);

          _initializerDefineProperty(this, "checkInDoneLabel", _descriptor5, this);
        }

        onLoad() {
          var _find$getComponent, _find, _this$popupMask;

          (_crd && registerCarePanelClose === void 0 ? (_reportPossibleCrUseOfregisterCarePanelClose({
            error: Error()
          }), registerCarePanelClose) : registerCarePanelClose)(() => this.close());
          if (!this.itemsRoot) this.itemsRoot = find('Canvas/btn');
          if (!this.checkInNode) this.checkInNode = find('Canvas/Check-in');
          if (!this.popupMask) this.popupMask = (_find$getComponent = (_find = find('Canvas/mask')) == null ? void 0 : _find.getComponent(_crd && HomePopupMask === void 0 ? (_reportPossibleCrUseOfHomePopupMask({
            error: Error()
          }), HomePopupMask) : HomePopupMask)) != null ? _find$getComponent : null;

          if (!this.closeButton) {
            var _this$node$getChildBy;

            const close = (_this$node$getChildBy = this.node.getChildByName('close')) != null ? _this$node$getChildBy : this.node.getChildByName('Close');
            if (close) this.closeButton = close.getComponent(Button);
          }

          if (this.closeButton) {
            this.closeButton.node.on(Button.EventType.CLICK, this.close, this);
          }

          if (this.itemsRoot) this.itemsRoot.active = false;
          if (this.checkInNode) this.checkInNode.active = false;
          (_this$popupMask = this.popupMask) == null || _this$popupMask.setCloseCareCallback(() => this.close());
        }

        onEnable() {
          CarePanel.instance = this;
        }

        onDisable() {
          if (CarePanel.instance === this) CarePanel.instance = null;
        }

        onDestroy() {
          var _this$closeButton, _this$popupMask2;

          (_crd && registerCarePanelClose === void 0 ? (_reportPossibleCrUseOfregisterCarePanelClose({
            error: Error()
          }), registerCarePanelClose) : registerCarePanelClose)(null);

          if ((_this$closeButton = this.closeButton) != null && (_this$closeButton = _this$closeButton.node) != null && _this$closeButton.isValid) {
            this.closeButton.node.off(Button.EventType.CLICK, this.close, this);
          }

          (_this$popupMask2 = this.popupMask) == null || _this$popupMask2.setCloseCareCallback(null);
        }
        /** 打开照顾弹层（道具 + 有待领时显示签到） */


        open() {
          var _onChangeCallback, _ref, _this$popupMask3;

          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).init();

          this._ensureBlockInput();

          if (this.itemsRoot) {
            this.itemsRoot.active = true;
          }

          (_onChangeCallback = (_ref = _crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).onChangeCallback) == null || _onChangeCallback.call(_ref);
          const hasClaim = (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).hasPendingClaim();

          if (this.checkInNode) {
            this.checkInNode.active = hasClaim;

            if (hasClaim) {
              const checkIn = this.checkInNode.getComponent(_crd && CheckInPanel === void 0 ? (_reportPossibleCrUseOfCheckInPanel({
                error: Error()
              }), CheckInPanel) : CheckInPanel);
              checkIn == null || checkIn.refreshForCarePanel();
            }
          }

          if (this.checkInDoneLabel) {
            this.checkInDoneLabel.node.active = !hasClaim;
          }

          (_this$popupMask3 = this.popupMask) == null || _this$popupMask3.setCareShowing(true);
          (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
            error: Error()
          }), PetInfoBar) : PetInfoBar).setGlobalVisible(false);
        }

        close() {
          var _this$popupMask4;

          if (this.itemsRoot) this.itemsRoot.active = false;
          if (this.checkInNode) this.checkInNode.active = false;
          if (this.checkInDoneLabel) this.checkInDoneLabel.node.active = false;
          (_this$popupMask4 = this.popupMask) == null || _this$popupMask4.setCareShowing(false);
          (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
            error: Error()
          }), PetInfoBar) : PetInfoBar).setGlobalVisible(true);
        }

        _ensureBlockInput() {
          var _this$popupMask5, _this$popupMask6;

          const target = ((_this$popupMask5 = this.popupMask) == null ? void 0 : _this$popupMask5.maskNode) || ((_this$popupMask6 = this.popupMask) == null ? void 0 : _this$popupMask6.node);

          if (target && !target.getComponent(BlockInputEvents)) {
            target.addComponent(BlockInputEvents);
          }
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemsRoot", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "checkInNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "closeButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "popupMask", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "checkInDoneLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=cd399a16852b24a36f77881525d4652be47191f6.js.map
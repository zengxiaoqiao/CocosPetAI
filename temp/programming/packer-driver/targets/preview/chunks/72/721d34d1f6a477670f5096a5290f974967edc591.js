System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, requestPinPetWidgetSmall, HomePopupMask, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, WidgetChoosePanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfrequestPinPetWidgetSmall(extras) {
    _reporterNs.report("requestPinPetWidgetSmall", "./WidgetSync", _context.meta, extras);
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
    }, function (_unresolved_2) {
      requestPinPetWidgetSmall = _unresolved_2.requestPinPetWidgetSmall;
    }, function (_unresolved_3) {
      HomePopupMask = _unresolved_3.HomePopupMask;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e943380yNlGQZCitKzg5ujU", "WidgetChoosePanel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 首页 Widget 入口（已移除大号 Widget，仅保留小号）。
       * widget_btn 建议直接挂 HomeWidgetButton；若仍绑定 showChoose，则直接弹出添加小号 Widget。
       */

      _export("WidgetChoosePanel", WidgetChoosePanel = (_dec = ccclass('WidgetChoosePanel'), _dec2 = property(Node), _dec3 = property(_crd && HomePopupMask === void 0 ? (_reportPossibleCrUseOfHomePopupMask({
        error: Error()
      }), HomePopupMask) : HomePopupMask), _dec(_class = (_class2 = class WidgetChoosePanel extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "panel", _descriptor, this);

          _initializerDefineProperty(this, "popupMask", _descriptor2, this);
        }

        onLoad() {
          if (this.panel) this.panel.active = false;
        }
        /** 兼容旧场景：点击 widget_btn 时直接添加小号 Widget */


        showChoose() {
          (_crd && requestPinPetWidgetSmall === void 0 ? (_reportPossibleCrUseOfrequestPinPetWidgetSmall({
            error: Error()
          }), requestPinPetWidgetSmall) : requestPinPetWidgetSmall)();
        }

        closeChoose() {
          var _this$popupMask;

          if ((_this$popupMask = this.popupMask) != null && _this$popupMask.isValid) this.popupMask.setWidgetChooseShowing(false);
          if (this.panel) this.panel.active = false;
        }
        /** 兼容旧场景 widget_s 点击 */


        onSelectSmall() {
          (_crd && requestPinPetWidgetSmall === void 0 ? (_reportPossibleCrUseOfrequestPinPetWidgetSmall({
            error: Error()
          }), requestPinPetWidgetSmall) : requestPinPetWidgetSmall)();
          this.closeChoose();
        }
        /** 已废弃：大号 Widget 已移除 */


        onSelectLarge() {
          (_crd && requestPinPetWidgetSmall === void 0 ? (_reportPossibleCrUseOfrequestPinPetWidgetSmall({
            error: Error()
          }), requestPinPetWidgetSmall) : requestPinPetWidgetSmall)();
          this.closeChoose();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "panel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "popupMask", [_dec3], {
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
//# sourceMappingURL=721d34d1f6a477670f5096a5290f974967edc591.js.map
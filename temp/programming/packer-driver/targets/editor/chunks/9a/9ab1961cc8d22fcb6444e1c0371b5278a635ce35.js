System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, sys, requestPinPetWidgetSmall, requestPinPetWidgetLarge, HomePopupMask, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, STORAGE_KEY_PET, ccclass, property, WidgetChoosePanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfrequestPinPetWidgetSmall(extras) {
    _reporterNs.report("requestPinPetWidgetSmall", "./WidgetSync", _context.meta, extras);
  }

  function _reportPossibleCrUseOfrequestPinPetWidgetLarge(extras) {
    _reporterNs.report("requestPinPetWidgetLarge", "./WidgetSync", _context.meta, extras);
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
      sys = _cc.sys;
    }, function (_unresolved_2) {
      requestPinPetWidgetSmall = _unresolved_2.requestPinPetWidgetSmall;
      requestPinPetWidgetLarge = _unresolved_2.requestPinPetWidgetLarge;
    }, function (_unresolved_3) {
      HomePopupMask = _unresolved_3.HomePopupMask;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e943380yNlGQZCitKzg5ujU", "WidgetChoosePanel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      __checkObsolete__(['sys']);

      STORAGE_KEY_PET = 'petai_pet_choice';
      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 首页 Widget 尺寸选择弹窗：
       * - 挂在「包含 widget_btn 和 widget_choose 的父节点」上，并把 widget_choose 拖到 panel 属性。
       * - popupMask 拖到 home 里与 Check-in 共用的那个 mask 上的 HomePopupMask 组件，用于挡住下面点击。
       * - widget_btn 的 Click 事件 -> showChoose
       * - widget_s 的 Click 事件 -> onSelectSmall
       * - widget_l 的 Click 事件 -> onSelectLarge
       */

      _export("WidgetChoosePanel", WidgetChoosePanel = (_dec = ccclass('WidgetChoosePanel'), _dec2 = property(Node), _dec3 = property(_crd && HomePopupMask === void 0 ? (_reportPossibleCrUseOfHomePopupMask({
        error: Error()
      }), HomePopupMask) : HomePopupMask), _dec(_class = (_class2 = class WidgetChoosePanel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "panel", _descriptor, this);

          _initializerDefineProperty(this, "popupMask", _descriptor2, this);
        }

        onLoad() {
          if (this.popupMask) {
            this.popupMask.setCloseWidgetChooseCallback(() => this.closeChoose());
          }

          if (this.panel) this.panel.active = false; // 默认隐藏，只有点击 widget_btn 调用 showChoose 后才显示

          this._refreshPetVisibility();
        }

        onDestroy() {
          if (this.popupMask && this.popupMask.isValid) {
            this.popupMask.setCloseWidgetChooseCallback(null);
            this.popupMask.setWidgetChooseShowing(false);
          }
        }
        /** 点击 widget_btn 时调用：显示尺寸选择（widget_choose） */


        showChoose() {
          this._refreshPetVisibility();

          if (this.popupMask) this.popupMask.setWidgetChooseShowing(true);
          if (this.panel) this.panel.active = true;
        }
        /** 关闭选择面板（点击遮罩或选完尺寸时调用） */


        closeChoose() {
          if (this.popupMask) this.popupMask.setWidgetChooseShowing(false);
          if (this.panel) this.panel.active = false;
        }
        /** 点击 widget_s 时调用：弹出系统添加小号 Widget 弹窗，并关闭选择面板 */


        onSelectSmall() {
          (_crd && requestPinPetWidgetSmall === void 0 ? (_reportPossibleCrUseOfrequestPinPetWidgetSmall({
            error: Error()
          }), requestPinPetWidgetSmall) : requestPinPetWidgetSmall)();
          this.closeChoose();
        }
        /** 点击 widget_l 时调用：弹出系统添加大号 Widget 弹窗，并关闭选择面板 */


        onSelectLarge() {
          (_crd && requestPinPetWidgetLarge === void 0 ? (_reportPossibleCrUseOfrequestPinPetWidgetLarge({
            error: Error()
          }), requestPinPetWidgetLarge) : requestPinPetWidgetLarge)();
          this.closeChoose();
        }
        /** 根据当前宠物（猫/狗）显示或隐藏 widget_choose 下小号/大号里的猫、狗节点 */


        _refreshPetVisibility() {
          const root = this.panel;
          if (!root || !root.isValid) return;
          const pet = (sys.localStorage.getItem(STORAGE_KEY_PET) || 'dog').toLowerCase();
          const isDog = pet === 'dog';
          const widgetS = root.getChildByName('widget_s');
          const widgetL = root.getChildByName('widget_l');

          if (widgetS) {
            const dogS = widgetS.getChildByName('dog_s');
            const catS = widgetS.getChildByName('cat_s');
            if (dogS) dogS.active = isDog;
            if (catS) catS.active = !isDog;
          }

          if (widgetL) {
            const dogL = widgetL.getChildByName('dog_l');
            const catL = widgetL.getChildByName('cat_l');
            if (dogL) dogL.active = isDog;
            if (catL) catL.active = !isDog;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "panel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "popupMask", [_dec3], {
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
//# sourceMappingURL=9ab1961cc8d22fcb6444e1c0371b5278a635ce35.js.map
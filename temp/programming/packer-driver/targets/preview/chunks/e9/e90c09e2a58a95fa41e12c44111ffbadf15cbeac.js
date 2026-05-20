System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, BlockInputEvents, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, HomePopupMask;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      BlockInputEvents = _cc.BlockInputEvents;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b8a9aQfCqtDF52idp22UeJJ", "HomePopupMask", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'BlockInputEvents']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 首页弹窗遮罩：widget_choose、Check-in 共用同一 mask 节点，避免点击穿透。
       * - 挂在 home 场景的 mask 节点上；CheckInPanel、WidgetChoosePanel 的 popupMask 都指向此组件。
       * - 任一弹窗显示时遮罩激活，都关闭时遮罩隐藏。
       * - Android 真机：仅在遮罩显示时才挂 BlockInputEvents 和触摸监听，避免未显示节点参与触摸导致卡死。
       */

      _export("HomePopupMask", HomePopupMask = (_dec = ccclass('HomePopupMask'), _dec2 = property(Node), _dec(_class = (_class2 = class HomePopupMask extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "maskNode", _descriptor, this);

          this._widgetChooseShowing = false;
          this._checkInShowing = false;
          this._itemButtonsShowing = false;
          this._closeWidgetChoose = null;
          this._closeItemButtons = null;
        }

        onLoad() {
          this._updateActive();
        }

        onDestroy() {
          if (this.node.isValid) this._ensureMaskListeners(false);
        }

        _onMaskTouchEnd() {
          if (this._itemButtonsShowing && this._closeItemButtons) {
            this._closeItemButtons();

            return;
          }

          if (this._widgetChooseShowing && this._closeWidgetChoose) {
            this._closeWidgetChoose();
          }
        }

        /** 由 WidgetChoosePanel 注册：点击遮罩时关闭选择面板 */
        setCloseWidgetChooseCallback(cb) {
          this._closeWidgetChoose = cb;
        }
        /** widget_choose 显示/隐藏时调用 */


        setWidgetChooseShowing(show) {
          this._widgetChooseShowing = show;

          this._updateActive();
        }
        /** Check-in 显示/隐藏时调用 */


        setCheckInShowing(show) {
          this._checkInShowing = show;

          this._updateActive();
        }

        /** 点击遮罩时收起道具按钮组 */
        setCloseItemButtonsCallback(cb) {
          this._closeItemButtons = cb;
        }
        /** 道具按钮组（喂食/玩耍/梳毛）显示时 */


        setItemButtonsShowing(show) {
          this._itemButtonsShowing = show;

          this._updateActive();
        }

        _updateActive() {
          var target = this.maskNode || this.node;
          var shouldShow = this._widgetChooseShowing || this._checkInShowing || this._itemButtonsShowing;
          target.active = shouldShow;

          this._ensureMaskListeners(shouldShow);
        }
        /** 仅在实际显示时挂 BlockInputEvents 和 TOUCH_END，隐藏时移除监听，避免 Android 触摸链路卡死 */


        _ensureMaskListeners(active) {
          var target = this.maskNode || this.node;
          if (!target.isValid) return;

          if (active) {
            if (!target.getComponent(BlockInputEvents)) {
              target.addComponent(BlockInputEvents);
            }

            target.off(Node.EventType.TOUCH_END, this._onMaskTouchEnd, this);
            target.on(Node.EventType.TOUCH_END, this._onMaskTouchEnd, this);
          } else {
            target.off(Node.EventType.TOUCH_END, this._onMaskTouchEnd, this);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "maskNode", [_dec2], {
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
//# sourceMappingURL=e90c09e2a58a95fa41e12c44111ffbadf15cbeac.js.map
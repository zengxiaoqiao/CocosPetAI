System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, PetValue, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, BtnMicroRandomText;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

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
      Component = _cc.Component;
      Label = _cc.Label;
    }, function (_unresolved_2) {
      PetValue = _unresolved_2.PetValue;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "abf98qsH25PTIlEfwydOLwu", "BtnMicroRandomText", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);

      /**
       * 麦克风按钮旁状态文案（已关闭显示，仅保留接口供 BtnMicroRecord 调用）。
       */
      _export("BtnMicroRandomText", BtnMicroRandomText = (_dec = ccclass('BtnMicroRandomText'), _dec2 = property(Label), _dec3 = property(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
        error: Error()
      }), PetValue) : PetValue), _dec4 = property({
        multiline: true,
        tooltip: '空闲时轮播（预留）'
      }), _dec(_class = (_class2 = class BtnMicroRandomText extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "label", _descriptor, this);

          _initializerDefineProperty(this, "petValue", _descriptor2, this);

          _initializerDefineProperty(this, "phraseList", _descriptor3, this);

          _initializerDefineProperty(this, "interval", _descriptor4, this);

          this._mode = 'idle';
        }

        onLoad() {
          this._clearHint();
        }
        /** 由 BtnMicroRecord 驱动；不再显示按住/继续按住等文案 */


        setMicHint(mode) {
          this._mode = mode;

          this._clearHint();
        }

        get micHintMode() {
          return this._mode;
        }

        _clearHint() {
          const label = this._ensureHintLabel();

          if (label) {
            label.string = '';
            label.node.active = false;
          }
        }

        _ensureHintLabel() {
          var _this$label;

          if ((_this$label = this.label) != null && (_this$label = _this$label.node) != null && _this$label.isValid) return this.label;
          const named = this.node.getChildByName('mic_hint');

          if (named) {
            this.label = named.getComponent(Label) || named.addComponent(Label);
            return this.label;
          }

          for (const child of this.node.children) {
            if (child.name === 'mic_hint') continue;
            const lab = child.getComponent(Label);

            if (lab && child.name !== 'thinking' && child.name !== 'sent') {
              this.label = lab;
              return this.label;
            }
          }

          return null;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "petValue", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "phraseList", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "interval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fd9e3a6b861a4e847f7f0195aeebb04fcdfa22d3.js.map
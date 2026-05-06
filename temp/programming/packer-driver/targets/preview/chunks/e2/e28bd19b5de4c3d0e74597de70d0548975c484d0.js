System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, director, find, PetValue, BtnMicroRecord, isZh, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, BtnMicroRandomText;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPetValue(extras) {
    _reporterNs.report("PetValue", "./PetValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBtnMicroRecord(extras) {
    _reporterNs.report("BtnMicroRecord", "./BtnMicroRecord", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisZh(extras) {
    _reporterNs.report("isZh", "./Lang", _context.meta, extras);
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
      director = _cc.director;
      find = _cc.find;
    }, function (_unresolved_2) {
      PetValue = _unresolved_2.PetValue;
    }, function (_unresolved_3) {
      BtnMicroRecord = _unresolved_3.BtnMicroRecord;
    }, function (_unresolved_4) {
      isZh = _unresolved_4.isZh;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "abf98qsH25PTIlEfwydOLwu", "BtnMicroRandomText", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'director', 'find']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 麦克风按钮下方提示文案：
       * - 麦克风不可用（无体力/无心情）时：显示简短原因提示
       * - 麦克风可用时：不显示预设轮播文案，避免与 pet_info_bar 产生歧义
       */

      _export("BtnMicroRandomText", BtnMicroRandomText = (_dec = ccclass('BtnMicroRandomText'), _dec2 = property(Label), _dec3 = property(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
        error: Error()
      }), PetValue) : PetValue), _dec4 = property(_crd && BtnMicroRecord === void 0 ? (_reportPossibleCrUseOfBtnMicroRecord({
        error: Error()
      }), BtnMicroRecord) : BtnMicroRecord), _dec5 = property({
        multiline: true,
        tooltip: '多行提示语，每行一句（不填则使用默认多语言文案）'
      }), _dec(_class = (_class2 = class BtnMicroRandomText extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "label", _descriptor, this);

          _initializerDefineProperty(this, "petValue", _descriptor2, this);

          _initializerDefineProperty(this, "recordComponent", _descriptor3, this);

          _initializerDefineProperty(this, "phraseList", _descriptor4, this);

          _initializerDefineProperty(this, "interval", _descriptor5, this);

          this._phrases = [];
          this._index = 0;
          this._lastCanUse = null;
        }

        onLoad() {
          this._ensurePetValue();

          this._ensureLabel();

          this._updateLabel();

          this.schedule(this._refreshWhenDisabled, 1, Infinity);
        }

        _ensureLabel() {
          if (this.label) return;
          this.label = this.node.getComponentInChildren(Label) || null;
        }

        _refreshWhenDisabled() {
          var pv = this._ensurePetValue();

          var canUse = !pv || pv.canUseMicro(); // Update immediately when usability changes (disabled -> enabled should clear copy right away).

          if (this._lastCanUse === null || this._lastCanUse !== canUse) {
            this._lastCanUse = canUse;

            this._updateLabel();

            return;
          } // While disabled, refresh periodically (hp/mood reason may change).


          if (!canUse) this._updateLabel();
        }

        _ensurePetValue() {
          var _director$getScene;

          if (this.petValue) return this.petValue;
          var n = find('Canvas/pet_value');
          this.petValue = n ? n.getComponent(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue) : null;
          if (!this.petValue) this.petValue = ((_director$getScene = director.getScene()) == null ? void 0 : _director$getScene.getComponentInChildren(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue)) || null;
          return this.petValue;
        }

        onDestroy() {
          this.unschedule(this._nextPhrase);
          this.unschedule(this._refreshWhenDisabled);
        }

        _nextPhrase() {
          if (this._phrases.length === 0) return;
          this._index = (this._index + 1) % this._phrases.length;

          this._updateLabel();
        }

        _updateLabel() {
          this._ensureLabel();

          if (!this.label) return;

          var pv = this._ensurePetValue();

          var canUse = !pv || pv.canUseMicro();
          this._lastCanUse = canUse;

          if (!canUse && pv) {
            if (pv.isHpLowForMicro() && !pv.isIntimacyLowForMicro()) {
              this.label.string = (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
                error: Error()
              }), isZh) : isZh)() ? '体力小于60不能聊天' : "I'm tired";
            } else if (pv.isIntimacyLowForMicro() && !pv.isHpLowForMicro()) {
              this.label.string = (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
                error: Error()
              }), isZh) : isZh)() ? '心情小于60不能聊天' : "Not in the mood";
            } else {
              this.label.string = (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
                error: Error()
              }), isZh) : isZh)() ? '体力和心情大于60才能聊天' : "Can't talk right now";
            }

            return;
          } // Mic is usable: keep this area empty to avoid duplicate/ambiguous copy vs pet_info_bar.


          this.label.string = '';
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "petValue", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "recordComponent", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "phraseList", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "interval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e28bd19b5de4c3d0e74597de70d0548975c484d0.js.map
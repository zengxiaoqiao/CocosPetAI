System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, game, Game, recordCompanionVisitToday, getCompanionDaysDisplayText, getCompanionDaysState, _dec, _dec2, _class, _class2, _descriptor, _class3, _crd, ccclass, property, CompanionDaysDisplay;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfrecordCompanionVisitToday(extras) {
    _reporterNs.report("recordCompanionVisitToday", "./CompanionDays", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetCompanionDaysDisplayText(extras) {
    _reporterNs.report("getCompanionDaysDisplayText", "./CompanionDays", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetCompanionDaysState(extras) {
    _reporterNs.report("getCompanionDaysState", "./CompanionDays", _context.meta, extras);
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
      game = _cc.game;
      Game = _cc.Game;
    }, function (_unresolved_2) {
      recordCompanionVisitToday = _unresolved_2.recordCompanionVisitToday;
      getCompanionDaysDisplayText = _unresolved_2.getCompanionDaysDisplayText;
      getCompanionDaysState = _unresolved_2.getCompanionDaysState;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b7e4dPCGg9OXZyLKj9OXWx7", "CompanionDaysDisplay", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'game', 'Game']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 挂在场景中的 companion 节点上，与 PetValue（体力/心情）分离，便于分开放置 UI。
       */

      _export("CompanionDaysDisplay", CompanionDaysDisplay = (_dec = ccclass('CompanionDaysDisplay'), _dec2 = property({
        tooltip: '展示文案的 Label；不绑则使用本节点上的 Label'
      }), _dec(_class = (_class2 = (_class3 = class CompanionDaysDisplay extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "textLabel", _descriptor, this);

          this._totalDays = 0;
          this._streakDays = 0;

          this._onGameShow = () => {
            if (!this.isValid) return;

            this._refreshFromStorage(true);
          };
        }

        onLoad() {
          this._ensureLabel();

          this._refreshFromStorage(true);

          game.on(Game.EVENT_SHOW, this._onGameShow, this);
        }

        onEnable() {
          CompanionDaysDisplay.instance = this;
        }

        onDisable() {
          if (CompanionDaysDisplay.instance === this) {
            CompanionDaysDisplay.instance = null;
          }

          game.off(Game.EVENT_SHOW, this._onGameShow, this);
        }

        _ensureLabel() {
          if (this.textLabel) return;
          this.textLabel = this.getComponent(Label) || this.getComponentInChildren(Label);
        }
        /** @param recordVisit 是否尝试计入今日陪伴（仅应在 onLoad / 回前台时 true） */


        _refreshFromStorage(recordVisit) {
          const state = recordVisit ? (_crd && recordCompanionVisitToday === void 0 ? (_reportPossibleCrUseOfrecordCompanionVisitToday({
            error: Error()
          }), recordCompanionVisitToday) : recordCompanionVisitToday)() : (_crd && getCompanionDaysState === void 0 ? (_reportPossibleCrUseOfgetCompanionDaysState({
            error: Error()
          }), getCompanionDaysState) : getCompanionDaysState)();
          this._totalDays = state.totalDays;
          this._streakDays = state.streakDays;

          this._applyLabel();
        }

        _applyLabel() {
          this._ensureLabel();

          if (!this.textLabel) return;
          this.textLabel.string = (_crd && getCompanionDaysDisplayText === void 0 ? (_reportPossibleCrUseOfgetCompanionDaysDisplayText({
            error: Error()
          }), getCompanionDaysDisplayText) : getCompanionDaysDisplayText)({
            totalDays: this._totalDays,
            streakDays: this._streakDays
          });
        }

        get totalDays() {
          return this._totalDays;
        }

        get streakDays() {
          return this._streakDays;
        }
        /** 外部可在不重新计日的情况下刷新展示 */


        refreshDisplay() {
          const state = (_crd && getCompanionDaysState === void 0 ? (_reportPossibleCrUseOfgetCompanionDaysState({
            error: Error()
          }), getCompanionDaysState) : getCompanionDaysState)();
          this._totalDays = state.totalDays;
          this._streakDays = state.streakDays;

          this._applyLabel();
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "textLabel", [_dec2], {
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
//# sourceMappingURL=50595fb6f3fcab195219f445519f04c1de511daf.js.map
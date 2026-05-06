System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Animation, director, find, PetValue, IS_FIRST_SESSION, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _class3, _crd, ccclass, property, RandomPlayPetAni;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPetValue(extras) {
    _reporterNs.report("PetValue", "./PetValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIS_FIRST_SESSION(extras) {
    _reporterNs.report("IS_FIRST_SESSION", "./PetValue", _context.meta, extras);
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
      Animation = _cc.Animation;
      director = _cc.director;
      find = _cc.find;
    }, function (_unresolved_2) {
      PetValue = _unresolved_2.PetValue;
      IS_FIRST_SESSION = _unresolved_2.IS_FIRST_SESSION;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cd02bxoE5pGhZ/hqnGO9PGj", "RandomPlayPetAni", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Animation', 'director', 'find']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 狗/猫共用的随机动画播放逻辑。
       * 子类通过 prefix 区分形象（dog/cat），动画命名规则：{prefix}01~17。
       */

      _export("RandomPlayPetAni", RandomPlayPetAni = (_dec = ccclass('RandomPlayPetAni'), _dec2 = property(Animation), _dec3 = property(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
        error: Error()
      }), PetValue) : PetValue), _dec(_class = (_class2 = (_class3 = class RandomPlayPetAni extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "aniComponent", _descriptor, this);

          _initializerDefineProperty(this, "petValue", _descriptor2, this);

          this.startAniName = null;
          this.switchTimer = null;
          this.loopTimer = null;

          /** 定期检查体力/亲密，不足时切到 13/14，恢复后切回 */
          this._checkInterval = 4;
        }

        get aniNames() {
          return [this.prefix + "01", this.prefix + "02", this.prefix + "03"];
        }
        /** 每晚 22 点～次日 7 点、或午间 12:00～13:00 只播 03（与夜间同一动画）；其余时段随机 01/02（不含 03）。
         *  首次安装首开时（IS_FIRST_SESSION），无论时间点都按白天逻辑处理，不睡觉。 */


        get isNightTime() {
          if (_crd && IS_FIRST_SESSION === void 0 ? (_reportPossibleCrUseOfIS_FIRST_SESSION({
            error: Error()
          }), IS_FIRST_SESSION) : IS_FIRST_SESSION) return false;
          var d = new Date();
          var h = d.getHours();
          if (h >= 22 || h < 7) return true;
          if (h === 12) return true;
          return false;
        }

        get clip13() {
          return this.prefix + "13";
        }

        get clip14() {
          return this.prefix + "14";
        }

        get clip04() {
          return this.prefix + "04";
        }

        get clip05() {
          return this.prefix + "05";
        }

        onLoad() {
          if (!this.aniComponent) this.aniComponent = this.node.getComponent(Animation);
        }

        onEnable() {
          if (RandomPlayPetAni.returnedFromAd) return; // 延后一帧播放，确保 Animation 组件及 clips 已就绪（节点从 inactive 切到 active 时可能有时序问题）

          this.scheduleOnce(() => this.playRandomAni(), 0); // 定期检查体力/亲密，使用默认「无限重复」的重载，避免 Infinity 在某些平台被当成 0 次

          this.schedule(this._checkStateAndReselectAni, this._checkInterval);
        }

        onDisable() {
          this.cancelSwitchTimer();
          this.cancelLoopTimer();
          this.unschedule(this._checkStateAndReselectAni);
        }

        cancelSwitchTimer() {
          if (this.switchTimer !== null) {
            clearTimeout(this.switchTimer);
            this.switchTimer = null;
          }

          this.startAniName = null;
        }

        cancelLoopTimer() {
          if (this.loopTimer !== null) {
            clearTimeout(this.loopTimer);
            this.loopTimer = null;
          }
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

        playRandomAni() {
          if (!this.aniComponent || this.aniNames.length === 0) return;
          this.cancelSwitchTimer();
          this.cancelLoopTimer();

          var pv = this._ensurePetValue();

          var targetAniName;

          if (pv && pv.isHpLow()) {
            targetAniName = this.clip14;
          } else if (pv && pv.isIntimacyLow()) {
            targetAniName = this.clip13;
          } else if (this.isNightTime) {
            targetAniName = this.aniNames[2];
          } else {
            var randomIndex = Math.floor(Math.random() * 2);
            targetAniName = this.aniNames[randomIndex]; // PetValue 可能晚于本组件就绪，若尚未拿到 pv 则稍后重试一次，以便亲密/体力不足时能切到 13/14

            if (!pv && !this.isNightTime) {
              this.scheduleOnce(() => this.playRandomAni(), 0.5);
            }
          }

          this.startAniName = targetAniName;
          this.aniComponent.stop();
          this.aniComponent.play(targetAniName);

          if (targetAniName === this.clip13 || targetAniName === this.clip14) {
            this._setupLoopAnimation(targetAniName);

            return;
          }

          if (targetAniName === this.aniNames[2]) return; // 03 不切换

          var delayMs = 6600;
          this.switchTimer = setTimeout(() => {
            this.switchTimer = null;
            if (!this.startAniName || !this.aniComponent) return;
            if (this.startAniName === this.aniNames[0]) this.aniComponent.play(this.clip04);else if (this.startAniName === this.aniNames[1]) this.aniComponent.play(this.clip05);
          }, delayMs);
        }

        _setupLoopAnimation(aniName) {
          var state = this.aniComponent.getState(aniName);
          var durationMs;

          if (state && state.duration > 0) {
            var speed = state.speed > 0 ? state.speed : 1;
            durationMs = state.duration / speed * 1000;
          } else {
            durationMs = 2500;
          }

          this.loopTimer = setTimeout(() => {
            this.loopTimer = null;
            if (!this.node.active || !this.aniComponent) return;

            var pv = this._ensurePetValue();

            if (aniName === this.clip14 && pv && pv.isHpLow() || aniName === this.clip13 && pv && pv.isIntimacyLow()) {
              this.aniComponent.play(aniName);

              this._setupLoopAnimation(aniName);
            } else {
              // 体力/亲密已恢复，切回普通动画
              this.playRandomAni();
            }
          }, durationMs);
        }
        /** 根据当前体力/亲密应播的动画名（与 playRandomAni 分支一致） */


        _getTargetAniName() {
          var pv = this._ensurePetValue();

          if (pv && pv.isHpLow()) return this.clip14;
          if (pv && pv.isIntimacyLow()) return this.clip13;
          if (this.isNightTime) return this.aniNames[2];
          var randomIndex = Math.floor(Math.random() * 2);
          return this.aniNames[randomIndex];
        }

        _checkStateAndReselectAni() {
          if (!this.aniComponent || !this.node.active) return;

          var target = this._getTargetAniName();

          var needLow = target === this.clip13 || target === this.clip14;
          var isLow = this.startAniName === this.clip13 || this.startAniName === this.clip14;
          if (needLow && !isLow) this.playRandomAni();else if (!needLow && isLow) this.playRandomAni();
        }

      }, _class3.returnedFromAd = false, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "aniComponent", [_dec2], {
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
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5c8f31204449a847ec2dca144774f75da22a8300.js.map
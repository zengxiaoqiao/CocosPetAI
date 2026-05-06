System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, AudioClip, AudioSource, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _class3, _crd, ccclass, property, AudioManager;

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
      AudioClip = _cc.AudioClip;
      AudioSource = _cc.AudioSource;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "82376Q/wqBPh5eoblbv3PJw", "AudioManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'AudioClip', 'AudioSource']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AudioManager", AudioManager = (_dec = ccclass('AudioManager'), _dec2 = property({
        type: AudioClip,
        tooltip: '通用点击音效'
      }), _dec3 = property({
        type: AudioClip,
        tooltip: '背景音乐'
      }), _dec4 = property({
        type: AudioClip,
        tooltip: '飘字飞抵主数值时的音效'
      }), _dec5 = property({
        type: AudioClip,
        tooltip: 'Check-in 弹出时的音效'
      }), _dec6 = property({
        type: AudioClip,
        tooltip: '动画 dog01 专属音效'
      }), _dec7 = property({
        type: AudioClip,
        tooltip: '动画 dog02 专属音效'
      }), _dec8 = property({
        type: AudioClip,
        tooltip: '动画 dog03 专属音效'
      }), _dec9 = property({
        type: AudioClip,
        tooltip: '动画 dog04 专属音效'
      }), _dec10 = property({
        type: AudioClip,
        tooltip: '动画 dog05 专属音效'
      }), _dec11 = property({
        type: AudioClip,
        tooltip: '动画 dog06 专属音效'
      }), _dec12 = property({
        type: AudioClip,
        tooltip: '动画 dog07 专属音效'
      }), _dec13 = property({
        type: AudioClip,
        tooltip: '动画 dog08 专属音效'
      }), _dec14 = property({
        type: AudioClip,
        tooltip: '动画 dog09 专属音效'
      }), _dec15 = property({
        type: AudioClip,
        tooltip: '动画 dog10 专属音效'
      }), _dec16 = property({
        type: AudioClip,
        tooltip: '动画 dog11 专属音效'
      }), _dec17 = property({
        type: AudioClip,
        tooltip: '动画 dog12 专属音效'
      }), _dec18 = property({
        type: AudioClip,
        tooltip: '动画 dog13 专属音效'
      }), _dec19 = property({
        type: AudioClip,
        tooltip: '动画 dog14 专属音效'
      }), _dec20 = property({
        type: AudioClip,
        tooltip: '动画 dog15 专属音效'
      }), _dec21 = property({
        type: AudioClip,
        tooltip: '动画 dog16 专属音效'
      }), _dec22 = property({
        type: AudioClip,
        tooltip: '动画 dog17 专属音效'
      }), _dec23 = property({
        type: AudioClip,
        tooltip: '动画 cat01 专属音效'
      }), _dec24 = property({
        type: AudioClip,
        tooltip: '动画 cat02 专属音效'
      }), _dec25 = property({
        type: AudioClip,
        tooltip: '动画 cat03 专属音效'
      }), _dec26 = property({
        type: AudioClip,
        tooltip: '动画 cat04 专属音效'
      }), _dec27 = property({
        type: AudioClip,
        tooltip: '动画 cat05 专属音效'
      }), _dec28 = property({
        type: AudioClip,
        tooltip: '动画 cat06 专属音效'
      }), _dec29 = property({
        type: AudioClip,
        tooltip: '动画 cat07 专属音效'
      }), _dec30 = property({
        type: AudioClip,
        tooltip: '动画 cat08 专属音效'
      }), _dec31 = property({
        type: AudioClip,
        tooltip: '动画 cat09 专属音效'
      }), _dec32 = property({
        type: AudioClip,
        tooltip: '动画 cat10 专属音效'
      }), _dec33 = property({
        type: AudioClip,
        tooltip: '动画 cat11 专属音效'
      }), _dec34 = property({
        type: AudioClip,
        tooltip: '动画 cat12 专属音效'
      }), _dec35 = property({
        type: AudioClip,
        tooltip: '动画 cat13 专属音效'
      }), _dec36 = property({
        type: AudioClip,
        tooltip: '动画 cat14 专属音效'
      }), _dec37 = property({
        type: AudioClip,
        tooltip: '动画 cat15 专属音效'
      }), _dec38 = property({
        type: AudioClip,
        tooltip: '动画 cat16 专属音效'
      }), _dec39 = property({
        type: AudioClip,
        tooltip: '动画 cat17 专属音效'
      }), _dec(_class = (_class2 = (_class3 = class AudioManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "clickAudioClip", _descriptor, this);

          _initializerDefineProperty(this, "bgmAudioClip", _descriptor2, this);

          _initializerDefineProperty(this, "valueIncreaseAudioClip", _descriptor3, this);

          _initializerDefineProperty(this, "checkInShowAudioClip", _descriptor4, this);

          // 每个狗动画对应的音效（可在 Inspector 里按需绑定）
          _initializerDefineProperty(this, "dog01Sound", _descriptor5, this);

          _initializerDefineProperty(this, "dog02Sound", _descriptor6, this);

          _initializerDefineProperty(this, "dog03Sound", _descriptor7, this);

          _initializerDefineProperty(this, "dog04Sound", _descriptor8, this);

          _initializerDefineProperty(this, "dog05Sound", _descriptor9, this);

          _initializerDefineProperty(this, "dog06Sound", _descriptor10, this);

          _initializerDefineProperty(this, "dog07Sound", _descriptor11, this);

          _initializerDefineProperty(this, "dog08Sound", _descriptor12, this);

          _initializerDefineProperty(this, "dog09Sound", _descriptor13, this);

          _initializerDefineProperty(this, "dog10Sound", _descriptor14, this);

          _initializerDefineProperty(this, "dog11Sound", _descriptor15, this);

          _initializerDefineProperty(this, "dog12Sound", _descriptor16, this);

          _initializerDefineProperty(this, "dog13Sound", _descriptor17, this);

          _initializerDefineProperty(this, "dog14Sound", _descriptor18, this);

          _initializerDefineProperty(this, "dog15Sound", _descriptor19, this);

          _initializerDefineProperty(this, "dog16Sound", _descriptor20, this);

          _initializerDefineProperty(this, "dog17Sound", _descriptor21, this);

          // 每个猫动画对应的音效（可在 Inspector 里按需绑定）
          _initializerDefineProperty(this, "cat01Sound", _descriptor22, this);

          _initializerDefineProperty(this, "cat02Sound", _descriptor23, this);

          _initializerDefineProperty(this, "cat03Sound", _descriptor24, this);

          _initializerDefineProperty(this, "cat04Sound", _descriptor25, this);

          _initializerDefineProperty(this, "cat05Sound", _descriptor26, this);

          _initializerDefineProperty(this, "cat06Sound", _descriptor27, this);

          _initializerDefineProperty(this, "cat07Sound", _descriptor28, this);

          _initializerDefineProperty(this, "cat08Sound", _descriptor29, this);

          _initializerDefineProperty(this, "cat09Sound", _descriptor30, this);

          _initializerDefineProperty(this, "cat10Sound", _descriptor31, this);

          _initializerDefineProperty(this, "cat11Sound", _descriptor32, this);

          _initializerDefineProperty(this, "cat12Sound", _descriptor33, this);

          _initializerDefineProperty(this, "cat13Sound", _descriptor34, this);

          _initializerDefineProperty(this, "cat14Sound", _descriptor35, this);

          _initializerDefineProperty(this, "cat15Sound", _descriptor36, this);

          _initializerDefineProperty(this, "cat16Sound", _descriptor37, this);

          _initializerDefineProperty(this, "cat17Sound", _descriptor38, this);

          // 是否静音，由 AudioControl 控制
          this.isSoundMuted = false;
          this._bgmAudioSource = null;

          /** 记录正常播放时的 BGM 音量，用于语音时衰减/恢复 */
          this._bgmBaseVolume = 0.5;

          /** 当前是否处于“语音优先”模式（录音/播报时） */
          this._voicePriority = false;
        }

        onLoad() {
          AudioManager.instance = this; // 确保有 AudioSource 用于播放 BGM / OneShot

          this._bgmAudioSource = this.node.getComponent(AudioSource);

          if (!this._bgmAudioSource) {
            this._bgmAudioSource = this.node.addComponent(AudioSource);
          } // 跨场景不销毁


          this.node.destroyOnLoad = false;
        }

        start() {
          if (this._bgmAudioSource) {
            this._bgmAudioSource.loop = true;
            this._bgmAudioSource.volume = this._bgmBaseVolume;

            if (!this.isSoundMuted && this.bgmAudioClip) {
              this._bgmAudioSource.clip = this.bgmAudioClip;

              this._bgmAudioSource.play();
            }
          }
        }
        /** 停止所有声音并进入静音状态，供 AudioControl 调用 */


        stopAllSounds() {
          this.isSoundMuted = true;

          if (this._bgmAudioSource) {
            this._bgmAudioSource.stop();
          }
        }
        /** 解除静音状态并根据需要恢复背景音乐，供 AudioControl 调用 */


        resumeSounds() {
          this.isSoundMuted = false;

          if (this._bgmAudioSource && this.bgmAudioClip) {
            this._bgmAudioSource.clip = this.bgmAudioClip;
            this._bgmAudioSource.loop = true;
            this._bgmAudioSource.volume = this._voicePriority ? this._bgmBaseVolume * 0.3 : this._bgmBaseVolume;

            if (!this._bgmAudioSource.playing) {
              this._bgmAudioSource.play();
            }
          }
        }
        /** 语音开始时调用：降低 BGM 音量，避免和语音抢占空间 */


        static enterVoicePriority() {
          const inst = AudioManager.instance;
          if (!inst || !inst._bgmAudioSource) return;
          inst._voicePriority = true;
          inst._bgmAudioSource.volume = inst._bgmBaseVolume * 0.3; // 比正常音量更轻
        }
        /** 语音结束时调用：恢复正常 BGM 音量 */


        static exitVoicePriority() {
          const inst = AudioManager.instance;
          if (!inst || !inst._bgmAudioSource) return;
          inst._voicePriority = false;
          inst._bgmAudioSource.volume = inst._bgmBaseVolume;
        }
        /** 播放点击音效 */


        playClickSound() {
          if (this.isSoundMuted) return;
          if (!this.clickAudioClip || !this._bgmAudioSource) return;

          this._bgmAudioSource.playOneShot(this.clickAudioClip, 1.0);
        }
        /** Check-in 弹出时播放（可在 Inspector 绑定 checkInShowAudioClip） */


        static playCheckInShowSound() {
          const inst = AudioManager.instance;

          if (inst && inst.checkInShowAudioClip && inst._bgmAudioSource && !inst.isSoundMuted) {
            inst._bgmAudioSource.playOneShot(inst.checkInShowAudioClip, 1.0);
          }
        }
        /** 飘字飞抵主数值时播放（可在 Inspector 绑定 valueIncreaseAudioClip） */


        static playValueIncreaseSound() {
          const inst = AudioManager.instance;

          if (inst && inst.valueIncreaseAudioClip && inst._bgmAudioSource && !inst.isSoundMuted) {
            inst._bgmAudioSource.playOneShot(inst.valueIncreaseAudioClip, 1.0);
          }
        }
        /** 通用音效播放方法：使用 playOneShot 在现有 AudioSource 上播放 */


        playSound(audioClip) {
          if (this.isSoundMuted) return;
          if (!audioClip) return;

          if (this._bgmAudioSource) {
            this._bgmAudioSource.playOneShot(audioClip, 1.0);
          } else {
            const audioNode = new Node(`TempAudio_${audioClip.name}`);
            const audioSource = audioNode.addComponent(AudioSource);
            audioSource.clip = audioClip;
            audioSource.loop = false;
            audioSource.volume = 1.0;
            audioSource.play();
            this.node.scene.addChild(audioNode);
          }
        } // ========== 兼容：原有动画帧事件调用 ==========

        /** 默认动画音效（无参老接口），这里简单使用点击音效代替，避免报错 */


        static playAnimSound() {
          const inst = AudioManager.instance;

          if (inst && inst.clickAudioClip) {
            inst.playSound(inst.clickAudioClip);
          }
        } // 兼容所有 dogXX/catXX 帧事件：如有专属音效则播放，没有则静默（不再用点击音效兜底）


        static playAnimSoundDog01() {
          const inst = AudioManager.instance;
          if (inst && inst.dog01Sound) inst.playSound(inst.dog01Sound);
        }

        static playAnimSoundDog02() {
          const inst = AudioManager.instance;
          if (inst && inst.dog02Sound) inst.playSound(inst.dog02Sound);
        }

        static playAnimSoundDog03() {
          const inst = AudioManager.instance;
          if (inst && inst.dog03Sound) inst.playSound(inst.dog03Sound);
        }

        static playAnimSoundDog04() {
          const inst = AudioManager.instance;
          if (inst && inst.dog04Sound) inst.playSound(inst.dog04Sound);
        }

        static playAnimSoundDog05() {
          const inst = AudioManager.instance;
          if (inst && inst.dog05Sound) inst.playSound(inst.dog05Sound);
        }

        static playAnimSoundDog06() {
          const inst = AudioManager.instance;
          if (inst && inst.dog06Sound) inst.playSound(inst.dog06Sound);
        }

        static playAnimSoundDog07() {
          const inst = AudioManager.instance;
          if (inst && inst.dog07Sound) inst.playSound(inst.dog07Sound);
        }

        static playAnimSoundDog08() {
          const inst = AudioManager.instance;
          if (inst && inst.dog08Sound) inst.playSound(inst.dog08Sound);
        }

        static playAnimSoundDog09() {
          const inst = AudioManager.instance;
          if (inst && inst.dog09Sound) inst.playSound(inst.dog09Sound);
        }

        static playAnimSoundDog10() {
          const inst = AudioManager.instance;
          if (inst && inst.dog10Sound) inst.playSound(inst.dog10Sound);
        }

        static playAnimSoundDog11() {
          const inst = AudioManager.instance;
          if (inst && inst.dog11Sound) inst.playSound(inst.dog11Sound);
        }

        static playAnimSoundDog12() {
          const inst = AudioManager.instance;
          if (inst && inst.dog12Sound) inst.playSound(inst.dog12Sound);
        }

        static playAnimSoundDog13() {
          const inst = AudioManager.instance;
          if (inst && inst.dog13Sound) inst.playSound(inst.dog13Sound);
        }

        static playAnimSoundDog14() {
          const inst = AudioManager.instance;
          if (inst && inst.dog14Sound) inst.playSound(inst.dog14Sound);
        }

        static playAnimSoundDog15() {
          const inst = AudioManager.instance;
          if (inst && inst.dog15Sound) inst.playSound(inst.dog15Sound);
        }

        static playAnimSoundDog16() {
          const inst = AudioManager.instance;
          if (inst && inst.dog16Sound) inst.playSound(inst.dog16Sound);
        }

        static playAnimSoundDog17() {
          const inst = AudioManager.instance;
          if (inst && inst.dog17Sound) inst.playSound(inst.dog17Sound);
        }

        static playAnimSoundCat01() {
          const inst = AudioManager.instance;
          if (inst && inst.cat01Sound) inst.playSound(inst.cat01Sound);
        }

        static playAnimSoundCat02() {
          const inst = AudioManager.instance;
          if (inst && inst.cat02Sound) inst.playSound(inst.cat02Sound);
        }

        static playAnimSoundCat03() {
          const inst = AudioManager.instance;
          if (inst && inst.cat03Sound) inst.playSound(inst.cat03Sound);
        }

        static playAnimSoundCat04() {
          const inst = AudioManager.instance;
          if (inst && inst.cat04Sound) inst.playSound(inst.cat04Sound);
        }

        static playAnimSoundCat05() {
          const inst = AudioManager.instance;
          if (inst && inst.cat05Sound) inst.playSound(inst.cat05Sound);
        }

        static playAnimSoundCat06() {
          const inst = AudioManager.instance;
          if (inst && inst.cat06Sound) inst.playSound(inst.cat06Sound);
        }

        static playAnimSoundCat07() {
          const inst = AudioManager.instance;
          if (inst && inst.cat07Sound) inst.playSound(inst.cat07Sound);
        }

        static playAnimSoundCat08() {
          const inst = AudioManager.instance;
          if (inst && inst.cat08Sound) inst.playSound(inst.cat08Sound);
        }

        static playAnimSoundCat09() {
          const inst = AudioManager.instance;
          if (inst && inst.cat09Sound) inst.playSound(inst.cat09Sound);
        }

        static playAnimSoundCat10() {
          const inst = AudioManager.instance;
          if (inst && inst.cat10Sound) inst.playSound(inst.cat10Sound);
        }

        static playAnimSoundCat11() {
          const inst = AudioManager.instance;
          if (inst && inst.cat11Sound) inst.playSound(inst.cat11Sound);
        }

        static playAnimSoundCat12() {
          const inst = AudioManager.instance;
          if (inst && inst.cat12Sound) inst.playSound(inst.cat12Sound);
        }

        static playAnimSoundCat13() {
          const inst = AudioManager.instance;
          if (inst && inst.cat13Sound) inst.playSound(inst.cat13Sound);
        }

        static playAnimSoundCat14() {
          const inst = AudioManager.instance;
          if (inst && inst.cat14Sound) inst.playSound(inst.cat14Sound);
        }

        static playAnimSoundCat15() {
          const inst = AudioManager.instance;
          if (inst && inst.cat15Sound) inst.playSound(inst.cat15Sound);
        }

        static playAnimSoundCat16() {
          const inst = AudioManager.instance;
          if (inst && inst.cat16Sound) inst.playSound(inst.cat16Sound);
        }

        static playAnimSoundCat17() {
          const inst = AudioManager.instance;
          if (inst && inst.cat17Sound) inst.playSound(inst.cat17Sound);
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "clickAudioClip", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bgmAudioClip", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "valueIncreaseAudioClip", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "checkInShowAudioClip", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "dog01Sound", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "dog02Sound", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "dog03Sound", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "dog04Sound", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "dog05Sound", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "dog06Sound", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "dog07Sound", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "dog08Sound", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "dog09Sound", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "dog10Sound", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "dog11Sound", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "dog12Sound", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "dog13Sound", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "dog14Sound", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "dog15Sound", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "dog16Sound", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "dog17Sound", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "cat01Sound", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "cat02Sound", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "cat03Sound", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "cat04Sound", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "cat05Sound", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "cat06Sound", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "cat07Sound", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "cat08Sound", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "cat09Sound", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "cat10Sound", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "cat11Sound", [_dec33], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class2.prototype, "cat12Sound", [_dec34], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class2.prototype, "cat13Sound", [_dec35], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class2.prototype, "cat14Sound", [_dec36], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class2.prototype, "cat15Sound", [_dec37], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class2.prototype, "cat16Sound", [_dec38], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class2.prototype, "cat17Sound", [_dec39], {
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
//# sourceMappingURL=c2baa3e71cf8fbedd8aa098871fff1b6dda1439a.js.map
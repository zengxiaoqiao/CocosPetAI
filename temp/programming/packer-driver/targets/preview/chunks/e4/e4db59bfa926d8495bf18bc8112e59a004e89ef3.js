System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, find, director, AudioManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, AudioControl;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "./AudioManager", _context.meta, extras);
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
      find = _cc.find;
      director = _cc.director;
    }, function (_unresolved_2) {
      AudioManager = _unresolved_2.AudioManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b671ckMTrpJEb43KBBJ5lws", "AudioControl", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'find', 'director']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 音频控制脚本，供按钮调用停止/恢复声音。
       * 可绑定“停止声音”和“开启声音”两个按钮节点，只显示其中一个（一个开一个关）。
       */

      _export("AudioControl", AudioControl = (_dec = ccclass('AudioControl'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class AudioControl extends Component {
        constructor() {
          super(...arguments);

          /** 停止声音按钮节点：点击后隐藏自身、显示开启声音按钮 */
          _initializerDefineProperty(this, "stopSoundButton", _descriptor, this);

          /** 开启声音按钮节点：点击后隐藏自身、显示停止声音按钮 */
          _initializerDefineProperty(this, "resumeSoundButton", _descriptor2, this);
        }

        start() {
          this._syncAudioButtonVisibility();
        }
        /**
         * 停止所有声音（含背景音乐），并进入静音状态；同时切换按钮显示（只显示“开启声音”）
         */


        onStopAllSounds() {
          var am = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance || this.getAudioManagerFromScene();

          if (am) {
            // 兼容：老版本 AudioManager 可能还没有 stopAllSounds 方法
            var anyAm = am;

            if (typeof anyAm.stopAllSounds === 'function') {
              anyAm.stopAllSounds();
            } else {
              console.warn('[AudioControl] stopAllSounds 方法不存在，暂不做静音处理');
            }
          }

          this._syncAudioButtonVisibility();
        }
        /**
         * 解除静音；同时切换按钮显示（只显示“停止声音”）
         */


        onResumeSounds() {
          var am = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance || this.getAudioManagerFromScene();

          if (am) {
            var anyAm = am;

            if (typeof anyAm.resumeSounds === 'function') {
              anyAm.resumeSounds();
            } else {
              console.warn('[AudioControl] resumeSounds 方法不存在，暂不恢复静音状态');
            }
          }

          this._syncAudioButtonVisibility();
        }
        /** 根据当前是否静音，只显示“停止声音”或只显示“开启声音” */


        _syncAudioButtonVisibility() {
          var muted = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance ? (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance.isSoundMuted : false;

          if (this.stopSoundButton) {
            this.stopSoundButton.active = !muted;
          }

          if (this.resumeSoundButton) {
            this.resumeSoundButton.active = muted;
          }
        }
        /** 从当前场景中查找 AudioManager 组件（单例不可用时使用） */


        getAudioManagerFromScene() {
          var scene = director.getScene();

          if (scene) {
            var am = scene.getComponentInChildren(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager);
            if (am) return am;
          }

          var fallback = find('AudioManager') || find('Canvas/AudioManager');
          return fallback ? fallback.getComponent(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager) : null;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "stopSoundButton", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "resumeSoundButton", [_dec3], {
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
//# sourceMappingURL=e4db59bfa926d8495bf18bc8112e59a004e89ef3.js.map
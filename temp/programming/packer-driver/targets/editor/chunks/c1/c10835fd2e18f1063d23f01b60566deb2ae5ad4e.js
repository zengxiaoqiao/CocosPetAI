System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Button, Vec3, sys, native, director, find, UIOpacity, PetValue, AudioManager, DogController, CatController, TokitChatService, AIChatDemo, NativeASR, PetInfoBar, PetVocalizer, PetWake, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _crd, ccclass, property, STORAGE_KEY_PET, MicroState, BtnMicroRecord;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPetValue(extras) {
    _reporterNs.report("PetValue", "./PetValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "./AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDogController(extras) {
    _reporterNs.report("DogController", "./DogController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCatController(extras) {
    _reporterNs.report("CatController", "./CatController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTokitChatService(extras) {
    _reporterNs.report("TokitChatService", "./llm_v2/TokitChatService", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAIChatDemo(extras) {
    _reporterNs.report("AIChatDemo", "./AIchatDemo", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNativeASR(extras) {
    _reporterNs.report("NativeASR", "./NativeASR", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetInfoBar(extras) {
    _reporterNs.report("PetInfoBar", "./PetInfoBar", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetVocalizer(extras) {
    _reporterNs.report("PetVocalizer", "./PetVocalizer", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetWake(extras) {
    _reporterNs.report("PetWake", "./PetWake", _context.meta, extras);
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
      Label = _cc.Label;
      Button = _cc.Button;
      Vec3 = _cc.Vec3;
      sys = _cc.sys;
      native = _cc.native;
      director = _cc.director;
      find = _cc.find;
      UIOpacity = _cc.UIOpacity;
    }, function (_unresolved_2) {
      PetValue = _unresolved_2.PetValue;
    }, function (_unresolved_3) {
      AudioManager = _unresolved_3.AudioManager;
    }, function (_unresolved_4) {
      DogController = _unresolved_4.DogController;
    }, function (_unresolved_5) {
      CatController = _unresolved_5.CatController;
    }, function (_unresolved_6) {
      TokitChatService = _unresolved_6.TokitChatService;
    }, function (_unresolved_7) {
      AIChatDemo = _unresolved_7.AIChatDemo;
    }, function (_unresolved_8) {
      NativeASR = _unresolved_8.NativeASR;
    }, function (_unresolved_9) {
      PetInfoBar = _unresolved_9.PetInfoBar;
    }, function (_unresolved_10) {
      PetVocalizer = _unresolved_10.PetVocalizer;
    }, function (_unresolved_11) {
      PetWake = _unresolved_11.PetWake;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "99339+ngHdJkpYcUGVkr5k1", "BtnMicroRecord", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Button', 'EventTouch', 'Vec3', 'sys', 'native', 'director', 'find', 'UIOpacity']);

      ({
        ccclass,
        property
      } = _decorator);
      STORAGE_KEY_PET = 'petai_pet_choice';
      /** 麦克风按钮的 5 个状态 */

      _export("MicroState", MicroState = /*#__PURE__*/function (MicroState) {
        MicroState["Ready"] = "ready";
        MicroState["Recording"] = "recording";
        MicroState["Thinking"] = "thinking";
        return MicroState;
      }({}));
      /**
       * 麦克风按钮：3 个状态（ready → recording → thinking）。
       * 长按录音，松开发送。根据 PetValue.canUseMicro() 控制是否可用。
       * 说明：不再朗读文字（避免“宠物说人话”），收到回复只做拟声 + 动作，并在 info bar 显示文字。
       */


      _export("BtnMicroRecord", BtnMicroRecord = (_dec = ccclass('BtnMicroRecord'), _dec2 = property(Label), _dec3 = property(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
        error: Error()
      }), PetValue) : PetValue), _dec4 = property(Button), _dec5 = property(Node), _dec6 = property({
        type: Node,
        tooltip: '1. 准备阶段节点，进游戏默认显示'
      }), _dec7 = property({
        type: Node,
        tooltip: '2. 录音中节点，长按时显示'
      }), _dec8 = property({
        type: Node,
        tooltip: '4. 等待回复节点，狗狗 thinking'
      }), _dec9 = property({
        type: Node,
        tooltip: '5. 播放语音节点，狗狗 talking'
      }), _dec10 = property({
        type: Node,
        tooltip: 'thinking/talking 内的停止按钮，可绑定或自动按名 stop/btn_stop 查找'
      }), _dec11 = property({
        type: Node,
        tooltip: '麦克风按钮容器（兼容旧字段）'
      }), _dec12 = property({
        type: Node,
        tooltip: '录音中节点（兼容旧字段，优先用 recordingNode）'
      }), _dec13 = property(Node), _dec14 = property({
        type: Node,
        tooltip: '松开后显示的“已发送”节点'
      }), _dec15 = property({
        tooltip: '点击时节点缩放倍数'
      }), _dec16 = property({
        tooltip: '按下超过此秒数视为长按录音'
      }), _dec17 = property({
        tooltip: '自动收音（免按键）：检测到开口自动开始录音，静音后自动结束并发送'
      }), _dec18 = property({
        tooltip: '自动收音：进入页面后自动申请麦克风并开始监听（前台）'
      }), _dec19 = property({
        tooltip: '失效时按钮透明度（0-255）'
      }), _dec20 = property(_crd && DogController === void 0 ? (_reportPossibleCrUseOfDogController({
        error: Error()
      }), DogController) : DogController), _dec21 = property(_crd && CatController === void 0 ? (_reportPossibleCrUseOfCatController({
        error: Error()
      }), CatController) : CatController), _dec22 = property({
        type: _crd && AIChatDemo === void 0 ? (_reportPossibleCrUseOfAIChatDemo({
          error: Error()
        }), AIChatDemo) : AIChatDemo,
        tooltip: '可选：绑定后麦克风语音走同一 AI'
      }), _dec23 = property({
        tooltip: 'API 密钥，不填则用 AIChatDemo 里配置的'
      }), _dec(_class = (_class2 = class BtnMicroRecord extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "resultLabel", _descriptor, this);

          _initializerDefineProperty(this, "petValue", _descriptor2, this);

          _initializerDefineProperty(this, "button", _descriptor3, this);

          _initializerDefineProperty(this, "iconNode", _descriptor4, this);

          _initializerDefineProperty(this, "readyNode", _descriptor5, this);

          _initializerDefineProperty(this, "recordingNode", _descriptor6, this);

          _initializerDefineProperty(this, "thinkingNode", _descriptor7, this);

          _initializerDefineProperty(this, "talkingNode", _descriptor8, this);

          _initializerDefineProperty(this, "stopButtonNode", _descriptor9, this);

          _initializerDefineProperty(this, "btnMicro", _descriptor10, this);

          _initializerDefineProperty(this, "btnRecording", _descriptor11, this);

          _initializerDefineProperty(this, "sentStateNode", _descriptor12, this);

          _initializerDefineProperty(this, "sentNode", _descriptor13, this);

          _initializerDefineProperty(this, "chatUrl", _descriptor14, this);

          _initializerDefineProperty(this, "clickScale", _descriptor15, this);

          _initializerDefineProperty(this, "longPressThreshold", _descriptor16, this);

          _initializerDefineProperty(this, "autoVoice", _descriptor17, this);

          _initializerDefineProperty(this, "autoVoiceAutoStart", _descriptor18, this);

          _initializerDefineProperty(this, "disabledOpacity", _descriptor19, this);

          _initializerDefineProperty(this, "dogController", _descriptor20, this);

          _initializerDefineProperty(this, "catController", _descriptor21, this);

          _initializerDefineProperty(this, "aiChatDemo", _descriptor22, this);

          _initializerDefineProperty(this, "apiKey", _descriptor23, this);

          this._state = MicroState.Ready;
          this._isRecording = false;
          this._wasRecordingThisTouch = false;
          this._normalScale = new Vec3(1, 1, 1);
          this._clickScaleVec = new Vec3(1.1, 1.1, 1.1);
          this._longPressScheduled = false;
          this._pressStartMs = 0;
          this._stoppedByUser = false;
          this._allStopButtons = [];
          this._autoStarted = false;
          this._nativeAsrPolling = false;

          /** 手动长按录音是否使用 NativeASR（真机原生环境优先） */
          this._usingNativeAsrManual = false;
          this._nativeAsrManualRetriesLeft = 0;
          this._nativeAsrManualTrySeconds = 0;

          /** 松手后多次 poll 中取最长文本，避免抢先消耗局部识别结果 */
          this._nativeAsrManualBestText = '';

          /** 连续若干次 poll 未拿到更长文本（通常为空），用于判定识别已收尾 */
          this._nativeAsrManualIdlePolls = 0;
          this._nativeAsrManualStopMs = 0;
        }

        onLoad() {
          this._clickScaleVec.x = this._clickScaleVec.y = this._clickScaleVec.z = this.clickScale;
          if (!this.btnMicro) this.btnMicro = this.node;
          if (this.apiKey) (_crd && TokitChatService === void 0 ? (_reportPossibleCrUseOfTokitChatService({
            error: Error()
          }), TokitChatService) : TokitChatService).apiKey = this.apiKey;
          this.node.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
          this.node.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
          const btn = this.button || this.node.getComponent(Button);
          if (btn) this.node.on(Button.EventType.CLICK, this.onMicroButtonClick, this);

          this._ensureNodes();

          this._applyState(MicroState.Ready);
        }

        onDestroy() {
          this._stopAutoVoice();

          this.unschedule(this._enterRecordingMode);
          this.unschedule(this._refreshCanUseState);
          this.node.off(Node.EventType.TOUCH_START, this._onTouchStart, this);
          this.node.off(Node.EventType.TOUCH_END, this._onTouchEnd, this);
          this.node.off(Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
          this.node.off(Button.EventType.CLICK, this.onMicroButtonClick, this);
        }

        start() {
          this._applyState(MicroState.Ready);

          this.schedule(this._refreshCanUseState, 1, Infinity);
          if (this.autoVoice && this.autoVoiceAutoStart) this._startAutoVoice();
        }

        onDisable() {
          this.unschedule(this._refreshCanUseState);

          this._stopAutoVoice();
        }
        /** 确保 petValue 可用：未绑定时按路径查找 */


        _ensurePetValue() {
          var _director$getScene;

          if (this.petValue) return this.petValue;
          const n = find('Canvas/pet_value');
          this.petValue = n ? n.getComponent(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue) : null;
          if (!this.petValue) this.petValue = ((_director$getScene = director.getScene()) == null ? void 0 : _director$getScene.getComponentInChildren(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue)) || null;
          return this.petValue;
        }
        /** 定期刷新可用状态（体力/亲密变化时） */


        _refreshCanUseState() {
          this._ensurePetValue();

          if (this._state === MicroState.Ready || this._state === MicroState.Recording) {
            this._applyState(this._state);
          } // 体力/心情不可用时，自动收音也暂停


          if (this.autoVoice) {
            const pv = this._ensurePetValue();

            const canUse = !pv || pv.canUseMicro();
            if (!canUse) this._stopAutoVoice();else if (this.autoVoiceAutoStart) this._startAutoVoice();
          }
        }
        /** 兜底查找 ready/recording/thinking/talking 节点 */


        _ensureNodes() {
          const root = this.btnMicro || this.node;
          if (!this.readyNode) this.readyNode = root.getChildByName('ready') || null;
          if (!this.recordingNode) this.recordingNode = this.btnRecording || root.getChildByName('recording') || null;
          if (!this.thinkingNode) this.thinkingNode = root.getChildByName('thinking') || null;
          if (!this.talkingNode) this.talkingNode = root.getChildByName('talking') || null;
          if (!this.iconNode && this.readyNode) this.iconNode = this.readyNode.getChildByName('Sprite') || this.readyNode.children[0] || null; // Stop button is no longer needed; keep field for scene compatibility but do not auto-find/bind.
        }

        _applyStopButtonsVisibility(visible) {
          for (const n of this._allStopButtons) {
            if (n != null && n.isValid) n.active = visible;
          }
        }

        _applyState(state) {
          this._state = state;
          const root = this.btnMicro || this.node;

          const pv = this._ensurePetValue();

          const canUse = !pv || pv.canUseMicro();
          if (this.readyNode) this.readyNode.active = state === MicroState.Ready;
          if (this.recordingNode) this.recordingNode.active = state === MicroState.Recording;
          if (this.thinkingNode) this.thinkingNode.active = state === MicroState.Thinking; // talkingNode is kept for scene compatibility but no longer used.

          if (this.talkingNode) this.talkingNode.active = false; // sentNode/sentStateNode visibility is managed by _showSentBriefly()

          if (this.iconNode) this.iconNode.active = state === MicroState.Ready;
          const showStop = false;
          if (this.stopButtonNode) this.stopButtonNode.active = false;

          this._applyStopButtonsVisibility(showStop);

          const btn = this.button || this.node.getComponent(Button);
          if (btn) btn.interactable = canUse && (state === MicroState.Ready || state === MicroState.Recording);

          this._applyDisabledOpacity(root, !canUse && state === MicroState.Ready); // 录音 / 思考 / 播报期间降低背景音乐音量，结束后恢复


          if (state === MicroState.Recording || state === MicroState.Thinking) {
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).enterVoicePriority();
          } else if (state === MicroState.Ready) {
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).exitVoicePriority();
          }
        }

        _applyDisabledOpacity(target, disabled) {
          let opacity = target.getComponent(UIOpacity);
          if (!opacity) opacity = target.addComponent(UIOpacity);
          opacity.opacity = disabled ? this.disabledOpacity : 255;
        }

        _onTouchStart(e) {
          if (this.autoVoice) return;

          const pv = this._ensurePetValue();

          if (pv && !pv.canUseMicro()) return;
          if (this._state !== MicroState.Ready) return;
          this._wasRecordingThisTouch = false;
          this._stoppedByUser = false;
          this.node.setScale(this._clickScaleVec);
          this._isRecording = false;
          this._pressStartMs = Date.now();
          this._longPressScheduled = true;
          this.scheduleOnce(this._enterRecordingMode, this.longPressThreshold);
        }

        _enterRecordingMode() {
          var _instance;

          this._longPressScheduled = false;
          this._isRecording = true;
          this._wasRecordingThisTouch = true;

          this._applyState(MicroState.Recording);

          this._playRecordStartSound();

          (_instance = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
            error: Error()
          }), PetInfoBar) : PetInfoBar).instance) == null || _instance.showUserHint('录音中…', 1);

          this._startRecording();
        }
        /** 供 Button 的 Click 事件绑定：仅点击时触发。未授权时在此请求麦克风权限。 */


        onMicroButtonClick() {
          var _instance2;

          if (this.autoVoice) return;
          if (this._wasRecordingThisTouch) return;
          (_instance2 = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance) == null || _instance2.playClickSound(); // Web mic flow removed. Click now only serves as a gentle hint.

          this.showHint(sys.isNative ? '按住说话' : '仅真机支持语音');
        }

        _playRecordStartSound() {
          const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';

          if (isCat) {
            var _this$catController;

            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).playAnimSoundCat15();
            (_this$catController = this.catController) == null || _this$catController.playMicroRecordStart();
          } else {
            var _this$dogController;

            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).playAnimSoundDog15();
            (_this$dogController = this.dogController) == null || _this$dogController.playMicroRecordStart();
          }
        }

        _playRecordSentSound() {
          const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';

          if (isCat) {
            var _this$catController2;

            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).playAnimSoundCat15();
            (_this$catController2 = this.catController) == null || _this$catController2.playMicroRecordSent();
          } else {
            var _this$dogController2;

            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).playAnimSoundDog15();
            (_this$dogController2 = this.dogController) == null || _this$dogController2.playMicroRecordSent();
          }
        }

        _playThinkingSound() {
          const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';

          if (isCat) {
            var _this$catController3;

            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).playAnimSoundCat15();
            (_this$catController3 = this.catController) == null || _this$catController3.playMicroThinking();
          } else {
            var _this$dogController3;

            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).playAnimSoundDog15();
            (_this$dogController3 = this.dogController) == null || _this$dogController3.playMicroThinking();
          }
        }

        _playTalkingSound() {
          const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';

          if (isCat) {
            var _this$catController4;

            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).playAnimSoundCat17();
            (_this$catController4 = this.catController) == null || _this$catController4.playMicroTalking();
          } else {
            var _this$dogController4;

            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).playAnimSoundDog17();
            (_this$dogController4 = this.dogController) == null || _this$dogController4.playMicroTalking();
          }
        }

        _onTouchEnd() {
          if (this.autoVoice) return;
          this.node.setScale(this._normalScale);

          if (this._longPressScheduled) {
            this.unschedule(this._enterRecordingMode);
            this._longPressScheduled = false; // User didn't hold long enough to start recording: give a clear hint.
            // (Prevents "nothing happened" feeling on device.)

            const heldMs = Math.max(0, Date.now() - (this._pressStartMs || 0));

            if (heldMs >= 120) {
              this.showHint('按住说话');
            }

            return;
          }

          if (!this._isRecording) return;
          this._isRecording = false;

          this._stopRecordingAndSend();
        }
        /** 开始录音（仅 NativeASR；已移除 Web 收音链路） */


        _startRecording() {
          if (!(_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
            error: Error()
          }), NativeASR) : NativeASR).isSupported()) {
            this._usingNativeAsrManual = false;

            this._handleNotSent('仅真机支持语音');

            return;
          }

          this._usingNativeAsrManual = true; // Android: request mic permission if needed (best-effort).

          if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
            try {
              var _nat$reflection;

              const nat = native;

              if (nat != null && (_nat$reflection = nat.reflection) != null && _nat$reflection.callStaticMethod) {
                nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'requestRecordAudioPermissionIfNeeded', '()V');
              }
            } catch {
              /* ignore */
            }
          }

          try {
            (_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
              error: Error()
            }), NativeASR) : NativeASR).startOnce();
          } catch {
            /* ignore */
          }
        }
        /** 停止录音（不发送） */


        _stopRecording() {
          if (this._usingNativeAsrManual && (_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
            error: Error()
          }), NativeASR) : NativeASR).isSupported()) {
            this._usingNativeAsrManual = false;

            try {
              (_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
                error: Error()
              }), NativeASR) : NativeASR).stop();
            } catch {
              /* ignore */
            }
          }
        }
        /** 停止录音并发送 */


        _stopRecordingAndSend() {
          if (this._usingNativeAsrManual && (_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
            error: Error()
          }), NativeASR) : NativeASR).isSupported()) {
            var _instance3;

            this._usingNativeAsrManual = false;

            try {
              (_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
                error: Error()
              }), NativeASR) : NativeASR).stopOnce();
            } catch {
              /* ignore */
            } // Immediate UX feedback: user released, we are processing (even if ASR final text arrives slightly later).


            this._applyState(MicroState.Thinking);

            this._playThinkingSound();

            (_crd && PetWake === void 0 ? (_reportPossibleCrUseOfPetWake({
              error: Error()
            }), PetWake) : PetWake).nudgeAwake();
            (_instance3 = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
              error: Error()
            }), PetInfoBar) : PetInfoBar).instance) == null || _instance3.showUserHint('我想想…', 2); // Native ASR: stopOnce 在 Android 上走 UI 线程队列，若立刻 poll 会先读到较早的局部结果。
            // 延后首轮轮询，并在整个窗口内保留「更长」的文本，稳定后再发送。

            this._nativeAsrManualBestText = '';
            this._nativeAsrManualIdlePolls = 0;
            this._nativeAsrManualStopMs = Date.now();
            this._nativeAsrManualRetriesLeft = 28; // ~4.2s total（首轮另有延迟）

            this._nativeAsrManualTrySeconds = 0;
            this.scheduleOnce(() => this._pollNativeAsrManualOnce(), 0.12);
            return;
          }

          this._handleNotSent('仅真机支持语音');
        }

        _pollNativeAsrManualOnce() {
          let t = '';

          try {
            t = ((_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
              error: Error()
            }), NativeASR) : NativeASR).pollResult() || '').trim();
          } catch {
            t = '';
          }

          if (t.length > this._nativeAsrManualBestText.length) {
            this._nativeAsrManualBestText = t;
            this._nativeAsrManualIdlePolls = 0;
          } else if (!t) {
            this._nativeAsrManualIdlePolls++;
          }

          const elapsed = Date.now() - this._nativeAsrManualStopMs;

          const canFinalize = this._nativeAsrManualBestText.length > 0 && this._nativeAsrManualIdlePolls >= 4 && elapsed >= 500;

          if (canFinalize) {
            this._beginSendWithText(this._nativeAsrManualBestText);

            return;
          } // If Android recognizer is erroring, stop waiting and show a concrete hint.


          if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
            const dbg = ((_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
              error: Error()
            }), NativeASR) : NativeASR).pollDebug() || '').trim();

            if (dbg) {
              const parts = dbg.split(',');
              const err = parts.length >= 2 ? parseInt(parts[1], 10) : 0;

              if (err) {
                var _instance4;

                let msg = `识别失败（${err}）`; // Common SpeechRecognizer errors:
                // 2: ERROR_AUDIO, 7: ERROR_NO_MATCH, 8: ERROR_RECOGNIZER_BUSY, 9: ERROR_INSUFFICIENT_PERMISSIONS

                if (err === 2) msg = '麦克风音频错误（可能被占用）';else if (err === 7) msg = '没听清（没有匹配）';else if (err === 8) msg = '识别繁忙，稍后再试';else if (err === 9) msg = '没有麦克风权限';
                (_instance4 = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
                  error: Error()
                }), PetInfoBar) : PetInfoBar).instance) == null || _instance4.showUserHint(msg, 2);

                this._handleNotSent(msg);

                return;
              }
            }
          }

          this._nativeAsrManualRetriesLeft = Math.max(0, this._nativeAsrManualRetriesLeft - 1);

          if (this._nativeAsrManualRetriesLeft <= 0) {
            if (this._nativeAsrManualBestText.length > 0) {
              this._beginSendWithText(this._nativeAsrManualBestText);
            } else {
              var _instance5;

              (_instance5 = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
                error: Error()
              }), PetInfoBar) : PetInfoBar).instance) == null || _instance5.showUserHint('唔…没听清', 2);

              this._handleNotSent('唔…没听清');
            }

            return;
          }

          this.scheduleOnce(() => this._pollNativeAsrManualOnce(), 0.15);
        }
        /** 短暂显示“已发送” */


        _showSentBriefly() {
          const sent = this.sentNode || this.sentStateNode;

          if (sent && this.btnMicro) {
            if (sent.parent !== this.btnMicro) this.btnMicro.addChild(sent);
            sent.active = true;
            this.scheduleOnce(() => {
              if (sent != null && sent.isValid) sent.active = false;
            }, 1);
          }

          if (this.resultLabel) this.resultLabel.string = '已发送';
        }

        _beginSendWithText(text) {
          const t = (text || '').trim();

          if (!t) {
            this._handleNotSent('唔…没听清');

            return;
          }

          this._playRecordSentSound();

          this._showSentBriefly();

          this._applyState(MicroState.Thinking);

          this._playThinkingSound();

          (_crd && PetWake === void 0 ? (_reportPossibleCrUseOfPetWake({
            error: Error()
          }), PetWake) : PetWake).nudgeAwake();

          this._sendToAI(t);
        }

        _handleNotSent(hint) {
          // Show a short hint and return to ready.
          this._applyState(MicroState.Ready);

          this.showHint(hint); // Auto voice: resume listening if enabled.

          if (this.autoVoice && this.autoVoiceAutoStart && this._autoStarted && (_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
            error: Error()
          }), NativeASR) : NativeASR).isSupported()) {
            this._startNativeAsrLoop();
          }
        }
        /** 发送文本到 AI：强制只走 TokitChatService */


        async _sendToAI(text) {
          try {
            const withTimeout = async (p, ms) => {
              return await Promise.race([p, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);
            };

            const reply = await withTimeout((_crd && TokitChatService === void 0 ? (_reportPossibleCrUseOfTokitChatService({
              error: Error()
            }), TokitChatService) : TokitChatService).sendMessage(text), 60000);
            if (this._stoppedByUser) return;

            this._playVocalAndFinish(reply);
          } catch (e) {
            if (this._stoppedByUser) return;
            console.warn('[BtnMicroRecord] AI chat failed', e);
            const msg = e instanceof Error && e.message === 'timeout' ? '没收到回复' : '呜…没发出';

            this._handleNotSent(msg);
          }
        } // _mockFlow removed: we don't show local preset replies anymore.

        /** 收到回复：不朗读文字，只做拟声 + 动作，并在 info bar 显示文字 */


        _playVocalAndFinish(text) {
          if (this._stoppedByUser) return;
          const t = (text || '').trim();

          if (t) {
            var _instance6;

            (_instance6 = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
              error: Error()
            }), PetInfoBar) : PetInfoBar).instance) == null || _instance6.showUserHint(t, 6);
            (_crd && PetWake === void 0 ? (_reportPossibleCrUseOfPetWake({
              error: Error()
            }), PetWake) : PetWake).wakeToRespond();
            (_crd && PetVocalizer === void 0 ? (_reportPossibleCrUseOfPetVocalizer({
              error: Error()
            }), PetVocalizer) : PetVocalizer).playReplyVocal(t);
          } // Slight delay so user can perceive response state/sound.


          this.scheduleOnce(() => this._finishTalking(''), 0.8);
        }

        _finishTalking(_reply) {
          this._applyState(MicroState.Ready);

          if (this.resultLabel) this.resultLabel.string = ''; // Auto voice: after speaking, resume listening.

          if (this.autoVoice && this.autoVoiceAutoStart && this._autoStarted && (_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
            error: Error()
          }), NativeASR) : NativeASR).isSupported()) {
            this._startNativeAsrLoop();
          }
        }
        /** 显示统一提示文本（2 秒后自动清空），供外部也可调用 */


        showHint(text) {
          if (this.resultLabel) {
            this.resultLabel.string = text;
            this.scheduleOnce(() => {
              var _this$resultLabel;

              if ((_this$resultLabel = this.resultLabel) != null && _this$resultLabel.node.isValid) this.resultLabel.string = '';
            }, 2);
          }
        }
        /** 当前状态（供外部查询） */


        get state() {
          return this._state;
        }
        /** 停止当前发送/思考/讲话，回到 ready 状态（供 thinking/talking 内停止按钮调用） */


        stopAndBackToReady() {
          if (this._state !== MicroState.Thinking && this._state !== MicroState.Recording) return;

          try {
            var _this$dogController5, _this$catController5;

            this._stoppedByUser = true;
            this.unschedule(this._pollNativeAsrResult);
            this.unschedule(this._mockFlow);

            this._stopRecording();

            (_this$dogController5 = this.dogController) == null || _this$dogController5.playIdle();
            (_this$catController5 = this.catController) == null || _this$catController5.playIdle();

            this._applyState(MicroState.Ready);

            if (this.resultLabel) this.resultLabel.string = '';
          } catch (e) {
            console.warn('[BtnMicroRecord] stopAndBackToReady error:', e);
          }
        }

        async _startAutoVoice() {
          if (this._autoStarted) return;
          if (!this.autoVoice) return;

          const pv = this._ensurePetValue();

          if (pv && !pv.canUseMicro()) return;

          if (!(_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
            error: Error()
          }), NativeASR) : NativeASR).isSupported()) {
            // Web auto-voice removed.
            this.showHint('仅真机支持语音');
            return;
          }

          this._autoStarted = true;

          this._startNativeAsrLoop();
        }

        _stopAutoVoice() {
          if (!this._autoStarted) return;
          this._autoStarted = false;

          this._stopNativeAsrLoop(); // 如果正在录音，直接走发送（避免用户说到一半退出页面丢失）


          if (this._state === MicroState.Recording && this._isRecording) {
            this._isRecording = false;

            this._stopRecordingAndSend();
          }
        }

        _startNativeAsrLoop() {
          if (this._nativeAsrPolling) return;
          this._nativeAsrPolling = true;
          this._stoppedByUser = false;
          (_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
            error: Error()
          }), NativeASR) : NativeASR).start(); // Show "listening" state

          if (this._state === MicroState.Ready) {
            this._applyState(MicroState.Recording);

            this._playRecordStartSound();
          }

          this.schedule(this._pollNativeAsrResult, 0.2, Infinity);
        }

        _stopNativeAsrLoop() {
          if (!this._nativeAsrPolling) return;
          this._nativeAsrPolling = false;
          this.unschedule(this._pollNativeAsrResult);
          (_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
            error: Error()
          }), NativeASR) : NativeASR).stop();

          if (this._state === MicroState.Recording) {
            this._applyState(MicroState.Ready);
          }
        }

        _pollNativeAsrResult() {
          if (!this.autoVoice || !this._autoStarted || !this._nativeAsrPolling) return;
          if (this._state === MicroState.Thinking || this._state === MicroState.Talking || this._stoppedByUser) return;

          const pv = this._ensurePetValue();

          if (pv && !pv.canUseMicro()) return;
          const text = ((_crd && NativeASR === void 0 ? (_reportPossibleCrUseOfNativeASR({
            error: Error()
          }), NativeASR) : NativeASR).pollResult() || '').trim();
          if (!text) return; // Got transcript -> send to AI.

          this._stopNativeAsrLoop();

          this._playRecordSentSound();

          this._showSentBriefly();

          this._applyState(MicroState.Thinking);

          this._playThinkingSound();

          this._sendToAI(text);
        } // Web VAD removed.


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "resultLabel", [_dec2], {
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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "button", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "iconNode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "readyNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "recordingNode", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "thinkingNode", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "talkingNode", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "stopButtonNode", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "btnMicro", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "btnRecording", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "sentStateNode", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "sentNode", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "chatUrl", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "clickScale", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.1;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "longPressThreshold", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.6;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "autoVoice", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "autoVoiceAutoStart", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "disabledOpacity", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 130;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "dogController", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "catController", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "aiChatDemo", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "apiKey", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c10835fd2e18f1063d23f01b60566deb2ae5ad4e.js.map
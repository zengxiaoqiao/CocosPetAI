System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, EditBox, Label, Button, Node, TokitChatService, PetInfoBar, PetVocalizer, PetWake, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, AIChatDemo;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfTokitChatService(extras) {
    _reporterNs.report("TokitChatService", "./llm_v2/TokitChatService", _context.meta, extras);
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
      EditBox = _cc.EditBox;
      Label = _cc.Label;
      Button = _cc.Button;
      Node = _cc.Node;
    }, function (_unresolved_2) {
      TokitChatService = _unresolved_2.TokitChatService;
    }, function (_unresolved_3) {
      PetInfoBar = _unresolved_3.PetInfoBar;
    }, function (_unresolved_4) {
      PetVocalizer = _unresolved_4.PetVocalizer;
    }, function (_unresolved_5) {
      PetWake = _unresolved_5.PetWake;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "af2a57T6Y9GmqHULeAb22pF", "AIchatDemo", undefined);

      __checkObsolete__(['_decorator', 'Component', 'EditBox', 'Label', 'Button', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AIChatDemo", AIChatDemo = (_dec = ccclass('AIChatDemo'), _dec2 = property(EditBox), _dec3 = property(Label), _dec4 = property(Button), _dec5 = property({
        tooltip: 'Tokit API Key，配置后 BtnMicroRecord 语音也会走同一 AI'
      }), _dec6 = property({
        tooltip: '兼容旧字段（不再使用）'
      }), _dec7 = property({
        tooltip: '兼容旧字段（不再使用）'
      }), _dec8 = property({
        tooltip: '无输入框时：启动即自动发一条消息（仅用于 Demo 调试）',
        displayName: 'Auto Test On Start'
      }), _dec9 = property({
        tooltip: '自动测试要发的内容',
        displayName: 'Auto Test Message'
      }), _dec(_class = (_class2 = class AIChatDemo extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "userInput", _descriptor, this);

          _initializerDefineProperty(this, "aiReplyLabel", _descriptor2, this);

          _initializerDefineProperty(this, "sendBtn", _descriptor3, this);

          /** API 密钥（仅本地用，勿提交！配置后会同步到 TokitChatService） */
          _initializerDefineProperty(this, "apiKey", _descriptor4, this);

          _initializerDefineProperty(this, "cozeToken", _descriptor5, this);

          _initializerDefineProperty(this, "cozeBotId", _descriptor6, this);

          _initializerDefineProperty(this, "autoTestOnStart", _descriptor7, this);

          _initializerDefineProperty(this, "autoTestMessage", _descriptor8, this);
        }

        onLoad() {
          if (this.apiKey) (_crd && TokitChatService === void 0 ? (_reportPossibleCrUseOfTokitChatService({
            error: Error()
          }), TokitChatService) : TokitChatService).apiKey = this.apiKey;

          this._bindSendBtn();

          if (this.autoTestOnStart) {
            // Fire-and-forget demo test (no UI bindings required)
            this._runAutoTest();
          }
        }

        start() {
          // Double-bind to avoid missed bindings in some scene reload paths.
          this._bindSendBtn();
        }

        _bindSendBtn() {
          if (!this.sendBtn) return;

          try {
            // Ensure button is actually clickable.
            this.sendBtn.enabled = true;
            this.sendBtn.interactable = true;
            this.sendBtn.node.off(Button.EventType.CLICK, this.sendMessage, this);
            this.sendBtn.node.on(Button.EventType.CLICK, this.sendMessage, this); // Fallback touch hook (no UI text hint)

            this.sendBtn.node.off(Node.EventType.TOUCH_END, this._onSendBtnTouchEnd, this);
            this.sendBtn.node.on(Node.EventType.TOUCH_END, this._onSendBtnTouchEnd, this);
          } catch {// ignore
          }
        }

        _onSendBtnTouchEnd() {// Intentionally no text: user requested not to show "clicked" hints.
        }

        async _runAutoTest() {
          const label = this.aiReplyLabel;
          const msg = (this.autoTestMessage || '').trim() || '你好';

          try {
            if (label) label.string = '…';
            (_crd && PetWake === void 0 ? (_reportPossibleCrUseOfPetWake({
              error: Error()
            }), PetWake) : PetWake).nudgeAwake();
            const reply = await (_crd && TokitChatService === void 0 ? (_reportPossibleCrUseOfTokitChatService({
              error: Error()
            }), TokitChatService) : TokitChatService).sendMessage(msg);
            console.log('[AIChatDemo] autoTest reply:', reply);
            if (label) label.string = reply || '(empty)';

            if (reply) {
              var _instance;

              (_instance = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
                error: Error()
              }), PetInfoBar) : PetInfoBar).instance) == null || _instance.showUserHint(reply, 6);
              (_crd && PetWake === void 0 ? (_reportPossibleCrUseOfPetWake({
                error: Error()
              }), PetWake) : PetWake).wakeToRespond();
              (_crd && PetVocalizer === void 0 ? (_reportPossibleCrUseOfPetVocalizer({
                error: Error()
              }), PetVocalizer) : PetVocalizer).playReplyVocal(reply);
            }
          } catch (e) {
            console.warn('[AIChatDemo] autoTest error:', e);
            if (label) label.string = '出错了';
          }
        }

        async sendMessage() {
          var _input$string$trim, _input$string, _instance3;

          const input = this.userInput;
          const label = this.aiReplyLabel;
          const msg = (_input$string$trim = input == null || (_input$string = input.string) == null ? void 0 : _input$string.trim()) != null ? _input$string$trim : '';

          if (!msg) {
            var _instance2;

            if (label) label.string = '请输入对话内容~';
            (_instance2 = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
              error: Error()
            }), PetInfoBar) : PetInfoBar).instance) == null || _instance2.showUserHint('唔…说点啥', 2);
            return;
          } // Only show "..." while waiting (no "you:" / "pet:" prefixes)


          (_instance3 = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
            error: Error()
          }), PetInfoBar) : PetInfoBar).instance) == null || _instance3.showUserHint('…', 1.2); // If pet is sleeping/idle, nudge it awake for "thinking".

          (_crd && PetWake === void 0 ? (_reportPossibleCrUseOfPetWake({
            error: Error()
          }), PetWake) : PetWake).nudgeAwake();
          if (this.sendBtn) this.sendBtn.interactable = false;
          if (label) label.string = '…';

          try {
            const reply = await (_crd && TokitChatService === void 0 ? (_reportPossibleCrUseOfTokitChatService({
              error: Error()
            }), TokitChatService) : TokitChatService).sendMessage(msg);
            if (label) label.string = reply;

            if (reply) {
              var _instance4;

              (_instance4 = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
                error: Error()
              }), PetInfoBar) : PetInfoBar).instance) == null || _instance4.showUserHint(reply, 6);
              (_crd && PetWake === void 0 ? (_reportPossibleCrUseOfPetWake({
                error: Error()
              }), PetWake) : PetWake).wakeToRespond();
              (_crd && PetVocalizer === void 0 ? (_reportPossibleCrUseOfPetVocalizer({
                error: Error()
              }), PetVocalizer) : PetVocalizer).playReplyVocal(reply);
            }

            if (input) input.string = '';
          } catch (e) {
            var _instance5;

            if (label) label.string = `出错了：${e.message}`;
            console.error('对话请求错误：', e);
            (_instance5 = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
              error: Error()
            }), PetInfoBar) : PetInfoBar).instance) == null || _instance5.showUserHint('呜…出错了', 2);
          } finally {
            if (this.sendBtn) this.sendBtn.interactable = true;
          }
        }
        /**
         * 供 BtnMicroRecord 等调用：传入文本，返回 AI 回复（不依赖 UI）
         */


        static async chat(text) {
          return (_crd && TokitChatService === void 0 ? (_reportPossibleCrUseOfTokitChatService({
            error: Error()
          }), TokitChatService) : TokitChatService).sendMessage(text);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "userInput", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "aiReplyLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "sendBtn", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "apiKey", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "cozeToken", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "cozeBotId", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "autoTestOnStart", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "autoTestMessage", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '你好';
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e2ab9b59aad373cd60baf4abde77b2a0b4498804.js.map
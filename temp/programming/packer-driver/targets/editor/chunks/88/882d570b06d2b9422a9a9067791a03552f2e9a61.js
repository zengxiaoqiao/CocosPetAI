System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, UITransform, view, sys, game, Game, Sprite, Node, Color, Button, find, Layout, Animation, clearWidgetWeather, getFirstOpenTip, getNotAgainTip, getLowHpFeedBubbleTip, getLowHpFeedEmptyTip, getSleepBubbleTip, TokitChatService, PetValue, SharedBtnCounts, TogglePet, PetButtons, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _class3, _crd, ccclass, property, STORAGE_KEY_FIRST_OPEN_DONE, PetInfoBar;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfclearWidgetWeather(extras) {
    _reporterNs.report("clearWidgetWeather", "./WidgetSync", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetFirstOpenTip(extras) {
    _reporterNs.report("getFirstOpenTip", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetNotAgainTip(extras) {
    _reporterNs.report("getNotAgainTip", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetLowHpFeedBubbleTip(extras) {
    _reporterNs.report("getLowHpFeedBubbleTip", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetLowHpFeedEmptyTip(extras) {
    _reporterNs.report("getLowHpFeedEmptyTip", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetSleepBubbleTip(extras) {
    _reporterNs.report("getSleepBubbleTip", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTokitChatService(extras) {
    _reporterNs.report("TokitChatService", "./llm_v2/TokitChatService", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetValue(extras) {
    _reporterNs.report("PetValue", "./PetValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSharedBtnCounts(extras) {
    _reporterNs.report("SharedBtnCounts", "./SharedBtnCounts", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTogglePet(extras) {
    _reporterNs.report("TogglePet", "./TogglePet", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetButtons(extras) {
    _reporterNs.report("PetButtons", "./PetButtons", _context.meta, extras);
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
      UITransform = _cc.UITransform;
      view = _cc.view;
      sys = _cc.sys;
      game = _cc.game;
      Game = _cc.Game;
      Sprite = _cc.Sprite;
      Node = _cc.Node;
      Color = _cc.Color;
      Button = _cc.Button;
      find = _cc.find;
      Layout = _cc.Layout;
      Animation = _cc.Animation;
    }, function (_unresolved_2) {
      clearWidgetWeather = _unresolved_2.clearWidgetWeather;
    }, function (_unresolved_3) {
      getFirstOpenTip = _unresolved_3.getFirstOpenTip;
      getNotAgainTip = _unresolved_3.getNotAgainTip;
      getLowHpFeedBubbleTip = _unresolved_3.getLowHpFeedBubbleTip;
      getLowHpFeedEmptyTip = _unresolved_3.getLowHpFeedEmptyTip;
      getSleepBubbleTip = _unresolved_3.getSleepBubbleTip;
    }, function (_unresolved_4) {
      TokitChatService = _unresolved_4.TokitChatService;
    }, function (_unresolved_5) {
      PetValue = _unresolved_5.PetValue;
    }, function (_unresolved_6) {
      SharedBtnCounts = _unresolved_6.SharedBtnCounts;
    }, function (_unresolved_7) {
      TogglePet = _unresolved_7.TogglePet;
    }, function (_unresolved_8) {
      PetButtons = _unresolved_8.PetButtons;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "93b5c8OXdZMKa4XF3k74hZk", "PetInfoBar", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'UITransform', 'view', 'sys', 'game', 'Game', 'Sprite', 'Node', 'Color', 'Button', 'find', 'Layout', 'Animation']);

      ({
        ccclass,
        property
      } = _decorator);
      STORAGE_KEY_FIRST_OPEN_DONE = 'petai_first_open_done';
      /**
       * 宠物主界面对话框：聊天回复、低体力喂食引导、操作提示等。
       */

      _export("PetInfoBar", PetInfoBar = (_dec = ccclass('PetInfoBar'), _dec2 = property(Label), _dec3 = property({
        tooltip: '信息条左右留白占屏幕宽度比例（0~0.5），默认每侧 10%'
      }), _dec4 = property({
        tooltip: '在比例留白之外，左右各再收紧的像素'
      }), _dec5 = property({
        tooltip: '背景相对文本的水平内边距（像素）'
      }), _dec6 = property({
        tooltip: '背景相对文本的垂直内边距（像素）'
      }), _dec7 = property({
        tooltip: '背景最小宽度（像素）'
      }), _dec8 = property({
        tooltip: '背景最小高度（像素）；pet_chat 原图高 122，勿压扁否则阴影会糊'
      }), _dec9 = property({
        tooltip: '右侧喂食图标槽宽度（像素）'
      }), _dec(_class = (_class2 = (_class3 = class PetInfoBar extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "textLabel", _descriptor, this);

          _initializerDefineProperty(this, "horizontalPaddingRatio", _descriptor2, this);

          _initializerDefineProperty(this, "horizontalEdgeInsetPx", _descriptor3, this);

          _initializerDefineProperty(this, "bubblePaddingX", _descriptor4, this);

          _initializerDefineProperty(this, "bubblePaddingY", _descriptor5, this);

          _initializerDefineProperty(this, "bubbleMinWidth", _descriptor6, this);

          _initializerDefineProperty(this, "bubbleMinHeight", _descriptor7, this);

          _initializerDefineProperty(this, "actionIconWidth", _descriptor8, this);

          this._extraText = '';
          this._firstOpenText = '';
          this._pendingFirstOpenTips = false;
          this._pendingShortLivedText = '';
          this._showingPerMinuteLimitHint = false;
          this._showingUserHint = false;
          this._greetingBarDismissed = false;
          this._feedPromptActive = false;
          this._feedPromptText = '';
          this._sleepBubbleActive = false;
          this._bubbleSprite = null;
          this._actionNode = null;
          this._actionSprite = null;
          this._chromeReady = false;

          this._dismissGreetingBar = () => {
            if (this._firstOpenText) {
              this.scheduleOnce(this._dismissGreetingBar, PetInfoBar.GREETING_BAR_DURATION);
              return;
            }

            this._greetingBarDismissed = true;

            if (!this._showingPerMinuteLimitHint && !this._showingUserHint) {
              this._syncBarVisibility();
            }

            this.refreshLowHpFeedPrompt();
            this.refreshSleepBubble(PetInfoBar.isActivePetSleeping());
          };

          this._onGameShow = () => {
            if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
              (_crd && clearWidgetWeather === void 0 ? (_reportPossibleCrUseOfclearWidgetWeather({
                error: Error()
              }), clearWidgetWeather) : clearWidgetWeather)();
            }

            this.syncPassiveBubble();
          };

          this._onGameHide = () => {// 不再向 Widget 同步主动类文案
          };

          this._onVisibilityChange = () => {
            if (typeof document === 'undefined') return;
            if (document.hidden) this._onGameHide();else this._onGameShow();
          };

          this._onFeedActionTap = () => {
            var _find;

            const toggle = (_find = find('Canvas/TogglePet')) == null ? void 0 : _find.getComponent(_crd && TogglePet === void 0 ? (_reportPossibleCrUseOfTogglePet({
              error: Error()
            }), TogglePet) : TogglePet);

            if (toggle) {
              toggle.onBtn1Click();
            } else {
              var _find2;

              (_find2 = find('Canvas')) == null || (_find2 = _find2.getComponent(_crd && PetButtons === void 0 ? (_reportPossibleCrUseOfPetButtons({
                error: Error()
              }), PetButtons) : PetButtons)) == null || _find2.onBtn1Click();
            }

            this.scheduleOnce(() => this.refreshLowHpFeedPrompt(), 0.35);
          };

          this._clearShortLivedTip = () => {
            if (!this.textLabel) return;

            if (this.textLabel.string !== this._pendingShortLivedText) {
              this._pendingShortLivedText = '';
              return;
            }

            this._pendingShortLivedText = '';
            this.textLabel.string = '';

            this._syncBarVisibility();

            this._applyText();

            this.refreshLowHpFeedPrompt();
          };

          this._clearPerMinuteLimitHint = () => {
            this.unschedule(this._clearPerMinuteLimitHint);
            this._showingPerMinuteLimitHint = false;

            this._applyText();

            this.syncPassiveBubble();
          };

          this._clearUserHint = () => {
            this.unschedule(this._clearUserHint);
            this._showingUserHint = false;

            this._applyText();

            this.syncPassiveBubble();
          };
        }

        onLoad() {
          PetInfoBar.instance = this;
          (_crd && TokitChatService === void 0 ? (_reportPossibleCrUseOfTokitChatService({
            error: Error()
          }), TokitChatService) : TokitChatService).startRemoteConfigOnLaunch();

          if (!sys.localStorage.getItem(STORAGE_KEY_FIRST_OPEN_DONE)) {
            this._pendingFirstOpenTips = true;
          }

          this._ensureBubbleChrome();
        }

        /** 当前前台狗/猫是否在播睡觉动画 03 */
        static isActivePetSleeping() {
          const isCat = sys.localStorage.getItem('petai_pet_choice') === 'cat';
          const node = find(isCat ? 'Canvas/cat' : 'Canvas/dog');
          if (!(node != null && node.active)) return false;
          const anim = node.getComponent(Animation);
          if (!anim) return false;
          const sleepClip = `${isCat ? 'cat' : 'dog'}03`;
          const state = anim.getState(sleepClip);
          return !!(state != null && state.isPlaying);
        }
        /** 睡觉态：对话框显示 Zzz（低体力喂食提示优先） */


        refreshSleepBubble(isSleeping) {
          if (!this.isValid) return;
          const pv = (_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue).instance;

          if (pv != null && pv.shouldShowFeedBubble()) {
            this._sleepBubbleActive = false;
            return;
          }

          if (this._showingUserHint || this._showingPerMinuteLimitHint) {
            if (!isSleeping) this._sleepBubbleActive = false;
            return;
          }

          if (this._firstOpenText) {
            if (!isSleeping) this._sleepBubbleActive = false;
            return;
          }

          this._sleepBubbleActive = isSleeping;

          if (isSleeping) {
            this._setActionVisible(false);

            this._presentBubble((_crd && getSleepBubbleTip === void 0 ? (_reportPossibleCrUseOfgetSleepBubbleTip({
              error: Error()
            }), getSleepBubbleTip) : getSleepBubbleTip)());
          } else {
            this._applyText();
          }
        }
        /** 恢复被动气泡（低体力 / 睡觉），不强制显示空气泡 */


        syncPassiveBubble() {
          if (!this.isValid) return;
          this.refreshLowHpFeedPrompt();

          if (!this._feedPromptActive) {
            this.refreshSleepBubble(PetInfoBar.isActivePetSleeping());
          }
        }

        onDestroy() {
          if (PetInfoBar.instance === this) {
            PetInfoBar.instance = null;
          }

          this.unschedule(this._dismissGreetingBar);

          try {
            game.off(Game.EVENT_SHOW, this._onGameShow, this);
            game.off(Game.EVENT_HIDE, this._onGameHide, this);
          } catch {
            /* ignore */
          }

          if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', this._onVisibilityChange);
          }

          this.unschedule(this._clearShortLivedTip);
          this.unschedule(this._clearPerMinuteLimitHint);
          this.unschedule(this._clearUserHint);
        }

        start() {
          this._ensureBubbleChrome();

          this._applyBubbleTextStyle();

          this._applyHorizontalPaddingForText('');

          try {
            game.on(Game.EVENT_SHOW, this._onGameShow, this);
            game.on(Game.EVENT_HIDE, this._onGameHide, this);
          } catch {
            if (typeof document !== 'undefined') {
              document.addEventListener('visibilitychange', this._onVisibilityChange);
            }
          }

          if (this._pendingFirstOpenTips) {
            this._pendingFirstOpenTips = false;

            if (!this._firstOpenText) {
              this._firstOpenText = (_crd && getFirstOpenTip === void 0 ? (_reportPossibleCrUseOfgetFirstOpenTip({
                error: Error()
              }), getFirstOpenTip) : getFirstOpenTip)();

              try {
                sys.localStorage.setItem(STORAGE_KEY_FIRST_OPEN_DONE, '1');
              } catch {
                /* ignore */
              }
            }

            this._applyText();
          }

          this.scheduleOnce(this._dismissGreetingBar, PetInfoBar.GREETING_BAR_DURATION);
          this.scheduleOnce(() => this.syncPassiveBubble(), 0.2);
        }

        setExtraText(text) {
          this._extraText = text != null ? text : '';

          this._applyText();
        }
        /** 已移除时段问候，保留空实现以免旧场景事件报错 */


        setGreetingText(_text) {// no-op
        }
        /** 体力偏低时显示喂食气泡（有次数 / 无次数文案不同） */


        refreshLowHpFeedPrompt() {
          if (!this.isValid) return;
          const pv = (_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue).instance;

          if (!(pv != null && pv.shouldShowFeedBubble())) {
            if (this._feedPromptActive) {
              this._feedPromptActive = false;
              this._feedPromptText = '';

              this._setActionVisible(false);

              this._applyText();

              this.refreshSleepBubble(PetInfoBar.isActivePetSleeping());
            }

            return;
          }

          this._sleepBubbleActive = false;
          if (this._showingUserHint || this._showingPerMinuteLimitHint) return;
          if (this._firstOpenText) return;
          const text = (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn1 >= 1 ? (_crd && getLowHpFeedBubbleTip === void 0 ? (_reportPossibleCrUseOfgetLowHpFeedBubbleTip({
            error: Error()
          }), getLowHpFeedBubbleTip) : getLowHpFeedBubbleTip)() : (_crd && getLowHpFeedEmptyTip === void 0 ? (_reportPossibleCrUseOfgetLowHpFeedEmptyTip({
            error: Error()
          }), getLowHpFeedEmptyTip) : getLowHpFeedEmptyTip)();
          this._feedPromptActive = true;
          this._feedPromptText = text;

          this._setActionVisible(true);

          this._presentBubble(text);
        }

        _getInAppDisplayText() {
          if (this._feedPromptActive && this._feedPromptText) return this._feedPromptText;
          if (this._sleepBubbleActive) return (_crd && getSleepBubbleTip === void 0 ? (_reportPossibleCrUseOfgetSleepBubbleTip({
            error: Error()
          }), getSleepBubbleTip) : getSleepBubbleTip)();
          if (this._firstOpenText) return this._firstOpenText;
          if (this._extraText) return this._extraText;
          return '';
        }

        _applyText() {
          if (!this.textLabel) return;
          if (this._showingPerMinuteLimitHint || this._showingUserHint) return;

          const displayedInApp = this._getInAppDisplayText();

          const isFirstOpenShort = displayedInApp === this._firstOpenText;

          if (displayedInApp === this._firstOpenText) {
            this._firstOpenText = '';
          }

          this._setActionVisible(this._feedPromptActive);

          this._presentBubble(displayedInApp);

          if (isFirstOpenShort && displayedInApp) {
            if (this._pendingShortLivedText !== displayedInApp) {
              this._scheduleShortLivedClear(displayedInApp);
            }
          } else if (this._pendingShortLivedText) {
            this.unschedule(this._clearShortLivedTip);
            this._pendingShortLivedText = '';
          }
        }

        _presentBubble(text) {
          if (!this.textLabel) return;
          const t = (text || '').trim();

          if (!t && !this._feedPromptActive) {
            this.textLabel.string = '';

            this._syncBarVisibility();

            return;
          }

          this._applyHorizontalPaddingForText(t, this._feedPromptActive);

          this.textLabel.string = t;

          this._syncBarVisibility();
        }

        _syncBarVisibility() {
          var _this$textLabel;

          const hasText = !!((_this$textLabel = this.textLabel) != null && (_this$textLabel = _this$textLabel.string) != null && _this$textLabel.trim());
          const show = hasText || this._showingUserHint || this._showingPerMinuteLimitHint || this._feedPromptActive || this._sleepBubbleActive;

          if (!show && this._greetingBarDismissed && !this._feedPromptActive && !this._sleepBubbleActive) {
            this.node.active = false;
            return;
          }

          if (show) {
            this.node.active = true;
          }
        }

        _scheduleShortLivedClear(text) {
          this.unschedule(this._clearShortLivedTip);
          this._pendingShortLivedText = text;
          this.scheduleOnce(this._clearShortLivedTip, 3);
        }

        showPerMinuteLimitHint(text = (_crd && getNotAgainTip === void 0 ? (_reportPossibleCrUseOfgetNotAgainTip({
          error: Error()
        }), getNotAgainTip) : getNotAgainTip)()) {
          if (!this.textLabel) return;

          this._applyHorizontalPaddingForText(text, false);

          this.unschedule(this._clearShortLivedTip);
          this._pendingShortLivedText = '';
          this.unschedule(this._clearPerMinuteLimitHint);
          this._showingPerMinuteLimitHint = true;

          this._setActionVisible(false);

          this.textLabel.string = text;

          this._bringBarToFront();

          this.node.active = true;
          this.scheduleOnce(this._clearPerMinuteLimitHint, 3);
        }

        showUserHint(text, seconds = 4) {
          if (!this.textLabel) return;
          const t = (text != null ? text : '').trim();
          if (!t) return;

          this._applyHorizontalPaddingForText(t, false);

          this.unschedule(this._clearShortLivedTip);
          this._pendingShortLivedText = '';
          this.unschedule(this._clearPerMinuteLimitHint);
          this._showingPerMinuteLimitHint = false;
          this._showingUserHint = true;

          this._setActionVisible(false);

          this.textLabel.string = t;

          this._bringBarToFront();

          this.node.active = true;
          this.unschedule(this._clearUserHint);
          this.scheduleOnce(this._clearUserHint, Math.max(1, seconds));
        }

        refreshTip() {
          this._applyText();

          this.refreshLowHpFeedPrompt();
        }

        setBarVisible(visible) {
          if (!visible) {
            this.node.active = false;
            return;
          }

          this._applyText();

          this.syncPassiveBubble();
        }

        static setGlobalVisible(visible) {
          var _PetInfoBar$instance;

          (_PetInfoBar$instance = PetInfoBar.instance) == null || _PetInfoBar$instance.setBarVisible(visible);
        }

        _bringBarToFront() {
          const parent = this.node.parent;
          if (!parent || parent.children.length <= 1) return;
          const last = parent.children.length - 1;

          if (this.node.getSiblingIndex() !== last) {
            this.node.setSiblingIndex(last);
          }
        }

        _applyBubbleTextStyle() {
          if (!this.textLabel) return;
          this.textLabel.fontSize = 34;
          this.textLabel.lineHeight = 44;
          this.textLabel.color = new Color(45, 42, 38, 255);
          this.textLabel.isBold = false;
        }

        _ensureBubbleChrome() {
          if (this._chromeReady) return;
          this._chromeReady = true;
          this._bubbleSprite = this.node.getComponent(Sprite);

          if (this._bubbleSprite) {
            this._bubbleSprite.color = new Color(255, 255, 255, 255); // 使用场景/图集上的 Sliced 与九宫格边距，勿改 Fill（填充仅用于 FILLED 类型）

            this._bubbleSprite.sizeMode = Sprite.SizeMode.CUSTOM;
          }

          const legacyShadow = this.node.getChildByName('bubble_shadow');
          if (legacyShadow) legacyShadow.destroy();

          const native = this._getBubbleNativeSize();

          if (native.h > 0) {
            this.bubbleMinHeight = Math.max(this.bubbleMinHeight, native.h);
          }

          this._ensureActionButton();
        }
        /** pet_chat 等资源原始尺寸（带阴影的图不宜被纵向压扁） */


        _getBubbleNativeSize() {
          var _this$_bubbleSprite;

          const frame = (_this$_bubbleSprite = this._bubbleSprite) == null ? void 0 : _this$_bubbleSprite.spriteFrame;
          if (!frame) return {
            w: 0,
            h: 0
          };
          const r = frame.rect;
          return {
            w: r.width,
            h: r.height
          };
        }

        _ensureActionButton() {
          var _this$_actionNode;

          if ((_this$_actionNode = this._actionNode) != null && _this$_actionNode.isValid) return;
          const action = new Node('feed_action');
          const uit = action.addComponent(UITransform);
          uit.setContentSize(this.actionIconWidth, this.actionIconWidth);
          uit.setAnchorPoint(0.5, 0.5);
          const sp = action.addComponent(Sprite);
          sp.sizeMode = Sprite.SizeMode.CUSTOM;
          const btn1 = find('Canvas/btn/Button1');
          const src = (btn1 == null ? void 0 : btn1.getComponent(Sprite)) || (btn1 == null ? void 0 : btn1.getComponentInChildren(Sprite));

          if (src != null && src.spriteFrame) {
            sp.spriteFrame = src.spriteFrame;
          }

          sp.color = new Color(255, 255, 255, 255);
          const btn = action.addComponent(Button);
          btn.transition = Button.Transition.SCALE;
          btn.zoomScale = 1.08;
          action.on(Node.EventType.TOUCH_END, this._onFeedActionTap, this);
          this.node.addChild(action);
          this._actionNode = action;
          this._actionSprite = sp;
          action.active = false;
          const layout = this.node.getComponent(Layout);

          if (layout) {
            layout.type = Layout.Type.HORIZONTAL;
            layout.resizeMode = Layout.ResizeMode.CONTAINER;
            layout.paddingLeft = 22;
            layout.paddingRight = 16;
            layout.paddingTop = 12;
            layout.paddingBottom = 12;
            layout.spacingX = 8;
          }
        }

        _setActionVisible(visible) {
          this._ensureActionButton();

          if (this._actionNode) this._actionNode.active = visible;
        }

        _applyHorizontalPaddingForText(text, withAction) {
          if (!this.textLabel) return;
          const visible = view.getVisibleSize();
          const ratio = Math.min(0.5, Math.max(0, this.horizontalPaddingRatio));
          const inset = Math.max(0, this.horizontalEdgeInsetPx);
          const actionExtra = withAction ? this.actionIconWidth + 12 : 0;
          const maxWidth = Math.max(120, visible.width * (1 - ratio * 2) - inset * 2 - actionExtra);
          const t = (text || '').trim();
          const fontSize = Math.max(12, this.textLabel.fontSize || 34);
          let wideCount = 0;
          let narrowCount = 0;

          for (const ch of t) {
            if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(ch)) wideCount++;else narrowCount++;
          }

          const estimatedContentWidth = Math.ceil((wideCount + narrowCount * 0.56) * fontSize + 24);
          const targetWidth = Math.min(maxWidth, Math.max(120, estimatedContentWidth || 120));
          const labelNode = this.textLabel.node;
          const labelTrans = labelNode.getComponent(UITransform);

          if (labelTrans) {
            const size = labelTrans.contentSize;

            if (Math.abs(size.width - targetWidth) > 0.5) {
              labelTrans.setContentSize(targetWidth, size.height);
            }

            const native = this._getBubbleNativeSize();

            const bubbleW = Math.max(this.bubbleMinWidth, targetWidth + this.bubblePaddingX * 2 + actionExtra); // 纵向保持原图高度，避免九宫格把阴影挤糊（pet_chat 上下 cap 各约 50px）

            const bubbleH = Math.max(this.bubbleMinHeight, native.h || 0);
            const bubbleTrans = this.node.getComponent(UITransform);

            if (bubbleTrans) {
              const bSize = bubbleTrans.contentSize;

              if (Math.abs(bSize.width - bubbleW) > 0.5 || Math.abs(bSize.height - bubbleH) > 0.5) {
                bubbleTrans.setContentSize(bubbleW, bubbleH);
              }
            }
          }

          this.textLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
          this.textLabel.enableWrapText = true;
        }

      }, _class3.instance = null, _class3.GREETING_BAR_DURATION = 4.5, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "textLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "horizontalPaddingRatio", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.10;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "horizontalEdgeInsetPx", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bubblePaddingX", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 26;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "bubblePaddingY", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 18;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "bubbleMinWidth", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 160;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "bubbleMinHeight", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 122;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "actionIconWidth", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 56;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=882d570b06d2b9422a9a9067791a03552f2e9a61.js.map
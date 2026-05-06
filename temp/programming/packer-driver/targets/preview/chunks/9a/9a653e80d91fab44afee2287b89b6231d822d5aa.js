System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, UITransform, view, sys, native, game, Game, getCurrentWeatherByDeviceLocation, syncWidgetWeather, clearWidgetWeather, getTimeRules, getBatteryLowTexts, getFirstOpenTip, getFirstOpenTipSecond, getFirstOpenTipThird, getFirstOpenTipFourth, getFirstOpenTipFifth, isWeatherGoodForGreeting, getNetworkTipsNone, getHpZeroTip, getIntimacyZeroTip, getNotAgainTip, PetValue, IS_FIRST_SESSION, getLocalDateString, TokitChatService, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _class3, _crd, ccclass, property, STORAGE_KEY_GREET_PREFIX, STORAGE_KEY_PET, STORAGE_KEY_TODAY_PET_DATE, STORAGE_KEY_TODAY_PET_COUNT, STORAGE_KEY_FIRST_OPEN_DONE, STORAGE_KEY_WEATHER_TIP_LAST, TIP_INTERVAL_MS, PetInfoBar;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfgetCurrentWeatherByDeviceLocation(extras) {
    _reporterNs.report("getCurrentWeatherByDeviceLocation", "./WeatherService", _context.meta, extras);
  }

  function _reportPossibleCrUseOfWeatherInfo(extras) {
    _reporterNs.report("WeatherInfo", "./WeatherService", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsyncWidgetWeather(extras) {
    _reporterNs.report("syncWidgetWeather", "./WidgetSync", _context.meta, extras);
  }

  function _reportPossibleCrUseOfclearWidgetWeather(extras) {
    _reporterNs.report("clearWidgetWeather", "./WidgetSync", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetTimeRules(extras) {
    _reporterNs.report("getTimeRules", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetBatteryLowTexts(extras) {
    _reporterNs.report("getBatteryLowTexts", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetFirstOpenTip(extras) {
    _reporterNs.report("getFirstOpenTip", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetFirstOpenTipSecond(extras) {
    _reporterNs.report("getFirstOpenTipSecond", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetFirstOpenTipThird(extras) {
    _reporterNs.report("getFirstOpenTipThird", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetFirstOpenTipFourth(extras) {
    _reporterNs.report("getFirstOpenTipFourth", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetFirstOpenTipFifth(extras) {
    _reporterNs.report("getFirstOpenTipFifth", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisWeatherGoodForGreeting(extras) {
    _reporterNs.report("isWeatherGoodForGreeting", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetNetworkTipsNone(extras) {
    _reporterNs.report("getNetworkTipsNone", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetHpZeroTip(extras) {
    _reporterNs.report("getHpZeroTip", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetIntimacyZeroTip(extras) {
    _reporterNs.report("getIntimacyZeroTip", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetNotAgainTip(extras) {
    _reporterNs.report("getNotAgainTip", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetValue(extras) {
    _reporterNs.report("PetValue", "./PetValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIS_FIRST_SESSION(extras) {
    _reporterNs.report("IS_FIRST_SESSION", "./PetValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetLocalDateString(extras) {
    _reporterNs.report("getLocalDateString", "./DateUtil", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTokitChatService(extras) {
    _reporterNs.report("TokitChatService", "./llm_v2/TokitChatService", _context.meta, extras);
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
      native = _cc.native;
      game = _cc.game;
      Game = _cc.Game;
    }, function (_unresolved_2) {
      getCurrentWeatherByDeviceLocation = _unresolved_2.getCurrentWeatherByDeviceLocation;
    }, function (_unresolved_3) {
      syncWidgetWeather = _unresolved_3.syncWidgetWeather;
      clearWidgetWeather = _unresolved_3.clearWidgetWeather;
    }, function (_unresolved_4) {
      getTimeRules = _unresolved_4.getTimeRules;
      getBatteryLowTexts = _unresolved_4.getBatteryLowTexts;
      getFirstOpenTip = _unresolved_4.getFirstOpenTip;
      getFirstOpenTipSecond = _unresolved_4.getFirstOpenTipSecond;
      getFirstOpenTipThird = _unresolved_4.getFirstOpenTipThird;
      getFirstOpenTipFourth = _unresolved_4.getFirstOpenTipFourth;
      getFirstOpenTipFifth = _unresolved_4.getFirstOpenTipFifth;
      isWeatherGoodForGreeting = _unresolved_4.isWeatherGoodForGreeting;
      getNetworkTipsNone = _unresolved_4.getNetworkTipsNone;
      getHpZeroTip = _unresolved_4.getHpZeroTip;
      getIntimacyZeroTip = _unresolved_4.getIntimacyZeroTip;
      getNotAgainTip = _unresolved_4.getNotAgainTip;
    }, function (_unresolved_5) {
      PetValue = _unresolved_5.PetValue;
      IS_FIRST_SESSION = _unresolved_5.IS_FIRST_SESSION;
    }, function (_unresolved_6) {
      getLocalDateString = _unresolved_6.getLocalDateString;
    }, function (_unresolved_7) {
      TokitChatService = _unresolved_7.TokitChatService;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "93b5c8OXdZMKa4XF3k74hZk", "PetInfoBar", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'UITransform', 'view', 'sys', 'native', 'game', 'Game']);

      ({
        ccclass,
        property
      } = _decorator);
      STORAGE_KEY_GREET_PREFIX = 'petai_greet_';
      STORAGE_KEY_PET = 'petai_pet_choice';
      STORAGE_KEY_TODAY_PET_DATE = 'petai_today_pet_date';
      STORAGE_KEY_TODAY_PET_COUNT = 'petai_today_pet_count';
      STORAGE_KEY_FIRST_OPEN_DONE = 'petai_first_open_done';
      STORAGE_KEY_WEATHER_TIP_LAST = 'petai_weather_tip_last';
      /** 「天气」类提示间隔（毫秒），每小时最多一次 */

      TIP_INTERVAL_MS = 1 * 60 * 60 * 1000;
      /**
       * 宠物主界面的文案条：
       * - 左侧/前半部分：天气文案（来自 WeatherService）
       * - 右侧/后半部分：其它提示文案（由游戏内其它脚本设置）
       *
       * 用法：
       *  - 在主界面 Canvas 下新建一个节点（例如 pet_info_bar），挂上本组件；
       *  - 节点下放一个 Label，并在 Inspector 里拖到 textLabel 上。
       *  - 其它脚本可通过 PetInfoBar.instance?.setExtraText('xxx') 设置额外文案。
       */

      _export("PetInfoBar", PetInfoBar = (_dec = ccclass('PetInfoBar'), _dec2 = property(Label), _dec3 = property({
        tooltip: '信息条左右留白占屏幕宽度比例（0~0.5），默认每侧 10%；越大距屏幕左右越远'
      }), _dec4 = property({
        tooltip: '在比例留白之外，左右各再收紧的像素（与设计分辨率一致）；默认 20，可与比例叠加'
      }), _dec5 = property({
        tooltip: '背景相对文本的水平内边距（像素）'
      }), _dec6 = property({
        tooltip: '背景相对文本的垂直内边距（像素）'
      }), _dec7 = property({
        tooltip: '背景最小宽度（像素）'
      }), _dec8 = property({
        tooltip: '背景最小高度（像素）'
      }), _dec(_class = (_class2 = (_class3 = class PetInfoBar extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "textLabel", _descriptor, this);

          _initializerDefineProperty(this, "horizontalPaddingRatio", _descriptor2, this);

          _initializerDefineProperty(this, "horizontalEdgeInsetPx", _descriptor3, this);

          _initializerDefineProperty(this, "bubblePaddingX", _descriptor4, this);

          _initializerDefineProperty(this, "bubblePaddingY", _descriptor5, this);

          _initializerDefineProperty(this, "bubbleMinWidth", _descriptor6, this);

          _initializerDefineProperty(this, "bubbleMinHeight", _descriptor7, this);

          this._weatherText = '';

          /** 当前天气码（Open-Meteo），用于判断是否作为打招呼话题展示 */
          this._weatherCode = 0;

          /** 早/午/晚安问候，与天气不同时出现 */
          this._greetingText = '';
          this._extraText = '';

          /** 电池相关提示（充电中 / 快没电），定时刷新 */
          this._batteryTipText = '';

          /** 是否正在充电（用于「仅基础姿态才显示早午晚安/天气/今天几次」） */
          this._isCharging = false;

          /** 仅无网络时的提示（有网时不显示网络类文案） */
          this._networkTipText = '';

          /** 上次检测到的网络类型，用于「仅变化时提示」 */
          this._lastNetworkType = '';

          /** 新安装首次打开时显示的指引：当前正在显示的那一句，仅当次会话优先显示一次后清空（App 内每句约 2 秒） */
          this._firstOpenText = '';

          /** 新安装首次打开时显示的指引：队列形式的一组句子，逐句显示。 */
          this._firstOpenQueue = [];

          /** 是否还有首装指引需要初始化（仅首次安装，当次会话内有效）。 */
          this._pendingFirstOpenTips = false;

          /** 当前展示的那一句（仅 App 内），退到后台时用 _getWidgetText 同步 Widget */
          this._lastDisplayedText = '';

          /** 回到前台时，若没有其它提示，强制用天气补一句（仅本次） */
          this._forceWeatherOnResume = false;

          /** Web 上用于监听充电状态变化的 BatteryManager，便于 onDestroy 时移除监听 */
          this._batteryManager = null;

          /** 当前短暂提示（2 秒）文本，用于到期后自动清除（仅 App 内） */
          this._pendingShortLivedText = '';

          /** 是否正在显示「连续点击」的 Not again 提示（夜间不参与 _applyText 覆盖） */
          this._showingPerMinuteLimitHint = false;

          /** 是否正在显示「用户触发」的短提示（如聊天回复）；显示期间不被 _applyText 覆盖 */
          this._showingUserHint = false;

          /** 本次进游戏已过「打招呼条」展示时长后不再显示（仅隐藏打招呼类，Not again 仍可显示） */
          this._greetingBarDismissed = false;

          this._dismissGreetingBar = () => {
            // 首次安装引导未播放完时，不隐藏 info bar，延后关闭
            if (this._firstOpenText || this._firstOpenQueue.length > 0) {
              this.scheduleOnce(this._dismissGreetingBar, PetInfoBar.GREETING_BAR_DURATION);
              return;
            }

            this._greetingBarDismissed = true;
            if (!this._showingPerMinuteLimitHint && !this._showingUserHint) this.node.active = false;
          };

          this._onGameShow = () => {
            var _PetInfoBar$instance;

            this._forceWeatherOnResume = true; // 用户回到 App 后，清空桌面 Widget 上的提示文案，避免一直停留

            if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
              (_crd && clearWidgetWeather === void 0 ? (_reportPossibleCrUseOfclearWidgetWeather({
                error: Error()
              }), clearWidgetWeather) : clearWidgetWeather)();
            }

            (_PetInfoBar$instance = PetInfoBar.instance) == null || _PetInfoBar$instance.refreshTip();
          };

          this._onGameHide = () => {
            var widgetText = this._getWidgetText();

            if (widgetText !== '') (_crd && syncWidgetWeather === void 0 ? (_reportPossibleCrUseOfsyncWidgetWeather({
              error: Error()
            }), syncWidgetWeather) : syncWidgetWeather)(widgetText);
          };

          this._onVisibilityChange = () => {
            if (typeof document === 'undefined') return;
            if (document.hidden) this._onGameHide();else this._onGameShow();
          };

          this._refreshBatteryTip = () => {
            this._getBatteryStateAsync().then(state => {
              if (!state) {
                this._batteryTipText = '';
                this._isCharging = false;
              } else if (state.charging) {
                this._batteryTipText = '';
                this._isCharging = true;
              } else {
                this._isCharging = false;

                if (state.level < 0.2) {
                  var _arr$Math$floor;

                  var arr = (_crd && getBatteryLowTexts === void 0 ? (_reportPossibleCrUseOfgetBatteryLowTexts({
                    error: Error()
                  }), getBatteryLowTexts) : getBatteryLowTexts)();
                  this._batteryTipText = (_arr$Math$floor = arr[Math.floor(Math.random() * arr.length)]) != null ? _arr$Math$floor : arr[0];
                } else {
                  this._batteryTipText = '';
                }
              }

              this._applyText();
            });
          };

          this._refreshNetworkTip = () => {
            this._getNetworkTypeAsync().then(type => {
              if (!type) {
                var _arr$Math$floor2;

                var arr = (_crd && getNetworkTipsNone === void 0 ? (_reportPossibleCrUseOfgetNetworkTipsNone({
                  error: Error()
                }), getNetworkTipsNone) : getNetworkTipsNone)();
                this._networkTipText = arr.length ? (_arr$Math$floor2 = arr[Math.floor(Math.random() * arr.length)]) != null ? _arr$Math$floor2 : arr[0] : '';
                this._lastNetworkType = '';
              } else {
                this._networkTipText = '';
                this._lastNetworkType = type;
              }

              this._applyText();
            });
          };

          this._maybeUpdateGreeting = () => {
            if (!this.node.active) return;
            var now = new Date();
            var hour = now.getHours();
            var today = (_crd && getLocalDateString === void 0 ? (_reportPossibleCrUseOfgetLocalDateString({
              error: Error()
            }), getLocalDateString) : getLocalDateString)();
            var rules = (_crd && getTimeRules === void 0 ? (_reportPossibleCrUseOfgetTimeRules({
              error: Error()
            }), getTimeRules) : getTimeRules)();

            for (var rule of rules) {
              var _rule$texts$idx;

              if (hour < rule.startHour || hour > rule.endHour) continue; // 午间休息 12:00～13:00 宠物在睡觉，不显示午安问候

              if (rule.id === 'noon' && hour === 12) continue;
              var key = STORAGE_KEY_GREET_PREFIX + rule.id;
              var lastDay = sys.localStorage.getItem(key) || '';
              if (lastDay === today) continue;
              if (!rule.texts.length) continue;
              var idxKey = key + '_idx';
              var idx = parseInt(sys.localStorage.getItem(idxKey) || '0', 10) % rule.texts.length;
              var text = (_rule$texts$idx = rule.texts[idx]) != null ? _rule$texts$idx : rule.texts[0];
              this.setGreetingText(text);

              try {
                sys.localStorage.setItem(key, today);
                sys.localStorage.setItem(idxKey, String((idx + 1) % rule.texts.length));
              } catch (_unused) {// ignore
              }

              break;
            }
          };

          /** 每 2 秒跑一次，重算当前该显示哪句，避免同一句停留过久 */
          this._tickRefreshTip = () => {
            this._applyText();
          };

          /** 3 秒后清除仍在显示的短暂提示，并重新计算下一条文案（仅 App 内）。 */
          this._clearShortLivedTip = () => {
            if (!this.textLabel) return;

            if (this.textLabel.string !== this._pendingShortLivedText) {
              this._pendingShortLivedText = '';
              return;
            }

            this._pendingShortLivedText = '';
            this.textLabel.string = '';
            this.node.active = false; // 若还有首装指引句子排队，则留出一点空白时间再显示下一句

            if (this._firstOpenText) {
              this.scheduleOnce(() => this._applyText(), 3.0);
            } else {
              this._applyText();
            }
          };

          this._clearPerMinuteLimitHint = () => {
            this.unschedule(this._clearPerMinuteLimitHint);
            this._showingPerMinuteLimitHint = false;

            this._applyText();
          };

          this._clearUserHint = () => {
            this.unschedule(this._clearUserHint);
            this._showingUserHint = false;

            this._applyText();
          };
        }

        onLoad() {
          PetInfoBar.instance = this;
          (_crd && TokitChatService === void 0 ? (_reportPossibleCrUseOfTokitChatService({
            error: Error()
          }), TokitChatService) : TokitChatService).startRemoteConfigOnLaunch();
          var firstOpenDone = !!sys.localStorage.getItem(STORAGE_KEY_FIRST_OPEN_DONE);

          if (!firstOpenDone) {
            // 首次安装：延迟到 start 里再初始化提示句，避免被权限弹窗挡住
            this._pendingFirstOpenTips = true;
          }
        }

        onDestroy() {
          if (PetInfoBar.instance === this) {
            PetInfoBar.instance = null;
          }

          this.unschedule(this._dismissGreetingBar);
          this.unschedule(this._maybeUpdateGreeting);
          this.unschedule(this._refreshBatteryTip);
          this.unschedule(this._refreshNetworkTip);
          this.unschedule(this._tickRefreshTip);
          this.unschedule(this._checkLongUse);

          try {
            game.off(Game.EVENT_SHOW, this._onGameShow, this);
            game.off(Game.EVENT_HIDE, this._onGameHide, this);
          } catch (_unused2) {
            /* ignore */
          }

          if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', this._onVisibilityChange);
          }

          if (this._batteryManager) {
            try {
              this._batteryManager.removeEventListener('chargingchange', this._refreshBatteryTip);

              this._batteryManager.removeEventListener('levelchange', this._refreshBatteryTip);
            } catch (_unused3) {// ignore
            }

            this._batteryManager = null;
          }

          this.unschedule(this._clearShortLivedTip);
          this.unschedule(this._clearPerMinuteLimitHint);
        }

        start() {
          this._applyHorizontalPaddingForText(''); // 启动时异步拉一次天气（优先用设备真实位置）


          this._loadWeather(); // 并根据时间段尝试设置一次问候语，再每隔一段时间检查一次


          this._maybeUpdateGreeting();

          this.schedule(this._maybeUpdateGreeting, 300, Number.POSITIVE_INFINITY);

          this._refreshBatteryTip();

          this.schedule(this._refreshBatteryTip, 1, Number.POSITIVE_INFINITY);

          this._refreshNetworkTip();

          this.schedule(this._refreshNetworkTip, 20, Number.POSITIVE_INFINITY);
          this.schedule(this._tickRefreshTip, 2, Number.POSITIVE_INFINITY);

          try {
            game.on(Game.EVENT_SHOW, this._onGameShow, this);
            game.on(Game.EVENT_HIDE, this._onGameHide, this);
          } catch (_unused4) {
            if (typeof document !== 'undefined') {
              document.addEventListener('visibilitychange', this._onVisibilityChange);
            }
          } // 首次安装的指引文案：不再额外延迟，进入场景后立即初始化并开始显示。


          if (this._pendingFirstOpenTips) {
            this._pendingFirstOpenTips = false;

            if (!this._firstOpenText && this._firstOpenQueue.length === 0) {
              this._firstOpenText = (_crd && getFirstOpenTip === void 0 ? (_reportPossibleCrUseOfgetFirstOpenTip({
                error: Error()
              }), getFirstOpenTip) : getFirstOpenTip)();
              this._firstOpenQueue = [(_crd && getFirstOpenTipSecond === void 0 ? (_reportPossibleCrUseOfgetFirstOpenTipSecond({
                error: Error()
              }), getFirstOpenTipSecond) : getFirstOpenTipSecond)(), (_crd && getFirstOpenTipThird === void 0 ? (_reportPossibleCrUseOfgetFirstOpenTipThird({
                error: Error()
              }), getFirstOpenTipThird) : getFirstOpenTipThird)(), (_crd && getFirstOpenTipFourth === void 0 ? (_reportPossibleCrUseOfgetFirstOpenTipFourth({
                error: Error()
              }), getFirstOpenTipFourth) : getFirstOpenTipFourth)(), (_crd && getFirstOpenTipFifth === void 0 ? (_reportPossibleCrUseOfgetFirstOpenTipFifth({
                error: Error()
              }), getFirstOpenTipFifth) : getFirstOpenTipFifth)()];

              try {
                sys.localStorage.setItem(STORAGE_KEY_FIRST_OPEN_DONE, '1');
              } catch (_unused5) {
                /* ignore */
              }
            }

            this._applyText();
          } // 进游戏后只显示几秒打招呼条，过后隐藏且本局不再显示


          this.scheduleOnce(this._dismissGreetingBar, PetInfoBar.GREETING_BAR_DURATION); // Web：监听充电/电量变化，拔线或插线时立即更新文案

          if (typeof navigator !== 'undefined' && navigator.getBattery && !(sys.platform === sys.Platform.ANDROID && sys.isNative)) {
            navigator.getBattery().then(b => {
              if (!b || this._batteryManager) return;
              this._batteryManager = b;
              b.addEventListener('chargingchange', this._refreshBatteryTip);
              b.addEventListener('levelchange', this._refreshBatteryTip);
            }).catch(() => {});
          }
        }

        /** 供其它脚本设置额外文案（例如「今天已经撸猫 3 次」）。早午安问候请用 setGreetingText，与天气不会同时显示。 */
        setExtraText(text) {
          this._extraText = text != null ? text : '';

          this._applyText();
        }
        /** 设置早/午/晚安问候文案；与天气二选一显示，不拼在同一句。 */


        setGreetingText(text) {
          this._greetingText = text != null ? text : '';

          this._applyText();
        }
        /** 如果你已经拿到了 WeatherInfo，也可以直接注入（方便以后扩展给 Widget 共用） */


        setWeatherInfo(info) {
          if (!info) {
            this._weatherText = '';
            this._weatherCode = 0;
          } else {
            var _info$code;

            var temp = Math.round(info.temperature);
            this._weatherText = info.text + " \xB7 " + temp + "\u2103";
            this._weatherCode = (_info$code = info.code) != null ? _info$code : 0;
          }

          this._applyText();
        }

        _loadWeather() {
          var _this = this;

          return _asyncToGenerator(function* () {
            var info = yield (_crd && getCurrentWeatherByDeviceLocation === void 0 ? (_reportPossibleCrUseOfgetCurrentWeatherByDeviceLocation({
              error: Error()
            }), getCurrentWeatherByDeviceLocation) : getCurrentWeatherByDeviceLocation)();

            _this.setWeatherInfo(info);
          })();
        }

        _getBatteryStateAsync() {
          if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
            try {
              var _nat$reflection;

              var nat = native;

              if (nat != null && (_nat$reflection = nat.reflection) != null && _nat$reflection.callStaticMethod) {
                var raw = nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'getBatteryState', '()Ljava/lang/String;');

                if (raw && /^[01],[\d.]+$/.test(raw)) {
                  var [c, l] = raw.split(',');
                  return Promise.resolve({
                    charging: c === '1',
                    level: parseFloat(l)
                  });
                }
              }
            } catch (_unused6) {// ignore
            }

            return Promise.resolve(null);
          }

          if (typeof navigator !== 'undefined' && navigator.getBattery) {
            return navigator.getBattery().then(b => ({
              charging: !!(b != null && b.charging),
              level: typeof (b == null ? void 0 : b.level) === 'number' ? b.level : 1
            })).catch(() => null);
          }

          return Promise.resolve(null);
        }

        _getNetworkTypeAsync() {
          var _ref, _nav$connection;

          if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
            try {
              var _nat$reflection2;

              var nat = native;

              if (nat != null && (_nat$reflection2 = nat.reflection) != null && _nat$reflection2.callStaticMethod) {
                var raw = nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'getNetworkType', '()Ljava/lang/String;');
                return Promise.resolve(raw && /^(wifi|5g|4g|3g)$/.test(raw) ? raw : '');
              }
            } catch (_unused7) {// ignore
            }

            return Promise.resolve('');
          }

          var nav = typeof navigator !== 'undefined' ? navigator : null;
          var conn = (_ref = (_nav$connection = nav == null ? void 0 : nav.connection) != null ? _nav$connection : nav == null ? void 0 : nav.mozConnection) != null ? _ref : nav == null ? void 0 : nav.webkitConnection;
          if (!conn) return Promise.resolve('');
          var type = conn.type;
          var effectiveType = (conn.effectiveType || '').toLowerCase();
          if (type === 'wifi' || type === 'ethernet') return Promise.resolve('wifi');

          if (type === 'cellular') {
            if (effectiveType === '4g') return Promise.resolve('4g');
            if (effectiveType === '3g') return Promise.resolve('3g');
            return Promise.resolve('4g');
          }

          return Promise.resolve('');
        }

        /** 「天气」是否允许显示（每 TIP_INTERVAL_MS 最多显示一次） */
        _canShowWeatherTip() {
          if (!this._weatherText) return false;
          var last = parseInt(sys.localStorage.getItem(STORAGE_KEY_WEATHER_TIP_LAST) || '0', 10) || 0;
          return Date.now() - last >= TIP_INTERVAL_MS;
        }

        /** 规则：1 仅 App  2–5 仅 Widget  6–9 App+Widget。返回当前应同步到 Widget 的文案（不消耗状态）。早午晚安/天气仅在基础姿态时同步。 */
        _getWidgetText() {
          if (this._batteryTipText) return this._batteryTipText;
          if (this._networkTipText) return this._networkTipText;
          if (!this._isBasePose()) return '';
          if (this._greetingText) return this._greetingText;
          if (this._weatherText && this._canShowWeatherTip() && (_crd && isWeatherGoodForGreeting === void 0 ? (_reportPossibleCrUseOfisWeatherGoodForGreeting({
            error: Error()
          }), isWeatherGoodForGreeting) : isWeatherGoodForGreeting)(this._weatherCode)) return this._weatherText;
          return '';
        }
        /** 每晚 22 点～次日 7 点、或午间 12:00～13:00 不显示宠物主动类提示（与夜间同一处理） */


        _isNightNoTip() {
          if (_crd && IS_FIRST_SESSION === void 0 ? (_reportPossibleCrUseOfIS_FIRST_SESSION({
            error: Error()
          }), IS_FIRST_SESSION) : IS_FIRST_SESSION) return false;
          var d = new Date();
          var h = d.getHours();
          if (h >= 22 || h < 7) return true;
          if (h === 12) return true;
          return false;
        }
        /** 是否为「基础姿态 01」：非低体力、非低心情、非充电、非无网、非低电量。早午晚安/聊天气/今天玩了几次仅在此状态下显示。 */


        _isBasePose() {
          var pv = (_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue).instance;
          return !(pv != null && pv.isHpLow()) && !(pv != null && pv.isIntimacyLow()) && !this._batteryTipText && !this._networkTipText && !this._isCharging;
        }

        _getInAppDisplayText(forceWeather) {
          // 首次安装引导提示：不受夜间/午休「不显示主动提示」规则限制，优先展示
          if (this._firstOpenText) return this._firstOpenText;
          if (this._isNightNoTip()) return ''; // 体力和心情低于 20 时的提示（优先于电池/天气等）：体力 < 20 → 喂食提示；否则亲密 < 20 → 心情差提示

          var pv = (_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue).instance;
          if (pv != null && pv.isHpLow()) return (_crd && getHpZeroTip === void 0 ? (_reportPossibleCrUseOfgetHpZeroTip({
            error: Error()
          }), getHpZeroTip) : getHpZeroTip)();
          if (pv != null && pv.isIntimacyLow()) return (_crd && getIntimacyZeroTip === void 0 ? (_reportPossibleCrUseOfgetIntimacyZeroTip({
            error: Error()
          }), getIntimacyZeroTip) : getIntimacyZeroTip)();
          if (this._batteryTipText) return this._batteryTipText; // 早午晚安 / 聊天气 / 今天玩了几次：仅在基础姿态 01 时出现

          if (!this._isBasePose()) return '';
          if (this._greetingText) return this._greetingText;
          if (this._weatherText && this._canShowWeatherTip() && (_crd && isWeatherGoodForGreeting === void 0 ? (_reportPossibleCrUseOfisWeatherGoodForGreeting({
            error: Error()
          }), isWeatherGoodForGreeting) : isWeatherGoodForGreeting)(this._weatherCode)) return this._weatherText;
          if (this._extraText) return this._extraText; // 回到前台且没有其它提示时，用天气补一句（不受节流限制，仅话题性天气）

          if (forceWeather && this._weatherText && (_crd && isWeatherGoodForGreeting === void 0 ? (_reportPossibleCrUseOfisWeatherGoodForGreeting({
            error: Error()
          }), isWeatherGoodForGreeting) : isWeatherGoodForGreeting)(this._weatherCode)) return this._weatherText;
          return '';
        }

        _applyText() {
          if (!this.textLabel) return; // 用户触发提示显示中：不覆盖，等计时清除后再刷新

          if (this._showingPerMinuteLimitHint || this._showingUserHint) return;

          var widgetText = this._getWidgetText();

          var forceWeather = this._forceWeatherOnResume;
          this._forceWeatherOnResume = false;

          var displayedInApp = this._getInAppDisplayText(forceWeather); // 是否为「只显示一次、约 2 秒」的短暂提示（仅 App 内）


          var isFirstOpenShort = displayedInApp === this._firstOpenText;
          var isGreetingShort = displayedInApp === this._greetingText;
          var isShortLivedInApp = isFirstOpenShort || isGreetingShort; // 消耗「仅 App」：首次打开。若队列中还有下一句指引，则接着显示下一句；否则清空。

          if (displayedInApp === this._firstOpenText) {
            var next = this._firstOpenQueue.shift();

            this._firstOpenText = next != null ? next : '';
          } // 消耗「App 或 Widget」：问候（任一侧使用后即清空）


          if (displayedInApp === this._greetingText || widgetText === this._greetingText) {
            this._greetingText = '';
          } // 天气：仅 Widget 使用时参与节流，App 内回到前台的补充不受 TIP_INTERVAL_MS 限制


          if (widgetText === this._weatherText && this._weatherText && this._canShowWeatherTip()) {
            try {
              sys.localStorage.setItem(STORAGE_KEY_WEATHER_TIP_LAST, String(Date.now()));
            } catch (_unused8) {
              /* ignore */
            }
          }

          this._applyHorizontalPaddingForText(displayedInApp);

          this.textLabel.string = displayedInApp;
          this._lastDisplayedText = displayedInApp;
          this.node.active = displayedInApp !== '';
          if (this._greetingBarDismissed && !this._showingPerMinuteLimitHint && !this._showingUserHint) this.node.active = false; // 短暂型提示：只显示一次，约 3 秒后自动清除，再回落到其它文案（天气等）

          if (isShortLivedInApp && displayedInApp) {
            if (this._pendingShortLivedText !== displayedInApp) {
              this._scheduleShortLivedClear(displayedInApp);
            }
          } else {
            // 非短暂型提示：取消之前的 2 秒计时
            if (this._pendingShortLivedText) {
              this.unschedule(this._clearShortLivedTip);
              this._pendingShortLivedText = '';
            }
          }

          if (widgetText !== '') {
            (_crd && syncWidgetWeather === void 0 ? (_reportPossibleCrUseOfsyncWidgetWeather({
              error: Error()
            }), syncWidgetWeather) : syncWidgetWeather)(widgetText);
          }
        }

        _scheduleShortLivedClear(text) {
          this.unschedule(this._clearShortLivedTip);
          this._pendingShortLivedText = text;
          this.scheduleOnce(this._clearShortLivedTip, 3);
        }
        /** 按钮 0/1/2/3 每分钟超 3 次时的提示，在 info bar 里显示约 3 秒后恢复原文案 */


        showPerMinuteLimitHint(text) {
          if (text === void 0) {
            text = (_crd && getNotAgainTip === void 0 ? (_reportPossibleCrUseOfgetNotAgainTip({
              error: Error()
            }), getNotAgainTip) : getNotAgainTip)();
          }

          if (!this.textLabel) return;

          this._applyHorizontalPaddingForText(text);

          this.unschedule(this._clearShortLivedTip);
          this._pendingShortLivedText = '';
          this.unschedule(this._clearPerMinuteLimitHint);
          this._showingPerMinuteLimitHint = true;
          this.textLabel.string = text;

          this._bringBarToFront();

          this.node.active = true;
          this.scheduleOnce(this._clearPerMinuteLimitHint, 3);
        }

        /** 用户触发的短提示（例如聊天回复），显示一段时间后自动回落到常规文案 */
        showUserHint(text, seconds) {
          if (seconds === void 0) {
            seconds = 4;
          }

          if (!this.textLabel) return;
          var t = (text != null ? text : '').trim();
          if (!t) return;

          this._applyHorizontalPaddingForText(t);

          this.unschedule(this._clearShortLivedTip);
          this._pendingShortLivedText = '';
          this.unschedule(this._clearPerMinuteLimitHint);
          this._showingPerMinuteLimitHint = false;
          this._showingUserHint = true;
          this.textLabel.string = t;

          this._bringBarToFront();

          this.node.active = true;
          this.unschedule(this._clearUserHint);
          this.scheduleOnce(this._clearUserHint, Math.max(1, seconds));
        }

        /** 刷新当前显示的一句（优先级重算） */
        refreshTip() {
          this._applyText();
        }
        /** 显示/隐藏整个 info bar（供其它脚本控制，比如 Check-in 或数值变化时隐藏）；显示时刷新文案 */


        setBarVisible(visible) {
          this.node.active = visible;
          if (visible) this._applyText();
        }
        /** 全局便捷方法：不直接拿实例也能控制显隐 */


        static setGlobalVisible(visible) {
          if (PetInfoBar.instance) {
            PetInfoBar.instance.setBarVisible(visible);
          }
        }
        /** 将信息条移到父节点子节点最后，保证 UI 绘制在最上层（同 Canvas 内）。 */


        _bringBarToFront() {
          var parent = this.node.parent;
          if (!parent || parent.children.length <= 1) return;
          var last = parent.children.length - 1;

          if (this.node.getSiblingIndex() !== last) {
            this.node.setSiblingIndex(last);
          }
        }
        /** 保证文字区域始终小于屏幕宽度，避免左右贴边。 */


        _applyHorizontalPaddingForText(text) {
          if (!this.textLabel) return;
          var visible = view.getVisibleSize();
          var ratio = Math.min(0.5, Math.max(0, this.horizontalPaddingRatio));
          var inset = Math.max(0, this.horizontalEdgeInsetPx);
          var maxWidth = Math.max(120, visible.width * (1 - ratio * 2) - inset * 2);
          var t = (text || '').trim(); // Estimate content width, then clamp to maxWidth.
          // Short texts keep compact width; long texts wrap within maxWidth.

          var fontSize = Math.max(12, this.textLabel.fontSize || 26);
          var wideCount = 0;
          var narrowCount = 0;

          for (var ch of t) {
            if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(ch)) wideCount++;else narrowCount++;
          }

          var estimatedContentWidth = Math.ceil((wideCount + narrowCount * 0.56) * fontSize + 24);
          var targetWidth = Math.min(maxWidth, Math.max(120, estimatedContentWidth || 120));
          var labelNode = this.textLabel.node;
          var labelTrans = labelNode.getComponent(UITransform);

          if (labelTrans) {
            var size = labelTrans.contentSize;

            if (Math.abs(size.width - targetWidth) > 0.5) {
              labelTrans.setContentSize(targetWidth, size.height);
            } // Resize bubble background to wrap text content.


            var textH = Math.max(size.height, this.textLabel.lineHeight || this.textLabel.fontSize || 26);
            var bubbleW = Math.max(this.bubbleMinWidth, targetWidth + this.bubblePaddingX * 2);
            var bubbleH = Math.max(this.bubbleMinHeight, textH + this.bubblePaddingY * 2);
            var bubbleTrans = this.node.getComponent(UITransform);

            if (bubbleTrans) {
              var bSize = bubbleTrans.contentSize;

              if (Math.abs(bSize.width - bubbleW) > 0.5 || Math.abs(bSize.height - bubbleH) > 0.5) {
                bubbleTrans.setContentSize(bubbleW, bubbleH);
              }
            }
          } // 多行换行并按宽度自动增高，避免一行撑到屏幕边缘。


          this.textLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
          this.textLabel.enableWrapText = true;
        }

      }, _class3.instance = null, _class3.GREETING_BAR_DURATION = 4.5, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "textLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "horizontalPaddingRatio", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.10;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "horizontalEdgeInsetPx", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bubblePaddingX", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 22;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "bubblePaddingY", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 14;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "bubbleMinWidth", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 120;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "bubbleMinHeight", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 56;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9a653e80d91fab44afee2287b89b6231d822d5aa.js.map
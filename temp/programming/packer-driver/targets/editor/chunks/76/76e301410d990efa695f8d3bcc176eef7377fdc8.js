System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, sys, Node, tween, Vec3, UITransform, UIOpacity, Color, find, ProgressBar, game, Game, SharedBtnCounts, AudioManager, BtnAdGuard, AdButton, syncWidgetFromStorage, getLocalDateString, PetInfoBar, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _class3, _crd, ccclass, property, STORAGE_KEY_HP, STORAGE_KEY_MOOD, STORAGE_KEY_INTIMACY_LEGACY, STORAGE_KEY_LAST, STORAGE_KEY_TODAY_PET_DATE, STORAGE_KEY_TODAY_PET_COUNT, STORAGE_KEY_FIRST_RUN_DONE, MS_PER_HOUR, DECREASE_MOOD_PER_HOUR, MAX_VALUE, VOICE_CHAT_HP_COST, VOICE_CHAT_MOOD_GAIN, IS_FIRST_SESSION, PetValue;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  /** 距离下一个本地整点的毫秒数 */
  function getMsUntilNextFullHour() {
    const now = new Date();
    const msIntoHour = (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
    return MS_PER_HOUR - msIntoHour;
  }
  /**
   * 体力 / 心情：主界面只展示心情；体力后台保留，低时由 PetInfoBar 提示饿了。
   * 心情整点 −1；体力仅语音聊天等消耗，不整点衰减。
   */


  function _reportPossibleCrUseOfSharedBtnCounts(extras) {
    _reporterNs.report("SharedBtnCounts", "./SharedBtnCounts", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "./AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBtnAdGuard(extras) {
    _reporterNs.report("BtnAdGuard", "./BtnAdGuard", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAdButton(extras) {
    _reporterNs.report("AdButton", "./AdButton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsyncWidgetFromStorage(extras) {
    _reporterNs.report("syncWidgetFromStorage", "./WidgetSync", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetLocalDateString(extras) {
    _reporterNs.report("getLocalDateString", "./DateUtil", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetInfoBar(extras) {
    _reporterNs.report("PetInfoBar", "./PetInfoBar", _context.meta, extras);
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
      sys = _cc.sys;
      Node = _cc.Node;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      UITransform = _cc.UITransform;
      UIOpacity = _cc.UIOpacity;
      Color = _cc.Color;
      find = _cc.find;
      ProgressBar = _cc.ProgressBar;
      game = _cc.game;
      Game = _cc.Game;
    }, function (_unresolved_2) {
      SharedBtnCounts = _unresolved_2.SharedBtnCounts;
    }, function (_unresolved_3) {
      AudioManager = _unresolved_3.AudioManager;
    }, function (_unresolved_4) {
      BtnAdGuard = _unresolved_4.BtnAdGuard;
    }, function (_unresolved_5) {
      AdButton = _unresolved_5.AdButton;
    }, function (_unresolved_6) {
      syncWidgetFromStorage = _unresolved_6.syncWidgetFromStorage;
    }, function (_unresolved_7) {
      getLocalDateString = _unresolved_7.getLocalDateString;
    }, function (_unresolved_8) {
      PetInfoBar = _unresolved_8.PetInfoBar;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "59c2bpNQJxOBItmHocOWefS", "PetValue", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'sys', 'Node', 'tween', 'Vec3', 'UITransform', 'UIOpacity', 'Color', 'find', 'director', 'ProgressBar', 'game', 'Game']);

      ({
        ccclass,
        property
      } = _decorator);
      STORAGE_KEY_HP = 'petai_hp';
      STORAGE_KEY_MOOD = 'petai_mood';
      STORAGE_KEY_INTIMACY_LEGACY = 'petai_intimacy';
      STORAGE_KEY_LAST = 'petai_last_update';
      STORAGE_KEY_TODAY_PET_DATE = 'petai_today_pet_date';
      STORAGE_KEY_TODAY_PET_COUNT = 'petai_today_pet_count';
      /** 仅首次运行后设为 '1'，用于区分真正首次安装与已有存档 */

      STORAGE_KEY_FIRST_RUN_DONE = 'petai_first_run_done';
      MS_PER_HOUR = 3600000;
      DECREASE_MOOD_PER_HOUR = 1;
      MAX_VALUE = 100;
      /** 每轮语音对话消耗体力（主界面不展示，仅低体力时提示饿了） */

      _export("VOICE_CHAT_HP_COST", VOICE_CHAT_HP_COST = 8);
      /** 每轮语音对话增加心情（主界面飘字可见） */


      _export("VOICE_CHAT_MOOD_GAIN", VOICE_CHAT_MOOD_GAIN = 3);
      /** 是否为本次安装后的首个会话（仅当前进程内为 true，一旦保存过 FIRST_RUN_DONE，后续重启即为 false） */


      _export("IS_FIRST_SESSION", IS_FIRST_SESSION = sys.localStorage.getItem(STORAGE_KEY_FIRST_RUN_DONE) !== '1');

      _export("PetValue", PetValue = (_dec = ccclass('PetValue'), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(ProgressBar), _dec5 = property(ProgressBar), _dec6 = property(Node), _dec(_class = (_class2 = (_class3 = class PetValue extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "hpLabel", _descriptor, this);

          /** 心情数值标签（场景里可能仍名为 intimacyLabel） */
          _initializerDefineProperty(this, "intimacyLabel", _descriptor2, this);

          _initializerDefineProperty(this, "hpBar", _descriptor3, this);

          _initializerDefineProperty(this, "intimacyBar", _descriptor4, this);

          /** 心情 > 80 时显示的节点（如 home 下的 highintimate），未绑定时按 Canvas/highintimate 查找 */
          _initializerDefineProperty(this, "highIntimateNode", _descriptor5, this);

          this._hp = 50;
          this._mood = 50;
        }

        onLoad() {
          var _sys$localStorage$get;

          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).init(); // Check-in 仅通过点击 ad 节点弹出，不再自动弹出

          const firstRunDone = sys.localStorage.getItem(STORAGE_KEY_FIRST_RUN_DONE) === '1';
          const savedHp = sys.localStorage.getItem(STORAGE_KEY_HP);
          const savedMood = (_sys$localStorage$get = sys.localStorage.getItem(STORAGE_KEY_MOOD)) != null ? _sys$localStorage$get : sys.localStorage.getItem(STORAGE_KEY_INTIMACY_LEGACY);
          const savedLast = sys.localStorage.getItem(STORAGE_KEY_LAST);

          if (firstRunDone) {
            if (savedHp != null && savedHp !== '') this._hp = Math.max(0, Math.min(MAX_VALUE, parseInt(savedHp, 10) || 0));
            if (savedMood != null && savedMood !== '') this._mood = Math.max(0, Math.min(MAX_VALUE, parseInt(savedMood, 10) || 0));
          }

          this._applyHourlyCatchUp(savedLast, firstRunDone);

          this._save(true);

          this._hideHpUi();

          this._updateLabels(); // 确保数量为 0 时 Button1/2/3 仍能跳转 AD


          const canvas = find('Canvas');
          if (canvas && !canvas.getComponent(_crd && BtnAdGuard === void 0 ? (_reportPossibleCrUseOfBtnAdGuard({
            error: Error()
          }), BtnAdGuard) : BtnAdGuard)) canvas.addComponent(_crd && BtnAdGuard === void 0 ? (_reportPossibleCrUseOfBtnAdGuard({
            error: Error()
          }), BtnAdGuard) : BtnAdGuard); // ad 节点：点击后弹出 Check-in，可领取数量与规则不变

          const adNode = find('Canvas/ad');

          if (adNode && !adNode.getComponent(_crd && AdButton === void 0 ? (_reportPossibleCrUseOfAdButton({
            error: Error()
          }), AdButton) : AdButton)) {
            adNode.addComponent(_crd && AdButton === void 0 ? (_reportPossibleCrUseOfAdButton({
              error: Error()
            }), AdButton) : AdButton);
          } // 道具键由 AdButton 统一绑定；BtnAdGuard 仅处理次数为 0 时跳广告
          // 调试：打印节点与 Label 绑定情况


          const childNames = this.node.children.map(c => c.name);
          console.log('[PetValue] onLoad node =', this.node.name, 'children =', childNames, 'hpLabel?', !!this.hpLabel, 'intimacyLabel?', !!this.intimacyLabel); // 定时任务：每个整点扣减心情

          const delayMs = getMsUntilNextFullHour();
          const delaySeconds = Math.max(1, Math.floor(delayMs / 1000));
          this.scheduleOnce(() => {
            this._tickHourly(); // 之后每 1 小时执行一次；不传 repeat 参数表示一直循环


            this.schedule(this._tickHourly, 3600); // 每 1 小时
          }, delaySeconds);
          game.on(Game.EVENT_SHOW, this._onGameShow, this);
        }

        onEnable() {
          PetValue.instance = this;
        }

        onDisable() {
          if (PetValue.instance === this) PetValue.instance = null;
          this.unschedule(this._tickHourly);
          game.off(Game.EVENT_SHOW, this._onGameShow, this);
        }
        /** 从后台回到前台：补扣心情整点 */


        _onGameShow() {
          if (!this.isValid) return;
          const savedLast = sys.localStorage.getItem(STORAGE_KEY_LAST);

          this._applyHourlyCatchUp(savedLast, true);

          this._save(true);

          this._updateLabels();
        }
        /**
         * 按「上次整点」与「当前整点」的经过小时数扣减心情（仅扣减，不写入 LAST；由调用方 _save(true)）。
         * @param savedLast 本地存的 petai_last_update
         * @param doCatchUp 是否执行扣减（首次安装或无 LAST 时不扣）
         */


        _applyHourlyCatchUp(savedLast, doCatchUp) {
          if (!doCatchUp || savedLast == null || savedLast === '') return;
          const now = Date.now();
          const currentHourStart = Math.floor(now / MS_PER_HOUR) * MS_PER_HOUR;
          let lastTickHourStart;

          if (/^\d{4}-\d{2}-\d{2}$/.test(savedLast)) {
            const [y, m, d] = savedLast.split('-').map(Number);
            lastTickHourStart = new Date(y, m - 1, d).getTime();
          } else {
            lastTickHourStart = parseInt(savedLast, 10) || 0;
          }

          const elapsedHours = Math.max(0, Math.floor((currentHourStart - lastTickHourStart) / MS_PER_HOUR));

          if (elapsedHours > 0) {
            this._mood = Math.max(0, Math.min(MAX_VALUE, this._mood - elapsedHours * DECREASE_MOOD_PER_HOUR));
          }
        }
        /** 增加体力，上限 MAX_VALUE */


        addHp(amount) {
          if (amount <= 0) return;
          this._hp = Math.min(MAX_VALUE, this._hp + amount);

          this._save();

          this._updateLabels();
        }

        _tickHourly() {
          this._mood = Math.max(0, Math.min(MAX_VALUE, this._mood - DECREASE_MOOD_PER_HOUR));

          this._save(true);

          this._updateLabels();
        }
        /** @param updateLastTick 仅在做整点扣减（或 onLoad 补扣）后传 true，其它保存不更新上次整点 */


        _save(updateLastTick = false) {
          try {
            sys.localStorage.setItem(STORAGE_KEY_HP, String(this._hp));
            sys.localStorage.setItem(STORAGE_KEY_MOOD, String(this._mood));
            sys.localStorage.setItem(STORAGE_KEY_FIRST_RUN_DONE, '1');

            if (updateLastTick) {
              const hourStart = Math.floor(Date.now() / MS_PER_HOUR) * MS_PER_HOUR;
              sys.localStorage.setItem(STORAGE_KEY_LAST, String(hourStart));
            }

            (_crd && syncWidgetFromStorage === void 0 ? (_reportPossibleCrUseOfsyncWidgetFromStorage({
              error: Error()
            }), syncWidgetFromStorage) : syncWidgetFromStorage)();
          } catch (e) {
            console.warn('[PetValue] 保存失败', e);
          }
        }
        /** 主界面不展示体力（数值仍存盘）；编辑器里已隐藏时此处兜底 */


        _hideHpUi() {
          var _this$hpLabel, _this$hpBar;

          const petHp = this.node.getChildByName('pet_hp');
          if (petHp) petHp.active = false;
          const hp = this.node.getChildByName('hp');
          if (hp) hp.active = false;
          if ((_this$hpLabel = this.hpLabel) != null && _this$hpLabel.node) this.hpLabel.node.active = false;
          if ((_this$hpBar = this.hpBar) != null && _this$hpBar.node) this.hpBar.node.active = false;
        }

        _updateLabels() {
          var _instance;

          this._ensureLabels();

          this._ensureBars();

          this._hideHpUi();

          if (this.intimacyLabel) this.intimacyLabel.string = String(this._mood);
          if (this.intimacyBar) this.intimacyBar.progress = this._mood / MAX_VALUE;

          const highNode = this._ensureHighIntimateNode();

          if (highNode) highNode.active = this.isMoodHigh() && !this.isHpLow() && !this.isMoodLow();
          (_instance = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
            error: Error()
          }), PetInfoBar) : PetInfoBar).instance) == null || _instance.refreshLowHpFeedPrompt();
        }

        get mood() {
          return this._mood;
        }
        /** 兜底：Inspector 未绑定进度条时，按 pet_value 下两栏自动查找 ProgressBar */


        _ensureBars() {
          if (!this.hpBar && this.node.children.length > 0) {
            const first = this.node.children[0];
            this.hpBar = first.getComponent(ProgressBar) || first.getComponentInChildren(ProgressBar) || null;
          }

          if (!this.intimacyBar && this.node.children.length > 1) {
            const second = this.node.children[1];
            this.intimacyBar = second.getComponent(ProgressBar) || second.getComponentInChildren(ProgressBar) || null;
          }
        }

        _ensureHighIntimateNode() {
          if (this.highIntimateNode) return this.highIntimateNode;
          const canvas = this.node.parent;

          if (canvas) {
            this.highIntimateNode = canvas.getChildByName('highintimate') || null;
          }

          if (!this.highIntimateNode) {
            this.highIntimateNode = find('Canvas/highintimate') || null;
          }

          return this.highIntimateNode;
        }
        /** 麦克风是否可用：不与体力/心情挂钩。 */


        canUseMicro() {
          return true;
        }

        isHpLowForMicro() {
          return this._hp < 60;
        }

        isMoodLowForMicro() {
          return this._mood < 60;
        }
        /** @deprecated 使用 isMoodLowForMicro */


        isIntimacyLowForMicro() {
          return this.isMoodLowForMicro();
        }

        isHpZero() {
          return this._hp <= 0;
        }

        isHpLow() {
          return this._hp < 20;
        }
        /** 对话框内展示「喂食」引导（略早于累趴动画阈值） */


        shouldShowFeedBubble() {
          return this._hp < 30;
        }

        isMoodZero() {
          return this._mood <= 0;
        }

        isMoodLow() {
          return this._mood < 20;
        }

        isMoodHigh() {
          return this._mood > 80;
        }
        /** @deprecated 使用 isMoodZero */


        isIntimacyZero() {
          return this.isMoodZero();
        }
        /** @deprecated 使用 isMoodLow */


        isIntimacyLow() {
          return this.isMoodLow();
        }
        /** @deprecated 使用 isMoodHigh */


        isIntimacyHigh() {
          return this.isMoodHigh();
        }
        /**
         * 兜底：如果 Inspector 里没有手动绑定 hpLabel/intimacyLabel，
         * 则根据当前节点下的子节点名称自动查找（hp / pet_hp / fs）。
         * 已经在 Inspector 绑定好的情况下不会覆盖。
         */

        /** 心情条根节点（❤️ 图标 + 数字），二者为 pet_value 下并列子节点 */


        _getMoodBarRoot() {
          return this.node;
        }
        /** 加心情时：整个心情条（心形 + 数值）一起缩放弹跳 */


        _playMoodBarScale() {
          const root = this._getMoodBarRoot();

          if (!(root != null && root.isValid)) return;
          root.setScale(1, 1, 1);
          tween(root).to(0.1, {
            scale: new Vec3(1.32, 1.32, 1)
          }).to(0.14, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'backOut'
          }).to(0.1, {
            scale: new Vec3(1.24, 1.24, 1)
          }).to(0.14, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'backOut'
          }).start();
        }

        _playMoodHeartsIfHappy() {
          if (!this.isMoodHigh() || this.isHpLow() || this.isMoodLow()) return;
          const hi = find('Canvas/highintimate');
          const heartComp = hi == null ? void 0 : hi.getComponent('HeartBubbleAni');
          heartComp == null || heartComp.burstOnce == null || heartComp.burstOnce(5);
        }
        /** 其它数值标签（如体力飘字落点）仅缩放文字节点 */


        _playTargetScale(target) {
          const n = target.node;
          n.setScale(1, 1, 1);
          tween(n).to(0.1, {
            scale: new Vec3(1.5, 1.5, 1)
          }).to(0.12, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'backOut'
          }).to(0.1, {
            scale: new Vec3(1.4, 1.4, 1)
          }).to(0.12, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'backOut'
          }).start();
        }

        _ensureLabels() {
          if (!this.hpLabel) {
            var _this$hpLabel$node$na, _this$hpLabel2;

            const hpNode = this.node.getChildByName('hp');

            if (hpNode) {
              this.hpLabel = hpNode.getComponent(Label) || hpNode.getComponentInChildren(Label);
            }

            if (!this.hpLabel) {
              const petHpNode = this.node.getChildByName('pet_hp');

              if (petHpNode) {
                this.hpLabel = petHpNode.getComponent(Label) || petHpNode.getComponentInChildren(Label);
              }
            }

            console.log('[PetValue] _ensureLabels hpLabel set to', (_this$hpLabel$node$na = (_this$hpLabel2 = this.hpLabel) == null ? void 0 : _this$hpLabel2.node.name) != null ? _this$hpLabel$node$na : 'null');
          }

          if (!this.intimacyLabel) {
            const fsNode = this.node.getChildByName('fs');

            if (fsNode) {
              this.intimacyLabel = fsNode.getComponent(Label) || fsNode.getComponentInChildren(Label);
            }

            if (!this.intimacyLabel) {
              const friendship = this.node.getChildByName('pet_friendship');

              if (friendship) {
                this.intimacyLabel = friendship.getComponentInChildren(Label);
              }
            }
          }
        }
        /**
         * 心情 +N：在宠物旁上飘并淡出，不飞向 ❤️ 数字；数字立即更新并缩放弹跳。
         */


        _spawnMoodFloatUp(delta, petNode, offsetX = 0, onArrive) {
          const target = this.intimacyLabel;
          if (!target || !delta) return;
          const canvas = this.node.parent;
          if (!canvas) return;
          if (onArrive) onArrive();

          this._playMoodBarScale();

          this._playMoodHeartsIfHappy();

          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).playValueIncreaseSound();
          const deltaNode = new Node('MoodDeltaFloat');
          deltaNode.addComponent(UITransform);
          const label = deltaNode.addComponent(Label);
          label.string = `${delta > 0 ? '+' : ''}${delta}`;
          const scaleFactor = 1.25;
          label.fontSize = Math.max(28, target.fontSize * scaleFactor);
          label.lineHeight = Math.max(32, target.lineHeight * scaleFactor);
          label.isBold = true;
          label.color = new Color(255, 105, 180, 255);
          const opacity = deltaNode.addComponent(UIOpacity);
          opacity.opacity = 0;
          canvas.addChild(deltaNode);
          const canvasUIT = canvas.getComponent(UITransform);
          const targetUIT = target.node.getComponent(UITransform);

          if (!canvasUIT || !targetUIT) {
            deltaNode.destroy();
            return;
          }

          let startLocalPos;

          if (petNode) {
            const petUIT = petNode.getComponent(UITransform);

            if (petUIT) {
              const petH = Math.max(petUIT.contentSize.height, 200);
              const petStartLocal = new Vec3(0, petH / 2 - 60, 0);
              startLocalPos = canvasUIT.convertToNodeSpaceAR(petUIT.convertToWorldSpaceAR(petStartLocal));
            } else {
              startLocalPos = canvasUIT.convertToNodeSpaceAR(targetUIT.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
            }
          } else {
            startLocalPos = canvasUIT.convertToNodeSpaceAR(targetUIT.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
          }

          const startX = startLocalPos.x + offsetX;
          const startY = startLocalPos.y;
          const startZ = startLocalPos.z;
          const riseY = 88;
          const floatDuration = 0.48;
          deltaNode.setPosition(startX, startY, startZ);
          deltaNode.setScale(0.9, 0.9, 1);
          tween(deltaNode).to(0.06, {
            scale: new Vec3(1.12, 1.12, 1)
          }).to(floatDuration, {
            position: new Vec3(startX, startY + riseY, startZ)
          }, {
            easing: 'sineOut'
          }).call(() => {
            if (deltaNode.isValid) deltaNode.destroy();
          }).start();
          tween(opacity).to(0.1, {
            opacity: 255
          }).delay(0.12).to(0.3, {
            opacity: 0
          }).start();
        }
        /**
         * 飘字动画：起始于宠物节点顶端靠下 100px，0.4 秒后到达宠物节点顶端，停留指定时间后沿轨迹飘向原数值标签（体力等）。
         */


        _spawnDeltaLabel(target, delta, petNode, offsetX = 0, stayDuration = 3, onArrive) {
          if (target === this.intimacyLabel) {
            this._spawnMoodFloatUp(delta, petNode, offsetX, onArrive);

            return;
          }

          if (!target || !delta) return;
          const canvas = this.node.parent;
          if (!canvas) return;
          const deltaNode = new Node('DeltaLabel');
          deltaNode.addComponent(UITransform);
          const label = deltaNode.addComponent(Label);
          label.string = `${delta > 0 ? '+' : ''}${delta}`; // 字体稍微放大、加粗

          const scaleFactor = 1.2;
          label.fontSize = target.fontSize * scaleFactor;
          label.lineHeight = target.lineHeight * scaleFactor;
          label.isBold = true; // 根据是体力还是亲密度设置颜色：体力黄色，亲密桃红

          if (target === this.hpLabel) {
            label.color = new Color(255, 236, 61, 255); // 明亮黄色
          } else if (target === this.intimacyLabel) {
            label.color = new Color(255, 105, 180, 255); // 桃红色
          } // 通过 UIOpacity 控制整体透明度（开始时透明）


          const opacity = deltaNode.addComponent(UIOpacity);
          opacity.opacity = 0;
          canvas.addChild(deltaNode);
          const canvasUIT = canvas.getComponent(UITransform);
          const targetUIT = target.node.getComponent(UITransform);

          if (!canvasUIT || !targetUIT) {
            deltaNode.destroy();
            return;
          }

          const targetWorldPos = targetUIT.convertToWorldSpaceAR(new Vec3(0, 0, 0));
          let startLocalPos;
          let floatUpEndLocalPos;

          if (petNode) {
            const petUIT = petNode.getComponent(UITransform);

            if (petUIT) {
              const petH = Math.max(petUIT.contentSize.height, 200);
              const petTopLocal = new Vec3(0, petH / 2, 0);
              const petStartLocal = new Vec3(0, petH / 2 - 100, 0);
              startLocalPos = canvasUIT.convertToNodeSpaceAR(petUIT.convertToWorldSpaceAR(petStartLocal));
              floatUpEndLocalPos = canvasUIT.convertToNodeSpaceAR(petUIT.convertToWorldSpaceAR(petTopLocal));
            } else {
              startLocalPos = canvasUIT.convertToNodeSpaceAR(targetWorldPos);
              floatUpEndLocalPos = startLocalPos.clone();
            }
          } else {
            startLocalPos = canvasUIT.convertToNodeSpaceAR(targetWorldPos);
            floatUpEndLocalPos = startLocalPos.clone();
          }

          const endLocalPos = canvasUIT.convertToNodeSpaceAR(targetWorldPos);
          deltaNode.setPosition(startLocalPos.x + offsetX, startLocalPos.y, startLocalPos.z);
          const flyDuration = 0.5;
          const arcHeight = 30;
          const flyStartX = floatUpEndLocalPos.x + offsetX;
          const flyStartY = floatUpEndLocalPos.y;
          const flyStartZ = floatUpEndLocalPos.z;
          tween(deltaNode).to(0.4, {
            position: new Vec3(floatUpEndLocalPos.x + offsetX, floatUpEndLocalPos.y, floatUpEndLocalPos.z)
          }).call(() => {
            tween(deltaNode).to(0.15, {
              scale: new Vec3(1.25, 1.25, 1)
            }).start();
          }).delay(stayDuration).call(() => {
            const proxy = {
              t: 0
            };
            tween(proxy).to(flyDuration, {
              t: 1
            }, {
              easing: 'sineOut',
              onUpdate: () => {
                const k = proxy.t;
                const x = flyStartX + (endLocalPos.x - flyStartX) * k;
                const y = flyStartY + (endLocalPos.y - flyStartY) * k + 2 * arcHeight * k * (1 - k);
                deltaNode.setPosition(x, y, flyStartZ);
              }
            }).call(() => {
              deltaNode.destroy();
              (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
                error: Error()
              }), AudioManager) : AudioManager).playValueIncreaseSound();

              if (onArrive) {
                onArrive();
              }

              this._playTargetScale(target);
            }).start();
          }).start(); // 同步做 0 → 0.4 秒的渐显

          tween(opacity).to(0.4, {
            opacity: 255
          }).start();
        }
        /**
         * 飘字直接飞向目标（无停留）：用于 Check-in 领取时数字飞向 button1/2/3
         */


        spawnFlyingLabelDirect(startNode, target, delta, color, onArrive) {
          if (!target || !delta) return;
          const canvas = this.node.parent;
          if (!canvas) return;
          const deltaNode = new Node('DeltaLabel');
          deltaNode.addComponent(UITransform);
          const label = deltaNode.addComponent(Label);
          label.string = `${delta > 0 ? '+' : ''}${delta}`;
          const scaleFactor = 1.2;
          label.fontSize = target.fontSize * scaleFactor;
          label.lineHeight = target.lineHeight * scaleFactor;
          label.isBold = true;
          label.color = color || new Color(255, 236, 61, 255);
          const opacity = deltaNode.addComponent(UIOpacity);
          opacity.opacity = 0;
          canvas.addChild(deltaNode);
          const canvasUIT = canvas.getComponent(UITransform);
          const targetUIT = target.node.getComponent(UITransform);
          const startUIT = startNode.getComponent(UITransform);

          if (!canvasUIT || !targetUIT || !startUIT) {
            deltaNode.destroy();
            return;
          }

          const startLocalPos = canvasUIT.convertToNodeSpaceAR(startUIT.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
          const endLocalPos = canvasUIT.convertToNodeSpaceAR(targetUIT.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
          deltaNode.setPosition(startLocalPos);
          const flyDuration = 0.5;
          const arcHeight = 25;
          tween(opacity).to(0.15, {
            opacity: 255
          }).start();
          const proxy = {
            t: 0
          };
          tween(proxy).to(flyDuration, {
            t: 1
          }, {
            easing: 'sineOut',
            onUpdate: () => {
              const k = proxy.t;
              const x = startLocalPos.x + (endLocalPos.x - startLocalPos.x) * k;
              const y = startLocalPos.y + (endLocalPos.y - startLocalPos.y) * k + 2 * arcHeight * k * (1 - k);
              deltaNode.setPosition(x, y, startLocalPos.z);
            }
          }).call(() => {
            deltaNode.destroy();
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).playValueIncreaseSound();
            if (onArrive) onArrive();

            this._playTargetScale(target);
          }).start();
        }
        /** Button1：体力 +20（不展示），心情 +5（飘字） */


        applyBtn1(petNode) {
          var _instance2;

          const addHp = 20;
          const addMood = 5;
          this._hp = Math.min(MAX_VALUE, this._hp + addHp);
          this._mood = Math.min(MAX_VALUE, this._mood + addMood);

          this._save();

          const syncLabels = () => this._updateLabels();

          if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
          } else {
            this._updateLabels();
          }

          (_instance2 = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
            error: Error()
          }), PetInfoBar) : PetInfoBar).instance) == null || _instance2.refreshLowHpFeedPrompt();
        }
        /**
         * 完成一轮语音/文字聊天：扣体力（无飘字），加心情（桃红飘字 + 更新 ❤️ 数字）。
         */


        applyVoiceChat(petNode) {
          var _instance3;

          this._hp = Math.max(0, this._hp - VOICE_CHAT_HP_COST);
          const addMood = VOICE_CHAT_MOOD_GAIN;
          this._mood = Math.min(MAX_VALUE, this._mood + addMood);

          this._save();

          const syncLabels = () => this._updateLabels();

          if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
          } else {
            syncLabels();
          }

          (_instance3 = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
            error: Error()
          }), PetInfoBar) : PetInfoBar).instance) == null || _instance3.refreshLowHpFeedPrompt();
        }
        /** Button2：心情 +20 */


        applyBtn2(petNode) {
          const addMood = 20;
          this._mood = Math.min(MAX_VALUE, this._mood + addMood);

          this._save();

          const syncLabels = () => this._updateLabels();

          if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
          } else {
            this._updateLabels();
          }
        }
        /** Button3：心情 +20 */


        applyBtn3(petNode) {
          const addMood = 20;
          this._mood = Math.min(MAX_VALUE, this._mood + addMood);

          this._save();

          const syncLabels = () => this._updateLabels();

          if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
          } else {
            this._updateLabels();
          }
        }
        /** 今日撸猫/逗狗次数 +1（按设备本地 0 点日期，跨日清零） */


        static incrementTodayPetCount() {
          const today = (_crd && getLocalDateString === void 0 ? (_reportPossibleCrUseOfgetLocalDateString({
            error: Error()
          }), getLocalDateString) : getLocalDateString)();
          const lastDate = sys.localStorage.getItem(STORAGE_KEY_TODAY_PET_DATE) || '';
          const count = lastDate === today ? (parseInt(sys.localStorage.getItem(STORAGE_KEY_TODAY_PET_COUNT) || '0', 10) || 0) + 1 : 1;
          sys.localStorage.setItem(STORAGE_KEY_TODAY_PET_DATE, today);
          sys.localStorage.setItem(STORAGE_KEY_TODAY_PET_COUNT, String(count));
        }
        /** Button0：心情 +2 */


        applyBtn0(petNode) {
          PetValue.incrementTodayPetCount();
          const addMood = 2;
          this._mood = Math.min(MAX_VALUE, this._mood + addMood);

          this._save();

          const syncLabels = () => this._updateLabels();

          if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
          } else {
            this._updateLabels();
          }
        }
        /** 滑动：心情 +5 */


        applySwipe(petNode) {
          PetValue.incrementTodayPetCount();
          const addMood = 5;
          this._mood = Math.min(MAX_VALUE, this._mood + addMood);

          this._save();

          const syncLabels = () => this._updateLabels();

          if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
          } else {
            this._updateLabels();
          }
        }
        /** 每分钟 3 次上限时的提示：交给 pet_info_bar 节点上的 PetInfoBar 显示，约 2 秒后恢复原文案 */


        showPerMinuteLimitHint(text, _petNode) {
          var _instance4;

          (_instance4 = (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
            error: Error()
          }), PetInfoBar) : PetInfoBar).instance) == null || _instance4.showPerMinuteLimitHint(text);
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "hpLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "intimacyLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "hpBar", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "intimacyBar", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "highIntimateNode", [_dec6], {
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
//# sourceMappingURL=76e301410d990efa695f8d3bcc176eef7377fdc8.js.map
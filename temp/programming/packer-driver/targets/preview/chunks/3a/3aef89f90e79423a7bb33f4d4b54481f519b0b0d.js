System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Animation, Node, Vec2, director, sys, Label, find, Button, RandomPlayPetAni, SwipeState, PetValue, SharedBtnCounts, PetInfoBar, HeartBubbleAni, _dec, _class, _class2, _crd, ccclass, CLIP_SUFFIXES, SHORT_SUFFIX, LONG_SUFFIX, PetControllerBase;

  function getClipDurationMs(suffix) {
    if (suffix === '13') return 1670;
    if (SHORT_SUFFIX.has(suffix)) return 1100;
    if (LONG_SUFFIX.has(suffix)) return 4850;
    return 3300;
  }
  /**
   * 狗/猫共用控制逻辑基类。
   * 子类只需要提供前缀（dog/cat），以及（可选）兼容方法别名。
   */


  function _reportPossibleCrUseOfRandomPlayPetAni(extras) {
    _reporterNs.report("RandomPlayPetAni", "./RandomPlayPetAni", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSwipeState(extras) {
    _reporterNs.report("SwipeState", "./SwipeState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetValue(extras) {
    _reporterNs.report("PetValue", "./PetValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSharedBtnCounts(extras) {
    _reporterNs.report("SharedBtnCounts", "./SharedBtnCounts", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetInfoBar(extras) {
    _reporterNs.report("PetInfoBar", "./PetInfoBar", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHeartBubbleAni(extras) {
    _reporterNs.report("HeartBubbleAni", "./HeartBubbleAni", _context.meta, extras);
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
      Node = _cc.Node;
      Vec2 = _cc.Vec2;
      director = _cc.director;
      sys = _cc.sys;
      Label = _cc.Label;
      find = _cc.find;
      Button = _cc.Button;
    }, function (_unresolved_2) {
      RandomPlayPetAni = _unresolved_2.RandomPlayPetAni;
    }, function (_unresolved_3) {
      SwipeState = _unresolved_3.SwipeState;
    }, function (_unresolved_4) {
      PetValue = _unresolved_4.PetValue;
    }, function (_unresolved_5) {
      SharedBtnCounts = _unresolved_5.SharedBtnCounts;
    }, function (_unresolved_6) {
      PetInfoBar = _unresolved_6.PetInfoBar;
    }, function (_unresolved_7) {
      HeartBubbleAni = _unresolved_7.HeartBubbleAni;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "008edIcX9NIuInP0hzT9etn", "PetControllerBase", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Animation', 'Node', 'EventTouch', 'Vec2', 'director', 'sys', 'Label', 'find', 'Button']);

      ({
        ccclass
      } = _decorator);
      CLIP_SUFFIXES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17'];
      SHORT_SUFFIX = new Set(['06', '07', '08']);
      LONG_SUFFIX = new Set(['09', '10', '11', '13', '14', '15', '16', '17']);

      _export("PetControllerBase", PetControllerBase = (_dec = ccclass('PetControllerBase'), _dec(_class = (_class2 = class PetControllerBase extends Component {
        constructor() {
          super(...arguments);
          // 这些字段由子类声明为 @property，以保证场景序列化/Inspector 兼容
          this.anim = void 0;
          this.scrollViewForSwipe = null;
          this.swipeAreaNode = null;
          this.swipeThreshold = 50;
          this.rechargePanel = null;
          this.petValue = null;
          this.btn1Label = null;
          this.btn2Label = null;
          this.btn3Label = null;
          // Button1/2/3 次数为 0 时显示的「toad」节点（在场景中位于 ButtonX/Sprite/toad）
          this.btn1Toad = null;
          this.btn2Toad = null;
          this.btn3Toad = null;
          this._btn0ClickTimes = [];
          this._btn0SwipeTimes = [];
          this._btn1ClickTimes = [];
          this._btn2ClickTimes = [];
          this._btn3ClickTimes = [];
          this._btn0Mode13Until = 0;
          this._btn0SwipeMode13Until = 0;
          this._btn1Mode13Until = 0;
          this._btn2Mode13Until = 0;
          this._btn3Mode13Until = 0;
          this._btn1IgnoreUntil = 0;
          this._btn2IgnoreUntil = 0;
          this._btn3IgnoreUntil = 0;
          this.currentClipName = '';
          this.sequenceQueue = [];
          this.isPlayingSequence = false;
          this.sequenceTimer = null;
          this._randomAniDisabledByUser = false;
          this._swipeTouchStart = new Vec2();

          this._reenableHeartBubbleAni = () => {
            if (this.isValid && this.node.isValid) this._setHeartBubbleAniEnabled(true);
          };
        }

        clip(suffix) {
          return "" + this.prefix + suffix;
        }

        onLoad() {
          var _director$getScene;

          this.currentClipName = this.clip('01');
          if (!this.anim) this.anim = this.node.getComponent(Animation);
          if (!this.petValue) this.petValue = ((_director$getScene = director.getScene()) == null ? void 0 : _director$getScene.getComponentInChildren(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue)) || null;

          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).onChangeCallback = () => this._updateCountLabels();

          this._updateCountLabels();

          var swipeNode = this.swipeAreaNode || this.scrollViewForSwipe;

          if (swipeNode) {
            swipeNode.on(Node.EventType.TOUCH_START, this._onSwipeTouchStart, this);
            swipeNode.on(Node.EventType.TOUCH_END, this._onSwipeTouchEnd, this);
            swipeNode.on(Node.EventType.TOUCH_CANCEL, this._onSwipeTouchEnd, this);
          }
        }

        onEnable() {
          this._updateCountLabels();

          this._syncCurrentClip();

          var returnedFromAd = (_crd && RandomPlayPetAni === void 0 ? (_reportPossibleCrUseOfRandomPlayPetAni({
            error: Error()
          }), RandomPlayPetAni) : RandomPlayPetAni).returnedFromAd;

          if (returnedFromAd) {
            var _this$_getRandomPlay;

            this.playLoop(this.clip('01'));
            (_this$_getRandomPlay = this._getRandomPlay()) == null || _this$_getRandomPlay.cancelSwitchTimer();
            this.scheduleOnce(() => {
              (_crd && RandomPlayPetAni === void 0 ? (_reportPossibleCrUseOfRandomPlayPetAni({
                error: Error()
              }), RandomPlayPetAni) : RandomPlayPetAni).returnedFromAd = false;
            }, 0);
            return;
          }

          if (this._randomAniDisabledByUser && !this.isPlayingSequence) {
            var _this$_getRandomPlay2;

            this.playLoop(this.clip('01'));
            (_this$_getRandomPlay2 = this._getRandomPlay()) == null || _this$_getRandomPlay2.cancelSwitchTimer();
          }
        }

        onDisable() {
          if (this.sequenceTimer !== null) {
            clearTimeout(this.sequenceTimer);
            this.sequenceTimer = null;
          }

          this.isPlayingSequence = false;
          var swipeNode = this.swipeAreaNode || this.scrollViewForSwipe;

          if (swipeNode) {
            swipeNode.off(Node.EventType.TOUCH_START, this._onSwipeTouchStart, this);
            swipeNode.off(Node.EventType.TOUCH_END, this._onSwipeTouchEnd, this);
            swipeNode.off(Node.EventType.TOUCH_CANCEL, this._onSwipeTouchEnd, this);
          }
        }

        _onSwipeTouchStart(e) {
          e.getUILocation(this._swipeTouchStart);
        }

        _onSwipeTouchEnd(e) {
          var end = new Vec2();
          e.getUILocation(end);
          var deltaX = end.x - this._swipeTouchStart.x;
          var deltaY = end.y - this._swipeTouchStart.y;

          if (Math.abs(deltaX) >= this.swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
            e.stopPropagation == null || e.stopPropagation();
            this.playSwipe12Sequence();
          }
        }

        start() {
          if (this.rechargePanel) this.rechargePanel.active = false;

          this._ensureCountLabels();

          if (!this.anim) this.anim = this.node.getComponent(Animation);
        }

        _ensureCountLabels() {
          if (!this.btn1Label || !this.btn2Label || !this.btn3Label || !this.btn1Toad || !this.btn2Toad || !this.btn3Toad) {
            var btn1 = find('Canvas/btn/Button1');
            var btn2 = find('Canvas/btn/Button2');
            var btn3 = find('Canvas/btn/Button3');

            if (btn1) {
              if (!this.btn1Label) this.btn1Label = btn1.getComponentInChildren(Label);

              if (!this.btn1Toad) {
                var sprite = btn1.getChildByName('Sprite');
                this.btn1Toad = sprite ? sprite.getChildByName('toad') : null;
              }
            }

            if (btn2) {
              if (!this.btn2Label) this.btn2Label = btn2.getComponentInChildren(Label);

              if (!this.btn2Toad) {
                var _sprite = btn2.getChildByName('Sprite');

                this.btn2Toad = _sprite ? _sprite.getChildByName('toad') : null;
              }
            }

            if (btn3) {
              if (!this.btn3Label) this.btn3Label = btn3.getComponentInChildren(Label);

              if (!this.btn3Toad) {
                var _sprite2 = btn3.getChildByName('Sprite');

                this.btn3Toad = _sprite2 ? _sprite2.getChildByName('toad') : null;
              }
            }

            this._updateCountLabels();
          }
        }

        _gotoAdScene(buttonIndex) {
          try {
            sys.localStorage.setItem('recharge_pet', this.prefix);
            sys.localStorage.setItem('recharge_button', String(buttonIndex));
          } catch (e) {
            console.warn('[PetControllerBase] 写入本地存储失败：', e);
          }

          (_crd && RandomPlayPetAni === void 0 ? (_reportPossibleCrUseOfRandomPlayPetAni({
            error: Error()
          }), RandomPlayPetAni) : RandomPlayPetAni).returnedFromAd = true;
          this.scheduleOnce(() => {
            if (!this.isValid) return;
            director.loadScene('ad', err => {
              if (err) console.error('[PetControllerBase] 无法加载 ad 场景', err);
            });
          }, 0);
        }

        playLoop(name) {
          this.currentClipName = name;
          this.sequenceQueue = [];
          this.isPlayingSequence = false;
          this.anim.play(name);
        }
        /** 公开方法：循环播放单个动画（用于滑动时实时播放） */


        playLoopClip(name) {
          this.playLoop(name);
        }
        /** 停止当前序列并回到待机动画（供麦克风停止按钮等调用） */


        playIdle() {
          if (this.sequenceTimer !== null) {
            clearTimeout(this.sequenceTimer);
            this.sequenceTimer = null;
          }

          this.sequenceQueue = [];
          this.isPlayingSequence = false;
          if (!this.anim) this.anim = this.node.getComponent(Animation);
          if (this.anim) this.playLoop(this.clip('01'));
        }

        playSequence(clips) {
          var _this$_getRandomPlay3;

          if (!clips || clips.length === 0) return;
          if (!this.anim) this.anim = this.node.getComponent(Animation);
          if (!this.anim) return;

          if (this.sequenceTimer !== null) {
            clearTimeout(this.sequenceTimer);
            this.sequenceTimer = null;
          }

          this.anim.stop();
          (_this$_getRandomPlay3 = this._getRandomPlay()) == null || _this$_getRandomPlay3.cancelSwitchTimer();
          this.sequenceQueue = clips.slice();
          this.isPlayingSequence = true;

          this._setHeartBubbleAniEnabled(false);

          var totalMs = clips.reduce((sum, name) => sum + getClipDurationMs(name.slice(this.prefix.length)), 0);
          this.scheduleOnce(this._reenableHeartBubbleAni, totalMs / 1000);

          this._playNextFromQueue();
        }

        _setHeartBubbleAniEnabled(enabled) {
          var comp = this.node.getComponent(_crd && HeartBubbleAni === void 0 ? (_reportPossibleCrUseOfHeartBubbleAni({
            error: Error()
          }), HeartBubbleAni) : HeartBubbleAni);
          if (comp) comp.enabled = enabled;
        }

        _playNextFromQueue() {
          if (this.sequenceQueue.length === 0) {
            this.isPlayingSequence = false;
            return;
          }

          var nextName = this.sequenceQueue.shift();
          this.currentClipName = nextName;
          this.anim.play(nextName);

          if (this.sequenceQueue.length === 0) {
            this.isPlayingSequence = false;
            return;
          }

          var suffix = nextName.slice(this.prefix.length);
          var durationMs = 3300; // 单独为 13 调整为动画实际时长（约 1.67s）

          if (suffix === '13') {
            durationMs = 1670;
          } else if (SHORT_SUFFIX.has(suffix)) {
            durationMs = 1100;
          } else if (LONG_SUFFIX.has(suffix)) {
            durationMs = 4850;
          }

          this.sequenceTimer = setTimeout(() => {
            this.sequenceTimer = null;

            this._playNextFromQueue();
          }, durationMs);
        }

        _syncCurrentClip() {
          if (!this.anim) return this.currentClipName;

          for (var s of CLIP_SUFFIXES) {
            var name = this.clip(s);
            var state = this.anim.getState(name);

            if (state && state.isPlaying) {
              this.currentClipName = name;
              return name;
            }
          }

          return this.currentClipName;
        }

        _getRandomPlay() {
          return this.node.getComponent(_crd && RandomPlayPetAni === void 0 ? (_reportPossibleCrUseOfRandomPlayPetAni({
            error: Error()
          }), RandomPlayPetAni) : RandomPlayPetAni) || null;
        }
        /** 数值变化时暂时隐藏 info bar，若已经在隐藏状态则简单覆盖持续时间。 */


        _hideInfoBarTemporarily(seconds) {
          if (seconds === void 0) {
            seconds = 2;
          }

          (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
            error: Error()
          }), PetInfoBar) : PetInfoBar).setGlobalVisible(false); // 使用组件自己的 scheduleOnce，info bar 的节点状态不影响这里的计时

          this.scheduleOnce(() => {
            (_crd && PetInfoBar === void 0 ? (_reportPossibleCrUseOfPetInfoBar({
              error: Error()
            }), PetInfoBar) : PetInfoBar).setGlobalVisible(true);
          }, seconds);
        }

        _updateCountLabels() {
          var counts = [(_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn1, (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn2, (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn3];
          var labels = [this.btn1Label, this.btn2Label, this.btn3Label];
          var toads = [this.btn1Toad, this.btn2Toad, this.btn3Toad];

          for (var i = 0; i < 3; i++) {
            var c = counts[i];
            var label = labels[i];
            var toad = toads[i];

            if (label) {
              label.string = String(c); // 可点击次数为 0 时隐藏数字，用 toad 图标替代

              label.node.active = c > 0;
            }

            if (toad) {
              toad.active = c <= 0;
            }
          } // 数量为 0 时确保按钮仍可点击，以便跳转 AD 场景


          this._ensureBtnInteractableWhenZero();
        }

        _ensureBtnInteractableWhenZero() {
          var btns = [find('Canvas/btn/Button1'), find('Canvas/btn/Button2'), find('Canvas/btn/Button3')];
          var counts = [(_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn1, (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn2, (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn3];
          btns.forEach((n, i) => {
            if (!n || counts[i] >= 1) return;
            var btn = n.getComponent(Button);
            if (btn) btn.interactable = true;
          });
        }

        _disableRandomAniAfterUserInteraction() {
          if (this._randomAniDisabledByUser) return;
          this._randomAniDisabledByUser = true;

          var comp = this._getRandomPlay();

          if (comp) comp.enabled = false;
        }
        /** 确保 petValue 可用：优先使用已绑定的，再通过场景路径 Canvas/pet_value 兜底查找 */


        _ensurePetValue() {
          // 已有引用且已经绑定了任一 Label，则直接用它
          if (this.petValue && (this.petValue.hpLabel || this.petValue.intimacyLabel)) {
            return this.petValue;
          } // 兜底：按当前场景结构，通过路径查找 Canvas/pet_value 上的 PetValue


          var n = find('Canvas/pet_value');
          var comp = n ? n.getComponent(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue) : null;

          if (comp) {
            this.petValue = comp;
          } else if (!this.petValue) {
            var _director$getScene2;

            // 最后再退回到全局查找一次，避免场景结构变更时找不到
            this.petValue = ((_director$getScene2 = director.getScene()) == null ? void 0 : _director$getScene2.getComponentInChildren(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
              error: Error()
            }), PetValue) : PetValue)) || null;
          }

          return this.petValue;
        }

        _pruneClickTimes(arr, windowMs) {
          var now = Date.now();

          while (arr.length > 0 && now - arr[0] > windowMs) arr.shift();
        }

        _shouldPlay13(clickTimes) {
          this._pruneClickTimes(clickTimes, PetControllerBase.BTN_COUNT_WINDOW_MS);

          return clickTimes.length >= 3;
        }
        /** 按钮每分钟 3 次上限时的提示：在当前宠物节点上方显示 */


        _showPerMinuteLimitHint() {
          try {
            var pv = this._ensurePetValue();

            var anyPv = pv;

            if (anyPv && typeof anyPv.showPerMinuteLimitHint === 'function') {
              anyPv.showPerMinuteLimitHint(undefined, this.node);
            }
          } catch (e) {
            console.warn('[PetControllerBase] showPerMinuteLimitHint error', e);
          }
        }

        onBtn0Click() {
          if (!this.node.active) return;
          if ((_crd && SwipeState === void 0 ? (_reportPossibleCrUseOfSwipeState({
            error: Error()
          }), SwipeState) : SwipeState).ignoreNextBtn0Click) return;
          if (this.isPlayingSequence) return;

          this._disableRandomAniAfterUserInteraction();

          var now = Date.now(); // 每分钟超过 3 次：播放 dog13/cat13，不加数值

          if (this._btn0Mode13Until && now < this._btn0Mode13Until) {
            this._showPerMinuteLimitHint();

            if (!this.isPlayingSequence) {
              this.playSequence([this.clip('13'), this.clip('01')]);
            }

            return;
          }

          if (this._btn0Mode13Until && now >= this._btn0Mode13Until) {
            this._btn0Mode13Until = 0;
            this._btn0ClickTimes = [];
          }

          if (this._shouldPlay13(this._btn0ClickTimes)) {
            this._btn0Mode13Until = now + PetControllerBase.BTN_COUNT_WINDOW_MS;

            this._btn0ClickTimes.push(now);

            this._showPerMinuteLimitHint();

            this.playSequence([this.clip('13'), this.clip('01')]);
            return;
          }

          this._btn0ClickTimes.push(now);

          var pv = this._ensurePetValue();

          if (pv) {
            pv.applyBtn0(this.node);

            this._hideInfoBarTemporarily();
          }

          var cur = this._syncCurrentClip();

          var s = cur.slice(this.prefix.length);
          var seq = [];
          if (s === '01' || s === '04') seq = [this.clip('06'), this.clip('01')];else if (s === '02' || s === '05' || s === '14') seq = [this.clip('07'), this.clip('01')];else if (s === '03') seq = [this.clip('08'), this.clip('01')];else seq = [this.clip('01')];
          this.playSequence(seq);
        }
        /** Button0 滑动：独立于点击的每分钟 3 次限制，超限播放 dog13/cat13 */


        onBtn0Swipe(petNode) {
          if (!this.node.active) return;
          if (this.isPlayingSequence) return;

          this._disableRandomAniAfterUserInteraction();

          var now = Date.now();

          if (this._btn0SwipeMode13Until && now < this._btn0SwipeMode13Until) {
            this._showPerMinuteLimitHint();

            if (!this.isPlayingSequence) {
              this.playSequence([this.clip('13'), this.clip('01')]);
            }

            return;
          }

          if (this._btn0SwipeMode13Until && now >= this._btn0SwipeMode13Until) {
            this._btn0SwipeMode13Until = 0;
            this._btn0SwipeTimes = [];
          }

          if (this._shouldPlay13(this._btn0SwipeTimes)) {
            this._btn0SwipeMode13Until = now + PetControllerBase.BTN_COUNT_WINDOW_MS;

            this._btn0SwipeTimes.push(now);

            this._showPerMinuteLimitHint();

            this.playSequence([this.clip('13'), this.clip('01')]);
            return;
          }

          this._btn0SwipeTimes.push(now);

          var pv = this._ensurePetValue();

          if (pv) {
            pv.applySwipe(petNode || this.node);

            this._hideInfoBarTemporarily();
          }
        }

        onBtn1Click() {
          if (!this.node.active) return;

          this._disableRandomAniAfterUserInteraction();

          this._ensurePetValue();

          var now = Date.now();

          if (now < this._btn1IgnoreUntil) {
            this._btn1IgnoreUntil = 0;
            return;
          }

          if ((_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn1 < 1) {
            this._gotoAdScene(1);

            return;
          }

          if (this._btn1Mode13Until && now < this._btn1Mode13Until) {
            this._showPerMinuteLimitHint();

            if (!this.isPlayingSequence) {
              this.playSequence([this.clip('13'), this.clip('01')]);
            }

            return;
          }

          if (this._btn1Mode13Until && now >= this._btn1Mode13Until) {
            this._btn1Mode13Until = 0;
            this._btn1ClickTimes = [];
          }

          if (this._shouldPlay13(this._btn1ClickTimes)) {
            this._btn1Mode13Until = now + PetControllerBase.BTN_COUNT_WINDOW_MS;

            this._btn1ClickTimes.push(now);

            this._showPerMinuteLimitHint();

            this.playSequence([this.clip('13'), this.clip('01')]);
            return;
          }

          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn1--;
          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).save();

          this._updateCountLabels();

          this._btn1ClickTimes.push(now); // 数值：Button1 体力 +20、亲密 +5（具体数值变更逻辑交给 PetValue，内部已处理上限 100）


          var pv1 = this._ensurePetValue();

          if (pv1) {
            pv1.applyBtn1(this.node);

            this._hideInfoBarTemporarily();
          }

          var cur = this._syncCurrentClip();

          var s = cur.slice(this.prefix.length);
          var seq = [];
          if (s === '02' || s === '05' || s === '14') seq = [this.clip('07'), this.clip('09'), this.clip('01')];else if (s === '03') seq = [this.clip('08'), this.clip('09'), this.clip('01')];else seq = [this.clip('09'), this.clip('01')];
          this.playSequence(seq);
        }

        onBtn2Click() {
          if (!this.node.active) return;

          this._disableRandomAniAfterUserInteraction();

          this._ensurePetValue();

          var now = Date.now();

          if (now < this._btn2IgnoreUntil) {
            this._btn2IgnoreUntil = 0;
            return;
          }

          if ((_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn2 < 1) {
            this._gotoAdScene(2);

            return;
          }

          if (this._btn2Mode13Until && now < this._btn2Mode13Until) {
            this._showPerMinuteLimitHint();

            if (!this.isPlayingSequence) {
              this.playSequence([this.clip('13'), this.clip('01')]);
            }

            return;
          }

          if (this._btn2Mode13Until && now >= this._btn2Mode13Until) {
            this._btn2Mode13Until = 0;
            this._btn2ClickTimes = [];
          }

          if (this._shouldPlay13(this._btn2ClickTimes)) {
            this._btn2Mode13Until = now + PetControllerBase.BTN_COUNT_WINDOW_MS;

            this._btn2ClickTimes.push(now);

            this._showPerMinuteLimitHint();

            this.playSequence([this.clip('13'), this.clip('01')]);
            return;
          }

          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn2--;
          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).save();

          this._updateCountLabels();

          this._btn2ClickTimes.push(now); // 数值：Button2 亲密 +20（具体数值变更逻辑交给 PetValue，内部已处理上限 100）


          var pv2 = this._ensurePetValue();

          if (pv2) {
            pv2.applyBtn2(this.node);

            this._hideInfoBarTemporarily();
          }

          var cur = this._syncCurrentClip();

          var s = cur.slice(this.prefix.length);
          var seq = [];
          if (s === '02' || s === '05' || s === '14') seq = [this.clip('07'), this.clip('10'), this.clip('01')];else if (s === '03') seq = [this.clip('08'), this.clip('10'), this.clip('01')];else seq = [this.clip('10'), this.clip('01')];
          this.playSequence(seq);
        }

        onBtn3Click() {
          if (!this.node.active) return;

          this._disableRandomAniAfterUserInteraction();

          this._ensurePetValue();

          var now = Date.now();

          if (now < this._btn3IgnoreUntil) {
            this._btn3IgnoreUntil = 0;
            return;
          }

          if ((_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn3 < 1) {
            this._gotoAdScene(3);

            return;
          }

          if (this._btn3Mode13Until && now < this._btn3Mode13Until) {
            this._showPerMinuteLimitHint();

            if (!this.isPlayingSequence) {
              this.playSequence([this.clip('13'), this.clip('01')]);
            }

            return;
          }

          if (this._btn3Mode13Until && now >= this._btn3Mode13Until) {
            this._btn3Mode13Until = 0;
            this._btn3ClickTimes = [];
          }

          if (this._shouldPlay13(this._btn3ClickTimes)) {
            this._btn3Mode13Until = now + PetControllerBase.BTN_COUNT_WINDOW_MS;

            this._btn3ClickTimes.push(now);

            this._showPerMinuteLimitHint();

            this.playSequence([this.clip('13'), this.clip('01')]);
            return;
          }

          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).btn3--;
          (_crd && SharedBtnCounts === void 0 ? (_reportPossibleCrUseOfSharedBtnCounts({
            error: Error()
          }), SharedBtnCounts) : SharedBtnCounts).save();

          this._updateCountLabels();

          this._btn3ClickTimes.push(now); // 数值：Button3 亲密 +20（具体数值变更逻辑交给 PetValue，内部已处理上限 100）


          var pv3 = this._ensurePetValue();

          if (pv3) {
            pv3.applyBtn3(this.node);

            this._hideInfoBarTemporarily();
          }

          var cur = this._syncCurrentClip();

          var s = cur.slice(this.prefix.length);
          var seq = [];
          if (s === '02' || s === '05' || s === '14') seq = [this.clip('07'), this.clip('11'), this.clip('01')];else if (s === '03') seq = [this.clip('08'), this.clip('11'), this.clip('01')];else seq = [this.clip('11'), this.clip('01')];
          this.playSequence(seq);
        }

        playSwipe12Sequence() {
          if (this.isPlayingSequence) return;

          this._disableRandomAniAfterUserInteraction();

          this.playSequence([this.clip('12'), this.clip('01')]);
        }

        playMicroRecordStart() {
          if (!this.node.active) return;

          this._disableRandomAniAfterUserInteraction();

          this.playSequence([this.clip('15'), this.clip('01')]);
        }

        playMicroRecordSent() {
          if (!this.node.active) return;

          this._disableRandomAniAfterUserInteraction();

          this.playSequence([this.clip('15'), this.clip('01')]);
        }

        playMicroThinking() {
          if (!this.node.active) return;

          this._disableRandomAniAfterUserInteraction();

          this.playSequence([this.clip('15'), this.clip('01')]);
        }

        playMicroTalking() {
          if (!this.node.active) return;

          this._disableRandomAniAfterUserInteraction(); // 15 is the cute "listening/responding" clip. 16 feels too much like "talking", 17 is blank in this project.


          this.playSequence([this.clip('15'), this.clip('01')]);
        }
        /** 若当前在“睡觉/夜间”动画（03），先播专用醒来（04）再回到待机（01）；否则退化为 thinking。 */


        wakeUpFromSleep() {
          if (!this.node.active) return;

          this._disableRandomAniAfterUserInteraction();

          var cur = this._syncCurrentClip();

          var s = cur.slice(this.prefix.length);

          if (s === '03') {
            // Sleep -> wake: 08 (sit up) then 04 (look around)
            this.playSequence([this.clip('08'), this.clip('04'), this.clip('01')]);
          } else {
            this.playMicroThinking();
          }
        }
        /** 若在睡觉（03），先醒来（04）再进入 talking（16）；否则直接 talking。 */


        wakeToTalking() {
          if (!this.node.active) return;

          this._disableRandomAniAfterUserInteraction();

          var cur = this._syncCurrentClip();

          var s = cur.slice(this.prefix.length);

          if (s === '03') {
            // Sleep -> wake (08->04) -> respond (15)
            this.playSequence([this.clip('08'), this.clip('04'), this.clip('15'), this.clip('01')]);
          } else {
            this.playMicroTalking();
          }
        }

      }, _class2.BTN_COUNT_WINDOW_MS = 60000, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3aef89f90e79423a7bb33f4d4b54481f519b0b0d.js.map
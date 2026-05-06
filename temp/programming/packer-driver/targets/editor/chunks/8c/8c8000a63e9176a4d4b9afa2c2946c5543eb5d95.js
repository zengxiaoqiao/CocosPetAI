System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, ScrollView, Vec2, director, find, DogController, CatController, SwipeState, PetValue, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, PetButtons;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDogController(extras) {
    _reporterNs.report("DogController", "./DogController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCatController(extras) {
    _reporterNs.report("CatController", "./CatController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSwipeState(extras) {
    _reporterNs.report("SwipeState", "./SwipeState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPetValue(extras) {
    _reporterNs.report("PetValue", "./PetValue", _context.meta, extras);
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
      ScrollView = _cc.ScrollView;
      Vec2 = _cc.Vec2;
      director = _cc.director;
      find = _cc.find;
    }, function (_unresolved_2) {
      DogController = _unresolved_2.DogController;
    }, function (_unresolved_3) {
      CatController = _unresolved_3.CatController;
    }, function (_unresolved_4) {
      SwipeState = _unresolved_4.SwipeState;
    }, function (_unresolved_5) {
      PetValue = _unresolved_5.PetValue;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ede32vRgLxIXpc6KHJpB3hE", "PetButtons", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'ScrollView', 'Vec2', 'EventTouch', 'director', 'find']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 同一组按钮控制狗/猫：根据当前显示的是谁，把 btn0～btn3 和滑动转发给 DogController 或 CatController。
       * 挂在任意节点上，把 dog 和 cat 节点拖进来；按钮的 Click Events 绑定到本脚本的 onBtn0Click～onBtn3Click。
       * 若用滑动播 dog12/cat12，把 ScrollView 拖到 scrollViewForSwipe，且 dog/cat 上的 ScrollView 留空。
       */

      _export("PetButtons", PetButtons = (_dec = ccclass('PetButtons'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(ScrollView), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property({
        tooltip: '滑动超过多少像素算有效滑动（任意方向，越大越不易与点击混淆）'
      }), _dec8 = property({
        tooltip: '需要滑动几次才触发动画'
      }), _dec9 = property({
        tooltip: '触摸至少持续多少毫秒才算滑动（避免与点击混淆）'
      }), _dec10 = property({
        tooltip: '开启时在控制台打印滑动进度'
      }), _dec11 = property({
        tooltip: '两次滑动之间超过多少毫秒会重置计数'
      }), _dec(_class = (_class2 = class PetButtons extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "dogNode", _descriptor, this);

          _initializerDefineProperty(this, "catNode", _descriptor2, this);

          _initializerDefineProperty(this, "scrollViewForSwipe", _descriptor3, this);

          /** 与点击共用同一区域时：把该按钮/区域节点拖到这里，左滑/右滑播 dog12/cat12，点击照常。 */
          _initializerDefineProperty(this, "swipeAreaNode", _descriptor4, this);

          /** 充值界面节点：当其 active 时，不把 btn1/2/3 点击转发给狗/猫，避免误触 */
          _initializerDefineProperty(this, "rechargePanel", _descriptor5, this);

          _initializerDefineProperty(this, "swipeThreshold", _descriptor6, this);

          _initializerDefineProperty(this, "swipeCountRequired", _descriptor7, this);

          _initializerDefineProperty(this, "swipeMinDurationMs", _descriptor8, this);

          _initializerDefineProperty(this, "swipeDebugLog", _descriptor9, this);

          _initializerDefineProperty(this, "swipeTimeoutMs", _descriptor10, this);

          this._swipeTouchStart = new Vec2();
          this._swipeTouchStartTime = 0;
          this._swipeCount = 0;
          this._swipeResetTimer = null;
          this._lastSwipePos = new Vec2();
          this._lastSwipeDirection = new Vec2();
          this._isTrackingSwipe = false;
          this._isPlayingSwipeAni = false;
          this._lastMoveTime = 0;
          this._swipeStopTimer = null;
        }

        _getSwipeNode() {
          var _this$scrollViewForSw;

          return this.swipeAreaNode || ((_this$scrollViewForSw = this.scrollViewForSwipe) == null ? void 0 : _this$scrollViewForSw.node) || this.node;
        }

        onLoad() {
          const swipeNode = this._getSwipeNode();

          if (swipeNode) {
            swipeNode.on(Node.EventType.TOUCH_START, this._onSwipeTouchStart, this);
            swipeNode.on(Node.EventType.TOUCH_MOVE, this._onSwipeTouchMove, this);
            swipeNode.on(Node.EventType.TOUCH_END, this._onSwipeTouchEnd, this);
            swipeNode.on(Node.EventType.TOUCH_CANCEL, this._onSwipeTouchEnd, this);
          }
        }

        onDisable() {
          const swipeNode = this._getSwipeNode();

          if (swipeNode) {
            swipeNode.off(Node.EventType.TOUCH_START, this._onSwipeTouchStart, this);
            swipeNode.off(Node.EventType.TOUCH_MOVE, this._onSwipeTouchMove, this);
            swipeNode.off(Node.EventType.TOUCH_END, this._onSwipeTouchEnd, this);
            swipeNode.off(Node.EventType.TOUCH_CANCEL, this._onSwipeTouchEnd, this);
          }

          this._clearSwipeResetTimer();

          this._clearSwipeStopTimer();

          this._stopSwipeAnimation();
        }

        _onSwipeTouchStart(e) {
          e.getUILocation(this._swipeTouchStart);
          this._swipeTouchStartTime = Date.now();
          this._lastMoveTime = Date.now();

          this._lastSwipePos.set(this._swipeTouchStart);

          this._lastSwipeDirection.set(0, 0);

          this._isTrackingSwipe = false;

          this._clearSwipeStopTimer();
        }

        _clearSwipeStopTimer() {
          if (this._swipeStopTimer !== null) {
            clearTimeout(this._swipeStopTimer);
            this._swipeStopTimer = null;
          }
        }

        _startSwipeAnimation() {
          if (this._isPlayingSwipeAni) return;
          this._isPlayingSwipeAni = true;

          if (this._isDogActive()) {
            var _this$dogNode;

            const dogCtrl = (_this$dogNode = this.dogNode) == null ? void 0 : _this$dogNode.getComponent(_crd && DogController === void 0 ? (_reportPossibleCrUseOfDogController({
              error: Error()
            }), DogController) : DogController);

            if (dogCtrl) {
              dogCtrl.playLoopClip('dog12');
              if (this.swipeDebugLog) console.log('[PetButtons] 开始播放 dog12');
            }
          } else {
            var _this$catNode;

            const catCtrl = (_this$catNode = this.catNode) == null ? void 0 : _this$catNode.getComponent(_crd && CatController === void 0 ? (_reportPossibleCrUseOfCatController({
              error: Error()
            }), CatController) : CatController);

            if (catCtrl) {
              catCtrl.playLoopClip('cat12');
              if (this.swipeDebugLog) console.log('[PetButtons] 开始播放 cat12');
            }
          }
        }

        _stopSwipeAnimation() {
          if (!this._isPlayingSwipeAni) return;
          this._isPlayingSwipeAni = false;

          if (this._isDogActive()) {
            var _this$dogNode2;

            const dogCtrl = (_this$dogNode2 = this.dogNode) == null ? void 0 : _this$dogNode2.getComponent(_crd && DogController === void 0 ? (_reportPossibleCrUseOfDogController({
              error: Error()
            }), DogController) : DogController);

            if (dogCtrl) {
              dogCtrl.playLoopClip('dog01');
              if (this.swipeDebugLog) console.log('[PetButtons] 停止滑动，播放 dog01');
            }
          } else {
            var _this$catNode2;

            const catCtrl = (_this$catNode2 = this.catNode) == null ? void 0 : _this$catNode2.getComponent(_crd && CatController === void 0 ? (_reportPossibleCrUseOfCatController({
              error: Error()
            }), CatController) : CatController);

            if (catCtrl) {
              catCtrl.playLoopClip('cat01');
              if (this.swipeDebugLog) console.log('[PetButtons] 停止滑动，播放 cat01');
            }
          }
        }

        _onSwipeTouchMove(e) {
          const current = new Vec2();
          e.getUILocation(current);
          const deltaX = current.x - this._lastSwipePos.x;
          const deltaY = current.y - this._lastSwipePos.y;
          const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          if (moveDistance < 10) return;
          this._lastMoveTime = Date.now();

          this._clearSwipeStopTimer();

          const currentDir = new Vec2(deltaX, deltaY);
          currentDir.normalize();

          if (!this._isTrackingSwipe) {
            const totalDistance = Math.sqrt((current.x - this._swipeTouchStart.x) * (current.x - this._swipeTouchStart.x) + (current.y - this._swipeTouchStart.y) * (current.y - this._swipeTouchStart.y));

            if (totalDistance >= this.swipeThreshold) {
              this._isTrackingSwipe = true;

              this._lastSwipeDirection.set(currentDir);

              this._lastSwipePos.set(current);

              this._startSwipeAnimation();

              this._clearSwipeResetTimer();

              this._swipeResetTimer = setTimeout(() => {
                this._swipeResetTimer = null;
                this._swipeCount = 0;
                this._isTrackingSwipe = false;
                if (this.swipeDebugLog) console.log(`[PetButtons] 滑动超时重置（${this.swipeTimeoutMs}ms内无新滑动）`);
              }, this.swipeTimeoutMs);
            }
          } else {
            const dot = this._lastSwipeDirection.x * currentDir.x + this._lastSwipeDirection.y * currentDir.y;

            if (dot < -0.5) {
              this._swipeCount++;
              const dirStr = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX > 0 ? '右' : '左' : deltaY > 0 ? '上' : '下';

              if (this.swipeDebugLog) {
                console.log(`[PetButtons] 滑动${dirStr} 第${this._swipeCount}/${this.swipeCountRequired}次`);
              }

              this._lastSwipeDirection.set(currentDir);

              this._clearSwipeResetTimer();

              this._swipeResetTimer = setTimeout(() => {
                this._swipeResetTimer = null;
                this._swipeCount = 0;
                this._isTrackingSwipe = false;
                if (this.swipeDebugLog) console.log(`[PetButtons] 滑动超时重置（${this.swipeTimeoutMs}ms内无新滑动）`);
              }, this.swipeTimeoutMs);

              if (this._swipeCount >= this.swipeCountRequired) {
                this._clearSwipeResetTimer();

                this._swipeCount = 0;
                this._isTrackingSwipe = false;
                (_crd && SwipeState === void 0 ? (_reportPossibleCrUseOfSwipeState({
                  error: Error()
                }), SwipeState) : SwipeState).ignoreNextBtn0Click = true;
                this.scheduleOnce(() => {
                  (_crd && SwipeState === void 0 ? (_reportPossibleCrUseOfSwipeState({
                    error: Error()
                  }), SwipeState) : SwipeState).ignoreNextBtn0Click = false;
                }, 0.1);
                if (this.swipeDebugLog) console.log('[PetButtons] 滑动触发 dog12/cat12');
              }
            }

            this._lastSwipePos.set(current);
          }

          this._clearSwipeStopTimer();

          this._swipeStopTimer = setTimeout(() => {
            this._swipeStopTimer = null;

            if (Date.now() - this._lastMoveTime > 100) {
              this._stopSwipeAnimation();
            }
          }, 150);
        }

        _clearSwipeResetTimer() {
          if (this._swipeResetTimer !== null) {
            clearTimeout(this._swipeResetTimer);
            this._swipeResetTimer = null;
          }
        }

        _onSwipeTouchEnd(e) {
          if (this._isTrackingSwipe) {
            const end = new Vec2();
            e.getUILocation(end);
            const totalDistance = Math.sqrt((end.x - this._swipeTouchStart.x) * (end.x - this._swipeTouchStart.x) + (end.y - this._swipeTouchStart.y) * (end.y - this._swipeTouchStart.y));

            if (totalDistance >= this.swipeThreshold) {
              // 设置标志，防止滑动结束后误触点击
              (_crd && SwipeState === void 0 ? (_reportPossibleCrUseOfSwipeState({
                error: Error()
              }), SwipeState) : SwipeState).ignoreNextBtn0Click = true;
              this.scheduleOnce(() => {
                (_crd && SwipeState === void 0 ? (_reportPossibleCrUseOfSwipeState({
                  error: Error()
                }), SwipeState) : SwipeState).ignoreNextBtn0Click = false;
              }, 0.2);

              const petNode = this._getCurrentPetNode();

              if (this._isDogActive()) {
                var _this$_getDogControll;

                (_this$_getDogControll = this._getDogController()) == null || _this$_getDogControll.onBtn0Swipe(petNode || undefined);
              } else {
                var _this$_getCatControll;

                (_this$_getCatControll = this._getCatController()) == null || _this$_getCatControll.onBtn0Swipe(petNode || undefined);
              }
            }
          }

          this._isTrackingSwipe = false;

          this._clearSwipeResetTimer();

          this._clearSwipeStopTimer();

          this._stopSwipeAnimation();
        }

        _isDogActive() {
          return !!this.dogNode && this.dogNode.active;
        }

        _getDogController() {
          return this.dogNode ? this.dogNode.getComponent(_crd && DogController === void 0 ? (_reportPossibleCrUseOfDogController({
            error: Error()
          }), DogController) : DogController) : null;
        }

        _getCatController() {
          return this.catNode ? this.catNode.getComponent(_crd && CatController === void 0 ? (_reportPossibleCrUseOfCatController({
            error: Error()
          }), CatController) : CatController) : null;
        }

        _ensurePetValue() {
          var _director$getScene;

          const n = find('Canvas/pet_value');
          return n ? n.getComponent(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue) : ((_director$getScene = director.getScene()) == null ? void 0 : _director$getScene.getComponentInChildren(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue)) || null;
        }

        _getCurrentPetNode() {
          return this._isDogActive() ? this.dogNode : this.catNode;
        }

        onBtn0Click() {
          if (this._isDogActive()) {
            var _this$_getDogControll2;

            (_this$_getDogControll2 = this._getDogController()) == null || _this$_getDogControll2.onBtn0Click();
          } else {
            var _this$_getCatControll2;

            (_this$_getCatControll2 = this._getCatController()) == null || _this$_getCatControll2.onBtn0Click();
          }
        }

        onBtn1Click() {
          if (this.rechargePanel && this.rechargePanel.active) return;

          if (this._isDogActive()) {
            var _this$_getDogControll3;

            (_this$_getDogControll3 = this._getDogController()) == null || _this$_getDogControll3.onBtn1Click();
          } else {
            var _this$_getCatControll3;

            (_this$_getCatControll3 = this._getCatController()) == null || _this$_getCatControll3.onBtn1Click();
          }
        }

        onBtn2Click() {
          if (this.rechargePanel && this.rechargePanel.active) return;

          if (this._isDogActive()) {
            var _this$_getDogControll4;

            (_this$_getDogControll4 = this._getDogController()) == null || _this$_getDogControll4.onBtn2Click();
          } else {
            var _this$_getCatControll4;

            (_this$_getCatControll4 = this._getCatController()) == null || _this$_getCatControll4.onBtn2Click();
          }
        }

        onBtn3Click() {
          if (this.rechargePanel && this.rechargePanel.active) return;

          if (this._isDogActive()) {
            var _this$_getDogControll5;

            (_this$_getDogControll5 = this._getDogController()) == null || _this$_getDogControll5.onBtn3Click();
          } else {
            var _this$_getCatControll5;

            (_this$_getCatControll5 = this._getCatController()) == null || _this$_getCatControll5.onBtn3Click();
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dogNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "catNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scrollViewForSwipe", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "swipeAreaNode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "rechargePanel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "swipeThreshold", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 50;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "swipeCountRequired", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "swipeMinDurationMs", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "swipeDebugLog", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "swipeTimeoutMs", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3000;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8c8000a63e9176a4d4b9afa2c2946c5543eb5d95.js.map
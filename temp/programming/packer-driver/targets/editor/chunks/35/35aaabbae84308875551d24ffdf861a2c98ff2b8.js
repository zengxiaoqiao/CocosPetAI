System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Sprite, SpriteFrame, UITransform, UIOpacity, tween, Vec3, find, sys, assetManager, PetValue, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _crd, ccclass, property, STORAGE_KEY_PET, LOVE_SPRITE_FRAME_UUID, HeartBubbleAni;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

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
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      UITransform = _cc.UITransform;
      UIOpacity = _cc.UIOpacity;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      find = _cc.find;
      sys = _cc.sys;
      assetManager = _cc.assetManager;
    }, function (_unresolved_2) {
      PetValue = _unresolved_2.PetValue;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1826eQT0lNLkoFxqDXLsNbJ", "HeartBubbleAni", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Sprite', 'SpriteFrame', 'UITransform', 'UIOpacity', 'tween', 'Vec3', 'find', 'sys', 'assetManager']);

      ({
        ccclass,
        property
      } = _decorator);
      STORAGE_KEY_PET = 'petai_pet_choice';
      /** ui 图集里的 love.png（大爱心），勿用 pet_friendship 小图标 */

      LOVE_SPRITE_FRAME_UUID = '3ae7a7fa-b2b9-415c-91eb-ceb82a98e659@b8fde';
      /**
       * 心情高时从宠物头顶略上方冒出爱心：自下往上、略向两侧散开；
       * 透明度 0 → 实 → 0，无扇形爆发与缩放脉冲。
       */

      _export("HeartBubbleAni", HeartBubbleAni = (_dec = ccclass('HeartBubbleAni'), _dec2 = property({
        type: SpriteFrame,
        tooltip: 'love 大图（可留空则自动用 ui 图集 love.png）'
      }), _dec3 = property({
        tooltip: '在估算头顶位置之上再上浮的像素（起点高度）'
      }), _dec4 = property({
        tooltip: '爆发点整体水平偏移（负值向左）'
      }), _dec5 = property({
        tooltip: '爆发点整体垂直偏移（负值向下）'
      }), _dec6 = property({
        tooltip: '向上飘移最小距离（像素）'
      }), _dec7 = property({
        tooltip: '向上飘移最大距离（像素）'
      }), _dec8 = property({
        tooltip: '水平散开半宽（像素）'
      }), _dec9 = property({
        tooltip: '飘到中段时的峰值不透明度（0~255）'
      }), _dec(_class = (_class2 = class HeartBubbleAni extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "heartSpriteFrame", _descriptor, this);

          _initializerDefineProperty(this, "burstCenterY", _descriptor2, this);

          _initializerDefineProperty(this, "burstOffsetX", _descriptor3, this);

          _initializerDefineProperty(this, "burstOffsetY", _descriptor4, this);

          _initializerDefineProperty(this, "burstInterval", _descriptor5, this);

          _initializerDefineProperty(this, "heartsPerBurst", _descriptor6, this);

          _initializerDefineProperty(this, "riseMin", _descriptor7, this);

          _initializerDefineProperty(this, "riseMax", _descriptor8, this);

          _initializerDefineProperty(this, "spreadX", _descriptor9, this);

          _initializerDefineProperty(this, "flyDuration", _descriptor10, this);

          _initializerDefineProperty(this, "heartScale", _descriptor11, this);

          _initializerDefineProperty(this, "staggerInBurst", _descriptor12, this);

          _initializerDefineProperty(this, "peakOpacity", _descriptor13, this);

          this._spriteFrame = null;
          this._timer = 0;
        }

        onLoad() {
          this._resolveHeartSpriteFrame();
        }

        onEnable() {
          this._resolveHeartSpriteFrame();

          this._timer = 0;
        }

        update(dt) {
          if (!this._spriteFrame) {
            this._resolveHeartSpriteFrame();

            if (!this._spriteFrame) return;
          }

          const pv = this._getPetValue();

          if (pv && (!pv.isMoodHigh() || pv.isHpLow() || pv.isMoodLow())) return;
          this._timer += dt;

          if (this._timer >= this.burstInterval) {
            this._timer = 0;

            this._fireBurst();
          }
        }
        /** 加心情等时机可主动飘几颗爱心 */


        burstOnce(count = 3) {
          if (!this._spriteFrame) this._resolveHeartSpriteFrame();
          if (!this._spriteFrame) return;
          const n = Math.max(1, count | 0);

          for (let i = 0; i < n; i++) {
            const delay = i * this.staggerInBurst;
            if (delay <= 0) this._spawnOneHeart();else this.scheduleOnce(() => this._spawnOneHeart(), delay);
          }
        }

        _frameUsable(frame) {
          return !!frame && !!frame.texture;
        }

        _resolveHeartSpriteFrame() {
          var _find;

          if (this._frameUsable(this.heartSpriteFrame)) {
            this._spriteFrame = this.heartSpriteFrame;
            return;
          }

          const hi = (_find = find('Canvas/highintimate')) != null ? _find : this.node;
          const sp = hi == null ? void 0 : hi.getComponent(Sprite);

          if (this._frameUsable(sp == null ? void 0 : sp.spriteFrame)) {
            this._spriteFrame = sp.spriteFrame;
            this.heartSpriteFrame = this._spriteFrame;
            return;
          }

          assetManager.loadAny({
            uuid: LOVE_SPRITE_FRAME_UUID
          }, (err, asset) => {
            if (!this.isValid) return;
            const frame = asset;

            if (!err && this._frameUsable(frame)) {
              this._spriteFrame = frame;
              this.heartSpriteFrame = frame;
            }
          });
        }

        _getPetValue() {
          var _ref, _instance, _find2;

          return (_ref = (_instance = (_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue).instance) != null ? _instance : (_find2 = find('Canvas/pet_value')) == null ? void 0 : _find2.getComponent(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue)) != null ? _ref : null;
        }

        _getBurstParent() {
          const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
          const dog = find('Canvas/dog');
          const cat = find('Canvas/cat');
          if (isCat && cat != null && cat.active) return cat;
          if (dog != null && dog.active) return dog;
          if (cat != null && cat.active) return cat;
          return this.node;
        }

        _resolveBurstCenterY(parent) {
          const petUIT = parent.getComponent(UITransform);
          if (!petUIT) return 300;
          const h = Math.max(petUIT.contentSize.height, 200);
          const ap = petUIT.anchorPoint.y;
          const visibleHeadY = h * (0.9 - ap);
          return visibleHeadY + this.burstCenterY;
        }

        _fireBurst() {
          for (let i = 0; i < this.heartsPerBurst; i++) {
            const delay = i * this.staggerInBurst;

            if (delay <= 0) {
              this._spawnOneHeart();
            } else {
              this.scheduleOnce(() => this._spawnOneHeart(), delay);
            }
          }
        }

        _spawnOneHeart() {
          if (!this._spriteFrame) return;

          const parent = this._getBurstParent();

          const bubble = new Node('HeartBubble');
          const uit = bubble.addComponent(UITransform);
          const sp = bubble.addComponent(Sprite);
          sp.spriteFrame = this._spriteFrame;
          sp.sizeMode = Sprite.SizeMode.TRIMMED;
          const rect = this._spriteFrame.rect;
          uit.setContentSize(Math.max(32, rect.width), Math.max(32, rect.height));
          const opacity = bubble.addComponent(UIOpacity);
          opacity.opacity = 0;
          parent.addChild(bubble);
          const startX = this.burstOffsetX;
          const startY = this._resolveBurstCenterY(parent) + this.burstOffsetY;
          const rise = this.riseMin + Math.random() * Math.max(0, this.riseMax - this.riseMin);
          const endX = startX + (Math.random() * 2 - 1) * this.spreadX;
          const endY = startY + rise;
          const s = this.heartScale * (0.92 + Math.random() * 0.16);
          const duration = this.flyDuration * (0.9 + Math.random() * 0.2);
          const peak = Math.min(255, Math.max(0, this.peakOpacity | 0));
          const fadeInTime = duration * 0.32;
          const fadeOutTime = duration - fadeInTime;
          bubble.setPosition(startX, startY, 0);
          bubble.setScale(s, s, 1);
          tween(bubble).to(duration, {
            position: new Vec3(endX, endY, 0)
          }, {
            easing: 'sineOut'
          }).call(() => {
            if (bubble.isValid) bubble.destroy();
          }).start();
          tween(opacity).to(fadeInTime, {
            opacity: peak
          }, {
            easing: 'sineOut'
          }).to(fadeOutTime, {
            opacity: 0
          }, {
            easing: 'sineIn'
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "heartSpriteFrame", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "burstCenterY", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 28;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "burstOffsetX", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -100;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "burstOffsetY", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -100;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "burstInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.55;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "heartsPerBurst", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "riseMin", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 90;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "riseMax", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 150;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "spreadX", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 48;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "flyDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.85;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "heartScale", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.3;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "staggerInBurst", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.06;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "peakOpacity", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 230;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=35aaabbae84308875551d24ffdf861a2c98ff2b8.js.map
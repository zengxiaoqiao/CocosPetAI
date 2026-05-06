System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Sprite, SpriteFrame, UITransform, UIOpacity, tween, Vec3, director, find, PetValue, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _crd, ccclass, property, HeartBubbleAni;

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
      director = _cc.director;
      find = _cc.find;
    }, function (_unresolved_2) {
      PetValue = _unresolved_2.PetValue;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1826eQT0lNLkoFxqDXLsNbJ", "HeartBubbleAni", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Sprite', 'SpriteFrame', 'UITransform', 'UIOpacity', 'tween', 'Vec3', 'director', 'find']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 挂在宠物节点（dog / cat）上：心形像烟花一样从一点爆发、向上方发散。
       * 每隔一段时间一「发」烟花，每发多颗心向斜上方扇形飞出。
       * 心形图需在 Inspector 里指定（可拖 highintimate 下 Sprite 的 spriteFrame）。
       */

      _export("HeartBubbleAni", HeartBubbleAni = (_dec = ccclass('HeartBubbleAni'), _dec2 = property({
        type: SpriteFrame,
        tooltip: '心形图（可从 highintimate 的 Sprite 拖入其 spriteFrame）'
      }), _dec(_class = (_class2 = class HeartBubbleAni extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "heartSpriteFrame", _descriptor, this);

          /** 烟花中心在宠物本地的 Y（爆发点高度） */
          _initializerDefineProperty(this, "burstCenterY", _descriptor2, this);

          /** 每发烟花的间隔（秒），越大烟花越疏 */
          _initializerDefineProperty(this, "burstInterval", _descriptor3, this);

          /** 每发烟花炸出多少颗心 */
          _initializerDefineProperty(this, "heartsPerBurst", _descriptor4, this);

          /** 心飞出去的距离范围（像素），随机在此范围，形成炸开感 */
          _initializerDefineProperty(this, "minDistance", _descriptor5, this);

          _initializerDefineProperty(this, "maxDistance", _descriptor6, this);

          /** 向上发散的扇形角度（度），例如 80 表示以正上方为中心、左右各 40° */
          _initializerDefineProperty(this, "fanAngleDeg", _descriptor7, this);

          /** 心从飞出到消失的时长（秒），越大飞得越慢 */
          _initializerDefineProperty(this, "flyDuration", _descriptor8, this);

          /** 刚飞出时很小（像火星）；若心形图缩小过，可适当调大以保持视觉大小 */
          _initializerDefineProperty(this, "startScale", _descriptor9, this);

          /** 飞出去后变大的上限；若心形图缩小过，可适当调大以保持视觉大小 */
          _initializerDefineProperty(this, "endScale", _descriptor10, this);

          /** 同一发内每颗心错开的时间（秒），略错开更像炸开 */
          _initializerDefineProperty(this, "staggerInBurst", _descriptor11, this);

          this._spriteFrame = null;
          this._timer = 0;
        }

        start() {
          var sp = this.node.getComponent(Sprite);

          if (this.heartSpriteFrame) {
            this._spriteFrame = this.heartSpriteFrame;
          } else if (sp && sp.spriteFrame) {
            this._spriteFrame = sp.spriteFrame;
          }

          if (!this._spriteFrame) return;
          this._timer = 0;
        }

        update(dt) {
          if (!this._spriteFrame) return; // 优先低值：体力或心情任一低于 20 时不冒爱心，仅心情 > 80 且两者都不低时才播放

          var pv = this._getPetValue();

          if (pv && (!pv.isIntimacyHigh() || pv.isHpLow() || pv.isIntimacyLow())) return;
          this._timer += dt;

          if (this._timer >= this.burstInterval) {
            this._timer = 0;

            this._fireBurst();
          }
        }

        _getPetValue() {
          var _director$getScene;

          var n = find('Canvas/pet_value');
          if (n) return n.getComponent(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue) || null;
          return ((_director$getScene = director.getScene()) == null ? void 0 : _director$getScene.getComponentInChildren(_crd && PetValue === void 0 ? (_reportPossibleCrUseOfPetValue({
            error: Error()
          }), PetValue) : PetValue)) || null;
        }

        _fireBurst() {
          for (var i = 0; i < this.heartsPerBurst; i++) {
            var delay = i * this.staggerInBurst;

            if (delay <= 0) {
              this._spawnOneHeart();
            } else {
              this.scheduleOnce(() => this._spawnOneHeart(), delay);
            }
          }
        }

        _spawnOneHeart() {
          var bubble = new Node('HeartBubble');
          bubble.addComponent(UITransform);
          var sp = bubble.addComponent(Sprite);
          sp.spriteFrame = this._spriteFrame;
          var opacity = bubble.addComponent(UIOpacity);
          opacity.opacity = 255;
          this.node.addChild(bubble);
          bubble.setPosition(0, this.burstCenterY, 0);
          bubble.setScale(this.startScale, this.startScale, 1);
          var halfFanRad = this.fanAngleDeg / 2 * (Math.PI / 180);
          var angle = (Math.random() * 2 - 1) * halfFanRad;
          var dist = this.minDistance + Math.random() * (this.maxDistance - this.minDistance);
          var endX = Math.sin(angle) * dist;
          var endY = this.burstCenterY + Math.cos(angle) * dist;
          var duration = this.flyDuration * (0.88 + Math.random() * 0.24);
          var endS = this.endScale * (0.9 + Math.random() * 0.2);
          tween(bubble).to(duration, {
            position: new Vec3(endX, endY, 0),
            scale: new Vec3(endS, endS, 1)
          }, {
            easing: 'quadOut'
          }).start();
          tween(opacity).delay(duration * 0.35).to(duration * 0.65, {
            opacity: 0
          }, {
            easing: 'quadOut'
          }).call(() => {
            if (bubble.isValid) bubble.destroy();
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "heartSpriteFrame", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "burstCenterY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 50;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "burstInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.7;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "heartsPerBurst", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "minDistance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 65;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxDistance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 145;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "fanAngleDeg", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 80;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "flyDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.45;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "startScale", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "endScale", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.76;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "staggerInBurst", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.018;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f9e5082693bf2e20cdce151cd4ff2e09daf7ef77.js.map
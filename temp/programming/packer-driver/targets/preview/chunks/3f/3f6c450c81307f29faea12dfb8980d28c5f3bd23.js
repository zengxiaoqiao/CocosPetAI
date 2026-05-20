System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Graphics, UITransform, Color, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, MicWaveform;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Graphics = _cc.Graphics;
      UITransform = _cc.UITransform;
      Color = _cc.Color;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "149e4Fq0CZJe5w8OW8oDgwd", "MicWaveform", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Graphics', 'UITransform', 'Color', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 麦克风录音态：用 Graphics 动态绘制竖条波形（不依赖贴图）。
       */

      _export("MicWaveform", MicWaveform = (_dec = ccclass('MicWaveform'), _dec2 = property({
        tooltip: '竖条数量'
      }), _dec3 = property({
        tooltip: '单条宽度（px）'
      }), _dec4 = property({
        tooltip: '条间距（px）'
      }), _dec5 = property({
        tooltip: '最大条高（px）'
      }), _dec6 = property({
        tooltip: '最小条高（px）'
      }), _dec7 = property({
        tooltip: '竖条填充色'
      }), _dec(_class = (_class2 = class MicWaveform extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "barCount", _descriptor, this);

          _initializerDefineProperty(this, "barWidth", _descriptor2, this);

          _initializerDefineProperty(this, "barGap", _descriptor3, this);

          _initializerDefineProperty(this, "maxBarHeight", _descriptor4, this);

          _initializerDefineProperty(this, "minBarHeight", _descriptor5, this);

          _initializerDefineProperty(this, "barColor", _descriptor6, this);

          this._graphics = null;
          this._running = false;
          this._subdued = false;
          this._phase = 0;
          this._heights = [];
          this._targets = [];
          this._recordImgNode = null;
        }

        onLoad() {
          this._graphics = this.getComponent(Graphics) || this.addComponent(Graphics);
          var uit = this.getComponent(UITransform) || this.addComponent(UITransform);
          var totalW = this.barCount * this.barWidth + Math.max(0, this.barCount - 1) * this.barGap;
          uit.setContentSize(totalW, this.maxBarHeight);
          this._heights = new Array(this.barCount).fill(this.minBarHeight);
          this._targets = this._heights.slice();

          this._hideLegacySprite();
        }
        /** 开始/停止波形动画；subdued=true 时幅度较小（按住未正式录音） */


        setAnimating(on, subdued) {
          if (subdued === void 0) {
            subdued = false;
          }

          this._running = on;
          this._subdued = subdued;
          this.node.active = on;

          if (on) {
            this._hideLegacySprite();

            this._phase = 0;
          } else {
            var _this$_graphics;

            (_this$_graphics = this._graphics) == null || _this$_graphics.clear();
          }
        }

        get isAnimating() {
          return this._running;
        }

        update(dt) {
          if (!this._running || !this._graphics) return;
          var speed = this._subdued ? 5.5 : 9;
          var amp = this._subdued ? 0.45 : 1;
          this._phase += dt * speed;
          var range = (this.maxBarHeight - this.minBarHeight) * amp;

          for (var i = 0; i < this.barCount; i++) {
            var wobble = 0.32 + 0.38 * Math.abs(Math.sin(this._phase * 2.1 + i * 0.78)) + 0.3 * Math.abs(Math.sin(this._phase * 3.7 + i * 1.35 + 0.4));
            this._targets[i] = this.minBarHeight + range * Math.min(1, wobble);
            var smooth = this._subdued ? 10 : 14;
            this._heights[i] += (this._targets[i] - this._heights[i]) * Math.min(1, dt * smooth);
          }

          this._draw();
        }

        _draw() {
          var g = this._graphics;
          g.clear();
          g.fillColor = this.barColor;
          var totalW = this.barCount * this.barWidth + Math.max(0, this.barCount - 1) * this.barGap;
          var startX = -totalW * 0.5;
          var radius = Math.max(2, this.barWidth * 0.45);

          for (var i = 0; i < this.barCount; i++) {
            var h = this._heights[i];
            var x = startX + i * (this.barWidth + this.barGap);
            var y = -h * 0.5;
            g.roundRect(x, y, this.barWidth, h, radius);
            g.fill();
          }
        }

        _hideLegacySprite() {
          if (!this._recordImgNode && this.node.parent) {
            this._recordImgNode = this.node.parent.getChildByName('record-img');
          }

          if (this._recordImgNode) {
            this._recordImgNode.active = false;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "barCount", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 9;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "barWidth", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 7;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "barGap", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "maxBarHeight", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 40;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "minBarHeight", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "barColor", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 255, 255, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3f6c450c81307f29faea12dfb8980d28c5f3bd23.js.map
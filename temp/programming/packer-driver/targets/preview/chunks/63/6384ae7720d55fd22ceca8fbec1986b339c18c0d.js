System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, Node, Label, Color, UITransform, Button, Widget, view, BlockInputEvents, Director, Graphics, Sprite, assetManager, Camera, sys, getShopCatPriceLabel, getShopCustomizePlaceholder, getShopCustomizePriceLabel, getShopFreeLabel, getShopOwnedLabel, consumeShopIntent, isCatUnlocked, isCustomizeUnlocked, startShopPropAd, requestSubscription, _dec, _class, _crd, ccclass, UI_ATLAS, SF, C, ShopScene;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _ensureShopSceneOnCanvas() {
    var scene = director.getScene();
    if (!scene || scene.name !== 'shop') return;
    var canvas = scene.getChildByName('Canvas');

    if (canvas && !canvas.getComponent(ShopScene)) {
      canvas.addComponent(ShopScene);
    }
  }

  function _reportPossibleCrUseOfgetShopCatPriceLabel(extras) {
    _reporterNs.report("getShopCatPriceLabel", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetShopCustomizePlaceholder(extras) {
    _reporterNs.report("getShopCustomizePlaceholder", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetShopCustomizePriceLabel(extras) {
    _reporterNs.report("getShopCustomizePriceLabel", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetShopFreeLabel(extras) {
    _reporterNs.report("getShopFreeLabel", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetShopOwnedLabel(extras) {
    _reporterNs.report("getShopOwnedLabel", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfconsumeShopIntent(extras) {
    _reporterNs.report("consumeShopIntent", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisCatUnlocked(extras) {
    _reporterNs.report("isCatUnlocked", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisCustomizeUnlocked(extras) {
    _reporterNs.report("isCustomizeUnlocked", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfstartShopPropAd(extras) {
    _reporterNs.report("startShopPropAd", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfrequestSubscription(extras) {
    _reporterNs.report("requestSubscription", "./ShopPurchase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfShopProductId(extras) {
    _reporterNs.report("ShopProductId", "./ShopPurchase", _context.meta, extras);
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
      director = _cc.director;
      Node = _cc.Node;
      Label = _cc.Label;
      Color = _cc.Color;
      UITransform = _cc.UITransform;
      Button = _cc.Button;
      Widget = _cc.Widget;
      view = _cc.view;
      BlockInputEvents = _cc.BlockInputEvents;
      Director = _cc.Director;
      Graphics = _cc.Graphics;
      Sprite = _cc.Sprite;
      assetManager = _cc.assetManager;
      Camera = _cc.Camera;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      getShopCatPriceLabel = _unresolved_2.getShopCatPriceLabel;
      getShopCustomizePlaceholder = _unresolved_2.getShopCustomizePlaceholder;
      getShopCustomizePriceLabel = _unresolved_2.getShopCustomizePriceLabel;
      getShopFreeLabel = _unresolved_2.getShopFreeLabel;
      getShopOwnedLabel = _unresolved_2.getShopOwnedLabel;
    }, function (_unresolved_3) {
      consumeShopIntent = _unresolved_3.consumeShopIntent;
      isCatUnlocked = _unresolved_3.isCatUnlocked;
      isCustomizeUnlocked = _unresolved_3.isCustomizeUnlocked;
      startShopPropAd = _unresolved_3.startShopPropAd;
    }, function (_unresolved_4) {
      requestSubscription = _unresolved_4.requestSubscription;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d4e5fani5xNDp8aKzxNXm9w", "ShopScene", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'Node', 'Label', 'Color', 'UITransform', 'Button', 'Widget', 'view', 'BlockInputEvents', 'Director', 'Graphics', 'Sprite', 'SpriteFrame', 'assetManager', 'Camera', 'sys']);

      ({
        ccclass
      } = _decorator);
      UI_ATLAS = '3ae7a7fa-b2b9-415c-91eb-ceb82a98e659';
      SF = {
        cat: UI_ATLAS + "@d4538",
        back: UI_ATLAS + "@40c10",
        icon1: UI_ATLAS + "@59712",
        icon2: UI_ATLAS + "@5982c",
        icon3: UI_ATLAS + "@bb9e3"
      };
      /** 商店黑底（与稿一致）；主界面是浅色房间，商店用深色更有「商城」感 */

      C = {
        bg: new Color(8, 8, 10, 255),
        cardFill: new Color(22, 22, 26, 255),
        cardStroke: new Color(72, 72, 80, 255),
        text: new Color(245, 245, 248, 255),
        textDim: new Color(160, 160, 168, 255),
        btn: new Color(72, 130, 255, 255),
        btnOwned: new Color(90, 90, 98, 255)
      };
      /**
       * 商店：上宠物（横条大卡）、下道具（小格网格）。样式对齐产品稿，先上架猫。
       */

      _export("ShopScene", ShopScene = (_dec = ccclass('ShopScene'), _dec(_class = class ShopScene extends Component {
        constructor() {
          super(...arguments);
          this._root = null;
          this._backBtn = null;
          this._catPriceLabel = null;
          this._catBuyBtn = null;
          this._busy = false;
        }

        onLoad() {
          this._paintCameraBg();

          this._buildUi();

          this._refreshProducts();
        }

        onEnable() {
          this._refreshProducts();

          this.scheduleOnce(() => this._realignBackButton(), 0);
        }

        _paintCameraBg() {
          var _this$node$getChildBy;

          var cam = (_this$node$getChildBy = this.node.getChildByName('Camera')) == null ? void 0 : _this$node$getChildBy.getComponent(Camera);
          if (cam) cam.clearColor = new Color(C.bg.r, C.bg.g, C.bg.b, 255);
        }

        _buildUi() {
          var canvas = this.node;
          var root = canvas.getChildByName('shop_root');

          if (!root) {
            root = new Node('shop_root');
            canvas.addChild(root);
          }

          this._root = root;
          root.removeAllChildren();
          var vs = view.getVisibleSize();
          var W = vs.width;
          var H = vs.height;
          var margin = 28;
          var cardW = W - margin * 2;
          var rootUIT = root.getComponent(UITransform) || root.addComponent(UITransform);
          rootUIT.setContentSize(W, H);
          var widget = root.getComponent(Widget) || root.addComponent(Widget);
          widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
          widget.top = widget.bottom = widget.left = widget.right = 0;
          root.addComponent(BlockInputEvents);

          this._addSolidBg(root, W, H);

          var topInset = this._getTopInset();

          this._mountBackButton(canvas, topInset, margin);

          var petsTop = H * 0.5 - topInset - 104;
          var petCardH = 168;
          var petGap = 16;
          this._catPriceLabel = null;
          this._catBuyBtn = null;

          var catCard = this._createPetCard(root, cardW, petCardH, petsTop, SF.cat, 1.85, (_crd && getShopCatPriceLabel === void 0 ? (_reportPossibleCrUseOfgetShopCatPriceLabel({
            error: Error()
          }), getShopCatPriceLabel) : getShopCatPriceLabel)(), () => this._onCatAction());

          this._catPriceLabel = catCard.priceLabel;
          this._catBuyBtn = catCard.buyBtn;
          var customY = petsTop - petCardH - petGap;

          this._createCustomPetCard(root, cardW, petCardH, customY, () => this._onCustomizeAction());

          var propsTopY = customY - petCardH - 36;

          this._buildPropsGrid(root, W, margin, propsTopY);
        }
        /**
         * 顶部留白：可见区域原点 + 安全区 + 编辑器预览条。
         * 仅 safeArea 在编辑器里常为 0，会导致返回键贴顶被裁切。
         */


        _getTopInset() {
          var origin = view.getVisibleOrigin();
          var inset = Math.max(80, origin.y + 32);

          try {
            var safe = sys.getSafeAreaRect();
            var frame = view.getFrameSize();
            var visible = view.getVisibleSize();

            if (frame.height > 0 && visible.height > 0) {
              var safeTop = (frame.height - safe.y - safe.height) * (visible.height / frame.height);
              inset = Math.max(inset, origin.y + safeTop + 36);
            }
          } catch (_unused) {
            /* ignore */
          }

          if (sys.isBrowser) inset += 40;
          return inset;
        }
        /**
         * 返回键挂在 Canvas（与 settings 场景 back 同思路：绝对坐标，不用 Widget）。
         */


        _mountBackButton(canvas, topInset, leftMargin) {
          var old = canvas.getChildByName('shop_back_btn');
          if (old != null && old.isValid) old.destroy();
          var vs = view.getVisibleSize();
          var size = 56;
          var topFromEdge = Math.max(100, topInset + size * 0.5);

          var back = this._createIconButton(canvas, SF.back, size, () => this.onBackClick());

          back.name = 'shop_back_btn';
          this._backBtn = back;
          var x = -vs.width * 0.5 + leftMargin + size * 0.5;
          var y = vs.height * 0.5 - topFromEdge;
          back.setPosition(x, y, 0);
          back.setSiblingIndex(canvas.children.length - 1);
          var chevron = new Node('chevron');
          back.addChild(chevron);
          var cu = chevron.addComponent(UITransform);
          cu.setContentSize(size, size);
          var cl = chevron.addComponent(Label);
          cl.string = '‹';
          cl.fontSize = 48;
          cl.lineHeight = 56;
          cl.color = C.text;
          cl.horizontalAlign = Label.HorizontalAlign.CENTER;
          cl.verticalAlign = Label.VerticalAlign.CENTER;
        }

        _realignBackButton() {
          var _this$_backBtn;

          if (!((_this$_backBtn = this._backBtn) != null && _this$_backBtn.isValid)) return;
          var canvas = this.node;
          var vs = view.getVisibleSize();
          var size = 56;
          var topFromEdge = Math.max(100, this._getTopInset() + size * 0.5);
          var leftMargin = 28;
          var x = -vs.width * 0.5 + leftMargin + size * 0.5;
          var y = vs.height * 0.5 - topFromEdge;

          this._backBtn.setPosition(x, y, 0);
        }

        _addSolidBg(parent, w, h) {
          var bg = new Node('bg');
          parent.addChild(bg);
          var uit = bg.addComponent(UITransform);
          uit.setContentSize(w, h);
          var g = bg.addComponent(Graphics);
          g.fillColor = C.bg;
          g.rect(-w * 0.5, -h * 0.5, w, h);
          g.fill();
        }

        _createIconButton(parent, sfUuid, size, onClick) {
          var n = new Node('icon_btn');
          parent.addChild(n);
          var uit = n.addComponent(UITransform);
          uit.setContentSize(size, size);
          var sp = n.addComponent(Sprite);
          sp.sizeMode = Sprite.SizeMode.CUSTOM;
          uit.setContentSize(size, size);

          this._loadSpriteFrame(sfUuid, frame => {
            if (sp.isValid && frame) sp.spriteFrame = frame;
          });

          var btn = n.addComponent(Button);
          btn.transition = Button.Transition.SCALE;
          btn.zoomScale = 1.06;
          n.on(Button.EventType.CLICK, onClick, this);
          return n;
        }

        _createPetCard(parent, cardW, cardH, centerY, iconUuid, iconScale, priceText, onBuy) {
          var card = new Node('pet_card');
          parent.addChild(card);
          card.setPosition(0, centerY, 0);
          var cardUIT = card.addComponent(UITransform);
          cardUIT.setContentSize(cardW, cardH);

          this._drawRoundedCard(card, cardW, cardH, 16);

          var icon = new Node('icon');
          card.addChild(icon);
          icon.setPosition(-cardW * 0.28, 0, 0);
          var iconUIT = icon.addComponent(UITransform);
          iconUIT.setContentSize(120, 120);
          var sp = icon.addComponent(Sprite);
          sp.sizeMode = Sprite.SizeMode.TRIMMED;

          this._loadSpriteFrame(iconUuid, frame => {
            if (sp.isValid && frame) {
              sp.spriteFrame = frame;
              icon.setScale(iconScale, iconScale, 1);
            }
          });

          var buy = this._createPriceButton(card, priceText, cardW * 0.3, 0, onBuy);

          return {
            card,
            priceLabel: buy.label,
            buyBtn: buy.button
          };
        }

        _createCustomPetCard(parent, cardW, cardH, centerY, onBuy) {
          var card = new Node('pet_card_custom');
          parent.addChild(card);
          card.setPosition(0, centerY, 0);
          var cardUIT = card.addComponent(UITransform);
          cardUIT.setContentSize(cardW, cardH);

          this._drawRoundedCard(card, cardW, cardH, 16);

          var text = new Node('placeholder');
          card.addChild(text);
          text.setPosition(-cardW * 0.18, 0, 0);
          var textUIT = text.addComponent(UITransform);
          textUIT.setContentSize(cardW * 0.48, cardH - 24);
          var lb = text.addComponent(Label);
          lb.string = (_crd && getShopCustomizePlaceholder === void 0 ? (_reportPossibleCrUseOfgetShopCustomizePlaceholder({
            error: Error()
          }), getShopCustomizePlaceholder) : getShopCustomizePlaceholder)();
          lb.fontSize = 26;
          lb.lineHeight = 36;
          lb.color = C.textDim;
          lb.horizontalAlign = Label.HorizontalAlign.LEFT;
          lb.overflow = Label.Overflow.RESIZE_HEIGHT;
          lb.enableWrapText = true;

          this._createPriceButton(card, (_crd && getShopCustomizePriceLabel === void 0 ? (_reportPossibleCrUseOfgetShopCustomizePriceLabel({
            error: Error()
          }), getShopCustomizePriceLabel) : getShopCustomizePriceLabel)(), cardW * 0.3, 0, onBuy);
        }

        _buildPropsGrid(parent, screenW, margin, topCenterY) {
          var cols = 3;
          var gap = 14;
          var cellW = (screenW - margin * 2 - gap * (cols - 1)) / cols;
          var cellH = cellW + 52;
          var icons = [SF.icon1, SF.icon2, SF.icon3];
          var startX = -screenW * 0.5 + margin + cellW * 0.5;

          for (var i = 0; i < icons.length; i++) {
            var col = i % cols;
            var row = Math.floor(i / cols);
            var x = startX + col * (cellW + gap);
            var y = topCenterY - row * (cellH + gap);
            var btnIndex = i + 1;

            this._createPropCell(parent, icons[i], cellW, cellH, x, y, btnIndex);
          }
        }

        _createPropCell(parent, iconUuid, cellW, cellH, x, y, buttonIndex) {
          var cell = new Node('prop_cell');
          parent.addChild(cell);
          cell.setPosition(x, y, 0);
          var cellUIT = cell.addComponent(UITransform);
          cellUIT.setContentSize(cellW, cellH);

          this._drawRoundedCard(cell, cellW, cellH - 44, 12);

          var icon = new Node('icon');
          cell.addChild(icon);
          icon.setPosition(0, 18, 0);
          var iconUIT = icon.addComponent(UITransform);
          iconUIT.setContentSize(88, 88);
          var sp = icon.addComponent(Sprite);
          sp.sizeMode = Sprite.SizeMode.TRIMMED;

          this._loadSpriteFrame(iconUuid, frame => {
            if (sp.isValid && frame) sp.spriteFrame = frame;
          });

          this._createPriceButton(cell, (_crd && getShopFreeLabel === void 0 ? (_reportPossibleCrUseOfgetShopFreeLabel({
            error: Error()
          }), getShopFreeLabel) : getShopFreeLabel)(), 0, -cellH * 0.5 + 36, () => {
            if (this._busy) return;
            (_crd && startShopPropAd === void 0 ? (_reportPossibleCrUseOfstartShopPropAd({
              error: Error()
            }), startShopPropAd) : startShopPropAd)(buttonIndex);
          }, 120, 40);
        }

        _drawRoundedCard(node, w, h, radius) {
          var g = node.addComponent(Graphics);
          var hw = w * 0.5;
          var hh = h * 0.5;
          var r = Math.min(radius, hw, hh);
          g.fillColor = C.cardFill;
          g.strokeColor = C.cardStroke;
          g.lineWidth = 2;
          g.roundRect(-hw, -hh, w, h, r);
          g.fill();
          g.stroke();
        }

        _createPriceButton(parent, text, x, y, onClick, bw, bh) {
          if (bw === void 0) {
            bw = 148;
          }

          if (bh === void 0) {
            bh = 52;
          }

          var btn = new Node('price_btn');
          parent.addChild(btn);
          btn.setPosition(x, y, 0);
          var btnUIT = btn.addComponent(UITransform);
          btnUIT.setContentSize(bw, bh);
          var g = btn.addComponent(Graphics);
          g.fillColor = C.btn;
          g.roundRect(-bw * 0.5, -bh * 0.5, bw, bh, bh * 0.5);
          g.fill();
          var btnComp = btn.addComponent(Button);
          btnComp.transition = Button.Transition.SCALE;
          btnComp.zoomScale = 1.05;
          var lbNode = new Node('Label');
          btn.addChild(lbNode);
          var lbUIT = lbNode.addComponent(UITransform);
          lbUIT.setContentSize(bw, bh);
          var lb = lbNode.addComponent(Label);
          lb.string = text;
          lb.fontSize = 26;
          lb.lineHeight = 34;
          lb.color = C.text;
          lb.horizontalAlign = Label.HorizontalAlign.CENTER;
          btn.on(Button.EventType.CLICK, onClick, this);
          return {
            button: btnComp,
            label: lb
          };
        }

        _loadSpriteFrame(uuid, cb) {
          assetManager.loadAny({
            uuid
          }, (err, asset) => {
            var frame = asset;

            if (err || !(frame != null && frame.texture)) {
              cb(null);
              return;
            }

            cb(frame);
          });
        }

        _refreshProducts() {
          var _this$_catBuyBtn;

          var catOk = (_crd && isCatUnlocked === void 0 ? (_reportPossibleCrUseOfisCatUnlocked({
            error: Error()
          }), isCatUnlocked) : isCatUnlocked)();

          if (this._catPriceLabel) {
            this._catPriceLabel.string = catOk ? (_crd && getShopOwnedLabel === void 0 ? (_reportPossibleCrUseOfgetShopOwnedLabel({
              error: Error()
            }), getShopOwnedLabel) : getShopOwnedLabel)() : (_crd && getShopCatPriceLabel === void 0 ? (_reportPossibleCrUseOfgetShopCatPriceLabel({
              error: Error()
            }), getShopCatPriceLabel) : getShopCatPriceLabel)();
          }

          if (this._catBuyBtn) {
            this._catBuyBtn.interactable = !catOk;

            var g = this._catBuyBtn.node.getComponent(Graphics);

            if (g) g.fillColor = catOk ? C.btnOwned : C.btn;
          }

          var intent = (_crd && consumeShopIntent === void 0 ? (_reportPossibleCrUseOfconsumeShopIntent({
            error: Error()
          }), consumeShopIntent) : consumeShopIntent)();

          if (intent === 'cat' && !catOk && (_this$_catBuyBtn = this._catBuyBtn) != null && _this$_catBuyBtn.node) {
            this._pulse(this._catBuyBtn.node);
          }
        }

        _pulse(n) {
          n.setScale(1.06, 1.06, 1);
          this.scheduleOnce(() => {
            if (n != null && n.isValid) n.setScale(1, 1, 1);
          }, 0.3);
        }

        _purchase(product) {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (_this._busy) return;
            _this._busy = true;
            var ok = yield (_crd && requestSubscription === void 0 ? (_reportPossibleCrUseOfrequestSubscription({
              error: Error()
            }), requestSubscription) : requestSubscription)(product);
            _this._busy = false;
            if (!ok) return;

            _this._refreshProducts();

            if (product === 'cat') {
              director.loadScene('home', err => {
                if (err) console.error('[ShopScene] 无法返回 home', err);
              });
            }
          })();
        }

        _onCatAction() {
          if ((_crd && isCatUnlocked === void 0 ? (_reportPossibleCrUseOfisCatUnlocked({
            error: Error()
          }), isCatUnlocked) : isCatUnlocked)()) return;

          this._purchase('cat');
        }

        _onCustomizeAction() {
          if ((_crd && isCustomizeUnlocked === void 0 ? (_reportPossibleCrUseOfisCustomizeUnlocked({
            error: Error()
          }), isCustomizeUnlocked) : isCustomizeUnlocked)()) {
            director.loadScene('customize', err => {
              if (err) console.error('[ShopScene] 无法加载 customize', err);
            });
            return;
          }

          this._purchase('customize').then(ok => {
            if (ok) {
              director.loadScene('customize', err => {
                if (err) console.error('[ShopScene] 无法加载 customize', err);
              });
            }
          });
        }

        onBackClick() {
          director.loadScene('home', err => {
            if (err) console.error('[ShopScene] 无法返回 home', err);
          });
        }

      }) || _class));

      director.on(Director.EVENT_AFTER_SCENE_LAUNCH, _ensureShopSceneOnCanvas);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6384ae7720d55fd22ceca8fbec1986b339c18c0d.js.map
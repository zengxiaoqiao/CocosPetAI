System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, Node, Label, Color, UITransform, Button, Widget, view, BlockInputEvents, getCustomizeComingSoonSubtitle, getCustomizeComingSoonTitle, isZh, isCustomizeUnlocked, markCustomPetReady, openShop, _dec, _class, _crd, ccclass, CustomizeScene;

  function _reportPossibleCrUseOfgetCustomizeComingSoonSubtitle(extras) {
    _reporterNs.report("getCustomizeComingSoonSubtitle", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetCustomizeComingSoonTitle(extras) {
    _reporterNs.report("getCustomizeComingSoonTitle", "./TipCopy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisZh(extras) {
    _reporterNs.report("isZh", "./Lang", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisCustomizeUnlocked(extras) {
    _reporterNs.report("isCustomizeUnlocked", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfmarkCustomPetReady(extras) {
    _reporterNs.report("markCustomPetReady", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfopenShop(extras) {
    _reporterNs.report("openShop", "./PetUnlock", _context.meta, extras);
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
    }, function (_unresolved_2) {
      getCustomizeComingSoonSubtitle = _unresolved_2.getCustomizeComingSoonSubtitle;
      getCustomizeComingSoonTitle = _unresolved_2.getCustomizeComingSoonTitle;
    }, function (_unresolved_3) {
      isZh = _unresolved_3.isZh;
    }, function (_unresolved_4) {
      isCustomizeUnlocked = _unresolved_4.isCustomizeUnlocked;
      markCustomPetReady = _unresolved_4.markCustomPetReady;
      openShop = _unresolved_4.openShop;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "68db37W90lJuJ7fIme7iFXC", "CustomizeScene", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'Node', 'Label', 'Color', 'UITransform', 'Button', 'Widget', 'view', 'BlockInputEvents']);

      ({
        ccclass
      } = _decorator);
      /**
       * 定制页（customize 场景）：暂为占位「即将开放」。挂在 Canvas 上。
       */

      _export("CustomizeScene", CustomizeScene = (_dec = ccclass('CustomizeScene'), _dec(_class = class CustomizeScene extends Component {
        onLoad() {
          if (!(_crd && isCustomizeUnlocked === void 0 ? (_reportPossibleCrUseOfisCustomizeUnlocked({
            error: Error()
          }), isCustomizeUnlocked) : isCustomizeUnlocked)()) {
            (_crd && openShop === void 0 ? (_reportPossibleCrUseOfopenShop({
              error: Error()
            }), openShop) : openShop)('customize');
            return;
          }

          (_crd && markCustomPetReady === void 0 ? (_reportPossibleCrUseOfmarkCustomPetReady({
            error: Error()
          }), markCustomPetReady) : markCustomPetReady)();

          this._buildUi();
        }

        _buildUi() {
          const canvas = this.node;
          let root = canvas.getChildByName('customize_root');

          if (!root) {
            root = new Node('customize_root');
            canvas.addChild(root);
          }

          root.removeAllChildren();
          const visible = view.getVisibleSize();
          const rootUIT = root.getComponent(UITransform) || root.addComponent(UITransform);
          rootUIT.setContentSize(visible.width, visible.height);
          const widget = root.getComponent(Widget) || root.addComponent(Widget);
          widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
          widget.top = widget.bottom = widget.left = widget.right = 0;
          root.addComponent(BlockInputEvents);
          const bg = new Node('bg');
          root.addChild(bg);
          const bgUIT = bg.addComponent(UITransform);
          bgUIT.setContentSize(visible.width, visible.height);
          const bgW = bg.addComponent(Widget);
          bgW.isAlignTop = bgW.isAlignBottom = bgW.isAlignLeft = bgW.isAlignRight = true;
          bgW.top = bgW.bottom = bgW.left = bgW.right = 0;
          const title = new Node('title');
          root.addChild(title);
          const titleUIT = title.addComponent(UITransform);
          titleUIT.setContentSize(visible.width - 80, 120);
          title.setPosition(0, 80, 0);
          const titleLabel = title.addComponent(Label);
          titleLabel.string = (_crd && getCustomizeComingSoonTitle === void 0 ? (_reportPossibleCrUseOfgetCustomizeComingSoonTitle({
            error: Error()
          }), getCustomizeComingSoonTitle) : getCustomizeComingSoonTitle)();
          titleLabel.fontSize = 40;
          titleLabel.lineHeight = 52;
          titleLabel.color = new Color(45, 42, 38, 255);
          titleLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
          titleLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
          titleLabel.enableWrapText = true;
          const sub = new Node('subtitle');
          root.addChild(sub);
          const subUIT = sub.addComponent(UITransform);
          subUIT.setContentSize(visible.width - 100, 80);
          sub.setPosition(0, 10, 0);
          const subLabel = sub.addComponent(Label);
          subLabel.string = (_crd && getCustomizeComingSoonSubtitle === void 0 ? (_reportPossibleCrUseOfgetCustomizeComingSoonSubtitle({
            error: Error()
          }), getCustomizeComingSoonSubtitle) : getCustomizeComingSoonSubtitle)();
          subLabel.fontSize = 28;
          subLabel.lineHeight = 38;
          subLabel.color = new Color(110, 105, 98, 255);
          subLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
          subLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
          subLabel.enableWrapText = true;
          const back = new Node('btn_back');
          root.addChild(back);
          const backUIT = back.addComponent(UITransform);
          backUIT.setContentSize(200, 72);
          back.setPosition(0, -visible.height * 0.32, 0);
          const backBtn = back.addComponent(Button);
          backBtn.transition = Button.Transition.SCALE;
          backBtn.zoomScale = 1.05;
          const backLabelNode = new Node('Label');
          back.addChild(backLabelNode);
          const backLabelUIT = backLabelNode.addComponent(UITransform);
          backLabelUIT.setContentSize(200, 72);
          const backLabel = backLabelNode.addComponent(Label);
          backLabel.string = (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
            error: Error()
          }), isZh) : isZh)() ? '返回' : 'Back';
          backLabel.fontSize = 32;
          backLabel.lineHeight = 40;
          backLabel.color = new Color(80, 120, 200, 255);
          backLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
          back.on(Button.EventType.CLICK, this.onBackClick, this);
        }

        onBackClick() {
          director.loadScene('home', err => {
            if (err) console.error('[CustomizeScene] 无法返回 home', err);
          });
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=53ee14933195dc7a8005ffc13a3748a816fd255d.js.map
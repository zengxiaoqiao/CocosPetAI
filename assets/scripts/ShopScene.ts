import {
    _decorator, Component, director, Node, Label, Color, UITransform, Button,
    Widget, view, BlockInputEvents, Director, Graphics, Sprite, SpriteFrame,
    assetManager, Camera, sys,
} from 'cc';
import {
    getShopCatPriceLabel, getShopCustomizePlaceholder,
    getShopCustomizePriceLabel, getShopFreeLabel, getShopOwnedLabel,
} from './TipCopy';
import {
    consumeShopIntent, isCatUnlocked, isCustomizeUnlocked, startShopPropAd,
} from './PetUnlock';
import { requestSubscription, type ShopProductId } from './ShopPurchase';

const { ccclass } = _decorator;

const UI_ATLAS = '3ae7a7fa-b2b9-415c-91eb-ceb82a98e659';
const SF = {
    cat: `${UI_ATLAS}@d4538`,
    back: `${UI_ATLAS}@40c10`,
    icon1: `${UI_ATLAS}@59712`,
    icon2: `${UI_ATLAS}@5982c`,
    icon3: `${UI_ATLAS}@bb9e3`,
} as const;

/** 商店黑底（与稿一致）；主界面是浅色房间，商店用深色更有「商城」感 */
const C = {
    bg: new Color(8, 8, 10, 255),
    cardFill: new Color(22, 22, 26, 255),
    cardStroke: new Color(72, 72, 80, 255),
    text: new Color(245, 245, 248, 255),
    textDim: new Color(160, 160, 168, 255),
    btn: new Color(72, 130, 255, 255),
    btnOwned: new Color(90, 90, 98, 255),
};

/**
 * 商店：上宠物（横条大卡）、下道具（小格网格）。样式对齐产品稿，先上架猫。
 */
@ccclass('ShopScene')
export class ShopScene extends Component {

    private _root: Node | null = null;
    private _backBtn: Node | null = null;
    private _catPriceLabel: Label | null = null;
    private _catBuyBtn: Button | null = null;
    private _busy = false;

    onLoad() {
        this._paintCameraBg();
        this._buildUi();
        this._refreshProducts();
    }

    onEnable() {
        this._refreshProducts();
        this.scheduleOnce(() => this._realignBackButton(), 0);
    }

    private _paintCameraBg() {
        const cam = this.node.getChildByName('Camera')?.getComponent(Camera);
        if (cam) cam.clearColor = new Color(C.bg.r, C.bg.g, C.bg.b, 255);
    }

    private _buildUi() {
        const canvas = this.node;
        let root = canvas.getChildByName('shop_root');
        if (!root) {
            root = new Node('shop_root');
            canvas.addChild(root);
        }
        this._root = root;
        root.removeAllChildren();

        const vs = view.getVisibleSize();
        const W = vs.width;
        const H = vs.height;
        const margin = 28;
        const cardW = W - margin * 2;

        const rootUIT = root.getComponent(UITransform) || root.addComponent(UITransform);
        rootUIT.setContentSize(W, H);
        const widget = root.getComponent(Widget) || root.addComponent(Widget);
        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        widget.top = widget.bottom = widget.left = widget.right = 0;
        root.addComponent(BlockInputEvents);

        this._addSolidBg(root, W, H);

        const topInset = this._getTopInset();
        this._mountBackButton(canvas, topInset, margin);

        const petsTop = H * 0.5 - topInset - 104;
        const petCardH = 168;
        const petGap = 16;

        this._catPriceLabel = null;
        this._catBuyBtn = null;
        const catCard = this._createPetCard(
            root,
            cardW,
            petCardH,
            petsTop,
            SF.cat,
            1.85,
            getShopCatPriceLabel(),
            () => this._onCatAction(),
        );
        this._catPriceLabel = catCard.priceLabel;
        this._catBuyBtn = catCard.buyBtn;

        const customY = petsTop - petCardH - petGap;
        this._createCustomPetCard(root, cardW, petCardH, customY, () => this._onCustomizeAction());

        const propsTopY = customY - petCardH - 36;
        this._buildPropsGrid(root, W, margin, propsTopY);
    }

    /**
     * 顶部留白：可见区域原点 + 安全区 + 编辑器预览条。
     * 仅 safeArea 在编辑器里常为 0，会导致返回键贴顶被裁切。
     */
    private _getTopInset(): number {
        const origin = view.getVisibleOrigin();
        let inset = Math.max(80, origin.y + 32);
        try {
            const safe = sys.getSafeAreaRect();
            const frame = view.getFrameSize();
            const visible = view.getVisibleSize();
            if (frame.height > 0 && visible.height > 0) {
                const safeTop = (frame.height - safe.y - safe.height) * (visible.height / frame.height);
                inset = Math.max(inset, origin.y + safeTop + 36);
            }
        } catch { /* ignore */ }
        if (sys.isBrowser) inset += 40;
        return inset;
    }

    /**
     * 返回键挂在 Canvas（与 settings 场景 back 同思路：绝对坐标，不用 Widget）。
     */
    private _mountBackButton(canvas: Node, topInset: number, leftMargin: number) {
        const old = canvas.getChildByName('shop_back_btn');
        if (old?.isValid) old.destroy();

        const vs = view.getVisibleSize();
        const size = 56;
        const topFromEdge = Math.max(100, topInset + size * 0.5);

        const back = this._createIconButton(canvas, SF.back, size, () => this.onBackClick());
        back.name = 'shop_back_btn';
        this._backBtn = back;

        const x = -vs.width * 0.5 + leftMargin + size * 0.5;
        const y = vs.height * 0.5 - topFromEdge;
        back.setPosition(x, y, 0);
        back.setSiblingIndex(canvas.children.length - 1);

        const chevron = new Node('chevron');
        back.addChild(chevron);
        const cu = chevron.addComponent(UITransform);
        cu.setContentSize(size, size);
        const cl = chevron.addComponent(Label);
        cl.string = '‹';
        cl.fontSize = 48;
        cl.lineHeight = 56;
        cl.color = C.text;
        cl.horizontalAlign = Label.HorizontalAlign.CENTER;
        cl.verticalAlign = Label.VerticalAlign.CENTER;
    }

    private _realignBackButton() {
        if (!this._backBtn?.isValid) return;
        const canvas = this.node;
        const vs = view.getVisibleSize();
        const size = 56;
        const topFromEdge = Math.max(100, this._getTopInset() + size * 0.5);
        const leftMargin = 28;
        const x = -vs.width * 0.5 + leftMargin + size * 0.5;
        const y = vs.height * 0.5 - topFromEdge;
        this._backBtn.setPosition(x, y, 0);
    }

    private _addSolidBg(parent: Node, w: number, h: number) {
        const bg = new Node('bg');
        parent.addChild(bg);
        const uit = bg.addComponent(UITransform);
        uit.setContentSize(w, h);
        const g = bg.addComponent(Graphics);
        g.fillColor = C.bg;
        g.rect(-w * 0.5, -h * 0.5, w, h);
        g.fill();
    }

    private _createIconButton(parent: Node, sfUuid: string, size: number, onClick: () => void): Node {
        const n = new Node('icon_btn');
        parent.addChild(n);
        const uit = n.addComponent(UITransform);
        uit.setContentSize(size, size);
        const sp = n.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.CUSTOM;
        uit.setContentSize(size, size);
        this._loadSpriteFrame(sfUuid, (frame) => {
            if (sp.isValid && frame) sp.spriteFrame = frame;
        });
        const btn = n.addComponent(Button);
        btn.transition = Button.Transition.SCALE;
        btn.zoomScale = 1.06;
        n.on(Button.EventType.CLICK, onClick, this);
        return n;
    }

    private _createPetCard(
        parent: Node,
        cardW: number,
        cardH: number,
        centerY: number,
        iconUuid: string,
        iconScale: number,
        priceText: string,
        onBuy: () => void,
    ): { card: Node; priceLabel: Label; buyBtn: Button } {
        const card = new Node('pet_card');
        parent.addChild(card);
        card.setPosition(0, centerY, 0);
        const cardUIT = card.addComponent(UITransform);
        cardUIT.setContentSize(cardW, cardH);
        this._drawRoundedCard(card, cardW, cardH, 16);

        const icon = new Node('icon');
        card.addChild(icon);
        icon.setPosition(-cardW * 0.28, 0, 0);
        const iconUIT = icon.addComponent(UITransform);
        iconUIT.setContentSize(120, 120);
        const sp = icon.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.TRIMMED;
        this._loadSpriteFrame(iconUuid, (frame) => {
            if (sp.isValid && frame) {
                sp.spriteFrame = frame;
                icon.setScale(iconScale, iconScale, 1);
            }
        });

        const buy = this._createPriceButton(card, priceText, cardW * 0.3, 0, onBuy);

        return { card, priceLabel: buy.label, buyBtn: buy.button };
    }

    private _createCustomPetCard(
        parent: Node,
        cardW: number,
        cardH: number,
        centerY: number,
        onBuy: () => void,
    ) {
        const card = new Node('pet_card_custom');
        parent.addChild(card);
        card.setPosition(0, centerY, 0);
        const cardUIT = card.addComponent(UITransform);
        cardUIT.setContentSize(cardW, cardH);
        this._drawRoundedCard(card, cardW, cardH, 16);

        const text = new Node('placeholder');
        card.addChild(text);
        text.setPosition(-cardW * 0.18, 0, 0);
        const textUIT = text.addComponent(UITransform);
        textUIT.setContentSize(cardW * 0.48, cardH - 24);
        const lb = text.addComponent(Label);
        lb.string = getShopCustomizePlaceholder();
        lb.fontSize = 26;
        lb.lineHeight = 36;
        lb.color = C.textDim;
        lb.horizontalAlign = Label.HorizontalAlign.LEFT;
        lb.overflow = Label.Overflow.RESIZE_HEIGHT;
        lb.enableWrapText = true;

        this._createPriceButton(card, getShopCustomizePriceLabel(), cardW * 0.3, 0, onBuy);
    }

    private _buildPropsGrid(parent: Node, screenW: number, margin: number, topCenterY: number) {
        const cols = 3;
        const gap = 14;
        const cellW = (screenW - margin * 2 - gap * (cols - 1)) / cols;
        const cellH = cellW + 52;
        const icons = [SF.icon1, SF.icon2, SF.icon3];
        const startX = -screenW * 0.5 + margin + cellW * 0.5;

        for (let i = 0; i < icons.length; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cellW + gap);
            const y = topCenterY - row * (cellH + gap);
            const btnIndex = (i + 1) as 1 | 2 | 3;
            this._createPropCell(parent, icons[i], cellW, cellH, x, y, btnIndex);
        }
    }

    private _createPropCell(
        parent: Node,
        iconUuid: string,
        cellW: number,
        cellH: number,
        x: number,
        y: number,
        buttonIndex: 1 | 2 | 3,
    ) {
        const cell = new Node('prop_cell');
        parent.addChild(cell);
        cell.setPosition(x, y, 0);
        const cellUIT = cell.addComponent(UITransform);
        cellUIT.setContentSize(cellW, cellH);
        this._drawRoundedCard(cell, cellW, cellH - 44, 12);

        const icon = new Node('icon');
        cell.addChild(icon);
        icon.setPosition(0, 18, 0);
        const iconUIT = icon.addComponent(UITransform);
        iconUIT.setContentSize(88, 88);
        const sp = icon.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.TRIMMED;
        this._loadSpriteFrame(iconUuid, (frame) => {
            if (sp.isValid && frame) sp.spriteFrame = frame;
        });

        this._createPriceButton(cell, getShopFreeLabel(), 0, -cellH * 0.5 + 36, () => {
            if (this._busy) return;
            startShopPropAd(buttonIndex);
        }, 120, 40);
    }

    private _drawRoundedCard(node: Node, w: number, h: number, radius: number) {
        const g = node.addComponent(Graphics);
        const hw = w * 0.5;
        const hh = h * 0.5;
        const r = Math.min(radius, hw, hh);
        g.fillColor = C.cardFill;
        g.strokeColor = C.cardStroke;
        g.lineWidth = 2;
        g.roundRect(-hw, -hh, w, h, r);
        g.fill();
        g.stroke();
    }

    private _createPriceButton(
        parent: Node,
        text: string,
        x: number,
        y: number,
        onClick: () => void,
        bw = 148,
        bh = 52,
    ): { button: Button; label: Label } {
        const btn = new Node('price_btn');
        parent.addChild(btn);
        btn.setPosition(x, y, 0);
        const btnUIT = btn.addComponent(UITransform);
        btnUIT.setContentSize(bw, bh);
        const g = btn.addComponent(Graphics);
        g.fillColor = C.btn;
        g.roundRect(-bw * 0.5, -bh * 0.5, bw, bh, bh * 0.5);
        g.fill();

        const btnComp = btn.addComponent(Button);
        btnComp.transition = Button.Transition.SCALE;
        btnComp.zoomScale = 1.05;

        const lbNode = new Node('Label');
        btn.addChild(lbNode);
        const lbUIT = lbNode.addComponent(UITransform);
        lbUIT.setContentSize(bw, bh);
        const lb = lbNode.addComponent(Label);
        lb.string = text;
        lb.fontSize = 26;
        lb.lineHeight = 34;
        lb.color = C.text;
        lb.horizontalAlign = Label.HorizontalAlign.CENTER;

        btn.on(Button.EventType.CLICK, onClick, this);
        return { button: btnComp, label: lb };
    }

    private _loadSpriteFrame(uuid: string, cb: (f: SpriteFrame | null) => void) {
        assetManager.loadAny({ uuid }, (err, asset) => {
            const frame = asset as SpriteFrame;
            if (err || !frame?.texture) {
                cb(null);
                return;
            }
            cb(frame);
        });
    }

    private _refreshProducts() {
        const catOk = isCatUnlocked();
        if (this._catPriceLabel) {
            this._catPriceLabel.string = catOk ? getShopOwnedLabel() : getShopCatPriceLabel();
        }
        if (this._catBuyBtn) {
            this._catBuyBtn.interactable = !catOk;
            const g = this._catBuyBtn.node.getComponent(Graphics);
            if (g) g.fillColor = catOk ? C.btnOwned : C.btn;
        }

        const intent = consumeShopIntent();
        if (intent === 'cat' && !catOk && this._catBuyBtn?.node) {
            this._pulse(this._catBuyBtn.node);
        }
    }

    private _pulse(n: Node) {
        n.setScale(1.06, 1.06, 1);
        this.scheduleOnce(() => { if (n?.isValid) n.setScale(1, 1, 1); }, 0.3);
    }

    private async _purchase(product: ShopProductId) {
        if (this._busy) return;
        this._busy = true;
        const ok = await requestSubscription(product);
        this._busy = false;
        if (!ok) return;
        this._refreshProducts();
        if (product === 'cat') {
            director.loadScene('home', (err) => {
                if (err) console.error('[ShopScene] 无法返回 home', err);
            });
        }
    }

    private _onCatAction() {
        if (isCatUnlocked()) return;
        this._purchase('cat');
    }

    private _onCustomizeAction() {
        if (isCustomizeUnlocked()) {
            director.loadScene('customize', (err) => {
                if (err) console.error('[ShopScene] 无法加载 customize', err);
            });
            return;
        }
        this._purchase('customize').then((ok) => {
            if (ok) {
                director.loadScene('customize', (err) => {
                    if (err) console.error('[ShopScene] 无法加载 customize', err);
                });
            }
        });
    }

    public onBackClick() {
        director.loadScene('home', (err) => {
            if (err) console.error('[ShopScene] 无法返回 home', err);
        });
    }
}

function _ensureShopSceneOnCanvas() {
    const scene = director.getScene();
    if (!scene || scene.name !== 'shop') return;
    const canvas = scene.getChildByName('Canvas');
    if (canvas && !canvas.getComponent(ShopScene)) {
        canvas.addComponent(ShopScene);
    }
}

director.on(Director.EVENT_AFTER_SCENE_LAUNCH, _ensureShopSceneOnCanvas);

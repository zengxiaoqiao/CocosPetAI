import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, UIOpacity, tween, Vec3, find, sys, assetManager } from 'cc';
import { PetValue } from './PetValue';
const { ccclass, property } = _decorator;

const STORAGE_KEY_PET = 'petai_pet_choice';

/** ui 图集里的 love.png（大爱心），勿用 pet_friendship 小图标 */
const LOVE_SPRITE_FRAME_UUID = '3ae7a7fa-b2b9-415c-91eb-ceb82a98e659@b8fde';

/**
 * 心情高时从宠物头顶略上方冒出爱心：自下往上、略向两侧散开；
 * 透明度 0 → 实 → 0，无扇形爆发与缩放脉冲。
 */
@ccclass('HeartBubbleAni')
export class HeartBubbleAni extends Component {

    @property({ type: SpriteFrame, tooltip: 'love 大图（可留空则自动用 ui 图集 love.png）' })
    heartSpriteFrame: SpriteFrame | null = null;

    @property({ tooltip: '在估算头顶位置之上再上浮的像素（起点高度）' })
    burstCenterY = 28;

    @property({ tooltip: '爆发点整体水平偏移（负值向左）' })
    burstOffsetX = -100;

    @property({ tooltip: '爆发点整体垂直偏移（负值向下）' })
    burstOffsetY = -100;

    @property
    burstInterval = 0.55;

    @property
    heartsPerBurst = 3;

    @property({ tooltip: '向上飘移最小距离（像素）' })
    riseMin = 90;

    @property({ tooltip: '向上飘移最大距离（像素）' })
    riseMax = 150;

    @property({ tooltip: '水平散开半宽（像素）' })
    spreadX = 48;

    @property
    flyDuration = 0.85;

    @property
    heartScale = 0.3;

    @property
    staggerInBurst = 0.06;

    @property({ tooltip: '飘到中段时的峰值不透明度（0~255）' })
    peakOpacity = 230;

    private _spriteFrame: SpriteFrame | null = null;
    private _timer = 0;

    onLoad() {
        this._resolveHeartSpriteFrame();
    }

    onEnable() {
        this._resolveHeartSpriteFrame();
        this._timer = 0;
    }

    update(dt: number) {
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
    public burstOnce(count = 3) {
        if (!this._spriteFrame) this._resolveHeartSpriteFrame();
        if (!this._spriteFrame) return;
        const n = Math.max(1, count | 0);
        for (let i = 0; i < n; i++) {
            const delay = i * this.staggerInBurst;
            if (delay <= 0) this._spawnOneHeart();
            else this.scheduleOnce(() => this._spawnOneHeart(), delay);
        }
    }

    private _frameUsable(frame: SpriteFrame | null | undefined): frame is SpriteFrame {
        return !!frame && !!(frame as SpriteFrame).texture;
    }

    private _resolveHeartSpriteFrame(): void {
        if (this._frameUsable(this.heartSpriteFrame)) {
            this._spriteFrame = this.heartSpriteFrame;
            return;
        }
        const hi = find('Canvas/highintimate') ?? this.node;
        const sp = hi?.getComponent(Sprite);
        if (this._frameUsable(sp?.spriteFrame)) {
            this._spriteFrame = sp!.spriteFrame!;
            this.heartSpriteFrame = this._spriteFrame;
            return;
        }
        assetManager.loadAny({ uuid: LOVE_SPRITE_FRAME_UUID }, (err, asset) => {
            if (!this.isValid) return;
            const frame = asset as SpriteFrame;
            if (!err && this._frameUsable(frame)) {
                this._spriteFrame = frame;
                this.heartSpriteFrame = frame;
            }
        });
    }

    private _getPetValue(): PetValue | null {
        return PetValue.instance ?? find('Canvas/pet_value')?.getComponent(PetValue) ?? null;
    }

    private _getBurstParent(): Node {
        const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
        const dog = find('Canvas/dog');
        const cat = find('Canvas/cat');
        if (isCat && cat?.active) return cat;
        if (dog?.active) return dog;
        if (cat?.active) return cat;
        return this.node;
    }

    private _resolveBurstCenterY(parent: Node): number {
        const petUIT = parent.getComponent(UITransform);
        if (!petUIT) return 300;
        const h = Math.max(petUIT.contentSize.height, 200);
        const ap = petUIT.anchorPoint.y;
        const visibleHeadY = h * (0.9 - ap);
        return visibleHeadY + this.burstCenterY;
    }

    private _fireBurst() {
        for (let i = 0; i < this.heartsPerBurst; i++) {
            const delay = i * this.staggerInBurst;
            if (delay <= 0) {
                this._spawnOneHeart();
            } else {
                this.scheduleOnce(() => this._spawnOneHeart(), delay);
            }
        }
    }

    private _spawnOneHeart() {
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

        tween(bubble)
            .to(duration, { position: new Vec3(endX, endY, 0) }, { easing: 'sineOut' })
            .call(() => {
                if (bubble.isValid) bubble.destroy();
            })
            .start();

        tween(opacity)
            .to(fadeInTime, { opacity: peak }, { easing: 'sineOut' })
            .to(fadeOutTime, { opacity: 0 }, { easing: 'sineIn' })
            .start();
    }
}

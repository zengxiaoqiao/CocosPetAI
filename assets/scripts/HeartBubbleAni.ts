import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, UIOpacity, tween, Vec3, director, find } from 'cc';
import { PetValue } from './PetValue';
const { ccclass, property } = _decorator;

/**
 * 挂在宠物节点（dog / cat）上：心形像烟花一样从一点爆发、向上方发散。
 * 每隔一段时间一「发」烟花，每发多颗心向斜上方扇形飞出。
 * 心形图需在 Inspector 里指定（可拖 highintimate 下 Sprite 的 spriteFrame）。
 */
@ccclass('HeartBubbleAni')
export class HeartBubbleAni extends Component {

    @property({ type: SpriteFrame, tooltip: '心形图（可从 highintimate 的 Sprite 拖入其 spriteFrame）' })
    heartSpriteFrame: SpriteFrame | null = null;

    /** 烟花中心在宠物本地的 Y（爆发点高度） */
    @property
    burstCenterY = 50;

    /** 每发烟花的间隔（秒），越大烟花越疏 */
    @property
    burstInterval = 0.7;

    /** 每发烟花炸出多少颗心 */
    @property
    heartsPerBurst = 6;

    /** 心飞出去的距离范围（像素），随机在此范围，形成炸开感 */
    @property
    minDistance = 65;

    @property
    maxDistance = 145;

    /** 向上发散的扇形角度（度），例如 80 表示以正上方为中心、左右各 40° */
    @property
    fanAngleDeg = 80;

    /** 心从飞出到消失的时长（秒），越大飞得越慢 */
    @property
    flyDuration = 1.45;

    /** 刚飞出时很小（像火星）；若心形图缩小过，可适当调大以保持视觉大小 */
    @property
    startScale = 0.2;

    /** 飞出去后变大的上限；若心形图缩小过，可适当调大以保持视觉大小 */
    @property
    endScale = 0.76;

    /** 同一发内每颗心错开的时间（秒），略错开更像炸开 */
    @property
    staggerInBurst = 0.018;

    private _spriteFrame: SpriteFrame | null = null;
    private _timer = 0;

    start() {
        const sp = this.node.getComponent(Sprite);
        if (this.heartSpriteFrame) {
            this._spriteFrame = this.heartSpriteFrame;
        } else if (sp && sp.spriteFrame) {
            this._spriteFrame = sp.spriteFrame;
        }
        if (!this._spriteFrame) return;
        this._timer = 0;
    }

    update(dt: number) {
        if (!this._spriteFrame) return;
        // 优先低值：体力或心情任一低于 20 时不冒爱心，仅心情 > 80 且两者都不低时才播放
        const pv = this._getPetValue();
        if (pv && (!pv.isIntimacyHigh() || pv.isHpLow() || pv.isIntimacyLow())) return;
        this._timer += dt;
        if (this._timer >= this.burstInterval) {
            this._timer = 0;
            this._fireBurst();
        }
    }

    private _getPetValue(): PetValue | null {
        const n = find('Canvas/pet_value');
        if (n) return n.getComponent(PetValue) || null;
        return director.getScene()?.getComponentInChildren(PetValue) || null;
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
        const bubble = new Node('HeartBubble');
        bubble.addComponent(UITransform);
        const sp = bubble.addComponent(Sprite);
        sp.spriteFrame = this._spriteFrame!;
        const opacity = bubble.addComponent(UIOpacity);
        opacity.opacity = 255;

        this.node.addChild(bubble);
        bubble.setPosition(0, this.burstCenterY, 0);
        bubble.setScale(this.startScale, this.startScale, 1);

        const halfFanRad = (this.fanAngleDeg / 2) * (Math.PI / 180);
        const angle = (Math.random() * 2 - 1) * halfFanRad;
        const dist = this.minDistance + Math.random() * (this.maxDistance - this.minDistance);
        const endX = Math.sin(angle) * dist;
        const endY = this.burstCenterY + Math.cos(angle) * dist;

        const duration = this.flyDuration * (0.88 + Math.random() * 0.24);
        const endS = this.endScale * (0.9 + Math.random() * 0.2);

        tween(bubble)
            .to(duration, {
                position: new Vec3(endX, endY, 0),
                scale: new Vec3(endS, endS, 1),
            }, { easing: 'quadOut' })
            .start();

        tween(opacity)
            .delay(duration * 0.35)
            .to(duration * 0.65, { opacity: 0 }, { easing: 'quadOut' })
            .call(() => {
                if (bubble.isValid) bubble.destroy();
            })
            .start();
    }
}

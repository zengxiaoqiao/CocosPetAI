import { _decorator, Component, Animation, director, find } from 'cc';
import { PetValue, IS_FIRST_SESSION } from './PetValue';
const { ccclass, property } = _decorator;

/**
 * 狗/猫共用的随机动画播放逻辑。
 * 子类通过 prefix 区分形象（dog/cat），动画命名规则：{prefix}01~17。
 */
@ccclass('RandomPlayPetAni')
export abstract class RandomPlayPetAni extends Component {

    static returnedFromAd: boolean = false;

    protected abstract get prefix(): 'dog' | 'cat';

    @property(Animation)
    protected aniComponent: Animation = null!;

    @property(PetValue)
    petValue: PetValue | null = null;

    protected startAniName: string | null = null;
    protected switchTimer: number | null = null;
    protected loopTimer: number | null = null;
    /** 定期检查体力/亲密，不足时切到 13/14，恢复后切回 */
    private _checkInterval: number = 4;

    protected get aniNames(): string[] {
        return [`${this.prefix}01`, `${this.prefix}02`, `${this.prefix}03`];
    }

    /** 每晚 22 点～次日 7 点、或午间 12:00～13:00 只播 03（与夜间同一动画）；其余时段随机 01/02（不含 03）。
     *  首次安装首开时（IS_FIRST_SESSION），无论时间点都按白天逻辑处理，不睡觉。 */
    protected get isNightTime(): boolean {
        if (IS_FIRST_SESSION) return false;
        const d = new Date();
        const h = d.getHours();
        if (h >= 22 || h < 7) return true;
        if (h === 12) return true;
        return false;
    }

    protected get clip13(): string { return `${this.prefix}13`; }
    protected get clip14(): string { return `${this.prefix}14`; }
    protected get clip04(): string { return `${this.prefix}04`; }
    protected get clip05(): string { return `${this.prefix}05`; }

    onLoad() {
        if (!this.aniComponent) this.aniComponent = this.node.getComponent(Animation);
    }

    onEnable() {
        if (RandomPlayPetAni.returnedFromAd) return;
        // 延后一帧播放，确保 Animation 组件及 clips 已就绪（节点从 inactive 切到 active 时可能有时序问题）
        this.scheduleOnce(() => this.playRandomAni(), 0);
        // 定期检查体力/亲密，使用默认「无限重复」的重载，避免 Infinity 在某些平台被当成 0 次
        this.schedule(this._checkStateAndReselectAni, this._checkInterval);
    }

    onDisable() {
        this.cancelSwitchTimer();
        this.cancelLoopTimer();
        this.unschedule(this._checkStateAndReselectAni);
    }

    public cancelSwitchTimer() {
        if (this.switchTimer !== null) {
            clearTimeout(this.switchTimer);
            this.switchTimer = null;
        }
        this.startAniName = null;
    }

    private cancelLoopTimer() {
        if (this.loopTimer !== null) {
            clearTimeout(this.loopTimer);
            this.loopTimer = null;
        }
    }

    protected _ensurePetValue(): PetValue | null {
        if (this.petValue) return this.petValue;
        const n = find('Canvas/pet_value');
        this.petValue = n ? n.getComponent(PetValue) : null;
        if (!this.petValue) this.petValue = director.getScene()?.getComponentInChildren(PetValue) || null;
        return this.petValue;
    }

    protected playRandomAni() {
        if (!this.aniComponent || this.aniNames.length === 0) return;
        this.cancelSwitchTimer();
        this.cancelLoopTimer();

        const pv = this._ensurePetValue();
        let targetAniName: string;
        if (pv && pv.isHpLow()) {
            targetAniName = this.clip14;
        } else if (pv && pv.isIntimacyLow()) {
            targetAniName = this.clip13;
        } else if (this.isNightTime) {
            targetAniName = this.aniNames[2];
        } else {
            const randomIndex = Math.floor(Math.random() * 2);
            targetAniName = this.aniNames[randomIndex];
            // PetValue 可能晚于本组件就绪，若尚未拿到 pv 则稍后重试一次，以便亲密/体力不足时能切到 13/14
            if (!pv && !this.isNightTime) {
                this.scheduleOnce(() => this.playRandomAni(), 0.5);
            }
        }
        this.startAniName = targetAniName;
        this.aniComponent.stop();
        this.aniComponent.play(targetAniName);

        if (targetAniName === this.clip13 || targetAniName === this.clip14) {
            this._setupLoopAnimation(targetAniName);
            return;
        }
        if (targetAniName === this.aniNames[2]) return; // 03 不切换
        const delayMs = 6600;
        this.switchTimer = setTimeout(() => {
            this.switchTimer = null;
            if (!this.startAniName || !this.aniComponent) return;
            if (this.startAniName === this.aniNames[0]) this.aniComponent.play(this.clip04);
            else if (this.startAniName === this.aniNames[1]) this.aniComponent.play(this.clip05);
        }, delayMs);
    }

    private _setupLoopAnimation(aniName: string) {
        const state = this.aniComponent.getState(aniName);
        let durationMs: number;
        if (state && state.duration > 0) {
            const speed = state.speed > 0 ? state.speed : 1;
            durationMs = (state.duration / speed) * 1000;
        } else {
            durationMs = 2500;
        }
        this.loopTimer = setTimeout(() => {
            this.loopTimer = null;
            if (!this.node.active || !this.aniComponent) return;
            const pv = this._ensurePetValue();
            if ((aniName === this.clip14 && pv && pv.isHpLow()) || (aniName === this.clip13 && pv && pv.isIntimacyLow())) {
                this.aniComponent.play(aniName);
                this._setupLoopAnimation(aniName);
            } else {
                // 体力/亲密已恢复，切回普通动画
                this.playRandomAni();
            }
        }, durationMs);
    }

    /** 根据当前体力/亲密应播的动画名（与 playRandomAni 分支一致） */
    private _getTargetAniName(): string {
        const pv = this._ensurePetValue();
        if (pv && pv.isHpLow()) return this.clip14;
        if (pv && pv.isIntimacyLow()) return this.clip13;
        if (this.isNightTime) return this.aniNames[2];
        const randomIndex = Math.floor(Math.random() * 2);
        return this.aniNames[randomIndex];
    }

    private _checkStateAndReselectAni() {
        if (!this.aniComponent || !this.node.active) return;
        const target = this._getTargetAniName();
        const needLow = target === this.clip13 || target === this.clip14;
        const isLow = this.startAniName === this.clip13 || this.startAniName === this.clip14;
        if (needLow && !isLow) this.playRandomAni();
        else if (!needLow && isLow) this.playRandomAni();
    }
}

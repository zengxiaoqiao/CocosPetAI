import { _decorator, Component, Animation, Node, EventTouch, Vec2, director, sys, Label, find, Button } from 'cc';
import { RandomPlayPetAni } from './RandomPlayPetAni';
import { PetValue } from './PetValue';
import { SharedBtnCounts } from './SharedBtnCounts';
import { PetInfoBar } from './PetInfoBar';
import { HeartBubbleAni } from './HeartBubbleAni';
import { SwipeState } from './SwipeState';
const { ccclass } = _decorator;

/** 仅声明宠物长按所需接口，避免 import BtnMicroRecord 造成循环引用 */
interface IPetMicroTouch {
    onPetTouchStart(): void;
    onPetTouchEnd(): void;
    onPetTouchCancel(): void;
    /** 短按结束：返回 true 表示未进入录音，由宠物逻辑处理点摸 */
    consumePetShortTap(): boolean;
}

const CLIP_SUFFIXES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17'] as const;
const SHORT_SUFFIX = new Set(['06', '07', '08']);
const LONG_SUFFIX = new Set(['09', '10', '11', '13', '14', '15', '16', '17']);

function getClipDurationMs(suffix: string): number {
    if (suffix === '13') return 1670;
    if (SHORT_SUFFIX.has(suffix)) return 1100;
    if (LONG_SUFFIX.has(suffix)) return 4850;
    return 3300;
}

/**
 * 狗/猫共用控制逻辑基类。
 * 子类只需要提供前缀（dog/cat），以及（可选）兼容方法别名。
 */
@ccclass('PetControllerBase')
export abstract class PetControllerBase extends Component {

    protected abstract get prefix(): 'dog' | 'cat';

    // 这些字段由子类声明为 @property，以保证场景序列化/Inspector 兼容
    public anim!: Animation;
    public scrollViewForSwipe: Node | null = null;
    public swipeAreaNode: Node | null = null;
    public swipeThreshold: number = 50;
    public rechargePanel: Node | null = null;
    public petValue: PetValue | null = null;
    public btn1Label: Label | null = null;
    public btn2Label: Label | null = null;
    public btn3Label: Label | null = null;

    // Button1/2/3 次数为 0 时显示的「toad」节点（在场景中位于 ButtonX/Sprite/toad）
    protected btn1Toad: Node | null = null;
    protected btn2Toad: Node | null = null;
    protected btn3Toad: Node | null = null;

    protected _btn1IgnoreUntil: number = 0;
    protected _btn2IgnoreUntil: number = 0;
    protected _btn3IgnoreUntil: number = 0;

    protected currentClipName: string = '';
    protected sequenceQueue: string[] = [];
    protected isPlayingSequence: boolean = false;
    protected sequenceTimer: number | null = null;
    protected _randomAniDisabledByUser: boolean = false;
    protected _petTouchStart: Vec2 = new Vec2();
    private _petTouchMovedTooFar = false;
    private static readonly PET_TOUCH_MOVE_CANCEL_PX = 28;

    protected clip(suffix: string): string {
        return `${this.prefix}${suffix}`;
    }

    onLoad() {
        this.currentClipName = this.clip('01');
        if (!this.anim) this.anim = this.node.getComponent(Animation) as Animation;
        if (!this.petValue) this.petValue = director.getScene()?.getComponentInChildren(PetValue) || null;
        SharedBtnCounts.onChangeCallback = () => this._updateCountLabels();
        this._updateCountLabels();

        this.node.on(Node.EventType.TOUCH_START, this._onPetTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this._onPetTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this._onPetTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._onPetTouchEnd, this);
    }

    onEnable() {
        this._updateCountLabels();
        this._syncCurrentClip();
        const returnedFromAd = RandomPlayPetAni.returnedFromAd;
        if (returnedFromAd) {
            this.playLoop(this.clip('01'));
            this._getRandomPlay()?.cancelSwitchTimer();
            this.scheduleOnce(() => {
                RandomPlayPetAni.returnedFromAd = false;
            }, 0);
            return;
        }
        if (this._randomAniDisabledByUser && !this.isPlayingSequence) {
            this.playLoop(this.clip('01'));
            this._getRandomPlay()?.cancelSwitchTimer();
        }
    }

    onDisable() {
        if (this.sequenceTimer !== null) {
            clearTimeout(this.sequenceTimer);
            this.sequenceTimer = null;
        }
        this.isPlayingSequence = false;
        this.node.off(Node.EventType.TOUCH_START, this._onPetTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this._onPetTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this._onPetTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this._onPetTouchEnd, this);
    }

    private _onPetTouchStart(e: EventTouch) {
        if (!this.node.active || this.isPlayingSequence) return;
        e.getUILocation(this._petTouchStart);
        this._petTouchMovedTooFar = false;
        this._getMicroRecord()?.onPetTouchStart();
    }

    private _onPetTouchMove(e: EventTouch) {
        if (this._petTouchMovedTooFar) return;
        const cur = new Vec2();
        e.getUILocation(cur);
        const dx = cur.x - this._petTouchStart.x;
        const dy = cur.y - this._petTouchStart.y;
        if (dx * dx + dy * dy > PetControllerBase.PET_TOUCH_MOVE_CANCEL_PX * PetControllerBase.PET_TOUCH_MOVE_CANCEL_PX) {
            this._petTouchMovedTooFar = true;
            this._getMicroRecord()?.onPetTouchCancel();
        }
    }

    private _onPetTouchEnd() {
        if (this._petTouchMovedTooFar) return;
        const micro = this._getMicroRecord();
        if (micro?.consumePetShortTap()) {
            this.onBtn0Click();
            return;
        }
        micro?.onPetTouchEnd();
    }

    private _getMicroRecord(): IPetMicroTouch | null {
        const n = find('Canvas/btn_micro');
        return n?.getComponent('BtnMicroRecord') as IPetMicroTouch | null;
    }

    start() {
        if (this.rechargePanel) this.rechargePanel.active = false;
        this._ensureCountLabels();
        if (!this.anim) this.anim = this.node.getComponent(Animation) as Animation;
    }

    private _ensureCountLabels() {
        if (!this.btn1Label || !this.btn2Label || !this.btn3Label || !this.btn1Toad || !this.btn2Toad || !this.btn3Toad) {
            const btn1 = find('Canvas/btn/Button1');
            const btn2 = find('Canvas/btn/Button2');
            const btn3 = find('Canvas/btn/Button3');
            if (btn1) {
                if (!this.btn1Label) this.btn1Label = btn1.getComponentInChildren(Label);
                if (!this.btn1Toad) {
                    const sprite = btn1.getChildByName('Sprite');
                    this.btn1Toad = sprite ? sprite.getChildByName('toad') : null;
                }
            }
            if (btn2) {
                if (!this.btn2Label) this.btn2Label = btn2.getComponentInChildren(Label);
                if (!this.btn2Toad) {
                    const sprite = btn2.getChildByName('Sprite');
                    this.btn2Toad = sprite ? sprite.getChildByName('toad') : null;
                }
            }
            if (btn3) {
                if (!this.btn3Label) this.btn3Label = btn3.getComponentInChildren(Label);
                if (!this.btn3Toad) {
                    const sprite = btn3.getChildByName('Sprite');
                    this.btn3Toad = sprite ? sprite.getChildByName('toad') : null;
                }
            }
            this._updateCountLabels();
        }
    }

    protected _gotoAdScene(buttonIndex: 1 | 2 | 3): void {
        try {
            sys.localStorage.setItem('recharge_pet', this.prefix);
            sys.localStorage.setItem('recharge_button', String(buttonIndex));
        } catch (e) { console.warn('[PetControllerBase] 写入本地存储失败：', e); }
        RandomPlayPetAni.returnedFromAd = true;
        this.scheduleOnce(() => {
            if (!this.isValid) return;
            director.loadScene('ad', (err) => {
                if (err) console.error('[PetControllerBase] 无法加载 ad 场景', err);
            });
        }, 0);
    }

    protected playLoop(name: string) {
        this.currentClipName = name;
        this.sequenceQueue = [];
        this.isPlayingSequence = false;
        this.anim.play(name);
    }

    /** 公开方法：循环播放单个动画（用于滑动时实时播放） */
    public playLoopClip(name: string) {
        this.playLoop(name);
    }

    /** 停止当前序列并回到待机动画（供麦克风停止按钮等调用） */
    public playIdle() {
        if (this.sequenceTimer !== null) {
            clearTimeout(this.sequenceTimer);
            this.sequenceTimer = null;
        }
        this.sequenceQueue = [];
        this.isPlayingSequence = false;
        if (!this.anim) this.anim = this.node.getComponent(Animation) as Animation;
        if (this.anim) this.playLoop(this.clip('01'));
    }

    protected playSequence(clips: string[]) {
        if (!clips || clips.length === 0) return;
        if (!this.anim) this.anim = this.node.getComponent(Animation) as Animation;
        if (!this.anim) return;
        if (this.sequenceTimer !== null) {
            clearTimeout(this.sequenceTimer);
            this.sequenceTimer = null;
        }
        this.anim.stop();
        this._getRandomPlay()?.cancelSwitchTimer();
        this.sequenceQueue = clips.slice();
        this.isPlayingSequence = true;
        this._setHeartBubbleAniEnabled(false);
        const totalMs = clips.reduce((sum, name) => sum + getClipDurationMs(name.slice(this.prefix.length)), 0);
        this.scheduleOnce(this._reenableHeartBubbleAni, totalMs / 1000);
        this._playNextFromQueue();
    }

    private _reenableHeartBubbleAni = () => {
        if (this.isValid && this.node.isValid) this._setHeartBubbleAniEnabled(true);
    };

    private _setHeartBubbleAniEnabled(enabled: boolean) {
        const comp = this.node.getComponent(HeartBubbleAni);
        if (comp) comp.enabled = enabled;
    }

    private _playNextFromQueue() {
        if (this.sequenceQueue.length === 0) {
            this.isPlayingSequence = false;
            return;
        }
        const nextName = this.sequenceQueue.shift()!;
        this.currentClipName = nextName;
        this.anim.play(nextName);
        if (this.sequenceQueue.length === 0) {
            this.isPlayingSequence = false;
            return;
        }
        const suffix = nextName.slice(this.prefix.length);
        let durationMs = 3300;
        // 单独为 13 调整为动画实际时长（约 1.67s）
        if (suffix === '13') {
            durationMs = 1670;
        } else if (SHORT_SUFFIX.has(suffix)) {
            durationMs = 1100;
        } else if (LONG_SUFFIX.has(suffix)) {
            durationMs = 4850;
        }
        this.sequenceTimer = setTimeout(() => {
            this.sequenceTimer = null;
            this._playNextFromQueue();
        }, durationMs);
    }

    protected _syncCurrentClip(): string {
        if (!this.anim) return this.currentClipName;
        for (const s of CLIP_SUFFIXES) {
            const name = this.clip(s);
            const state = this.anim.getState(name);
            if (state && state.isPlaying) {
                this.currentClipName = name;
                return name;
            }
        }
        return this.currentClipName;
    }

    protected _getRandomPlay(): RandomPlayPetAni | null {
        return this.node.getComponent(RandomPlayPetAni) || null;
    }

    /** 数值变化时暂时隐藏 info bar，若已经在隐藏状态则简单覆盖持续时间。 */
    protected _hideInfoBarTemporarily(seconds: number = 2) {
        PetInfoBar.setGlobalVisible(false);
        this.scheduleOnce(() => {
            PetInfoBar.instance?.syncPassiveBubble();
        }, seconds);
    }

    protected _updateCountLabels() {
        const counts = [SharedBtnCounts.btn1, SharedBtnCounts.btn2, SharedBtnCounts.btn3];
        const labels = [this.btn1Label, this.btn2Label, this.btn3Label];
        const toads = [this.btn1Toad, this.btn2Toad, this.btn3Toad];

        for (let i = 0; i < 3; i++) {
            const c = counts[i];
            const label = labels[i];
            const toad = toads[i];
            if (label) {
                label.string = String(c);
                // 可点击次数为 0 时隐藏数字，用 toad 图标替代
                label.node.active = c > 0;
            }
            if (toad) {
                toad.active = c <= 0;
            }
        }

        // 数量为 0 时确保按钮仍可点击，以便跳转 AD 场景
        this._ensureBtnInteractableWhenZero();
    }

    private _ensureBtnInteractableWhenZero() {
        const btns = [
            find('Canvas/btn/Button1'),
            find('Canvas/btn/Button2'),
            find('Canvas/btn/Button3'),
        ];
        const counts = [SharedBtnCounts.btn1, SharedBtnCounts.btn2, SharedBtnCounts.btn3];
        btns.forEach((n, i) => {
            if (!n || counts[i] >= 1) return;
            const btn = n.getComponent(Button);
            if (btn) btn.interactable = true;
        });
    }

    protected _disableRandomAniAfterUserInteraction() {
        if (this._randomAniDisabledByUser) return;
        this._randomAniDisabledByUser = true;
        const comp = this._getRandomPlay();
        if (comp) comp.enabled = false;
    }

    /** 确保 petValue 可用：优先使用已绑定的，再通过场景路径 Canvas/pet_value 兜底查找 */
    protected _ensurePetValue(): PetValue | null {
        // 已有引用且已经绑定了任一 Label，则直接用它
        if (this.petValue && (this.petValue.hpLabel || this.petValue.intimacyLabel)) {
            return this.petValue;
        }
        // 兜底：按当前场景结构，通过路径查找 Canvas/pet_value 上的 PetValue
        const n = find('Canvas/pet_value');
        const comp = n ? n.getComponent(PetValue) : null;
        if (comp) {
            this.petValue = comp;
        } else if (!this.petValue) {
            // 最后再退回到全局查找一次，避免场景结构变更时找不到
            this.petValue = director.getScene()?.getComponentInChildren(PetValue) || null;
        }
        return this.petValue;
    }

    /** 点摸宠物：心情 +2，可连续点；长按仍走语音 */
    public onBtn0Click() {
        if (!this.node.active) return;
        if (SwipeState.ignoreNextBtn0Click) return;
        this._disableRandomAniAfterUserInteraction();
        const pv = this._ensurePetValue();
        if (pv) {
            pv.applyBtn0(this.node);
        }
        const cur = this._syncCurrentClip();
        const s = cur.slice(this.prefix.length);
        if (s === '03') {
            PetInfoBar.instance?.refreshSleepBubble(false);
        }
        let seq: string[] = [];
        if (s === '01' || s === '04') seq = [this.clip('06'), this.clip('01')];
        else if (s === '02' || s === '05' || s === '14') seq = [this.clip('07'), this.clip('01')];
        else if (s === '03') seq = [this.clip('08'), this.clip('01')];
        else seq = [this.clip('01')];
        this.playSequence(seq);
    }

    /** 已移除滑动抚摸 */
    public onBtn0Swipe(_petNode?: Node) {
        // no-op
    }

    public onBtn1Click() {
        if (!this.node.active) return;
        this._disableRandomAniAfterUserInteraction();
        this._ensurePetValue();
        const now = Date.now();
        if (now < this._btn1IgnoreUntil) { this._btn1IgnoreUntil = 0; return; }
        if (SharedBtnCounts.btn1 < 1) { this._gotoAdScene(1); return; }
        SharedBtnCounts.btn1--;
        SharedBtnCounts.save();
        this._updateCountLabels();
        // 数值：Button1 体力 +20、亲密 +5（具体数值变更逻辑交给 PetValue，内部已处理上限 100）
        const pv1 = this._ensurePetValue();
        if (pv1) {
            pv1.applyBtn1(this.node);
            this._hideInfoBarTemporarily();
        }
        const cur = this._syncCurrentClip();
        const s = cur.slice(this.prefix.length);
        let seq: string[] = [];
        if (s === '14') seq = [this.clip('07'), this.clip('09'), this.clip('01')];
        else if (s === '03') seq = [this.clip('08'), this.clip('09'), this.clip('01')];
        else seq = [this.clip('09'), this.clip('01')];
        this.playSequence(seq);
    }

    public onBtn2Click() {
        if (!this.node.active) return;
        this._disableRandomAniAfterUserInteraction();
        this._ensurePetValue();
        const now = Date.now();
        if (now < this._btn2IgnoreUntil) { this._btn2IgnoreUntil = 0; return; }
        if (SharedBtnCounts.btn2 < 1) { this._gotoAdScene(2); return; }
        SharedBtnCounts.btn2--;
        SharedBtnCounts.save();
        this._updateCountLabels();
        // 数值：Button2 亲密 +20（具体数值变更逻辑交给 PetValue，内部已处理上限 100）
        const pv2 = this._ensurePetValue();
        if (pv2) {
            pv2.applyBtn2(this.node);
            this._hideInfoBarTemporarily();
        }
        const cur = this._syncCurrentClip();
        const s = cur.slice(this.prefix.length);
        let seq: string[] = [];
        if (s === '14') seq = [this.clip('07'), this.clip('10'), this.clip('01')];
        else if (s === '03') seq = [this.clip('08'), this.clip('10'), this.clip('01')];
        else seq = [this.clip('10'), this.clip('01')];
        this.playSequence(seq);
    }

    public onBtn3Click() {
        if (!this.node.active) return;
        this._disableRandomAniAfterUserInteraction();
        this._ensurePetValue();
        const now = Date.now();
        if (now < this._btn3IgnoreUntil) { this._btn3IgnoreUntil = 0; return; }
        if (SharedBtnCounts.btn3 < 1) { this._gotoAdScene(3); return; }
        SharedBtnCounts.btn3--;
        SharedBtnCounts.save();
        this._updateCountLabels();
        // 数值：Button3 亲密 +20（具体数值变更逻辑交给 PetValue，内部已处理上限 100）
        const pv3 = this._ensurePetValue();
        if (pv3) {
            pv3.applyBtn3(this.node);
            this._hideInfoBarTemporarily();
        }
        const cur = this._syncCurrentClip();
        const s = cur.slice(this.prefix.length);
        let seq: string[] = [];
        if (s === '14') seq = [this.clip('07'), this.clip('11'), this.clip('01')];
        else if (s === '03') seq = [this.clip('08'), this.clip('11'), this.clip('01')];
        else seq = [this.clip('11'), this.clip('01')];
        this.playSequence(seq);
    }

    public playSwipe12Sequence() {
        if (this.isPlayingSequence) return;
        this._disableRandomAniAfterUserInteraction();
        this.playSequence([this.clip('12'), this.clip('01')]);
    }

    public playMicroRecordStart() {
        if (!this.node.active) return;
        this._disableRandomAniAfterUserInteraction();
        this.playSequence([this.clip('15'), this.clip('01')]);
    }

    public playMicroRecordSent() {
        if (!this.node.active) return;
        this._disableRandomAniAfterUserInteraction();
        this.playSequence([this.clip('15'), this.clip('01')]);
    }

    public playMicroThinking() {
        if (!this.node.active) return;
        this._disableRandomAniAfterUserInteraction();
        this.playSequence([this.clip('15'), this.clip('01')]);
    }

    public playMicroTalking() {
        if (!this.node.active) return;
        this._disableRandomAniAfterUserInteraction();
        // 15 is the cute "listening/responding" clip. 16 feels too much like "talking", 17 is blank in this project.
        this.playSequence([this.clip('15'), this.clip('01')]);
    }

    /** 若当前在“睡觉/夜间”动画（03），先播专用醒来（04）再回到待机（01）；否则退化为 thinking。 */
    public wakeUpFromSleep() {
        if (!this.node.active) return;
        this._disableRandomAniAfterUserInteraction();
        const cur = this._syncCurrentClip();
        const s = cur.slice(this.prefix.length);
        if (s === '03') {
            PetInfoBar.instance?.refreshSleepBubble(false);
            // Sleep -> wake: 08 (sit up) then 04 (look around)
            this.playSequence([this.clip('08'), this.clip('04'), this.clip('01')]);
        } else {
            this.playMicroThinking();
        }
    }

    /** 若在睡觉（03），先醒来（04）再进入 talking（16）；否则直接 talking。 */
    public wakeToTalking() {
        if (!this.node.active) return;
        this._disableRandomAniAfterUserInteraction();
        const cur = this._syncCurrentClip();
        const s = cur.slice(this.prefix.length);
        if (s === '03') {
            PetInfoBar.instance?.refreshSleepBubble(false);
            // Sleep -> wake (08->04) -> respond (15)
            this.playSequence([this.clip('08'), this.clip('04'), this.clip('15'), this.clip('01')]);
        } else {
            this.playMicroTalking();
        }
    }
}


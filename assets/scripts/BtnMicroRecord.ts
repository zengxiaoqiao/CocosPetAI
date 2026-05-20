import { _decorator, Component, Node, Label, Button, EventTouch, Vec3, sys, native, UIOpacity, Sprite, Color, tween, Tween } from 'cc';
import { PetValue } from './PetValue';
import { AudioManager } from './AudioManager';
import { DogController } from './DogController';
import { CatController } from './CatController';
import { TokitChatService } from './llm_v2/TokitChatService';
import { AIChatDemo } from './AIchatDemo';
import { NativeASR } from './NativeASR';
import { PetInfoBar } from './PetInfoBar';
import { PetVocalizer } from './PetVocalizer';
import { PetWake } from './PetWake';
import { MicWaveform } from './MicWaveform';
import type { MicHintMode } from './BtnMicroRandomText';
const { ccclass, property } = _decorator;

const STORAGE_KEY_PET = 'petai_pet_choice';

/** 麦克风按钮的 5 个状态 */
export enum MicroState {
    /** 1. 准备阶段：进游戏默认显示 ready 节点 */
    Ready = 'ready',
    /** 2. 长按录音：按住按钮用麦克风输入语音 */
    Recording = 'recording',
    /** 4. 等待回复：狗狗在 thinking */
    Thinking = 'thinking',
}

/**
 * 麦克风按钮：3 个状态（ready → recording → thinking）。
 * 长按录音，松开发送。麦克风可用性不再依赖体力/心情数值。
 * 说明：不再朗读文字（避免“宠物说人话”），收到回复只做拟声 + 动作，并在 info bar 显示文字。
 */
@ccclass('BtnMicroRecord')
export class BtnMicroRecord extends Component {

    public static instance: BtnMicroRecord | null = null;

    @property(Label)
    resultLabel: Label | null = null;

    @property(PetValue)
    petValue: PetValue | null = null;

    @property(Button)
    button: Button | null = null;

    @property(Node)
    iconNode: Node | null = null;

    @property({ type: Node, tooltip: '1. 准备阶段节点，进游戏默认显示' })
    readyNode: Node | null = null;

    @property({ type: Node, tooltip: '2. 录音中节点，长按时显示' })
    recordingNode: Node | null = null;

    @property({ type: Node, tooltip: '4. 等待回复节点，狗狗 thinking' })
    thinkingNode: Node | null = null;

    @property({ type: Node, tooltip: '5. 播放语音节点，狗狗 talking' })
    talkingNode: Node | null = null;

    @property({ type: Node, tooltip: 'thinking/talking 内的停止按钮，可绑定或自动按名 stop/btn_stop 查找' })
    stopButtonNode: Node | null = null;

    @property({ type: Node, tooltip: '麦克风按钮容器（兼容旧字段）' })
    btnMicro: Node | null = null;

    @property({ type: Node, tooltip: '录音中节点（兼容旧字段，优先用 recordingNode）' })
    btnRecording: Node | null = null;

    @property(Node)
    sentStateNode: Node | null = null;

    @property({ type: Node, tooltip: '松开后显示的“已发送”节点' })
    sentNode: Node | null = null;

    @property
    chatUrl: string = '';

    @property({ tooltip: '点击时节点缩放倍数' })
    clickScale: number = 1.1;

    @property({ tooltip: '按下超过此秒数视为长按录音' })
    longPressThreshold: number = 0.35;

    @property({ tooltip: '按钮下方状态文案（同节点上的 BtnMicroRandomText）' })
    microHint: { setMicHint(mode: MicHintMode): void } | null = null;

    @property({ tooltip: '录音中按钮缩放脉冲幅度（相对按下后基准）' })
    recordingPulseScale: number = 0.06;

    @property({ tooltip: '自动收音（免按键）：检测到开口自动开始录音，静音后自动结束并发送' })
    autoVoice: boolean = false;

    @property({ tooltip: '自动收音：进入页面后自动申请麦克风并开始监听（前台）' })
    autoVoiceAutoStart: boolean = true;

    @property({ tooltip: '失效时按钮透明度（0-255）' })
    disabledOpacity: number = 130;

    @property(DogController)
    dogController: DogController | null = null;

    @property(CatController)
    catController: CatController | null = null;

    @property({ type: AIChatDemo, tooltip: '可选：绑定后麦克风语音走同一 AI' })
    aiChatDemo: AIChatDemo | null = null;

    @property({ tooltip: 'API 密钥，不填则用 AIChatDemo 里配置的' })
    apiKey: string = '';

    private _state: MicroState = MicroState.Ready;
    private _isRecording: boolean = false;
    private _wasRecordingThisTouch: boolean = false;
    private readonly _normalScale = new Vec3(1, 1, 1);
    private readonly _clickScaleVec = new Vec3(1.1, 1.1, 1.1);
    private _longPressScheduled: boolean = false;
    private _pressStartMs: number = 0;
    private _stoppedByUser: boolean = false;
    private _allStopButtons: Node[] = [];

    private _autoStarted: boolean = false;
    private _nativeAsrPolling: boolean = false;
    /** 手动长按录音是否使用 NativeASR（真机原生环境优先） */
    private _usingNativeAsrManual: boolean = false;
    private _nativeAsrManualRetriesLeft: number = 0;
    private _nativeAsrManualTrySeconds: number = 0;
    /** 松手后多次 poll 中取最长文本，避免抢先消耗局部识别结果 */
    private _nativeAsrManualBestText: string = '';
    /** 连续若干次 poll 未拿到更长文本（通常为空），用于判定识别已收尾 */
    private _nativeAsrManualIdlePolls: number = 0;
    private _nativeAsrManualStopMs: number = 0;
    private _isPressing: boolean = false;
    private _bgSprite: Sprite | null = null;
    private readonly _bgColorReady = new Color(255, 255, 255, 255);
    private readonly _bgColorPressing = new Color(255, 210, 190, 255);
    private readonly _bgColorRecording = new Color(255, 120, 130, 255);
    private readonly _recordingBaseScale = new Vec3(1.06, 1.06, 1);
    private _waveform: MicWaveform | null = null;
    /** 当前按住来源：麦克风按钮 / 宠物，避免双入口互相抢状态 */
    private _activeTouchSource: 'button' | 'pet' | null = null;

    onLoad() {
        BtnMicroRecord.instance = this;
        this._clickScaleVec.x = this._clickScaleVec.y = this._clickScaleVec.z = this.clickScale;
        if (!this.btnMicro) this.btnMicro = this.node;
        if (this.apiKey) TokitChatService.apiKey = this.apiKey;
        this.node.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        const btn = this.button || this.node.getComponent(Button);
        if (btn) this.node.on(Button.EventType.CLICK, this.onMicroButtonClick, this);
        this._ensureNodes();
        this._ensureMicroHint();
        this._ensureWaveform();
        this._bgSprite = (this.btnMicro || this.node).getComponent(Sprite);
        this._applyState(MicroState.Ready);
    }

    onDestroy() {
        if (BtnMicroRecord.instance === this) BtnMicroRecord.instance = null;
        this._stopAutoVoice();
        this.unschedule(this._enterRecordingMode);
        this.node.off(Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        this.node.off(Button.EventType.CLICK, this.onMicroButtonClick, this);
    }

    start() {
        this._applyState(MicroState.Ready);
        if (this.autoVoice && this.autoVoiceAutoStart) this._startAutoVoice();
    }

    onDisable() {
        this._stopAutoVoice();
    }

    private _ensureMicroHint(): { setMicHint(mode: MicHintMode): void } | null {
        if (this.microHint) return this.microHint;
        const comp = this.node.getComponent('BtnMicroRandomText')
            || (this.btnMicro || this.node).getComponent('BtnMicroRandomText');
        this.microHint = comp as { setMicHint(mode: MicHintMode): void } | null;
        return this.microHint;
    }

    /** 在 recording 节点下挂载/查找动态波形（替代 record-img 贴图） */
    private _ensureWaveform(): MicWaveform | null {
        if (this._waveform?.isValid) return this._waveform;
        if (!this.recordingNode) return null;

        let n = this.recordingNode.getChildByName('mic_waveform');
        if (!n) {
            n = new Node('mic_waveform');
            this.recordingNode.addChild(n);
        }
        this._waveform = n.getComponent(MicWaveform) || n.addComponent(MicWaveform);
        n.active = false;
        return this._waveform;
    }

    private _syncWaveform(on: boolean, subdued = false) {
        const wf = this._ensureWaveform();
        if (!wf) return;
        wf.setAnimating(on, subdued);
    }

    /** 兜底查找 ready/recording/thinking/talking 节点 */
    private _ensureNodes() {
        const root = this.btnMicro || this.node;
        if (!this.readyNode) this.readyNode = root.getChildByName('ready') || null;
        if (!this.recordingNode) this.recordingNode = this.btnRecording || root.getChildByName('recording') || null;
        if (!this.thinkingNode) this.thinkingNode = root.getChildByName('thinking') || null;
        if (!this.talkingNode) this.talkingNode = root.getChildByName('talking') || null;
        if (!this.iconNode && this.readyNode) this.iconNode = this.readyNode.getChildByName('Sprite') || this.readyNode.children[0] || null;
        // Stop button is no longer needed; keep field for scene compatibility but do not auto-find/bind.
    }

    private _applyStopButtonsVisibility(visible: boolean) {
        for (const n of this._allStopButtons) {
            if (n?.isValid) n.active = visible;
        }
    }

    private _applyState(state: MicroState) {
        this._state = state;
        const root = this.btnMicro || this.node;
        const isPressingOnly = this._isPressing && state === MicroState.Ready;

        if (this.readyNode) this.readyNode.active = state === MicroState.Ready && !isPressingOnly;
        if (this.recordingNode) {
            this.recordingNode.active = state === MicroState.Recording || isPressingOnly;
        }
        if (this.thinkingNode) this.thinkingNode.active = state === MicroState.Thinking;
        // talkingNode is kept for scene compatibility but no longer used.
        if (this.talkingNode) this.talkingNode.active = false;
        // sentNode/sentStateNode visibility is managed by _showSentBriefly()
        if (this.iconNode) this.iconNode.active = state === MicroState.Ready && !isPressingOnly;
        const showStop = false;
        if (this.stopButtonNode) this.stopButtonNode.active = false;
        this._applyStopButtonsVisibility(showStop);

        const btn = this.button || this.node.getComponent(Button);
        if (btn) btn.interactable = state === MicroState.Ready || state === MicroState.Recording;

        this._applyDisabledOpacity(root, false);
        this._applyRecordingNodeOpacity(isPressingOnly ? 200 : 255);

        const showWave = state === MicroState.Recording || isPressingOnly;
        this._syncWaveform(showWave, isPressingOnly);

        if (state === MicroState.Recording) {
            this._startRecordingVisuals(root);
            this._ensureMicroHint()?.setMicHint('recording');
        } else if (state === MicroState.Thinking) {
            this._stopRecordingVisuals(root);
            root.setScale(this._normalScale);
            this._setBgColor(this._bgColorReady);
            this._ensureMicroHint()?.setMicHint('thinking');
        } else if (isPressingOnly) {
            this._stopRecordingPulseOnly();
            root.setScale(this._recordingBaseScale);
            this._setBgColor(this._bgColorPressing);
            this._ensureMicroHint()?.setMicHint('pressing');
        } else {
            this._stopRecordingVisuals(root);
            root.setScale(this._normalScale);
            this._setBgColor(this._bgColorReady);
            this._ensureMicroHint()?.setMicHint('idle');
        }

        // 录音 / 思考 / 播报期间降低背景音乐音量，结束后恢复
        if (state === MicroState.Recording || state === MicroState.Thinking) {
            AudioManager.enterVoicePriority();
        } else if (state === MicroState.Ready && !isPressingOnly) {
            AudioManager.exitVoicePriority();
        }
    }

    private _setBgColor(c: Color) {
        if (!this._bgSprite) return;
        this._bgSprite.color = c;
    }

    private _applyRecordingNodeOpacity(opacity: number) {
        if (!this.recordingNode) return;
        let op = this.recordingNode.getComponent(UIOpacity);
        if (!op) op = this.recordingNode.addComponent(UIOpacity);
        op.opacity = opacity;
    }

    private _startRecordingVisuals(root: Node) {
        Tween.stopAllByTarget(root);
        root.setScale(this._recordingBaseScale);
        this._setBgColor(this._bgColorRecording);
        const pulse = Math.max(0.02, this.recordingPulseScale);
        const up = new Vec3(
            this._recordingBaseScale.x * (1 + pulse),
            this._recordingBaseScale.y * (1 + pulse),
            1,
        );
        tween(root)
            .to(0.45, { scale: up }, { easing: 'sineInOut' })
            .to(0.45, { scale: this._recordingBaseScale.clone() }, { easing: 'sineInOut' })
            .union()
            .repeatForever()
            .start();
    }

    private _stopRecordingPulseOnly() {
        const root = this.btnMicro || this.node;
        Tween.stopAllByTarget(root);
    }

    private _stopRecordingVisuals(root: Node) {
        Tween.stopAllByTarget(root);
        this._syncWaveform(false);
        this._applyRecordingNodeOpacity(255);
    }

    private _enterPressingFeedback() {
        if (this._state !== MicroState.Ready || this._isPressing) return;
        this._isPressing = true;
        this._applyState(MicroState.Ready);
    }

    private _exitPressingFeedback() {
        if (!this._isPressing) return;
        this._isPressing = false;
        if (this._state === MicroState.Ready) {
            this._applyState(MicroState.Ready);
        }
    }

    private _applyDisabledOpacity(target: Node, disabled: boolean) {
        let opacity = target.getComponent(UIOpacity);
        if (!opacity) opacity = target.addComponent(UIOpacity);
        opacity.opacity = disabled ? this.disabledOpacity : 255;
    }

    private _onTouchStart(_e?: EventTouch) {
        this._beginManualTouch('button');
    }

    /** 长按宠物开始（与麦克风按钮共用录音逻辑） */
    public onPetTouchStart(): void {
        this._beginManualTouch('pet');
    }

    private _beginManualTouch(source: 'button' | 'pet') {
        if (this.autoVoice) return;
        if (this._state !== MicroState.Ready) return;
        if (this._activeTouchSource && this._activeTouchSource !== source) return;
        this._activeTouchSource = source;
        this._wasRecordingThisTouch = false;
        this._stoppedByUser = false;
        this._isRecording = false;
        this._pressStartMs = Date.now();
        this._longPressScheduled = true;
        if (source === 'button') {
            this._enterPressingFeedback();
        }
        this.scheduleOnce(this._enterRecordingMode, this.longPressThreshold);
    }

    private _enterRecordingMode() {
        this._longPressScheduled = false;
        this._isPressing = false;
        this._isRecording = true;
        this._wasRecordingThisTouch = true;
        this._applyState(MicroState.Recording);
        this._playRecordStartSound();
        this._startRecording();
    }

    /** 供 Button 的 Click 事件绑定：仅点击时触发。未授权时在此请求麦克风权限。 */
    public onMicroButtonClick() {
        if (this.autoVoice) return;
        if (this._wasRecordingThisTouch) return;
        AudioManager.instance?.playClickSound();
        if (!sys.isNative) this.showHint('仅真机支持语音');
    }

    private _playRecordStartSound() {
        const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
        if (isCat) {
            AudioManager.playAnimSoundCat15();
            this.catController?.playMicroRecordStart();
        } else {
            AudioManager.playAnimSoundDog15();
            this.dogController?.playMicroRecordStart();
        }
    }

    private _playRecordSentSound() {
        const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
        if (isCat) {
            AudioManager.playAnimSoundCat15();
            this.catController?.playMicroRecordSent();
        } else {
            AudioManager.playAnimSoundDog15();
            this.dogController?.playMicroRecordSent();
        }
    }

    private _playThinkingSound() {
        const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
        if (isCat) {
            AudioManager.playAnimSoundCat15();
            this.catController?.playMicroThinking();
        } else {
            AudioManager.playAnimSoundDog15();
            this.dogController?.playMicroThinking();
        }
    }

    private _playTalkingSound() {
        const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
        if (isCat) {
            AudioManager.playAnimSoundCat17();
            this.catController?.playMicroTalking();
        } else {
            AudioManager.playAnimSoundDog17();
            this.dogController?.playMicroTalking();
        }
    }

    private _onTouchEnd() {
        this._finishManualTouch('button');
    }

    public onPetTouchEnd(): void {
        this._finishManualTouch('pet');
    }

    /** 手指滑动取消长按（仅宠物入口） */
    public onPetTouchCancel(): void {
        if (this._activeTouchSource !== 'pet') return;
        this._finishManualTouch('pet');
    }

    /**
     * 短按宠物（未进入录音）：清理触摸状态并返回 true，由 PetController 执行点摸 +心情。
     */
    public consumePetShortTap(): boolean {
        if (this._activeTouchSource !== 'pet') return false;
        if (this._isRecording || this._wasRecordingThisTouch) {
            return false;
        }
        if (this._longPressScheduled) {
            this.unschedule(this._enterRecordingMode);
            this._longPressScheduled = false;
        }
        this._activeTouchSource = null;
        return true;
    }

    private _finishManualTouch(source: 'button' | 'pet') {
        if (this.autoVoice) return;
        if (this._activeTouchSource !== source) return;
        this._activeTouchSource = null;

        if (this._longPressScheduled) {
            this.unschedule(this._enterRecordingMode);
            this._longPressScheduled = false;
            if (source === 'button') this._exitPressingFeedback();
            return;
        }
        if (!this._isRecording) {
            if (source === 'button') this._exitPressingFeedback();
            return;
        }
        this._isRecording = false;
        this._stopRecordingAndSend();
    }

    /** 开始录音（仅 NativeASR；已移除 Web 收音链路） */
    private _startRecording() {
        if (!NativeASR.isSupported()) {
            this._usingNativeAsrManual = false;
            this._handleNotSent('仅真机支持语音');
            return;
        }
        this._usingNativeAsrManual = true;
        // Android: request mic permission if needed (best-effort).
        if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
            try {
                const nat = (native as any);
                if (nat?.reflection?.callStaticMethod) {
                    nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'requestRecordAudioPermissionIfNeeded', '()V');
                }
            } catch { /* ignore */ }
        }
        try { NativeASR.startOnce(); } catch { /* ignore */ }
    }

    /** 停止录音（不发送） */
    private _stopRecording() {
        if (this._usingNativeAsrManual && NativeASR.isSupported()) {
            this._usingNativeAsrManual = false;
            try { NativeASR.stop(); } catch { /* ignore */ }
        }
    }

    /** 停止录音并发送 */
    private _stopRecordingAndSend() {
        if (this._usingNativeAsrManual && NativeASR.isSupported()) {
            this._usingNativeAsrManual = false;
            try { NativeASR.stopOnce(); } catch { /* ignore */ }
            // Immediate UX feedback: user released, we are processing (even if ASR final text arrives slightly later).
            this._applyState(MicroState.Thinking);
            this._playThinkingSound();
            PetWake.nudgeAwake();
            PetInfoBar.instance?.showUserHint('我想想…', 2);
            // Native ASR: stopOnce 在 Android 上走 UI 线程队列，若立刻 poll 会先读到较早的局部结果。
            // 延后首轮轮询，并在整个窗口内保留「更长」的文本，稳定后再发送。
            this._nativeAsrManualBestText = '';
            this._nativeAsrManualIdlePolls = 0;
            this._nativeAsrManualStopMs = Date.now();
            this._nativeAsrManualRetriesLeft = 28; // ~4.2s total（首轮另有延迟）
            this._nativeAsrManualTrySeconds = 0;
            this.scheduleOnce(() => this._pollNativeAsrManualOnce(), 0.12);
            return;
        }
        this._handleNotSent('仅真机支持语音');
    }

    private _pollNativeAsrManualOnce() {
        let t = '';
        try { t = (NativeASR.pollResult() || '').trim(); } catch { t = ''; }
        if (t.length > this._nativeAsrManualBestText.length) {
            this._nativeAsrManualBestText = t;
            this._nativeAsrManualIdlePolls = 0;
        } else if (!t) {
            this._nativeAsrManualIdlePolls++;
        }

        const elapsed = Date.now() - this._nativeAsrManualStopMs;
        const canFinalize =
            this._nativeAsrManualBestText.length > 0 &&
            this._nativeAsrManualIdlePolls >= 4 &&
            elapsed >= 500;
        if (canFinalize) {
            this._beginSendWithText(this._nativeAsrManualBestText);
            return;
        }

        // If Android recognizer is erroring, stop waiting and show a concrete hint.
        if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
            const dbg = (NativeASR.pollDebug() || '').trim();
            if (dbg) {
                const parts = dbg.split(',');
                const err = parts.length >= 2 ? parseInt(parts[1], 10) : 0;
                if (err) {
                    let msg = `识别失败（${err}）`;
                    // Common SpeechRecognizer errors:
                    // 2: ERROR_AUDIO, 7: ERROR_NO_MATCH, 8: ERROR_RECOGNIZER_BUSY, 9: ERROR_INSUFFICIENT_PERMISSIONS
                    if (err === 2) msg = '麦克风音频错误（可能被占用）';
                    else if (err === 7) msg = '没听清（没有匹配）';
                    else if (err === 8) msg = '识别繁忙，稍后再试';
                    else if (err === 9) msg = '没有麦克风权限';
                    PetInfoBar.instance?.showUserHint(msg, 2);
                    this._handleNotSent(msg);
                    return;
                }
            }
        }
        this._nativeAsrManualRetriesLeft = Math.max(0, this._nativeAsrManualRetriesLeft - 1);
        if (this._nativeAsrManualRetriesLeft <= 0) {
            if (this._nativeAsrManualBestText.length > 0) {
                this._beginSendWithText(this._nativeAsrManualBestText);
            } else {
                PetInfoBar.instance?.showUserHint('唔…没听清', 2);
                this._handleNotSent('唔…没听清');
            }
            return;
        }
        this.scheduleOnce(() => this._pollNativeAsrManualOnce(), 0.15);
    }

    /** 短暂显示“已发送” */
    private _showSentBriefly() {
        const sent = this.sentNode || this.sentStateNode;
        if (sent && this.btnMicro) {
            if (sent.parent !== this.btnMicro) this.btnMicro.addChild(sent);
            sent.active = true;
            this.scheduleOnce(() => {
                if (sent?.isValid) sent.active = false;
            }, 1);
        }
        if (this.resultLabel) this.resultLabel.string = '已发送';
    }

    private _beginSendWithText(text: string) {
        const t = (text || '').trim();
        if (!t) {
            this._handleNotSent('唔…没听清');
            return;
        }
        this._playRecordSentSound();
        this._showSentBriefly();
        this._applyState(MicroState.Thinking);
        this._playThinkingSound();
        PetWake.nudgeAwake();
        this._sendToAI(t);
    }

    private _handleNotSent(hint: string) {
        // Show a short hint and return to ready.
        this._applyState(MicroState.Ready);
        this.showHint(hint);
        // Auto voice: resume listening if enabled.
        if (this.autoVoice && this.autoVoiceAutoStart && this._autoStarted && NativeASR.isSupported()) {
            this._startNativeAsrLoop();
        }
    }

    /** 发送文本到 AI：强制只走 TokitChatService */
    private async _sendToAI(text: string) {
        try {
            const withTimeout = async <T>(p: Promise<T>, ms: number): Promise<T> => {
                return await Promise.race([
                    p,
                    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
                ]) as T;
            };
            const reply = await withTimeout(TokitChatService.sendMessage(text), 60000);
            if (this._stoppedByUser) return;
            this._playVocalAndFinish(reply);
        } catch (e) {
            if (this._stoppedByUser) return;
            console.warn('[BtnMicroRecord] AI chat failed', e);
            const msg = (e instanceof Error && e.message === 'timeout') ? '没收到回复' : '呜…没发出';
            this._handleNotSent(msg);
        }
    }

    // _mockFlow removed: we don't show local preset replies anymore.

    /** 收到回复：不朗读文字，只做拟声 + 动作，并在 info bar 显示文字 */
    private _getActivePetNode(): Node | null {
        const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
        if (isCat) return this.catController?.node ?? null;
        return this.dogController?.node ?? null;
    }

    private _playVocalAndFinish(text: string) {
        if (this._stoppedByUser) return;
        const t = (text || '').trim();
        if (t) {
            const pv = this.petValue || PetValue.instance;
            pv?.applyVoiceChat(this._getActivePetNode() ?? undefined);
            PetInfoBar.instance?.showUserHint(t, 6);
            PetWake.wakeToRespond();
            PetVocalizer.playReplyVocal(t);
        }
        // Slight delay so user can perceive response state/sound.
        this.scheduleOnce(() => this._finishTalking(''), 0.8);
    }

    private _finishTalking(_reply: string) {
        this._applyState(MicroState.Ready);
        if (this.resultLabel) this.resultLabel.string = '';
        // Auto voice: after speaking, resume listening.
        if (this.autoVoice && this.autoVoiceAutoStart && this._autoStarted && NativeASR.isSupported()) {
            this._startNativeAsrLoop();
        }
    }

    /** 显示统一提示文本（2 秒后自动清空），供外部也可调用 */
    public showHint(text: string) {
        if (this.resultLabel) {
            this.resultLabel.string = text;
            this.scheduleOnce(() => {
                if (this.resultLabel?.node.isValid) this.resultLabel.string = '';
            }, 2);
        }
    }

    /** 当前状态（供外部查询） */
    public get state(): MicroState { return this._state; }

    /** 停止当前发送/思考/讲话，回到 ready 状态（供 thinking/talking 内停止按钮调用） */
    public stopAndBackToReady() {
        if (this._state !== MicroState.Thinking && this._state !== MicroState.Recording) return;
        try {
            this._stoppedByUser = true;
            this.unschedule(this._pollNativeAsrResult);
            this.unschedule(this._mockFlow);
            this._stopRecording();
            this.dogController?.playIdle();
            this.catController?.playIdle();
            this._applyState(MicroState.Ready);
            if (this.resultLabel) this.resultLabel.string = '';
        } catch (e) {
            console.warn('[BtnMicroRecord] stopAndBackToReady error:', e);
        }
    }

    private async _startAutoVoice() {
        if (this._autoStarted) return;
        if (!this.autoVoice) return;

        if (!NativeASR.isSupported()) {
            // Web auto-voice removed.
            this.showHint('仅真机支持语音');
            return;
        }
        this._autoStarted = true;
        this._startNativeAsrLoop();
    }

    private _stopAutoVoice() {
        if (!this._autoStarted) return;
        this._autoStarted = false;
        this._stopNativeAsrLoop();
        // 如果正在录音，直接走发送（避免用户说到一半退出页面丢失）
        if (this._state === MicroState.Recording && this._isRecording) {
            this._isRecording = false;
            this._stopRecordingAndSend();
        }
    }

    private _startNativeAsrLoop() {
        if (this._nativeAsrPolling) return;
        this._nativeAsrPolling = true;
        this._stoppedByUser = false;
        NativeASR.start();

        // Show "listening" state
        if (this._state === MicroState.Ready) {
            this._applyState(MicroState.Recording);
            this._playRecordStartSound();
        }

        this.schedule(this._pollNativeAsrResult, 0.2, Infinity);
    }

    private _stopNativeAsrLoop() {
        if (!this._nativeAsrPolling) return;
        this._nativeAsrPolling = false;
        this.unschedule(this._pollNativeAsrResult);
        NativeASR.stop();
        if (this._state === MicroState.Recording) {
            this._applyState(MicroState.Ready);
        }
    }

    private _pollNativeAsrResult() {
        if (!this.autoVoice || !this._autoStarted || !this._nativeAsrPolling) return;
        if (this._state === MicroState.Thinking || this._state === MicroState.Talking || this._stoppedByUser) return;

        const text = (NativeASR.pollResult() || '').trim();
        if (!text) return;

        // Got transcript -> send to AI.
        this._stopNativeAsrLoop();

        this._playRecordSentSound();
        this._showSentBriefly();
        this._applyState(MicroState.Thinking);
        this._playThinkingSound();
        this._sendToAI(text);
    }

    // Web VAD removed.
}

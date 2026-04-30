import { _decorator, Component, Node, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    /** 全局单例，供其他脚本静态访问 */
    public static instance: AudioManager | null = null;

    @property({ type: AudioClip, tooltip: '通用点击音效' })
    public clickAudioClip: AudioClip | null = null;

    @property({ type: AudioClip, tooltip: '背景音乐' })
    public bgmAudioClip: AudioClip | null = null;

    @property({ type: AudioClip, tooltip: '飘字飞抵主数值时的音效' })
    public valueIncreaseAudioClip: AudioClip | null = null;

    @property({ type: AudioClip, tooltip: 'Check-in 弹出时的音效' })
    public checkInShowAudioClip: AudioClip | null = null;

    // 每个狗动画对应的音效（可在 Inspector 里按需绑定）
    @property({ type: AudioClip, tooltip: '动画 dog01 专属音效' })
    public dog01Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog02 专属音效' })
    public dog02Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog03 专属音效' })
    public dog03Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog04 专属音效' })
    public dog04Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog05 专属音效' })
    public dog05Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog06 专属音效' })
    public dog06Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog07 专属音效' })
    public dog07Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog08 专属音效' })
    public dog08Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog09 专属音效' })
    public dog09Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog10 专属音效' })
    public dog10Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog11 专属音效' })
    public dog11Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog12 专属音效' })
    public dog12Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog13 专属音效' })
    public dog13Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog14 专属音效' })
    public dog14Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog15 专属音效' })
    public dog15Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog16 专属音效' })
    public dog16Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 dog17 专属音效' })
    public dog17Sound: AudioClip | null = null;

    // 每个猫动画对应的音效（可在 Inspector 里按需绑定）
    @property({ type: AudioClip, tooltip: '动画 cat01 专属音效' })
    public cat01Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat02 专属音效' })
    public cat02Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat03 专属音效' })
    public cat03Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat04 专属音效' })
    public cat04Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat05 专属音效' })
    public cat05Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat06 专属音效' })
    public cat06Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat07 专属音效' })
    public cat07Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat08 专属音效' })
    public cat08Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat09 专属音效' })
    public cat09Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat10 专属音效' })
    public cat10Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat11 专属音效' })
    public cat11Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat12 专属音效' })
    public cat12Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat13 专属音效' })
    public cat13Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat14 专属音效' })
    public cat14Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat15 专属音效' })
    public cat15Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat16 专属音效' })
    public cat16Sound: AudioClip | null = null;
    @property({ type: AudioClip, tooltip: '动画 cat17 专属音效' })
    public cat17Sound: AudioClip | null = null;

    // 是否静音，由 AudioControl 控制
    public isSoundMuted: boolean = false;

    private _bgmAudioSource: AudioSource | null = null;
    /** 记录正常播放时的 BGM 音量，用于语音时衰减/恢复 */
    private _bgmBaseVolume: number = 0.5;
    /** 当前是否处于“语音优先”模式（录音/播报时） */
    private _voicePriority: boolean = false;

    onLoad() {
        AudioManager.instance = this;

        // 确保有 AudioSource 用于播放 BGM / OneShot
        this._bgmAudioSource = this.node.getComponent(AudioSource);
        if (!this._bgmAudioSource) {
            this._bgmAudioSource = this.node.addComponent(AudioSource);
        }
        // 跨场景不销毁
        this.node.destroyOnLoad = false;
    }

    start() {
        if (this._bgmAudioSource) {
            this._bgmAudioSource.loop = true;
            this._bgmAudioSource.volume = this._bgmBaseVolume;
            if (!this.isSoundMuted && this.bgmAudioClip) {
                this._bgmAudioSource.clip = this.bgmAudioClip;
                this._bgmAudioSource.play();
            }
        }
    }

    /** 停止所有声音并进入静音状态，供 AudioControl 调用 */
    public stopAllSounds() {
        this.isSoundMuted = true;
        if (this._bgmAudioSource) {
            this._bgmAudioSource.stop();
        }
    }

    /** 解除静音状态并根据需要恢复背景音乐，供 AudioControl 调用 */
    public resumeSounds() {
        this.isSoundMuted = false;
        if (this._bgmAudioSource && this.bgmAudioClip) {
            this._bgmAudioSource.clip = this.bgmAudioClip;
            this._bgmAudioSource.loop = true;
            this._bgmAudioSource.volume = this._voicePriority ? this._bgmBaseVolume * 0.3 : this._bgmBaseVolume;
            if (!this._bgmAudioSource.playing) {
                this._bgmAudioSource.play();
            }
        }
    }

    /** 语音开始时调用：降低 BGM 音量，避免和语音抢占空间 */
    public static enterVoicePriority() {
        const inst = AudioManager.instance;
        if (!inst || !inst._bgmAudioSource) return;
        inst._voicePriority = true;
        inst._bgmAudioSource.volume = inst._bgmBaseVolume * 0.3; // 比正常音量更轻
    }

    /** 语音结束时调用：恢复正常 BGM 音量 */
    public static exitVoicePriority() {
        const inst = AudioManager.instance;
        if (!inst || !inst._bgmAudioSource) return;
        inst._voicePriority = false;
        inst._bgmAudioSource.volume = inst._bgmBaseVolume;
    }

    /** 播放点击音效 */
    public playClickSound() {
        if (this.isSoundMuted) return;
        if (!this.clickAudioClip || !this._bgmAudioSource) return;
        this._bgmAudioSource.playOneShot(this.clickAudioClip, 1.0);
    }

    /** Check-in 弹出时播放（可在 Inspector 绑定 checkInShowAudioClip） */
    public static playCheckInShowSound() {
        const inst = AudioManager.instance;
        if (inst && inst.checkInShowAudioClip && inst._bgmAudioSource && !inst.isSoundMuted) {
            inst._bgmAudioSource.playOneShot(inst.checkInShowAudioClip, 1.0);
        }
    }

    /** 飘字飞抵主数值时播放（可在 Inspector 绑定 valueIncreaseAudioClip） */
    public static playValueIncreaseSound() {
        const inst = AudioManager.instance;
        if (inst && inst.valueIncreaseAudioClip && inst._bgmAudioSource && !inst.isSoundMuted) {
            inst._bgmAudioSource.playOneShot(inst.valueIncreaseAudioClip, 1.0);
        }
    }

    /** 通用音效播放方法：使用 playOneShot 在现有 AudioSource 上播放 */
    public playSound(audioClip: AudioClip) {
        if (this.isSoundMuted) return;
        if (!audioClip) return;
        if (this._bgmAudioSource) {
            this._bgmAudioSource.playOneShot(audioClip, 1.0);
        } else {
            const audioNode = new Node(`TempAudio_${audioClip.name}`);
            const audioSource = audioNode.addComponent(AudioSource);
            audioSource.clip = audioClip;
            audioSource.loop = false;
            audioSource.volume = 1.0;
            audioSource.play();
            this.node.scene.addChild(audioNode);
        }
    }

    // ========== 兼容：原有动画帧事件调用 ==========

    /** 默认动画音效（无参老接口），这里简单使用点击音效代替，避免报错 */
    public static playAnimSound() {
        const inst = AudioManager.instance;
        if (inst && inst.clickAudioClip) {
            inst.playSound(inst.clickAudioClip);
        }
    }

    // 兼容所有 dogXX/catXX 帧事件：如有专属音效则播放，没有则静默（不再用点击音效兜底）
    public static playAnimSoundDog01() {
        const inst = AudioManager.instance;
        if (inst && inst.dog01Sound) inst.playSound(inst.dog01Sound);
    }
    public static playAnimSoundDog02() {
        const inst = AudioManager.instance;
        if (inst && inst.dog02Sound) inst.playSound(inst.dog02Sound);
    }
    public static playAnimSoundDog03() {
        const inst = AudioManager.instance;
        if (inst && inst.dog03Sound) inst.playSound(inst.dog03Sound);
    }
    public static playAnimSoundDog04() {
        const inst = AudioManager.instance;
        if (inst && inst.dog04Sound) inst.playSound(inst.dog04Sound);
    }
    public static playAnimSoundDog05() {
        const inst = AudioManager.instance;
        if (inst && inst.dog05Sound) inst.playSound(inst.dog05Sound);
    }
    public static playAnimSoundDog06() {
        const inst = AudioManager.instance;
        if (inst && inst.dog06Sound) inst.playSound(inst.dog06Sound);
    }
    public static playAnimSoundDog07() {
        const inst = AudioManager.instance;
        if (inst && inst.dog07Sound) inst.playSound(inst.dog07Sound);
    }
    public static playAnimSoundDog08() {
        const inst = AudioManager.instance;
        if (inst && inst.dog08Sound) inst.playSound(inst.dog08Sound);
    }
    public static playAnimSoundDog09() {
        const inst = AudioManager.instance;
        if (inst && inst.dog09Sound) inst.playSound(inst.dog09Sound);
    }
    public static playAnimSoundDog10() {
        const inst = AudioManager.instance;
        if (inst && inst.dog10Sound) inst.playSound(inst.dog10Sound);
    }
    public static playAnimSoundDog11() {
        const inst = AudioManager.instance;
        if (inst && inst.dog11Sound) inst.playSound(inst.dog11Sound);
    }
    public static playAnimSoundDog12() {
        const inst = AudioManager.instance;
        if (inst && inst.dog12Sound) inst.playSound(inst.dog12Sound);
    }
    public static playAnimSoundDog13() {
        const inst = AudioManager.instance;
        if (inst && inst.dog13Sound) inst.playSound(inst.dog13Sound);
    }
    public static playAnimSoundDog14() {
        const inst = AudioManager.instance;
        if (inst && inst.dog14Sound) inst.playSound(inst.dog14Sound);
    }
    public static playAnimSoundDog15() {
        const inst = AudioManager.instance;
        if (inst && inst.dog15Sound) inst.playSound(inst.dog15Sound);
    }
    public static playAnimSoundDog16() {
        const inst = AudioManager.instance;
        if (inst && inst.dog16Sound) inst.playSound(inst.dog16Sound);
    }
    public static playAnimSoundDog17() {
        const inst = AudioManager.instance;
        if (inst && inst.dog17Sound) inst.playSound(inst.dog17Sound);
    }

    public static playAnimSoundCat01() {
        const inst = AudioManager.instance;
        if (inst && inst.cat01Sound) inst.playSound(inst.cat01Sound);
    }
    public static playAnimSoundCat02() {
        const inst = AudioManager.instance;
        if (inst && inst.cat02Sound) inst.playSound(inst.cat02Sound);
    }
    public static playAnimSoundCat03() {
        const inst = AudioManager.instance;
        if (inst && inst.cat03Sound) inst.playSound(inst.cat03Sound);
    }
    public static playAnimSoundCat04() {
        const inst = AudioManager.instance;
        if (inst && inst.cat04Sound) inst.playSound(inst.cat04Sound);
    }
    public static playAnimSoundCat05() {
        const inst = AudioManager.instance;
        if (inst && inst.cat05Sound) inst.playSound(inst.cat05Sound);
    }
    public static playAnimSoundCat06() {
        const inst = AudioManager.instance;
        if (inst && inst.cat06Sound) inst.playSound(inst.cat06Sound);
    }
    public static playAnimSoundCat07() {
        const inst = AudioManager.instance;
        if (inst && inst.cat07Sound) inst.playSound(inst.cat07Sound);
    }
    public static playAnimSoundCat08() {
        const inst = AudioManager.instance;
        if (inst && inst.cat08Sound) inst.playSound(inst.cat08Sound);
    }
    public static playAnimSoundCat09() {
        const inst = AudioManager.instance;
        if (inst && inst.cat09Sound) inst.playSound(inst.cat09Sound);
    }
    public static playAnimSoundCat10() {
        const inst = AudioManager.instance;
        if (inst && inst.cat10Sound) inst.playSound(inst.cat10Sound);
    }
    public static playAnimSoundCat11() {
        const inst = AudioManager.instance;
        if (inst && inst.cat11Sound) inst.playSound(inst.cat11Sound);
    }
    public static playAnimSoundCat12() {
        const inst = AudioManager.instance;
        if (inst && inst.cat12Sound) inst.playSound(inst.cat12Sound);
    }
    public static playAnimSoundCat13() {
        const inst = AudioManager.instance;
        if (inst && inst.cat13Sound) inst.playSound(inst.cat13Sound);
    }
    public static playAnimSoundCat14() {
        const inst = AudioManager.instance;
        if (inst && inst.cat14Sound) inst.playSound(inst.cat14Sound);
    }
    public static playAnimSoundCat15() {
        const inst = AudioManager.instance;
        if (inst && inst.cat15Sound) inst.playSound(inst.cat15Sound);
    }
    public static playAnimSoundCat16() {
        const inst = AudioManager.instance;
        if (inst && inst.cat16Sound) inst.playSound(inst.cat16Sound);
    }
    public static playAnimSoundCat17() {
        const inst = AudioManager.instance;
        if (inst && inst.cat17Sound) inst.playSound(inst.cat17Sound);
    }
}


import { _decorator, Component, Node, find, director } from 'cc';
import { AudioManager } from './AudioManager';

const { ccclass, property } = _decorator;

/**
 * 音频控制脚本，供按钮调用停止/恢复声音。
 * 可绑定“停止声音”和“开启声音”两个按钮节点，只显示其中一个（一个开一个关）。
 */
@ccclass('AudioControl')
export class AudioControl extends Component {

    /** 停止声音按钮节点：点击后隐藏自身、显示开启声音按钮 */
    @property(Node)
    stopSoundButton: Node | null = null;

    /** 开启声音按钮节点：点击后隐藏自身、显示停止声音按钮 */
    @property(Node)
    resumeSoundButton: Node | null = null;

    start() {
        this._syncAudioButtonVisibility();
    }

    /**
     * 停止所有声音（含背景音乐），并进入静音状态；同时切换按钮显示（只显示“开启声音”）
     */
    public onStopAllSounds() {
        const am = AudioManager.instance || this.getAudioManagerFromScene();
        if (am) {
            // 兼容：老版本 AudioManager 可能还没有 stopAllSounds 方法
            const anyAm = am as any;
            if (typeof anyAm.stopAllSounds === 'function') {
                anyAm.stopAllSounds();
            } else {
                console.warn('[AudioControl] stopAllSounds 方法不存在，暂不做静音处理');
            }
        }
        this._syncAudioButtonVisibility();
    }

    /**
     * 解除静音；同时切换按钮显示（只显示“停止声音”）
     */
    public onResumeSounds() {
        const am = AudioManager.instance || this.getAudioManagerFromScene();
        if (am) {
            const anyAm = am as any;
            if (typeof anyAm.resumeSounds === 'function') {
                anyAm.resumeSounds();
            } else {
                console.warn('[AudioControl] resumeSounds 方法不存在，暂不恢复静音状态');
            }
        }
        this._syncAudioButtonVisibility();
    }

    /** 根据当前是否静音，只显示“停止声音”或只显示“开启声音” */
    private _syncAudioButtonVisibility() {
        const muted = AudioManager.instance ? AudioManager.instance.isSoundMuted : false;
        if (this.stopSoundButton) {
            this.stopSoundButton.active = !muted;
        }
        if (this.resumeSoundButton) {
            this.resumeSoundButton.active = muted;
        }
    }

    /** 从当前场景中查找 AudioManager 组件（单例不可用时使用） */
    private getAudioManagerFromScene(): AudioManager | null {
        const scene = director.getScene();
        if (scene) {
            const am = scene.getComponentInChildren(AudioManager);
            if (am) return am;
        }
        const fallback = find('AudioManager') || find('Canvas/AudioManager');
        return fallback ? fallback.getComponent(AudioManager) : null;
    }
}

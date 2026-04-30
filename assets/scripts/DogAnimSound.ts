import { _decorator, Component } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass } = _decorator;

/**
 * 挂在 dog 节点上，供动画帧事件调用，转发到 AudioManager 播放对应音效。
 * 帧事件绑定的方法名：playDog01Sound、playDog06Sound 等
 */
@ccclass('DogAnimSound')
export class DogAnimSound extends Component {

    public playDog01Sound() { AudioManager.playAnimSoundDog01(); }
    public playDog02Sound() { AudioManager.playAnimSoundDog02(); }
    public playDog03Sound() { AudioManager.playAnimSoundDog03(); }
    public playDog04Sound() { AudioManager.playAnimSoundDog04(); }
    public playDog05Sound() { AudioManager.playAnimSoundDog05(); }
    public playDog06Sound() { AudioManager.playAnimSoundDog06(); }
    public playDog07Sound() { AudioManager.playAnimSoundDog07(); }
    public playDog08Sound() { AudioManager.playAnimSoundDog08(); }
    public playDog09Sound() { AudioManager.playAnimSoundDog09(); }
    public playDog10Sound() { AudioManager.playAnimSoundDog10(); }
    public playDog11Sound() { AudioManager.playAnimSoundDog11(); }
    public playDog12Sound() { AudioManager.playAnimSoundDog12(); }
    public playDog13Sound() { AudioManager.playAnimSoundDog13(); }
    public playDog14Sound() { AudioManager.playAnimSoundDog14(); }
    public playDog15Sound() { AudioManager.playAnimSoundDog15(); }
    public playDog16Sound() { AudioManager.playAnimSoundDog16(); }
    public playDog17Sound() { AudioManager.playAnimSoundDog17(); }
}

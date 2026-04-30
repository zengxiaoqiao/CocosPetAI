import { _decorator, Component } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass } = _decorator;

/**
 * 挂在 cat 节点上，供动画帧事件调用，转发到 AudioManager 播放对应音效。
 * 帧事件绑定的方法名：playCat01Sound、playCat06Sound 等
 */
@ccclass('CatAnimSound')
export class CatAnimSound extends Component {

    public playCat01Sound() { AudioManager.playAnimSoundCat01(); }
    public playCat02Sound() { AudioManager.playAnimSoundCat02(); }
    public playCat03Sound() { AudioManager.playAnimSoundCat03(); }
    public playCat04Sound() { AudioManager.playAnimSoundCat04(); }
    public playCat05Sound() { AudioManager.playAnimSoundCat05(); }
    public playCat06Sound() { AudioManager.playAnimSoundCat06(); }
    public playCat07Sound() { AudioManager.playAnimSoundCat07(); }
    public playCat08Sound() { AudioManager.playAnimSoundCat08(); }
    public playCat09Sound() { AudioManager.playAnimSoundCat09(); }
    public playCat10Sound() { AudioManager.playAnimSoundCat10(); }
    public playCat11Sound() { AudioManager.playAnimSoundCat11(); }
    public playCat12Sound() { AudioManager.playAnimSoundCat12(); }
    public playCat13Sound() { AudioManager.playAnimSoundCat13(); }
    public playCat14Sound() { AudioManager.playAnimSoundCat14(); }
    public playCat15Sound() { AudioManager.playAnimSoundCat15(); }
    public playCat16Sound() { AudioManager.playAnimSoundCat16(); }
    public playCat17Sound() { AudioManager.playAnimSoundCat17(); }
}

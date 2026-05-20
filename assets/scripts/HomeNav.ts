import { _decorator, Component, director } from 'cc';
import { applySettingsSceneLocale } from './SettingsLocale';
import './ShopScene';
import './CustomizeScene';

const { ccclass } = _decorator;

/**
 * 场景跳转：home <-> settings。home 加载时预加载 settings/ad，减少切场景时主线程阻塞。
 */
@ccclass('HomeNav')
export class HomeNav extends Component {

    onLoad() {
        const scene = director.getScene();
        if (scene && scene.name === 'home') {
            director.preloadScene('settings');
            director.preloadScene('ad');
            director.preloadScene('shop');
            director.preloadScene('customize');
        }
    }

    onDestroy() {
        this.unschedule(this._doOpenSettings);
        this.unschedule(this._doBackToHome);
    }

    private _doOpenSettings = () => {
        if (!this.isValid) return;
        director.loadScene('settings', (err) => {
            if (err) {
                console.error('[HomeNav] 无法加载 settings 场景', err);
                return;
            }
            applySettingsSceneLocale();
        });
    };

    private _doBackToHome = () => {
        if (!this.isValid) return;
        director.loadScene('home', (err) => {
            if (err) console.error('[HomeNav] 无法加载 home 场景', err);
        });
    };

    /** 从 home 进入设置场景 */
    public onOpenSettings() {
        this.scheduleOnce(this._doOpenSettings, 0);
    }

    /** 从设置返回首页 */
    public onBackToHome() {
        this.scheduleOnce(this._doBackToHome, 0);
    }
}


import { _decorator, Component, Node, director, sys } from 'cc';
import { SharedBtnCounts } from './SharedBtnCounts';
const { ccclass, property } = _decorator;

/**
 * 挂在广告（充值）界面节点上：关闭按钮若干秒后出现；点击关闭后根据记录的按钮编号 +1，然后切回 home。
 */
@ccclass('RechargePanel')
export class RechargePanel extends Component {

    @property(Node)
    public closeButton: Node | null = null;

    @property({ tooltip: '关闭按钮在界面出现后多少秒显示' })
    public closeButtonDelaySeconds: number = 2;

    onEnable() {
        if (this.closeButton) this.closeButton.active = false;
        this.scheduleOnce(this._showCloseButton, this.closeButtonDelaySeconds);
    }

    onDisable() {
        this.unschedule(this._showCloseButton);
    }

    private _showCloseButton(): void {
        if (this.closeButton) this.closeButton.active = true;
    }

    /** 关闭按钮点击时调用（在编辑器中把按钮的 Click Events 绑到此方法） */
    public onCloseButtonClick(): void {
        SharedBtnCounts.init();
        const pet = sys.localStorage.getItem('recharge_pet');
        const btnStr = sys.localStorage.getItem('recharge_button');

        if (pet && btnStr) {
            const btn = parseInt(btnStr) as 1 | 2 | 3;
            if (btn === 1 || btn === 2 || btn === 3) {
                const key = `ad_reward_${pet}_btn${btn}`;
                const old = parseInt(sys.localStorage.getItem(key) || '0');
                sys.localStorage.setItem(key, String(old + 1));
                this._addCountAndClose(btn);
            } else {
                this._closeAndReturnHome();
            }
        } else {
            this._closeAndReturnHome();
        }
    }

    private _addCountAndClose(buttonIndex: 1 | 2 | 3) {
        if (buttonIndex === 1) SharedBtnCounts.btn1++;
        else if (buttonIndex === 2) SharedBtnCounts.btn2++;
        else SharedBtnCounts.btn3++;
        SharedBtnCounts.save();
        this._closeAndReturnHome();
    }

    private _closeAndReturnHome() {
        sys.localStorage.removeItem('recharge_pet');
        sys.localStorage.removeItem('recharge_button');
        director.loadScene('home', (err) => {
            if (err) console.error('[RechargePanel] 无法加载 home 场景', err);
        });
    }
}

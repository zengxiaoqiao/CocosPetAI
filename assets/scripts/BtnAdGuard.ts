import { _decorator, Component, Node, director, sys, find } from 'cc';
import { SharedBtnCounts } from './SharedBtnCounts';
import { RandomPlayPetAni } from './RandomPlayPetAni';

/**
 * Button1/2/3 数量为 0 时点击仍能跳转 AD 场景。
 */
@_decorator.ccclass('BtnAdGuard')
export class BtnAdGuard extends Component {

    private _handlers: Array<{ node: Node; idx: 1 | 2 | 3; cb: () => void }> = [];
    private _dogNode: Node | null = null;
    private _catNode: Node | null = null;
    private _isLoadingAd = false;

    onLoad() {
        this._dogNode = find('Canvas/dog');
        this._catNode = find('Canvas/cat');
        const btn1 = find('Canvas/btn/Button1');
        const btn2 = find('Canvas/btn/Button2');
        const btn3 = find('Canvas/btn/Button3');

        [btn1, btn2, btn3].forEach((node, index) => {
            if (!node) return;
            const idx = (index + 1) as 1 | 2 | 3;
            const cb = () => this._tryGotoAd(idx);
            node.on(Node.EventType.TOUCH_END, cb, this, true);
            this._handlers.push({ node, idx, cb });
        });
    }

    onDestroy() {
        for (const { node, cb } of this._handlers) {
            if (!node?.isValid) continue;
            node.off(Node.EventType.TOUCH_END, cb, this);
        }
        this._handlers = [];
    }

    private _tryGotoAd(buttonIndex: 1 | 2 | 3) {
        const count = buttonIndex === 1 ? SharedBtnCounts.btn1
            : buttonIndex === 2 ? SharedBtnCounts.btn2
                : SharedBtnCounts.btn3;
        if (count >= 1) return;
        const rechargePanel = find('Canvas/recharge_panel');
        if (rechargePanel?.active) return;

        if (this._isLoadingAd) return;
        this._isLoadingAd = true;
        try {
            const pet = this._dogNode?.active ? 'dog' : (this._catNode?.active ? 'cat' : 'dog');
            sys.localStorage.setItem('recharge_pet', pet);
            sys.localStorage.setItem('recharge_button', String(buttonIndex));
        } catch (e) {
            console.warn('[BtnAdGuard] 写入本地存储失败：', e);
        }
        RandomPlayPetAni.returnedFromAd = true;
        this.scheduleOnce(() => {
            if (!this.isValid) {
                this._isLoadingAd = false;
                return;
            }
            director.loadScene('ad', (err) => {
                this._isLoadingAd = false;
                if (err) console.error('[BtnAdGuard] 无法加载 ad 场景', err);
            });
        }, 0);
    }
}

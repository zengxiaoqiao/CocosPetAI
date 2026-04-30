import { _decorator, Component, Button, find } from 'cc';
import { SharedBtnCounts } from './SharedBtnCounts';
import { PetInfoBar } from './PetInfoBar';
import { getCheckinAlreadyClaimedTip } from './TipCopy';

/**
 * 挂在主场景的 ad 节点上：点击后弹出 Check-in；当日已领取过则提示「今天已经领过了」。
 */
@_decorator.ccclass('AdButton')
export class AdButton extends Component {

    onLoad() {
        const btn = this.node.getComponent(Button) || this.node.addComponent(Button);
        btn.node.on(Button.EventType.CLICK, this._onClick, this);
    }

    onDestroy() {
        const btn = this.node.getComponent(Button);
        if (btn?.node?.isValid) {
            btn.node.off(Button.EventType.CLICK, this._onClick, this);
        }
    }

    private _onClick() {
        SharedBtnCounts.init();
        SharedBtnCounts.ensurePendingClaimWhenUserOpensCheckIn();
        if (!SharedBtnCounts.hasPendingClaim()) {
            PetInfoBar.instance?.showPerMinuteLimitHint(getCheckinAlreadyClaimedTip());
            return;
        }
        const checkInNode = find('Canvas/Check-in');
        if (checkInNode) checkInNode.active = true;
    }
}

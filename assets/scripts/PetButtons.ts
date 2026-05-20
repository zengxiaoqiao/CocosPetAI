import { _decorator, Component, Node, director, find } from 'cc';
import { DogController } from './DogController';
import { CatController } from './CatController';

const { ccclass, property } = _decorator;

/**
 * 同一组按钮控制狗/猫：根据当前显示的是谁，把 btn1～btn3 转发给 DogController 或 CatController。
 * 点摸/滑动抚摸已移除；语音请长按宠物或使用麦克风按钮。
 */
@ccclass('PetButtons')
export class PetButtons extends Component {

    @property(Node)
    dogNode: Node | null = null;

    @property(Node)
    catNode: Node | null = null;

    /** 充值界面节点：当其 active 时，不把 btn1/2/3 点击转发给狗/猫，避免误触 */
    @property(Node)
    rechargePanel: Node | null = null;

    private _isDogActive(): boolean {
        return !!this.dogNode && this.dogNode.active;
    }

    private _getDogController(): DogController | null {
        return this.dogNode ? this.dogNode.getComponent(DogController) : null;
    }

    private _getCatController(): CatController | null {
        return this.catNode ? this.catNode.getComponent(CatController) : null;
    }

    /** 场景若仍绑定 Button0：仅睡觉时可点醒 */
    public onBtn0Click() {
        if (this._isDogActive()) {
            this._getDogController()?.onBtn0Click();
        } else {
            this._getCatController()?.onBtn0Click();
        }
    }

    public onBtn1Click() {
        if (this.rechargePanel && this.rechargePanel.active) return;
        if (this._isDogActive()) {
            this._getDogController()?.onBtn1Click();
        } else {
            this._getCatController()?.onBtn1Click();
        }
    }

    public onBtn2Click() {
        if (this.rechargePanel && this.rechargePanel.active) return;
        if (this._isDogActive()) {
            this._getDogController()?.onBtn2Click();
        } else {
            this._getCatController()?.onBtn2Click();
        }
    }

    public onBtn3Click() {
        if (this.rechargePanel && this.rechargePanel.active) return;
        if (this._isDogActive()) {
            this._getDogController()?.onBtn3Click();
        } else {
            this._getCatController()?.onBtn3Click();
        }
    }
}

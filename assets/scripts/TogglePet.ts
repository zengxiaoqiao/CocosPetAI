import { _decorator, Component, Node, SpriteFrame, sys, Sprite } from 'cc';
import { DogController } from './DogController';
import { CatController } from './CatController';
import { syncWidgetFromStorage } from './WidgetSync';
const { ccclass, property } = _decorator;

const STORAGE_KEY = 'petai_pet_choice';

/**
 * 猫/狗切换：用一个按钮在狗/猫节点、对应背景和 Button2 图片之间切换显示。
 * 用户选择后会持久化，下次进入自动显示上次选择的动物。
 * 同时提供 onBtn1/2/3Click 供按钮绑定，根据当前显示的宠物路由到对应 Controller。
 */
@ccclass('TogglePet')
export class TogglePet extends Component {

    @property(Node)
    dogNode: Node | null = null;

    @property(Node)
    catNode: Node | null = null;

    @property(Node)
    dogBgNode: Node | null = null;

    @property(Node)
    catBgNode: Node | null = null;

    @property(Node)
    button2Node: Node | null = null;

    @property(SpriteFrame)
    button2DogSprite: SpriteFrame | null = null;

    @property(SpriteFrame)
    button2CatSprite: SpriteFrame | null = null;

    @property({ tooltip: '无持久化记录时，初始显示狗还是猫' })
    showDogFirst: boolean = true;

    private _showingDog: boolean = true;
    private _dogController: DogController | null = null;
    private _catController: CatController | null = null;

    onLoad() {
        this._ensureControllers();
        const saved = sys.localStorage.getItem(STORAGE_KEY);
        if (saved === 'cat') this._showingDog = false;
        else if (saved === 'dog') this._showingDog = true;
        else this._showingDog = this.showDogFirst;
        this._apply();
    }

    start() {
        this._ensureControllers();
        this._apply();
    }

    private _ensureControllers() {
        if (!this._dogController && this.dogNode) this._dogController = this.dogNode.getComponent(DogController) || null;
        if (!this._catController && this.catNode) this._catController = this.catNode.getComponent(CatController) || null;
    }

    public onSwitchPet() {
        this._showingDog = !this._showingDog;
        this._saveChoice();
        this._apply();
    }

    private _saveChoice(): void {
        try {
            sys.localStorage.setItem(STORAGE_KEY, this._showingDog ? 'dog' : 'cat');
            syncWidgetFromStorage();
        } catch (e) {
            console.warn('[TogglePet] 持久化失败：', e);
        }
    }

    private _apply() {
        if (this.dogNode) this.dogNode.active = this._showingDog;
        if (this.catNode) this.catNode.active = !this._showingDog;
        if (this.dogBgNode) this.dogBgNode.active = this._showingDog;
        if (this.catBgNode) this.catBgNode.active = !this._showingDog;
        this._applyButton2Sprite();
    }

    private _applyButton2Sprite() {
        if (!this.button2Node) return;
        const sprite = this.button2Node.getComponent(Sprite);
        if (sprite && (this.button2DogSprite || this.button2CatSprite)) {
            sprite.spriteFrame = this._showingDog ? this.button2DogSprite : this.button2CatSprite;
        }
    }

    /** 供 Button0 绑定：根据当前显示的宠物调用对应 Controller */
    public onBtn0Click() {
        this._ensureControllers();
        if (this.dogNode?.active) this._dogController?.onBtn0Click();
        else if (this.catNode?.active) this._catController?.onBtn0Click();
    }

    /** 供 Button1 绑定：根据当前显示的宠物调用对应 Controller */
    public onBtn1Click() {
        this._ensureControllers();
        if (this.dogNode?.active) this._dogController?.onBtn1Click();
        else if (this.catNode?.active) this._catController?.onBtn1Click();
    }

    /** 供 Button2 绑定：根据当前显示的宠物调用对应 Controller */
    public onBtn2Click() {
        this._ensureControllers();
        if (this.dogNode?.active) this._dogController?.onBtn2Click();
        else if (this.catNode?.active) this._catController?.onBtn2Click();
    }

    /** 供 Button3 绑定：根据当前显示的宠物调用对应 Controller */
    public onBtn3Click() {
        this._ensureControllers();
        if (this.dogNode?.active) this._dogController?.onBtn3Click();
        else if (this.catNode?.active) this._catController?.onBtn3Click();
    }
}

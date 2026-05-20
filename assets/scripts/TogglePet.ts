import {
    _decorator, Component, Node, SpriteFrame, sys, Sprite, Button, find, instantiate,
} from 'cc';
import { DogController } from './DogController';
import { CatController } from './CatController';
import { syncWidgetFromStorage } from './WidgetSync';
import {
    consumeSelectCatAfterUnlock, hasCustomPet, isCatUnlocked, openShop,
} from './PetUnlock';
import './ShopScene';

const { ccclass, property } = _decorator;

const STORAGE_KEY = 'petai_pet_choice';
const PICKER_STEP_X = 80;

export type ActivePetKind = 'dog' | 'cat' | 'custom';

/**
 * 宠物选择条（TogglePet：dog / cat / custom / mypet+）：
 * - 默认：狗 + 商店（+）
 * - 解锁猫后：狗 + 猫 + 商店
 * - 已有定制宠物：狗 + 猫 + 定制 + 商店
 */
@ccclass('TogglePet')
export class TogglePet extends Component {

    @property(Node)
    dogNode: Node | null = null;

    @property(Node)
    catNode: Node | null = null;

    @property({ tooltip: '主场景定制宠物节点（可选，暂无则选中定制时仍显示狗）' })
    customNode: Node | null = null;

    @property(Node)
    dogBgNode: Node | null = null;

    @property(Node)
    catBgNode: Node | null = null;

    @property(Node)
    customBgNode: Node | null = null;

    @property(Node)
    button2Node: Node | null = null;

    @property(SpriteFrame)
    button2DogSprite: SpriteFrame | null = null;

    @property(SpriteFrame)
    button2CatSprite: SpriteFrame | null = null;

    @property({ tooltip: '选择条：狗' })
    pickerDogNode: Node | null = null;

    @property({ tooltip: '选择条：猫（未解锁时不显示）' })
    pickerCatNode: Node | null = null;

    @property({ tooltip: '选择条：定制宠物（无定制存档时不显示）' })
    pickerCustomNode: Node | null = null;

    @property({ tooltip: '选择条：商店入口（+）' })
    pickerShopNode: Node | null = null;

    @property({ tooltip: '兼容旧字段，同 pickerShopNode' })
    pickerCustomizeNode: Node | null = null;

    @property({ tooltip: '无持久化记录时，初始显示狗还是猫' })
    showDogFirst: boolean = true;

    private _activePet: ActivePetKind = 'dog';
    private _dogController: DogController | null = null;
    private _catController: CatController | null = null;

    onLoad() {
        this._ensureButton2Refs();
        this._ensurePickerNodes();
        this._ensureCustomPickerNode();
        this._ensureControllers();
        this._disableLegacyToggleButton();
        this._bindPickerClicks();

        this._activePet = this._loadSavedPet();
        this._apply();
        this._refreshPickerVisuals();
    }

    start() {
        this._ensureControllers();
        this._applyAfterReturnFromShop();
        this._apply();
        this._refreshPickerVisuals();
    }

    onEnable() {
        this._applyAfterReturnFromShop();
        this._refreshPickerVisuals();
    }

    private _applyAfterReturnFromShop() {
        if (!consumeSelectCatAfterUnlock() || !isCatUnlocked()) return;
        this._activePet = 'cat';
        this._saveChoice();
        this._apply();
    }

    private _loadSavedPet(): ActivePetKind {
        const saved = sys.localStorage.getItem(STORAGE_KEY);
        if (saved === 'cat' && isCatUnlocked()) return 'cat';
        if (saved === 'custom' && hasCustomPet()) return 'custom';
        if (saved === 'dog') return 'dog';
        return this.showDogFirst && isCatUnlocked() ? 'dog' : 'dog';
    }

    private _normalizeActivePet(): void {
        if (this._activePet === 'cat' && !isCatUnlocked()) this._activePet = 'dog';
        if (this._activePet === 'custom' && !hasCustomPet()) this._activePet = 'dog';
    }

    private _ensurePickerNodes() {
        if (!this.pickerDogNode) this.pickerDogNode = this.node.getChildByName('dog');
        if (!this.pickerCatNode) this.pickerCatNode = this.node.getChildByName('cat');
        if (!this.pickerShopNode) {
            this.pickerShopNode = this.pickerCustomizeNode ?? this.node.getChildByName('mypet');
        }
        this.pickerCustomizeNode = this.pickerShopNode;
        if (!this.pickerCustomNode) this.pickerCustomNode = this.node.getChildByName('custom');
    }

    /** 无场景节点时，用狗图标克隆一只「定制」入口 */
    private _ensureCustomPickerNode() {
        if (this.pickerCustomNode?.isValid) return;
        const template = this.pickerDogNode;
        if (!template) return;
        this.pickerCustomNode = instantiate(template);
        this.pickerCustomNode.name = 'custom';
        this.node.addChild(this.pickerCustomNode);
        this.pickerCustomNode.active = false;
    }

    private _disableLegacyToggleButton() {
        const btn = this.node.getComponent(Button);
        if (btn) {
            btn.interactable = false;
            btn.clickEvents.length = 0;
        }
    }

    private _bindPickerClicks() {
        this._bindPicker(this.pickerDogNode, () => this.onPickDog());
        this._bindPicker(this.pickerCatNode, () => this.onPickCat());
        this._bindPicker(this.pickerCustomNode, () => this.onPickCustom());
        this._bindPicker(this.pickerShopNode, () => this.onPickShop());
    }

    private _bindPicker(node: Node | null, handler: () => void) {
        if (!node) return;
        let btn = node.getComponent(Button);
        if (!btn) btn = node.addComponent(Button);
        btn.transition = Button.Transition.SCALE;
        btn.zoomScale = 1.08;
        btn.node.off(Button.EventType.CLICK);
        btn.node.on(Button.EventType.CLICK, handler, this);
    }

    public onPickDog() {
        if (this._activePet === 'dog') {
            this._refreshPickerVisuals();
            return;
        }
        this._activePet = 'dog';
        this._saveChoice();
        this._apply();
        this._refreshPickerVisuals();
    }

    public onPickCat() {
        if (!isCatUnlocked()) return;
        if (this._activePet === 'cat') {
            this._refreshPickerVisuals();
            return;
        }
        this._activePet = 'cat';
        this._saveChoice();
        this._apply();
        this._refreshPickerVisuals();
    }

    public onPickCustom() {
        if (!hasCustomPet()) return;
        if (this._activePet === 'custom') {
            this._refreshPickerVisuals();
            return;
        }
        this._activePet = 'custom';
        this._saveChoice();
        this._apply();
        this._refreshPickerVisuals();
    }

    public onPickShop() {
        openShop();
    }

    private _saveChoice(): void {
        try {
            sys.localStorage.setItem(STORAGE_KEY, this._activePet);
            syncWidgetFromStorage();
        } catch (e) {
            console.warn('[TogglePet] 持久化失败：', e);
        }
    }

    private _apply() {
        this._normalizeActivePet();
        const isDog = this._activePet === 'dog';
        const isCat = this._activePet === 'cat';
        const isCustom = this._activePet === 'custom';
        const hasCustomDisplay = !!this.customNode;

        if (this.dogNode) this.dogNode.active = isDog || (isCustom && !hasCustomDisplay);
        if (this.catNode) this.catNode.active = isCat;
        if (this.customNode) this.customNode.active = isCustom;

        if (this.dogBgNode) this.dogBgNode.active = isDog || (isCustom && !hasCustomDisplay);
        if (this.catBgNode) this.catBgNode.active = isCat;
        if (this.customBgNode) this.customBgNode.active = isCustom && hasCustomDisplay;

        this._applyButton2Sprite();
    }

    private _ensureButton2Refs() {
        if (!this.button2Node) {
            this.button2Node = find('Canvas/btn/Button2');
        }
    }

    private _applyButton2Sprite() {
        this._ensureButton2Refs();
        if (!this.button2Node) return;

        const useDog = this._activePet !== 'cat';
        const frame = useDog ? this.button2DogSprite : this.button2CatSprite;
        if (!frame?.isValid) return;

        const sprite = this.button2Node.getComponent(Sprite)
            ?? this.button2Node.getChildByName('Sprite')?.getComponent(Sprite);
        if (sprite) sprite.spriteFrame = frame;
    }

    /** 按解锁状态显示槽位并排布：狗 | 猫? | 定制? | + */
    private _syncPickerLayout() {
        const showCat = isCatUnlocked();
        const showCustom = hasCustomPet();

        if (this.pickerDogNode) this.pickerDogNode.active = true;
        if (this.pickerCatNode) this.pickerCatNode.active = showCat;
        if (this.pickerCustomNode) this.pickerCustomNode.active = showCustom;
        if (this.pickerShopNode) this.pickerShopNode.active = true;

        const row: Node[] = [];
        if (this.pickerDogNode?.active) row.push(this.pickerDogNode);
        if (showCat && this.pickerCatNode) row.push(this.pickerCatNode);
        if (showCustom && this.pickerCustomNode) row.push(this.pickerCustomNode);
        if (this.pickerShopNode?.active) row.push(this.pickerShopNode);

        row.forEach((n, i) => n.setPosition(i * PICKER_STEP_X, 0, 0));
    }

    private _refreshPickerVisuals() {
        this._normalizeActivePet();
        this._syncPickerLayout();

        const scaleSel = 1.08;
        const scaleNorm = 1;
        this._setPickerScale(this.pickerDogNode, this._activePet === 'dog' ? scaleSel : scaleNorm);
        this._setPickerScale(this.pickerCatNode, this._activePet === 'cat' ? scaleSel : scaleNorm);
        this._setPickerScale(this.pickerCustomNode, this._activePet === 'custom' ? scaleSel : scaleNorm);
        this._setPickerScale(this.pickerShopNode, scaleNorm);
    }

    private _setPickerScale(node: Node | null, s: number) {
        if (!node?.active) return;
        node.setScale(s, s, 1);
    }

    private _ensureControllers() {
        if (!this._dogController && this.dogNode) {
            this._dogController = this.dogNode.getComponent(DogController) || null;
        }
        if (!this._catController && this.catNode) {
            this._catController = this.catNode.getComponent(CatController) || null;
        }
    }

    private _routeActiveController<T>(dogFn: () => T | undefined, catFn: () => T | undefined): T | undefined {
        this._ensureControllers();
        if (this._activePet === 'cat') return catFn();
        return dogFn();
    }

    public onBtn0Click() {
        this._routeActiveController(
            () => this._dogController?.onBtn0Click(),
            () => this._catController?.onBtn0Click(),
        );
    }

    public onBtn1Click() {
        this._routeActiveController(
            () => this._dogController?.onBtn1Click(),
            () => this._catController?.onBtn1Click(),
        );
    }

    public onBtn2Click() {
        this._routeActiveController(
            () => this._dogController?.onBtn2Click(),
            () => this._catController?.onBtn2Click(),
        );
    }

    public onBtn3Click() {
        this._routeActiveController(
            () => this._dogController?.onBtn3Click(),
            () => this._catController?.onBtn3Click(),
        );
    }
}

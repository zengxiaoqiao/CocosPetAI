import { _decorator, Component, Label, director, find } from 'cc';
import { PetValue } from './PetValue';
import { BtnMicroRecord } from './BtnMicroRecord';
import { isZh } from './Lang';
const { ccclass, property } = _decorator;

/**
 * 麦克风按钮下方提示文案：
 * - 麦克风不可用（无体力/无心情）时：显示简短原因提示
 * - 麦克风可用时：不显示预设轮播文案，避免与 pet_info_bar 产生歧义
 */
@ccclass('BtnMicroRandomText')
export class BtnMicroRandomText extends Component {

    @property(Label)
    label: Label | null = null;

    @property(PetValue)
    petValue: PetValue | null = null;

    @property(BtnMicroRecord)
    recordComponent: BtnMicroRecord | null = null;

    @property({ multiline: true, tooltip: '多行提示语，每行一句（不填则使用默认多语言文案）' })
    phraseList: string = '';

    @property
    interval: number = 1.5;

    private _phrases: string[] = [];
    private _index: number = 0;
    private _lastCanUse: boolean | null = null;

    onLoad() {
        this._ensurePetValue();
        this._ensureLabel();
        this._updateLabel();
        this.schedule(this._refreshWhenDisabled, 1, Infinity);
    }

    private _ensureLabel() {
        if (this.label) return;
        this.label = this.node.getComponentInChildren(Label) || null;
    }

    private _refreshWhenDisabled() {
        const pv = this._ensurePetValue();
        const canUse = !pv || pv.canUseMicro();
        // Update immediately when usability changes (disabled -> enabled should clear copy right away).
        if (this._lastCanUse === null || this._lastCanUse !== canUse) {
            this._lastCanUse = canUse;
            this._updateLabel();
            return;
        }
        // While disabled, refresh periodically (hp/mood reason may change).
        if (!canUse) this._updateLabel();
    }

    private _ensurePetValue(): PetValue | null {
        if (this.petValue) return this.petValue;
        const n = find('Canvas/pet_value');
        this.petValue = n ? n.getComponent(PetValue) : null;
        if (!this.petValue) this.petValue = director.getScene()?.getComponentInChildren(PetValue) || null;
        return this.petValue;
    }

    onDestroy() {
        this.unschedule(this._nextPhrase);
        this.unschedule(this._refreshWhenDisabled);
    }

    private _nextPhrase() {
        if (this._phrases.length === 0) return;
        this._index = (this._index + 1) % this._phrases.length;
        this._updateLabel();
    }

    private _updateLabel() {
        this._ensureLabel();
        if (!this.label) return;
        const pv = this._ensurePetValue();
        const canUse = !pv || pv.canUseMicro();
        this._lastCanUse = canUse;
        if (!canUse && pv) {
            if (pv.isHpLowForMicro() && !pv.isIntimacyLowForMicro()) {
                this.label.string = isZh() ? '体力小于60不能聊天' : "I'm tired";
            } else if (pv.isIntimacyLowForMicro() && !pv.isHpLowForMicro()) {
                this.label.string = isZh() ? '心情小于60不能聊天' : "Not in the mood";
            } else {
                this.label.string = isZh() ? '体力和心情大于60才能聊天' : "Can't talk right now";
            }
            return;
        }
        // Mic is usable: keep this area empty to avoid duplicate/ambiguous copy vs pet_info_bar.
        this.label.string = '';
    }
}

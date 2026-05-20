import { _decorator, Component, Label } from 'cc';
import { PetValue } from './PetValue';
const { ccclass, property } = _decorator;

export type MicHintMode = 'idle' | 'pressing' | 'recording' | 'thinking';

/**
 * 麦克风按钮旁状态文案（已关闭显示，仅保留接口供 BtnMicroRecord 调用）。
 */
@ccclass('BtnMicroRandomText')
export class BtnMicroRandomText extends Component {

    @property(Label)
    label: Label | null = null;

    @property(PetValue)
    petValue: PetValue | null = null;

    @property({ multiline: true, tooltip: '空闲时轮播（预留）' })
    phraseList: string = '';

    @property
    interval: number = 1.5;

    private _mode: MicHintMode = 'idle';

    onLoad() {
        this._clearHint();
    }

    /** 由 BtnMicroRecord 驱动；不再显示按住/继续按住等文案 */
    public setMicHint(mode: MicHintMode): void {
        this._mode = mode;
        this._clearHint();
    }

    public get micHintMode(): MicHintMode {
        return this._mode;
    }

    private _clearHint(): void {
        const label = this._ensureHintLabel();
        if (label) {
            label.string = '';
            label.node.active = false;
        }
    }

    private _ensureHintLabel(): Label | null {
        if (this.label?.node?.isValid) return this.label;

        const named = this.node.getChildByName('mic_hint');
        if (named) {
            this.label = named.getComponent(Label) || named.addComponent(Label);
            return this.label;
        }

        for (const child of this.node.children) {
            if (child.name === 'mic_hint') continue;
            const lab = child.getComponent(Label);
            if (lab && child.name !== 'thinking' && child.name !== 'sent') {
                this.label = lab;
                return this.label;
            }
        }

        return null;
    }
}

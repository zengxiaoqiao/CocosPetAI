import { _decorator, Component, Label, game, Game } from 'cc';
import { recordCompanionVisitToday, getCompanionDaysDisplayText, getCompanionDaysState } from './CompanionDays';

const { ccclass, property } = _decorator;

/**
 * 挂在场景中的 companion 节点上，与 PetValue（体力/心情）分离，便于分开放置 UI。
 */
@ccclass('CompanionDaysDisplay')
export class CompanionDaysDisplay extends Component {

    @property({ tooltip: '展示文案的 Label；不绑则使用本节点上的 Label' })
    textLabel: Label | null = null;

    public static instance: CompanionDaysDisplay | null = null;

    private _totalDays = 0;
    private _streakDays = 0;

    onLoad() {
        this._ensureLabel();
        this._refreshFromStorage(true);
        game.on(Game.EVENT_SHOW, this._onGameShow, this);
    }

    onEnable() {
        CompanionDaysDisplay.instance = this;
    }

    onDisable() {
        if (CompanionDaysDisplay.instance === this) {
            CompanionDaysDisplay.instance = null;
        }
        game.off(Game.EVENT_SHOW, this._onGameShow, this);
    }

    private _onGameShow = () => {
        if (!this.isValid) return;
        this._refreshFromStorage(true);
    };

    private _ensureLabel() {
        if (this.textLabel) return;
        this.textLabel = this.getComponent(Label) || this.getComponentInChildren(Label);
    }

    /** @param recordVisit 是否尝试计入今日陪伴（仅应在 onLoad / 回前台时 true） */
    private _refreshFromStorage(recordVisit: boolean) {
        const state = recordVisit ? recordCompanionVisitToday() : getCompanionDaysState();
        this._totalDays = state.totalDays;
        this._streakDays = state.streakDays;
        this._applyLabel();
    }

    private _applyLabel() {
        this._ensureLabel();
        if (!this.textLabel) return;
        this.textLabel.string = getCompanionDaysDisplayText({
            totalDays: this._totalDays,
            streakDays: this._streakDays,
        });
    }

    public get totalDays(): number {
        return this._totalDays;
    }

    public get streakDays(): number {
        return this._streakDays;
    }

    /** 外部可在不重新计日的情况下刷新展示 */
    public refreshDisplay(): void {
        const state = getCompanionDaysState();
        this._totalDays = state.totalDays;
        this._streakDays = state.streakDays;
        this._applyLabel();
    }
}

import { _decorator, Component, Label, UITransform, view, sys, native, game, Game } from 'cc';
import { getCurrentWeatherByDeviceLocation, WeatherInfo } from './WeatherService';
import { syncWidgetWeather, clearWidgetWeather } from './WidgetSync';
import { getTimeRules, getBatteryLowTexts, getFirstOpenTip, getFirstOpenTipSecond, getFirstOpenTipThird, getFirstOpenTipFourth, getFirstOpenTipFifth, isWeatherGoodForGreeting, getNetworkTipsNone, getHpZeroTip, getIntimacyZeroTip, getNotAgainTip } from './TipCopy';
import { PetValue, IS_FIRST_SESSION } from './PetValue';
import { getLocalDateString } from './DateUtil';
import { TokitChatService } from './llm_v2/TokitChatService';

const { ccclass, property } = _decorator;

const STORAGE_KEY_GREET_PREFIX = 'petai_greet_';
const STORAGE_KEY_PET = 'petai_pet_choice';
const STORAGE_KEY_TODAY_PET_DATE = 'petai_today_pet_date';
const STORAGE_KEY_TODAY_PET_COUNT = 'petai_today_pet_count';
const STORAGE_KEY_FIRST_OPEN_DONE = 'petai_first_open_done';
const STORAGE_KEY_WEATHER_TIP_LAST = 'petai_weather_tip_last';
/** 「天气」类提示间隔（毫秒），每小时最多一次 */
const TIP_INTERVAL_MS = 1 * 60 * 60 * 1000;

/**
 * 宠物主界面的文案条：
 * - 左侧/前半部分：天气文案（来自 WeatherService）
 * - 右侧/后半部分：其它提示文案（由游戏内其它脚本设置）
 *
 * 用法：
 *  - 在主界面 Canvas 下新建一个节点（例如 pet_info_bar），挂上本组件；
 *  - 节点下放一个 Label，并在 Inspector 里拖到 textLabel 上。
 *  - 其它脚本可通过 PetInfoBar.instance?.setExtraText('xxx') 设置额外文案。
 */
@ccclass('PetInfoBar')
export class PetInfoBar extends Component {

    @property(Label)
    public textLabel: Label | null = null;

    @property({ tooltip: '信息条左右留白占屏幕宽度比例（0~0.5），默认每侧 10%；越大距屏幕左右越远' })
    public horizontalPaddingRatio: number = 0.10;

    @property({ tooltip: '在比例留白之外，左右各再收紧的像素（与设计分辨率一致）；默认 20，可与比例叠加' })
    public horizontalEdgeInsetPx: number = 20;

    @property({ tooltip: '背景相对文本的水平内边距（像素）' })
    public bubblePaddingX: number = 22;

    @property({ tooltip: '背景相对文本的垂直内边距（像素）' })
    public bubblePaddingY: number = 14;

    @property({ tooltip: '背景最小宽度（像素）' })
    public bubbleMinWidth: number = 120;

    @property({ tooltip: '背景最小高度（像素）' })
    public bubbleMinHeight: number = 56;

    /** 全局单例，方便其它脚本直接设置额外文案 */
    public static instance: PetInfoBar | null = null;

    private _weatherText: string = '';
    /** 当前天气码（Open-Meteo），用于判断是否作为打招呼话题展示 */
    private _weatherCode = 0;
    /** 早/午/晚安问候，与天气不同时出现 */
    private _greetingText: string = '';
    private _extraText: string = '';
    /** 电池相关提示（充电中 / 快没电），定时刷新 */
    private _batteryTipText: string = '';
    /** 是否正在充电（用于「仅基础姿态才显示早午晚安/天气/今天几次」） */
    private _isCharging: boolean = false;
    /** 仅无网络时的提示（有网时不显示网络类文案） */
    private _networkTipText: string = '';
    /** 上次检测到的网络类型，用于「仅变化时提示」 */
    private _lastNetworkType: string = '';
    /** 新安装首次打开时显示的指引：当前正在显示的那一句，仅当次会话优先显示一次后清空（App 内每句约 2 秒） */
    private _firstOpenText: string = '';
    /** 新安装首次打开时显示的指引：队列形式的一组句子，逐句显示。 */
    private _firstOpenQueue: string[] = [];
    /** 是否还有首装指引需要初始化（仅首次安装，当次会话内有效）。 */
    private _pendingFirstOpenTips = false;
    /** 当前展示的那一句（仅 App 内），退到后台时用 _getWidgetText 同步 Widget */
    private _lastDisplayedText: string = '';
    /** 回到前台时，若没有其它提示，强制用天气补一句（仅本次） */
    private _forceWeatherOnResume = false;
    /** Web 上用于监听充电状态变化的 BatteryManager，便于 onDestroy 时移除监听 */
    private _batteryManager: any = null;
    /** 当前短暂提示（2 秒）文本，用于到期后自动清除（仅 App 内） */
    private _pendingShortLivedText: string = '';
    /** 是否正在显示「连续点击」的 Not again 提示（夜间不参与 _applyText 覆盖） */
    private _showingPerMinuteLimitHint = false;
    /** 是否正在显示「用户触发」的短提示（如聊天回复）；显示期间不被 _applyText 覆盖 */
    private _showingUserHint = false;
    /** 本次进游戏已过「打招呼条」展示时长后不再显示（仅隐藏打招呼类，Not again 仍可显示） */
    private _greetingBarDismissed = false;

    /** 进游戏后打招呼条显示时长（秒），过后自动隐藏且本局不再显示 */
    private static readonly GREETING_BAR_DURATION = 4.5;

    onLoad() {
        PetInfoBar.instance = this;
        TokitChatService.startRemoteConfigOnLaunch();
        const firstOpenDone = !!sys.localStorage.getItem(STORAGE_KEY_FIRST_OPEN_DONE);
        if (!firstOpenDone) {
            // 首次安装：延迟到 start 里再初始化提示句，避免被权限弹窗挡住
            this._pendingFirstOpenTips = true;
        }
    }

    private _dismissGreetingBar = () => {
        // 首次安装引导未播放完时，不隐藏 info bar，延后关闭
        if (this._firstOpenText || this._firstOpenQueue.length > 0) {
            this.scheduleOnce(this._dismissGreetingBar, PetInfoBar.GREETING_BAR_DURATION);
            return;
        }
        this._greetingBarDismissed = true;
        if (!this._showingPerMinuteLimitHint && !this._showingUserHint) this.node.active = false;
    };

    onDestroy() {
        if (PetInfoBar.instance === this) {
            PetInfoBar.instance = null;
        }
        this.unschedule(this._dismissGreetingBar);
        this.unschedule(this._maybeUpdateGreeting);
        this.unschedule(this._refreshBatteryTip);
        this.unschedule(this._refreshNetworkTip);
        this.unschedule(this._tickRefreshTip);
        this.unschedule(this._checkLongUse);
        try {
            game.off(Game.EVENT_SHOW, this._onGameShow, this);
            game.off(Game.EVENT_HIDE, this._onGameHide, this);
        } catch { /* ignore */ }
        if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', this._onVisibilityChange);
        }
        if (this._batteryManager) {
            try {
                this._batteryManager.removeEventListener('chargingchange', this._refreshBatteryTip);
                this._batteryManager.removeEventListener('levelchange', this._refreshBatteryTip);
            } catch {
                // ignore
            }
            this._batteryManager = null;
        }
        this.unschedule(this._clearShortLivedTip);
        this.unschedule(this._clearPerMinuteLimitHint);
    }

    start() {
        this._applyHorizontalPaddingForText('');
        // 启动时异步拉一次天气（优先用设备真实位置）
        this._loadWeather();
        // 并根据时间段尝试设置一次问候语，再每隔一段时间检查一次
        this._maybeUpdateGreeting();
        this.schedule(this._maybeUpdateGreeting, 300, Number.POSITIVE_INFINITY);
        this._refreshBatteryTip();
        this.schedule(this._refreshBatteryTip, 1, Number.POSITIVE_INFINITY);
        this._refreshNetworkTip();
        this.schedule(this._refreshNetworkTip, 20, Number.POSITIVE_INFINITY);
        this.schedule(this._tickRefreshTip, 2, Number.POSITIVE_INFINITY);
        try {
            game.on(Game.EVENT_SHOW, this._onGameShow, this);
            game.on(Game.EVENT_HIDE, this._onGameHide, this);
        } catch {
            if (typeof document !== 'undefined') {
                document.addEventListener('visibilitychange', this._onVisibilityChange);
            }
        }
        // 首次安装的指引文案：不再额外延迟，进入场景后立即初始化并开始显示。
        if (this._pendingFirstOpenTips) {
            this._pendingFirstOpenTips = false;
            if (!this._firstOpenText && this._firstOpenQueue.length === 0) {
                this._firstOpenText = getFirstOpenTip();
                this._firstOpenQueue = [
                    getFirstOpenTipSecond(),
                    getFirstOpenTipThird(),
                    getFirstOpenTipFourth(),
                    getFirstOpenTipFifth(),
                ];
                try {
                    sys.localStorage.setItem(STORAGE_KEY_FIRST_OPEN_DONE, '1');
                } catch { /* ignore */ }
            }
            this._applyText();
        }
        // 进游戏后只显示几秒打招呼条，过后隐藏且本局不再显示
        this.scheduleOnce(this._dismissGreetingBar, PetInfoBar.GREETING_BAR_DURATION);
        // Web：监听充电/电量变化，拔线或插线时立即更新文案
        if (typeof navigator !== 'undefined' && (navigator as any).getBattery && !(sys.platform === sys.Platform.ANDROID && sys.isNative)) {
            (navigator as any).getBattery().then((b: any) => {
                if (!b || this._batteryManager) return;
                this._batteryManager = b;
                b.addEventListener('chargingchange', this._refreshBatteryTip);
                b.addEventListener('levelchange', this._refreshBatteryTip);
            }).catch(() => {});
        }
    }

    private _onGameShow = () => {
        this._forceWeatherOnResume = true;
        // 用户回到 App 后，清空桌面 Widget 上的提示文案，避免一直停留
        if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
            clearWidgetWeather();
        }
        PetInfoBar.instance?.refreshTip();
    };

    private _onGameHide = () => {
        const widgetText = this._getWidgetText();
        if (widgetText !== '') syncWidgetWeather(widgetText);
    };

    private _onVisibilityChange = () => {
        if (typeof document === 'undefined') return;
        if (document.hidden) this._onGameHide();
        else this._onGameShow();
    };

    /** 供其它脚本设置额外文案（例如「今天已经撸猫 3 次」）。早午安问候请用 setGreetingText，与天气不会同时显示。 */
    public setExtraText(text: string): void {
        this._extraText = text ?? '';
        this._applyText();
    }

    /** 设置早/午/晚安问候文案；与天气二选一显示，不拼在同一句。 */
    public setGreetingText(text: string): void {
        this._greetingText = text ?? '';
        this._applyText();
    }

    /** 如果你已经拿到了 WeatherInfo，也可以直接注入（方便以后扩展给 Widget 共用） */
    public setWeatherInfo(info: WeatherInfo | null): void {
        if (!info) {
            this._weatherText = '';
            this._weatherCode = 0;
        } else {
            const temp = Math.round(info.temperature);
            this._weatherText = `${info.text} · ${temp}℃`;
            this._weatherCode = info.code ?? 0;
        }
        this._applyText();
    }

    private async _loadWeather() {
        const info = await getCurrentWeatherByDeviceLocation();
        this.setWeatherInfo(info);
    }

    private _refreshBatteryTip = () => {
        this._getBatteryStateAsync().then((state) => {
            if (!state) {
                this._batteryTipText = '';
                this._isCharging = false;
            } else if (state.charging) {
                this._batteryTipText = '';
                this._isCharging = true;
            } else {
                this._isCharging = false;
                if (state.level < 0.2) {
                    const arr = getBatteryLowTexts();
                    this._batteryTipText = arr[Math.floor(Math.random() * arr.length)] ?? arr[0];
                } else {
                    this._batteryTipText = '';
                }
            }
            this._applyText();
        });
    };

    private _getBatteryStateAsync(): Promise<{ charging: boolean; level: number } | null> {
        if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
            try {
                const nat = (native as any);
                if (nat?.reflection?.callStaticMethod) {
                    const raw = nat.reflection.callStaticMethod(
                        'com/cocos/game/AppActivity',
                        'getBatteryState',
                        '()Ljava/lang/String;'
                    ) as string | null | undefined;
                    if (raw && /^[01],[\d.]+$/.test(raw)) {
                        const [c, l] = raw.split(',');
                        return Promise.resolve({
                            charging: c === '1',
                            level: parseFloat(l),
                        });
                    }
                }
            } catch {
                // ignore
            }
            return Promise.resolve(null);
        }
        if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
            return (navigator as any).getBattery().then((b: any) => ({
                charging: !!b?.charging,
                level: typeof b?.level === 'number' ? b.level : 1,
            })).catch(() => null);
        }
        return Promise.resolve(null);
    }

    private _refreshNetworkTip = () => {
        this._getNetworkTypeAsync().then((type) => {
            if (!type) {
                const arr = getNetworkTipsNone();
                this._networkTipText = arr.length ? (arr[Math.floor(Math.random() * arr.length)] ?? arr[0]) : '';
                this._lastNetworkType = '';
            } else {
                this._networkTipText = '';
                this._lastNetworkType = type;
            }
            this._applyText();
        });
    };

    private _getNetworkTypeAsync(): Promise<string> {
        if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
            try {
                const nat = (native as any);
                if (nat?.reflection?.callStaticMethod) {
                    const raw = nat.reflection.callStaticMethod(
                        'com/cocos/game/AppActivity',
                        'getNetworkType',
                        '()Ljava/lang/String;'
                    ) as string | null | undefined;
                    return Promise.resolve((raw && /^(wifi|5g|4g|3g)$/.test(raw)) ? raw : '');
                }
            } catch {
                // ignore
            }
            return Promise.resolve('');
        }
        const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
        const conn = nav?.connection ?? nav?.mozConnection ?? nav?.webkitConnection;
        if (!conn) return Promise.resolve('');
        const type = conn.type;
        const effectiveType = (conn.effectiveType || '').toLowerCase();
        if (type === 'wifi' || type === 'ethernet') return Promise.resolve('wifi');
        if (type === 'cellular') {
            if (effectiveType === '4g') return Promise.resolve('4g');
            if (effectiveType === '3g') return Promise.resolve('3g');
            return Promise.resolve('4g');
        }
        return Promise.resolve('');
    }

    private _maybeUpdateGreeting = () => {
        if (!this.node.active) return;
        const now = new Date();
        const hour = now.getHours();
        const today = getLocalDateString();
        const rules = getTimeRules();
        for (const rule of rules) {
            if (hour < rule.startHour || hour > rule.endHour) continue;
            // 午间休息 12:00～13:00 宠物在睡觉，不显示午安问候
            if (rule.id === 'noon' && hour === 12) continue;
            const key = STORAGE_KEY_GREET_PREFIX + rule.id;
            const lastDay = sys.localStorage.getItem(key) || '';
            if (lastDay === today) continue;
            if (!rule.texts.length) continue;
            const idxKey = key + '_idx';
            const idx = parseInt(sys.localStorage.getItem(idxKey) || '0', 10) % rule.texts.length;
            const text = rule.texts[idx] ?? rule.texts[0];
            this.setGreetingText(text);
            try {
                sys.localStorage.setItem(key, today);
                sys.localStorage.setItem(idxKey, String((idx + 1) % rule.texts.length));
            } catch {
                // ignore
            }
            break;
        }
    };

    /** 「天气」是否允许显示（每 TIP_INTERVAL_MS 最多显示一次） */
    private _canShowWeatherTip(): boolean {
        if (!this._weatherText) return false;
        const last = parseInt(sys.localStorage.getItem(STORAGE_KEY_WEATHER_TIP_LAST) || '0', 10) || 0;
        return (Date.now() - last) >= TIP_INTERVAL_MS;
    }

    /** 每 2 秒跑一次，重算当前该显示哪句，避免同一句停留过久 */
    private _tickRefreshTip = () => {
        this._applyText();
    };

    /** 规则：1 仅 App  2–5 仅 Widget  6–9 App+Widget。返回当前应同步到 Widget 的文案（不消耗状态）。早午晚安/天气仅在基础姿态时同步。 */
    private _getWidgetText(): string {
        if (this._batteryTipText) return this._batteryTipText;
        if (this._networkTipText) return this._networkTipText;
        if (!this._isBasePose()) return '';
        if (this._greetingText) return this._greetingText;
        if (this._weatherText && this._canShowWeatherTip() && isWeatherGoodForGreeting(this._weatherCode)) return this._weatherText;
        return '';
    }

    /** 每晚 22 点～次日 7 点、或午间 12:00～13:00 不显示宠物主动类提示（与夜间同一处理） */
    private _isNightNoTip(): boolean {
        if (IS_FIRST_SESSION) return false;
        const d = new Date();
        const h = d.getHours();
        if (h >= 22 || h < 7) return true;
        if (h === 12) return true;
        return false;
    }

    /** 是否为「基础姿态 01」：非低体力、非低心情、非充电、非无网、非低电量。早午晚安/聊天气/今天玩了几次仅在此状态下显示。 */
    private _isBasePose(): boolean {
        const pv = PetValue.instance;
        return !pv?.isHpLow() && !pv?.isIntimacyLow() && !this._batteryTipText && !this._networkTipText && !this._isCharging;
    }

    private _getInAppDisplayText(forceWeather: boolean): string {
        // 首次安装引导提示：不受夜间/午休「不显示主动提示」规则限制，优先展示
        if (this._firstOpenText) return this._firstOpenText;
        if (this._isNightNoTip()) return '';
        // 体力和心情低于 20 时的提示（优先于电池/天气等）：体力 < 20 → 喂食提示；否则亲密 < 20 → 心情差提示
        const pv = PetValue.instance;
        if (pv?.isHpLow()) return getHpZeroTip();
        if (pv?.isIntimacyLow()) return getIntimacyZeroTip();
        if (this._batteryTipText) return this._batteryTipText;
        // 早午晚安 / 聊天气 / 今天玩了几次：仅在基础姿态 01 时出现
        if (!this._isBasePose()) return '';
        if (this._greetingText) return this._greetingText;
        if (this._weatherText && this._canShowWeatherTip() && isWeatherGoodForGreeting(this._weatherCode)) return this._weatherText;
        if (this._extraText) return this._extraText;
        // 回到前台且没有其它提示时，用天气补一句（不受节流限制，仅话题性天气）
        if (forceWeather && this._weatherText && isWeatherGoodForGreeting(this._weatherCode)) return this._weatherText;
        return '';
    }

    private _applyText() {
        if (!this.textLabel) return;
        // 用户触发提示显示中：不覆盖，等计时清除后再刷新
        if (this._showingPerMinuteLimitHint || this._showingUserHint) return;
        const widgetText = this._getWidgetText();
        const forceWeather = this._forceWeatherOnResume;
        this._forceWeatherOnResume = false;
        const displayedInApp = this._getInAppDisplayText(forceWeather);

        // 是否为「只显示一次、约 2 秒」的短暂提示（仅 App 内）
        const isFirstOpenShort = displayedInApp === this._firstOpenText;
        const isGreetingShort = displayedInApp === this._greetingText;
        const isShortLivedInApp = isFirstOpenShort || isGreetingShort;

        // 消耗「仅 App」：首次打开。若队列中还有下一句指引，则接着显示下一句；否则清空。
        if (displayedInApp === this._firstOpenText) {
            const next = this._firstOpenQueue.shift();
            this._firstOpenText = next ?? '';
        }
        // 消耗「App 或 Widget」：问候（任一侧使用后即清空）
        if (displayedInApp === this._greetingText || widgetText === this._greetingText) {
            this._greetingText = '';
        }
        // 天气：仅 Widget 使用时参与节流，App 内回到前台的补充不受 TIP_INTERVAL_MS 限制
        if (widgetText === this._weatherText && this._weatherText && this._canShowWeatherTip()) {
            try { sys.localStorage.setItem(STORAGE_KEY_WEATHER_TIP_LAST, String(Date.now())); } catch { /* ignore */ }
        }

        this._applyHorizontalPaddingForText(displayedInApp);
        this.textLabel.string = displayedInApp;
        this._lastDisplayedText = displayedInApp;
        this.node.active = displayedInApp !== '';
        if (this._greetingBarDismissed && !this._showingPerMinuteLimitHint && !this._showingUserHint) this.node.active = false;

        // 短暂型提示：只显示一次，约 3 秒后自动清除，再回落到其它文案（天气等）
        if (isShortLivedInApp && displayedInApp) {
            if (this._pendingShortLivedText !== displayedInApp) {
                this._scheduleShortLivedClear(displayedInApp);
            }
        } else {
            // 非短暂型提示：取消之前的 2 秒计时
            if (this._pendingShortLivedText) {
                this.unschedule(this._clearShortLivedTip);
                this._pendingShortLivedText = '';
            }
        }

        if (widgetText !== '') {
            syncWidgetWeather(widgetText);
        }
    }

        /** 3 秒后清除仍在显示的短暂提示，并重新计算下一条文案（仅 App 内）。 */
    private _clearShortLivedTip = () => {
        if (!this.textLabel) return;
        if (this.textLabel.string !== this._pendingShortLivedText) {
            this._pendingShortLivedText = '';
            return;
        }
        this._pendingShortLivedText = '';
        this.textLabel.string = '';
        this.node.active = false;
        // 若还有首装指引句子排队，则留出一点空白时间再显示下一句
        if (this._firstOpenText) {
            this.scheduleOnce(() => this._applyText(), 3.0);
        } else {
            this._applyText();
        }
    };

    private _scheduleShortLivedClear(text: string) {
        this.unschedule(this._clearShortLivedTip);
        this._pendingShortLivedText = text;
        this.scheduleOnce(this._clearShortLivedTip, 3);
    }

    /** 按钮 0/1/2/3 每分钟超 3 次时的提示，在 info bar 里显示约 3 秒后恢复原文案 */
    public showPerMinuteLimitHint(text: string = getNotAgainTip()): void {
        if (!this.textLabel) return;
        this._applyHorizontalPaddingForText(text);
        this.unschedule(this._clearShortLivedTip);
        this._pendingShortLivedText = '';
        this.unschedule(this._clearPerMinuteLimitHint);
        this._showingPerMinuteLimitHint = true;
        this.textLabel.string = text;
        this._bringBarToFront();
        this.node.active = true;
        this.scheduleOnce(this._clearPerMinuteLimitHint, 3);
    }

    private _clearPerMinuteLimitHint = () => {
        this.unschedule(this._clearPerMinuteLimitHint);
        this._showingPerMinuteLimitHint = false;
        this._applyText();
    };

    /** 用户触发的短提示（例如聊天回复），显示一段时间后自动回落到常规文案 */
    public showUserHint(text: string, seconds: number = 4): void {
        if (!this.textLabel) return;
        const t = (text ?? '').trim();
        if (!t) return;
        this._applyHorizontalPaddingForText(t);
        this.unschedule(this._clearShortLivedTip);
        this._pendingShortLivedText = '';
        this.unschedule(this._clearPerMinuteLimitHint);
        this._showingPerMinuteLimitHint = false;

        this._showingUserHint = true;
        this.textLabel.string = t;
        this._bringBarToFront();
        this.node.active = true;
        this.unschedule(this._clearUserHint);
        this.scheduleOnce(this._clearUserHint, Math.max(1, seconds));
    }

    private _clearUserHint = () => {
        this.unschedule(this._clearUserHint);
        this._showingUserHint = false;
        this._applyText();
    };

    /** 刷新当前显示的一句（优先级重算） */
    public refreshTip(): void {
        this._applyText();
    }

    /** 显示/隐藏整个 info bar（供其它脚本控制，比如 Check-in 或数值变化时隐藏）；显示时刷新文案 */
    public setBarVisible(visible: boolean): void {
        this.node.active = visible;
        if (visible) this._applyText();
    }

    /** 全局便捷方法：不直接拿实例也能控制显隐 */
    public static setGlobalVisible(visible: boolean): void {
        if (PetInfoBar.instance) {
            PetInfoBar.instance.setBarVisible(visible);
        }
    }

    /** 将信息条移到父节点子节点最后，保证 UI 绘制在最上层（同 Canvas 内）。 */
    private _bringBarToFront(): void {
        const parent = this.node.parent;
        if (!parent || parent.children.length <= 1) return;
        const last = parent.children.length - 1;
        if (this.node.getSiblingIndex() !== last) {
            this.node.setSiblingIndex(last);
        }
    }

    /** 保证文字区域始终小于屏幕宽度，避免左右贴边。 */
    private _applyHorizontalPaddingForText(text: string): void {
        if (!this.textLabel) return;
        const visible = view.getVisibleSize();
        const ratio = Math.min(0.5, Math.max(0, this.horizontalPaddingRatio));
        const inset = Math.max(0, this.horizontalEdgeInsetPx);
        const maxWidth = Math.max(120, visible.width * (1 - ratio * 2) - inset * 2);
        const t = (text || '').trim();

        // Estimate content width, then clamp to maxWidth.
        // Short texts keep compact width; long texts wrap within maxWidth.
        const fontSize = Math.max(12, this.textLabel.fontSize || 26);
        let wideCount = 0;
        let narrowCount = 0;
        for (const ch of t) {
            if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(ch)) wideCount++;
            else narrowCount++;
        }
        const estimatedContentWidth = Math.ceil((wideCount + narrowCount * 0.56) * fontSize + 24);
        const targetWidth = Math.min(maxWidth, Math.max(120, estimatedContentWidth || 120));

        const labelNode = this.textLabel.node;
        const labelTrans = labelNode.getComponent(UITransform);
        if (labelTrans) {
            const size = labelTrans.contentSize;
            if (Math.abs(size.width - targetWidth) > 0.5) {
                labelTrans.setContentSize(targetWidth, size.height);
            }

            // Resize bubble background to wrap text content.
            const textH = Math.max(size.height, this.textLabel.lineHeight || this.textLabel.fontSize || 26);
            const bubbleW = Math.max(this.bubbleMinWidth, targetWidth + this.bubblePaddingX * 2);
            const bubbleH = Math.max(this.bubbleMinHeight, textH + this.bubblePaddingY * 2);
            const bubbleTrans = this.node.getComponent(UITransform);
            if (bubbleTrans) {
                const bSize = bubbleTrans.contentSize;
                if (Math.abs(bSize.width - bubbleW) > 0.5 || Math.abs(bSize.height - bubbleH) > 0.5) {
                    bubbleTrans.setContentSize(bubbleW, bubbleH);
                }
            }
        }

        // 多行换行并按宽度自动增高，避免一行撑到屏幕边缘。
        this.textLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
        this.textLabel.enableWrapText = true;
    }
}


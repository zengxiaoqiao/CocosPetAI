import {
    _decorator, Component, Label, UITransform, view, sys, game, Game,
    Sprite, Node, Color, Button, find, Layout, Animation,
} from 'cc';
import { clearWidgetWeather } from './WidgetSync';
import {
    getFirstOpenTip, getNotAgainTip, getLowHpFeedBubbleTip, getLowHpFeedEmptyTip, getSleepBubbleTip,
} from './TipCopy';
import { TokitChatService } from './llm_v2/TokitChatService';
import { PetValue } from './PetValue';
import { SharedBtnCounts } from './SharedBtnCounts';
import { TogglePet } from './TogglePet';
import { PetButtons } from './PetButtons';

const { ccclass, property } = _decorator;

const STORAGE_KEY_FIRST_OPEN_DONE = 'petai_first_open_done';

/**
 * 宠物主界面对话框：聊天回复、低体力喂食引导、操作提示等。
 */
@ccclass('PetInfoBar')
export class PetInfoBar extends Component {

    @property(Label)
    public textLabel: Label | null = null;

    @property({ tooltip: '信息条左右留白占屏幕宽度比例（0~0.5），默认每侧 10%' })
    public horizontalPaddingRatio: number = 0.10;

    @property({ tooltip: '在比例留白之外，左右各再收紧的像素' })
    public horizontalEdgeInsetPx: number = 20;

    @property({ tooltip: '背景相对文本的水平内边距（像素）' })
    public bubblePaddingX: number = 26;

    @property({ tooltip: '背景相对文本的垂直内边距（像素）' })
    public bubblePaddingY: number = 18;

    @property({ tooltip: '背景最小宽度（像素）' })
    public bubbleMinWidth: number = 160;

    @property({ tooltip: '背景最小高度（像素）；pet_chat 原图高 122，勿压扁否则阴影会糊' })
    public bubbleMinHeight: number = 122;

    @property({ tooltip: '右侧喂食图标槽宽度（像素）' })
    public actionIconWidth: number = 56;

    public static instance: PetInfoBar | null = null;

    private _extraText: string = '';
    private _firstOpenText: string = '';
    private _pendingFirstOpenTips = false;
    private _pendingShortLivedText: string = '';
    private _showingPerMinuteLimitHint = false;
    private _showingUserHint = false;
    private _greetingBarDismissed = false;
    private _feedPromptActive = false;
    private _feedPromptText: string = '';
    private _sleepBubbleActive = false;

    private _bubbleSprite: Sprite | null = null;
    private _actionNode: Node | null = null;
    private _actionSprite: Sprite | null = null;
    private _chromeReady = false;

    private static readonly GREETING_BAR_DURATION = 4.5;

    onLoad() {
        PetInfoBar.instance = this;
        TokitChatService.startRemoteConfigOnLaunch();
        if (!sys.localStorage.getItem(STORAGE_KEY_FIRST_OPEN_DONE)) {
            this._pendingFirstOpenTips = true;
        }
        this._ensureBubbleChrome();
    }

    private _dismissGreetingBar = () => {
        if (this._firstOpenText) {
            this.scheduleOnce(this._dismissGreetingBar, PetInfoBar.GREETING_BAR_DURATION);
            return;
        }
        this._greetingBarDismissed = true;
        if (!this._showingPerMinuteLimitHint && !this._showingUserHint) {
            this._syncBarVisibility();
        }
        this.refreshLowHpFeedPrompt();
        this.refreshSleepBubble(PetInfoBar.isActivePetSleeping());
    };

    /** 当前前台狗/猫是否在播睡觉动画 03 */
    public static isActivePetSleeping(): boolean {
        const isCat = sys.localStorage.getItem('petai_pet_choice') === 'cat';
        const node = find(isCat ? 'Canvas/cat' : 'Canvas/dog');
        if (!node?.active) return false;
        const anim = node.getComponent(Animation);
        if (!anim) return false;
        const sleepClip = `${isCat ? 'cat' : 'dog'}03`;
        const state = anim.getState(sleepClip);
        return !!(state?.isPlaying);
    }

    /** 睡觉态：对话框显示 Zzz（低体力喂食提示优先） */
    public refreshSleepBubble(isSleeping: boolean): void {
        if (!this.isValid) return;
        const pv = PetValue.instance;
        if (pv?.shouldShowFeedBubble()) {
            this._sleepBubbleActive = false;
            return;
        }
        if (this._showingUserHint || this._showingPerMinuteLimitHint) {
            if (!isSleeping) this._sleepBubbleActive = false;
            return;
        }
        if (this._firstOpenText) {
            if (!isSleeping) this._sleepBubbleActive = false;
            return;
        }

        this._sleepBubbleActive = isSleeping;
        if (isSleeping) {
            this._setActionVisible(false);
            this._presentBubble(getSleepBubbleTip());
        } else {
            this._applyText();
        }
    }

    /** 恢复被动气泡（低体力 / 睡觉），不强制显示空气泡 */
    public syncPassiveBubble(): void {
        if (!this.isValid) return;
        this.refreshLowHpFeedPrompt();
        if (!this._feedPromptActive) {
            this.refreshSleepBubble(PetInfoBar.isActivePetSleeping());
        }
    }

    onDestroy() {
        if (PetInfoBar.instance === this) {
            PetInfoBar.instance = null;
        }
        this.unschedule(this._dismissGreetingBar);
        try {
            game.off(Game.EVENT_SHOW, this._onGameShow, this);
            game.off(Game.EVENT_HIDE, this._onGameHide, this);
        } catch { /* ignore */ }
        if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', this._onVisibilityChange);
        }
        this.unschedule(this._clearShortLivedTip);
        this.unschedule(this._clearPerMinuteLimitHint);
        this.unschedule(this._clearUserHint);
    }

    start() {
        this._ensureBubbleChrome();
        this._applyBubbleTextStyle();
        this._applyHorizontalPaddingForText('');
        try {
            game.on(Game.EVENT_SHOW, this._onGameShow, this);
            game.on(Game.EVENT_HIDE, this._onGameHide, this);
        } catch {
            if (typeof document !== 'undefined') {
                document.addEventListener('visibilitychange', this._onVisibilityChange);
            }
        }
        if (this._pendingFirstOpenTips) {
            this._pendingFirstOpenTips = false;
            if (!this._firstOpenText) {
                this._firstOpenText = getFirstOpenTip();
                try {
                    sys.localStorage.setItem(STORAGE_KEY_FIRST_OPEN_DONE, '1');
                } catch { /* ignore */ }
            }
            this._applyText();
        }
        this.scheduleOnce(this._dismissGreetingBar, PetInfoBar.GREETING_BAR_DURATION);
        this.scheduleOnce(() => this.syncPassiveBubble(), 0.2);
    }

    private _onGameShow = () => {
        if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
            clearWidgetWeather();
        }
        this.syncPassiveBubble();
    };

    private _onGameHide = () => {
        // 不再向 Widget 同步主动类文案
    };

    private _onVisibilityChange = () => {
        if (typeof document === 'undefined') return;
        if (document.hidden) this._onGameHide();
        else this._onGameShow();
    };

    public setExtraText(text: string): void {
        this._extraText = text ?? '';
        this._applyText();
    }

    /** 已移除时段问候，保留空实现以免旧场景事件报错 */
    public setGreetingText(_text: string): void {
        // no-op
    }

    /** 体力偏低时显示喂食气泡（有次数 / 无次数文案不同） */
    public refreshLowHpFeedPrompt(): void {
        if (!this.isValid) return;
        const pv = PetValue.instance;
        if (!pv?.shouldShowFeedBubble()) {
            if (this._feedPromptActive) {
                this._feedPromptActive = false;
                this._feedPromptText = '';
                this._setActionVisible(false);
                this._applyText();
                this.refreshSleepBubble(PetInfoBar.isActivePetSleeping());
            }
            return;
        }
        this._sleepBubbleActive = false;
        if (this._showingUserHint || this._showingPerMinuteLimitHint) return;
        if (this._firstOpenText) return;

        const text = SharedBtnCounts.btn1 >= 1 ? getLowHpFeedBubbleTip() : getLowHpFeedEmptyTip();
        this._feedPromptActive = true;
        this._feedPromptText = text;
        this._setActionVisible(true);
        this._presentBubble(text);
    }

    private _onFeedActionTap = () => {
        const toggle = find('Canvas/TogglePet')?.getComponent(TogglePet);
        if (toggle) {
            toggle.onBtn1Click();
        } else {
            find('Canvas')?.getComponent(PetButtons)?.onBtn1Click();
        }
        this.scheduleOnce(() => this.refreshLowHpFeedPrompt(), 0.35);
    };

    private _getInAppDisplayText(): string {
        if (this._feedPromptActive && this._feedPromptText) return this._feedPromptText;
        if (this._sleepBubbleActive) return getSleepBubbleTip();
        if (this._firstOpenText) return this._firstOpenText;
        if (this._extraText) return this._extraText;
        return '';
    }

    private _applyText() {
        if (!this.textLabel) return;
        if (this._showingPerMinuteLimitHint || this._showingUserHint) return;

        const displayedInApp = this._getInAppDisplayText();
        const isFirstOpenShort = displayedInApp === this._firstOpenText;

        if (displayedInApp === this._firstOpenText) {
            this._firstOpenText = '';
        }

        this._setActionVisible(this._feedPromptActive);
        this._presentBubble(displayedInApp);

        if (isFirstOpenShort && displayedInApp) {
            if (this._pendingShortLivedText !== displayedInApp) {
                this._scheduleShortLivedClear(displayedInApp);
            }
        } else if (this._pendingShortLivedText) {
            this.unschedule(this._clearShortLivedTip);
            this._pendingShortLivedText = '';
        }
    }

    private _presentBubble(text: string): void {
        if (!this.textLabel) return;
        const t = (text || '').trim();
        if (!t && !this._feedPromptActive) {
            this.textLabel.string = '';
            this._syncBarVisibility();
            return;
        }
        this._applyHorizontalPaddingForText(t, this._feedPromptActive);
        this.textLabel.string = t;
        this._syncBarVisibility();
    }

    private _syncBarVisibility(): void {
        const hasText = !!(this.textLabel?.string?.trim());
        const show = hasText || this._showingUserHint || this._showingPerMinuteLimitHint
            || this._feedPromptActive || this._sleepBubbleActive;
        if (!show && this._greetingBarDismissed && !this._feedPromptActive && !this._sleepBubbleActive) {
            this.node.active = false;
            return;
        }
        if (show) {
            this.node.active = true;
        }
    }

    private _clearShortLivedTip = () => {
        if (!this.textLabel) return;
        if (this.textLabel.string !== this._pendingShortLivedText) {
            this._pendingShortLivedText = '';
            return;
        }
        this._pendingShortLivedText = '';
        this.textLabel.string = '';
        this._syncBarVisibility();
        this._applyText();
        this.refreshLowHpFeedPrompt();
    };

    private _scheduleShortLivedClear(text: string) {
        this.unschedule(this._clearShortLivedTip);
        this._pendingShortLivedText = text;
        this.scheduleOnce(this._clearShortLivedTip, 3);
    }

    public showPerMinuteLimitHint(text: string = getNotAgainTip()): void {
        if (!this.textLabel) return;
        this._applyHorizontalPaddingForText(text, false);
        this.unschedule(this._clearShortLivedTip);
        this._pendingShortLivedText = '';
        this.unschedule(this._clearPerMinuteLimitHint);
        this._showingPerMinuteLimitHint = true;
        this._setActionVisible(false);
        this.textLabel.string = text;
        this._bringBarToFront();
        this.node.active = true;
        this.scheduleOnce(this._clearPerMinuteLimitHint, 3);
    }

    private _clearPerMinuteLimitHint = () => {
        this.unschedule(this._clearPerMinuteLimitHint);
        this._showingPerMinuteLimitHint = false;
        this._applyText();
        this.syncPassiveBubble();
    };

    public showUserHint(text: string, seconds: number = 4): void {
        if (!this.textLabel) return;
        const t = (text ?? '').trim();
        if (!t) return;
        this._applyHorizontalPaddingForText(t, false);
        this.unschedule(this._clearShortLivedTip);
        this._pendingShortLivedText = '';
        this.unschedule(this._clearPerMinuteLimitHint);
        this._showingPerMinuteLimitHint = false;

        this._showingUserHint = true;
        this._setActionVisible(false);
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
        this.syncPassiveBubble();
    };

    public refreshTip(): void {
        this._applyText();
        this.refreshLowHpFeedPrompt();
    }

    public setBarVisible(visible: boolean): void {
        if (!visible) {
            this.node.active = false;
            return;
        }
        this._applyText();
        this.syncPassiveBubble();
    }

    public static setGlobalVisible(visible: boolean): void {
        PetInfoBar.instance?.setBarVisible(visible);
    }

    private _bringBarToFront(): void {
        const parent = this.node.parent;
        if (!parent || parent.children.length <= 1) return;
        const last = parent.children.length - 1;
        if (this.node.getSiblingIndex() !== last) {
            this.node.setSiblingIndex(last);
        }
    }

    private _applyBubbleTextStyle(): void {
        if (!this.textLabel) return;
        this.textLabel.fontSize = 34;
        this.textLabel.lineHeight = 44;
        this.textLabel.color = new Color(45, 42, 38, 255);
        this.textLabel.isBold = false;
    }

    private _ensureBubbleChrome(): void {
        if (this._chromeReady) return;
        this._chromeReady = true;

        this._bubbleSprite = this.node.getComponent(Sprite);
        if (this._bubbleSprite) {
            this._bubbleSprite.color = new Color(255, 255, 255, 255);
            // 使用场景/图集上的 Sliced 与九宫格边距，勿改 Fill（填充仅用于 FILLED 类型）
            this._bubbleSprite.sizeMode = Sprite.SizeMode.CUSTOM;
        }

        const legacyShadow = this.node.getChildByName('bubble_shadow');
        if (legacyShadow) legacyShadow.destroy();

        const native = this._getBubbleNativeSize();
        if (native.h > 0) {
            this.bubbleMinHeight = Math.max(this.bubbleMinHeight, native.h);
        }

        this._ensureActionButton();
    }

    /** pet_chat 等资源原始尺寸（带阴影的图不宜被纵向压扁） */
    private _getBubbleNativeSize(): { w: number; h: number } {
        const frame = this._bubbleSprite?.spriteFrame;
        if (!frame) return { w: 0, h: 0 };
        const r = frame.rect;
        return { w: r.width, h: r.height };
    }

    private _ensureActionButton(): void {
        if (this._actionNode?.isValid) return;

        const action = new Node('feed_action');
        const uit = action.addComponent(UITransform);
        uit.setContentSize(this.actionIconWidth, this.actionIconWidth);
        uit.setAnchorPoint(0.5, 0.5);

        const sp = action.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.CUSTOM;
        const btn1 = find('Canvas/btn/Button1');
        const src = btn1?.getComponent(Sprite) || btn1?.getComponentInChildren(Sprite);
        if (src?.spriteFrame) {
            sp.spriteFrame = src.spriteFrame;
        }
        sp.color = new Color(255, 255, 255, 255);

        const btn = action.addComponent(Button);
        btn.transition = Button.Transition.SCALE;
        btn.zoomScale = 1.08;
        action.on(Node.EventType.TOUCH_END, this._onFeedActionTap, this);

        this.node.addChild(action);
        this._actionNode = action;
        this._actionSprite = sp;
        action.active = false;

        const layout = this.node.getComponent(Layout);
        if (layout) {
            layout.type = Layout.Type.HORIZONTAL;
            layout.resizeMode = Layout.ResizeMode.CONTAINER;
            layout.paddingLeft = 22;
            layout.paddingRight = 16;
            layout.paddingTop = 12;
            layout.paddingBottom = 12;
            layout.spacingX = 8;
        }
    }

    private _setActionVisible(visible: boolean): void {
        this._ensureActionButton();
        if (this._actionNode) this._actionNode.active = visible;
    }

    private _applyHorizontalPaddingForText(text: string, withAction: boolean): void {
        if (!this.textLabel) return;
        const visible = view.getVisibleSize();
        const ratio = Math.min(0.5, Math.max(0, this.horizontalPaddingRatio));
        const inset = Math.max(0, this.horizontalEdgeInsetPx);
        const actionExtra = withAction ? this.actionIconWidth + 12 : 0;
        const maxWidth = Math.max(120, visible.width * (1 - ratio * 2) - inset * 2 - actionExtra);
        const t = (text || '').trim();

        const fontSize = Math.max(12, this.textLabel.fontSize || 34);
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
            const native = this._getBubbleNativeSize();
            const bubbleW = Math.max(this.bubbleMinWidth, targetWidth + this.bubblePaddingX * 2 + actionExtra);
            // 纵向保持原图高度，避免九宫格把阴影挤糊（pet_chat 上下 cap 各约 50px）
            const bubbleH = Math.max(this.bubbleMinHeight, native.h || 0);
            const bubbleTrans = this.node.getComponent(UITransform);
            if (bubbleTrans) {
                const bSize = bubbleTrans.contentSize;
                if (Math.abs(bSize.width - bubbleW) > 0.5 || Math.abs(bSize.height - bubbleH) > 0.5) {
                    bubbleTrans.setContentSize(bubbleW, bubbleH);
                }
            }
        }

        this.textLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
        this.textLabel.enableWrapText = true;
    }
}

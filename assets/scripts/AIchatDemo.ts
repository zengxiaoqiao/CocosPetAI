import { _decorator, Component, EditBox, Label, Button, Node, sys, find } from 'cc';
import { TokitChatService } from './llm_v2/TokitChatService';
import { PetInfoBar } from './PetInfoBar';
import { PetVocalizer } from './PetVocalizer';
import { PetWake } from './PetWake';
import { PetValue } from './PetValue';
import { DogController } from './DogController';
import { CatController } from './CatController';

const STORAGE_KEY_PET = 'petai_pet_choice';
const { ccclass, property } = _decorator;

@ccclass('AIChatDemo')
export class AIChatDemo extends Component {

    @property(EditBox)
    userInput: EditBox | null = null;

    @property(Label)
    aiReplyLabel: Label | null = null;

    @property(Button)
    sendBtn: Button | null = null;

    /** API 密钥（仅本地用，勿提交！配置后会同步到 TokitChatService） */
    @property({ tooltip: 'Tokit API Key，配置后 BtnMicroRecord 语音也会走同一 AI' })
    apiKey: string = '';

    @property({ tooltip: '兼容旧字段（不再使用）' })
    cozeToken: string = '';

    @property({ tooltip: '兼容旧字段（不再使用）' })
    cozeBotId: string = '';

    @property({ tooltip: '无输入框时：启动即自动发一条消息（仅用于 Demo 调试）', displayName: 'Auto Test On Start' })
    autoTestOnStart: boolean = false;

    @property({ tooltip: '自动测试要发的内容', displayName: 'Auto Test Message' })
    autoTestMessage: string = '你好';

    onLoad() {
        if (this.apiKey) TokitChatService.apiKey = this.apiKey;
        this._bindSendBtn();

        if (this.autoTestOnStart) {
            // Fire-and-forget demo test (no UI bindings required)
            this._runAutoTest();
        }
    }

    start() {
        // Double-bind to avoid missed bindings in some scene reload paths.
        this._bindSendBtn();
    }

    private _bindSendBtn() {
        if (!this.sendBtn) return;
        try {
            // Ensure button is actually clickable.
            (this.sendBtn as any).enabled = true;
            this.sendBtn.interactable = true;

            this.sendBtn.node.off(Button.EventType.CLICK, this.sendMessage, this);
            this.sendBtn.node.on(Button.EventType.CLICK, this.sendMessage, this);
            // Fallback touch hook (no UI text hint)
            this.sendBtn.node.off(Node.EventType.TOUCH_END, this._onSendBtnTouchEnd, this);
            this.sendBtn.node.on(Node.EventType.TOUCH_END, this._onSendBtnTouchEnd, this);
        } catch {
            // ignore
        }
    }

    private _onSendBtnTouchEnd() {
        // Intentionally no text: user requested not to show "clicked" hints.
    }

    private _applyChatRewards() {
        const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
        const petNode = isCat
            ? find('Canvas')?.getComponentInChildren(CatController)?.node
            : find('Canvas')?.getComponentInChildren(DogController)?.node;
        PetValue.instance?.applyVoiceChat(petNode ?? undefined);
    }

    private async _runAutoTest() {
        const label = this.aiReplyLabel;
        const msg = (this.autoTestMessage || '').trim() || '你好';
        try {
            if (label) label.string = '…';
            PetWake.nudgeAwake();
            const reply = await TokitChatService.sendMessage(msg);
            console.log('[AIChatDemo] autoTest reply:', reply);
            if (label) label.string = reply || '(empty)';
            if (reply) {
                this._applyChatRewards();
                PetInfoBar.instance?.showUserHint(reply, 6);
                PetWake.wakeToRespond();
                PetVocalizer.playReplyVocal(reply);
            }
        } catch (e) {
            console.warn('[AIChatDemo] autoTest error:', e);
            if (label) label.string = '出错了';
        }
    }

    async sendMessage() {
        const input = this.userInput;
        const label = this.aiReplyLabel;
        const msg = input?.string?.trim() ?? '';
        if (!msg) {
            if (label) label.string = '请输入对话内容~';
            PetInfoBar.instance?.showUserHint('唔…说点啥', 2);
            return;
        }

        // Only show "..." while waiting (no "you:" / "pet:" prefixes)
        PetInfoBar.instance?.showUserHint('…', 1.2);
        // If pet is sleeping/idle, nudge it awake for "thinking".
        PetWake.nudgeAwake();
        if (this.sendBtn) this.sendBtn.interactable = false;
        if (label) label.string = '…';

        try {
            const reply = await TokitChatService.sendMessage(msg);
            if (label) label.string = reply;
            if (reply) {
                this._applyChatRewards();
                PetInfoBar.instance?.showUserHint(reply, 6);
                PetWake.wakeToRespond();
                PetVocalizer.playReplyVocal(reply);
            }
            if (input) input.string = '';
        } catch (e) {
            if (label) label.string = `出错了：${(e as Error).message}`;
            console.error('对话请求错误：', e);
            PetInfoBar.instance?.showUserHint('呜…出错了', 2);
        } finally {
            if (this.sendBtn) this.sendBtn.interactable = true;
        }
    }

    /**
     * 供 BtnMicroRecord 等调用：传入文本，返回 AI 回复（不依赖 UI）
     */
    static async chat(text: string): Promise<string> {
        return TokitChatService.sendMessage(text);
    }
}

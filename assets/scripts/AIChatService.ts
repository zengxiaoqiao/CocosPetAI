/**
 * AI 对话服务：封装 OpenAI 等接口，供 AIChatDemo、BtnMicroRecord 等共用。
 */
export class AIChatService {

    /** Coze/扣子：个人访问令牌（PAT），Demo 可直接填在前端（不安全） */
    static cozeToken: string = '';

    /** Coze/扣子：bot_id */
    static cozeBotId: string = '';

    /** Coze/扣子：接口地址（默认国内） */
    static cozeApiUrl: string = 'https://api.coze.cn/v3/chat';

    /** Coze/扣子：旧版 open_api v2/chat（部分 PAT/账号只对该接口可用） */
    static cozeApiUrlV2: string = 'https://api.coze.cn/open_api/v2/chat';

    /** Coze/扣子：Demo 调试模式。开启后，扣子失败会返回可读错误，不会静默回退。 */
    static cozeDebug: boolean = true;

    /**
     * Coze/扣子：为 true 时禁用 v2 回退（v3 任一失败即报错）。
     * 默认 false：v3 首轮常无正文或偶发失败时可走 v2，避免「强制 v3」后整路对话挂掉。
     * 若需与预览环境严格对齐且只信任 v3，再在代码或启动处设为 true。
     */
    static cozeForceV3: boolean = false;

    /** Debug: last endpoint/version used (v3/v2). */
    static lastCozeEndpoint: 'v3' | 'v2' | '' = '';

    /** Debug: last conversation_id observed. */
    static lastCozeConversationId: string = '';

    /** OpenAI API 密钥（请在 Inspector 或代码中替换成你自己的） */
    static apiKey: string = 'sk-你的API密钥';

    /** 接口地址 */
    static apiUrl: string = 'https://api.openai.com/v1/chat/completions';

    /** 模型 */
    static model: string = 'gpt-3.5-turbo';

    /**
     * 发送消息并获取 AI 回复
     * @param userMessage 用户输入
     * @returns AI 回复文本（无可用服务时返回空串或调试提示）
     */
    static async sendMessage(userMessage: string): Promise<string> {
        // Prefer Coze/扣子 if configured (Demo)
        if (AIChatService.cozeToken && AIChatService.cozeBotId) {
            const r = await AIChatService.sendMessageByCoze(userMessage);
            if (r) return r;
            // Debug: never silently fall back, surface failure.
            if (AIChatService.cozeDebug) return '扣子失败…（看控制台）';
        }

        const key = AIChatService.apiKey;
        if (!key || key.includes('你的API密钥')) {
            return AIChatService.cozeDebug ? '没配对话服务…' : '';
        }

        try {
            const res = await fetch(AIChatService.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    model: AIChatService.model,
                    messages: [{ role: 'user', content: userMessage }],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`请求失败：${res.status} - ${text}`);
            }

            const result = await res.json();
            return (result.choices?.[0]?.message?.content ?? '').trim();
        } catch (e) {
            console.warn('[AIChatService] 请求失败', e);
            return AIChatService.cozeDebug ? '对话失败…' : '';
        }
    }

    private static _cozeUserId(): string {
        try {
            const k = 'petai_coze_user_id';
            const existing = (typeof localStorage !== 'undefined') ? localStorage.getItem(k) : null;
            if (existing) return existing;
            const id = 'u_' + Math.random().toString(16).slice(2) + Date.now().toString(16);
            if (typeof localStorage !== 'undefined') localStorage.setItem(k, id);
            return id;
        } catch {
            return 'u_' + Date.now();
        }
    }

    private static _cozeConversationKey(botId: string, userId: string): string {
        return `petai_coze_conv_${botId}_${userId}`;
    }

    private static _getCozeConversationId(botId: string, userId: string): string {
        try {
            if (typeof localStorage === 'undefined') return '';
            return (localStorage.getItem(AIChatService._cozeConversationKey(botId, userId)) || '').trim();
        } catch {
            return '';
        }
    }

    private static _setCozeConversationId(botId: string, userId: string, conversationId: string) {
        const cid = (conversationId || '').trim();
        if (!cid) return;
        try {
            if (typeof localStorage === 'undefined') return;
            localStorage.setItem(AIChatService._cozeConversationKey(botId, userId), cid);
        } catch {
            // ignore
        }
    }

    private static _extractConversationId(data: any): string {
        return (
            data?.data?.conversation_id ??
            data?.conversation_id ??
            data?.data?.conversationId ??
            data?.conversationId ??
            ''
        ).toString().trim();
    }

    /** v3 首轮响应里的单次对话 id，用于 retrieve / message/list 轮询 */
    private static _extractCozeChatId(data: any): string {
        const d = data?.data;
        const id = (d && typeof d === 'object' && !Array.isArray(d))
            ? (d.id ?? d.chat_id ?? d.chatId)
            : (data?.id ?? data?.chat_id ?? '');
        return (id || '').toString().trim();
    }

    private static _stringifyCozeMessageContent(content: any): string {
        if (content == null) return '';
        if (typeof content === 'string') return content;
        if (typeof content === 'number' || typeof content === 'boolean') return String(content);
        if (Array.isArray(content)) {
            return content.map((c) => AIChatService._stringifyCozeMessageContent(c)).join('');
        }
        if (typeof content === 'object') {
            if (typeof (content as any).text === 'string') return (content as any).text;
            try {
                return JSON.stringify(content);
            } catch {
                return '';
            }
        }
        return '';
    }

    /** 从单条 message 对象取助手可见文本（兼容 type=answer、缺 content_type、content 为对象） */
    private static _messageToAssistantText(m: any, onlyAnswerType: boolean): string {
        if (!m) return '';
        const role = (m.role || m.sender || '').toString().toLowerCase();
        if (role !== 'assistant' && role !== 'bot') return '';
        const mt = (m.type || '').toString().toLowerCase();
        if (onlyAnswerType && mt !== 'answer') return '';
        if (mt === 'verbose' || mt === 'function_call') return '';
        const raw = m.content ?? m.text;
        return AIChatService._stringifyCozeMessageContent(raw).trim();
    }

    private static _lastAssistantTextFromArray(messages: any[], onlyAnswerType: boolean): string {
        if (!Array.isArray(messages) || !messages.length) return '';
        for (let i = messages.length - 1; i >= 0; i--) {
            const t = AIChatService._messageToAssistantText(messages[i], onlyAnswerType);
            if (t) return t;
        }
        return '';
    }

    private static _extractCozeReply(data: any): string {
        const d = data?.data;

        // message/list：{ code, data: [ { role, type, content }, ... ] }
        if (Array.isArray(d) && d.length) {
            let t = AIChatService._lastAssistantTextFromArray(d, true);
            if (!t) t = AIChatService._lastAssistantTextFromArray(d, false);
            if (t) return t;
        }

        // 首轮或其它：{ data: { messages: [...] } }
        const messages = (d && typeof d === 'object' && !Array.isArray(d) ? d.messages : null)
            || data?.messages;
        if (Array.isArray(messages)) {
            let t = AIChatService._lastAssistantTextFromArray(messages, true);
            if (!t) t = AIChatService._lastAssistantTextFromArray(messages, false);
            if (t) return t;
        }

        // 少数返回在 data 根上带 content
        if (d && typeof d === 'object' && !Array.isArray(d)) {
            const top = AIChatService._stringifyCozeMessageContent(
                (d as any).content ?? (d as any).text ?? ''
            ).trim();
            const role = ((d as any).role || '').toString().toLowerCase();
            if (top && (role === 'assistant' || role === 'bot' || !(d as any).role)) {
                return top;
            }
        }

        const maybe = data?.data?.reply ?? data?.reply ?? data?.data?.message ?? '';
        return (maybe || '').toString().trim();
    }

    private static async _cozeGetJson(
        token: string,
        url: string,
    ): Promise<{ ok: boolean; status: number; json: any; raw: string }> {
        const res = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
        const raw = await res.text();
        let json: any = null;
        try { json = raw ? JSON.parse(raw) : null; } catch { /* ignore */ }
        return { ok: res.ok, status: res.status, json, raw };
    }

    /**
     * 非流式 v3 首轮常无正文，需轮询 retrieve + message/list（与官方/社区示例一致）。
     */
    private static async _cozePollV3Reply(
        token: string,
        chatId: string,
        conversationId: string,
    ): Promise<string> {
        const base = (AIChatService.cozeApiUrl || 'https://api.coze.cn/v3/chat').replace(/\/?$/, '');
        const q = `chat_id=${encodeURIComponent(chatId)}&conversation_id=${encodeURIComponent(conversationId)}`;
        const maxRetries = 35;
        const intervalMs = 1000;
        let sawCompleted = false;

        for (let i = 0; i < maxRetries; i++) {
            const r = await AIChatService._cozeGetJson(token, `${base}/retrieve?${q}`);
            if (!r.ok || !r.json) {
                if (AIChatService.cozeDebug) {
                    console.warn('[AIChatService][Coze][v3] retrieve http', r.status, r.raw?.slice?.(0, 500));
                }
                await new Promise((res) => setTimeout(res, intervalMs));
                continue;
            }
            if (typeof r.json.code === 'number' && r.json.code !== 0) {
                if (AIChatService.cozeDebug) {
                    console.warn('[AIChatService][Coze][v3] retrieve api error', r.json);
                }
                return '';
            }
            const status = (r.json?.data?.status ?? r.json?.data?.state ?? '').toString().toLowerCase();
            if (status === 'completed') {
                sawCompleted = true;
                break;
            }
            if (status === 'failed' || status === 'cancelled' || status === 'canceled') {
                if (AIChatService.cozeDebug) {
                    console.warn('[AIChatService][Coze][v3] retrieve terminal status', status, r.json?.data);
                }
                return '';
            }
            await new Promise((res) => setTimeout(res, intervalMs));
        }

        if (!sawCompleted && AIChatService.cozeDebug) {
            console.warn('[AIChatService][Coze][v3] retrieve did not report completed in time, trying message/list anyway');
        }

        const rList = await AIChatService._cozeGetJson(token, `${base}/message/list?${q}`);
        if (!rList.ok || !rList.json) {
            if (AIChatService.cozeDebug) {
                console.warn('[AIChatService][Coze][v3] message/list http', rList.status, rList.raw?.slice?.(0, 500));
            }
            return '';
        }
        if (typeof rList.json.code === 'number' && rList.json.code !== 0) {
            if (AIChatService.cozeDebug) console.warn('[AIChatService][Coze][v3] message/list api error', rList.json);
            return '';
        }
        return AIChatService._extractCozeReply(rList.json);
    }

    /** Coze/扣子直连（Demo）。失败返回空串，交给上层回退。 */
    static async sendMessageByCoze(userMessage: string): Promise<string> {
        // Token often gets pasted with whitespace/linebreaks, or even accidental separators.
        // Demo: aggressively sanitize to reduce false "token invalid" errors.
        const token = (AIChatService.cozeToken || '')
            .split('|')[0]
            .replace(/\s+/g, '')
            .trim();
        const botId = (AIChatService.cozeBotId || '').replace(/\s+/g, '').trim();
        if (!token || !botId) return '';

        const userId = AIChatService._cozeUserId();
        const conversationId = AIChatService._getCozeConversationId(botId, userId);

        const post = async (url: string, body: any): Promise<{ ok: boolean; status: number; json: any; raw: string }> => {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            const raw = await res.text();
            let json: any = null;
            try { json = raw ? JSON.parse(raw) : null; } catch {}
            return { ok: res.ok, status: res.status, json, raw };
        };

        try {
            // v3
            const r3 = await post(AIChatService.cozeApiUrl, {
                bot_id: botId,
                user_id: userId,
                conversation_id: conversationId || undefined,
                stream: false,
                auto_save_history: true,
                additional_messages: [
                    { role: 'user', content: userMessage, content_type: 'text' }
                ],
            });

            if (r3.ok && r3.json) {
                if (typeof r3.json.code === 'number' && r3.json.code !== 0) {
                    console.warn('[AIChatService][Coze][v3] api error', r3.json);
                    const msg = (r3.json.msg || r3.json.message || '').toString();
                    const logid = r3.json?.detail?.logid || r3.json?.logid || '';
                    if (AIChatService.cozeDebug) return `扣子失败(v3)：${msg || r3.json.code}${logid ? ` (${logid})` : ''}`;
                } else {
                    const cid = AIChatService._extractConversationId(r3.json);
                    if (cid) AIChatService._setCozeConversationId(botId, userId, cid);
                    AIChatService.lastCozeEndpoint = 'v3';
                    AIChatService.lastCozeConversationId = cid || conversationId || '';
                    if (AIChatService.cozeDebug) {
                        console.log('[AIChatService][Coze] using v3', { botId, userId, conversationId: AIChatService.lastCozeConversationId });
                    }
                    let text = AIChatService._extractCozeReply(r3.json);
                    if (!text) {
                        const chatId = AIChatService._extractCozeChatId(r3.json);
                        const conv = AIChatService._extractConversationId(r3.json) || conversationId;
                        if (chatId && conv) {
                            if (AIChatService.cozeDebug) {
                                console.log('[AIChatService][Coze][v3] first payload had no text, polling retrieve/list', { chatId, conv });
                            }
                            text = await AIChatService._cozePollV3Reply(token, chatId, conv);
                        } else if (AIChatService.cozeDebug) {
                            console.warn('[AIChatService][Coze][v3] empty reply, no chat_id for polling', {
                                keys: r3.json?.data && typeof r3.json.data === 'object' && !Array.isArray(r3.json.data)
                                    ? Object.keys(r3.json.data)
                                    : [],
                                rawHead: (r3.raw || '').slice(0, 800),
                            });
                        }
                    }
                    if (text) return text;
                }
            } else {
                console.warn('[AIChatService][Coze][v3] http error', r3.status, r3.raw);
                if (AIChatService.cozeForceV3) {
                    return AIChatService.cozeDebug ? `扣子失败(v3)：${r3.status}` : '';
                }
            }

            if (AIChatService.cozeForceV3) {
                return AIChatService.cozeDebug ? '扣子失败(v3)：空回复' : '';
            }

            // v2 fallback
            const r2 = await post(AIChatService.cozeApiUrlV2, {
                bot_id: botId,
                user: userId,
                conversation_id: conversationId || undefined,
                query: userMessage,
                stream: false,
            });
            if (!r2.ok || !r2.json) {
                console.warn('[AIChatService][Coze][v2] http error', r2.status, r2.raw);
                return AIChatService.cozeDebug ? `扣子失败(v2)：${r2.status}` : '';
            }

            if (typeof r2.json.code === 'number' && r2.json.code !== 0) {
                console.warn('[AIChatService][Coze][v2] api error', r2.json);
                const msg = (r2.json.msg || r2.json.message || '').toString();
                const logid = r2.json?.detail?.logid || r2.json?.logid || '';
                return AIChatService.cozeDebug ? `扣子失败(v2)：${msg || r2.json.code}${logid ? ` (${logid})` : ''}` : '';
            }

            // v2 response often in data.answer / data.output / messages
            const cid2 = AIChatService._extractConversationId(r2.json);
            if (cid2) AIChatService._setCozeConversationId(botId, userId, cid2);
            AIChatService.lastCozeEndpoint = 'v2';
            AIChatService.lastCozeConversationId = cid2 || conversationId || '';
            if (AIChatService.cozeDebug) {
                console.log('[AIChatService][Coze] using v2', { botId, userId, conversationId: AIChatService.lastCozeConversationId });
            }
            const t2 =
                (r2.json?.data?.answer ?? r2.json?.data?.output ?? r2.json?.data?.text ?? '')?.toString().trim()
                || AIChatService._extractCozeReply(r2.json);
            if (t2) return t2;
            return AIChatService.cozeDebug ? '扣子失败：空回复（看控制台）' : '';
        } catch (e) {
            console.warn('[AIChatService][Coze] request failed', e);
            return AIChatService.cozeDebug ? '扣子失败：请求异常' : '';
        }
    }
}

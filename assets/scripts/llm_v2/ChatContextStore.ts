export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
    role: ChatRole;
    content: string;
}

/**
 * Stores recent chat messages for context reuse.
 * Keeps at most 10 latest messages.
 */
export class ChatContextStore {
    private static readonly STORAGE_KEY = 'petai_llm_v2_recent_messages';
    private static readonly MAX_MESSAGES = 10;

    static getMessages(): ChatMessage[] {
        try {
            if (typeof localStorage === 'undefined') return [];
            const raw = localStorage.getItem(ChatContextStore.STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed
                .filter((m) => m && typeof m.role === 'string' && typeof m.content === 'string')
                .map((m) => ({ role: m.role as ChatRole, content: m.content.trim() }))
                .filter((m) => !!m.content);
        } catch {
            return [];
        }
    }

    static addMessage(role: ChatRole, content: string): void {
        const text = (content || '').trim();
        if (!text) return;
        const history = ChatContextStore.getMessages();
        history.push({ role, content: text });
        ChatContextStore.saveMessages(history);
    }

    static clear(): void {
        try {
            if (typeof localStorage === 'undefined') return;
            localStorage.removeItem(ChatContextStore.STORAGE_KEY);
        } catch {
            // ignore
        }
    }

    private static saveMessages(messages: ChatMessage[]): void {
        try {
            if (typeof localStorage === 'undefined') return;
            const trimmed = messages.slice(-ChatContextStore.MAX_MESSAGES);
            localStorage.setItem(ChatContextStore.STORAGE_KEY, JSON.stringify(trimmed));
        } catch {
            // ignore
        }
    }
}


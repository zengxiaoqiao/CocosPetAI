System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, ChatContextStore, _crd;

  _export("ChatContextStore", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "94eaaUh7hdCe6P+Bss3m+e/", "ChatContextStore", undefined);

      /**
       * Stores recent chat messages for context reuse.
       * Keeps at most 10 latest messages.
       */
      _export("ChatContextStore", ChatContextStore = class ChatContextStore {
        static getMessages() {
          try {
            if (typeof localStorage === 'undefined') return [];
            const raw = localStorage.getItem(ChatContextStore.STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(m => m && typeof m.role === 'string' && typeof m.content === 'string').map(m => ({
              role: m.role,
              content: m.content.trim()
            })).filter(m => !!m.content);
          } catch {
            return [];
          }
        }

        static addMessage(role, content) {
          const text = (content || '').trim();
          if (!text) return;
          const history = ChatContextStore.getMessages();
          history.push({
            role,
            content: text
          });
          ChatContextStore.saveMessages(history);
        }

        static clear() {
          try {
            if (typeof localStorage === 'undefined') return;
            localStorage.removeItem(ChatContextStore.STORAGE_KEY);
          } catch {// ignore
          }
        }

        static saveMessages(messages) {
          try {
            if (typeof localStorage === 'undefined') return;
            const trimmed = messages.slice(-ChatContextStore.MAX_MESSAGES);
            localStorage.setItem(ChatContextStore.STORAGE_KEY, JSON.stringify(trimmed));
          } catch {// ignore
          }
        }

      });

      ChatContextStore.STORAGE_KEY = 'petai_llm_v2_recent_messages';
      ChatContextStore.MAX_MESSAGES = 10;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d19093d77faffef73976431692a76752ce15416c.js.map
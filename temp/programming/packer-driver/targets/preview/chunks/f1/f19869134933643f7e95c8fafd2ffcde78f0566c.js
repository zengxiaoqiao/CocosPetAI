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
            var raw = localStorage.getItem(ChatContextStore.STORAGE_KEY);
            if (!raw) return [];
            var parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(m => m && typeof m.role === 'string' && typeof m.content === 'string').map(m => ({
              role: m.role,
              content: m.content.trim()
            })).filter(m => !!m.content);
          } catch (_unused) {
            return [];
          }
        }

        static addMessage(role, content) {
          var text = (content || '').trim();
          if (!text) return;
          var history = ChatContextStore.getMessages();
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
          } catch (_unused2) {// ignore
          }
        }

        static saveMessages(messages) {
          try {
            if (typeof localStorage === 'undefined') return;
            var trimmed = messages.slice(-ChatContextStore.MAX_MESSAGES);
            localStorage.setItem(ChatContextStore.STORAGE_KEY, JSON.stringify(trimmed));
          } catch (_unused3) {// ignore
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
//# sourceMappingURL=f19869134933643f7e95c8fafd2ffcde78f0566c.js.map
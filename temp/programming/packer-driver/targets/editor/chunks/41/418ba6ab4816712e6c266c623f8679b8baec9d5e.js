System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, AIChatService, _crd;

  _export("AIChatService", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "baa99G6DplBlZ0Lg9M+JHfz", "AIChatService", undefined);

      /**
       * AI 对话服务：封装 OpenAI 等接口，供 AIChatDemo、BtnMicroRecord 等共用。
       */
      _export("AIChatService", AIChatService = class AIChatService {
        /**
         * 发送消息并获取 AI 回复
         * @param userMessage 用户输入
         * @returns AI 回复文本（无可用服务时返回空串或调试提示）
         */
        static async sendMessage(userMessage) {
          // Prefer Coze/扣子 if configured (Demo)
          if (AIChatService.cozeToken && AIChatService.cozeBotId) {
            const r = await AIChatService.sendMessageByCoze(userMessage);
            if (r) return r; // Debug: never silently fall back, surface failure.

            if (AIChatService.cozeDebug) return '扣子失败…（看控制台）';
          }

          const key = AIChatService.apiKey;

          if (!key || key.includes('你的API密钥')) {
            return AIChatService.cozeDebug ? '没配对话服务…' : '';
          }

          try {
            var _result$choices$0$mes, _result$choices;

            const res = await fetch(AIChatService.apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
              },
              body: JSON.stringify({
                model: AIChatService.model,
                messages: [{
                  role: 'user',
                  content: userMessage
                }],
                temperature: 0.7,
                max_tokens: 500
              })
            });

            if (!res.ok) {
              const text = await res.text();
              throw new Error(`请求失败：${res.status} - ${text}`);
            }

            const result = await res.json();
            return ((_result$choices$0$mes = (_result$choices = result.choices) == null || (_result$choices = _result$choices[0]) == null || (_result$choices = _result$choices.message) == null ? void 0 : _result$choices.content) != null ? _result$choices$0$mes : '').trim();
          } catch (e) {
            console.warn('[AIChatService] 请求失败', e);
            return AIChatService.cozeDebug ? '对话失败…' : '';
          }
        }

        static _cozeUserId() {
          try {
            const k = 'petai_coze_user_id';
            const existing = typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null;
            if (existing) return existing;
            const id = 'u_' + Math.random().toString(16).slice(2) + Date.now().toString(16);
            if (typeof localStorage !== 'undefined') localStorage.setItem(k, id);
            return id;
          } catch {
            return 'u_' + Date.now();
          }
        }

        static _cozeConversationKey(botId, userId) {
          return `petai_coze_conv_${botId}_${userId}`;
        }

        static _getCozeConversationId(botId, userId) {
          try {
            if (typeof localStorage === 'undefined') return '';
            return (localStorage.getItem(AIChatService._cozeConversationKey(botId, userId)) || '').trim();
          } catch {
            return '';
          }
        }

        static _setCozeConversationId(botId, userId, conversationId) {
          const cid = (conversationId || '').trim();
          if (!cid) return;

          try {
            if (typeof localStorage === 'undefined') return;
            localStorage.setItem(AIChatService._cozeConversationKey(botId, userId), cid);
          } catch {// ignore
          }
        }

        static _extractConversationId(data) {
          var _ref, _ref2, _ref3, _data$data$conversati, _data$data, _data$data2;

          return ((_ref = (_ref2 = (_ref3 = (_data$data$conversati = data == null || (_data$data = data.data) == null ? void 0 : _data$data.conversation_id) != null ? _data$data$conversati : data == null ? void 0 : data.conversation_id) != null ? _ref3 : data == null || (_data$data2 = data.data) == null ? void 0 : _data$data2.conversationId) != null ? _ref2 : data == null ? void 0 : data.conversationId) != null ? _ref : '').toString().trim();
        }
        /** v3 首轮响应里的单次对话 id，用于 retrieve / message/list 轮询 */


        static _extractCozeChatId(data) {
          var _ref4, _d$id, _ref5, _data$id;

          const d = data == null ? void 0 : data.data;
          const id = d && typeof d === 'object' && !Array.isArray(d) ? (_ref4 = (_d$id = d.id) != null ? _d$id : d.chat_id) != null ? _ref4 : d.chatId : (_ref5 = (_data$id = data == null ? void 0 : data.id) != null ? _data$id : data == null ? void 0 : data.chat_id) != null ? _ref5 : '';
          return (id || '').toString().trim();
        }

        static _stringifyCozeMessageContent(content) {
          if (content == null) return '';
          if (typeof content === 'string') return content;
          if (typeof content === 'number' || typeof content === 'boolean') return String(content);

          if (Array.isArray(content)) {
            return content.map(c => AIChatService._stringifyCozeMessageContent(c)).join('');
          }

          if (typeof content === 'object') {
            if (typeof content.text === 'string') return content.text;

            try {
              return JSON.stringify(content);
            } catch {
              return '';
            }
          }

          return '';
        }
        /** 从单条 message 对象取助手可见文本（兼容 type=answer、缺 content_type、content 为对象） */


        static _messageToAssistantText(m, onlyAnswerType) {
          var _m$content;

          if (!m) return '';
          const role = (m.role || m.sender || '').toString().toLowerCase();
          if (role !== 'assistant' && role !== 'bot') return '';
          const mt = (m.type || '').toString().toLowerCase();
          if (onlyAnswerType && mt !== 'answer') return '';
          if (mt === 'verbose' || mt === 'function_call') return '';
          const raw = (_m$content = m.content) != null ? _m$content : m.text;
          return AIChatService._stringifyCozeMessageContent(raw).trim();
        }

        static _lastAssistantTextFromArray(messages, onlyAnswerType) {
          if (!Array.isArray(messages) || !messages.length) return '';

          for (let i = messages.length - 1; i >= 0; i--) {
            const t = AIChatService._messageToAssistantText(messages[i], onlyAnswerType);

            if (t) return t;
          }

          return '';
        }

        static _extractCozeReply(data) {
          var _ref7, _ref8, _data$data$reply, _data$data3, _data$data4;

          const d = data == null ? void 0 : data.data; // message/list：{ code, data: [ { role, type, content }, ... ] }

          if (Array.isArray(d) && d.length) {
            let t = AIChatService._lastAssistantTextFromArray(d, true);

            if (!t) t = AIChatService._lastAssistantTextFromArray(d, false);
            if (t) return t;
          } // 首轮或其它：{ data: { messages: [...] } }


          const messages = (d && typeof d === 'object' && !Array.isArray(d) ? d.messages : null) || (data == null ? void 0 : data.messages);

          if (Array.isArray(messages)) {
            let t = AIChatService._lastAssistantTextFromArray(messages, true);

            if (!t) t = AIChatService._lastAssistantTextFromArray(messages, false);
            if (t) return t;
          } // 少数返回在 data 根上带 content


          if (d && typeof d === 'object' && !Array.isArray(d)) {
            var _ref6, _content;

            const top = AIChatService._stringifyCozeMessageContent((_ref6 = (_content = d.content) != null ? _content : d.text) != null ? _ref6 : '').trim();

            const role = (d.role || '').toString().toLowerCase();

            if (top && (role === 'assistant' || role === 'bot' || !d.role)) {
              return top;
            }
          }

          const maybe = (_ref7 = (_ref8 = (_data$data$reply = data == null || (_data$data3 = data.data) == null ? void 0 : _data$data3.reply) != null ? _data$data$reply : data == null ? void 0 : data.reply) != null ? _ref8 : data == null || (_data$data4 = data.data) == null ? void 0 : _data$data4.message) != null ? _ref7 : '';
          return (maybe || '').toString().trim();
        }

        static async _cozeGetJson(token, url) {
          const res = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const raw = await res.text();
          let json = null;

          try {
            json = raw ? JSON.parse(raw) : null;
          } catch {
            /* ignore */
          }

          return {
            ok: res.ok,
            status: res.status,
            json,
            raw
          };
        }
        /**
         * 非流式 v3 首轮常无正文，需轮询 retrieve + message/list（与官方/社区示例一致）。
         */


        static async _cozePollV3Reply(token, chatId, conversationId) {
          const base = (AIChatService.cozeApiUrl || 'https://api.coze.cn/v3/chat').replace(/\/?$/, '');
          const q = `chat_id=${encodeURIComponent(chatId)}&conversation_id=${encodeURIComponent(conversationId)}`;
          const maxRetries = 35;
          const intervalMs = 1000;
          let sawCompleted = false;

          for (let i = 0; i < maxRetries; i++) {
            var _ref9, _r$json$data$status, _r$json, _r$json2;

            const r = await AIChatService._cozeGetJson(token, `${base}/retrieve?${q}`);

            if (!r.ok || !r.json) {
              if (AIChatService.cozeDebug) {
                var _r$raw;

                console.warn('[AIChatService][Coze][v3] retrieve http', r.status, (_r$raw = r.raw) == null || _r$raw.slice == null ? void 0 : _r$raw.slice(0, 500));
              }

              await new Promise(res => setTimeout(res, intervalMs));
              continue;
            }

            if (typeof r.json.code === 'number' && r.json.code !== 0) {
              if (AIChatService.cozeDebug) {
                console.warn('[AIChatService][Coze][v3] retrieve api error', r.json);
              }

              return '';
            }

            const status = ((_ref9 = (_r$json$data$status = (_r$json = r.json) == null || (_r$json = _r$json.data) == null ? void 0 : _r$json.status) != null ? _r$json$data$status : (_r$json2 = r.json) == null || (_r$json2 = _r$json2.data) == null ? void 0 : _r$json2.state) != null ? _ref9 : '').toString().toLowerCase();

            if (status === 'completed') {
              sawCompleted = true;
              break;
            }

            if (status === 'failed' || status === 'cancelled' || status === 'canceled') {
              if (AIChatService.cozeDebug) {
                var _r$json3;

                console.warn('[AIChatService][Coze][v3] retrieve terminal status', status, (_r$json3 = r.json) == null ? void 0 : _r$json3.data);
              }

              return '';
            }

            await new Promise(res => setTimeout(res, intervalMs));
          }

          if (!sawCompleted && AIChatService.cozeDebug) {
            console.warn('[AIChatService][Coze][v3] retrieve did not report completed in time, trying message/list anyway');
          }

          const rList = await AIChatService._cozeGetJson(token, `${base}/message/list?${q}`);

          if (!rList.ok || !rList.json) {
            if (AIChatService.cozeDebug) {
              var _rList$raw;

              console.warn('[AIChatService][Coze][v3] message/list http', rList.status, (_rList$raw = rList.raw) == null || _rList$raw.slice == null ? void 0 : _rList$raw.slice(0, 500));
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


        static async sendMessageByCoze(userMessage) {
          // Token often gets pasted with whitespace/linebreaks, or even accidental separators.
          // Demo: aggressively sanitize to reduce false "token invalid" errors.
          const token = (AIChatService.cozeToken || '').split('|')[0].replace(/\s+/g, '').trim();
          const botId = (AIChatService.cozeBotId || '').replace(/\s+/g, '').trim();
          if (!token || !botId) return '';

          const userId = AIChatService._cozeUserId();

          const conversationId = AIChatService._getCozeConversationId(botId, userId);

          const post = async (url, body) => {
            const res = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(body)
            });
            const raw = await res.text();
            let json = null;

            try {
              json = raw ? JSON.parse(raw) : null;
            } catch {}

            return {
              ok: res.ok,
              status: res.status,
              json,
              raw
            };
          };

          try {
            var _ref10, _ref11, _ref12, _r2$json$data$answer, _r2$json3, _r2$json4, _r2$json5;

            // v3
            const r3 = await post(AIChatService.cozeApiUrl, {
              bot_id: botId,
              user_id: userId,
              conversation_id: conversationId || undefined,
              stream: false,
              auto_save_history: true,
              additional_messages: [{
                role: 'user',
                content: userMessage,
                content_type: 'text'
              }]
            });

            if (r3.ok && r3.json) {
              if (typeof r3.json.code === 'number' && r3.json.code !== 0) {
                var _r3$json, _r3$json2;

                console.warn('[AIChatService][Coze][v3] api error', r3.json);
                const msg = (r3.json.msg || r3.json.message || '').toString();
                const logid = ((_r3$json = r3.json) == null || (_r3$json = _r3$json.detail) == null ? void 0 : _r3$json.logid) || ((_r3$json2 = r3.json) == null ? void 0 : _r3$json2.logid) || '';
                if (AIChatService.cozeDebug) return `扣子失败(v3)：${msg || r3.json.code}${logid ? ` (${logid})` : ''}`;
              } else {
                const cid = AIChatService._extractConversationId(r3.json);

                if (cid) AIChatService._setCozeConversationId(botId, userId, cid);
                AIChatService.lastCozeEndpoint = 'v3';
                AIChatService.lastCozeConversationId = cid || conversationId || '';

                if (AIChatService.cozeDebug) {
                  console.log('[AIChatService][Coze] using v3', {
                    botId,
                    userId,
                    conversationId: AIChatService.lastCozeConversationId
                  });
                }

                let text = AIChatService._extractCozeReply(r3.json);

                if (!text) {
                  const chatId = AIChatService._extractCozeChatId(r3.json);

                  const conv = AIChatService._extractConversationId(r3.json) || conversationId;

                  if (chatId && conv) {
                    if (AIChatService.cozeDebug) {
                      console.log('[AIChatService][Coze][v3] first payload had no text, polling retrieve/list', {
                        chatId,
                        conv
                      });
                    }

                    text = await AIChatService._cozePollV3Reply(token, chatId, conv);
                  } else if (AIChatService.cozeDebug) {
                    var _r3$json3;

                    console.warn('[AIChatService][Coze][v3] empty reply, no chat_id for polling', {
                      keys: (_r3$json3 = r3.json) != null && _r3$json3.data && typeof r3.json.data === 'object' && !Array.isArray(r3.json.data) ? Object.keys(r3.json.data) : [],
                      rawHead: (r3.raw || '').slice(0, 800)
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
            } // v2 fallback


            const r2 = await post(AIChatService.cozeApiUrlV2, {
              bot_id: botId,
              user: userId,
              conversation_id: conversationId || undefined,
              query: userMessage,
              stream: false
            });

            if (!r2.ok || !r2.json) {
              console.warn('[AIChatService][Coze][v2] http error', r2.status, r2.raw);
              return AIChatService.cozeDebug ? `扣子失败(v2)：${r2.status}` : '';
            }

            if (typeof r2.json.code === 'number' && r2.json.code !== 0) {
              var _r2$json, _r2$json2;

              console.warn('[AIChatService][Coze][v2] api error', r2.json);
              const msg = (r2.json.msg || r2.json.message || '').toString();
              const logid = ((_r2$json = r2.json) == null || (_r2$json = _r2$json.detail) == null ? void 0 : _r2$json.logid) || ((_r2$json2 = r2.json) == null ? void 0 : _r2$json2.logid) || '';
              return AIChatService.cozeDebug ? `扣子失败(v2)：${msg || r2.json.code}${logid ? ` (${logid})` : ''}` : '';
            } // v2 response often in data.answer / data.output / messages


            const cid2 = AIChatService._extractConversationId(r2.json);

            if (cid2) AIChatService._setCozeConversationId(botId, userId, cid2);
            AIChatService.lastCozeEndpoint = 'v2';
            AIChatService.lastCozeConversationId = cid2 || conversationId || '';

            if (AIChatService.cozeDebug) {
              console.log('[AIChatService][Coze] using v2', {
                botId,
                userId,
                conversationId: AIChatService.lastCozeConversationId
              });
            }

            const t2 = ((_ref10 = (_ref11 = (_ref12 = (_r2$json$data$answer = (_r2$json3 = r2.json) == null || (_r2$json3 = _r2$json3.data) == null ? void 0 : _r2$json3.answer) != null ? _r2$json$data$answer : (_r2$json4 = r2.json) == null || (_r2$json4 = _r2$json4.data) == null ? void 0 : _r2$json4.output) != null ? _ref12 : (_r2$json5 = r2.json) == null || (_r2$json5 = _r2$json5.data) == null ? void 0 : _r2$json5.text) != null ? _ref11 : '') == null ? void 0 : _ref10.toString().trim()) || AIChatService._extractCozeReply(r2.json);

            if (t2) return t2;
            return AIChatService.cozeDebug ? '扣子失败：空回复（看控制台）' : '';
          } catch (e) {
            console.warn('[AIChatService][Coze] request failed', e);
            return AIChatService.cozeDebug ? '扣子失败：请求异常' : '';
          }
        }

      });

      /** Coze/扣子：个人访问令牌（PAT），Demo 可直接填在前端（不安全） */
      AIChatService.cozeToken = '';

      /** Coze/扣子：bot_id */
      AIChatService.cozeBotId = '';

      /** Coze/扣子：接口地址（默认国内） */
      AIChatService.cozeApiUrl = 'https://api.coze.cn/v3/chat';

      /** Coze/扣子：旧版 open_api v2/chat（部分 PAT/账号只对该接口可用） */
      AIChatService.cozeApiUrlV2 = 'https://api.coze.cn/open_api/v2/chat';

      /** Coze/扣子：Demo 调试模式。开启后，扣子失败会返回可读错误，不会静默回退。 */
      AIChatService.cozeDebug = true;

      /**
       * Coze/扣子：为 true 时禁用 v2 回退（v3 任一失败即报错）。
       * 默认 false：v3 首轮常无正文或偶发失败时可走 v2，避免「强制 v3」后整路对话挂掉。
       * 若需与预览环境严格对齐且只信任 v3，再在代码或启动处设为 true。
       */
      AIChatService.cozeForceV3 = false;

      /** Debug: last endpoint/version used (v3/v2). */
      AIChatService.lastCozeEndpoint = '';

      /** Debug: last conversation_id observed. */
      AIChatService.lastCozeConversationId = '';

      /** OpenAI API 密钥（请在 Inspector 或代码中替换成你自己的） */
      AIChatService.apiKey = 'sk-你的API密钥';

      /** 接口地址 */
      AIChatService.apiUrl = 'https://api.openai.com/v1/chat/completions';

      /** 模型 */
      AIChatService.model = 'gpt-3.5-turbo';

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=418ba6ab4816712e6c266c623f8679b8baec9d5e.js.map
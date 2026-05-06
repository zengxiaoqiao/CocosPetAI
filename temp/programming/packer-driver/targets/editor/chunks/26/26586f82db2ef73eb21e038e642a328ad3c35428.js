System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, buildLlmConfigRequestBody, LLM_HTTP_TIMEOUT_MS, xhrPost, _crd, CONFIG_URL, LOG_TAG;

  /** 仅接受非空字符串；空串表示服务端未下发该项，客户端保留兜底。 */
  function nonEmptyField(v) {
    if (typeof v !== 'string') return '';
    const t = v.trim();
    return t.length > 0 ? t : '';
  }
  /**
   * 与服务器约定一致：
   * { success, errorCode, errorMessage, ..., data: { apiUrl, apiKey, model } }
   */


  function normalizePayload(raw) {
    if (!raw || typeof raw !== 'object') {
      throw new Error('LLM 配置返回体无效');
    }

    if ('success' in raw && raw.success !== true) {
      const err = nonEmptyField(raw.errorMessage) || (raw.errorCode != null ? String(raw.errorCode) : '') || 'success=false';
      throw new Error(`LLM 配置业务失败：${err}`);
    }

    const data = raw.data;

    if (!data || typeof data !== 'object') {
      throw new Error('LLM 配置缺少 data 对象');
    }

    return {
      apiUrl: nonEmptyField(data.apiUrl),
      apiKey: nonEmptyField(data.apiKey),
      model: nonEmptyField(data.model)
    };
  }
  /**
   * POST 拉取 LLM 远程配置；失败时抛出异常，由调用方决定是否保留默认写死的兜底值。
   */


  async function fetchLlmRemoteConfig() {
    const body = (_crd && buildLlmConfigRequestBody === void 0 ? (_reportPossibleCrUseOfbuildLlmConfigRequestBody({
      error: Error()
    }), buildLlmConfigRequestBody) : buildLlmConfigRequestBody)();
    const bodyJson = JSON.stringify(body);
    console.log(`${LOG_TAG} request ${JSON.stringify({
      url: CONFIG_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })}`);
    let status;
    let ok;
    let text;
    let statusText;

    if (sys.isNative) {
      const r = await (_crd && xhrPost === void 0 ? (_reportPossibleCrUseOfxhrPost({
        error: Error()
      }), xhrPost) : xhrPost)(CONFIG_URL, bodyJson, {
        'Content-Type': 'application/json'
      }, _crd && LLM_HTTP_TIMEOUT_MS === void 0 ? (_reportPossibleCrUseOfLLM_HTTP_TIMEOUT_MS({
        error: Error()
      }), LLM_HTTP_TIMEOUT_MS) : LLM_HTTP_TIMEOUT_MS);
      status = r.status;
      ok = r.ok;
      text = r.text;
      statusText = r.statusText;
    } else {
      const hasAbortController = typeof globalThis.AbortController === 'function';
      const controller = hasAbortController ? new globalThis.AbortController() : null;
      const fetchPromise = fetch(CONFIG_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: bodyJson,
        ...(controller ? {
          signal: controller.signal
        } : {})
      });
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          if (controller) {
            try {
              controller.abort();
            } catch {
              /* ignore */
            }
          }

          reject(new Error('LLM 配置请求超时'));
        }, _crd && LLM_HTTP_TIMEOUT_MS === void 0 ? (_reportPossibleCrUseOfLLM_HTTP_TIMEOUT_MS({
          error: Error()
        }), LLM_HTTP_TIMEOUT_MS) : LLM_HTTP_TIMEOUT_MS);
      });
      const res = await Promise.race([fetchPromise, timeoutPromise]);
      text = await res.text();
      status = res.status;
      ok = res.ok;
      statusText = res.statusText;
    }

    console.log(`${LOG_TAG} response ${JSON.stringify({
      status,
      statusText,
      ok,
      bodyRaw: text
    })}`);

    if (!ok) {
      throw new Error(`LLM 配置请求失败：${status} ${text}`);
    }

    let parsed = null;

    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(`LLM 配置返回非 JSON：${text}`);
    }

    console.log(`${LOG_TAG} response parsed ${JSON.stringify(parsed)}`);
    return normalizePayload(parsed);
  }

  function _reportPossibleCrUseOfbuildLlmConfigRequestBody(extras) {
    _reporterNs.report("buildLlmConfigRequestBody", "./LlmConfigParams", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLLM_HTTP_TIMEOUT_MS(extras) {
    _reporterNs.report("LLM_HTTP_TIMEOUT_MS", "./HttpTimeouts", _context.meta, extras);
  }

  function _reportPossibleCrUseOfxhrPost(extras) {
    _reporterNs.report("xhrPost", "./NativeXhrHttp", _context.meta, extras);
  }

  _export("fetchLlmRemoteConfig", fetchLlmRemoteConfig);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      buildLlmConfigRequestBody = _unresolved_2.buildLlmConfigRequestBody;
    }, function (_unresolved_3) {
      LLM_HTTP_TIMEOUT_MS = _unresolved_3.LLM_HTTP_TIMEOUT_MS;
    }, function (_unresolved_4) {
      xhrPost = _unresolved_4.xhrPost;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e7b2aHJP05dYLfIGis8TV5v", "LlmRemoteConfig", undefined);

      __checkObsolete__(['sys']);

      CONFIG_URL = 'https://abroad.umeweb.cn/api/ai/v1/config';
      LOG_TAG = '[LlmRemoteConfig]';

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=26586f82db2ef73eb21e038e642a328ad3c35428.js.map
System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, buildLlmConfigRequestBody, LLM_HTTP_TIMEOUT_MS, xhrPost, _crd, CONFIG_URL, LOG_TAG;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  /** 仅接受非空字符串；空串表示服务端未下发该项，客户端保留兜底。 */
  function nonEmptyField(v) {
    if (typeof v !== 'string') return '';
    var t = v.trim();
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
      var err = nonEmptyField(raw.errorMessage) || (raw.errorCode != null ? String(raw.errorCode) : '') || 'success=false';
      throw new Error("LLM \u914D\u7F6E\u4E1A\u52A1\u5931\u8D25\uFF1A" + err);
    }

    var data = raw.data;

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


  function fetchLlmRemoteConfig() {
    return _fetchLlmRemoteConfig.apply(this, arguments);
  }

  function _fetchLlmRemoteConfig() {
    _fetchLlmRemoteConfig = _asyncToGenerator(function* () {
      var body = (_crd && buildLlmConfigRequestBody === void 0 ? (_reportPossibleCrUseOfbuildLlmConfigRequestBody({
        error: Error()
      }), buildLlmConfigRequestBody) : buildLlmConfigRequestBody)();
      var bodyJson = JSON.stringify(body);
      console.log(LOG_TAG + " request " + JSON.stringify({
        url: CONFIG_URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      }));
      var status;
      var ok;
      var text;
      var statusText;

      if (sys.isNative) {
        var r = yield (_crd && xhrPost === void 0 ? (_reportPossibleCrUseOfxhrPost({
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
        var hasAbortController = typeof globalThis.AbortController === 'function';
        var controller = hasAbortController ? new globalThis.AbortController() : null;
        var fetchPromise = fetch(CONFIG_URL, _extends({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: bodyJson
        }, controller ? {
          signal: controller.signal
        } : {}));
        var timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            if (controller) {
              try {
                controller.abort();
              } catch (_unused) {
                /* ignore */
              }
            }

            reject(new Error('LLM 配置请求超时'));
          }, _crd && LLM_HTTP_TIMEOUT_MS === void 0 ? (_reportPossibleCrUseOfLLM_HTTP_TIMEOUT_MS({
            error: Error()
          }), LLM_HTTP_TIMEOUT_MS) : LLM_HTTP_TIMEOUT_MS);
        });
        var res = yield Promise.race([fetchPromise, timeoutPromise]);
        text = yield res.text();
        status = res.status;
        ok = res.ok;
        statusText = res.statusText;
      }

      console.log(LOG_TAG + " response " + JSON.stringify({
        status,
        statusText,
        ok,
        bodyRaw: text
      }));

      if (!ok) {
        throw new Error("LLM \u914D\u7F6E\u8BF7\u6C42\u5931\u8D25\uFF1A" + status + " " + text);
      }

      var parsed = null;

      try {
        parsed = text ? JSON.parse(text) : null;
      } catch (_unused2) {
        throw new Error("LLM \u914D\u7F6E\u8FD4\u56DE\u975E JSON\uFF1A" + text);
      }

      console.log(LOG_TAG + " response parsed " + JSON.stringify(parsed));
      return normalizePayload(parsed);
    });
    return _fetchLlmRemoteConfig.apply(this, arguments);
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
//# sourceMappingURL=2e8e23db63293c5873fc70ca32514a0cec30d76d.js.map
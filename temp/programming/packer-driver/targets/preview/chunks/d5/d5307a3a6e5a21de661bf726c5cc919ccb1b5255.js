System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd;

  /**
   * 原生 POST：通过 xhr.timeout 设置连接/读取超时（毫秒），与业务层一致。
   */
  function xhrPost(url, body, headers, timeoutMs) {
    return new Promise((resolve, reject) => {
      var XHR = globalThis.XMLHttpRequest;

      if (typeof XHR !== 'function') {
        reject(new Error('XMLHttpRequest 不可用'));
        return;
      }

      var xhr = new XHR();
      xhr.open('POST', url, true);

      for (var [k, v] of Object.entries(headers)) {
        xhr.setRequestHeader(k, v);
      }

      xhr.timeout = timeoutMs;

      xhr.onload = () => {
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          statusText: xhr.statusText != null ? String(xhr.statusText) : '',
          text: typeof xhr.responseText === 'string' ? xhr.responseText : ''
        });
      };

      xhr.onerror = () => reject(new TypeError('Network request failed'));

      xhr.ontimeout = () => reject(new Error('Request timeout'));

      xhr.send(body != null ? body : '');
    });
  }

  _export("xhrPost", xhrPost);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b4d5eb3gZKjtMXW5/gJGis8", "NativeXhrHttp", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d5307a3a6e5a21de661bf726c5cc919ccb1b5255.js.map
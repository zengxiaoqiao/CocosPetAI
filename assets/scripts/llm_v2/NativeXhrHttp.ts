export interface XhrPostResult {
    ok: boolean;
    status: number;
    statusText: string;
    text: string;
}

/**
 * 原生 POST：通过 xhr.timeout 设置连接/读取超时（毫秒），与业务层一致。
 */
export function xhrPost(
    url: string,
    body: string | null,
    headers: Record<string, string>,
    timeoutMs: number,
): Promise<XhrPostResult> {
    return new Promise((resolve, reject) => {
        const XHR = (globalThis as any).XMLHttpRequest;
        if (typeof XHR !== 'function') {
            reject(new Error('XMLHttpRequest 不可用'));
            return;
        }
        const xhr = new XHR();
        xhr.open('POST', url, true);
        for (const [k, v] of Object.entries(headers)) {
            xhr.setRequestHeader(k, v);
        }
        xhr.timeout = timeoutMs;
        xhr.onload = () => {
            resolve({
                ok: xhr.status >= 200 && xhr.status < 300,
                status: xhr.status,
                statusText: xhr.statusText != null ? String(xhr.statusText) : '',
                text: typeof xhr.responseText === 'string' ? xhr.responseText : '',
            });
        };
        xhr.onerror = () => reject(new TypeError('Network request failed'));
        xhr.ontimeout = () => reject(new Error('Request timeout'));
        xhr.send(body != null ? body : '');
    });
}

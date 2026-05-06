import { sys } from 'cc';
import { buildLlmConfigRequestBody } from './LlmConfigParams';
import { LLM_HTTP_TIMEOUT_MS } from './HttpTimeouts';
import { xhrPost } from './NativeXhrHttp';

const CONFIG_URL = 'https://abroad.umeweb.cn/api/ai/v1/config';
const LOG_TAG = '[LlmRemoteConfig]';

export type LlmRemoteConfigFields = {
    apiUrl?: string;
    apiKey?: string;
    model?: string;
};

/** 仅接受非空字符串；空串表示服务端未下发该项，客户端保留兜底。 */
function nonEmptyField(v: unknown): string {
    if (typeof v !== 'string') return '';
    const t = v.trim();
    return t.length > 0 ? t : '';
}

/**
 * 与服务器约定一致：
 * { success, errorCode, errorMessage, ..., data: { apiUrl, apiKey, model } }
 */
function normalizePayload(raw: any): LlmRemoteConfigFields {
    if (!raw || typeof raw !== 'object') {
        throw new Error('LLM 配置返回体无效');
    }
    if ('success' in raw && raw.success !== true) {
        const err =
            nonEmptyField(raw.errorMessage)
            || (raw.errorCode != null ? String(raw.errorCode) : '')
            || 'success=false';
        throw new Error(`LLM 配置业务失败：${err}`);
    }
    const data = raw.data;
    if (!data || typeof data !== 'object') {
        throw new Error('LLM 配置缺少 data 对象');
    }
    return {
        apiUrl: nonEmptyField(data.apiUrl),
        apiKey: nonEmptyField(data.apiKey),
        model: nonEmptyField(data.model),
    };
}

/**
 * POST 拉取 LLM 远程配置；失败时抛出异常，由调用方决定是否保留默认写死的兜底值。
 */
export async function fetchLlmRemoteConfig(): Promise<LlmRemoteConfigFields> {
    const body = buildLlmConfigRequestBody();
    const bodyJson = JSON.stringify(body);
    console.log(`${LOG_TAG} request ${JSON.stringify({
        url: CONFIG_URL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
    })}`);

    let status: number;
    let ok: boolean;
    let text: string;
    let statusText: string;

    if (sys.isNative) {
        const r = await xhrPost(
            CONFIG_URL,
            bodyJson,
            { 'Content-Type': 'application/json' },
            LLM_HTTP_TIMEOUT_MS,
        );
        status = r.status;
        ok = r.ok;
        text = r.text;
        statusText = r.statusText;
    } else {
        const hasAbortController = typeof (globalThis as any).AbortController === 'function';
        const controller = hasAbortController ? new (globalThis as any).AbortController() : null;

        const fetchPromise = fetch(CONFIG_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: bodyJson,
            ...(controller ? { signal: controller.signal } : {}),
        });

        const timeoutPromise = new Promise<Response>((_, reject) => {
            setTimeout(() => {
                if (controller) {
                    try { controller.abort(); } catch { /* ignore */ }
                }
                reject(new Error('LLM 配置请求超时'));
            }, LLM_HTTP_TIMEOUT_MS);
        });

        const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;
        text = await res.text();
        status = res.status;
        ok = res.ok;
        statusText = res.statusText;
    }

    console.log(`${LOG_TAG} response ${JSON.stringify({
        status,
        statusText,
        ok,
        bodyRaw: text,
    })}`);

    if (!ok) {
        throw new Error(`LLM 配置请求失败：${status} ${text}`);
    }
    let parsed: any = null;
    try {
        parsed = text ? JSON.parse(text) : null;
    } catch {
        throw new Error(`LLM 配置返回非 JSON：${text}`);
    }
    console.log(`${LOG_TAG} response parsed ${JSON.stringify(parsed)}`);
    return normalizePayload(parsed);
}

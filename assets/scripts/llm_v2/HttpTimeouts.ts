/**
 * 原生上 XMLHttpRequest 会映射到引擎 HttpRequest → Android HttpURLConnection；
 * 须显式设置 xhr.timeout，否则底层默认约 10s，会与业务层 Promise.race 不一致。
 */
export const LLM_HTTP_TIMEOUT_MS = 60000;

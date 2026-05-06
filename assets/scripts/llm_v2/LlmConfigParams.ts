import { native, sys } from 'cc';
import { getNativeAppVersionName } from '../AppVersion';

/**
 * 渠道优先级：
 * 1) localStorage `petai_llm_channel`（联调/灰度临时覆盖）
 * 2) Android manifest meta-data `PETAI_DISTRIBUTION_CHANNEL`（由 Gradle `PROP_APP_CHANNEL` 注入）
 * 3) 兜底 DEFAULT_CHANNEL（非 Android 或 meta 未配置时）
 */
const STORAGE_CHANNEL = 'petai_llm_channel';
const STORAGE_FALLBACK_UID = 'petai_llm_config_uid_fallback';
const DEFAULT_CHANNEL = 'GP_PET';
const DEFAULT_PKG = 'com.ume.petai';

function callAndroidConfigString(method: string, signature: string): string {
    if (!sys.isNative || sys.platform !== sys.Platform.ANDROID) return '';
    try {
        const nat = native as any;
        if (!nat?.reflection?.callStaticMethod) return '';
        const v = nat.reflection.callStaticMethod(
            'com/cocos/game/AppActivity',
            method,
            signature
        );
        return v != null ? String(v) : '';
    } catch {
        return '';
    }
}

function getOrCreateFallbackUid(): string {
    try {
        let u = sys.localStorage.getItem(STORAGE_FALLBACK_UID);
        if (u && u.length > 0) return u;
        u = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
        sys.localStorage.setItem(STORAGE_FALLBACK_UID, u);
        return u;
    } catch {
        return `anon_${Date.now()}`;
    }
}

function resolveUid(): string {
    const androidId = callAndroidConfigString('getConfigUid', '()Ljava/lang/String;');
    if (androidId) return androidId;
    return getOrCreateFallbackUid();
}

function resolvePkg(): string {
    const p = callAndroidConfigString('getAppPackageName', '()Ljava/lang/String;');
    if (p) return p;
    return DEFAULT_PKG;
}

function resolveDevice(): string {
    const m = callAndroidConfigString('getDeviceManufacturerLower', '()Ljava/lang/String;');
    if (m) return m;
    try {
        const os = (sys.os || '').toString().toLowerCase();
        if (os) return os;
    } catch {
        // ignore
    }
    return 'unknown';
}

function resolvePlatform(): string {
    if (sys.platform === sys.Platform.ANDROID) return '1';
    if (sys.platform === sys.Platform.IOS) return '2';
    return '0';
}

function resolveVersionCode(): string {
    const code = callAndroidConfigString('getAppVersionCodeString', '()Ljava/lang/String;');
    if (code) return code;
    return '0';
}

function resolveChannel(): string {
    try {
        const fromStorage = sys.localStorage.getItem(STORAGE_CHANNEL);
        if (fromStorage && fromStorage.trim()) return fromStorage.trim();
    } catch {
        // ignore
    }
    const fromManifest = callAndroidConfigString('getDistributionChannel', '()Ljava/lang/String;');
    if (fromManifest && fromManifest.trim()) return fromManifest.trim();
    return DEFAULT_CHANNEL;
}

/**
 * 构建远程配置接口请求体（字段与后台约定一致，均可本地覆盖/自动采集）。
 */
export function buildLlmConfigRequestBody(): Record<string, string> {
    const channel = resolveChannel();

    const versionName = getNativeAppVersionName() || '0.0.0';

    return {
        channel,
        versionName,
        versionCode: resolveVersionCode(),
        uid: resolveUid(),
        pkg: resolvePkg(),
        device: resolveDevice(),
        platform: resolvePlatform(),
    };
}

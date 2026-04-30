import { sys } from 'cc';

export type Lang = 'zh' | 'en';

/**
 * 语言跟随系统语言：
 * - 若系统语言以 zh 开头，则使用中文；
 * - 否则使用英文。
 * 不做本地覆盖存储，切换系统语言后下次启动游戏即可自动生效。
 */
function detectLang(): Lang {
    try {
        const code = ((sys as any).languageCode || (sys as any).language || 'zh').toString().toLowerCase();
        if (code.startsWith('zh')) return 'zh';
    } catch {
        // ignore
    }
    return 'en';
}

let _lang: Lang | null = null;

export function getLang(): Lang {
    if (!_lang) {
        _lang = detectLang();
    }
    return _lang;
}

export function isZh(): boolean {
    return getLang() === 'zh';
}


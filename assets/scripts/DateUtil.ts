import { sys } from 'cc';

declare const native: { reflection?: { callStaticMethod: (cls: string, method: string, sig: string, ...args: any[]) => any } } | undefined;

/**
 * 获取「当前日期」字符串（YYYY-MM-DD），用于每日边界判断（Check-in、体力/亲密扣减等）。
 * 在 Android 原生环境使用系统默认时区（TimeZone.getDefault()），保证「新的一天」从本地 0 点开始；
 * 其它环境使用 JS Date 的本地方法（若出现 11 点才换日等问题，多为引擎时区与设备不一致）。
 */
export function getLocalDateString(date?: Date): string {
    if (sys.platform === sys.Platform.ANDROID && sys.isNative && typeof native !== 'undefined') {
        try {
            if (native?.reflection?.callStaticMethod) {
                if (date === undefined) {
                    const ret = native.reflection.callStaticMethod(
                        'com/cocos/game/AppActivity',
                        'getLocalDateString',
                        '()Ljava/lang/String;'
                    );
                    if (typeof ret === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(ret)) return ret;
                } else {
                    const ret = native.reflection.callStaticMethod(
                        'com/cocos/game/AppActivity',
                        'getLocalDateStringForTimestamp',
                        '(J)Ljava/lang/String;',
                        date.getTime()
                    );
                    if (typeof ret === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(ret)) return ret;
                }
            }
        } catch (e) {
            console.warn('[DateUtil] getLocalDateString native failed', e);
        }
    }
    const d = date ?? new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/**
 * 获取「昨天」的日期字符串（设备本地时区）。
 */
export function getYesterdayDateString(): string {
    if (sys.platform === sys.Platform.ANDROID && sys.isNative && typeof native !== 'undefined') {
        try {
            if (native?.reflection?.callStaticMethod) {
                const now = Date.now();
                const yesterdayMs = now - 86400000;
                const ret = native.reflection.callStaticMethod(
                    'com/cocos/game/AppActivity',
                    'getLocalDateStringForTimestamp',
                    '(J)Ljava/lang/String;',
                    yesterdayMs
                );
                if (typeof ret === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(ret)) return ret;
            }
        } catch (e) {
            console.warn('[DateUtil] getYesterdayDateString native failed', e);
        }
    }
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return getLocalDateString(d);
}

const MS_PER_DAY = 86400000;

/**
 * 距离下一个「设备本地 0 点」的毫秒数，用于每日 0 点定时（如体力/亲密扣减）。
 * Android 原生使用系统时区计算；其它环境用 JS 本地时间。
 */
export function getMsUntilNextLocalMidnight(): number {
    if (sys.platform === sys.Platform.ANDROID && sys.isNative && typeof native !== 'undefined') {
        try {
            if (native?.reflection?.callStaticMethod) {
                const ret = native.reflection.callStaticMethod(
                    'com/cocos/game/AppActivity',
                    'getMsUntilNextLocalMidnight',
                    '()J'
                );
                if (typeof ret === 'number' && ret >= 0) return Math.floor(ret);
            }
        } catch (e) {
            console.warn('[DateUtil] getMsUntilNextLocalMidnight native failed', e);
        }
    }
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds(), ms = now.getMilliseconds();
    const msIntoDay = (h * 3600 + m * 60 + s) * 1000 + ms;
    return MS_PER_DAY - msIntoDay;
}

export { MS_PER_DAY };

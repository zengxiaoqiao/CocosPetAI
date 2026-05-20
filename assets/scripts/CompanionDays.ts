import { sys } from 'cc';
import { getLocalDateString, getYesterdayDateString } from './DateUtil';
import { formatCompanionDaysText } from './TipCopy';

const STORAGE_KEY_TOTAL = 'petai_companion_total_days';
const STORAGE_KEY_STREAK = 'petai_companion_streak_days';
const STORAGE_KEY_LAST_COUNTED = 'petai_companion_last_counted_date';

export interface CompanionDaysState {
    totalDays: number;
    streakDays: number;
}

function readInt(key: string, fallback = 0): number {
    const n = parseInt(sys.localStorage.getItem(key) || '', 10);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function getCompanionDaysState(): CompanionDaysState {
    return {
        totalDays: readInt(STORAGE_KEY_TOTAL, 0),
        streakDays: readInt(STORAGE_KEY_STREAK, 0),
    };
}

/**
 * 每个本地自然日首次进入时调用：累计陪伴 +1；连续天数在昨日也来过时 +1，否则置 1。
 * 同一天多次调用只计一次。
 */
export function recordCompanionVisitToday(): CompanionDaysState & { countedNewDay: boolean } {
    const today = getLocalDateString();
    const last = sys.localStorage.getItem(STORAGE_KEY_LAST_COUNTED) || '';
    let total = readInt(STORAGE_KEY_TOTAL, 0);
    let streak = readInt(STORAGE_KEY_STREAK, 0);

    if (last === today) {
        return { totalDays: total, streakDays: streak, countedNewDay: false };
    }

    const yesterday = getYesterdayDateString();
    if (last === yesterday) {
        streak += 1;
    } else {
        streak = 1;
    }
    total += 1;

    try {
        sys.localStorage.setItem(STORAGE_KEY_TOTAL, String(total));
        sys.localStorage.setItem(STORAGE_KEY_STREAK, String(streak));
        sys.localStorage.setItem(STORAGE_KEY_LAST_COUNTED, today);
    } catch (e) {
        console.warn('[CompanionDays] save failed', e);
    }

    return { totalDays: total, streakDays: streak, countedNewDay: true };
}

export function getCompanionDaysDisplayText(state?: CompanionDaysState): string {
    const s = state ?? getCompanionDaysState();
    return formatCompanionDaysText(s.totalDays, s.streakDays);
}

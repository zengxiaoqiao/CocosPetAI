/**
 * 所有提示文案集中在此文件：天气、早午晚安问候、宠物口吻等。
 * App 与 Widget 共用；PetInfoBar 使用。
 * 支持中英文，通过 Lang.getLang() 切换。
 */
import { getLang, isZh } from './Lang';

/** 新安装首次打开时显示的指引文案：第一句（仅一次，不弹 Check-in） */
export function getFirstOpenTip(): string {
    return isZh() ? '点我一下～' : 'Tap me~';
}

/** 新安装首次打开时显示的指引文案：第二句（紧接第一句之后，仅一次） */
export function getFirstOpenTipSecond(): string {
    return isZh() ? '滑一滑摸摸我（心情+5）' : 'Swipe to pet me (mood +5)';
}

/** 新安装首次打开时显示的指引文案：第三句（喂食提示） */
export function getFirstOpenTipThird(): string {
    return isZh() ? '喂我：体力+心情' : 'Feed me: HP & mood up';
}

/** 新安装首次打开时显示的指引文案：第四句（玩耍提示） */
export function getFirstOpenTipFourth(): string {
    return isZh() ? '陪我玩：心情+20' : 'Play with me (+20 mood)';
}

/** 新安装首次打开时显示的指引文案：第五句（梳毛提示） */
export function getFirstOpenTipFifth(): string {
    return isZh() ? '给我梳毛：心情更好' : 'Brush me: mood up';
}

/** Open‑Meteo weathercode → 人性化短文案（仅作参考，打招呼用只取 WEATHER_GREETING_CODES） */
export function getWeatherText(code: number): string {
    const zh: Record<number, string> = {
        0: '今天天气不错～',
        1: '天气还可以～',
        2: '有点云',
        3: '阴阴的',
        45: '起雾了，慢点走',
        48: '雾好大，小心点',
        51: '在下小雨～',
        53: '毛毛雨，带伞哦',
        55: '雨有点大～',
        61: '下雨啦，带伞～',
        63: '雨不小，别淋着',
        65: '大雨，别出门～',
        71: '下雪啦～',
        73: '雪有点大',
        75: '大雪，注意保暖～',
        80: '阵雨，记得带伞',
        81: '阵雨有点大～',
        82: '雷阵雨，躲一躲',
        95: '打雷啦，别怕～',
        96: '雷雨冰雹，别出门',
        99: '雷暴冰雹，小心～',
    };
    const en: Record<number, string> = {
        0: 'Nice weather~',
        1: 'Weather is okay~',
        2: 'Cloudy',
        3: 'Overcast',
        45: 'Foggy, walk slow',
        48: 'Heavy fog, be careful',
        51: 'Drizzle~',
        53: 'Light rain, take umbrella',
        55: 'Rainy~',
        61: 'Raining, take umbrella~',
        63: 'Heavy rain, stay dry',
        65: 'Downpour, stay in~',
        71: 'Snowing~',
        73: 'Snowy',
        75: 'Heavy snow, keep warm~',
        80: 'Showers, take umbrella',
        81: 'Heavy showers~',
        82: 'Thunderstorm, stay inside',
        95: 'Thunder, don’t be scared~',
        96: 'Storm with hail, stay in',
        99: 'Severe storm, be careful~',
    };
    const map = isZh() ? zh : en;
    return map[code] || '';
}

/** 适合做打招呼话题的天气码（排除「有点云」「阴阴的」等不咸不淡的） */
export const WEATHER_GREETING_CODES = new Set<number>([
    0,    // 天气不错呀～
    45, 48, 51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99, 71, 73, 75,
]);

export function isWeatherGoodForGreeting(code: number): boolean {
    return WEATHER_GREETING_CODES.has(code);
}

export type TimeRuleId = 'morning' | 'noon' | 'night';

export interface TimeRule {
    id: TimeRuleId;
    startHour: number;
    endHour: number;
    texts: string[];
}

/** 早 / 午 / 晚安问候，按时间段每天最多一条，短句（按当前语言返回规则集） */
export function getTimeRules(): TimeRule[] {
    if (isZh()) {
        return [
            {
                id: 'morning',
                startHour: 7,
                endHour: 10,
                texts: ['早安～', '早呀～', '早上好～'],
            },
            {
                id: 'noon',
                startHour: 11,
                endHour: 12,
                texts: ['快中午了～', '吃饭了吗？', '记得吃午饭～'],
            },
            {
                id: 'night',
                startHour: 21,
                endHour: 22,
                texts: ['时候不早了～', '10点我去睡觉了～', '别熬夜呀～'],
            },
        ];
    }
    return [
        {
            id: 'morning',
            startHour: 7,
            endHour: 10,
            texts: ['Morning~', 'Good morning~'],
        },
        {
            id: 'noon',
            startHour: 11,
            endHour: 12,
            texts: ['Almost noon~', 'Had lunch?'],
        },
        {
            id: 'night',
            startHour: 21,
            endHour: 22,
            texts: ['Getting late~', 'Don’t stay up~'],
        },
    ];
}

/** 今天一直没玩时提示（不高兴表情） */
export function getTodayNoPlayTip(): string {
    return isZh() ? '今天还没陪我玩' : 'You haven’t played with me';
}

/** 当日已领取 Check-in 后再次点击 ad 节点时的提示 */
export function getCheckinAlreadyClaimedTip(): string {
    return isZh() ? '今天已经领过了' : 'Already claimed today';
}

/** 体力为 0 或较低时的提示（配合 14 姿态），宠物口吻且简短 */
export function getHpZeroTip(): string {
    return isZh() ? '没力气啦，喂我～' : 'No energy, feed me~';
}

/** 亲密度偏低（心情很差）提示 */
export function getIntimacyZeroTip(): string {
    return isZh() ? '心情很差！' : 'Bad mood!';
}

/** 宠物口吻：今天被摸/逗的次数，pet 为 'cat' | 'dog'，count > 0 时返回次数句，count === 0 返回空（由调用方用 getTodayNoPlayTip） */
export function getTodayPetCountCopy(pet: string, count: number): string {
    if (count <= 0) return '';
    if (pet === 'cat') {
        return isZh() ? `今天摸我 ${count} 次～` : `You petted me ${count} times~`;
    }
    return isZh() ? `今天逗我 ${count} 次～` : `You played with me ${count} times~`;
}

/** 手机快没电：宠物口吻，level < 20% 时用 */
export function getBatteryLowTexts(): string[] {
    if (isZh()) {
        return ['快没电啦～', '电量很低～', '该充电啦～'];
    }
    return ['Battery low~', 'Battery very low~', 'Time to charge~'];
}

/** 无网络时的提示（目前仅 App 内使用；Widget 已仅用动画表现） */
export function getNetworkTipsNone(): string[] {
    if (isZh()) {
        return ['没网啦，检查网络～', '断网了，连上再玩～'];
    }
    return ['No network~', 'Go online to play~'];
}

/** 连续点击超过次数时的「Not again」提示 */
export function getNotAgainTip(): string {
    return isZh() ? '别再点啦，休息一下～' : 'Not again! Let me rest';
}

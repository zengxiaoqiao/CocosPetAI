/**
 * 所有提示文案集中在此文件：天气、早午晚安问候、宠物口吻等。
 * App 与 Widget 共用；PetInfoBar 使用。
 * 支持中英文，通过 Lang.getLang() 切换。
 */
import { getLang, isZh } from './Lang';

/** 新安装首次打开时显示的综合介绍（仅一次） */
export function getFirstOpenTip(): string {
    return isZh()
        ? '我是你的宠物伙伴，长按我或麦克风和我聊聊。'
        : "I'm your pet pal. Hold me or the mic to chat.";
}

/** 长按宠物未够时长时的提示 */
export function getMicHoldPetTip(): string {
    return isZh() ? '长按我说话' : 'Hold me to talk';
}

/** 陪伴累计天数 + 连续天数展示（连续未满 2 天不展示「连续」，避免首日出现「连续1天」） */
export function formatCompanionDaysText(totalDays: number, streakDays: number): string {
    const total = Math.max(0, totalDays | 0);
    const streak = Math.max(0, streakDays | 0);
    if (isZh()) {
        if (streak >= 2) return `陪伴${total}天，连续${streak}天`;
        return `陪伴${total}天`;
    }
    if (streak >= 2) return `${total} days together, ${streak}-day streak`;
    return `${total} days together`;
}

/** 麦克风按钮下方：空闲提示 */
export function getMicHoldToTalkTip(): string {
    return isZh() ? '按住 说话' : 'Hold to talk';
}

/** 麦克风：已按下、尚未进入录音 */
export function getMicKeepHoldingTip(): string {
    return isZh() ? '继续按住…' : 'Keep holding…';
}

/** 麦克风：录音中 */
export function getMicRecordingTip(): string {
    return isZh() ? '松开发送' : 'Release to send';
}

/** 麦克风：等待 AI 回复 */
export function getMicThinkingTip(): string {
    return isZh() ? '我想想…' : 'Thinking…';
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

/** 体力不足时，对话框内喂食引导（有喂食次数） */
export function getLowHpFeedBubbleTip(): string {
    return isZh() ? '我累了，喂我吃饭吧' : "I'm tired… feed me please";
}

/** 体力不足但喂食次数为 0 */
export function getLowHpFeedEmptyTip(): string {
    return isZh() ? '粮食不够啦，帮我补一点？' : 'No food left… help refill?';
}

/** 睡觉动画（03）时对话框内容 */
export function getSleepBubbleTip(): string {
    return isZh() ? 'Z z z …' : 'Zzz …';
}

/** 点击未解锁的猫：提示去商店订阅 */
export function getCatUnlockTip(): string {
    return isZh() ? '在商店订阅即可解锁猫咪' : 'Subscribe in the Shop to unlock the cat';
}

/** 商店界面固定英文（不随系统语言切换） */
export function getShopTitle(): string {
    return 'Shop';
}

export function getShopBackLabel(): string {
    return 'Back';
}

export function getShopSubscribeLabel(): string {
    return 'Subscribe';
}

export function getShopCatPriceLabel(): string {
    return '$0.99';
}

export function getShopCustomizePriceLabel(): string {
    return '$9.99';
}

/** 看广告获得 +1 道具次数 */
export function getShopFreeLabel(): string {
    return 'Free';
}

export function getShopCustomizePlaceholder(): string {
    return 'Your pet in the app\n(image placeholder)';
}

export function getShopOwnedLabel(): string {
    return 'Owned';
}

export function getShopEnterCustomizeLabel(): string {
    return 'Customize';
}

export function getShopCatProductTitle(): string {
    return 'Cat Companion';
}

export function getShopCatProductDesc(): string {
    return 'Subscribe to switch to the cat with unique animations.';
}

export function getShopCustomizeProductTitle(): string {
    return 'Custom Pet';
}

export function getShopCustomizeProductDesc(): string {
    return 'Subscribe to create your unique pet look (more coming soon).';
}

/** 定制页标题 */
export function getCustomizeComingSoonTitle(): string {
    return isZh() ? '即将开放' : 'Coming Soon';
}

/** 定制页副标题 */
export function getCustomizeComingSoonSubtitle(): string {
    return isZh()
        ? '宠物定制功能正在准备中，敬请期待。'
        : 'Pet customization is on the way. Stay tuned!';
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

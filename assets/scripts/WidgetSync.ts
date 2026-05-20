import { native, sys } from 'cc';

const STORAGE_KEY_PET = 'petai_pet_choice';
const STORAGE_KEY_HP = 'petai_hp';
const STORAGE_KEY_MOOD = 'petai_mood';
const STORAGE_KEY_MOOD_LEGACY = 'petai_intimacy';
/** 体力/心情实际最大值，与 PetValue 一致 */
const MAX_VALUE = 100;

/**
 * 将当前宠物、体力、心情同步到 Android 端，供桌面 Widget 动画状态使用。
 * 仅在 Android 原生环境调用 JSB，其它平台无操作。
 *
 * 说明：Widget 文案（提示句）只有 App 进程内调用 syncWidgetWeather 时才会更新，
 * 不打开 App 时无法刷新；退到后台前会再同步一次当前句，尽量保证桌面看到的是最近一句。
 */
export function syncWidgetData(pet: string, hp: number, mood: number): void {
    if (typeof pet !== 'string') pet = 'dog';
    if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;
    try {
        const nat = (native as any);
        if (nat?.reflection?.callStaticMethod) {
            nat.reflection.callStaticMethod(
                'com/cocos/game/PetWidgetSync',
                'sync',
                '(Ljava/lang/String;II)V',
                pet,
                Math.min(MAX_VALUE, Math.max(0, hp | 0)),
                Math.min(MAX_VALUE, Math.max(0, mood | 0))
            );
        }
    } catch (e) {
        console.warn('[WidgetSync] sync failed', e);
    }
}

/**
 * 从 localStorage 读取当前宠物状态并同步到 Widget（供 PetValue / TogglePet 调用）。
 */
export function syncWidgetFromStorage(): void {
    try {
        const pet = sys.localStorage.getItem(STORAGE_KEY_PET) || 'dog';
        const hp = Math.min(MAX_VALUE, Math.max(0, parseInt(sys.localStorage.getItem(STORAGE_KEY_HP) || '500', 10) || 0));
        const moodRaw = sys.localStorage.getItem(STORAGE_KEY_MOOD) ?? sys.localStorage.getItem(STORAGE_KEY_MOOD_LEGACY);
        const mood = Math.min(MAX_VALUE, Math.max(0, parseInt(moodRaw || '500', 10) || 0));
        syncWidgetData(pet, hp, mood);
    } catch (e) {
        console.warn('[WidgetSync] syncFromStorage failed', e);
    }
}

/**
 * 仅同步提示文案到 Widget（若产品需要）。
 */
export function syncWidgetWeather(text: string): void {
    if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;
    try {
        const nat = (native as any);
        if (nat?.reflection?.callStaticMethod) {
            nat.reflection.callStaticMethod(
                'com/cocos/game/PetWidgetSync',
                'syncWeather',
                '(Ljava/lang/String;)V',
                text ?? ''
            );
        }
    } catch (e) {
        console.warn('[WidgetSync] syncWeather failed', e);
    }
}

/** 清空 Widget 文案并刷新（充电时仅显示充电动画不显示文案用）。 */
export function clearWidgetWeather(): void {
    if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;
    try {
        const nat = (native as any);
        if (nat?.reflection?.callStaticMethod) {
            nat.reflection.callStaticMethod(
                'com/cocos/game/PetWidgetSync',
                'clearWeather',
                '()V'
            );
        }
    } catch (e) {
        console.warn('[WidgetSync] clearWeather failed', e);
    }
}

/**
 * 在 Android 上弹出系统“添加宠物 Widget 到桌面”的对话框（小号，兼容旧调用）。
 */
export function requestPinPetWidget(): void {
    requestPinPetWidgetSmall();
}

/** 弹出系统添加小号宠物 Widget 的对话框 */
export function requestPinPetWidgetSmall(): void {
    if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;
    try {
        const nat = (native as any);
        if (nat?.reflection?.callStaticMethod) {
            nat.reflection.callStaticMethod(
                'com/cocos/game/AppActivity',
                'requestPinPetWidgetSmall',
                '()V'
            );
        }
    } catch (e) {
        console.warn('[WidgetSync] requestPinPetWidgetSmall failed', e);
    }
}

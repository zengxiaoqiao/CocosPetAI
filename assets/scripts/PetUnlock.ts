import { director, sys } from 'cc';
import { RandomPlayPetAni } from './RandomPlayPetAni';

export const STORAGE_CAT_UNLOCKED = 'petai_cat_unlocked';
export const STORAGE_CUSTOMIZE_UNLOCKED = 'petai_customize_unlocked';
/** 已在定制流程中保存过宠物形象（选择条显示第三只入口） */
export const STORAGE_CUSTOM_PET_READY = 'petai_custom_pet_ready';
export const STORAGE_UNLOCK_INTENT = 'petai_unlock_intent';
export const STORAGE_SELECT_CAT_AFTER_UNLOCK = 'petai_select_cat_after_unlock';
export const STORAGE_SHOP_INTENT = 'petai_shop_intent';
/** 看完广告后返回的场景名（默认 home） */
export const STORAGE_RECHARGE_RETURN_SCENE = 'petai_recharge_return_scene';

export type ShopIntent = 'cat' | 'customize';

/** 猫咪是否已通过广告解锁 */
export function isCatUnlocked(): boolean {
    try {
        return sys.localStorage.getItem(STORAGE_CAT_UNLOCKED) === '1';
    } catch {
        return false;
    }
}

export function unlockCat(): void {
    try {
        sys.localStorage.setItem(STORAGE_CAT_UNLOCKED, '1');
    } catch (e) {
        console.warn('[PetUnlock] unlockCat failed', e);
    }
}

export function isCustomizeUnlocked(): boolean {
    try {
        return sys.localStorage.getItem(STORAGE_CUSTOMIZE_UNLOCKED) === '1';
    } catch {
        return false;
    }
}

export function unlockCustomize(): void {
    try {
        sys.localStorage.setItem(STORAGE_CUSTOMIZE_UNLOCKED, '1');
    } catch (e) {
        console.warn('[PetUnlock] unlockCustomize failed', e);
    }
}

/** 是否已有可切换的定制宠物（与「订阅解锁定制功能」区分） */
export function hasCustomPet(): boolean {
    try {
        return sys.localStorage.getItem(STORAGE_CUSTOM_PET_READY) === '1';
    } catch {
        return false;
    }
}

export function markCustomPetReady(): void {
    try {
        sys.localStorage.setItem(STORAGE_CUSTOM_PET_READY, '1');
    } catch (e) {
        console.warn('[PetUnlock] markCustomPetReady failed', e);
    }
}

export function setShopIntent(intent: ShopIntent | null): void {
    try {
        if (intent) sys.localStorage.setItem(STORAGE_SHOP_INTENT, intent);
        else sys.localStorage.removeItem(STORAGE_SHOP_INTENT);
    } catch { /* ignore */ }
}

export function consumeShopIntent(): ShopIntent | null {
    try {
        const v = sys.localStorage.getItem(STORAGE_SHOP_INTENT);
        sys.localStorage.removeItem(STORAGE_SHOP_INTENT);
        if (v === 'cat' || v === 'customize') return v;
        return null;
    } catch {
        return null;
    }
}

/** 打开商店；intent 用于进入后高亮对应商品 */
export function openShop(intent?: ShopIntent): void {
    setShopIntent(intent ?? null);
    director.loadScene('shop', (err) => {
        if (err) console.error('[PetUnlock] 无法加载 shop 场景', err);
    });
}

/** 商店道具格：看广告后为 Button1/2/3 +1，看完后回到 shop */
export function startShopPropAd(buttonIndex: 1 | 2 | 3): void {
    const choice = sys.localStorage.getItem('petai_pet_choice') || 'dog';
    const pet = choice === 'cat' ? 'cat' : 'dog';
    try {
        sys.localStorage.removeItem(STORAGE_UNLOCK_INTENT);
        sys.localStorage.setItem('recharge_pet', pet);
        sys.localStorage.setItem('recharge_button', String(buttonIndex));
        sys.localStorage.setItem(STORAGE_RECHARGE_RETURN_SCENE, 'shop');
    } catch (e) {
        console.warn('[PetUnlock] startShopPropAd storage failed', e);
    }
    RandomPlayPetAni.returnedFromAd = true;
    director.loadScene('ad', (err) => {
        if (err) console.error('[PetUnlock] 无法加载 ad 场景', err);
    });
}

/** 看广告解锁猫（道具等仍可用）；选择条解锁猫请走 openShop('cat') */
export function startCatUnlockAd(): void {
    try {
        sys.localStorage.setItem(STORAGE_UNLOCK_INTENT, 'cat');
        sys.localStorage.setItem('recharge_pet', 'cat');
        sys.localStorage.setItem('recharge_button', '0');
    } catch (e) {
        console.warn('[PetUnlock] startCatUnlockAd storage failed', e);
    }
    RandomPlayPetAni.returnedFromAd = true;
    director.loadScene('ad', (err) => {
        if (err) console.error('[PetUnlock] 无法加载 ad 场景', err);
    });
}

export function markSelectCatAfterUnlock(): void {
    try {
        sys.localStorage.setItem(STORAGE_SELECT_CAT_AFTER_UNLOCK, '1');
    } catch { /* ignore */ }
}

export function consumeSelectCatAfterUnlock(): boolean {
    try {
        if (sys.localStorage.getItem(STORAGE_SELECT_CAT_AFTER_UNLOCK) !== '1') return false;
        sys.localStorage.removeItem(STORAGE_SELECT_CAT_AFTER_UNLOCK);
        return true;
    } catch {
        return false;
    }
}

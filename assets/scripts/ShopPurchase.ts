import {
    isCatUnlocked, isCustomizeUnlocked, markSelectCatAfterUnlock, unlockCat, unlockCustomize,
} from './PetUnlock';

export type ShopProductId = 'cat' | 'customize';

/** 订阅商品 ID（接入 App Store / Google Play 时与此一致） */
export const SHOP_SKU = {
    cat: 'petai_sub_cat',
    customize: 'petai_sub_customize',
} as const;

/**
 * 发起订阅购买。当前为占位：直接完成解锁，便于联调；接入 IAP 后在此调用原生并回调。
 */
export function requestSubscription(product: ShopProductId): Promise<boolean> {
    return new Promise((resolve) => {
        try {
            if (product === 'cat') {
                if (!isCatUnlocked()) {
                    unlockCat();
                    markSelectCatAfterUnlock();
                }
            } else if (product === 'customize') {
                if (!isCustomizeUnlocked()) unlockCustomize();
            }
            resolve(true);
        } catch (e) {
            console.warn('[ShopPurchase] requestSubscription failed', e);
            resolve(false);
        }
    });
}

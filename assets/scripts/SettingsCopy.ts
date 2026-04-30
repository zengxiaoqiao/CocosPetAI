/**
 * 设置页文案（与 Lang.isZh() 一致）。
 */
import { isZh } from './Lang';

/** 隐私政策 Web 页 */
export const LEGAL_PRIVACY_URL = 'https://umestudio.net/pet/privacy.html';
/** 用户协议 Web 页 */
export const LEGAL_TERMS_URL = 'https://umestudio.net/pet/terms.html';

export function getSettingsVersionPrefix(): string {
    return isZh() ? '版本 ' : 'Version ';
}

/**
 * list-notification：说明开启通知读取后，任意 App 来通知时宠物会发声。
 */
export function getSettingsListNotification(): string {
    return isZh()
        ? '来通知时宠物会叫'
        : 'Sound on any app notification';
}

export function getSettingsListPrivacy(): string {
    return isZh() ? '隐私政策' : 'Privacy Policy';
}

export function getSettingsListTerms(): string {
    return isZh() ? '用户协议' : 'Terms of Service';
}

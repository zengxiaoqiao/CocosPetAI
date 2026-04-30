import { native, sys } from 'cc';

/** 原生包版本名（如 1.0.0）；非原生或失败返回空串。 */
export function getNativeAppVersionName(): string {
    if (!sys.isNative) return '';
    try {
        const nat = native as any;
        if (!nat?.reflection?.callStaticMethod) return '';
        if (sys.platform === sys.Platform.ANDROID) {
            return (
                nat.reflection.callStaticMethod(
                    'com/cocos/game/AppActivity',
                    'getAppVersionName',
                    '()Ljava/lang/String;'
                ) || ''
            ).toString();
        }
        if (sys.platform === sys.Platform.IOS) {
            return (nat.reflection.callStaticMethod('PetNativeASR', 'getAppVersionName') || '').toString();
        }
    } catch {
        // ignore
    }
    return '';
}

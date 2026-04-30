import { sys, native } from 'cc';

/**
 * Native ASR bridge (Android/iOS).
 *
 * Design:
 * - Native side performs system speech recognition and stores the latest final transcript.
 * - JS polls `pollResult()` to retrieve-and-clear the transcript.
 *
 * This avoids relying on JS callbacks (evalString) and keeps integration minimal.
 */
export class NativeASR {
    static isSupported(): boolean {
        return sys.isNative && (sys.platform === sys.Platform.ANDROID || sys.platform === sys.Platform.IOS);
    }

    static start(): void {
        if (!NativeASR.isSupported()) return;
        try {
            const nat = native as any;
            if (!nat?.reflection?.callStaticMethod) return;
            if (sys.platform === sys.Platform.ANDROID) {
                nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'startAutoAsr', '()V');
            } else {
                // iOS reflection signature differs; omit the JNI-style signature.
                nat.reflection.callStaticMethod('PetNativeASR', 'startAutoAsr');
            }
        } catch {
            // ignore
        }
    }

    static stop(): void {
        if (!NativeASR.isSupported()) return;
        try {
            const nat = native as any;
            if (!nat?.reflection?.callStaticMethod) return;
            if (sys.platform === sys.Platform.ANDROID) {
                nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'stopAutoAsr', '()V');
            } else {
                nat.reflection.callStaticMethod('PetNativeASR', 'stopAutoAsr');
            }
        } catch {
            // ignore
        }
    }

    /** Manual press-release ASR (Android): one-shot mode (no auto restart). */
    static startOnce(): void {
        if (!NativeASR.isSupported()) return;
        if (sys.platform !== sys.Platform.ANDROID) {
            // iOS impl is already closer to one-shot; reuse start/stop.
            NativeASR.start();
            return;
        }
        try {
            const nat = native as any;
            if (!nat?.reflection?.callStaticMethod) return;
            nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'startOnceAsr', '()V');
        } catch {
            // ignore
        }
    }

    static stopOnce(): void {
        if (!NativeASR.isSupported()) return;
        if (sys.platform !== sys.Platform.ANDROID) {
            NativeASR.stop();
            return;
        }
        try {
            const nat = native as any;
            if (!nat?.reflection?.callStaticMethod) return;
            nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'stopOnceAsr', '()V');
        } catch {
            // ignore
        }
    }

    /** Returns the latest transcript (and clears it) */
    static pollResult(): string {
        if (!NativeASR.isSupported()) return '';
        try {
            const nat = native as any;
            if (!nat?.reflection?.callStaticMethod) return '';
            if (sys.platform === sys.Platform.ANDROID) {
                return nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'pollAutoAsrResult', '()Ljava/lang/String;') || '';
            } else {
                return nat.reflection.callStaticMethod('PetNativeASR', 'pollAutoAsrResult') || '';
            }
        } catch {
            return '';
        }
    }

    /** Debug: returns "running,errCode" on Android, else empty. */
    static pollDebug(): string {
        if (!NativeASR.isSupported()) return '';
        try {
            const nat = native as any;
            if (!nat?.reflection?.callStaticMethod) return '';
            if (sys.platform === sys.Platform.ANDROID) {
                return nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'pollAutoAsrDebug', '()Ljava/lang/String;') || '';
            }
            return '';
        } catch {
            return '';
        }
    }
}


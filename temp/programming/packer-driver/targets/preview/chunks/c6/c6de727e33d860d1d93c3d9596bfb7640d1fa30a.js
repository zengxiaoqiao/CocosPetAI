System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, native, NativeASR, _crd;

  _export("NativeASR", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
      native = _cc.native;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6a1039fZrdDK4bzEShwITm7", "NativeASR", undefined);

      /**
       * Native ASR bridge (Android/iOS).
       *
       * Design:
       * - Native side performs system speech recognition and stores the latest final transcript.
       * - JS polls `pollResult()` to retrieve-and-clear the transcript.
       *
       * This avoids relying on JS callbacks (evalString) and keeps integration minimal.
       */
      __checkObsolete__(['sys', 'native']);

      _export("NativeASR", NativeASR = class NativeASR {
        static isSupported() {
          return sys.isNative && (sys.platform === sys.Platform.ANDROID || sys.platform === sys.Platform.IOS);
        }

        static start() {
          if (!NativeASR.isSupported()) return;

          try {
            var _nat$reflection;

            var nat = native;
            if (!(nat != null && (_nat$reflection = nat.reflection) != null && _nat$reflection.callStaticMethod)) return;

            if (sys.platform === sys.Platform.ANDROID) {
              nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'startAutoAsr', '()V');
            } else {
              // iOS reflection signature differs; omit the JNI-style signature.
              nat.reflection.callStaticMethod('PetNativeASR', 'startAutoAsr');
            }
          } catch (_unused) {// ignore
          }
        }

        static stop() {
          if (!NativeASR.isSupported()) return;

          try {
            var _nat$reflection2;

            var nat = native;
            if (!(nat != null && (_nat$reflection2 = nat.reflection) != null && _nat$reflection2.callStaticMethod)) return;

            if (sys.platform === sys.Platform.ANDROID) {
              nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'stopAutoAsr', '()V');
            } else {
              nat.reflection.callStaticMethod('PetNativeASR', 'stopAutoAsr');
            }
          } catch (_unused2) {// ignore
          }
        }
        /** Manual press-release ASR (Android): one-shot mode (no auto restart). */


        static startOnce() {
          if (!NativeASR.isSupported()) return;

          if (sys.platform !== sys.Platform.ANDROID) {
            // iOS impl is already closer to one-shot; reuse start/stop.
            NativeASR.start();
            return;
          }

          try {
            var _nat$reflection3;

            var nat = native;
            if (!(nat != null && (_nat$reflection3 = nat.reflection) != null && _nat$reflection3.callStaticMethod)) return;
            nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'startOnceAsr', '()V');
          } catch (_unused3) {// ignore
          }
        }

        static stopOnce() {
          if (!NativeASR.isSupported()) return;

          if (sys.platform !== sys.Platform.ANDROID) {
            NativeASR.stop();
            return;
          }

          try {
            var _nat$reflection4;

            var nat = native;
            if (!(nat != null && (_nat$reflection4 = nat.reflection) != null && _nat$reflection4.callStaticMethod)) return;
            nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'stopOnceAsr', '()V');
          } catch (_unused4) {// ignore
          }
        }
        /** Returns the latest transcript (and clears it) */


        static pollResult() {
          if (!NativeASR.isSupported()) return '';

          try {
            var _nat$reflection5;

            var nat = native;
            if (!(nat != null && (_nat$reflection5 = nat.reflection) != null && _nat$reflection5.callStaticMethod)) return '';

            if (sys.platform === sys.Platform.ANDROID) {
              return nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'pollAutoAsrResult', '()Ljava/lang/String;') || '';
            } else {
              return nat.reflection.callStaticMethod('PetNativeASR', 'pollAutoAsrResult') || '';
            }
          } catch (_unused5) {
            return '';
          }
        }
        /** Debug: returns "running,errCode" on Android, else empty. */


        static pollDebug() {
          if (!NativeASR.isSupported()) return '';

          try {
            var _nat$reflection6;

            var nat = native;
            if (!(nat != null && (_nat$reflection6 = nat.reflection) != null && _nat$reflection6.callStaticMethod)) return '';

            if (sys.platform === sys.Platform.ANDROID) {
              return nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'pollAutoAsrDebug', '()Ljava/lang/String;') || '';
            }

            return '';
          } catch (_unused6) {
            return '';
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c6de727e33d860d1d93c3d9596bfb7640d1fa30a.js.map
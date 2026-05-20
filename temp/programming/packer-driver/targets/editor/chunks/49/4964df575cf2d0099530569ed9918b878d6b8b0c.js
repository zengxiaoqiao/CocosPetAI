System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, _crd, MS_PER_DAY;

  /**
   * 获取「当前日期」字符串（YYYY-MM-DD），用于每日边界判断（Check-in、体力/亲密扣减等）。
   * 在 Android 原生环境使用系统默认时区（TimeZone.getDefault()），保证「新的一天」从本地 0 点开始；
   * 其它环境使用 JS Date 的本地方法（若出现 11 点才换日等问题，多为引擎时区与设备不一致）。
   */

  /**
   * 获取「昨天」的日期字符串（设备本地时区）。
   */
  function getLocalDateString(date) {
    if (sys.platform === sys.Platform.ANDROID && sys.isNative && typeof native !== 'undefined') {
      try {
        var _native;

        if ((_native = native) != null && (_native = _native.reflection) != null && _native.callStaticMethod) {
          if (date === undefined) {
            const ret = native.reflection.callStaticMethod('com/cocos/game/AppActivity', 'getLocalDateString', '()Ljava/lang/String;');
            if (typeof ret === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(ret)) return ret;
          } else {
            const ret = native.reflection.callStaticMethod('com/cocos/game/AppActivity', 'getLocalDateStringForTimestamp', '(J)Ljava/lang/String;', date.getTime());
            if (typeof ret === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(ret)) return ret;
          }
        }
      } catch (e) {
        console.warn('[DateUtil] getLocalDateString native failed', e);
      }
    }

    const d = date != null ? date : new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getYesterdayDateString() {
    if (sys.platform === sys.Platform.ANDROID && sys.isNative && typeof native !== 'undefined') {
      try {
        var _native2;

        if ((_native2 = native) != null && (_native2 = _native2.reflection) != null && _native2.callStaticMethod) {
          const now = Date.now();
          const yesterdayMs = now - 86400000;
          const ret = native.reflection.callStaticMethod('com/cocos/game/AppActivity', 'getLocalDateStringForTimestamp', '(J)Ljava/lang/String;', yesterdayMs);
          if (typeof ret === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(ret)) return ret;
        }
      } catch (e) {
        console.warn('[DateUtil] getYesterdayDateString native failed', e);
      }
    }

    const d = new Date();
    d.setDate(d.getDate() - 1);
    return getLocalDateString(d);
  }

  /**
   * 距离下一个「设备本地 0 点」的毫秒数，用于每日 0 点定时（如体力/亲密扣减）。
   * Android 原生使用系统时区计算；其它环境用 JS 本地时间。
   */
  function getMsUntilNextLocalMidnight() {
    if (sys.platform === sys.Platform.ANDROID && sys.isNative && typeof native !== 'undefined') {
      try {
        var _native3;

        if ((_native3 = native) != null && (_native3 = _native3.reflection) != null && _native3.callStaticMethod) {
          const ret = native.reflection.callStaticMethod('com/cocos/game/AppActivity', 'getMsUntilNextLocalMidnight', '()J');
          if (typeof ret === 'number' && ret >= 0) return Math.floor(ret);
        }
      } catch (e) {
        console.warn('[DateUtil] getMsUntilNextLocalMidnight native failed', e);
      }
    }

    const now = new Date();
    const h = now.getHours(),
          m = now.getMinutes(),
          s = now.getSeconds(),
          ms = now.getMilliseconds();
    const msIntoDay = (h * 3600 + m * 60 + s) * 1000 + ms;
    return MS_PER_DAY - msIntoDay;
  }

  _export({
    getLocalDateString: getLocalDateString,
    getYesterdayDateString: getYesterdayDateString,
    getMsUntilNextLocalMidnight: getMsUntilNextLocalMidnight
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5bb68Q6+QpLP65YgrHc8tsM", "DateUtil", undefined);

      __checkObsolete__(['sys']);

      _export("MS_PER_DAY", MS_PER_DAY = 86400000);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4964df575cf2d0099530569ed9918b878d6b8b0c.js.map
System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, getLocalDateString, getYesterdayDateString, formatCompanionDaysText, _crd, STORAGE_KEY_TOTAL, STORAGE_KEY_STREAK, STORAGE_KEY_LAST_COUNTED;

  function readInt(key, fallback = 0) {
    const n = parseInt(sys.localStorage.getItem(key) || '', 10);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  }

  function getCompanionDaysState() {
    return {
      totalDays: readInt(STORAGE_KEY_TOTAL, 0),
      streakDays: readInt(STORAGE_KEY_STREAK, 0)
    };
  }
  /**
   * 每个本地自然日首次进入时调用：累计陪伴 +1；连续天数在昨日也来过时 +1，否则置 1。
   * 同一天多次调用只计一次。
   */


  function recordCompanionVisitToday() {
    const today = (_crd && getLocalDateString === void 0 ? (_reportPossibleCrUseOfgetLocalDateString({
      error: Error()
    }), getLocalDateString) : getLocalDateString)();
    const last = sys.localStorage.getItem(STORAGE_KEY_LAST_COUNTED) || '';
    let total = readInt(STORAGE_KEY_TOTAL, 0);
    let streak = readInt(STORAGE_KEY_STREAK, 0);

    if (last === today) {
      return {
        totalDays: total,
        streakDays: streak,
        countedNewDay: false
      };
    }

    const yesterday = (_crd && getYesterdayDateString === void 0 ? (_reportPossibleCrUseOfgetYesterdayDateString({
      error: Error()
    }), getYesterdayDateString) : getYesterdayDateString)();

    if (last === yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }

    total += 1;

    try {
      sys.localStorage.setItem(STORAGE_KEY_TOTAL, String(total));
      sys.localStorage.setItem(STORAGE_KEY_STREAK, String(streak));
      sys.localStorage.setItem(STORAGE_KEY_LAST_COUNTED, today);
    } catch (e) {
      console.warn('[CompanionDays] save failed', e);
    }

    return {
      totalDays: total,
      streakDays: streak,
      countedNewDay: true
    };
  }

  function getCompanionDaysDisplayText(state) {
    const s = state != null ? state : getCompanionDaysState();
    return (_crd && formatCompanionDaysText === void 0 ? (_reportPossibleCrUseOfformatCompanionDaysText({
      error: Error()
    }), formatCompanionDaysText) : formatCompanionDaysText)(s.totalDays, s.streakDays);
  }

  function _reportPossibleCrUseOfgetLocalDateString(extras) {
    _reporterNs.report("getLocalDateString", "./DateUtil", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetYesterdayDateString(extras) {
    _reporterNs.report("getYesterdayDateString", "./DateUtil", _context.meta, extras);
  }

  function _reportPossibleCrUseOfformatCompanionDaysText(extras) {
    _reporterNs.report("formatCompanionDaysText", "./TipCopy", _context.meta, extras);
  }

  _export({
    getCompanionDaysState: getCompanionDaysState,
    recordCompanionVisitToday: recordCompanionVisitToday,
    getCompanionDaysDisplayText: getCompanionDaysDisplayText
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      getLocalDateString = _unresolved_2.getLocalDateString;
      getYesterdayDateString = _unresolved_2.getYesterdayDateString;
    }, function (_unresolved_3) {
      formatCompanionDaysText = _unresolved_3.formatCompanionDaysText;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a8f3cLhS21Kno98HS4/Slts", "CompanionDays", undefined);

      __checkObsolete__(['sys']);

      STORAGE_KEY_TOTAL = 'petai_companion_total_days';
      STORAGE_KEY_STREAK = 'petai_companion_streak_days';
      STORAGE_KEY_LAST_COUNTED = 'petai_companion_last_counted_date';

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e76afdf2bc61c1d5c6be22889a4ccaf5554f5d00.js.map
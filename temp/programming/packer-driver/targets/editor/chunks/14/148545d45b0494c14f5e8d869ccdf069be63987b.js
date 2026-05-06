System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, isZh, _crd, WEATHER_GREETING_CODES;

  /** 新安装首次打开时显示的指引文案：第一句（仅一次，不弹 Check-in） */
  function getFirstOpenTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '点我一下～' : 'Tap me~';
  }
  /** 新安装首次打开时显示的指引文案：第二句（紧接第一句之后，仅一次） */


  function getFirstOpenTipSecond() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '滑一滑摸摸我（心情+5）' : 'Swipe to pet me (mood +5)';
  }
  /** 新安装首次打开时显示的指引文案：第三句（喂食提示） */


  function getFirstOpenTipThird() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '喂我：体力+心情' : 'Feed me: HP & mood up';
  }
  /** 新安装首次打开时显示的指引文案：第四句（玩耍提示） */


  function getFirstOpenTipFourth() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '陪我玩：心情+20' : 'Play with me (+20 mood)';
  }
  /** 新安装首次打开时显示的指引文案：第五句（梳毛提示） */


  function getFirstOpenTipFifth() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '给我梳毛：心情更好' : 'Brush me: mood up';
  }
  /** Open‑Meteo weathercode → 人性化短文案（仅作参考，打招呼用只取 WEATHER_GREETING_CODES） */


  function getWeatherText(code) {
    const zh = {
      0: '今天天气不错～',
      1: '天气还可以～',
      2: '有点云',
      3: '阴阴的',
      45: '起雾了，慢点走',
      48: '雾好大，小心点',
      51: '在下小雨～',
      53: '毛毛雨，带伞哦',
      55: '雨有点大～',
      61: '下雨啦，带伞～',
      63: '雨不小，别淋着',
      65: '大雨，别出门～',
      71: '下雪啦～',
      73: '雪有点大',
      75: '大雪，注意保暖～',
      80: '阵雨，记得带伞',
      81: '阵雨有点大～',
      82: '雷阵雨，躲一躲',
      95: '打雷啦，别怕～',
      96: '雷雨冰雹，别出门',
      99: '雷暴冰雹，小心～'
    };
    const en = {
      0: 'Nice weather~',
      1: 'Weather is okay~',
      2: 'Cloudy',
      3: 'Overcast',
      45: 'Foggy, walk slow',
      48: 'Heavy fog, be careful',
      51: 'Drizzle~',
      53: 'Light rain, take umbrella',
      55: 'Rainy~',
      61: 'Raining, take umbrella~',
      63: 'Heavy rain, stay dry',
      65: 'Downpour, stay in~',
      71: 'Snowing~',
      73: 'Snowy',
      75: 'Heavy snow, keep warm~',
      80: 'Showers, take umbrella',
      81: 'Heavy showers~',
      82: 'Thunderstorm, stay inside',
      95: 'Thunder, don’t be scared~',
      96: 'Storm with hail, stay in',
      99: 'Severe storm, be careful~'
    };
    const map = (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? zh : en;
    return map[code] || '';
  }
  /** 适合做打招呼话题的天气码（排除「有点云」「阴阴的」等不咸不淡的） */


  function isWeatherGoodForGreeting(code) {
    return WEATHER_GREETING_CODES.has(code);
  }

  /** 早 / 午 / 晚安问候，按时间段每天最多一条，短句（按当前语言返回规则集） */
  function getTimeRules() {
    if ((_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)()) {
      return [{
        id: 'morning',
        startHour: 7,
        endHour: 10,
        texts: ['早安～', '早呀～', '早上好～']
      }, {
        id: 'noon',
        startHour: 11,
        endHour: 12,
        texts: ['快中午了～', '吃饭了吗？', '记得吃午饭～']
      }, {
        id: 'night',
        startHour: 21,
        endHour: 22,
        texts: ['时候不早了～', '10点我去睡觉了～', '别熬夜呀～']
      }];
    }

    return [{
      id: 'morning',
      startHour: 7,
      endHour: 10,
      texts: ['Morning~', 'Good morning~']
    }, {
      id: 'noon',
      startHour: 11,
      endHour: 12,
      texts: ['Almost noon~', 'Had lunch?']
    }, {
      id: 'night',
      startHour: 21,
      endHour: 22,
      texts: ['Getting late~', 'Don’t stay up~']
    }];
  }
  /** 今天一直没玩时提示（不高兴表情） */


  function getTodayNoPlayTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '今天还没陪我玩' : 'You haven’t played with me';
  }
  /** 当日已领取 Check-in 后再次点击 ad 节点时的提示 */


  function getCheckinAlreadyClaimedTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '今天已经领过了' : 'Already claimed today';
  }
  /** 体力为 0 或较低时的提示（配合 14 姿态），宠物口吻且简短 */


  function getHpZeroTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '没力气啦，喂我～' : 'No energy, feed me~';
  }
  /** 亲密度偏低（心情很差）提示 */


  function getIntimacyZeroTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '心情很差！' : 'Bad mood!';
  }
  /** 宠物口吻：今天被摸/逗的次数，pet 为 'cat' | 'dog'，count > 0 时返回次数句，count === 0 返回空（由调用方用 getTodayNoPlayTip） */


  function getTodayPetCountCopy(pet, count) {
    if (count <= 0) return '';

    if (pet === 'cat') {
      return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
        error: Error()
      }), isZh) : isZh)() ? `今天摸我 ${count} 次～` : `You petted me ${count} times~`;
    }

    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? `今天逗我 ${count} 次～` : `You played with me ${count} times~`;
  }
  /** 手机快没电：宠物口吻，level < 20% 时用 */


  function getBatteryLowTexts() {
    if ((_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)()) {
      return ['快没电啦～', '电量很低～', '该充电啦～'];
    }

    return ['Battery low~', 'Battery very low~', 'Time to charge~'];
  }
  /** 无网络时的提示（目前仅 App 内使用；Widget 已仅用动画表现） */


  function getNetworkTipsNone() {
    if ((_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)()) {
      return ['没网啦，检查网络～', '断网了，连上再玩～'];
    }

    return ['No network~', 'Go online to play~'];
  }
  /** 连续点击超过次数时的「Not again」提示 */


  function getNotAgainTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '别再点啦，休息一下～' : 'Not again! Let me rest';
  }

  function _reportPossibleCrUseOfisZh(extras) {
    _reporterNs.report("isZh", "./Lang", _context.meta, extras);
  }

  _export({
    getFirstOpenTip: getFirstOpenTip,
    getFirstOpenTipSecond: getFirstOpenTipSecond,
    getFirstOpenTipThird: getFirstOpenTipThird,
    getFirstOpenTipFourth: getFirstOpenTipFourth,
    getFirstOpenTipFifth: getFirstOpenTipFifth,
    getWeatherText: getWeatherText,
    isWeatherGoodForGreeting: isWeatherGoodForGreeting,
    getTimeRules: getTimeRules,
    getTodayNoPlayTip: getTodayNoPlayTip,
    getCheckinAlreadyClaimedTip: getCheckinAlreadyClaimedTip,
    getHpZeroTip: getHpZeroTip,
    getIntimacyZeroTip: getIntimacyZeroTip,
    getTodayPetCountCopy: getTodayPetCountCopy,
    getBatteryLowTexts: getBatteryLowTexts,
    getNetworkTipsNone: getNetworkTipsNone,
    getNotAgainTip: getNotAgainTip
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      isZh = _unresolved_2.isZh;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0ae06Exh3NIW6Irnl204tpT", "TipCopy", undefined);
      /**
       * 所有提示文案集中在此文件：天气、早午晚安问候、宠物口吻等。
       * App 与 Widget 共用；PetInfoBar 使用。
       * 支持中英文，通过 Lang.getLang() 切换。
       */


      _export("WEATHER_GREETING_CODES", WEATHER_GREETING_CODES = new Set([0, // 天气不错呀～
      45, 48, 51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99, 71, 73, 75]));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=148545d45b0494c14f5e8d869ccdf069be63987b.js.map
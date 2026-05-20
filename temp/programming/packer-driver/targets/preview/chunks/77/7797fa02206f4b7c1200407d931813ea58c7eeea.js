System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, isZh, _crd;

  /** 新安装首次打开时显示的综合介绍（仅一次） */
  function getFirstOpenTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '我是你的宠物伙伴，长按我或麦克风和我聊聊。' : "I'm your pet pal. Hold me or the mic to chat.";
  }
  /** 长按宠物未够时长时的提示 */


  function getMicHoldPetTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '长按我说话' : 'Hold me to talk';
  }
  /** 陪伴累计天数 + 连续天数展示（连续未满 2 天不展示「连续」，避免首日出现「连续1天」） */


  function formatCompanionDaysText(totalDays, streakDays) {
    var total = Math.max(0, totalDays | 0);
    var streak = Math.max(0, streakDays | 0);

    if ((_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)()) {
      if (streak >= 2) return "\u966A\u4F34" + total + "\u5929\uFF0C\u8FDE\u7EED" + streak + "\u5929";
      return "\u966A\u4F34" + total + "\u5929";
    }

    if (streak >= 2) return total + " days together, " + streak + "-day streak";
    return total + " days together";
  }
  /** 麦克风按钮下方：空闲提示 */


  function getMicHoldToTalkTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '按住 说话' : 'Hold to talk';
  }
  /** 麦克风：已按下、尚未进入录音 */


  function getMicKeepHoldingTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '继续按住…' : 'Keep holding…';
  }
  /** 麦克风：录音中 */


  function getMicRecordingTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '松开发送' : 'Release to send';
  }
  /** 麦克风：等待 AI 回复 */


  function getMicThinkingTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '我想想…' : 'Thinking…';
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
  /** 体力不足时，对话框内喂食引导（有喂食次数） */


  function getLowHpFeedBubbleTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '我累了，喂我吃饭吧' : "I'm tired… feed me please";
  }
  /** 体力不足但喂食次数为 0 */


  function getLowHpFeedEmptyTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '粮食不够啦，帮我补一点？' : 'No food left… help refill?';
  }
  /** 睡觉动画（03）时对话框内容 */


  function getSleepBubbleTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? 'Z z z …' : 'Zzz …';
  }
  /** 点击未解锁的猫：提示去商店订阅 */


  function getCatUnlockTip() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '在商店订阅即可解锁猫咪' : 'Subscribe in the Shop to unlock the cat';
  }
  /** 商店界面固定英文（不随系统语言切换） */


  function getShopTitle() {
    return 'Shop';
  }

  function getShopBackLabel() {
    return 'Back';
  }

  function getShopSubscribeLabel() {
    return 'Subscribe';
  }

  function getShopCatPriceLabel() {
    return '$0.99';
  }

  function getShopCustomizePriceLabel() {
    return '$9.99';
  }
  /** 看广告获得 +1 道具次数 */


  function getShopFreeLabel() {
    return 'Free';
  }

  function getShopCustomizePlaceholder() {
    return 'Your pet in the app\n(image placeholder)';
  }

  function getShopOwnedLabel() {
    return 'Owned';
  }

  function getShopEnterCustomizeLabel() {
    return 'Customize';
  }

  function getShopCatProductTitle() {
    return 'Cat Companion';
  }

  function getShopCatProductDesc() {
    return 'Subscribe to switch to the cat with unique animations.';
  }

  function getShopCustomizeProductTitle() {
    return 'Custom Pet';
  }

  function getShopCustomizeProductDesc() {
    return 'Subscribe to create your unique pet look (more coming soon).';
  }
  /** 定制页标题 */


  function getCustomizeComingSoonTitle() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '即将开放' : 'Coming Soon';
  }
  /** 定制页副标题 */


  function getCustomizeComingSoonSubtitle() {
    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? '宠物定制功能正在准备中，敬请期待。' : 'Pet customization is on the way. Stay tuned!';
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
      }), isZh) : isZh)() ? "\u4ECA\u5929\u6478\u6211 " + count + " \u6B21\uFF5E" : "You petted me " + count + " times~";
    }

    return (_crd && isZh === void 0 ? (_reportPossibleCrUseOfisZh({
      error: Error()
    }), isZh) : isZh)() ? "\u4ECA\u5929\u9017\u6211 " + count + " \u6B21\uFF5E" : "You played with me " + count + " times~";
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
    getMicHoldPetTip: getMicHoldPetTip,
    formatCompanionDaysText: formatCompanionDaysText,
    getMicHoldToTalkTip: getMicHoldToTalkTip,
    getMicKeepHoldingTip: getMicKeepHoldingTip,
    getMicRecordingTip: getMicRecordingTip,
    getMicThinkingTip: getMicThinkingTip,
    getTimeRules: getTimeRules,
    getTodayNoPlayTip: getTodayNoPlayTip,
    getCheckinAlreadyClaimedTip: getCheckinAlreadyClaimedTip,
    getHpZeroTip: getHpZeroTip,
    getLowHpFeedBubbleTip: getLowHpFeedBubbleTip,
    getLowHpFeedEmptyTip: getLowHpFeedEmptyTip,
    getSleepBubbleTip: getSleepBubbleTip,
    getCatUnlockTip: getCatUnlockTip,
    getShopTitle: getShopTitle,
    getShopBackLabel: getShopBackLabel,
    getShopSubscribeLabel: getShopSubscribeLabel,
    getShopCatPriceLabel: getShopCatPriceLabel,
    getShopCustomizePriceLabel: getShopCustomizePriceLabel,
    getShopFreeLabel: getShopFreeLabel,
    getShopCustomizePlaceholder: getShopCustomizePlaceholder,
    getShopOwnedLabel: getShopOwnedLabel,
    getShopEnterCustomizeLabel: getShopEnterCustomizeLabel,
    getShopCatProductTitle: getShopCatProductTitle,
    getShopCatProductDesc: getShopCatProductDesc,
    getShopCustomizeProductTitle: getShopCustomizeProductTitle,
    getShopCustomizeProductDesc: getShopCustomizeProductDesc,
    getCustomizeComingSoonTitle: getCustomizeComingSoonTitle,
    getCustomizeComingSoonSubtitle: getCustomizeComingSoonSubtitle,
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


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7797fa02206f4b7c1200407d931813ea58c7eeea.js.map
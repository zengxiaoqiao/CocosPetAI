System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, getLocalDateString, getYesterdayDateString, _crd, STORAGE_KEY_BTN, STORAGE_KEY_BTN_LAST, STORAGE_KEY_PENDING, STORAGE_KEY_FIRST_RUN_DONE, STORAGE_KEY_LAST_CHECKIN_DAY, STORAGE_KEY_LAST_CLAIM_DATE, STORAGE_KEY_PENDING_REWARD_INDEX, MS_PER_HOUR, MS_PER_DAY, PER_HOUR, SharedBtnCounts;

  function _reportPossibleCrUseOfgetLocalDateString(extras) {
    _reporterNs.report("getLocalDateString", "./DateUtil", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetYesterdayDateString(extras) {
    _reporterNs.report("getYesterdayDateString", "./DateUtil", _context.meta, extras);
  }

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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e0595efCx1MlJOoGunp8e3+", "SharedBtnCounts", undefined);

      __checkObsolete__(['sys']);

      STORAGE_KEY_BTN = 'petai_btn_counts';
      STORAGE_KEY_BTN_LAST = 'petai_btn_last';
      STORAGE_KEY_PENDING = 'petai_btn_pending';
      /** 与 PetValue 共用：仅首次运行后为 '1'，首次安装当天不弹 Check-in */

      STORAGE_KEY_FIRST_RUN_DONE = 'petai_first_run_done';
      /** 最近一次「弹出」Check-in 的日期（本地 0 点 YYYY-MM-DD），用于每天只弹一次 */

      STORAGE_KEY_LAST_CHECKIN_DAY = 'petai_last_checkin_day';
      /** 最近一次用户点击领取的日期，用于判断是否连续每日签到 */

      STORAGE_KEY_LAST_CLAIM_DATE = 'petai_last_claim_date';
      /** 未连续签到时预掷的奖励索引 0|1|2（与界面显示一致，claim 时使用） */

      STORAGE_KEY_PENDING_REWARD_INDEX = 'petai_pending_reward_index';
      MS_PER_HOUR = 3600000;
      MS_PER_DAY = 86400000;
      /** 连续签到时，每日 Check-in 为 Button1/2/3 增加的可点击次数 */

      _export("PER_HOUR", PER_HOUR = {
        btn1: 3,
        btn2: 1,
        btn3: 1
      });
      /**
       * Button1/2/3 可点击次数（狗猫公用，持久化）。首次安装默认为 2、1、1。
       * Check-in 弹出规则（每日本地 0 点～次日 0 点）：
       * - 首次安装当天不弹出 Check-in，次日及以后按下面规则。
       * - 每天打开游戏时最多弹出一次；当天已弹过则不再弹。
       * - 领取奖励：连续每日都来（昨天领过）→ 与现在相同（btn1+3, btn2+1, btn3+1）；
       *   未连续 → 在三种奖励中随机一种（只加对应按钮次数）。
       */


      _export("SharedBtnCounts", SharedBtnCounts = {
        btn1: 2,
        btn2: 1,
        btn3: 1,

        /** 是否有待领取的每小时次数（上个小时在线产生） */
        pendingClaim: false,

        init() {
          try {
            const firstRunDone = sys.localStorage.getItem(STORAGE_KEY_FIRST_RUN_DONE) === '1';
            const saved = sys.localStorage.getItem(STORAGE_KEY_BTN); // 首次安装（未设 first_run_done）强制 2/1/1，不读存档；非首次才从存档恢复

            if (firstRunDone && saved != null && saved !== '') {
              var _o$btn, _o$btn2, _o$btn3;

              const o = JSON.parse(saved);
              this.btn1 = Math.max(0, ((_o$btn = o.btn1) != null ? _o$btn : 2) | 0);
              this.btn2 = Math.max(0, ((_o$btn2 = o.btn2) != null ? _o$btn2 : 1) | 0);
              this.btn3 = Math.max(0, ((_o$btn3 = o.btn3) != null ? _o$btn3 : 1) | 0);
            } else if (!firstRunDone) {
              this.btn1 = 2;
              this.btn2 = 1;
              this.btn3 = 1;
            } // 读取上次的 pending 状态（有可能是今天还没领完的）


            const pendingStr = sys.localStorage.getItem(STORAGE_KEY_PENDING);
            this.pendingClaim = pendingStr === '1';
            const todayDate = (_crd && getLocalDateString === void 0 ? (_reportPossibleCrUseOfgetLocalDateString({
              error: Error()
            }), getLocalDateString) : getLocalDateString)();
            const yesterdayDate = (_crd && getYesterdayDateString === void 0 ? (_reportPossibleCrUseOfgetYesterdayDateString({
              error: Error()
            }), getYesterdayDateString) : getYesterdayDateString)();
            const lastCheckinDay = sys.localStorage.getItem(STORAGE_KEY_LAST_CHECKIN_DAY) || '';
            const lastClaimDate = sys.localStorage.getItem(STORAGE_KEY_LAST_CLAIM_DATE) || '';
            const isContinuous = lastClaimDate === yesterdayDate; // 每天最多弹一次：今天还没弹过则产生待领取；首次安装（未设 first_run_done）不弹 Check-in

            if (!this.pendingClaim && lastCheckinDay !== todayDate && firstRunDone) {
              this.pendingClaim = true;
              sys.localStorage.setItem(STORAGE_KEY_LAST_CHECKIN_DAY, todayDate); // 未连续签到时预掷随机奖励索引，与界面只显示一种奖励一致

              if (!isContinuous) {
                try {
                  sys.localStorage.setItem(STORAGE_KEY_PENDING_REWARD_INDEX, String(Math.floor(Math.random() * 3)));
                } catch {
                  /* ignore */
                }
              }
            } else if (!this.pendingClaim && lastCheckinDay !== todayDate && !firstRunDone) {
              // 首次安装：不弹出 Check-in，仅标记今日，次日再弹
              sys.localStorage.setItem(STORAGE_KEY_LAST_CHECKIN_DAY, todayDate);
            }

            if (typeof console !== 'undefined' && console.log) {
              console.log('[SharedBtnCounts] Check-in', {
                todayDate,
                lastCheckinDay,
                pendingClaim: this.pendingClaim
              });
            }

            this.save();
          } catch (e) {
            console.warn('[SharedBtnCounts] init failed:', e);
          }
        },

        save() {
          try {
            sys.localStorage.setItem(STORAGE_KEY_BTN, JSON.stringify({
              btn1: this.btn1,
              btn2: this.btn2,
              btn3: this.btn3
            }));
            const now = Date.now();
            const hourStart = Math.floor(now / MS_PER_HOUR) * MS_PER_HOUR;
            sys.localStorage.setItem(STORAGE_KEY_BTN_LAST, String(hourStart));
            sys.localStorage.setItem(STORAGE_KEY_PENDING, this.pendingClaim ? '1' : '0');
          } catch (e) {
            console.warn('[SharedBtnCounts] save failed:', e);
          }
        },

        /** 是否有待领取次数（上个小时在线产生） */
        hasPendingClaim() {
          return this.pendingClaim;
        },

        /**
         * 用户主动点击 ad 打开 Check-in 时调用：
         * - 若今天还没领取过且当前没有 pending，则生成一条待领取，保证每天点 ad 至少能领一次；
         * - 若今天已经领过，则保持 pending=false，让前端提示「今天已经领过了」。
         */
        ensurePendingClaimWhenUserOpensCheckIn() {
          if (this.pendingClaim) return;
          const today = (_crd && getLocalDateString === void 0 ? (_reportPossibleCrUseOfgetLocalDateString({
            error: Error()
          }), getLocalDateString) : getLocalDateString)();
          const yesterday = (_crd && getYesterdayDateString === void 0 ? (_reportPossibleCrUseOfgetYesterdayDateString({
            error: Error()
          }), getYesterdayDateString) : getYesterdayDateString)();
          const lastClaimDate = sys.localStorage.getItem(STORAGE_KEY_LAST_CLAIM_DATE) || '';
          if (lastClaimDate === today) return; // 今天已经领过

          this.pendingClaim = true;

          try {
            sys.localStorage.setItem(STORAGE_KEY_LAST_CHECKIN_DAY, today); // 非连续签到时预掷随机奖励索引，与界面只显示一种奖励一致

            const isContinuous = lastClaimDate === yesterday;

            if (!isContinuous) {
              sys.localStorage.setItem(STORAGE_KEY_PENDING_REWARD_INDEX, String(Math.floor(Math.random() * 3)));
            }
          } catch {
            /* ignore */
          }

          this.save();
        },

        /**
         * 当前待领取的展示类型：连续签到时为 'all'（三种都显示），未连续为 0|1|2（只显示对应一种，与 claim 发放一致）
         */
        getPendingRewardType() {
          if (!this.pendingClaim) return 'all';
          const yesterday = (_crd && getYesterdayDateString === void 0 ? (_reportPossibleCrUseOfgetYesterdayDateString({
            error: Error()
          }), getYesterdayDateString) : getYesterdayDateString)();
          const lastClaimDate = sys.localStorage.getItem(STORAGE_KEY_LAST_CLAIM_DATE) || '';
          if (lastClaimDate === yesterday) return 'all';
          let idx = sys.localStorage.getItem(STORAGE_KEY_PENDING_REWARD_INDEX);
          let n = idx !== null && idx !== '' ? parseInt(idx, 10) : -1;

          if (n !== 0 && n !== 1 && n !== 2) {
            n = Math.floor(Math.random() * 3);

            try {
              sys.localStorage.setItem(STORAGE_KEY_PENDING_REWARD_INDEX, String(n));
            } catch {
              /* ignore */
            }
          }

          return n;
        },

        /** 每小时到点且用户在线时调用：标记有待领取，不直接加次数 */
        markHourlyClaimPending() {
          var _this$onPendingClaimC;

          this.pendingClaim = true;
          this.save();
          (_this$onPendingClaimC = this.onPendingClaimCallback) == null || _this$onPendingClaimC.call(this);
        },

        /**
         * 用户点击 Check-in 的 OK 后调用：按是否连续签到发放奖励并清除待领取。
         * @returns 本次为 btn1/btn2/btn3 增加的数量（用于飘字），未领取则返回 null
         */
        claim() {
          var _this$onChangeCallbac;

          if (!this.pendingClaim) return null;
          const today = (_crd && getLocalDateString === void 0 ? (_reportPossibleCrUseOfgetLocalDateString({
            error: Error()
          }), getLocalDateString) : getLocalDateString)();
          const yesterday = (_crd && getYesterdayDateString === void 0 ? (_reportPossibleCrUseOfgetYesterdayDateString({
            error: Error()
          }), getYesterdayDateString) : getYesterdayDateString)();
          const lastClaimDate = sys.localStorage.getItem(STORAGE_KEY_LAST_CLAIM_DATE) || '';
          const isContinuous = lastClaimDate === yesterday;
          let d1 = 0,
              d2 = 0,
              d3 = 0;

          if (isContinuous) {
            d1 = PER_HOUR.btn1;
            d2 = PER_HOUR.btn2;
            d3 = PER_HOUR.btn3;
          } else {
            const idxStr = sys.localStorage.getItem(STORAGE_KEY_PENDING_REWARD_INDEX);
            const which = idxStr !== null && idxStr !== '' ? parseInt(idxStr, 10) : -1;
            const whichSafe = which === 0 || which === 1 || which === 2 ? which : Math.floor(Math.random() * 3);
            if (whichSafe === 0) d1 = PER_HOUR.btn1;else if (whichSafe === 1) d2 = PER_HOUR.btn2;else d3 = PER_HOUR.btn3;

            try {
              sys.localStorage.removeItem(STORAGE_KEY_PENDING_REWARD_INDEX);
            } catch {
              /* ignore */
            }
          }

          this.pendingClaim = false;
          this.btn1 += d1;
          this.btn2 += d2;
          this.btn3 += d3;

          try {
            sys.localStorage.setItem(STORAGE_KEY_LAST_CLAIM_DATE, today);
          } catch {
            /* ignore */
          }

          this.save();
          (_this$onChangeCallbac = this.onChangeCallback) == null || _this$onChangeCallbac.call(this);
          return {
            btn1: d1,
            btn2: d2,
            btn3: d3
          };
        },

        /** 次数变化时回调（用于刷新按钮标签） */
        onChangeCallback: null,

        /** 有待领取时回调（用于显示 Check-in 节点） */
        onPendingClaimCallback: null
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e73aadf24037afa169f11cc82bc1e7de598d5f84.js.map
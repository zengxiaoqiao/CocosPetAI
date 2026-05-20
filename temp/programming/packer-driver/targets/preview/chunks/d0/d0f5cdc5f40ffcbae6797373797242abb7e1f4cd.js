System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, isCatUnlocked, isCustomizeUnlocked, markSelectCatAfterUnlock, unlockCat, unlockCustomize, _crd, SHOP_SKU;

  /**
   * 发起订阅购买。当前为占位：直接完成解锁，便于联调；接入 IAP 后在此调用原生并回调。
   */
  function requestSubscription(product) {
    return new Promise(resolve => {
      try {
        if (product === 'cat') {
          if (!(_crd && isCatUnlocked === void 0 ? (_reportPossibleCrUseOfisCatUnlocked({
            error: Error()
          }), isCatUnlocked) : isCatUnlocked)()) {
            (_crd && unlockCat === void 0 ? (_reportPossibleCrUseOfunlockCat({
              error: Error()
            }), unlockCat) : unlockCat)();
            (_crd && markSelectCatAfterUnlock === void 0 ? (_reportPossibleCrUseOfmarkSelectCatAfterUnlock({
              error: Error()
            }), markSelectCatAfterUnlock) : markSelectCatAfterUnlock)();
          }
        } else if (product === 'customize') {
          if (!(_crd && isCustomizeUnlocked === void 0 ? (_reportPossibleCrUseOfisCustomizeUnlocked({
            error: Error()
          }), isCustomizeUnlocked) : isCustomizeUnlocked)()) (_crd && unlockCustomize === void 0 ? (_reportPossibleCrUseOfunlockCustomize({
            error: Error()
          }), unlockCustomize) : unlockCustomize)();
        }

        resolve(true);
      } catch (e) {
        console.warn('[ShopPurchase] requestSubscription failed', e);
        resolve(false);
      }
    });
  }

  function _reportPossibleCrUseOfisCatUnlocked(extras) {
    _reporterNs.report("isCatUnlocked", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisCustomizeUnlocked(extras) {
    _reporterNs.report("isCustomizeUnlocked", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfmarkSelectCatAfterUnlock(extras) {
    _reporterNs.report("markSelectCatAfterUnlock", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfunlockCat(extras) {
    _reporterNs.report("unlockCat", "./PetUnlock", _context.meta, extras);
  }

  function _reportPossibleCrUseOfunlockCustomize(extras) {
    _reporterNs.report("unlockCustomize", "./PetUnlock", _context.meta, extras);
  }

  _export("requestSubscription", requestSubscription);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      isCatUnlocked = _unresolved_2.isCatUnlocked;
      isCustomizeUnlocked = _unresolved_2.isCustomizeUnlocked;
      markSelectCatAfterUnlock = _unresolved_2.markSelectCatAfterUnlock;
      unlockCat = _unresolved_2.unlockCat;
      unlockCustomize = _unresolved_2.unlockCustomize;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b2e4faoHD1OX5oLHS4/Slts", "ShopPurchase", undefined);

      /** 订阅商品 ID（接入 App Store / Google Play 时与此一致） */
      _export("SHOP_SKU", SHOP_SKU = {
        cat: 'petai_sub_cat',
        customize: 'petai_sub_customize'
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d0f5cdc5f40ffcbae6797373797242abb7e1f4cd.js.map
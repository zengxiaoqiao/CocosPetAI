System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, director, sys, RandomPlayPetAni, _crd, STORAGE_CAT_UNLOCKED, STORAGE_CUSTOMIZE_UNLOCKED, STORAGE_CUSTOM_PET_READY, STORAGE_UNLOCK_INTENT, STORAGE_SELECT_CAT_AFTER_UNLOCK, STORAGE_SHOP_INTENT, STORAGE_RECHARGE_RETURN_SCENE;

  /** 猫咪是否已通过广告解锁 */
  function isCatUnlocked() {
    try {
      return sys.localStorage.getItem(STORAGE_CAT_UNLOCKED) === '1';
    } catch (_unused) {
      return false;
    }
  }

  function unlockCat() {
    try {
      sys.localStorage.setItem(STORAGE_CAT_UNLOCKED, '1');
    } catch (e) {
      console.warn('[PetUnlock] unlockCat failed', e);
    }
  }

  function isCustomizeUnlocked() {
    try {
      return sys.localStorage.getItem(STORAGE_CUSTOMIZE_UNLOCKED) === '1';
    } catch (_unused2) {
      return false;
    }
  }

  function unlockCustomize() {
    try {
      sys.localStorage.setItem(STORAGE_CUSTOMIZE_UNLOCKED, '1');
    } catch (e) {
      console.warn('[PetUnlock] unlockCustomize failed', e);
    }
  }
  /** 是否已有可切换的定制宠物（与「订阅解锁定制功能」区分） */


  function hasCustomPet() {
    try {
      return sys.localStorage.getItem(STORAGE_CUSTOM_PET_READY) === '1';
    } catch (_unused3) {
      return false;
    }
  }

  function markCustomPetReady() {
    try {
      sys.localStorage.setItem(STORAGE_CUSTOM_PET_READY, '1');
    } catch (e) {
      console.warn('[PetUnlock] markCustomPetReady failed', e);
    }
  }

  function setShopIntent(intent) {
    try {
      if (intent) sys.localStorage.setItem(STORAGE_SHOP_INTENT, intent);else sys.localStorage.removeItem(STORAGE_SHOP_INTENT);
    } catch (_unused4) {
      /* ignore */
    }
  }

  function consumeShopIntent() {
    try {
      var v = sys.localStorage.getItem(STORAGE_SHOP_INTENT);
      sys.localStorage.removeItem(STORAGE_SHOP_INTENT);
      if (v === 'cat' || v === 'customize') return v;
      return null;
    } catch (_unused5) {
      return null;
    }
  }
  /** 打开商店；intent 用于进入后高亮对应商品 */


  function openShop(intent) {
    setShopIntent(intent != null ? intent : null);
    director.loadScene('shop', err => {
      if (err) console.error('[PetUnlock] 无法加载 shop 场景', err);
    });
  }
  /** 商店道具格：看广告后为 Button1/2/3 +1，看完后回到 shop */


  function startShopPropAd(buttonIndex) {
    var choice = sys.localStorage.getItem('petai_pet_choice') || 'dog';
    var pet = choice === 'cat' ? 'cat' : 'dog';

    try {
      sys.localStorage.removeItem(STORAGE_UNLOCK_INTENT);
      sys.localStorage.setItem('recharge_pet', pet);
      sys.localStorage.setItem('recharge_button', String(buttonIndex));
      sys.localStorage.setItem(STORAGE_RECHARGE_RETURN_SCENE, 'shop');
    } catch (e) {
      console.warn('[PetUnlock] startShopPropAd storage failed', e);
    }

    (_crd && RandomPlayPetAni === void 0 ? (_reportPossibleCrUseOfRandomPlayPetAni({
      error: Error()
    }), RandomPlayPetAni) : RandomPlayPetAni).returnedFromAd = true;
    director.loadScene('ad', err => {
      if (err) console.error('[PetUnlock] 无法加载 ad 场景', err);
    });
  }
  /** 看广告解锁猫（道具等仍可用）；选择条解锁猫请走 openShop('cat') */


  function startCatUnlockAd() {
    try {
      sys.localStorage.setItem(STORAGE_UNLOCK_INTENT, 'cat');
      sys.localStorage.setItem('recharge_pet', 'cat');
      sys.localStorage.setItem('recharge_button', '0');
    } catch (e) {
      console.warn('[PetUnlock] startCatUnlockAd storage failed', e);
    }

    (_crd && RandomPlayPetAni === void 0 ? (_reportPossibleCrUseOfRandomPlayPetAni({
      error: Error()
    }), RandomPlayPetAni) : RandomPlayPetAni).returnedFromAd = true;
    director.loadScene('ad', err => {
      if (err) console.error('[PetUnlock] 无法加载 ad 场景', err);
    });
  }

  function markSelectCatAfterUnlock() {
    try {
      sys.localStorage.setItem(STORAGE_SELECT_CAT_AFTER_UNLOCK, '1');
    } catch (_unused6) {
      /* ignore */
    }
  }

  function consumeSelectCatAfterUnlock() {
    try {
      if (sys.localStorage.getItem(STORAGE_SELECT_CAT_AFTER_UNLOCK) !== '1') return false;
      sys.localStorage.removeItem(STORAGE_SELECT_CAT_AFTER_UNLOCK);
      return true;
    } catch (_unused7) {
      return false;
    }
  }

  function _reportPossibleCrUseOfRandomPlayPetAni(extras) {
    _reporterNs.report("RandomPlayPetAni", "./RandomPlayPetAni", _context.meta, extras);
  }

  _export({
    isCatUnlocked: isCatUnlocked,
    unlockCat: unlockCat,
    isCustomizeUnlocked: isCustomizeUnlocked,
    unlockCustomize: unlockCustomize,
    hasCustomPet: hasCustomPet,
    markCustomPetReady: markCustomPetReady,
    setShopIntent: setShopIntent,
    consumeShopIntent: consumeShopIntent,
    openShop: openShop,
    startShopPropAd: startShopPropAd,
    startCatUnlockAd: startCatUnlockAd,
    markSelectCatAfterUnlock: markSelectCatAfterUnlock,
    consumeSelectCatAfterUnlock: consumeSelectCatAfterUnlock
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      director = _cc.director;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      RandomPlayPetAni = _unresolved_2.RandomPlayPetAni;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a8f4cLhmz1PaoweLV5/mgsc", "PetUnlock", undefined);

      __checkObsolete__(['director', 'sys']);

      _export("STORAGE_CAT_UNLOCKED", STORAGE_CAT_UNLOCKED = 'petai_cat_unlocked');

      _export("STORAGE_CUSTOMIZE_UNLOCKED", STORAGE_CUSTOMIZE_UNLOCKED = 'petai_customize_unlocked');
      /** 已在定制流程中保存过宠物形象（选择条显示第三只入口） */


      _export("STORAGE_CUSTOM_PET_READY", STORAGE_CUSTOM_PET_READY = 'petai_custom_pet_ready');

      _export("STORAGE_UNLOCK_INTENT", STORAGE_UNLOCK_INTENT = 'petai_unlock_intent');

      _export("STORAGE_SELECT_CAT_AFTER_UNLOCK", STORAGE_SELECT_CAT_AFTER_UNLOCK = 'petai_select_cat_after_unlock');

      _export("STORAGE_SHOP_INTENT", STORAGE_SHOP_INTENT = 'petai_shop_intent');
      /** 看完广告后返回的场景名（默认 home） */


      _export("STORAGE_RECHARGE_RETURN_SCENE", STORAGE_RECHARGE_RETURN_SCENE = 'petai_recharge_return_scene');

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7805a296752b1e752ac8bc690badf703970c1054.js.map
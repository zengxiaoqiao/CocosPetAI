System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, native, sys, _crd, STORAGE_KEY_PET, STORAGE_KEY_HP, STORAGE_KEY_MOOD, STORAGE_KEY_MOOD_LEGACY, MAX_VALUE;

  /**
   * 将当前宠物、体力、心情同步到 Android 端，供桌面 Widget 动画状态使用。
   * 仅在 Android 原生环境调用 JSB，其它平台无操作。
   *
   * 说明：Widget 文案（提示句）只有 App 进程内调用 syncWidgetWeather 时才会更新，
   * 不打开 App 时无法刷新；退到后台前会再同步一次当前句，尽量保证桌面看到的是最近一句。
   */
  function syncWidgetData(pet, hp, mood) {
    if (typeof pet !== 'string') pet = 'dog';
    if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;

    try {
      var _nat$reflection;

      const nat = native;

      if (nat != null && (_nat$reflection = nat.reflection) != null && _nat$reflection.callStaticMethod) {
        nat.reflection.callStaticMethod('com/cocos/game/PetWidgetSync', 'sync', '(Ljava/lang/String;II)V', pet, Math.min(MAX_VALUE, Math.max(0, hp | 0)), Math.min(MAX_VALUE, Math.max(0, mood | 0)));
      }
    } catch (e) {
      console.warn('[WidgetSync] sync failed', e);
    }
  }
  /**
   * 从 localStorage 读取当前宠物状态并同步到 Widget（供 PetValue / TogglePet 调用）。
   */


  function syncWidgetFromStorage() {
    try {
      var _sys$localStorage$get;

      const pet = sys.localStorage.getItem(STORAGE_KEY_PET) || 'dog';
      const hp = Math.min(MAX_VALUE, Math.max(0, parseInt(sys.localStorage.getItem(STORAGE_KEY_HP) || '500', 10) || 0));
      const moodRaw = (_sys$localStorage$get = sys.localStorage.getItem(STORAGE_KEY_MOOD)) != null ? _sys$localStorage$get : sys.localStorage.getItem(STORAGE_KEY_MOOD_LEGACY);
      const mood = Math.min(MAX_VALUE, Math.max(0, parseInt(moodRaw || '500', 10) || 0));
      syncWidgetData(pet, hp, mood);
    } catch (e) {
      console.warn('[WidgetSync] syncFromStorage failed', e);
    }
  }
  /**
   * 仅同步提示文案到 Widget（若产品需要）。
   */


  function syncWidgetWeather(text) {
    if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;

    try {
      var _nat$reflection2;

      const nat = native;

      if (nat != null && (_nat$reflection2 = nat.reflection) != null && _nat$reflection2.callStaticMethod) {
        nat.reflection.callStaticMethod('com/cocos/game/PetWidgetSync', 'syncWeather', '(Ljava/lang/String;)V', text != null ? text : '');
      }
    } catch (e) {
      console.warn('[WidgetSync] syncWeather failed', e);
    }
  }
  /** 清空 Widget 文案并刷新（充电时仅显示充电动画不显示文案用）。 */


  function clearWidgetWeather() {
    if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;

    try {
      var _nat$reflection3;

      const nat = native;

      if (nat != null && (_nat$reflection3 = nat.reflection) != null && _nat$reflection3.callStaticMethod) {
        nat.reflection.callStaticMethod('com/cocos/game/PetWidgetSync', 'clearWeather', '()V');
      }
    } catch (e) {
      console.warn('[WidgetSync] clearWeather failed', e);
    }
  }
  /**
   * 在 Android 上弹出系统“添加宠物 Widget 到桌面”的对话框（小号，兼容旧调用）。
   */


  function requestPinPetWidget() {
    requestPinPetWidgetSmall();
  }
  /** 弹出系统添加小号宠物 Widget 的对话框 */


  function requestPinPetWidgetSmall() {
    if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;

    try {
      var _nat$reflection4;

      const nat = native;

      if (nat != null && (_nat$reflection4 = nat.reflection) != null && _nat$reflection4.callStaticMethod) {
        nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'requestPinPetWidgetSmall', '()V');
      }
    } catch (e) {
      console.warn('[WidgetSync] requestPinPetWidgetSmall failed', e);
    }
  }

  _export({
    syncWidgetData: syncWidgetData,
    syncWidgetFromStorage: syncWidgetFromStorage,
    syncWidgetWeather: syncWidgetWeather,
    clearWidgetWeather: clearWidgetWeather,
    requestPinPetWidget: requestPinPetWidget,
    requestPinPetWidgetSmall: requestPinPetWidgetSmall
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      native = _cc.native;
      sys = _cc.sys;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "76c75Mnc65DUb4WowA5eEBb", "WidgetSync", undefined);

      __checkObsolete__(['native', 'sys']);

      STORAGE_KEY_PET = 'petai_pet_choice';
      STORAGE_KEY_HP = 'petai_hp';
      STORAGE_KEY_MOOD = 'petai_mood';
      STORAGE_KEY_MOOD_LEGACY = 'petai_intimacy';
      /** 体力/心情实际最大值，与 PetValue 一致 */

      MAX_VALUE = 100;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=26b13e8736462f08d83135da4d124c0bfc9064ba.js.map
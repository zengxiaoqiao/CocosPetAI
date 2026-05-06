System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, native, sys, _crd, STORAGE_KEY_PET, STORAGE_KEY_HP, STORAGE_KEY_INTIMACY, MAX_VALUE;

  /**
   * 将当前宠物、体力、亲密度同步到 Android 端，供桌面 Widget 显示。
   * 仅在 Android 原生环境调用 JSB，其它平台无操作。
   *
   * 说明：Widget 文案（天气/提示句）只有 App 进程内调用 syncWidgetWeather 时才会更新，
   * 不打开 App 时无法刷新；退到后台前会再同步一次当前句，尽量保证桌面看到的是最近一句。
   */
  function syncWidgetData(pet, hp, intimacy) {
    if (typeof pet !== 'string') pet = 'dog';
    if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;

    try {
      var _nat$reflection;

      const nat = native;

      if (nat != null && (_nat$reflection = nat.reflection) != null && _nat$reflection.callStaticMethod) {
        nat.reflection.callStaticMethod('com/cocos/game/PetWidgetSync', 'sync', '(Ljava/lang/String;II)V', pet, Math.min(MAX_VALUE, Math.max(0, hp | 0)), Math.min(MAX_VALUE, Math.max(0, intimacy | 0)));
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
      const pet = sys.localStorage.getItem(STORAGE_KEY_PET) || 'dog';
      const hp = Math.min(MAX_VALUE, Math.max(0, parseInt(sys.localStorage.getItem(STORAGE_KEY_HP) || '500', 10) || 0));
      const intimacy = Math.min(MAX_VALUE, Math.max(0, parseInt(sys.localStorage.getItem(STORAGE_KEY_INTIMACY) || '500', 10) || 0));
      syncWidgetData(pet, hp, intimacy);
    } catch (e) {
      console.warn('[WidgetSync] syncFromStorage failed', e);
    }
  }
  /**
   * 仅同步天气文案到 Widget（供 PetInfoBar 在拿到天气后调用）。
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
  /** 弹出系统添加「小号」宠物 Widget 的对话框 */


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
  /** 弹出系统添加「大号」宠物 Widget 的对话框 */


  function requestPinPetWidgetLarge() {
    if (sys.platform !== sys.Platform.ANDROID || !sys.isNative) return;

    try {
      var _nat$reflection5;

      const nat = native;

      if (nat != null && (_nat$reflection5 = nat.reflection) != null && _nat$reflection5.callStaticMethod) {
        nat.reflection.callStaticMethod('com/cocos/game/AppActivity', 'requestPinPetWidgetLarge', '()V');
      }
    } catch (e) {
      console.warn('[WidgetSync] requestPinPetWidgetLarge failed', e);
    }
  }

  _export({
    syncWidgetData: syncWidgetData,
    syncWidgetFromStorage: syncWidgetFromStorage,
    syncWidgetWeather: syncWidgetWeather,
    clearWidgetWeather: clearWidgetWeather,
    requestPinPetWidget: requestPinPetWidget,
    requestPinPetWidgetSmall: requestPinPetWidgetSmall,
    requestPinPetWidgetLarge: requestPinPetWidgetLarge
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
      STORAGE_KEY_INTIMACY = 'petai_intimacy';
      /** 体力/亲密度实际最大值，与 PetValue 一致，避免存储异常时出现 110 等 */

      MAX_VALUE = 100;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a63d03519b49e1f168fcb94bb910af370b165e5c.js.map
System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, applySettingsSceneLocale, _dec, _class, _crd, ccclass, HomeNav;

  function _reportPossibleCrUseOfapplySettingsSceneLocale(extras) {
    _reporterNs.report("applySettingsSceneLocale", "./SettingsLocale", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      director = _cc.director;
    }, function (_unresolved_2) {
      applySettingsSceneLocale = _unresolved_2.applySettingsSceneLocale;
    }, function (_unresolved_3) {}, function (_unresolved_4) {}],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e333266ThdCF7Ynx1WGgEjT", "HomeNav", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director']);

      ({
        ccclass
      } = _decorator);
      /**
       * 场景跳转：home <-> settings。home 加载时预加载 settings/ad，减少切场景时主线程阻塞。
       */

      _export("HomeNav", HomeNav = (_dec = ccclass('HomeNav'), _dec(_class = class HomeNav extends Component {
        constructor() {
          super(...arguments);

          this._doOpenSettings = () => {
            if (!this.isValid) return;
            director.loadScene('settings', err => {
              if (err) {
                console.error('[HomeNav] 无法加载 settings 场景', err);
                return;
              }

              (_crd && applySettingsSceneLocale === void 0 ? (_reportPossibleCrUseOfapplySettingsSceneLocale({
                error: Error()
              }), applySettingsSceneLocale) : applySettingsSceneLocale)();
            });
          };

          this._doBackToHome = () => {
            if (!this.isValid) return;
            director.loadScene('home', err => {
              if (err) console.error('[HomeNav] 无法加载 home 场景', err);
            });
          };
        }

        onLoad() {
          var scene = director.getScene();

          if (scene && scene.name === 'home') {
            director.preloadScene('settings');
            director.preloadScene('ad');
            director.preloadScene('shop');
            director.preloadScene('customize');
          }
        }

        onDestroy() {
          this.unschedule(this._doOpenSettings);
          this.unschedule(this._doBackToHome);
        }

        /** 从 home 进入设置场景 */
        onOpenSettings() {
          this.scheduleOnce(this._doOpenSettings, 0);
        }
        /** 从设置返回首页 */


        onBackToHome() {
          this.scheduleOnce(this._doBackToHome, 0);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=35aec10b8df8a3bc0ce8b9cd77d8bf421b7ecc8d.js.map
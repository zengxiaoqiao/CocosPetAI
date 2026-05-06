System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, RandomPlayPetAni, _dec, _class, _crd, ccclass, RandomPlayCatAni;

  function _reportPossibleCrUseOfRandomPlayPetAni(extras) {
    _reporterNs.report("RandomPlayPetAni", "./RandomPlayPetAni", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }, function (_unresolved_2) {
      RandomPlayPetAni = _unresolved_2.RandomPlayPetAni;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c9407YaZeVI+L13sH4+6MJ3", "RandomPlayCatAni", undefined);

      __checkObsolete__(['_decorator']);

      ({
        ccclass
      } = _decorator);

      _export("RandomPlayCatAni", RandomPlayCatAni = (_dec = ccclass('RandomPlayCatAni'), _dec(_class = class RandomPlayCatAni extends (_crd && RandomPlayPetAni === void 0 ? (_reportPossibleCrUseOfRandomPlayPetAni({
        error: Error()
      }), RandomPlayPetAni) : RandomPlayPetAni) {
        get prefix() {
          return 'cat';
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=124424eff06c7e99c2fbdfcbcde7a30ffb5553e0.js.map
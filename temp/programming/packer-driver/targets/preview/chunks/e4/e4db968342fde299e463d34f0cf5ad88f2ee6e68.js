System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, RandomPlayPetAni, _dec, _class, _crd, ccclass, RandomPlayDogAni;

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

      _cclegacy._RF.push({}, "34485vhxthHiYjCNg0pn2Xe", "RandomPlayDogAni", undefined);

      __checkObsolete__(['_decorator']);

      ({
        ccclass
      } = _decorator);

      _export("RandomPlayDogAni", RandomPlayDogAni = (_dec = ccclass('RandomPlayDogAni'), _dec(_class = class RandomPlayDogAni extends (_crd && RandomPlayPetAni === void 0 ? (_reportPossibleCrUseOfRandomPlayPetAni({
        error: Error()
      }), RandomPlayPetAni) : RandomPlayPetAni) {
        get prefix() {
          return 'dog';
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e4db968342fde299e463d34f0cf5ad88f2ee6e68.js.map
System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, director, sys, DogController, CatController, PetWake, _crd, STORAGE_KEY_PET;

  function _reportPossibleCrUseOfDogController(extras) {
    _reporterNs.report("DogController", "./DogController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCatController(extras) {
    _reporterNs.report("CatController", "./CatController", _context.meta, extras);
  }

  _export("PetWake", void 0);

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
      DogController = _unresolved_2.DogController;
    }, function (_unresolved_3) {
      CatController = _unresolved_3.CatController;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1f0997i4ltBNY28ErS3ILgd", "PetWake", undefined);

      __checkObsolete__(['director', 'sys']);

      STORAGE_KEY_PET = 'petai_pet_choice';

      _export("PetWake", PetWake = class PetWake {
        static _getControllers() {
          var scene = director.getScene();
          return {
            dog: (scene == null ? void 0 : scene.getComponentInChildren(_crd && DogController === void 0 ? (_reportPossibleCrUseOfDogController({
              error: Error()
            }), DogController) : DogController)) || null,
            cat: (scene == null ? void 0 : scene.getComponentInChildren(_crd && CatController === void 0 ? (_reportPossibleCrUseOfCatController({
              error: Error()
            }), CatController) : CatController)) || null
          };
        }
        /** Wake up a bit (start "thinking/listening"). */


        static nudgeAwake() {
          var isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';

          var {
            dog,
            cat
          } = PetWake._getControllers();

          if (isCat) cat == null || cat.wakeUpFromSleep();else dog == null || dog.wakeUpFromSleep();
        }
        /** Wake up and "respond" (talking animation). */


        static wakeToRespond() {
          var isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';

          var {
            dog,
            cat
          } = PetWake._getControllers();

          if (isCat) cat == null || cat.wakeToTalking();else dog == null || dog.wakeToTalking();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4c9ac5272b9066b37f22da752b507c0d826289ef.js.map
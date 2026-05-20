System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, AudioManager, PetVocalizer, _crd, STORAGE_KEY_PET;

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "./AudioManager", _context.meta, extras);
  }

  _export("PetVocalizer", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      AudioManager = _unresolved_2.AudioManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f237feJpUVHpJJQZwOoz6If", "PetVocalizer", undefined);

      __checkObsolete__(['sys']);

      STORAGE_KEY_PET = 'petai_pet_choice';

      _export("PetVocalizer", PetVocalizer = class PetVocalizer {
        static _pickOne(arr) {
          if (!arr.length) return null;
          return arr[Math.floor(Math.random() * arr.length)];
        }

        static _availableClips(prefix) {
          var inst = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;
          if (!inst) return [];
          var out = [];

          for (var i = 1; i <= 17; i++) {
            var key = "" + prefix + String(i).padStart(2, '0') + "Sound";
            if (inst[key]) out.push({
              i
            });
          }

          return out;
        }
        /** Plays a short non-verbal vocalization, based on current pet selection. */


        static playReplyVocal(replyText) {
          var inst = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;
          if (!inst) return; // Heuristic: different punctuation -> different "moods" (just bias selection).

          var t = (replyText || '').trim();
          var excited = /[!！]/.test(t);
          var curious = /[?？]/.test(t);
          var calm = t.length >= 40 && !excited && !curious;
          var isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
          var prefix = isCat ? 'cat' : 'dog';

          var avail = PetVocalizer._availableClips(prefix);

          if (!avail.length) return; // Bias towards a small subset if present (often used as "talking"/"cute" in this project),
          // otherwise pick from all bound clips.

          var preferred = prefix === 'cat' ? [15, 17, 6, 7, 8] : [15, 17, 6, 7, 8];
          var preferAvail = avail.filter(a => preferred.includes(a.i));
          var pool = preferAvail.length ? preferAvail : avail; // Add slight bias by mood: excited -> prefer higher indices, calm -> lower.

          var chosen = PetVocalizer._pickOne(pool);

          if (!chosen) return;

          if (excited) {
            var hi = pool.filter(p => p.i >= 14);
            chosen = PetVocalizer._pickOne(hi) || chosen;
          } else if (calm) {
            var lo = pool.filter(p => p.i <= 8);
            chosen = PetVocalizer._pickOne(lo) || chosen;
          } else if (curious) {
            var mid = pool.filter(p => p.i >= 6 && p.i <= 12);
            chosen = PetVocalizer._pickOne(mid) || chosen;
          } // Play the selected clip via existing static methods for consistency.


          var fn = AudioManager["playAnimSound" + (prefix === 'cat' ? 'Cat' : 'Dog') + String(chosen.i).padStart(2, '0')];
          if (typeof fn === 'function') fn.call(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=56dc2ba36f3e166ddfcadacdc30115d4f2a783de.js.map
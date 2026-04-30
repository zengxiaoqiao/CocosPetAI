import { sys } from 'cc';
import { AudioManager } from './AudioManager';

const STORAGE_KEY_PET = 'petai_pet_choice';

export class PetVocalizer {
    private static _pickOne<T>(arr: T[]): T | null {
        if (!arr.length) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private static _availableClips(prefix: 'dog' | 'cat'): Array<{ i: number }> {
        const inst = AudioManager.instance as any;
        if (!inst) return [];
        const out: Array<{ i: number }> = [];
        for (let i = 1; i <= 17; i++) {
            const key = `${prefix}${String(i).padStart(2, '0')}Sound`;
            if (inst[key]) out.push({ i });
        }
        return out;
    }

    /** Plays a short non-verbal vocalization, based on current pet selection. */
    static playReplyVocal(replyText: string) {
        const inst = AudioManager.instance;
        if (!inst) return;

        // Heuristic: different punctuation -> different "moods" (just bias selection).
        const t = (replyText || '').trim();
        const excited = /[!！]/.test(t);
        const curious = /[?？]/.test(t);
        const calm = t.length >= 40 && !excited && !curious;

        const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
        const prefix: 'dog' | 'cat' = isCat ? 'cat' : 'dog';
        const avail = PetVocalizer._availableClips(prefix);
        if (!avail.length) return;

        // Bias towards a small subset if present (often used as "talking"/"cute" in this project),
        // otherwise pick from all bound clips.
        const preferred = (prefix === 'cat')
            ? [15, 17, 6, 7, 8]
            : [15, 17, 6, 7, 8];

        const preferAvail = avail.filter(a => preferred.includes(a.i));
        const pool = preferAvail.length ? preferAvail : avail;

        // Add slight bias by mood: excited -> prefer higher indices, calm -> lower.
        let chosen = PetVocalizer._pickOne(pool);
        if (!chosen) return;
        if (excited) {
            const hi = pool.filter(p => p.i >= 14);
            chosen = PetVocalizer._pickOne(hi) || chosen;
        } else if (calm) {
            const lo = pool.filter(p => p.i <= 8);
            chosen = PetVocalizer._pickOne(lo) || chosen;
        } else if (curious) {
            const mid = pool.filter(p => p.i >= 6 && p.i <= 12);
            chosen = PetVocalizer._pickOne(mid) || chosen;
        }

        // Play the selected clip via existing static methods for consistency.
        const fn = (AudioManager as any)[`playAnimSound${prefix === 'cat' ? 'Cat' : 'Dog'}${String(chosen.i).padStart(2, '0')}`];
        if (typeof fn === 'function') fn.call(AudioManager);
    }
}


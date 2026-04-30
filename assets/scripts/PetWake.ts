import { director, sys } from 'cc';
import { DogController } from './DogController';
import { CatController } from './CatController';

const STORAGE_KEY_PET = 'petai_pet_choice';

export class PetWake {
    private static _getControllers(): { dog: DogController | null; cat: CatController | null } {
        const scene = director.getScene();
        return {
            dog: scene?.getComponentInChildren(DogController) || null,
            cat: scene?.getComponentInChildren(CatController) || null,
        };
    }

    /** Wake up a bit (start "thinking/listening"). */
    static nudgeAwake() {
        const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
        const { dog, cat } = PetWake._getControllers();
        if (isCat) cat?.wakeUpFromSleep();
        else dog?.wakeUpFromSleep();
    }

    /** Wake up and "respond" (talking animation). */
    static wakeToRespond() {
        const isCat = sys.localStorage.getItem(STORAGE_KEY_PET) === 'cat';
        const { dog, cat } = PetWake._getControllers();
        if (isCat) cat?.wakeToTalking();
        else dog?.wakeToTalking();
    }
}


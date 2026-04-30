import { _decorator } from 'cc';
import { RandomPlayPetAni } from './RandomPlayPetAni';
const { ccclass } = _decorator;

@ccclass('RandomPlayDogAni')
export class RandomPlayDogAni extends RandomPlayPetAni {
    protected get prefix(): 'dog' | 'cat' { return 'dog'; }
}

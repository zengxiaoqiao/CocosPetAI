import { _decorator } from 'cc';
import { RandomPlayPetAni } from './RandomPlayPetAni';
const { ccclass } = _decorator;

@ccclass('RandomPlayCatAni')
export class RandomPlayCatAni extends RandomPlayPetAni {
    protected get prefix(): 'dog' | 'cat' { return 'cat'; }
}

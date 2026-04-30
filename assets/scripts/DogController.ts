import { _decorator, Animation, Node, Label } from 'cc';
import { PetControllerBase } from './PetControllerBase';
import { PetValue } from './PetValue';
const { ccclass, property } = _decorator;

@ccclass('DogController')
export class DogController extends PetControllerBase {
    protected get prefix() { return 'dog' as const; }

    @property(Animation)
    public anim: Animation = null!;

    @property(Node)
    public scrollViewForSwipe: Node | null = null;
    @property(Node)
    public swipeAreaNode: Node | null = null;
    @property
    public swipeThreshold: number = 50;

    @property(Node)
    public rechargePanel: Node | null = null;

    @property(PetValue)
    public petValue: PetValue | null = null;

    @property(Label)
    public btn1Label: Label | null = null;
    @property(Label)
    public btn2Label: Label | null = null;
    @property(Label)
    public btn3Label: Label | null = null;

    /** 兼容旧调用 */
    public playDog12Sequence() { this.playSwipe12Sequence(); }
}

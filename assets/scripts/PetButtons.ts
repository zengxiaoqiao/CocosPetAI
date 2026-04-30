import { _decorator, Component, Node, ScrollView, Vec2, EventTouch, director, find } from 'cc';
import { DogController } from './DogController';
import { CatController } from './CatController';
import { SwipeState } from './SwipeState';
import { PetValue } from './PetValue';

const { ccclass, property } = _decorator;

/**
 * 同一组按钮控制狗/猫：根据当前显示的是谁，把 btn0～btn3 和滑动转发给 DogController 或 CatController。
 * 挂在任意节点上，把 dog 和 cat 节点拖进来；按钮的 Click Events 绑定到本脚本的 onBtn0Click～onBtn3Click。
 * 若用滑动播 dog12/cat12，把 ScrollView 拖到 scrollViewForSwipe，且 dog/cat 上的 ScrollView 留空。
 */
@ccclass('PetButtons')
export class PetButtons extends Component {

    @property(Node)
    dogNode: Node | null = null;

    @property(Node)
    catNode: Node | null = null;

    @property(ScrollView)
    scrollViewForSwipe: ScrollView | null = null;
    /** 与点击共用同一区域时：把该按钮/区域节点拖到这里，左滑/右滑播 dog12/cat12，点击照常。 */
    @property(Node)
    swipeAreaNode: Node | null = null;

    /** 充值界面节点：当其 active 时，不把 btn1/2/3 点击转发给狗/猫，避免误触 */
    @property(Node)
    rechargePanel: Node | null = null;

    @property({ tooltip: '滑动超过多少像素算有效滑动（任意方向，越大越不易与点击混淆）' })
    swipeThreshold: number = 50;

    @property({ tooltip: '需要滑动几次才触发动画' })
    swipeCountRequired: number = 2;

    @property({ tooltip: '触摸至少持续多少毫秒才算滑动（避免与点击混淆）' })
    swipeMinDurationMs: number = 100;

    @property({ tooltip: '开启时在控制台打印滑动进度' })
    swipeDebugLog: boolean = true;

    @property({ tooltip: '两次滑动之间超过多少毫秒会重置计数' })
    swipeTimeoutMs: number = 3000;

    private _swipeTouchStart: Vec2 = new Vec2();
    private _swipeTouchStartTime: number = 0;
    private _swipeCount: number = 0;
    private _swipeResetTimer: number | null = null;
    private _lastSwipePos: Vec2 = new Vec2();
    private _lastSwipeDirection: Vec2 = new Vec2();
    private _isTrackingSwipe: boolean = false;
    private _isPlayingSwipeAni: boolean = false;
    private _lastMoveTime: number = 0;
    private _swipeStopTimer: number | null = null;

    private _getSwipeNode(): Node | null {
        return this.swipeAreaNode || this.scrollViewForSwipe?.node || this.node;
    }

    onLoad() {
        const swipeNode = this._getSwipeNode();
        if (swipeNode) {
            swipeNode.on(Node.EventType.TOUCH_START, this._onSwipeTouchStart, this);
            swipeNode.on(Node.EventType.TOUCH_MOVE, this._onSwipeTouchMove, this);
            swipeNode.on(Node.EventType.TOUCH_END, this._onSwipeTouchEnd, this);
            swipeNode.on(Node.EventType.TOUCH_CANCEL, this._onSwipeTouchEnd, this);
        }
    }

    onDisable() {
        const swipeNode = this._getSwipeNode();
        if (swipeNode) {
            swipeNode.off(Node.EventType.TOUCH_START, this._onSwipeTouchStart, this);
            swipeNode.off(Node.EventType.TOUCH_MOVE, this._onSwipeTouchMove, this);
            swipeNode.off(Node.EventType.TOUCH_END, this._onSwipeTouchEnd, this);
            swipeNode.off(Node.EventType.TOUCH_CANCEL, this._onSwipeTouchEnd, this);
        }
        this._clearSwipeResetTimer();
        this._clearSwipeStopTimer();
        this._stopSwipeAnimation();
    }

    private _onSwipeTouchStart(e: EventTouch) {
        e.getUILocation(this._swipeTouchStart);
        this._swipeTouchStartTime = Date.now();
        this._lastMoveTime = Date.now();
        this._lastSwipePos.set(this._swipeTouchStart);
        this._lastSwipeDirection.set(0, 0);
        this._isTrackingSwipe = false;
        this._clearSwipeStopTimer();
    }

    private _clearSwipeStopTimer() {
        if (this._swipeStopTimer !== null) {
            clearTimeout(this._swipeStopTimer);
            this._swipeStopTimer = null;
        }
    }

    private _startSwipeAnimation() {
        if (this._isPlayingSwipeAni) return;
        this._isPlayingSwipeAni = true;
        if (this._isDogActive()) {
            const dogCtrl = this.dogNode?.getComponent(DogController);
            if (dogCtrl) {
                dogCtrl.playLoopClip('dog12');
                if (this.swipeDebugLog) console.log('[PetButtons] 开始播放 dog12');
            }
        } else {
            const catCtrl = this.catNode?.getComponent(CatController);
            if (catCtrl) {
                catCtrl.playLoopClip('cat12');
                if (this.swipeDebugLog) console.log('[PetButtons] 开始播放 cat12');
            }
        }
    }

    private _stopSwipeAnimation() {
        if (!this._isPlayingSwipeAni) return;
        this._isPlayingSwipeAni = false;
        if (this._isDogActive()) {
            const dogCtrl = this.dogNode?.getComponent(DogController);
            if (dogCtrl) {
                dogCtrl.playLoopClip('dog01');
                if (this.swipeDebugLog) console.log('[PetButtons] 停止滑动，播放 dog01');
            }
        } else {
            const catCtrl = this.catNode?.getComponent(CatController);
            if (catCtrl) {
                catCtrl.playLoopClip('cat01');
                if (this.swipeDebugLog) console.log('[PetButtons] 停止滑动，播放 cat01');
            }
        }
    }

    private _onSwipeTouchMove(e: EventTouch) {
        const current = new Vec2();
        e.getUILocation(current);
        const deltaX = current.x - this._lastSwipePos.x;
        const deltaY = current.y - this._lastSwipePos.y;
        const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (moveDistance < 10) return;
        this._lastMoveTime = Date.now();
        this._clearSwipeStopTimer();
        const currentDir = new Vec2(deltaX, deltaY);
        currentDir.normalize();
        if (!this._isTrackingSwipe) {
            const totalDistance = Math.sqrt(
                (current.x - this._swipeTouchStart.x) * (current.x - this._swipeTouchStart.x) +
                (current.y - this._swipeTouchStart.y) * (current.y - this._swipeTouchStart.y)
            );
            if (totalDistance >= this.swipeThreshold) {
                this._isTrackingSwipe = true;
                this._lastSwipeDirection.set(currentDir);
                this._lastSwipePos.set(current);
                this._startSwipeAnimation();
                this._clearSwipeResetTimer();
                this._swipeResetTimer = setTimeout(() => {
                    this._swipeResetTimer = null;
                    this._swipeCount = 0;
                    this._isTrackingSwipe = false;
                    if (this.swipeDebugLog) console.log(`[PetButtons] 滑动超时重置（${this.swipeTimeoutMs}ms内无新滑动）`);
                }, this.swipeTimeoutMs);
            }
        } else {
            const dot = this._lastSwipeDirection.x * currentDir.x + this._lastSwipeDirection.y * currentDir.y;
            if (dot < -0.5) {
                this._swipeCount++;
                const dirStr = Math.abs(deltaX) > Math.abs(deltaY) 
                    ? (deltaX > 0 ? '右' : '左')
                    : (deltaY > 0 ? '上' : '下');
                if (this.swipeDebugLog) {
                    console.log(`[PetButtons] 滑动${dirStr} 第${this._swipeCount}/${this.swipeCountRequired}次`);
                }
                this._lastSwipeDirection.set(currentDir);
                this._clearSwipeResetTimer();
                this._swipeResetTimer = setTimeout(() => {
                    this._swipeResetTimer = null;
                    this._swipeCount = 0;
                    this._isTrackingSwipe = false;
                    if (this.swipeDebugLog) console.log(`[PetButtons] 滑动超时重置（${this.swipeTimeoutMs}ms内无新滑动）`);
                }, this.swipeTimeoutMs);
                if (this._swipeCount >= this.swipeCountRequired) {
                    this._clearSwipeResetTimer();
                    this._swipeCount = 0;
                    this._isTrackingSwipe = false;
                    SwipeState.ignoreNextBtn0Click = true;
                    this.scheduleOnce(() => { SwipeState.ignoreNextBtn0Click = false; }, 0.1);
                    if (this.swipeDebugLog) console.log('[PetButtons] 滑动触发 dog12/cat12');
                }
            }
            this._lastSwipePos.set(current);
        }
        this._clearSwipeStopTimer();
        this._swipeStopTimer = setTimeout(() => {
            this._swipeStopTimer = null;
            if (Date.now() - this._lastMoveTime > 100) {
                this._stopSwipeAnimation();
            }
        }, 150);
    }

    private _clearSwipeResetTimer() {
        if (this._swipeResetTimer !== null) {
            clearTimeout(this._swipeResetTimer);
            this._swipeResetTimer = null;
        }
    }

    private _onSwipeTouchEnd(e: EventTouch) {
        if (this._isTrackingSwipe) {
            const end = new Vec2();
            e.getUILocation(end);
            const totalDistance = Math.sqrt(
                (end.x - this._swipeTouchStart.x) * (end.x - this._swipeTouchStart.x) +
                (end.y - this._swipeTouchStart.y) * (end.y - this._swipeTouchStart.y)
            );
            if (totalDistance >= this.swipeThreshold) {
                // 设置标志，防止滑动结束后误触点击
                SwipeState.ignoreNextBtn0Click = true;
                this.scheduleOnce(() => { SwipeState.ignoreNextBtn0Click = false; }, 0.2);
                const petNode = this._getCurrentPetNode();
                if (this._isDogActive()) {
                    this._getDogController()?.onBtn0Swipe(petNode || undefined);
                } else {
                    this._getCatController()?.onBtn0Swipe(petNode || undefined);
                }
            }
        }
        this._isTrackingSwipe = false;
        this._clearSwipeResetTimer();
        this._clearSwipeStopTimer();
        this._stopSwipeAnimation();
    }

    private _isDogActive(): boolean {
        return !!this.dogNode && this.dogNode.active;
    }

    private _getDogController(): DogController | null {
        return this.dogNode ? this.dogNode.getComponent(DogController) : null;
    }

    private _getCatController(): CatController | null {
        return this.catNode ? this.catNode.getComponent(CatController) : null;
    }

    private _ensurePetValue(): PetValue | null {
        const n = find('Canvas/pet_value');
        return n ? n.getComponent(PetValue) : (director.getScene()?.getComponentInChildren(PetValue) || null);
    }

    private _getCurrentPetNode(): Node | null {
        return this._isDogActive() ? this.dogNode : this.catNode;
    }

    public onBtn0Click() {
        if (this._isDogActive()) {
            this._getDogController()?.onBtn0Click();
        } else {
            this._getCatController()?.onBtn0Click();
        }
    }

    public onBtn1Click() {
        if (this.rechargePanel && this.rechargePanel.active) return;
        if (this._isDogActive()) {
            this._getDogController()?.onBtn1Click();
        } else {
            this._getCatController()?.onBtn1Click();
        }
    }

    public onBtn2Click() {
        if (this.rechargePanel && this.rechargePanel.active) return;
        if (this._isDogActive()) {
            this._getDogController()?.onBtn2Click();
        } else {
            this._getCatController()?.onBtn2Click();
        }
    }

    public onBtn3Click() {
        if (this.rechargePanel && this.rechargePanel.active) return;
        if (this._isDogActive()) {
            this._getDogController()?.onBtn3Click();
        } else {
            this._getCatController()?.onBtn3Click();
        }
    }
}

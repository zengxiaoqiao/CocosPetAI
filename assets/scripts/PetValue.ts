import { _decorator, Component, Label, sys, Node, tween, Vec3, UITransform, UIOpacity, Color, find, director, ProgressBar, game, Game } from 'cc';
import { SharedBtnCounts } from './SharedBtnCounts';
import { AudioManager } from './AudioManager';
import { BtnAdGuard } from './BtnAdGuard';
import { AdButton } from './AdButton';
import { syncWidgetFromStorage } from './WidgetSync';
import { getLocalDateString } from './DateUtil';
import { PetInfoBar } from './PetInfoBar';
const { ccclass, property } = _decorator;

const STORAGE_KEY_HP = 'petai_hp';
const STORAGE_KEY_MOOD = 'petai_mood';
const STORAGE_KEY_INTIMACY_LEGACY = 'petai_intimacy';
const STORAGE_KEY_LAST = 'petai_last_update';
const STORAGE_KEY_TODAY_PET_DATE = 'petai_today_pet_date';
const STORAGE_KEY_TODAY_PET_COUNT = 'petai_today_pet_count';
/** 仅首次运行后设为 '1'，用于区分真正首次安装与已有存档 */
const STORAGE_KEY_FIRST_RUN_DONE = 'petai_first_run_done';
const MS_PER_HOUR = 3600000;
const DECREASE_MOOD_PER_HOUR = 1;
const MAX_VALUE = 100;

/** 每轮语音对话消耗体力（主界面不展示，仅低体力时提示饿了） */
export const VOICE_CHAT_HP_COST = 8;
/** 每轮语音对话增加心情（主界面飘字可见） */
export const VOICE_CHAT_MOOD_GAIN = 3;

/** 是否为本次安装后的首个会话（仅当前进程内为 true，一旦保存过 FIRST_RUN_DONE，后续重启即为 false） */
export const IS_FIRST_SESSION = sys.localStorage.getItem(STORAGE_KEY_FIRST_RUN_DONE) !== '1';

/** 距离下一个本地整点的毫秒数 */
function getMsUntilNextFullHour(): number {
    const now = new Date();
    const msIntoHour = (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
    return MS_PER_HOUR - msIntoHour;
}

/**
 * 体力 / 心情：主界面只展示心情；体力后台保留，低时由 PetInfoBar 提示饿了。
 * 心情整点 −1；体力仅语音聊天等消耗，不整点衰减。
 */
@ccclass('PetValue')
export class PetValue extends Component {

    @property(Label)
    hpLabel: Label | null = null;

    /** 心情数值标签（场景里可能仍名为 intimacyLabel） */
    @property(Label)
    intimacyLabel: Label | null = null;

    @property(ProgressBar)
    hpBar: ProgressBar | null = null;

    @property(ProgressBar)
    intimacyBar: ProgressBar | null = null;

    /** 心情 > 80 时显示的节点（如 home 下的 highintimate），未绑定时按 Canvas/highintimate 查找 */
    @property(Node)
    highIntimateNode: Node | null = null;

    /** 全局单例，供其它逻辑使用 */
    public static instance: PetValue | null = null;

    private _hp: number = 50;
    private _mood: number = 50;

    onLoad() {
        SharedBtnCounts.init();
        // Check-in 仅通过点击 ad 节点弹出，不再自动弹出
        const firstRunDone = sys.localStorage.getItem(STORAGE_KEY_FIRST_RUN_DONE) === '1';
        const savedHp = sys.localStorage.getItem(STORAGE_KEY_HP);
        const savedMood = sys.localStorage.getItem(STORAGE_KEY_MOOD)
            ?? sys.localStorage.getItem(STORAGE_KEY_INTIMACY_LEGACY);
        const savedLast = sys.localStorage.getItem(STORAGE_KEY_LAST);
        if (firstRunDone) {
            if (savedHp != null && savedHp !== '') this._hp = Math.max(0, Math.min(MAX_VALUE, parseInt(savedHp, 10) || 0));
            if (savedMood != null && savedMood !== '') this._mood = Math.max(0, Math.min(MAX_VALUE, parseInt(savedMood, 10) || 0));
        }
        this._applyHourlyCatchUp(savedLast, firstRunDone);
        this._save(true);
        this._hideHpUi();
        this._updateLabels();
        // 确保数量为 0 时 Button1/2/3 仍能跳转 AD
        const canvas = find('Canvas');
        if (canvas && !canvas.getComponent(BtnAdGuard)) canvas.addComponent(BtnAdGuard);
        // ad 节点：点击后弹出 Check-in，可领取数量与规则不变
        const adNode = find('Canvas/ad');
        if (adNode && !adNode.getComponent(AdButton)) {
            adNode.addComponent(AdButton);
        }
        // 道具键由 AdButton 统一绑定；BtnAdGuard 仅处理次数为 0 时跳广告
        // 调试：打印节点与 Label 绑定情况
        const childNames = this.node.children.map(c => c.name);
        console.log('[PetValue] onLoad node =', this.node.name, 'children =', childNames, 'hpLabel?', !!this.hpLabel, 'intimacyLabel?', !!this.intimacyLabel);
        // 定时任务：每个整点扣减心情
        const delayMs = getMsUntilNextFullHour();
        const delaySeconds = Math.max(1, Math.floor(delayMs / 1000));
        this.scheduleOnce(() => {
            this._tickHourly();
            // 之后每 1 小时执行一次；不传 repeat 参数表示一直循环
            this.schedule(this._tickHourly, 3600); // 每 1 小时
        }, delaySeconds);
        game.on(Game.EVENT_SHOW, this._onGameShow, this);
    }

    onEnable() {
        PetValue.instance = this;
    }

    onDisable() {
        if (PetValue.instance === this) PetValue.instance = null;
        this.unschedule(this._tickHourly);
        game.off(Game.EVENT_SHOW, this._onGameShow, this);
    }

    /** 从后台回到前台：补扣心情整点 */
    private _onGameShow() {
        if (!this.isValid) return;
        const savedLast = sys.localStorage.getItem(STORAGE_KEY_LAST);
        this._applyHourlyCatchUp(savedLast, true);
        this._save(true);
        this._updateLabels();
    }

    /**
     * 按「上次整点」与「当前整点」的经过小时数扣减心情（仅扣减，不写入 LAST；由调用方 _save(true)）。
     * @param savedLast 本地存的 petai_last_update
     * @param doCatchUp 是否执行扣减（首次安装或无 LAST 时不扣）
     */
    private _applyHourlyCatchUp(savedLast: string | null, doCatchUp: boolean) {
        if (!doCatchUp || savedLast == null || savedLast === '') return;
        const now = Date.now();
        const currentHourStart = Math.floor(now / MS_PER_HOUR) * MS_PER_HOUR;
        let lastTickHourStart: number;
        if (/^\d{4}-\d{2}-\d{2}$/.test(savedLast)) {
            const [y, m, d] = savedLast.split('-').map(Number);
            lastTickHourStart = new Date(y, m - 1, d).getTime();
        } else {
            lastTickHourStart = parseInt(savedLast, 10) || 0;
        }
        const elapsedHours = Math.max(0, Math.floor((currentHourStart - lastTickHourStart) / MS_PER_HOUR));
        if (elapsedHours > 0) {
            this._mood = Math.max(0, Math.min(MAX_VALUE, this._mood - elapsedHours * DECREASE_MOOD_PER_HOUR));
        }
    }

    /** 增加体力，上限 MAX_VALUE */
    public addHp(amount: number): void {
        if (amount <= 0) return;
        this._hp = Math.min(MAX_VALUE, this._hp + amount);
        this._save();
        this._updateLabels();
    }

    private _tickHourly() {
        this._mood = Math.max(0, Math.min(MAX_VALUE, this._mood - DECREASE_MOOD_PER_HOUR));
        this._save(true);
        this._updateLabels();
    }

    /** @param updateLastTick 仅在做整点扣减（或 onLoad 补扣）后传 true，其它保存不更新上次整点 */
    private _save(updateLastTick = false) {
        try {
            sys.localStorage.setItem(STORAGE_KEY_HP, String(this._hp));
            sys.localStorage.setItem(STORAGE_KEY_MOOD, String(this._mood));
            sys.localStorage.setItem(STORAGE_KEY_FIRST_RUN_DONE, '1');
            if (updateLastTick) {
                const hourStart = Math.floor(Date.now() / MS_PER_HOUR) * MS_PER_HOUR;
                sys.localStorage.setItem(STORAGE_KEY_LAST, String(hourStart));
            }
            syncWidgetFromStorage();
        } catch (e) { console.warn('[PetValue] 保存失败', e); }
    }

    /** 主界面不展示体力（数值仍存盘）；编辑器里已隐藏时此处兜底 */
    private _hideHpUi(): void {
        const petHp = this.node.getChildByName('pet_hp');
        if (petHp) petHp.active = false;
        const hp = this.node.getChildByName('hp');
        if (hp) hp.active = false;
        if (this.hpLabel?.node) this.hpLabel.node.active = false;
        if (this.hpBar?.node) this.hpBar.node.active = false;
    }

    private _updateLabels() {
        this._ensureLabels();
        this._ensureBars();
        this._hideHpUi();
        if (this.intimacyLabel) this.intimacyLabel.string = String(this._mood);
        if (this.intimacyBar) this.intimacyBar.progress = this._mood / MAX_VALUE;
        const highNode = this._ensureHighIntimateNode();
        if (highNode) highNode.active = this.isMoodHigh() && !this.isHpLow() && !this.isMoodLow();
        PetInfoBar.instance?.refreshLowHpFeedPrompt();
    }

    public get mood(): number { return this._mood; }

    /** 兜底：Inspector 未绑定进度条时，按 pet_value 下两栏自动查找 ProgressBar */
    private _ensureBars() {
        if (!this.hpBar && this.node.children.length > 0) {
            const first = this.node.children[0];
            this.hpBar = first.getComponent(ProgressBar) || first.getComponentInChildren(ProgressBar) || null;
        }
        if (!this.intimacyBar && this.node.children.length > 1) {
            const second = this.node.children[1];
            this.intimacyBar = second.getComponent(ProgressBar) || second.getComponentInChildren(ProgressBar) || null;
        }
    }

    private _ensureHighIntimateNode(): Node | null {
        if (this.highIntimateNode) return this.highIntimateNode;
        const canvas = this.node.parent;
        if (canvas) {
            this.highIntimateNode = canvas.getChildByName('highintimate') || null;
        }
        if (!this.highIntimateNode) {
            this.highIntimateNode = find('Canvas/highintimate') || null;
        }
        return this.highIntimateNode;
    }

    /** 麦克风是否可用：不与体力/心情挂钩。 */
    public canUseMicro(): boolean {
        return true;
    }

    public isHpLowForMicro(): boolean { return this._hp < 60; }
    public isMoodLowForMicro(): boolean { return this._mood < 60; }
    /** @deprecated 使用 isMoodLowForMicro */
    public isIntimacyLowForMicro(): boolean { return this.isMoodLowForMicro(); }

    public isHpZero(): boolean { return this._hp <= 0; }
    public isHpLow(): boolean { return this._hp < 20; }

    /** 对话框内展示「喂食」引导（略早于累趴动画阈值） */
    public shouldShowFeedBubble(): boolean { return this._hp < 30; }
    public isMoodZero(): boolean { return this._mood <= 0; }
    public isMoodLow(): boolean { return this._mood < 20; }
    public isMoodHigh(): boolean { return this._mood > 80; }
    /** @deprecated 使用 isMoodZero */
    public isIntimacyZero(): boolean { return this.isMoodZero(); }
    /** @deprecated 使用 isMoodLow */
    public isIntimacyLow(): boolean { return this.isMoodLow(); }
    /** @deprecated 使用 isMoodHigh */
    public isIntimacyHigh(): boolean { return this.isMoodHigh(); }

    /**
     * 兜底：如果 Inspector 里没有手动绑定 hpLabel/intimacyLabel，
     * 则根据当前节点下的子节点名称自动查找（hp / pet_hp / fs）。
     * 已经在 Inspector 绑定好的情况下不会覆盖。
     */
    /** 心情条根节点（❤️ 图标 + 数字），二者为 pet_value 下并列子节点 */
    private _getMoodBarRoot(): Node {
        return this.node;
    }

    /** 加心情时：整个心情条（心形 + 数值）一起缩放弹跳 */
    private _playMoodBarScale() {
        const root = this._getMoodBarRoot();
        if (!root?.isValid) return;
        root.setScale(1, 1, 1);
        tween(root)
            .to(0.1, { scale: new Vec3(1.32, 1.32, 1) })
            .to(0.14, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .to(0.1, { scale: new Vec3(1.24, 1.24, 1) })
            .to(0.14, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
    }

    private _playMoodHeartsIfHappy() {
        if (!this.isMoodHigh() || this.isHpLow() || this.isMoodLow()) return;
        const hi = find('Canvas/highintimate');
        const heartComp = hi?.getComponent('HeartBubbleAni') as { burstOnce?(n?: number): void } | null;
        heartComp?.burstOnce?.(5);
    }

    /** 其它数值标签（如体力飘字落点）仅缩放文字节点 */
    private _playTargetScale(target: Label) {
        const n = target.node;
        n.setScale(1, 1, 1);
        tween(n)
            .to(0.1, { scale: new Vec3(1.5, 1.5, 1) })
            .to(0.12, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .to(0.1, { scale: new Vec3(1.4, 1.4, 1) })
            .to(0.12, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
    }

    private _ensureLabels() {
        if (!this.hpLabel) {
            const hpNode = this.node.getChildByName('hp');
            if (hpNode) {
                this.hpLabel = hpNode.getComponent(Label) || hpNode.getComponentInChildren(Label);
            }
            if (!this.hpLabel) {
                const petHpNode = this.node.getChildByName('pet_hp');
                if (petHpNode) {
                    this.hpLabel = petHpNode.getComponent(Label) || petHpNode.getComponentInChildren(Label);
                }
            }
            console.log('[PetValue] _ensureLabels hpLabel set to', this.hpLabel?.node.name ?? 'null');
        }
        if (!this.intimacyLabel) {
            const fsNode = this.node.getChildByName('fs');
            if (fsNode) {
                this.intimacyLabel = fsNode.getComponent(Label) || fsNode.getComponentInChildren(Label);
            }
            if (!this.intimacyLabel) {
                const friendship = this.node.getChildByName('pet_friendship');
                if (friendship) {
                    this.intimacyLabel = friendship.getComponentInChildren(Label);
                }
            }
        }
    }

    /**
     * 心情 +N：在宠物旁上飘并淡出，不飞向 ❤️ 数字；数字立即更新并缩放弹跳。
     */
    public _spawnMoodFloatUp(delta: number, petNode?: Node, offsetX: number = 0, onArrive?: () => void) {
        const target = this.intimacyLabel;
        if (!target || !delta) return;
        const canvas = this.node.parent;
        if (!canvas) return;

        if (onArrive) onArrive();
        this._playMoodBarScale();
        this._playMoodHeartsIfHappy();
        AudioManager.playValueIncreaseSound();

        const deltaNode = new Node('MoodDeltaFloat');
        deltaNode.addComponent(UITransform);
        const label = deltaNode.addComponent(Label);
        label.string = `${delta > 0 ? '+' : ''}${delta}`;
        const scaleFactor = 1.25;
        label.fontSize = Math.max(28, target.fontSize * scaleFactor);
        label.lineHeight = Math.max(32, target.lineHeight * scaleFactor);
        (label as any).isBold = true;
        label.color = new Color(255, 105, 180, 255);

        const opacity = deltaNode.addComponent(UIOpacity);
        opacity.opacity = 0;
        canvas.addChild(deltaNode);

        const canvasUIT = canvas.getComponent(UITransform);
        const targetUIT = target.node.getComponent(UITransform);
        if (!canvasUIT || !targetUIT) {
            deltaNode.destroy();
            return;
        }

        let startLocalPos: Vec3;
        if (petNode) {
            const petUIT = petNode.getComponent(UITransform);
            if (petUIT) {
                const petH = Math.max(petUIT.contentSize.height, 200);
                const petStartLocal = new Vec3(0, petH / 2 - 60, 0);
                startLocalPos = canvasUIT.convertToNodeSpaceAR(petUIT.convertToWorldSpaceAR(petStartLocal));
            } else {
                startLocalPos = canvasUIT.convertToNodeSpaceAR(targetUIT.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
            }
        } else {
            startLocalPos = canvasUIT.convertToNodeSpaceAR(targetUIT.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
        }

        const startX = startLocalPos.x + offsetX;
        const startY = startLocalPos.y;
        const startZ = startLocalPos.z;
        const riseY = 88;
        const floatDuration = 0.48;

        deltaNode.setPosition(startX, startY, startZ);
        deltaNode.setScale(0.9, 0.9, 1);

        tween(deltaNode)
            .to(0.06, { scale: new Vec3(1.12, 1.12, 1) })
            .to(floatDuration, { position: new Vec3(startX, startY + riseY, startZ) }, { easing: 'sineOut' })
            .call(() => {
                if (deltaNode.isValid) deltaNode.destroy();
            })
            .start();

        tween(opacity)
            .to(0.1, { opacity: 255 })
            .delay(0.12)
            .to(0.3, { opacity: 0 })
            .start();
    }

    /**
     * 飘字动画：起始于宠物节点顶端靠下 100px，0.4 秒后到达宠物节点顶端，停留指定时间后沿轨迹飘向原数值标签（体力等）。
     */
    public _spawnDeltaLabel(target: Label | null, delta: number, petNode?: Node, offsetX: number = 0, stayDuration: number = 3, onArrive?: () => void) {
        if (target === this.intimacyLabel) {
            this._spawnMoodFloatUp(delta, petNode, offsetX, onArrive);
            return;
        }
        if (!target || !delta) return;
        const canvas = this.node.parent;
        if (!canvas) return;
        const deltaNode = new Node('DeltaLabel');
        deltaNode.addComponent(UITransform);
        const label = deltaNode.addComponent(Label);
        label.string = `${delta > 0 ? '+' : ''}${delta}`;

        // 字体稍微放大、加粗
        const scaleFactor = 1.2;
        label.fontSize = target.fontSize * scaleFactor;
        label.lineHeight = target.lineHeight * scaleFactor;
        (label as any).isBold = true;

        // 根据是体力还是亲密度设置颜色：体力黄色，亲密桃红
        if (target === this.hpLabel) {
            label.color = new Color(255, 236, 61, 255);       // 明亮黄色
        } else if (target === this.intimacyLabel) {
            label.color = new Color(255, 105, 180, 255);      // 桃红色
        }

        // 通过 UIOpacity 控制整体透明度（开始时透明）
        const opacity = deltaNode.addComponent(UIOpacity);
        opacity.opacity = 0;

        canvas.addChild(deltaNode);

        const canvasUIT = canvas.getComponent(UITransform);
        const targetUIT = target.node.getComponent(UITransform);
        if (!canvasUIT || !targetUIT) {
            deltaNode.destroy();
            return;
        }

        const targetWorldPos = targetUIT.convertToWorldSpaceAR(new Vec3(0, 0, 0));
        let startLocalPos: Vec3;
        let floatUpEndLocalPos: Vec3;
        if (petNode) {
            const petUIT = petNode.getComponent(UITransform);
            if (petUIT) {
                const petH = Math.max(petUIT.contentSize.height, 200);
                const petTopLocal = new Vec3(0, petH / 2, 0);
                const petStartLocal = new Vec3(0, petH / 2 - 100, 0);
                startLocalPos = canvasUIT.convertToNodeSpaceAR(petUIT.convertToWorldSpaceAR(petStartLocal));
                floatUpEndLocalPos = canvasUIT.convertToNodeSpaceAR(petUIT.convertToWorldSpaceAR(petTopLocal));
            } else {
                startLocalPos = canvasUIT.convertToNodeSpaceAR(targetWorldPos);
                floatUpEndLocalPos = startLocalPos.clone();
            }
        } else {
            startLocalPos = canvasUIT.convertToNodeSpaceAR(targetWorldPos);
            floatUpEndLocalPos = startLocalPos.clone();
        }
        const endLocalPos = canvasUIT.convertToNodeSpaceAR(targetWorldPos);

        deltaNode.setPosition(startLocalPos.x + offsetX, startLocalPos.y, startLocalPos.z);

        const flyDuration = 0.5;
        const arcHeight = 30;

        const flyStartX = floatUpEndLocalPos.x + offsetX;
        const flyStartY = floatUpEndLocalPos.y;
        const flyStartZ = floatUpEndLocalPos.z;

        tween(deltaNode)
            .to(0.4, { position: new Vec3(floatUpEndLocalPos.x + offsetX, floatUpEndLocalPos.y, floatUpEndLocalPos.z) })
            .call(() => {
                tween(deltaNode).to(0.15, { scale: new Vec3(1.25, 1.25, 1) }).start();
            })
            .delay(stayDuration)
            .call(() => {
                const proxy = { t: 0 };
                tween(proxy)
                    .to(flyDuration, { t: 1 }, {
                        easing: 'sineOut',
                        onUpdate: () => {
                            const k = proxy.t;
                            const x = flyStartX + (endLocalPos.x - flyStartX) * k;
                            const y = flyStartY + (endLocalPos.y - flyStartY) * k + 2 * arcHeight * k * (1 - k);
                            deltaNode.setPosition(x, y, flyStartZ);
                        }
                    })
                    .call(() => {
                        deltaNode.destroy();
                        AudioManager.playValueIncreaseSound();
                        if (onArrive) {
                            onArrive();
                        }
                        this._playTargetScale(target);
                    })
                    .start();
            })
            .start();

        // 同步做 0 → 0.4 秒的渐显
        tween(opacity)
            .to(0.4, { opacity: 255 })
            .start();
    }

    /**
     * 飘字直接飞向目标（无停留）：用于 Check-in 领取时数字飞向 button1/2/3
     */
    public spawnFlyingLabelDirect(startNode: Node, target: Label | null, delta: number, color?: Color, onArrive?: () => void) {
        if (!target || !delta) return;
        const canvas = this.node.parent;
        if (!canvas) return;
        const deltaNode = new Node('DeltaLabel');
        deltaNode.addComponent(UITransform);
        const label = deltaNode.addComponent(Label);
        label.string = `${delta > 0 ? '+' : ''}${delta}`;
        const scaleFactor = 1.2;
        label.fontSize = target.fontSize * scaleFactor;
        label.lineHeight = target.lineHeight * scaleFactor;
        (label as any).isBold = true;
        label.color = color || new Color(255, 236, 61, 255);
        const opacity = deltaNode.addComponent(UIOpacity);
        opacity.opacity = 0;
        canvas.addChild(deltaNode);
        const canvasUIT = canvas.getComponent(UITransform);
        const targetUIT = target.node.getComponent(UITransform);
        const startUIT = startNode.getComponent(UITransform);
        if (!canvasUIT || !targetUIT || !startUIT) {
            deltaNode.destroy();
            return;
        }
        const startLocalPos = canvasUIT.convertToNodeSpaceAR(startUIT.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
        const endLocalPos = canvasUIT.convertToNodeSpaceAR(targetUIT.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
        deltaNode.setPosition(startLocalPos);
        const flyDuration = 0.5;
        const arcHeight = 25;
        tween(opacity).to(0.15, { opacity: 255 }).start();
        const proxy = { t: 0 };
        tween(proxy)
            .to(flyDuration, { t: 1 }, {
                easing: 'sineOut',
                onUpdate: () => {
                    const k = proxy.t;
                    const x = startLocalPos.x + (endLocalPos.x - startLocalPos.x) * k;
                    const y = startLocalPos.y + (endLocalPos.y - startLocalPos.y) * k + 2 * arcHeight * k * (1 - k);
                    deltaNode.setPosition(x, y, startLocalPos.z);
                }
            })
            .call(() => {
                deltaNode.destroy();
                AudioManager.playValueIncreaseSound();
                if (onArrive) onArrive();
                this._playTargetScale(target);
            })
            .start();
    }

    /** Button1：体力 +20（不展示），心情 +5（飘字） */
    public applyBtn1(petNode?: Node) {
        const addHp = 20;
        const addMood = 5;
        this._hp = Math.min(MAX_VALUE, this._hp + addHp);
        this._mood = Math.min(MAX_VALUE, this._mood + addMood);
        this._save();
        const syncLabels = () => this._updateLabels();
        if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
        } else {
            this._updateLabels();
        }
        PetInfoBar.instance?.refreshLowHpFeedPrompt();
    }

    /**
     * 完成一轮语音/文字聊天：扣体力（无飘字），加心情（桃红飘字 + 更新 ❤️ 数字）。
     */
    public applyVoiceChat(petNode?: Node) {
        this._hp = Math.max(0, this._hp - VOICE_CHAT_HP_COST);
        const addMood = VOICE_CHAT_MOOD_GAIN;
        this._mood = Math.min(MAX_VALUE, this._mood + addMood);
        this._save();
        const syncLabels = () => this._updateLabels();
        if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
        } else {
            syncLabels();
        }
        PetInfoBar.instance?.refreshLowHpFeedPrompt();
    }

    /** Button2：心情 +20 */
    public applyBtn2(petNode?: Node) {
        const addMood = 20;
        this._mood = Math.min(MAX_VALUE, this._mood + addMood);
        this._save();
        const syncLabels = () => this._updateLabels();
        if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
        } else {
            this._updateLabels();
        }
    }

    /** Button3：心情 +20 */
    public applyBtn3(petNode?: Node) {
        const addMood = 20;
        this._mood = Math.min(MAX_VALUE, this._mood + addMood);
        this._save();
        const syncLabels = () => this._updateLabels();
        if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
        } else {
            this._updateLabels();
        }
    }

    /** 今日撸猫/逗狗次数 +1（按设备本地 0 点日期，跨日清零） */
    public static incrementTodayPetCount(): void {
        const today = getLocalDateString();
        const lastDate = sys.localStorage.getItem(STORAGE_KEY_TODAY_PET_DATE) || '';
        const count = lastDate === today
            ? (parseInt(sys.localStorage.getItem(STORAGE_KEY_TODAY_PET_COUNT) || '0', 10) || 0) + 1
            : 1;
        sys.localStorage.setItem(STORAGE_KEY_TODAY_PET_DATE, today);
        sys.localStorage.setItem(STORAGE_KEY_TODAY_PET_COUNT, String(count));
    }

    /** Button0：心情 +2 */
    public applyBtn0(petNode?: Node) {
        PetValue.incrementTodayPetCount();
        const addMood = 2;
        this._mood = Math.min(MAX_VALUE, this._mood + addMood);
        this._save();
        const syncLabels = () => this._updateLabels();
        if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
        } else {
            this._updateLabels();
        }
    }

    /** 滑动：心情 +5 */
    public applySwipe(petNode?: Node) {
        PetValue.incrementTodayPetCount();
        const addMood = 5;
        this._mood = Math.min(MAX_VALUE, this._mood + addMood);
        this._save();
        const syncLabels = () => this._updateLabels();
        if (this.intimacyLabel) {
            this._spawnMoodFloatUp(addMood, petNode, 0, syncLabels);
        } else {
            this._updateLabels();
        }
    }

    /** 每分钟 3 次上限时的提示：交给 pet_info_bar 节点上的 PetInfoBar 显示，约 2 秒后恢复原文案 */
    public showPerMinuteLimitHint(text?: string, _petNode?: Node) {
        PetInfoBar.instance?.showPerMinuteLimitHint(text);
    }
}

import { _decorator, Component, Label, sys, Node, tween, Vec3, UITransform, UIOpacity, Color, find, director, ProgressBar, game, Game } from 'cc';
import { SharedBtnCounts } from './SharedBtnCounts';
import { AudioManager } from './AudioManager';
import { BtnAdGuard } from './BtnAdGuard';
import { AdButton } from './AdButton';
import { syncWidgetFromStorage, syncWidgetWeather, clearWidgetWeather } from './WidgetSync';
import { getLocalDateString } from './DateUtil';
import { PetInfoBar } from './PetInfoBar';
import { getHpZeroTip, getIntimacyZeroTip } from './TipCopy';
const { ccclass, property } = _decorator;

const STORAGE_KEY_HP = 'petai_hp';
const STORAGE_KEY_INTIMACY = 'petai_intimacy';
const STORAGE_KEY_LAST = 'petai_last_update';
const STORAGE_KEY_TODAY_PET_DATE = 'petai_today_pet_date';
const STORAGE_KEY_TODAY_PET_COUNT = 'petai_today_pet_count';
/** 仅首次运行后设为 '1'，用于区分真正首次安装与已有存档 */
const STORAGE_KEY_FIRST_RUN_DONE = 'petai_first_run_done';
const MS_PER_HOUR = 3600000;
const DECREASE_HP_PER_HOUR = 3;
const DECREASE_INTIMACY_PER_HOUR = 3;
const MAX_VALUE = 100;

/** 是否为本次安装后的首个会话（仅当前进程内为 true，一旦保存过 FIRST_RUN_DONE，后续重启即为 false） */
export const IS_FIRST_SESSION = sys.localStorage.getItem(STORAGE_KEY_FIRST_RUN_DONE) !== '1';

/** 距离下一个本地整点的毫秒数 */
function getMsUntilNextFullHour(): number {
    const now = new Date();
    const msIntoHour = (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
    return MS_PER_HOUR - msIntoHour;
}

/**
 * 体力/亲密度：持久化，范围 [0, MAX_VALUE]，每个整点（设备本地）体力扣 3、亲密度扣 3；按钮点击时 applyBtn1/2/3 更新并保存。
 */
@ccclass('PetValue')
export class PetValue extends Component {

    @property(Label)
    hpLabel: Label | null = null;

    @property(Label)
    intimacyLabel: Label | null = null;

    @property(ProgressBar)
    hpBar: ProgressBar | null = null;

    @property(ProgressBar)
    intimacyBar: ProgressBar | null = null;

    /** 亲密度 > 80 时显示的节点（如 home 下的 highintimate），未绑定时按 Canvas/highintimate 查找 */
    @property(Node)
    highIntimateNode: Node | null = null;

    /** 全局单例，供其它逻辑使用 */
    public static instance: PetValue | null = null;

    // 初始体力/亲密度，上限 MAX_VALUE
    private _hp: number = 50;
    private _intimacy: number = 50;

    /** 上一帧是否处于体力/心情低状态，用于在恢复后清空 Widget 文案 */
    private _prevHpLow: boolean = false;
    private _prevIntimacyLow: boolean = false;

    onLoad() {
        SharedBtnCounts.init();
        // Check-in 仅通过点击 ad 节点弹出，不再自动弹出
        const firstRunDone = sys.localStorage.getItem(STORAGE_KEY_FIRST_RUN_DONE) === '1';
        const savedHp = sys.localStorage.getItem(STORAGE_KEY_HP);
        const savedIntimacy = sys.localStorage.getItem(STORAGE_KEY_INTIMACY);
        const savedLast = sys.localStorage.getItem(STORAGE_KEY_LAST);
        // 仅非首次安装且存在有效存储值时才从存档覆盖；首次安装固定 50/50，避免被 "" 或异常值解析成 0
        if (firstRunDone) {
            if (savedHp != null && savedHp !== '') this._hp = Math.max(0, Math.min(MAX_VALUE, parseInt(savedHp, 10) || 0));
            if (savedIntimacy != null && savedIntimacy !== '') this._intimacy = Math.max(0, Math.min(MAX_VALUE, parseInt(savedIntimacy, 10) || 0));
        }
        this._applyHourlyCatchUp(savedLast, firstRunDone);
        this._save(true);
        this._updateLabels();
        // 确保数量为 0 时 Button1/2/3 仍能跳转 AD
        const canvas = find('Canvas');
        if (canvas && !canvas.getComponent(BtnAdGuard)) canvas.addComponent(BtnAdGuard);
        // ad 节点：点击后弹出 Check-in，可领取数量与规则不变
        const adNode = find('Canvas/ad');
        if (adNode && !adNode.getComponent(AdButton)) adNode.addComponent(AdButton);
        // 调试：打印节点与 Label 绑定情况
        const childNames = this.node.children.map(c => c.name);
        console.log('[PetValue] onLoad node =', this.node.name, 'children =', childNames, 'hpLabel?', !!this.hpLabel, 'intimacyLabel?', !!this.intimacyLabel);
        // 定时任务：每个整点扣减（体力 -3，亲密度 -3）
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

    /** 从后台回到前台时执行：按距上次整点经过的小时数补扣体力/亲密度，避免长时间挂后台不扣减 */
    private _onGameShow() {
        if (!this.isValid) return;
        const savedLast = sys.localStorage.getItem(STORAGE_KEY_LAST);
        this._applyHourlyCatchUp(savedLast, true);
        this._save(true);
        this._updateLabels();
    }

    /**
     * 按「上次整点」与「当前整点」的经过小时数扣减体力/亲密度（仅扣减，不写入 LAST；由调用方 _save(true)）。
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
            this._hp = Math.max(0, Math.min(MAX_VALUE, this._hp - elapsedHours * DECREASE_HP_PER_HOUR));
            this._intimacy = Math.max(0, Math.min(MAX_VALUE, this._intimacy - elapsedHours * DECREASE_INTIMACY_PER_HOUR));
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
        this._hp = Math.max(0, Math.min(MAX_VALUE, this._hp - DECREASE_HP_PER_HOUR));
        this._intimacy = Math.max(0, Math.min(MAX_VALUE, this._intimacy - DECREASE_INTIMACY_PER_HOUR));
        this._save(true);
        this._updateLabels();
    }

    /** @param updateLastTick 仅在做整点扣减（或 onLoad 补扣）后传 true，其它保存不更新上次整点 */
    private _save(updateLastTick = false) {
        try {
            sys.localStorage.setItem(STORAGE_KEY_HP, String(this._hp));
            sys.localStorage.setItem(STORAGE_KEY_INTIMACY, String(this._intimacy));
            sys.localStorage.setItem(STORAGE_KEY_FIRST_RUN_DONE, '1');
            if (updateLastTick) {
                const hourStart = Math.floor(Date.now() / MS_PER_HOUR) * MS_PER_HOUR;
                sys.localStorage.setItem(STORAGE_KEY_LAST, String(hourStart));
            }
            syncWidgetFromStorage();
        } catch (e) { console.warn('[PetValue] 保存失败', e); }
    }

    private _updateLabels() {
        this._ensureLabels();
        this._ensureBars();
        if (this.hpLabel) this.hpLabel.string = String(this._hp);
        if (this.intimacyLabel) this.intimacyLabel.string = String(this._intimacy);
        if (this.hpBar) this.hpBar.progress = this._hp / MAX_VALUE;
        if (this.intimacyBar) this.intimacyBar.progress = this._intimacy / MAX_VALUE;
        // 亲密度 > 80 时显示 highintimate 节点（冒爱心）；优先低值：体力或心情任一低于 20 时不显示
        const highNode = this._ensureHighIntimateNode();
        if (highNode) highNode.active = this.isIntimacyHigh() && !this.isHpLow() && !this.isIntimacyLow();
        // 体力和心情变化后刷新 pet_info_bar 文案（低于 20 时显示「没力气啦」/「心情很差」）
        if (PetInfoBar.instance) PetInfoBar.instance.refreshTip();
        // 体力或心情低于 20 时同步对应提示到 Widget（与 pet_info_bar 一致）
        const hpLow = this.isHpLow();
        const intimacyLow = this.isIntimacyLow();
        if (sys.platform === sys.Platform.ANDROID && sys.isNative) {
            if (hpLow) {
                syncWidgetWeather(getHpZeroTip());
            } else if (intimacyLow) {
                syncWidgetWeather(getIntimacyZeroTip());
            } else if (this._prevHpLow || this._prevIntimacyLow) {
                // 从「体力/心情低」恢复到正常时，清空 Widget 上的对应提示
                clearWidgetWeather();
            }
        }
        this._prevHpLow = hpLow;
        this._prevIntimacyLow = intimacyLow;
    }

    /** 兜底：Inspector 未绑定进度条时，按 pet_value 下两栏（第一栏体力、第二栏亲密）自动查找 ProgressBar */
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

    /** 麦克风可用条件：体力与心情均 ≥ 60 */
    public canUseMicro(): boolean {
        return this._hp >= 60 && this._intimacy >= 60;
    }

    /** 体力是否低于麦克风门槛（< 60），用于麦克风按钮文案 */
    public isHpLowForMicro(): boolean { return this._hp < 60; }
    /** 心情（亲密度）是否低于麦克风门槛（< 60），用于麦克风按钮文案 */
    public isIntimacyLowForMicro(): boolean { return this._intimacy < 60; }

    public isHpZero(): boolean { return this._hp <= 0; }
    /** 体力偏低（没力气）：用于动画切换等，阈值 < 20；提示「没力气啦」仍用 isHpZero。 */
    public isHpLow(): boolean { return this._hp < 20; }
    public isIntimacyZero(): boolean { return this._intimacy <= 0; }
    /** 亲密度偏低（心情差）：用于除麦克风以外的「心情为 0」判断，阈值 < 20。 */
    public isIntimacyLow(): boolean { return this._intimacy < 20; }
    /** 亲密度高（> 80）：用于冒爱心等表现，需与 isHpLow/isIntimacyLow 一起判断以优先低值。 */
    public isIntimacyHigh(): boolean { return this._intimacy > 80; }

    /**
     * 兜底：如果 Inspector 里没有手动绑定 hpLabel/intimacyLabel，
     * 则根据当前节点下的子节点名称自动查找（hp / pet_hp / fs）。
     * 已经在 Inspector 绑定好的情况下不会覆盖。
     */
    /** 飘字飞抵后，原数值标签做缩放弹跳效果（缩放两次，更明显） */
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
            console.log('[PetValue] _ensureLabels intimacyLabel set to', this.intimacyLabel?.node.name ?? 'null');
        }
    }

    /**
     * 飘字动画：起始于宠物节点顶端靠下 100px，0.4 秒后到达宠物节点顶端，停留指定时间后沿轨迹飘向原数值标签。
     * @param target 目标数值标签（hp 或 intimacy）
     * @param delta 增减数值
     * @param petNode 宠物节点（狗/猫），用于确定飘字起始位置；不传则退化为在 target 附近起始
     * @param offsetX 起始位置水平偏移（用于 Button2 同时两个飘字时左右错开，避免叠在一起）
     * @param stayDuration 停留时间（秒），默认 3 秒
     * @param onArrive 飘字飞抵原数值标签后回调（用于延后更新原数值显示）
     */
    public _spawnDeltaLabel(target: Label | null, delta: number, petNode?: Node, offsetX: number = 0, stayDuration: number = 3, onArrive?: () => void) {
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

    /** Button1：体力 +20，亲密 +5；飘字显示本次加多少（+20/+5），飞抵后数值上限 100 */
    public applyBtn1(petNode?: Node) {
        const addHp = 20;
        const addIntimacy = 5;
        this._hp = Math.min(MAX_VALUE, this._hp + addHp);
        this._intimacy = Math.min(MAX_VALUE, this._intimacy + addIntimacy);
        this._save();
        const syncLabels = () => this._updateLabels();
        if (this.hpLabel || this.intimacyLabel) {
            if (this.hpLabel) {
                this._spawnDeltaLabel(this.hpLabel, addHp, petNode, -40);
            }
            if (this.intimacyLabel) {
                this._spawnDeltaLabel(this.intimacyLabel, addIntimacy, petNode, 40, 3, syncLabels);
            } else {
                syncLabels();
            }
        } else {
            this._updateLabels();
        }
    }

    /** Button2：亲密 +20；飘字显示本次加多少（+20），飞抵后数值上限 100 */
    public applyBtn2(petNode?: Node) {
        const addIntimacy = 20;
        this._intimacy = Math.min(MAX_VALUE, this._intimacy + addIntimacy);
        this._save();
        const syncLabels = () => this._updateLabels();
        if (this.intimacyLabel) {
            this._spawnDeltaLabel(this.intimacyLabel, addIntimacy, petNode, 0, 3, syncLabels);
        } else {
            this._updateLabels();
        }
    }

    /** Button3：亲密 +20；飘字显示本次加多少（+20），飞抵后数值上限 100 */
    public applyBtn3(petNode?: Node) {
        const addIntimacy = 20;
        this._intimacy = Math.min(MAX_VALUE, this._intimacy + addIntimacy);
        this._save();
        const syncLabels = () => this._updateLabels();
        if (this.intimacyLabel) {
            this._spawnDeltaLabel(this.intimacyLabel, addIntimacy, petNode, 0, 3, syncLabels);
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

    /** Button0：随机加体力或亲密 +2；飘字显示本次加多少（+2），飞抵后数值上限 100 */
    public applyBtn0(petNode?: Node) {
        PetValue.incrementTodayPetCount();
        const add = 2;
        const isHp = Math.random() < 0.5;
        if (isHp) {
            this._hp = Math.min(MAX_VALUE, this._hp + add);
            this._save();
            const syncLabels = () => this._updateLabels();
            if (this.hpLabel) {
                this._spawnDeltaLabel(this.hpLabel, add, petNode, 0, 0.5, syncLabels);
            } else {
                this._updateLabels();
            }
        } else {
            this._intimacy = Math.min(MAX_VALUE, this._intimacy + add);
            this._save();
            const syncLabels = () => this._updateLabels();
            if (this.intimacyLabel) {
                this._spawnDeltaLabel(this.intimacyLabel, add, petNode, 0, 0.5, syncLabels);
            } else {
                this._updateLabels();
            }
        }
    }

    /** 滑动：亲密 +5；飘字显示本次加多少（+5），飞抵后数值上限 100 */
    public applySwipe(petNode?: Node) {
        PetValue.incrementTodayPetCount();
        const addIntimacy = 5;
        this._intimacy = Math.min(MAX_VALUE, this._intimacy + addIntimacy);
        this._save();
        const syncLabels = () => this._updateLabels();
        if (this.intimacyLabel) {
            this._spawnDeltaLabel(this.intimacyLabel, addIntimacy, petNode, 0, 0.5, syncLabels);
        } else {
            this._updateLabels();
        }
    }

    /** 每分钟 3 次上限时的提示：交给 pet_info_bar 节点上的 PetInfoBar 显示，约 2 秒后恢复原文案 */
    public showPerMinuteLimitHint(text?: string, _petNode?: Node) {
        PetInfoBar.instance?.showPerMinuteLimitHint(text);
    }
}

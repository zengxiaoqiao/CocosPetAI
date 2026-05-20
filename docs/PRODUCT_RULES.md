# PetAI 产品实现规则（中文）

本文档依据当前仓库 **TypeScript / 场景逻辑** 整理，与代码一致处为准；若策划案与实现不一致，以代码为准。

---

## 一、核心数值（体力 / 心情 / 陪伴）

| 项目 | 规则 |
|------|------|
| 范围 | 体力、心情 **0～100**（`MAX_VALUE = 100`） |
| 首次安装 | 体力 **50**、心情 **50** |
| 心情衰减 | **每设备本地整点 -1**；进游戏/回前台补扣 |
| 体力衰减 | **不整点扣**；每轮语音/文字聊天 **-8**（主界面不展示） |
| 主界面展示 | **仅心情**（❤️）；体力低时 **对话框要饭** |
| 心情存储 | `petai_mood`（兼容读 `petai_intimacy`） |
| 陪伴 | `CompanionDays.ts` + `CompanionDaysDisplay` 挂在 `companion` 节点 |
| 道具入口 | 点击 **`ad`** → 显示 `Canvas/btn`（喂食/玩耍/梳毛）；再点或点遮罩收起 |

### 陪伴天数

- **累计**：每个本地自然日首次打开 +1，只增不减；没来过的日子不计。
- **连续**：若昨日也打开则 +1，否则置 **1**。
- **展示**：`陪伴{N}天`；连续 ≥ 2 天时追加 `，连续{M}天`（首日/断签后首日不显示「连续1天」）。
- **存储**：`petai_companion_total_days`、`petai_companion_streak_days`、`petai_companion_last_counted_date`。

### 阈值语义

- **体力 &lt; 20**（`isHpLow`）：累态动画等。
- **心情 &lt; 20**（`isMoodLow`）：蔫脸动画等。
- **心情 &gt; 80**（`isMoodHigh`）：冒爱心（且非低体力/低心情）。
- **麦克风**（`canUseMicro`）：始终可用。

### 互动带来的数值变化

| **语音/文字聊天** | **-8**（无飘字） | **+3**（桃红飘字） | 收到 AI 回复后结算 |
| **点摸** | — | **+2** | 短按宠物，可连续点（无每分钟上限） |
| ~~滑动~~ | — | — | 已移除 |
| **Button1**（喂食） | **+20** | **+5** | 消耗 btn1 |
| **Button2**（玩耍） | — | **+20** | 消耗 btn2 |
| **Button3**（梳毛） | — | **+20** | 消耗 btn3 |

飘字：体力黄、心情桃红。

---

## 二、互动次数与广告补次数（无独立背包道具）

实现中**没有**独立道具背包；**Button1/2/3 可点次数** + **广告场景补次数** + **签到**构成循环。

### 初始与存储

- 首次安装：`btn1 = 2`，`btn2 = 1`，`btn3 = 1`（`SharedBtnCounts`）。
- 持久化：`petai_btn_counts`、`petai_btn_last`、`petai_btn_pending` 等。

### Check-in（签到）

- **首次安装当天**：不弹出 Check-in，仅记录日期，**次日**起按规则产生待领取。
- **之后每天**：最多一条 **待领取**（`pendingClaim`）；打开游戏或点击 `ad` 节点可打开领取界面。
- **连续签到**（昨天领过）：领取时 **btn1 +3、btn2 +1、btn3 +1**（与 `PER_HOUR` 常量一致）。
- **未连续**：预先随机 **0 / 1 / 2**，界面只高亮对应一格；领取时 **仅增加该档次数**（三选一）。
- 当日已领后再点 `ad`：在 info bar 显示 **「今天已经领过了」**（`TipCopy.getCheckinAlreadyClaimedTip`）。

### 次数为 0 时

- **Button1/2/3**：仍可点击 → 进入 **`ad` 场景**（`BtnAdGuard` / `PetControllerBase._gotoAdScene`）。
- **`RechargePanel`**：关闭后根据本地 `recharge_pet`、`recharge_button` 为对应按钮 **+1** 次数并返回 `home`；另有 `ad_reward_{pet}_btn{n}` 统计字段。

---

## 三、宠物表现（动画）

**资源命名**：`dog01`～`dog17`、`cat01`～`cat17`（`PetControllerBase` + `DogController` / `CatController`）。

### 随机动画（`RandomPlayPetAni`）

- **体力 &lt; 20**：循环 **14**。
- **亲密度 &lt; 20**：循环 **13**。
- **夜间时段**：**22:00～次日 7:00**，以及 **12:00（午休）** 固定 **03**；**首次安装当前进程会话**（`IS_FIRST_SESSION`）不按夜间睡觉逻辑。
- **白天**：播 **01**，约 **6.6 秒**后接 **04**（不再使用 **02 / 05**）；**03** 不自动切换。
- 每 **4 秒**检查体力/亲密，低状态变化会 **重新选择**应播动画。

### 主要交互与动画片段（节选）

- **Button0 点击**：依当前姿态后缀接 **06 / 07 / 08** 短序列后回 **01**；超频 → **13 → 01**。
- **Button1**：主段 **09**；若当前为 **14** 先 **07**；若为 **03** 先 **08**。
- **Button2**：主段 **10**；**14** 先 **07**；**03** 先 **08**。
- **Button3**：主段 **11**；规则同上（**14**、**03**）。
- **Controller 上简单横滑**（阈值 `swipeThreshold`）：**12 → 01**。
- **`PetButtons` 复杂滑动**：达到距离与 **反向滑动次数** 等条件时播 **dog12 / cat12** 循环，停手回 **01**；松手时可能触发 **`applySwipe`（+5 亲密）** 并短暂忽略下一次 Button0 以防误触。

### 麦克风与睡眠

- **`BtnMicroRecord`**：长按录音、松开发送；多段 **15** 作听/想/说类反馈（详见脚本注释）。
- **`wakeUpFromSleep` / `wakeToTalking`**：若当前为睡 **03**，可走 **08 → 04** 等醒来序列再接对话相关段。

### 其它

- 互动时可 **暂时隐藏 info bar**（约 2 秒）。
- 播放序列期间可关闭 **`HeartBubbleAni`**，序列结束后恢复。

---

## 四、主界面文案条（`PetInfoBar`）与桌面 Widget

### App 内展示优先级（概要）

1. 新安装首次打开：一句综合介绍（`TipCopy.getFirstOpenTip`）。
2. 用户触发：`showUserHint`（如语音聊天回复、录音提示等）。
3. 操作限制：`showPerMinuteLimitHint`（如「别再点啦」、签到已领）。

### Android Widget

- **回到前台**：清空 Widget 文案（`clearWidgetWeather`）。
- **不再**向 Widget 同步体力/心情/电量/网络/时段问候等主动文案。

### 短提示时长

- 首装单句：展示后约 **3 秒**切换或清空。
- 「别再点啦」、签到已领：约 **3 秒**。
- `showUserHint`（如聊天回复）：默认约 **4 秒**。

### 打招呼条整体

- 进游戏约 **4.5 秒**后可隐藏整条 info bar（首装队列未播完会 **延后**关闭）。

---

## 五、功能模块（场景与职责）

| 模块 | 说明 |
|------|------|
| **`home`** | 宠物、数值条、互动按钮、`PetValue`、`PetInfoBar`、`TogglePet`、签到入口 `ad` 节点、`WidgetChoosePanel` 等 |
| **`settings`** | 设置与语言；`HomeNav` 负责与 home 互跳 |
| **`ad`** | 道具次数为 0 时进入；`RechargePanel` 关闭后回 `home` 并增加对应按钮次数 |
| **`shop`** | 商店：猫咪订阅解锁、专属定制订阅；`TogglePet` 的「+」与未解锁猫进入 |
| **`customize`** | 定制页（需 `petai_customize_unlocked`）；未解锁会跳 `shop` |
| **桌面 Widget（原生）** | `WidgetSync` 与 `PetWidgetProvider`（小号）、动画前台服务等 |
| **语音对话** | `BtnMicroRecord`、`NativeASR`、`AIChatService` 等 |
| **通知设置** | `NotificationSettings` 跳转系统通知使用权；脚本内说明整点报时开关 **已下线无实际效果** |
| **运动提示** | `MotionTipService` 在 TS 侧为 **空实现**；若 Widget 有运动相关展示由原生侧处理 |

---

## 六、实现与策划对齐时注意点

1. **`WidgetSync.syncWidgetFromStorage`** 解析 hp/intimacy 时默认字符串为 `'500'`，与游戏内 **100 上限** 不一致，属容错；**玩法数值以 `PetValue` 为准**。
2. **「今日摸/逗次数」** 仅在 **Button0 点击** 与 **有效滑动加亲密** 时增加；**Button1/2/3 不计入**。
3. **`PetInfoBar.setExtraText`** 已预留；当前仓库内 **无其它脚本写入「今日 N 次」**，若产品需要展示 `getTodayPetCountCopy`，需在合适逻辑里调用 `setExtraText`。

---

## 七、相关源码索引（便于改规则时对照）

| 主题 | 主要文件 |
|------|-----------|
| 体力/亲密/整点扣减 | `assets/scripts/PetValue.ts` |
| 按钮次数与签到 | `assets/scripts/SharedBtnCounts.ts`、`CheckInPanel.ts`、`AdButton.ts` |
| 互动与动画 | `assets/scripts/PetControllerBase.ts`、`DogController.ts`、`CatController.ts`、`PetButtons.ts` |
| 随机动画与时段 | `assets/scripts/RandomPlayPetAni.ts`、`RandomPlayDogAni.ts`、`RandomPlayCatAni.ts` |
| 文案与多语言 | `assets/scripts/PetInfoBar.ts`、`TipCopy.ts`、`Lang.ts` |
| 切宠、商店与解锁 | `TogglePet.ts`（选择条：狗 / 猫? / 定制? / +）、`PetUnlock.ts`、`ShopScene.ts` |
| 切宠与 Widget 数据 | `assets/scripts/WidgetSync.ts` |
| 广告补次数界面 | `assets/scripts/RechargePanel.ts`、`BtnAdGuard.ts` |

文档生成自仓库分析，随代码迭代请同步更新本文档。

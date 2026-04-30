# PetAI 产品实现规则（中文）

本文档依据当前仓库 **TypeScript / 场景逻辑** 整理，与代码一致处为准；若策划案与实现不一致，以代码为准。

---

## 一、核心数值（体力 / 亲密度）

| 项目 | 规则 |
|------|------|
| 范围 | **0～100**（`PetValue` 中 `MAX_VALUE = 100`） |
| 首次安装 | 体力 **50**、亲密度 **50**；写入 `petai_first_run_done` 后才从存档读取 |
| 自然衰减 | **每个设备本地整点**：体力 **-3**、亲密度 **-3**；进游戏或回前台时按「上次记录整点 → 当前整点」**补扣**遗漏小时数 |
| 持久化键 | `petai_hp`、`petai_intimacy`、`petai_last_update`（整点锚点） |

### 阈值语义

- **体力 &lt; 20**（`isHpLow`）：「没力气」表现与提示；info bar / Android Widget 可同步低体力提示文案。
- **亲密度 &lt; 20**（`isIntimacyLow`）：「心情很差」表现与提示。
- **亲密度 &gt; 80**（`isIntimacyHigh`）：高亲密；`highintimate`（冒爱心）仅当 **非**低体力且 **非**低亲密时显示。
- **麦克风可用**（`canUseMicro`）：体力 **≥ 60** 且亲密度 **≥ 60**；低于门槛用于按钮文案区分。

### 互动带来的数值变化

| 操作 | 体力 | 亲密度 | 其它 |
|------|------|--------|------|
| **Button0**（点摸） | 50% **+2** | 50% **+2** | 触发时 **今日撸猫/逗狗次数 +1**（本地日期 `petai_today_pet_date` / `petai_today_pet_count`） |
| **滑动触发**（`PetButtons` 规则下有效滑动） | — | **+5** | 同样 **+1 今日次数** |
| **Button1**（喂食） | **+20** | **+5** | 消耗 `SharedBtnCounts.btn1` 1 次 |
| **Button2**（玩耍） | — | **+20** | 消耗 `btn2` 1 次 |
| **Button3**（梳毛） | — | **+20** | 消耗 `btn3` 1 次 |

飘字：体力偏黄、亲密偏桃红；数值 **上限 100**，有缩放与加数值音效。

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

### 防刷（每分钟上限）

- **Button0 点击**、**Button0 滑动**、**Button1 / Button2 / Button3** 各自维护滑动窗口：**60 秒内 ≥ 3 次** 则进入约 **1 分钟**的惩罚态：播放 **13** 相关序列、**不加数值 / 不扣次数**，并提示 **「别再点啦，休息一下～」**（`getNotAgainTip`）。  
- **点击**与**滑动**的计数 **相互独立**。

---

## 三、宠物表现（动画）

**资源命名**：`dog01`～`dog17`、`cat01`～`cat17`（`PetControllerBase` + `DogController` / `CatController`）。

### 随机动画（`RandomPlayPetAni`）

- **体力 &lt; 20**：循环 **14**。
- **亲密度 &lt; 20**：循环 **13**。
- **夜间时段**：**22:00～次日 7:00**，以及 **12:00（午休）** 固定 **03**；**首次安装当前进程会话**（`IS_FIRST_SESSION`）不按夜间睡觉逻辑。
- **白天**：在 **01 / 02** 间随机；约 **6.6 秒**后接 **04** 或 **05**；**03** 不自动切换。
- 每 **4 秒**检查体力/亲密，低状态变化会 **重新选择**应播动画。

### 主要交互与动画片段（节选）

- **Button0 点击**：依当前姿态后缀接 **06 / 07 / 08** 短序列后回 **01**；超频 → **13 → 01**。
- **Button1**：主段 **09**；若当前为 **02 / 05 / 14** 先 **07**；若为 **03** 先 **08**。
- **Button2**：主段 **10**；**02 / 05 / 14** 先 **07**；**03** 先 **08**。
- **Button3**：主段 **11**；规则同上与 **02/05/14**、**03** 的组合。
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

1. 新安装首次打开：五句指引队列（`TipCopy.getFirstOpenTip` 系列）。
2. **夜间 / 午休**（22～7 点、**12 点整**）：非首装会话下不展示「主动类」提示（与随机动画夜间规则一致）。
3. 低体力 / 低亲密：对应 `getHpZeroTip` / `getIntimacyZeroTip`。
4. 电池：未充电且电量 **&lt; 20%** 时随机低电量文案。
5. **「基础姿态」**（非低体低亲、无电池低电量句、无无网句、非充电）下才展示：时段问候、天气、`setExtraText` 扩展句。
6. **时段问候**：`getTimeRules()`；每个时段 **每天最多一条**（本地 `petai_greet_*`）；**12:00～13:00** 不显示午间问候句。
7. **天气**：Open-Meteo；仅部分天气码适合作「打招呼话题」；Widget 侧有 **1 小时**展示节流；回到前台可 **强制补一句天气**（一次）。

### Android Widget

- **回到前台**：清空 Widget 文案（`clearWidgetWeather`）。
- **退到后台**：将当前应展示句同步到原生（`syncWidgetWeather`），具体集合与 `_getWidgetText` 实现一致。

### 短提示时长

- 首装单句 / 时段问候：展示后约 **3 秒**切换或清空。
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
| **`ad`** | 次数用尽时进入；`RechargePanel` 关闭后回 `home` 并增加对应按钮次数 |
| **桌面 Widget（原生）** | `WidgetSync` 与 `PetWidgetProvider` / `PetWidgetLargeProvider`、动画前台服务等 |
| **天气** | `WeatherService`；Android 可用粗略定位 |
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
| 切宠与 Widget 数据 | `assets/scripts/TogglePet.ts`、`WidgetSync.ts` |
| 广告补次数界面 | `assets/scripts/RechargePanel.ts`、`BtnAdGuard.ts` |

文档生成自仓库分析，随代码迭代请同步更新本文档。

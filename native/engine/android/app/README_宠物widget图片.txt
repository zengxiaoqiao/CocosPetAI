========================================
  Widget 宠物图片替换说明（动画多帧）
========================================

【图片所在目录】
  res/drawable/  （即 native/engine/android/app/res/drawable/）

【添加 Widget 时的示意图（预览图）】
  在系统「添加 Widget」列表里显示的缩略图由 appwidget-provider 的 previewImage 指定：
  - 小号：res/xml/widget_pet_info.xml 里 android:previewImage="@drawable/widget_preview"
    → 请将你的示意图放到 res/drawable/widget_preview.png（建议尺寸约 200×100 dp 或同比例）
  - 大号：res/xml/widget_pet_large_info.xml 里 android:previewImage="@drawable/widget_preview_large"
    → 请将你的示意图放到 res/drawable/widget_preview_large.png（建议尺寸约 800×100 dp 或同比例）
  若未放置对应 PNG，编译会报错；可先复制现有宠物图重命名，或做一张简单占位图。

【小号 Widget 命名规则】
  基础名：widget_{宠物}_{姿态}
  - 宠物：dog 或 cat
  - 姿态：
      01（白天默认）
      02（充电时的基础姿态：不带充电线/闪电，仅作为充电状态的底层动作）
      03（夜间 22 点～7 点）
      13（亲密度为 0）
      14（体力为 0）

  1) 静态图（一张图一个姿态）
     文件名：widget_dog_01.png, widget_dog_03.png, widget_dog_13.png, widget_dog_14.png
            widget_cat_01.png, widget_cat_03.png, widget_cat_13.png, widget_cat_14.png
     放入 res/drawable/ 后，若同名的 .xml 占位存在，请删除或覆盖为你的 .png。

  2) 动画多帧（同一姿态多张图循环播放）
     文件名：
       widget_dog_01_0.png, widget_dog_01_1.png, widget_dog_01_2.png ...
       widget_dog_02_0.png, widget_dog_02_1.png, ...
       widget_dog_03_0.png, ...
       widget_dog_13_0.png, ...
       widget_dog_14_0.png, ...
     从 _0 开始连续编号；Widget 会按 0,1,2,... 循环显示。
     若存在 _0、_1… 则优先用多帧；否则用单张 widget_dog_01 / widget_dog_02 等。cat 同理。

【大号 Widget 命名规则】（与上面同一目录，前缀不同）
  基础名：widget_large_{宠物}_{姿态}
  - 大号 Widget 使用独立图集（大动图），姿态 01/02/03/13/14 同上。

  1) 静态图
     文件名：widget_large_dog_01.png, widget_large_dog_03.png, widget_large_dog_13.png, widget_large_dog_14.png
            widget_large_cat_01.png, widget_large_cat_03.png, widget_large_cat_13.png, widget_large_cat_14.png

  2) 动画多帧
     文件名：
       widget_large_dog_01_0.png, widget_large_dog_01_1.png, ...
       widget_large_dog_02_0.png, widget_large_dog_02_1.png, ...
       widget_large_dog_03_0.png, ...
       widget_large_dog_13_0.png, ...
       widget_large_dog_14_0.png, ...
     若存在 _0、_1… 则优先用多帧；否则用单张 widget_large_dog_01 / widget_large_dog_02 等。
     未提供大号图时，会回退到应用 logo。

【资源来源】
  可从项目 assets/textures/ 下的 4-dog01.png、4-cat01.png 等
  按 plist 裁出单帧，导出为 PNG 后按上面命名放入 res/drawable/。

【充电相关】
  - 底层宠物动画：充电时与普通状态共用「02」姿态（widget_{pet}_02_* / widget_large_{pet}_02_*），
    建议把原来的 charging 动画里的充电线/闪电等元素去掉，仅保留宠物动作。
  - 充电 overlay（叠加在宠物之上，用于显示充电线/闪电等）：
    文件名：charge_0.png, charge_1.png, charge_2.png ...
    从 _0 开始连续编号，按 200ms 一帧循环。若未提供 charge_* 图，则充电时只显示宠物的 02 姿态，不额外叠加元素。

【若仍显示 logo】
  1) 放图后必须重新用 Cocos 打 Android 包并安装，再重新添加一次桌面 Widget。
  2) 若当前姿态（01/03/13/14）没有对应图片，会先尝试同宠物的其他姿态图再才用 logo；
      建议至少为狗/猫各放一组图（如 01 的多帧或 01 单张）。
  3) 若只做了多帧（如 widget_dog_01_0.png～_19.png），请删除同名的 .xml 占位
     （如 widget_dog_01.xml），避免与占位图冲突。
  4) 确认打包用的 native 目录就是本工程：构建完成后看 build/.../proj/app/res/drawable/
     里是否包含你放的 PNG；若没有，说明构建未用本 native，需把 res/drawable 拷到
     构建输出里的 app/res/drawable 再重新打包。

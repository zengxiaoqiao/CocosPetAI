package com.cocos.game;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.SystemClock;
import android.util.TypedValue;
import android.widget.RemoteViews;

import java.util.Calendar;

/**
 * 大号宠物 Widget：占用更宽的空间。
 * 仅默认动画（01）时使用 widget_large_ 图并做「走路」位移；充电动画、夜间(03)/午休(03)、体力为0(14) 时与小号一致，使用 widget_ 图且无位移。
 */
public class PetWidgetLargeProvider extends AppWidgetProvider {

    /** 大号 Widget 专用图前缀，与小号 widget_ 区分 */
    private static final String DRAWABLE_PREFIX = "widget_large_";
    private static final String LAYOUT_WIDGET_PET = "widget_pet_large";
    private static final String ID_WIDGET_PET_CONTAINER = "widget_pet_container";
    private static final String ID_WIDGET_PET_IMAGE = "widget_pet_image";
    private static final String ID_WIDGET_HP = "widget_hp";
    private static final String ID_WIDGET_INTIMACY = "widget_intimacy";
    private static final String ID_WIDGET_SEP = "widget_sep";
    private static final String ID_WIDGET_OVERLAY_CHARGE = "widget_overlay_charge";
    private static final String ID_WIDGET_OVERLAY_NETWORK = "widget_overlay_network";

    /** 动画刷新间隔（毫秒） */
    private static final long ANIM_INTERVAL_MS = 200;
    private static final long STATE_REFRESH_INTERVAL_MS = 10_000L;

    public static final String ACTION_ANIM_TICK = "com.cocos.game.petwidget.ANIM_TICK_LARGE";
    public static final String ACTION_STATE_REFRESH = "com.cocos.game.petwidget.STATE_REFRESH_LARGE";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        updateAll(context, appWidgetManager, appWidgetIds);
        startAnimService(context);
        scheduleNextAnim(context, appWidgetManager, appWidgetIds);
        scheduleNextStateRefresh(context);
    }

    @Override
    public void onDisabled(Context context) {
        context.getApplicationContext().stopService(new Intent(context, PetWidgetAnimService.class));
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent != null ? intent.getAction() : null;
        AppWidgetManager wm = AppWidgetManager.getInstance(context);
        int[] ids = wm.getAppWidgetIds(new android.content.ComponentName(context, PetWidgetLargeProvider.class));
        if (ids != null && ids.length > 0) {
            if (ACTION_ANIM_TICK.equals(action) || ConnectivityManager.CONNECTIVITY_ACTION.equals(action)) {
                updateAll(context, wm, ids);
                startAnimService(context);
                scheduleNextAnim(context, wm, ids);
            } else if (ACTION_STATE_REFRESH.equals(action)) {
                updateAll(context, wm, ids);
                startAnimService(context);
                scheduleNextAnim(context, wm, ids);
                scheduleNextStateRefresh(context);
            }
        }
        if (!ACTION_ANIM_TICK.equals(action) && !ConnectivityManager.CONNECTIVITY_ACTION.equals(action) && !ACTION_STATE_REFRESH.equals(action)) {
            super.onReceive(context, intent);
        }
    }

    private static void startAnimService(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.getApplicationContext().startForegroundService(new Intent(context, PetWidgetAnimService.class));
        } else {
            context.getApplicationContext().startService(new Intent(context, PetWidgetAnimService.class));
        }
    }

    /** 安排下一次动画刷新。优先精确闹钟，无权限时用 {@link AlarmManager#set} 回退，避免崩溃。 */
    private static void scheduleNextAnim(Context context, AppWidgetManager wm, int[] appWidgetIds) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null || appWidgetIds == null || appWidgetIds.length == 0) return;
        Intent tick = new Intent(context, PetWidgetLargeProvider.class);
        tick.setAction(ACTION_ANIM_TICK);
        tick.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent pi = PendingIntent.getBroadcast(context, 0, tick, flags);
        long triggerAt = SystemClock.elapsedRealtime() + ANIM_INTERVAL_MS;
        long wallMs = System.currentTimeMillis() + ANIM_INTERVAL_MS;
        Intent showIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        PendingIntent showPi = showIntent != null
                ? PendingIntent.getActivity(context, 1, showIntent, flags)
                : null;
        PetWidgetAlarmScheduler.scheduleAnimTick(am, triggerAt, wallMs, pi, showPi);
    }

    /** 约 10 秒后触发一次状态刷新，断网时若 CONNECTIVITY 未下发也能在 10 秒内切到无网动画 */
    private static void scheduleNextStateRefresh(Context context) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        Intent refresh = new Intent(context, PetWidgetLargeProvider.class);
        refresh.setAction(ACTION_STATE_REFRESH);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent pi = PendingIntent.getBroadcast(context, 2, refresh, flags);
        long triggerAt = SystemClock.elapsedRealtime() + STATE_REFRESH_INTERVAL_MS;
        PetWidgetAlarmScheduler.scheduleStateRefresh(am, triggerAt, pi);
    }

    /** 供 PetWidgetSync 与 onUpdate 调用：刷新所有大号 Pet Widget 实例 */
    public static void updateAll(Context context, AppWidgetManager wm, int[] appWidgetIds) {
        if (context == null || wm == null || appWidgetIds == null || appWidgetIds.length == 0) return;
        Context app = context.getApplicationContext();
        String pet = PetWidgetSync.getPet(app);
        int hp = PetWidgetSync.getHp(app);
        int intimacy = PetWidgetSync.getIntimacy(app);
        String weatherText = PetWidgetSync.getWeatherText(app);

        for (int id : appWidgetIds) {
            RemoteViews views = buildViews(app, id, pet, hp, intimacy, weatherText);
            if (views != null) {
                setClickToLaunchApp(app, views);
                wm.updateAppWidget(id, views);
            }
        }
    }

    private static RemoteViews buildViews(Context context, int appWidgetId, String pet, int hp, int intimacy, String weatherText) {
        int layoutId = getResId(context, LAYOUT_WIDGET_PET, "layout");
        if (layoutId == 0) return null;
        RemoteViews views = new RemoteViews(context.getPackageName(), layoutId);

        int idHp = getResId(context, ID_WIDGET_HP, "id");
        int idIntimacy = getResId(context, ID_WIDGET_INTIMACY, "id");
        int idSep = getResId(context, ID_WIDGET_SEP, "id");
        int idContainer = getResId(context, ID_WIDGET_PET_CONTAINER, "id");
        int idImage = getResId(context, ID_WIDGET_PET_IMAGE, "id");
        int idOverlayCharge = getResId(context, ID_WIDGET_OVERLAY_CHARGE, "id");
        int idOverlayNetwork = getResId(context, ID_WIDGET_OVERLAY_NETWORK, "id");

        // 先从系统实时拉取充电状态并写回 prefs，避免插电后 getCharging 仍为 false 导致充电动画不切
        PetWidgetSync.refreshChargingState(context);

        // 是否为「彻底无网络」：默认认为有网，仅在系统网络类型明确为 none 时才认为无网，避免误判。
        boolean isNoNetwork = isSystemNoNetwork(context);
        PetWidgetSync.recordNoNetworkAt(context, isNoNetwork);

        // 大号 Widget 同样只显示一句提示文案；若已过期则不再显示
        String tip = (weatherText != null && !weatherText.isEmpty()) ? weatherText : "";
        // 无网络提示文案（\"没网啦，检查网络～\" / \"断网了，连上再玩～\"）不在 widget 上显示文字，只用覆盖层动画表现
        if (isNoNetworkTip(tip)) {
            tip = "";
        }
        long expireAt = PetWidgetSync.getWidgetTipExpireAt(context);
        if (expireAt > 0L && System.currentTimeMillis() >= expireAt) {
            tip = "";
        }
        // 已在充电时不显示任何文字（含低电量提示），只显示宠物 + overlay
        boolean isCharging = PetWidgetSync.getCharging(context);
        if (isCharging) {
            tip = "";
        }
        // 彻底无网络时同样不显示文字提示，只用 overlay
        if (isNoNetwork) {
            tip = "";
        }
        // 夜间 22:00～7:00：不显示任何文字提示（无论来源），仅展示 03/02 动画和覆盖层
        Calendar cal = Calendar.getInstance();
        int hour = cal.get(Calendar.HOUR_OF_DAY);
        boolean isNight = (hour >= 22 || hour < 7);
        if (isNight) {
            tip = "";
        }
        // 提前算 clip / isDefaultAnim，供文案区对齐与宠物区域布局使用
        String clip = chooseClip(context, pet, hp, intimacy);
        if (isNoNetwork || isCharging) {
            clip = "02";
        }
        boolean isDefaultAnim = "01".equals(clip);

        if (idHp != 0) {
            if (tip == null || tip.isEmpty()) {
                views.setViewVisibility(idHp, android.view.View.GONE);
            } else {
                views.setViewVisibility(idHp, android.view.View.VISIBLE);
                views.setTextViewText(idHp, tip);
                // 大号 widget：不覆盖宽度和边距，沿用 XML 的 wrap_content + 根布局 center_horizontal，
                // 使文字框随文案长短伸缩并始终在屏幕水平居中
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    views.setViewLayoutMargin(idHp, RemoteViews.MARGIN_LEFT, 0f, TypedValue.COMPLEX_UNIT_PX);
                }
            }
        }
        if (idSep != 0) views.setViewVisibility(idSep, android.view.View.GONE);
        if (idIntimacy != 0) views.setViewVisibility(idIntimacy, android.view.View.GONE);

        // 仅默认动画（01）时大号用 widget_large_ 图并做「走路」位移；其余用 widget_ 图且宠物固定在中间
        String drawablePrefix = isDefaultAnim ? DRAWABLE_PREFIX : "widget_";
        int resId = pickFrameDrawable(context, pet, clip, drawablePrefix);
        if (resId == 0) {
            resId = pickAnyPetDrawable(context, pet, drawablePrefix);
        }
        if (resId == 0) {
            resId = getResId(context, "ic_launcher", "mipmap");
        }
        if (resId != 0 && idImage != 0) {
            views.setImageViewResource(idImage, resId);
        }
        // 仅默认动画时做「环绕走」；非 01 姿态（包括 02/03/13/14、充电/无网）时，宠物固定在屏幕中间。
        // 覆盖层图标整体稍微缩小（约 0.75x），并与宠物头顶中心对齐。
        float overlayScale = 0.75f;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            float density = context.getResources().getDisplayMetrics().density;
            int idMove = (idContainer != 0) ? idContainer : idImage;
            if (idMove != 0 && idImage != 0) {
                int containerWidthPx = (int) (120 * density * (isDefaultAnim ? 1f : 1.35f));

                // Use actual widget width (from launcher) instead of screen width.
                int widgetWidthPx = context.getResources().getDisplayMetrics().widthPixels;
                try {
                    android.appwidget.AppWidgetManager wm = android.appwidget.AppWidgetManager.getInstance(context);
                    android.os.Bundle opts = (wm != null) ? wm.getAppWidgetOptions(appWidgetId) : null;
                    if (opts != null) {
                        int wDp = opts.getInt(android.appwidget.AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH, 0);
                        if (wDp <= 0) wDp = opts.getInt(android.appwidget.AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0);
                        if (wDp > 0) widgetWidthPx = (int) (wDp * density);
                    }
                } catch (Throwable ignored) { /* ignore */ }

                // Safety: some launchers add internal padding and overlay drawables may exceed 120dp.
                // Shrink the usable range a bit to avoid clipping at the right edge.
                // Be more conservative to avoid right-edge clipping on launchers with extra insets.
                // Right-edge clipping is handled by XML paddingRight on the pet area,
                // but we must also subtract that padding from the movement range.
                int rightPadPx = (int) (36 * density); // keep in sync with widget_pet_large.xml
                // Assume container roughly equals 120dp image * 1.18 scale plus overlays.
                int assumedContainerPx = Math.max(containerWidthPx, (int) (165 * density));
                // Some launchers report a wider-than-real option size; clamp with screen width then keep a safety trim.
                int screenWidthPx = context.getResources().getDisplayMetrics().widthPixels;
                widgetWidthPx = Math.min(widgetWidthPx, screenWidthPx);
                int extraTrimPx = (int) (16 * density);
                int maxLeft = Math.max(0, widgetWidthPx - rightPadPx - assumedContainerPx - extraTrimPx);
                int centerLeft = maxLeft / 2;
                if (isDefaultAnim) {
                    // 默认姿态：在 widget 可用宽度内尽量走满（贴边），而不是只在屏幕中间小范围摆动
                    int stepPx = Math.max(1, (int) (8 * density)); // faster & more visible on desktop
                    int stepsOneWay = Math.max(1, maxLeft / stepPx);
                    // Pause only on RIGHT edge (~3s): during pause play small-widget clip 01 frames 0..N (e.g. _0–_13).
                    int dwellSteps = 15;
                    long tick = SystemClock.elapsedRealtime() / ANIM_INTERVAL_MS;
                    int cycleLen = (2 * stepsOneWay) + dwellSteps;
                    int s = (int) (tick % (long) Math.max(1, cycleLen));
                    int pos;
                    boolean facingRight;
                    boolean isDwell;
                    if (s < stepsOneWay) {
                        // moving right
                        int k = s;
                        pos = k * stepPx;
                        facingRight = true;
                        isDwell = false;
                    } else if (s < stepsOneWay + dwellSteps) {
                        // RIGHT edge dwell (only)
                        pos = maxLeft;
                        facingRight = false;
                        isDwell = true;
                    } else {
                        // moving left
                        int k = s - (stepsOneWay + dwellSteps);
                        pos = Math.max(0, maxLeft - (k * stepPx));
                        facingRight = false;
                        isDwell = false;
                    }
                    // Make large widget feel larger even in default anim.
                    float scale = 1.18f;
                    // Walking can flip for direction; dwell must NOT flip (avoid lighting/shadow mirroring).
                    if (isDwell) {
                        views.setFloat(idImage, "setScaleX", scale);
                    } else {
                        // Fix direction: widget drawables face LEFT by default; flip sign so movement matches facing.
                        views.setFloat(idImage, "setScaleX", facingRight ? -scale : scale);
                    }
                    views.setFloat(idImage, "setScaleY", scale);
                    views.setViewLayoutMargin(idMove, RemoteViews.MARGIN_LEFT, (float) Math.max(0, Math.min(maxLeft, pos)), TypedValue.COMPLEX_UNIT_PX);

                    // Dwell: play full small-widget sequence widget_<pet>_01_0 … _N (same as app idle loop).
                    if (isDwell) {
                        int n01 = countWidgetSmallClipFrames(context, pet, "01");
                        int localDwell = s - stepsOneWay;
                        int dwellRes = 0;
                        if (n01 > 0) {
                            dwellRes = getResId(context, "widget_" + pet + "_01_" + (localDwell % n01), "drawable");
                        }
                        if (dwellRes != 0) {
                            views.setImageViewResource(idImage, dwellRes);
                        }
                    } else {
                        // Moving: keep animated walk frames from pickFrameDrawable above.
                        if (resId != 0) {
                            views.setImageViewResource(idImage, resId);
                        }
                    }
                } else {
                    // 非基础姿态：固定在屏幕中间，稍微放大宠物本体
                    views.setFloat(idImage, "setScaleX", 1.35f);
                    views.setFloat(idImage, "setScaleY", 1.35f);
                    views.setViewLayoutMargin(idMove, RemoteViews.MARGIN_LEFT, (float) centerLeft, TypedValue.COMPLEX_UNIT_PX);
                }
            }
        }


        // 充电/无网络 overlay：按发生时间二选一，后来的覆盖之前的（不设固定优先级）
        PetWidgetSync.ensureChargingAtIfCharging(context);
        long chargingAt = PetWidgetSync.getChargingAt(context);
        long noNetworkAt = PetWidgetSync.getNoNetworkAt(context);
        boolean showCharge = isCharging && (!isNoNetwork || chargingAt >= noNetworkAt);
        boolean showNetwork = isNoNetwork && (!isCharging || noNetworkAt > chargingAt);

        if (idOverlayCharge != 0) {
            if (showCharge) {
                int chargeRes = pickChargingOverlayDrawable(context, pet);
                if (chargeRes != 0) {
                    views.setViewVisibility(idOverlayCharge, android.view.View.VISIBLE);
                    views.setImageViewResource(idOverlayCharge, chargeRes);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        float density = context.getResources().getDisplayMetrics().density;
                        views.setFloat(idOverlayCharge, "setScaleX", overlayScale);
                        views.setFloat(idOverlayCharge, "setScaleY", overlayScale);
                        // 覆盖层向左平移，使图标落在宠物头顶中央（避免 drawable 留白或布局导致偏右）
                        views.setFloat(idOverlayCharge, "setTranslationX", -58f * density);
                    }
                } else {
                    views.setViewVisibility(idOverlayCharge, android.view.View.GONE);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        views.setFloat(idOverlayCharge, "setScaleX", 1f);
                        views.setFloat(idOverlayCharge, "setScaleY", 1f);
                        views.setFloat(idOverlayCharge, "setTranslationX", 0f);
                    }
                }
            } else {
                views.setViewVisibility(idOverlayCharge, android.view.View.GONE);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    views.setFloat(idOverlayCharge, "setScaleX", 1f);
                    views.setFloat(idOverlayCharge, "setScaleY", 1f);
                    views.setFloat(idOverlayCharge, "setTranslationX", 0f);
                }
            }
        }

        if (idOverlayNetwork != 0) {
            if (showNetwork) {
                int netRes = pickNetworkOverlayDrawable(context);
                if (netRes != 0) {
                    views.setViewVisibility(idOverlayNetwork, android.view.View.VISIBLE);
                    views.setImageViewResource(idOverlayNetwork, netRes);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        float density = context.getResources().getDisplayMetrics().density;
                        views.setFloat(idOverlayNetwork, "setScaleX", overlayScale);
                        views.setFloat(idOverlayNetwork, "setScaleY", overlayScale);
                        views.setFloat(idOverlayNetwork, "setTranslationX", -58f * density);
                    }
                } else {
                    views.setViewVisibility(idOverlayNetwork, android.view.View.GONE);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        views.setFloat(idOverlayNetwork, "setScaleX", 1f);
                        views.setFloat(idOverlayNetwork, "setScaleY", 1f);
                        views.setFloat(idOverlayNetwork, "setTranslationX", 0f);
                    }
                }
            } else {
                views.setViewVisibility(idOverlayNetwork, android.view.View.GONE);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    views.setFloat(idOverlayNetwork, "setScaleX", 1f);
                    views.setFloat(idOverlayNetwork, "setScaleY", 1f);
                    views.setFloat(idOverlayNetwork, "setTranslationX", 0f);
                }
            }
        }

        return views;
    }

    /** Count frames for widget_<pet>_<clip>_0/_1/... in drawable (small-widget naming). */
    private static int countWidgetSmallClipFrames(Context context, String pet, String clip) {
        if (context == null || pet == null || clip == null) return 0;
        int n = 0;
        String base = "widget_" + pet + "_" + clip + "_";
        while (getResId(context, base + n, "drawable") != 0) {
            n++;
        }
        return n;
    }

    private static int pickFrameDrawable(Context context, String pet, String clip, String drawablePrefix) {
        String base = drawablePrefix + pet + "_" + clip;
        int frameCount = 0;
        while (getResId(context, base + "_" + frameCount, "drawable") != 0) {
            frameCount++;
        }
        if (frameCount > 0) {
            int frameIndex = (int) ((SystemClock.elapsedRealtime() / ANIM_INTERVAL_MS) % frameCount);
            return getResId(context, base + "_" + frameIndex, "drawable");
        }
        int single = getResId(context, base, "drawable");
        if (single != 0 && isDrawableRealImage(context, single)) {
            return single;
        }
        return 0;
    }

    /** 尝试 01/03/13/14 姿态图，用于缺图时回退；drawablePrefix 为 widget_large_ 或 widget_ */
    private static int pickAnyPetDrawable(Context context, String pet, String drawablePrefix) {
        String[] clips = {"01", "03", "13", "14"};
        for (String clip : clips) {
            int id = pickFrameDrawable(context, pet, clip, drawablePrefix);
            if (id != 0) return id;
        }
        return 0;
    }

    /** 充电 overlay：优先使用旧版资源名 widget_charging_0/1/2... 或单张 widget_charging；若都不存在，再尝试通用 charge_0/1/2...。 */
    private static int pickChargingOverlayDrawable(Context context, String pet) {
        if (context == null) return 0;
        // 1) 兼容老资源：widget_charging_0/1/2...
        int frameCount = 0;
        while (getResId(context, "widget_charging_" + frameCount, "drawable") != 0) {
            frameCount++;
        }
        if (frameCount > 0) {
            long tick = SystemClock.elapsedRealtime() / ANIM_INTERVAL_MS;
            int index = (int) (tick % frameCount);
            return getResId(context, "widget_charging_" + index, "drawable");
        }
        // 2) 单张旧资源：widget_charging
        int single = getResId(context, "widget_charging", "drawable");
        if (single != 0 && isDrawableRealImage(context, single)) {
            return single;
        }
        // 3) 新通用命名：charge_0/1/2...
        frameCount = 0;
        while (getResId(context, "charge_" + frameCount, "drawable") != 0) {
            frameCount++;
        }
        if (frameCount <= 0) return 0;
        long tick = SystemClock.elapsedRealtime() / ANIM_INTERVAL_MS;
        int index = (int) (tick % frameCount);
        return getResId(context, "charge_" + index, "drawable");
    }

    /** 流量/网络 overlay：使用 unwifi_0/1/2... 多帧；若无则返回 0。 */
    private static int pickNetworkOverlayDrawable(Context context) {
        if (context == null) return 0;
        int count = 0;
        while (getResId(context, "unwifi_" + count, "drawable") != 0) {
            count++;
        }
        if (count <= 0) return 0;
        long tick = SystemClock.elapsedRealtime() / ANIM_INTERVAL_MS;
        int index = (int) (tick % count);
        return getResId(context, "unwifi_" + index, "drawable");
    }

    /** 判断是否为「彻底无网络」：
     *  1）若 PetWidgetNetworkReceiver 明确判定为 \"none\"，直接认为无网；
     *  2）否则再用旧版 ConnectivityManager.getActiveNetworkInfo() 兜底：info 为 null 或未连接也认为无网；
     *  3）两边都拿不到结论时，默认认为有网（宁可漏报也不误报）。 */
    private static boolean isSystemNoNetwork(Context context) {
        if (context == null) return false;
        try {
            String type = PetWidgetNetworkReceiver.getNetworkType(context);
            if ("none".equals(type)) {
                // 明确无任何可用网络
                return true;
            }
            if ("wifi".equals(type) || "4g".equals(type) || "5g".equals(type) || "3g".equals(type)) {
                // 明确有网络类型
                return false;
            }
            // type 为空或未知类型：再用旧 API 兜底一次，两个信号都认为无网时才认定为无网
            ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm == null) return false;
            NetworkInfo info = cm.getActiveNetworkInfo();
            return info == null || !info.isConnected();
        } catch (Exception ignored) {
            return false;
        }
    }

    /** 判断给定提示文案是否为「彻底无网络」提示（与 TipCopy.NETWORK_TIPS_NONE 文案保持一致） */
    private static boolean isNoNetworkTip(String tip) {
        if (tip == null || tip.isEmpty()) return false;
        if (tip.equals("没网啦，检查网络～")) return true;
        if (tip.equals("断网了，连上再玩～")) return true;
        return false;
    }

    private static boolean isDrawableRealImage(Context context, int resId) {
        try {
            int logoId = getResId(context, "ic_launcher", "mipmap");
            if (logoId == 0) return true;
            android.content.res.Resources res = context.getResources();
            android.graphics.drawable.Drawable d = Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP
                    ? res.getDrawable(resId, null) : res.getDrawable(resId);
            android.graphics.drawable.Drawable logo = Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP
                    ? res.getDrawable(logoId, null) : res.getDrawable(logoId);
            if (d == null || logo == null) return d != null;
            return d.getIntrinsicWidth() != logo.getIntrinsicWidth()
                    || d.getIntrinsicHeight() != logo.getIntrinsicHeight();
        } catch (Exception e) {
            return true;
        }
    }

    private static int getResId(Context context, String name, String defType) {
        return context.getResources().getIdentifier(name, defType, context.getPackageName());
    }

    /** 充电时使用 02 姿态（多帧），由 overlay 表示充电元素；非充电时体力为 0 用 14，亲密度为 0 用 13，夜间 22～7 或午间 12:00～13:00 用 03，其余用 01。
     *  手机低电量仅通过文字提示表现，不再切换到 14 动画。 */
    private static String chooseClip(Context context, String pet, int hp, int intimacy) {
        if (PetWidgetSync.getCharging(context)) return "02";
        if (hp < 20) return "14";
        if (intimacy < 20) return "13";
        Calendar cal = Calendar.getInstance();
        int hour = cal.get(Calendar.HOUR_OF_DAY);
        if (hour >= 22 || hour < 7) return "03";
        if (hour == 12) return "03";
        return "01";
    }

    private static void setClickToLaunchApp(Context context, RemoteViews views) {
        int idImage = getResId(context, ID_WIDGET_PET_IMAGE, "id");
        if (idImage == 0) return;
        Intent launch = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (launch != null) {
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            launch.putExtra(PetWidgetSync.EXTRA_FROM_WIDGET, true);
            PendingIntent pi = PendingIntent.getActivity(context, 0, launch,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(idImage, pi);
        }
    }
}


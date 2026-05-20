package com.cocos.game;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.BatteryManager;

/**
 * 与桌面 Widget 共享宠物数据：宠物类型、体力、亲密度。
 * 由游戏通过 JSB 调用 sync，Widget 读取后按状态显示不同姿态（01/03/13/14）。
 */
public class PetWidgetSync {

    private static final String PREFS_NAME = "petai_widget";
    private static final String KEY_PET = "pet";
    private static final String KEY_HP = "hp";
    private static final String KEY_INTIMACY = "intimacy";
    private static final String KEY_WEATHER_TEXT = "weather_text";
    /** 当前 Widget 文案的过期时间戳（毫秒），0 表示不过期。 */
    private static final String KEY_WIDGET_TIP_EXPIRE_AT = "tip_expire_at";
    /** 是否正在充电，供 Widget 显示充电示意图 overlay */
    private static final String KEY_CHARGING = "charging";
    /** 充电状态变为 true 的时间戳（毫秒），用于与无网络 overlay 按发生时间二选一 */
    private static final String KEY_CHARGING_AT = "charging_at";
    /** 最近一次「无网络」状态被记录的时间戳（毫秒），0 表示当前有网 */
    private static final String KEY_NO_NETWORK_AT = "no_network_at";

    /** 点击 Widget 打开 App 时在 Intent 中携带的 extra，App 收到后清除 Widget 文字提示 */
    public static final String EXTRA_FROM_WIDGET = "from_widget";

    /** 由 AppActivity 设置，供游戏 JSB 调用 sync 时使用 */
    public static void setContext(Context context) {
        if (context != null) {
            sContext = context.getApplicationContext();
        }
    }

    private static Context sContext;

    /**
     * 游戏通过 JSB 调用：仅传 pet/hp/intimacy，使用 sContext。签名 (Ljava/lang/String;II)V。
     */
    public static void sync(String pet, int hp, int intimacy) {
        sync(sContext, pet, hp, intimacy);
    }

    /**
     * 将当前宠物状态写入 SharedPreferences，并刷新所有 Pet Widget。
     */
    public static void sync(Context context, String pet, int hp, int intimacy) {
        Context ctx = context != null ? context.getApplicationContext() : sContext;
        if (ctx == null) return;
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .putString(KEY_PET, pet != null ? pet : "dog")
                .putInt(KEY_HP, hp)
                .putInt(KEY_INTIMACY, intimacy)
                .apply();
        AppWidgetManager wm = AppWidgetManager.getInstance(ctx);
        int[] idsSmall = wm.getAppWidgetIds(new ComponentName(ctx, PetWidgetProvider.class));
        if (idsSmall != null && idsSmall.length > 0) {
            PetWidgetProvider.updateAll(ctx, wm, idsSmall);
        }
    }

    /**
     * 仅同步天气文案，供游戏在获取到天气后单独更新 Widget 文案区域。
     * 签名 (Ljava/lang/String;)V。
     */
    public static void syncWeather(String weatherText) {
        syncWeather(sContext, weatherText);
    }

    public static void syncWeather(Context context, String weatherText) {
        syncWeatherWithExpire(context, weatherText, 0L);
    }

    /**
     * 同步 Widget 文案，并可选设置一个过期时间戳（毫秒）。expireAtMs <= 0 表示不过期。
     */
    public static void syncWeatherWithExpire(Context context, String weatherText, long expireAtMs) {
        Context ctx = context != null ? context.getApplicationContext() : sContext;
        if (ctx == null) return;
        String text = weatherText != null ? weatherText : "";
        if (text.isEmpty()) return;
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit().putString(KEY_WEATHER_TEXT, text);
        if (expireAtMs > 0L) {
            editor.putLong(KEY_WIDGET_TIP_EXPIRE_AT, expireAtMs);
        } else {
            editor.remove(KEY_WIDGET_TIP_EXPIRE_AT);
        }
        editor.apply();
        AppWidgetManager wm = AppWidgetManager.getInstance(ctx);
        int[] idsSmall = wm.getAppWidgetIds(new ComponentName(ctx, PetWidgetProvider.class));
        if (idsSmall != null && idsSmall.length > 0) {
            PetWidgetProvider.updateAll(ctx, wm, idsSmall);
        }
    }

    public static String getPet(Context context) {
        if (context == null) return "dog";
        return context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getString(KEY_PET, "dog");
    }

    public static int getHp(Context context) {
        if (context == null) return 500;
        return context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getInt(KEY_HP, 500);
    }

    public static int getIntimacy(Context context) {
        if (context == null) return 500;
        return context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getInt(KEY_INTIMACY, 500);
    }

    public static String getWeatherText(Context context) {
        if (context == null) return "";
        return context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getString(KEY_WEATHER_TEXT, "");
    }

    public static long getWidgetTipExpireAt(Context context) {
        if (context == null) return 0L;
        return context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getLong(KEY_WIDGET_TIP_EXPIRE_AT, 0L);
    }

    /**
     * 供 JS 调用：清空 Widget 文案并刷新（使用 sContext）。签名 ()V。
     */
    public static void clearWeather() {
        clearWeather(sContext);
    }

    /**
     * 主动清空 Widget 文案（用于从「没网啦」恢复到 Wi‑Fi、充电时不显示文案等）。
     */
    public static void clearWeather(Context context) {
        if (context == null) return;
        Context ctx = context.getApplicationContext();
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .remove(KEY_WEATHER_TEXT)
                .remove(KEY_WIDGET_TIP_EXPIRE_AT)
                .apply();
        AppWidgetManager wm = AppWidgetManager.getInstance(ctx);
        int[] idsSmall = wm.getAppWidgetIds(new ComponentName(ctx, PetWidgetProvider.class));
        if (idsSmall != null && idsSmall.length > 0) {
            PetWidgetProvider.updateAll(ctx, wm, idsSmall);
        }
    }

    /** 是否低电量（未充电且电量 &lt; 21%）。Widget 用与体力为 0 相同的 14 动画。 */
    public static boolean isBatteryLow(Context context) {
        if (context == null) return false;
        if (getCharging(context)) return false;
        Context app = context.getApplicationContext();
        try {
            BatteryManager bm = (BatteryManager) app.getSystemService(Context.BATTERY_SERVICE);
            if (bm != null && android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
                int level = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY);
                if (level >= 0 && level <= 100) return level < 21;
            }
            android.content.IntentFilter filter = new android.content.IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            android.content.Intent battery = android.os.Build.VERSION.SDK_INT >= 33
                    ? app.registerReceiver(null, filter, Context.RECEIVER_NOT_EXPORTED)
                    : app.registerReceiver(null, filter);
            if (battery != null) {
                int level = battery.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                int scale = battery.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
                if (scale > 0 && level >= 0) return (level * 100 / scale) < 21;
            }
        } catch (Exception ignored) { }
        return false;
    }

    /**
     * Widget 构建时调用：从系统实时读取充电状态（BatteryManager + sticky broadcast 双路径），
     * 并写回 prefs，保证插电后即使 BatteryReceiver 未触发也能正确切充电动画。
     */
    public static boolean refreshChargingState(Context context) {
        if (context == null) return false;
        Context app = context.getApplicationContext();
        boolean charging = false;
        try {
            BatteryManager bm = (BatteryManager) app.getSystemService(Context.BATTERY_SERVICE);
            if (bm != null && android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                charging = bm.isCharging();
            }
            if (!charging && android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
                IntentFilter filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
                Intent battery = android.os.Build.VERSION.SDK_INT >= 33
                        ? app.registerReceiver(null, filter, Context.RECEIVER_NOT_EXPORTED)
                        : app.registerReceiver(null, filter);
                if (battery != null) {
                    int plugged = battery.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1);
                    charging = plugged == BatteryManager.BATTERY_PLUGGED_AC
                            || plugged == BatteryManager.BATTERY_PLUGGED_USB
                            || plugged == BatteryManager.BATTERY_PLUGGED_WIRELESS;
                }
            }
        } catch (Exception ignored) { }
        setCharging(context, charging);
        return charging;
    }

    /** 是否正在充电（插线/无线充）。
     *  说明：Widget 构建前应先调用 refreshChargingState 以从系统同步一次；
     *  之后统一从 SharedPreferences 读取，以避免不同设备上 BatteryManager 行为差异导致状态不一致。 */
    public static boolean getCharging(Context context) {
        if (context == null) return false;
        Context app = context.getApplicationContext();
        return app.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).getBoolean(KEY_CHARGING, false);
    }

    /** 仅写入充电状态；刷新由随后调用的 syncWeather/clearWeather 触发，避免重复 updateAll。
     *  charging 由 false→true 时记录一次时间戳，用于与无网络按「发生时间」二选一 overlay。*/
    public static void setCharging(Context context, boolean charging) {
        if (context == null) return;
        Context app = context.getApplicationContext();
        SharedPreferences prefs = app.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        boolean prev = prefs.getBoolean(KEY_CHARGING, false);
        SharedPreferences.Editor editor = prefs.edit().putBoolean(KEY_CHARGING, charging);
        if (charging) {
            // 仅在从「未充电」切到「充电」时记录发生时间；持续充电期间不刷新时间戳
            if (!prev) {
                editor.putLong(KEY_CHARGING_AT, System.currentTimeMillis());
            }
        } else {
            editor.remove(KEY_CHARGING_AT);
        }
        editor.apply();
    }

    /** 充电变为 true 的时间戳（毫秒），0 表示未在充电或未记录 */
    public static long getChargingAt(Context context) {
        if (context == null) return 0L;
        return context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getLong(KEY_CHARGING_AT, 0L);
    }

    /** 最近一次记录为「无网络」的时间戳（毫秒），0 表示当前有网或未记录 */
    public static long getNoNetworkAt(Context context) {
        if (context == null) return 0L;
        return context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getLong(KEY_NO_NETWORK_AT, 0L);
    }

    /** 清除无网络时间戳，便于 App 回到前台时按当前系统网络状态重新判断，避免恢复网络后 widget 仍卡在无网动画 */
    public static void clearNoNetworkState(Context context) {
        if (context == null) return;
        context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit().remove(KEY_NO_NETWORK_AT).apply();
    }

    /** 在 Widget 构建时调用：若当前为无网络且尚未记录时间，则记录一次；从无网络恢复时清除。
     *  用于与充电 overlay 按发生时间二选一（后发生的覆盖先发生的）。 */
    public static void recordNoNetworkAt(Context context, boolean isNoNetwork) {
        if (context == null) return;
        Context app = context.getApplicationContext();
        SharedPreferences prefs = app.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        long prev = prefs.getLong(KEY_NO_NETWORK_AT, 0L);
        SharedPreferences.Editor editor = prefs.edit();
        if (isNoNetwork) {
            // 仅从「有网」切到「无网」时记录一次发生时间；持续无网期间不刷新时间戳
            if (prev == 0L) {
                editor.putLong(KEY_NO_NETWORK_AT, System.currentTimeMillis());
            }
        } else if (prev != 0L) {
            editor.remove(KEY_NO_NETWORK_AT);
        }
        editor.apply();
    }

    /** Widget 构建时调用：若当前正在充电但尚未记录时间（如进程曾被杀死），则补记一次，保证充电动画能按时间与无网络二选一。 */
    public static void ensureChargingAtIfCharging(Context context) {
        if (context == null) return;
        if (getCharging(context) && getChargingAt(context) == 0L) {
            context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                    .edit().putLong(KEY_CHARGING_AT, System.currentTimeMillis()).apply();
        }
    }
}

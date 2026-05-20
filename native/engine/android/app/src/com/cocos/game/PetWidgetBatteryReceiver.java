package com.cocos.game;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.BatteryManager;

/**
 * 监听充电状态：插电时仅更新充电动画，不显示充电文案；拔掉清空并刷新。
 * Manifest 中同时注册 POWER_CONNECTED、POWER_DISCONNECTED、BATTERY_CHANGED。
 * Android 8+ 下 POWER_* 静态注册可能收不到，但 BATTERY_CHANGED 仍可收到，插拔时系统会下发并拉起进程，从而及时刷新 Widget。
 */
public class PetWidgetBatteryReceiver extends BroadcastReceiver {

    /** 上次收到的充电状态，用于仅在实际变化时刷新 Widget（避免 BATTERY_CHANGED 因电量变化频繁触发） */
    private static Boolean sLastCharging = null;

    @Override
    public void onReceive(Context context, Intent intent) {
        if (context == null || intent == null) return;
        Context app = context.getApplicationContext();
        String action = intent.getAction();
        boolean charging;
        if (Intent.ACTION_POWER_CONNECTED.equals(action)) {
            charging = true;
        } else if (Intent.ACTION_POWER_DISCONNECTED.equals(action)) {
            charging = false;
        } else if (Intent.ACTION_BATTERY_CHANGED.equals(action)) {
            int plugged = intent.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1);
            charging = plugged == BatteryManager.BATTERY_PLUGGED_AC
                    || plugged == BatteryManager.BATTERY_PLUGGED_USB
                    || plugged == BatteryManager.BATTERY_PLUGGED_WIRELESS;
        } else {
            return;
        }
        if (sLastCharging != null && sLastCharging == charging) return;
        sLastCharging = charging;
        PetWidgetSync.setCharging(context, charging);
        PetWidgetSync.clearWeather(app);
        refreshAllWidgets(app);
    }

    private static void refreshAllWidgets(Context app) {
        android.appwidget.AppWidgetManager wm = android.appwidget.AppWidgetManager.getInstance(app);
        if (wm == null) return;
        android.content.ComponentName small = new android.content.ComponentName(app, PetWidgetProvider.class);
        int[] idsSmall = wm.getAppWidgetIds(small);
        if (idsSmall != null && idsSmall.length > 0) {
            PetWidgetProvider.updateAll(app, wm, idsSmall);
        }
        // 插拔电后启动动画服务，否则进程被杀死后插电只刷新一帧且不会继续播充电动画
        if (idsSmall != null && idsSmall.length > 0) {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                app.startForegroundService(new Intent(app, PetWidgetAnimService.class));
            } else {
                app.startService(new Intent(app, PetWidgetAnimService.class));
            }
        }
    }
}

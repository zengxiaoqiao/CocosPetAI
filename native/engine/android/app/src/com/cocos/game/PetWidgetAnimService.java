package com.cocos.game;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ServiceInfo;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;

/**
 * 通过 Handler 每 200ms 刷新一次 Widget 画面，实现宠物动画。
 * 服务运行时注册 NetworkCallback，断网/恢复网络时实时刷新 Widget，不依赖 CONNECTIVITY 广播。
 * Android 8+ 需前台服务才能常驻，会显示一条低优先级通知。
 */
public class PetWidgetAnimService extends Service {

    private static final long ANIM_INTERVAL_MS = 200;
    private static final int NOTIFICATION_ID = 9001;
    private static final String CHANNEL_ID = "pet_widget_anim";

    private final Handler handler = new Handler(Looper.getMainLooper());
    private Runnable tickRunnable;
    private BroadcastReceiver chargingReceiver;
    private ConnectivityManager.NetworkCallback networkCallback;
    private BroadcastReceiver connectivityReceiver;
    private static Boolean lastChargingState = null;

    @Override
    public void onCreate() {
        super.onCreate();
        registerChargingReceiver();
        registerNetworkCallback();
        registerConnectivityReceiver();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        registerChargingReceiver();
        registerNetworkCallback();
        registerConnectivityReceiver();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                ensureChannel();
                Notification n = buildNotification();
                if (n != null) {
                    // API 34+：manifest 声明了 foregroundServiceType=specialUse，必须传入对应类型，否则
                    // startForeground 失败或未进入前台，系统会杀进程（添加 Widget 后拉起本服务即崩）。
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                        startForeground(NOTIFICATION_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
                    } else {
                        startForeground(NOTIFICATION_ID, n);
                    }
                }
            } catch (Throwable t) {
                android.util.Log.w("PetWidgetAnim", "startForeground failed", t);
                stopSelf();
                return START_NOT_STICKY;
            }
        }
        scheduleNext();
        return START_STICKY;
    }

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        int strId = getResources().getIdentifier("widget_pet_desc", "string", getPackageName());
        String name = strId != 0 ? getString(strId) : "宠物";
        NotificationChannel ch = new NotificationChannel(CHANNEL_ID, name, NotificationManager.IMPORTANCE_MIN);
        ch.setShowBadge(false);
        ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(ch);
    }

    private Notification buildNotification() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return null;
        int strId = getResources().getIdentifier("widget_pet_desc", "string", getPackageName());
        int iconId = getResources().getIdentifier("ic_launcher", "mipmap", getPackageName());
        if (iconId == 0) iconId = android.R.drawable.ic_dialog_info;
        Notification.Builder b = new Notification.Builder(this, CHANNEL_ID)
                .setContentTitle(strId != 0 ? getString(strId) : "宠物")
                .setSmallIcon(iconId)
                .setPriority(Notification.PRIORITY_MIN)
                .setCategory(Notification.CATEGORY_SERVICE)
                .setVisibility(Notification.VISIBILITY_SECRET);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            b.setForegroundServiceBehavior(Notification.FOREGROUND_SERVICE_IMMEDIATE);
        }
        return b.build();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void scheduleNext() {
        if (tickRunnable != null) handler.removeCallbacks(tickRunnable);
        tickRunnable = new Runnable() {
            @Override
            public void run() {
                Context app = getApplicationContext();
                AppWidgetManager wm = AppWidgetManager.getInstance(app);
                int[] idsSmall = wm.getAppWidgetIds(new ComponentName(app, PetWidgetProvider.class));
                int[] idsLarge = wm.getAppWidgetIds(new ComponentName(app, PetWidgetLargeProvider.class));
                if (idsSmall != null && idsSmall.length > 0) {
                    PetWidgetProvider.updateAll(app, wm, idsSmall);
                }
                if (idsLarge != null && idsLarge.length > 0) {
                    PetWidgetLargeProvider.updateAll(app, wm, idsLarge);
                }
                if ((idsSmall != null && idsSmall.length > 0) || (idsLarge != null && idsLarge.length > 0)) {
                    handler.postDelayed(this, ANIM_INTERVAL_MS);
                }
            }
        };
        handler.postDelayed(tickRunnable, ANIM_INTERVAL_MS);
    }

    @Override
    public void onDestroy() {
        unregisterChargingReceiver();
        unregisterConnectivityReceiver();
        unregisterNetworkCallback();
        if (tickRunnable != null) handler.removeCallbacks(tickRunnable);
        super.onDestroy();
    }

    /** 前台服务运行时注册插拔电广播，Android 8+ 下可收到 POWER_CONNECTED/DISCONNECTED，立即刷新 Widget。注册时用当前充电状态初始化 lastChargingState，避免与 BatteryReceiver 不同步导致充电动画有时不切。 */
    private void registerChargingReceiver() {
        if (chargingReceiver != null) return;
        Context app = getApplicationContext();
        lastChargingState = PetWidgetSync.getCharging(app);
        chargingReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (context == null || intent == null) return;
                Context app = context.getApplicationContext();
                String action = intent.getAction();
                boolean charging = false;
                if (Intent.ACTION_POWER_CONNECTED.equals(action)) {
                    charging = true;
                } else if (Intent.ACTION_POWER_DISCONNECTED.equals(action)) {
                    charging = false;
                } else if (Intent.ACTION_BATTERY_CHANGED.equals(action)) {
                    int plugged = intent.getIntExtra(android.os.BatteryManager.EXTRA_PLUGGED, -1);
                    charging = plugged == android.os.BatteryManager.BATTERY_PLUGGED_AC
                            || plugged == android.os.BatteryManager.BATTERY_PLUGGED_USB
                            || plugged == android.os.BatteryManager.BATTERY_PLUGGED_WIRELESS;
                } else {
                    return;
                }
                // 仅当充电状态变化时刷新，避免 BATTERY_CHANGED 频繁触发
                if (lastChargingState != null && lastChargingState == charging) return;
                lastChargingState = charging;
                PetWidgetSync.setCharging(context, charging);
                PetWidgetSync.clearWeather(app);
                // 立即刷新所有 Widget，确保充电动画马上切换
                refreshAllWidgets(app);
            }
        };
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_POWER_CONNECTED);
        filter.addAction(Intent.ACTION_POWER_DISCONNECTED);
        filter.addAction(Intent.ACTION_BATTERY_CHANGED);
        if (Build.VERSION.SDK_INT >= 33) {
            registerReceiver(chargingReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(chargingReceiver, filter);
        }
    }

    private static void refreshAllWidgets(Context app) {
        AppWidgetManager wm = AppWidgetManager.getInstance(app);
        if (wm == null) return;
        int[] idsSmall = wm.getAppWidgetIds(new ComponentName(app, PetWidgetProvider.class));
        int[] idsLarge = wm.getAppWidgetIds(new ComponentName(app, PetWidgetLargeProvider.class));
        if (idsSmall != null && idsSmall.length > 0) {
            PetWidgetProvider.updateAll(app, wm, idsSmall);
        }
        if (idsLarge != null && idsLarge.length > 0) {
            PetWidgetLargeProvider.updateAll(app, wm, idsLarge);
        }
    }

    private void unregisterChargingReceiver() {
        if (chargingReceiver != null) {
            try {
                unregisterReceiver(chargingReceiver);
            } catch (Exception ignored) { }
            chargingReceiver = null;
        }
    }

    /**
     * 用系统 NetworkCallback 监听默认网络变化，断网/恢复时立即刷新 Widget。
     * 不依赖 CONNECTIVITY_CHANGE 广播（Android 7+ 对静态注册不下发），只要本服务在跑就能收到回调。
     */
    private void registerNetworkCallback() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) return;
        if (networkCallback != null) return;
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return;
        networkCallback = new ConnectivityManager.NetworkCallback() {
            @Override
            public void onAvailable(Network network) {
                handler.post(() -> refreshAllWidgets(getApplicationContext()));
            }

            @Override
            public void onLost(Network network) {
                handler.post(() -> refreshAllWidgets(getApplicationContext()));
            }

            @Override
            public void onCapabilitiesChanged(Network network, NetworkCapabilities capabilities) {
                handler.post(() -> refreshAllWidgets(getApplicationContext()));
            }
        };
        try {
            cm.registerDefaultNetworkCallback(networkCallback);
        } catch (Exception ignored) {
            networkCallback = null;
        }
    }

    private void unregisterNetworkCallback() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N || networkCallback == null) return;
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm != null) cm.unregisterNetworkCallback(networkCallback);
        } catch (Exception ignored) { }
        networkCallback = null;
    }

    /** 服务内动态注册 CONNECTIVITY_CHANGE，与 NetworkCallback 双路确保断网/恢复时瞬间刷新 */
    private void registerConnectivityReceiver() {
        if (connectivityReceiver != null) return;
        connectivityReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (intent == null || !ConnectivityManager.CONNECTIVITY_ACTION.equals(intent.getAction())) return;
                handler.post(() -> refreshAllWidgets(getApplicationContext()));
            }
        };
        IntentFilter filter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
        if (Build.VERSION.SDK_INT >= 33) {
            registerReceiver(connectivityReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(connectivityReceiver, filter);
        }
    }

    private void unregisterConnectivityReceiver() {
        if (connectivityReceiver != null) {
            try {
                unregisterReceiver(connectivityReceiver);
            } catch (Exception ignored) { }
            connectivityReceiver = null;
        }
    }

}

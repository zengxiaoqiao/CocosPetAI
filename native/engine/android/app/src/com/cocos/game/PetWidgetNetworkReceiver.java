package com.cocos.game;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.os.Build;
import android.telephony.TelephonyManager;

/**
 * 监听网络变化：仅在真正断网时给 Widget 推送「没网啦」提示，其它网络类型不再提示 4G/5G/3G 文案。
 * Android 10+ 用 getActiveNetwork() 判断，避免移动网被误判为无网络。
 */
public class PetWidgetNetworkReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (context == null) return;
        String action = intent != null ? intent.getAction() : null;
        if (action == null || !ConnectivityManager.CONNECTIVITY_ACTION.equals(action)) return;

        Context app = context.getApplicationContext();
        // 先拉启动画服务，使 NetworkCallback 在服务内注册，后续断网/恢复都能收到回调
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            app.startForegroundService(new Intent(app, PetWidgetAnimService.class));
        } else {
            app.startService(new Intent(app, PetWidgetAnimService.class));
        }
        // 本次网络变化立即刷新 Widget
        PetWidgetSync.clearWeather(app);
    }

    /**
     * 返回 "wifi" | "5g" | "4g" | "3g" | "none"（真正无网络） | ""（未知/不处理）。
     * Android 10+ 使用 getActiveNetwork() + NetworkCapabilities，仅无网络或无可达互联网时返回 "none"。
     */
    public static String getNetworkType(Context context) {
        if (context == null) return "";
        try {
            ConnectivityManager cm = (ConnectivityManager) context.getApplicationContext()
                    .getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm == null) return "";

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Network network = cm.getActiveNetwork();
                if (network == null) return "none";
                NetworkCapabilities caps = cm.getNetworkCapabilities(network);
                if (caps == null || !caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)) return "none";
                if (caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) return "wifi";
                if (caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
                    int dataType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.N
                            ? getDataNetworkType(context) : TelephonyManager.NETWORK_TYPE_UNKNOWN;
                    if (dataType != TelephonyManager.NETWORK_TYPE_UNKNOWN) return cellularTypeFromSubtype(dataType);
                    return "4g";
                }
                return "";
            }

            // API < 23 回退
            NetworkInfo info = cm.getActiveNetworkInfo();
            if (info == null || !info.isConnected()) return "none";
            if (info.getType() == ConnectivityManager.TYPE_WIFI) return "wifi";
            if (info.getType() == ConnectivityManager.TYPE_MOBILE) {
                int subtype = Build.VERSION.SDK_INT >= Build.VERSION_CODES.N ? getDataNetworkType(context) : info.getSubtype();
                return cellularTypeFromSubtype(subtype);
            }
            return "";
        } catch (Exception ignored) {
            return "";
        }
    }

    private static int getDataNetworkType(Context context) {
        try {
            TelephonyManager tm = (TelephonyManager) context.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
            return tm != null ? tm.getDataNetworkType() : TelephonyManager.NETWORK_TYPE_UNKNOWN;
        } catch (Exception ignored) {
            return TelephonyManager.NETWORK_TYPE_UNKNOWN;
        }
    }

    private static String cellularTypeFromSubtype(int dataType) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && dataType == TelephonyManager.NETWORK_TYPE_NR) return "5g";
        if (dataType == TelephonyManager.NETWORK_TYPE_LTE
                || dataType == TelephonyManager.NETWORK_TYPE_HSPAP
                || dataType == TelephonyManager.NETWORK_TYPE_EHRPD) return "4g";
        if (dataType == TelephonyManager.NETWORK_TYPE_UMTS
                || dataType == TelephonyManager.NETWORK_TYPE_HSDPA
                || dataType == TelephonyManager.NETWORK_TYPE_HSUPA
                || dataType == TelephonyManager.NETWORK_TYPE_HSPA) return "3g";
        return "4g";
    }
}

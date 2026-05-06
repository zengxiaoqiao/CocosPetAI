/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package com.cocos.game;

import android.Manifest;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.BatteryManager;
import android.telephony.TelephonyManager;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.media.MediaRecorder;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.Toast;

import com.cocos.service.SDKWrapper;
import com.cocos.lib.CocosActivity;
import com.iflytek.sparkchain.core.LogLvl;
import com.iflytek.sparkchain.core.SparkChain;
import com.iflytek.sparkchain.core.SparkChainConfig;
import com.ume.petai.R;

import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;

public class AppActivity extends CocosActivity {

    private static final String TAG = "AppActivity";
    private static final int REQUEST_RECORD_AUDIO = 1001;
    private static final int REQUEST_LOCATION_COARSE = 1002;
    private static AppActivity sInstance;
    private static IflytekAsrEngine sIflytekAsr;
    private static volatile String sAsrLatestText = "";
    private static volatile boolean sAsrRunning = false;
    private static volatile int sAsrLastError = 0;
    /**
     * One-shot ASR mode for manual press-release (no auto-restart).
     */
    private static volatile boolean sAsrOnceMode = false;
    // [MOCK_ASR] Enable fixed-text ASR for API integration testing.
    private static final boolean MOCK_ASR = false;
    // [MOCK_ASR] Text returned to JS when polling ASR result.
    private static final String MOCK_ASR_TEXT = "狗好玩还是猫好玩";
    // [MOCK_ASR] Ensure one-shot flow returns mock text only once per press.
    private static volatile boolean sMockAsrOnceDelivered = false;
    private BroadcastReceiver networkReceiver;
    private BroadcastReceiver batteryReceiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.e(TAG, "onCreate");
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
        sInstance = this;
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.shared().init(this);
        PetWidgetSync.setContext(this);
        clearWidgetTipIfFromWidget(getIntent());
        // Android 7+ manifest 可能收不到 CONNECTIVITY_ACTION，动态注册保证进程在时能更新 Widget
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            networkReceiver = new PetWidgetNetworkReceiver();
            IntentFilter filter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                registerReceiver(networkReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
            } else {
                registerReceiver(networkReceiver, filter);
            }
        }
        // BATTERY_CHANGED 只能运行时注册，App 在时插拔电可及时更新 Widget
        batteryReceiver = new PetWidgetBatteryReceiver();
        IntentFilter batteryFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(batteryReceiver, batteryFilter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(batteryReceiver, batteryFilter);
        }
        initSparkChainSDK();
    }

    private void initSparkChainSDK() {
        Log.e(TAG, "init sdk");
        SparkChainConfig sparkChainConfig = SparkChainConfig.builder();
        sparkChainConfig.appID(getResources().getString(R.string.appid))
                .apiKey(getResources().getString(R.string.apikey))
                .apiSecret(getResources().getString(R.string.apiSecret))
//                .logPath("/sdcard/iflytek/SparkChain.log")
                .logLevel(LogLvl.VERBOSE.getValue());

        int ret = SparkChain.getInst().init(getApplicationContext(), sparkChainConfig);
        String result;
        if (ret == 0) {
            result = "SDK初始化成功,请选择相应的功能点击体验。";
        } else {
            result = "SDK初始化失败,错误码:" + ret;
        }
        Log.d(TAG, result);
    }

    /**
     * 供 JS 在点击麦克风按钮时调用：若未授予麦克风权限则请求（Android 6.0+）
     */
    public static void requestRecordAudioPermissionIfNeeded() {
        if (sInstance == null) return;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return;
        if (sInstance.checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED)
            return;
        sInstance.requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_RECORD_AUDIO);
    }

    /**
     * Start iFlytek ASR and store latest transcript.
     */
    public static void startAutoAsr() {
        Log.e(TAG, "startAutoAsr");
        if (sInstance == null) return;
        // [MOCK_ASR] Skip real recognizer; only mark running.
        if (MOCK_ASR) {
            sAsrRunning = true;
            sAsrLastError = 0;
            return;
        }
        sInstance.runOnUiThread(() -> {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (sInstance.checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                        requestRecordAudioPermissionIfNeeded();
                        return;
                    }
                }
                if (sIflytekAsr == null) {
                    sIflytekAsr = new IflytekAsrEngine(sInstance);
                }
                sAsrLastError = 0;
                if (!sIflytekAsr.start(sAsrOnceMode)) {
                    sAsrLastError = sIflytekAsr.getLastError();
                    sAsrRunning = false;
                    return;
                }
                sAsrRunning = true;
            } catch (Exception ignored) {
                Log.e(TAG, "exc: 55555" + ignored.getMessage());
            }
        });
    }

    /**
     * One-shot ASR for manual press-release: starts listening once (no restart).
     */
    public static void startOnceAsr() {
        if (sInstance == null) return;
        // [MOCK_ASR] Reset one-shot delivery flag for each new press.
        if (MOCK_ASR) {
            sMockAsrOnceDelivered = false;
            sAsrRunning = true;
            sAsrLastError = 0;
            return;
        }
        sAsrOnceMode = true;
        startAutoAsr();
    }

    /**
     * Stop one-shot ASR and request final iFlytek result.
     */
    public static void stopOnceAsr() {
        if (sInstance == null) return;
        // [MOCK_ASR] No real recognizer to stop.
        if (MOCK_ASR) {
            sAsrRunning = false;
            return;
        }
        sInstance.runOnUiThread(() -> {
            if (sIflytekAsr != null) {
                sIflytekAsr.stop(true);
                sAsrRunning = sIflytekAsr.isRunning();
                sAsrLastError = sIflytekAsr.getLastError();
            }
            sAsrOnceMode = false;
        });
    }

    /**
     * Stop iFlytek ASR.
     */
    public static void stopAutoAsr() {
        if (sInstance == null) return;
        // [MOCK_ASR] No real recognizer to stop.
        if (MOCK_ASR) {
            sAsrRunning = false;
            return;
        }
        sAsrRunning = false;
        sInstance.runOnUiThread(() -> {
            if (sIflytekAsr != null) {
                sIflytekAsr.stop(true);
                sAsrLastError = sIflytekAsr.getLastError();
            }
        });
    }

    /**
     * Poll latest transcript (returns and clears).
     */
    public static String pollAutoAsrResult() {
        // [MOCK_ASR] Return fixed text once for each manual press.
        if (MOCK_ASR) {
            if (!sMockAsrOnceDelivered) {
                sMockAsrOnceDelivered = true;
                return MOCK_ASR_TEXT;
            }
            return "";
        }
        String t = sIflytekAsr != null ? sIflytekAsr.pollText() : sAsrLatestText;
        if (t == null) t = "";
        sAsrLatestText = "";
        if (sIflytekAsr != null) {
            sAsrRunning = sIflytekAsr.isRunning();
            sAsrLastError = sIflytekAsr.getLastError();
        }
        return t;
    }

    /**
     * Debug helper for JS: returns "running,err" and clears nothing.
     */
    public static String pollAutoAsrDebug() {
        return (sAsrRunning ? "1" : "0") + "," + sAsrLastError;
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.shared().onResume();
        startWidgetAnimServiceIfHasWidget();
        refreshAllPetWidgets();
    }

    /**
     * 刷新所有宠物 Widget（充电状态、文案等），回到前台时调用以保证显示正确
     */
    private void refreshAllPetWidgets() {
        Context app = getApplicationContext();
        AppWidgetManager wm = AppWidgetManager.getInstance(app);
        if (wm == null) return;
        // 先清掉无网时间戳，避免之前误记导致「有网却显示无网」；再按当前网络状态刷新
        PetWidgetSync.clearNoNetworkState(app);
        int[] idsSmall = wm.getAppWidgetIds(new ComponentName(app, PetWidgetProvider.class));
        int[] idsLarge = wm.getAppWidgetIds(new ComponentName(app, PetWidgetLargeProvider.class));
        if (idsSmall != null && idsSmall.length > 0) {
            PetWidgetProvider.updateAll(app, wm, idsSmall);
        }
        if (idsLarge != null && idsLarge.length > 0) {
            PetWidgetLargeProvider.updateAll(app, wm, idsLarge);
        }
        // 延迟约 1.5 秒再刷新一次，避免刚进 App 时系统网络状态尚未就绪被误判为无网
        if ((idsSmall != null && idsSmall.length > 0) || (idsLarge != null && idsLarge.length > 0)) {
            getWindow().getDecorView().postDelayed(() -> {
                if (wm != null && idsSmall != null && idsSmall.length > 0) {
                    PetWidgetProvider.updateAll(app, wm, idsSmall);
                }
                if (wm != null && idsLarge != null && idsLarge.length > 0) {
                    PetWidgetLargeProvider.updateAll(app, wm, idsLarge);
                }
            }, 1500);
        }
    }

    /**
     * 若有宠物 Widget（小号或大号）在桌面，从前台启动动画服务（Android 14/15 不允许从广播后台启动）
     */
    private void startWidgetAnimServiceIfHasWidget() {
        AppWidgetManager wm = AppWidgetManager.getInstance(this);
        if (wm == null) return;
        int[] idsSmall = wm.getAppWidgetIds(new ComponentName(this, PetWidgetProvider.class));
        int[] idsLarge = wm.getAppWidgetIds(new ComponentName(this, PetWidgetLargeProvider.class));
        boolean hasWidget = (idsSmall != null && idsSmall.length > 0) || (idsLarge != null && idsLarge.length > 0);
        if (!hasWidget) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(new Intent(this, PetWidgetAnimService.class));
        } else {
            startService(new Intent(this, PetWidgetAnimService.class));
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.shared().onPause();
    }

    @Override
    protected void onDestroy() {
        if (networkReceiver != null) {
            try {
                unregisterReceiver(networkReceiver);
            } catch (Exception ignored) {
            }
            networkReceiver = null;
        }
        if (batteryReceiver != null) {
            try {
                unregisterReceiver(batteryReceiver);
            } catch (Exception ignored) {
            }
            batteryReceiver = null;
        }
        // Release ASR resources to avoid leaks across activity recreation.
        try {
            if (sIflytekAsr != null) {
                sIflytekAsr.release();
            }
        } catch (Exception ignored) {
        }
        sIflytekAsr = null;
        sAsrRunning = false;
        sAsrOnceMode = false;
        sAsrLastError = 0;
        if (sInstance == this) sInstance = null;
        super.onDestroy();
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }
        SDKWrapper.shared().onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.shared().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        clearWidgetTipIfFromWidget(intent);
        SDKWrapper.shared().onNewIntent(intent);
    }

    /**
     * 若本次启动来自点击 Widget，则清除 Widget 上的文字提示，用户返回桌面时不再显示
     */
    private void clearWidgetTipIfFromWidget(Intent intent) {
        if (intent == null || !intent.getBooleanExtra(PetWidgetSync.EXTRA_FROM_WIDGET, false))
            return;
        PetWidgetSync.clearWeather(this);
        intent.removeExtra(PetWidgetSync.EXTRA_FROM_WIDGET);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.shared().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.shared().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.shared().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.shared().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.shared().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.shared().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.shared().onStart();
        super.onStart();
    }

    @Override
    public void onLowMemory() {
        SDKWrapper.shared().onLowMemory();
        super.onLowMemory();
    }

    public static Context getAppContext() {
        return sInstance != null ? sInstance.getApplicationContext() : null;
    }

    /**
     * 供 JS 读取：应用 versionName（如 1.0.0）。
     */
    public static String getAppVersionName() {
        Context ctx = getAppContext();
        if (ctx == null) return "";
        try {
            return ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0).versionName;
        } catch (Exception ignored) {
            return "";
        }
    }

    /**
     * 供 JS 读取：应用 versionCode（字符串，兼容 longVersionCode）。
     */
    public static String getAppVersionCodeString() {
        Context ctx = getAppContext();
        if (ctx == null) return "";
        try {
            PackageInfo pi = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                return String.valueOf(pi.getLongVersionCode());
            }
            return String.valueOf(pi.versionCode);
        } catch (Exception ignored) {
            return "";
        }
    }

    /**
     * 供 JS 读取：应用包名。
     */
    public static String getAppPackageName() {
        Context ctx = getAppContext();
        if (ctx == null) return "";
        try {
            return ctx.getPackageName();
        } catch (Exception ignored) {
            return "";
        }
    }

    /**
     * 供 JS 读取：设备厂商（小写），用于配置上报 device 字段。
     */
    public static String getDeviceManufacturerLower() {
        String m = Build.MANUFACTURER;
        if (m == null) return "";
        return m.trim().toLowerCase(Locale.US);
    }

    /**
     * 供 JS 读取：配置接口 uid（ANDROID_ID，应用+设备维度稳定 id）。
     */
    public static String getConfigUid() {
        Context ctx = getAppContext();
        if (ctx == null) return "";
        try {
            String id = Settings.Secure.getString(ctx.getContentResolver(), Settings.Secure.ANDROID_ID);
            return id != null ? id : "";
        } catch (Exception ignored) {
            return "";
        }
    }

    /**
     * 供 JS 读取：分发渠道（来自 manifest meta-data PETAI_DISTRIBUTION_CHANNEL，构建时由 Gradle 注入）。
     */
    public static String getDistributionChannel() {
        Context ctx = getAppContext();
        if (ctx == null) return "";
        try {
            ApplicationInfo ai = ctx.getPackageManager().getApplicationInfo(
                    ctx.getPackageName(),
                    PackageManager.GET_META_DATA);
            if (ai.metaData == null) return "";
            String v = ai.metaData.getString("PETAI_DISTRIBUTION_CHANNEL");
            if (v != null) {
                v = v.trim();
                if (!v.isEmpty()) return v;
            }
            return "";
        } catch (Exception ignored) {
            return "";
        }
    }

    /**
     * 供 JS 调用：弹出系统“添加宠物 Widget 到桌面”的对话框（小号）。
     * 需 Android 8.0+ 且 Launcher 支持 requestPinAppWidget。
     */
    public static void requestPinPetWidget() {
        requestPinPetWidgetSmall();
    }

    /**
     * 供 JS 调用：弹出系统添加「小号」宠物 Widget 的对话框
     */
    public static void requestPinPetWidgetSmall() {
        if (sInstance == null) return;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        sInstance.runOnUiThread(() -> {
            try {
                AppWidgetManager mgr = AppWidgetManager.getInstance(sInstance);
                ComponentName provider = new ComponentName(sInstance, PetWidgetProvider.class);
                if (mgr != null && mgr.isRequestPinAppWidgetSupported()) {
                    mgr.requestPinAppWidget(provider, null, null);
                } else {
                    Toast.makeText(sInstance, "桌面不支持应用内添加，请在桌面长按→小组件添加", Toast.LENGTH_LONG).show();
                }
            } catch (Exception e) {
                Toast.makeText(sInstance, "无法弹出添加小组件弹窗", Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * 供 JS 调用：弹出系统添加「大号」宠物 Widget 的对话框
     */
    public static void requestPinPetWidgetLarge() {
        if (sInstance == null) return;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        sInstance.runOnUiThread(() -> {
            try {
                AppWidgetManager mgr = AppWidgetManager.getInstance(sInstance);
                ComponentName provider = new ComponentName(sInstance, PetWidgetLargeProvider.class);
                if (mgr != null && mgr.isRequestPinAppWidgetSupported()) {
                    mgr.requestPinAppWidget(provider, null, null);
                } else {
                    Toast.makeText(sInstance, "桌面不支持应用内添加，请在桌面长按→小组件添加", Toast.LENGTH_LONG).show();
                }
            } catch (Exception e) {
                Log.w("AppActivity", "requestPinPetWidgetLarge failed", e);
                Toast.makeText(sInstance, "无法弹出添加小组件弹窗", Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * 供 JS 调用：打开系统“通知使用权/通知访问”设置页，方便用户开启权限
     */
    public static void openNotificationAccessSettings() {
        if (sInstance == null) return;
        try {
            Intent intent = new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            sInstance.startActivity(intent);
        } catch (Exception ignored) {
        }
    }

    /**
     * 供 JS 调用：返回最后一次已知位置 "lat,lon"（仅粗略位置），无权限或失败返回空字符串。
     */
    public static String getLastKnownLocation() {
        if (sInstance == null) return "";
        Context ctx = sInstance;
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (ctx.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    // 触发一次权限申请，下次再调用时如果用户同意，就能拿到位置
                    sInstance.requestPermissions(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION}, REQUEST_LOCATION_COARSE);
                    return "";
                }
            }
            LocationManager lm = (LocationManager) ctx.getSystemService(Context.LOCATION_SERVICE);
            if (lm == null) return "";
            Location loc = null;
            try {
                if (lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                    loc = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                }
            } catch (Exception ignored) {
            }
            if (loc == null) {
                try {
                    if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                        loc = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                    }
                } catch (Exception ignored) {
                }
            }
            if (loc == null) return "";
            return loc.getLatitude() + "," + loc.getLongitude();
        } catch (Exception ignored) {
            return "";
        }
    }

    /**
     * 供 JS 调用：返回电池状态 "charging,level"，如 "1,0.85" 表示充电中、85%，"0,0.15" 表示未充电、15%。无权限或失败返回空字符串。
     */
    public static String getBatteryState() {
        if (sInstance == null) return "";
        try {
            IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            Intent batteryStatus = sInstance.registerReceiver(null, ifilter);
            if (batteryStatus == null) return "";
            int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
            boolean charging = (status == BatteryManager.BATTERY_STATUS_CHARGING
                    || status == BatteryManager.BATTERY_STATUS_FULL);
            int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
            if (scale <= 0 || level < 0) return "";
            float pct = level / (float) scale;
            return (charging ? "1," : "0,") + pct;
        } catch (Exception ignored) {
            return "";
        }
    }

    /**
     * 供 JS 调用：返回当前联网类型 "wifi" | "5g" | "4g" | "3g" | "none" | ""，与 PetWidgetNetworkReceiver 一致。
     */
    public static String getNetworkType() {
        if (sInstance == null) return "";
        return PetWidgetNetworkReceiver.getNetworkType(sInstance);
    }

    /**
     * 供 JS 调用：按设备系统时区返回当前日期 "yyyy-MM-dd"，保证每日边界为本地 0 点。签名 ()Ljava/lang/String;
     */
    public static String getLocalDateString() {
        Calendar cal = Calendar.getInstance(TimeZone.getDefault());
        int y = cal.get(Calendar.YEAR);
        int m = cal.get(Calendar.MONTH) + 1;
        int d = cal.get(Calendar.DAY_OF_MONTH);
        return String.format(Locale.US, "%04d-%02d-%02d", y, m, d);
    }

    /**
     * 供 JS 调用：按设备时区返回给定时间戳对应的日期 "yyyy-MM-dd"。签名 (J)Ljava/lang/String;
     */
    public static String getLocalDateStringForTimestamp(long timeMs) {
        Calendar cal = Calendar.getInstance(TimeZone.getDefault());
        cal.setTimeInMillis(timeMs);
        int y = cal.get(Calendar.YEAR);
        int m = cal.get(Calendar.MONTH) + 1;
        int d = cal.get(Calendar.DAY_OF_MONTH);
        return String.format(Locale.US, "%04d-%02d-%02d", y, m, d);
    }

    /**
     * 供 JS 调用：距离下一个设备本地 0 点的毫秒数，用于每日 0 点定时。签名 ()J
     */
    public static long getMsUntilNextLocalMidnight() {
        Calendar cal = Calendar.getInstance(TimeZone.getDefault());
        long now = cal.getTimeInMillis();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        cal.add(Calendar.DAY_OF_MONTH, 1);
        long next = cal.getTimeInMillis();
        return Math.max(0, next - now);
    }
}

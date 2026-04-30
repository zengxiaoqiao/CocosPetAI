package com.cocos.game;

import android.app.Notification;
import android.media.MediaPlayer;
import android.os.SystemClock;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

/**
 * 系统通知监听：任意 App 有新通知时，让宠物叫一声（汪/喵）。
 * 需要用户在系统「通知使用权/通知访问」中手动勾选本应用。
 */
public class PetNotificationListenerService extends NotificationListenerService {

    /** 两次叫声的最小间隔，避免通知太多时连环叫（毫秒） */
    private static final long MIN_INTERVAL_MS = 5000;

    private long lastNotifyTimeMs = 0;

    @Override
    public void onListenerConnected() {
        super.onListenerConnected();
        // 用户在系统里刚刚开启“通知访问”权限时，提示性叫一声，方便确认已生效
        lastNotifyTimeMs = 0;
        playPetSound();
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (sbn == null) return;

        // 跳过本应用自己的通知，避免自触发
        String pkg = sbn.getPackageName();
        if (pkg != null && pkg.equals(getPackageName())) return;

        // 跳过“常驻 / 不可清除”的系统通知（例如电量、导航、正在运行服务等），否则会频繁触发
        if (!sbn.isClearable()) return;

        // 跳过通知分组的 summary（大量 App 会频繁更新 summary）
        Notification n = sbn.getNotification();
        if (n == null) return;
        if ((n.flags & Notification.FLAG_GROUP_SUMMARY) != 0) return;

        long now = SystemClock.elapsedRealtime();
        if (now - lastNotifyTimeMs < MIN_INTERVAL_MS) return;
        lastNotifyTimeMs = now;

        playPetSound();
    }

    /** 根据当前宠物（猫/狗）播放一声叫声 */
    private void playPetSound() {
        String pet = PetWidgetSync.getPet(getApplicationContext()); // dog / cat
        String name = "pet_dog_bark";
        if ("cat".equals(pet)) {
            name = "pet_cat_meow";
        }

        int resId = getSoundResId(name);
        if (resId == 0) {
            // 若未放对应资源，尝试另一种；仍然没有则直接返回
            String fallback = "pet_dog_bark".equals(name) ? "pet_cat_meow" : "pet_dog_bark";
            resId = getSoundResId(fallback);
            if (resId == 0) return;
        }

        try {
            MediaPlayer mp = MediaPlayer.create(this, resId);
            if (mp == null) return;
            mp.setOnCompletionListener(MediaPlayer::release);
            mp.start();
        } catch (Exception ignored) {
        }
    }

    private int getSoundResId(String name) {
        return getResources().getIdentifier(name, "raw", getPackageName());
    }
}


package com.cocos.game;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.os.Build;
import android.os.SystemClock;

/**
 * Widget 动画/刷新用的 Alarm 调度。Android 12+ 起精确闹钟需 {@code SCHEDULE_EXACT_ALARM}，
 * Android 14+ 部分场景仍可能拒绝；{@link AlarmManager#setAlarmClock} 未捕获时会直接崩溃。
 * 此处统一：可精确则精确，否则退回 {@link AlarmManager#set}，避免进程被杀。
 */
final class PetWidgetAlarmScheduler {

    private PetWidgetAlarmScheduler() {
    }

    static boolean canScheduleExactAlarms(AlarmManager am) {
        if (am == null) return false;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true;
        return am.canScheduleExactAlarms();
    }

    /**
     * 短周期动画 tick：优先 {@link AlarmManager#setAlarmClock}，否则精确/inexact 回退。
     */
    static void scheduleAnimTick(AlarmManager am, long triggerAtElapsed, long triggerAtWallClockMs,
            PendingIntent operation, PendingIntent showIntent) {
        if (am == null || operation == null) return;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && canScheduleExactAlarms(am)) {
            try {
                am.setAlarmClock(new AlarmManager.AlarmClockInfo(triggerAtWallClockMs, showIntent), operation);
                return;
            } catch (SecurityException ignored) {
            }
        }

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && canScheduleExactAlarms(am)) {
                am.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME, triggerAtElapsed, operation);
                return;
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT && canScheduleExactAlarms(am)) {
                am.setExact(AlarmManager.ELAPSED_REALTIME, triggerAtElapsed, operation);
                return;
            }
        } catch (SecurityException ignored) {
        }

        am.set(AlarmManager.ELAPSED_REALTIME, triggerAtElapsed, operation);
    }

    /**
     * 较长间隔状态刷新：优先 {@link AlarmManager#setExactAndAllowWhileIdle}，失败则 inexact。
     */
    static void scheduleStateRefresh(AlarmManager am, long triggerAtElapsed, PendingIntent operation) {
        if (am == null || operation == null) return;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                if (canScheduleExactAlarms(am)) {
                    am.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME, triggerAtElapsed, operation);
                    return;
                }
            } catch (SecurityException ignored) {
            }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            try {
                if (canScheduleExactAlarms(am)) {
                    am.setExact(AlarmManager.ELAPSED_REALTIME, triggerAtElapsed, operation);
                    return;
                }
            } catch (SecurityException ignored) {
            }
        }

        am.set(AlarmManager.ELAPSED_REALTIME, triggerAtElapsed, operation);
    }
}

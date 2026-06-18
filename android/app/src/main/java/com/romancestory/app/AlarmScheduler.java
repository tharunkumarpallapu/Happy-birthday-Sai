package com.romancestory.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import java.util.Calendar;

/**
 * Android Alarm Scheduler
 * Manages all notification scheduling with proper date ranges and unique IDs
 * Prevents duplicate notifications and ensures proper cleanup
 */
public class AlarmScheduler {
    private static final String TAG = "AlarmScheduler";
    
    // Notification Actions
    private static final String GOOD_MORNING_ACTION = "GOOD_MORNING";
    private static final String BREAKFAST_ACTION = "BREAKFAST";
    private static final String LUNCH_ACTION = "LUNCH";
    private static final String MOOD_CHECK_ACTION = "MOOD_CHECK";
    private static final String FAMILY_CARE_ACTION = "FAMILY_CARE";
    private static final String DINNER_ACTION = "DINNER";
    private static final String GOOD_NIGHT_ACTION = "GOOD_NIGHT";
    private static final String SCREEN_TIME_ACTION = "SCREEN_TIME";
    private static final String ADVANCE_BIRTHDAY_ACTION = "ADVANCE_BIRTHDAY";
    private static final String BIRTHDAY_ACTION = "BIRTHDAY";
    
    // Unique Request Codes (non-overlapping ranges)
    private static final int GOOD_MORNING_REQUEST = 1001;
    private static final int BREAKFAST_REQUEST = 1002;
    private static final int LUNCH_REQUEST = 1003;
    private static final int MOOD_CHECK_REQUEST = 1004;
    private static final int FAMILY_CARE_REQUEST = 1005;
    private static final int DINNER_REQUEST = 1006;
    private static final int GOOD_NIGHT_REQUEST = 1007;
    private static final int SCREEN_TIME_REQUEST = 1008;
    private static final int ADVANCE_BIRTHDAY_REQUEST = 2001;
    private static final int BIRTHDAY_BASE_REQUEST = 3001; // 3001-3024 for hourly birthday notifications

    // ==================== GOOD MORNING (6:00 AM) ====================
    public static void scheduleGoodMorning(Context context) {
        scheduleDaily(context, GOOD_MORNING_ACTION, GOOD_MORNING_REQUEST, 6, 0);
    }

    // ==================== BREAKFAST (8:00 AM) ====================
    public static void scheduleBreakfast(Context context) {
        scheduleDaily(context, BREAKFAST_ACTION, BREAKFAST_REQUEST, 8, 0);
    }

    // ==================== LUNCH (1:00 PM) ====================
    public static void scheduleLunch(Context context) {
        scheduleDaily(context, LUNCH_ACTION, LUNCH_REQUEST, 13, 0);
    }

    // ==================== MOOD CHECK (6:00 PM) ====================
    public static void scheduleMoodCheck(Context context) {
        scheduleDaily(context, MOOD_CHECK_ACTION, MOOD_CHECK_REQUEST, 18, 0);
    }

    // ==================== FAMILY CARE (7:00 PM) ====================
    public static void scheduleFamilyCare(Context context) {
        scheduleDaily(context, FAMILY_CARE_ACTION, FAMILY_CARE_REQUEST, 19, 0);
    }

    // ==================== DINNER (8:00 PM) ====================
    public static void scheduleDinner(Context context) {
        scheduleDaily(context, DINNER_ACTION, DINNER_REQUEST, 20, 0);
    }

    // ==================== GOOD NIGHT (10:00 PM) ====================
    public static void scheduleGoodNight(Context context) {
        scheduleDaily(context, GOOD_NIGHT_ACTION, GOOD_NIGHT_REQUEST, 22, 0);
    }

    // ==================== SCREEN TIME (11:30 PM) ====================
    public static void scheduleScreenTime(Context context) {
        scheduleDaily(context, SCREEN_TIME_ACTION, SCREEN_TIME_REQUEST, 23, 30);
    }

    // ==================== ADVANCE BIRTHDAY (June 18-24) ====================
    public static void scheduleAdvanceBirthday(Context context) {
        Calendar today = Calendar.getInstance();
        int month = today.get(Calendar.MONTH);
        int day = today.get(Calendar.DAY_OF_MONTH);
        
        // Only schedule if between June 18-24
        if (month == Calendar.JUNE && day >= 18 && day <= 24) {
            scheduleDaily(context, ADVANCE_BIRTHDAY_ACTION, ADVANCE_BIRTHDAY_REQUEST, 9, 0);
        }
    }

    // ==================== BIRTHDAY HOURLY (June 25 only, 12 AM - 11 PM) ====================
    public static void scheduleBirthdayHourly(Context context, int hour) {
        Calendar today = Calendar.getInstance();
        int month = today.get(Calendar.MONTH);
        int day = today.get(Calendar.DAY_OF_MONTH);
        
        // Only schedule if today is June 25
        if (month != Calendar.JUNE || day != 25) {
            return;
        }
        
        // Only schedule hours 0-23 (24 notifications total)
        if (hour < 0 || hour > 23) {
            return;
        }

        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            Log.w(TAG, "AlarmManager is null");
            return;
        }

        Intent intent = new Intent(context, NotificationReceiver.class);
        intent.setAction(BIRTHDAY_ACTION);
        intent.putExtra("hour", hour);

        // Use unique request code for each hour
        int requestCode = BIRTHDAY_BASE_REQUEST + hour;
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.MONTH, Calendar.JUNE);
        calendar.set(Calendar.DAY_OF_MONTH, 25);
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);

        // Only schedule if time is in the future
        if (calendar.getTimeInMillis() > System.currentTimeMillis()) {
            try {
                alarmManager.setAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        calendar.getTimeInMillis(),
                        pendingIntent
                );
                Log.d(TAG, "Scheduled birthday notification for hour " + hour);
            } catch (Exception e) {
                Log.e(TAG, "Failed to schedule birthday notification", e);
            }
        }
    }

    // ==================== SCHEDULE ALL NOTIFICATIONS ====================
    public static void scheduleAllNotifications(Context context) {
        Calendar today = Calendar.getInstance();
        int month = today.get(Calendar.MONTH);
        int day = today.get(Calendar.DAY_OF_MONTH);

        // Always schedule daily notifications
        scheduleGoodMorning(context);
        scheduleBreakfast(context);
        scheduleLunch(context);
        scheduleMoodCheck(context);
        scheduleFamilyCare(context);
        scheduleDinner(context);
        scheduleGoodNight(context);
        scheduleScreenTime(context);

        // Schedule based on date
        if (month == Calendar.JUNE) {
            if (day >= 18 && day <= 24) {
                // Advance Birthday Mode (June 18-24)
                scheduleAdvanceBirthday(context);
            } else if (day == 25) {
                // Birthday Mode (June 25 only)
                // Schedule all 24 hourly notifications
                for (int hour = 0; hour < 24; hour++) {
                    scheduleBirthdayHourly(context, hour);
                }
            }
            // June 26+ is Normal Mode - only daily notifications (already scheduled above)
        }

        Log.d(TAG, "All notifications scheduled for " + day + "/" + (month + 1));
    }

    // ==================== HELPER: Schedule Daily Notification ====================
    private static void scheduleDaily(Context context, String action, int requestCode, int hour, int minute) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            Log.w(TAG, "AlarmManager is null");
            return;
        }

        Intent intent = new Intent(context, NotificationReceiver.class);
        intent.setAction(action);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, 0);

        // If time has passed today, schedule for tomorrow
        if (calendar.getTimeInMillis() <= System.currentTimeMillis()) {
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }

        try {
            alarmManager.setAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    calendar.getTimeInMillis(),
                    pendingIntent
            );
            Log.d(TAG, "Scheduled " + action + " at " + hour + ":" + String.format("%02d", minute));
        } catch (Exception e) {
            Log.e(TAG, "Failed to schedule " + action, e);
        }
    }

    // ==================== CANCEL ALL NOTIFICATIONS ====================
    public static void cancelAllNotifications(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            Log.w(TAG, "AlarmManager is null");
            return;
        }

        // Cancel all daily notifications
        cancelNotification(context, alarmManager, GOOD_MORNING_ACTION, GOOD_MORNING_REQUEST);
        cancelNotification(context, alarmManager, BREAKFAST_ACTION, BREAKFAST_REQUEST);
        cancelNotification(context, alarmManager, LUNCH_ACTION, LUNCH_REQUEST);
        cancelNotification(context, alarmManager, MOOD_CHECK_ACTION, MOOD_CHECK_REQUEST);
        cancelNotification(context, alarmManager, FAMILY_CARE_ACTION, FAMILY_CARE_REQUEST);
        cancelNotification(context, alarmManager, DINNER_ACTION, DINNER_REQUEST);
        cancelNotification(context, alarmManager, GOOD_NIGHT_ACTION, GOOD_NIGHT_REQUEST);
        cancelNotification(context, alarmManager, SCREEN_TIME_ACTION, SCREEN_TIME_REQUEST);
        cancelNotification(context, alarmManager, ADVANCE_BIRTHDAY_ACTION, ADVANCE_BIRTHDAY_REQUEST);

        // Cancel all 24 hourly birthday notifications
        for (int hour = 0; hour < 24; hour++) {
            cancelNotification(context, alarmManager, BIRTHDAY_ACTION, BIRTHDAY_BASE_REQUEST + hour);
        }

        Log.d(TAG, "All notifications cancelled");
    }

    // ==================== HELPER: Cancel Single Notification ====================
    private static void cancelNotification(Context context, AlarmManager alarmManager, String action, int requestCode) {
        Intent intent = new Intent(context, NotificationReceiver.class);
        intent.setAction(action);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        alarmManager.cancel(pendingIntent);
        Log.d(TAG, "Cancelled " + action);
    }
}

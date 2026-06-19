package com.romancestory.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import java.util.Calendar;

public class AlarmScheduler {
    private static final String TAG = "AlarmScheduler";
    
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
    private static final String TEST_RANDOM_ACTION = "TEST_RANDOM";
    
    private static final int GOOD_MORNING_REQUEST = 1001;
    private static final int BREAKFAST_REQUEST = 1002;
    private static final int LUNCH_REQUEST = 1003;
    private static final int MOOD_CHECK_REQUEST = 1004;
    private static final int FAMILY_CARE_REQUEST = 1005;
    private static final int DINNER_REQUEST = 1006;
    private static final int GOOD_NIGHT_REQUEST = 1007;
    private static final int SCREEN_TIME_REQUEST = 1008;
    private static final int ADVANCE_BIRTHDAY_REQUEST = 2001;
    private static final int BIRTHDAY_BASE_REQUEST = 3001;
    private static final int TEST_RANDOM_REQUEST = 9999;

    public static void scheduleAllNotifications(Context context) {
        scheduleDaily(context, GOOD_MORNING_ACTION, GOOD_MORNING_REQUEST, 6, 0);
        scheduleDaily(context, BREAKFAST_ACTION, BREAKFAST_REQUEST, 8, 0);
        scheduleDaily(context, LUNCH_ACTION, LUNCH_REQUEST, 13, 0);
        scheduleDaily(context, MOOD_CHECK_ACTION, MOOD_CHECK_REQUEST, 18, 0);
        scheduleDaily(context, FAMILY_CARE_ACTION, FAMILY_CARE_REQUEST, 19, 0);
        scheduleDaily(context, DINNER_ACTION, DINNER_REQUEST, 20, 0);
        scheduleDaily(context, GOOD_NIGHT_ACTION, GOOD_NIGHT_REQUEST, 22, 0);
        scheduleDaily(context, SCREEN_TIME_ACTION, SCREEN_TIME_REQUEST, 23, 30);

        Calendar today = Calendar.getInstance();
        int month = today.get(Calendar.MONTH);
        int day = today.get(Calendar.DAY_OF_MONTH);

        if (month == Calendar.JUNE) {
            if (day >= 18 && day <= 24) {
                scheduleDaily(context, ADVANCE_BIRTHDAY_ACTION, ADVANCE_BIRTHDAY_REQUEST, 9, 0);
            } else if (day == 25) {
                for (int hour = 0; hour < 24; hour++) {
                    scheduleBirthdayHourly(context, hour);
                }
            }
        }
        scheduleTestMode(context);
    }

    public static void scheduleTestMode(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent intent = new Intent(context, NotificationReceiver.class);
        intent.setAction(TEST_RANDOM_ACTION);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                TEST_RANDOM_REQUEST,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        long triggerTime = System.currentTimeMillis() + (5 * 60 * 1000); // 5 minutes
        
        try {
            alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent);
            Log.d(TAG, "Scheduled TEST_RANDOM in 5 minutes");
        } catch (Exception e) {
            Log.e(TAG, "Failed to schedule TEST_RANDOM", e);
        }
    }

    private static void scheduleDaily(Context context, String action, int requestCode, int hour, int minute) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

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

        if (calendar.getTimeInMillis() <= System.currentTimeMillis()) {
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }

        try {
            alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
        } catch (Exception e) {
            Log.e(TAG, "Failed to schedule " + action, e);
        }
    }

    private static void scheduleBirthdayHourly(Context context, int hour) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent intent = new Intent(context, NotificationReceiver.class);
        intent.setAction(BIRTHDAY_ACTION);
        intent.putExtra("hour", hour);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                BIRTHDAY_BASE_REQUEST + hour,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.MONTH, Calendar.JUNE);
        calendar.set(Calendar.DAY_OF_MONTH, 25);
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);

        if (calendar.getTimeInMillis() > System.currentTimeMillis()) {
            try {
                alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
            } catch (Exception e) {
                Log.e(TAG, "Failed to schedule birthday hour " + hour, e);
            }
        }
    }
}

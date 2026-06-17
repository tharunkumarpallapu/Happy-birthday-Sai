package com.romancestory.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import java.util.Calendar;

public class AlarmScheduler {
    private static final String MORNING_ACTION = "MORNING_NOTIFICATION";
    private static final String NIGHT_ACTION = "NIGHT_NOTIFICATION";
    private static final String BIRTHDAY_ACTION = "BIRTHDAY_NOTIFICATION";
    private static final int MORNING_REQUEST_CODE = 101;
    private static final int NIGHT_REQUEST_CODE = 102;
    private static final int BIRTHDAY_BASE_REQUEST_CODE = 200;

    public static void scheduleMorningNotification(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            return;
        }

        Intent intent = new Intent(context, NotificationReceiver.class);
        intent.setAction(MORNING_ACTION);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                MORNING_REQUEST_CODE,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 7);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);

        if (calendar.getTimeInMillis() <= System.currentTimeMillis()) {
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }

        alarmManager.setAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                calendar.getTimeInMillis(),
                pendingIntent
        );
    }

    public static void scheduleNightNotification(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            return;
        }

        Intent intent = new Intent(context, NotificationReceiver.class);
        intent.setAction(NIGHT_ACTION);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                NIGHT_REQUEST_CODE,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 22);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);

        if (calendar.getTimeInMillis() <= System.currentTimeMillis()) {
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }

        alarmManager.setAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                calendar.getTimeInMillis(),
                pendingIntent
        );
    }

    public static void scheduleBirthdayNotifications(Context context) {
        Calendar today = Calendar.getInstance();
        int month = today.get(Calendar.MONTH);
        int day = today.get(Calendar.DAY_OF_MONTH);

        if (month == Calendar.JUNE && day == 25) {
            scheduleBirthdayNotificationsForToday(context);
        }
    }

    private static void scheduleBirthdayNotificationsForToday(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            return;
        }

        int[] hours = {0, 7, 10, 13, 18, 22};
        int[] minutes = {0, 0, 0, 0, 0, 0};

        for (int i = 0; i < hours.length; i++) {
            Intent intent = new Intent(context, NotificationReceiver.class);
            intent.setAction(BIRTHDAY_ACTION);
            intent.putExtra("messageIndex", i);
            intent.putExtra("isLastMessage", i == hours.length - 1);

            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                    context,
                    BIRTHDAY_BASE_REQUEST_CODE + i,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.MONTH, Calendar.JUNE);
            calendar.set(Calendar.DAY_OF_MONTH, 25);
            calendar.set(Calendar.HOUR_OF_DAY, hours[i]);
            calendar.set(Calendar.MINUTE, minutes[i]);
            calendar.set(Calendar.SECOND, 0);

            if (calendar.getTimeInMillis() > System.currentTimeMillis()) {
                alarmManager.setAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        calendar.getTimeInMillis(),
                        pendingIntent
                );
            }
        }
    }

    public static void cancelAllNotifications(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            return;
        }

        Intent morningIntent = new Intent(context, NotificationReceiver.class);
        morningIntent.setAction(MORNING_ACTION);
        PendingIntent morningPendingIntent = PendingIntent.getBroadcast(
                context,
                MORNING_REQUEST_CODE,
                morningIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        alarmManager.cancel(morningPendingIntent);

        Intent nightIntent = new Intent(context, NotificationReceiver.class);
        nightIntent.setAction(NIGHT_ACTION);
        PendingIntent nightPendingIntent = PendingIntent.getBroadcast(
                context,
                NIGHT_REQUEST_CODE,
                nightIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        alarmManager.cancel(nightPendingIntent);

        for (int i = 0; i < 6; i++) {
            Intent birthdayIntent = new Intent(context, NotificationReceiver.class);
            birthdayIntent.setAction(BIRTHDAY_ACTION);
            PendingIntent birthdayPendingIntent = PendingIntent.getBroadcast(
                    context,
                    BIRTHDAY_BASE_REQUEST_CODE + i,
                    birthdayIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            alarmManager.cancel(birthdayPendingIntent);
        }
    }
}

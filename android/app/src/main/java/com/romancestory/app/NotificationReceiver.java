package com.romancestory.app;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.NotificationCompat;
import java.util.Calendar;
import java.util.Random;

public class NotificationReceiver extends BroadcastReceiver {
    private static final String CHANNEL_ID = "romance_story_notifications";
    private static final int MORNING_NOTIFICATION_ID = 1001;
    private static final int NIGHT_NOTIFICATION_ID = 1002;
    private static final int BIRTHDAY_NOTIFICATION_ID = 2001;

    private static final String[] MORNING_MESSAGES = {
        "🌅 Good Morning Reddy Sai ❤️",
        "💖 Wishing you a beautiful day ahead.",
        "🌸 May your smile shine throughout the day.",
        "☀️ Another wonderful day begins for you.",
        "💌 Thinking of you this morning.",
        "🌹 Hope today brings happiness and peace.",
        "✨ A beautiful morning for a beautiful soul.",
        "❤️ Start your day with confidence and joy."
    };

    private static final String[] NIGHT_MESSAGES = {
        "🌙 Good Night Reddy Sai ❤️",
        "💞 Sleep peacefully and dream beautifully.",
        "✨ May your night be calm and happy.",
        "💖 Sending warm wishes before sleep.",
        "🌌 Sweet dreams and lots of happiness.",
        "🌹 Rest well and wake up smiling.",
        "❤️ Ending the day with love and gratitude.",
        "💫 May tomorrow be even brighter."
    };

    private static final String[] BIRTHDAY_MESSAGES = {
        "🌹 The most special day has finally arrived. Happy Birthday Reddy Sai ❤️ May this year bring endless happiness, love and beautiful memories.",
        "🌅 Good Morning Birthday Girl ❤️ Today is all about your smile, your happiness and your dreams.",
        "🎂 Happy Birthday Reddy Sai ❤️ May every wish you make today find its way into reality.",
        "💖 Just a reminder: You are loved, appreciated and cherished more than words can express.",
        "🎁 May your evening be filled with laughter, joy and unforgettable moments. Happy Birthday once again ❤️",
        "🌙 Good Night Birthday Girl ❤️ As this beautiful day comes to an end, may your heart remain full of happiness and love. Sweet dreams and Happy Birthday."
    };

    private static final String[] BIRTHDAY_POOL = {
        "🎉 Happy Birthday Reddy Sai ❤️",
        "🌹 You deserve every happiness this world can offer.",
        "💖 May your smile never fade and your dreams never stop growing.",
        "✨ You are one of the most precious people in this world.",
        "🎂 Wishing you a year filled with love, success and unforgettable memories.",
        "🎁 May every moment of your birthday be as beautiful as your heart.",
        "💌 Sending endless birthday hugs, happiness and blessings.",
        "🌸 Today is special because you are special.",
        "❤️ Happy Birthday to someone truly amazing.",
        "🌟 May your life shine brighter with every passing year."
    };

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();

        if (action == null) {
            return;
        }

        if (action.equals("MORNING_NOTIFICATION")) {
            showMorningNotification(context);
            AlarmScheduler.scheduleMorningNotification(context);
        } else if (action.equals("NIGHT_NOTIFICATION")) {
            showNightNotification(context);
            AlarmScheduler.scheduleNightNotification(context);
        } else if (action.equals("BIRTHDAY_NOTIFICATION")) {
            showBirthdayNotification(context, intent.getIntExtra("messageIndex", 0));
            if (intent.getBooleanExtra("isLastMessage", false)) {
                AlarmScheduler.scheduleBirthdayNotifications(context);
            }
        }
    }

    private void showMorningNotification(Context context) {
        String message = MORNING_MESSAGES[new Random().nextInt(MORNING_MESSAGES.length)];
        showNotification(context, "Our Story ❤️", message, MORNING_NOTIFICATION_ID);
    }

    private void showNightNotification(Context context) {
        String message = NIGHT_MESSAGES[new Random().nextInt(NIGHT_MESSAGES.length)];
        showNotification(context, "Our Story ❤️", message, NIGHT_NOTIFICATION_ID);
    }

    private void showBirthdayNotification(Context context, int messageIndex) {
        String message;
        if (messageIndex < BIRTHDAY_MESSAGES.length) {
            message = BIRTHDAY_MESSAGES[messageIndex];
        } else {
            message = BIRTHDAY_POOL[new Random().nextInt(BIRTHDAY_POOL.length)];
        }
        showNotification(context, "Our Story ❤️", message, BIRTHDAY_NOTIFICATION_ID + messageIndex);
    }

    private void showNotification(Context context, String title, String message, int notificationId) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText(message)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_REMINDER);

        if (notificationManager != null) {
            notificationManager.notify(notificationId, builder.build());
        }
    }
}

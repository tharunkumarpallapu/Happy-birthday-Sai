package com.romancestory.app;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import com.romance.story.R;
import java.util.Random;

public class NotificationReceiver extends BroadcastReceiver {
    private static final String TAG = "NotificationReceiver";
    private static final String CHANNEL_ID = "romance_story_notifications";
    private static final String PREFS_NAME = "notification_prefs";
    private static final String LAST_MESSAGE_KEY = "last_message_";
    
    private static final int GOOD_MORNING_ID = 1001;
    private static final int BREAKFAST_ID = 1002;
    private static final int LUNCH_ID = 1003;
    private static final int MOOD_CHECK_ID = 1004;
    private static final int FAMILY_CARE_ID = 1005;
    private static final int DINNER_ID = 1006;
    private static final int GOOD_NIGHT_ID = 1007;
    private static final int SCREEN_TIME_ID = 1008;
    private static final int ADVANCE_BIRTHDAY_ID = 2001;
    private static final int BIRTHDAY_ID = 3001;
    private static final int TEST_RANDOM_ID = 9999;

    private static final String[] GOOD_MORNING = {"Good morning Reddy Sai ☀️", "Lechava papa 😅", "Morning sunshine ❤️"};
    private static final String[] BREAKFAST = {"Breakfast ayinda papa? 🍳", "Healthy breakfast thinuko ❤️"};
    private static final String[] LUNCH = {"Lunch ayinda papa? 🍛", "Time ki thinuko papa ❤️"};
    private static final String[] DINNER = {"Dinner ayinda papa? 🍽️", "Time ki thinuko papa 😊"};
    private static final String[] MOOD_CHECK = {"Mood baagundha papa? ❤️", "Antha okayna?"};
    private static final String[] FAMILY_CARE = {"Intlo vallaki call chesava papa? 📞", "Amma tho maatladava? ❤️"};
    private static final String[] GOOD_NIGHT = {"Good night papa ❤️", "Sweet dreams 😴"};
    private static final String[] SCREEN_TIME = {"Phone pakkana petti paduko papa 😴", "Screen time konchem thagginchu ❤️"};
    private static final String[] ADVANCE_BIRTHDAY = {"🎂 Advance Happy Birthday Reddy Sai ❤️", "🎉 Counting days for your special day!"};
    private static final String[] BIRTHDAY_DAY = {"🎂 Happy Birthday Reddy Sai ❤️", "🎉 Many Happy Returns Reddy Sai 🎂"};

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (action == null) return;

        Log.d(TAG, "Received broadcast: " + action);

        String message = "";
        int notificationId = 0;

        switch (action) {
            case "TEST_RANDOM":
                String[][] allPools = {GOOD_MORNING, BREAKFAST, LUNCH, MOOD_CHECK, FAMILY_CARE, DINNER, GOOD_NIGHT, SCREEN_TIME};
                String[] randomPool = allPools[new Random().nextInt(allPools.length)];
                message = "[TEST] " + randomPool[new Random().nextInt(randomPool.length)];
                notificationId = TEST_RANDOM_ID;
                AlarmScheduler.scheduleTestMode(context); // Self-reschedule
                break;
            case "GOOD_MORNING":
                message = getRandomMessage(GOOD_MORNING, "GOOD_MORNING", context);
                notificationId = GOOD_MORNING_ID;
                break;
            case "BREAKFAST":
                message = getRandomMessage(BREAKFAST, "BREAKFAST", context);
                notificationId = BREAKFAST_ID;
                break;
            case "LUNCH":
                message = getRandomMessage(LUNCH, "LUNCH", context);
                notificationId = LUNCH_ID;
                break;
            case "DINNER":
                message = getRandomMessage(DINNER, "DINNER", context);
                notificationId = DINNER_ID;
                break;
            case "MOOD_CHECK":
                message = getRandomMessage(MOOD_CHECK, "MOOD_CHECK", context);
                notificationId = MOOD_CHECK_ID;
                break;
            case "FAMILY_CARE":
                message = getRandomMessage(FAMILY_CARE, "FAMILY_CARE", context);
                notificationId = FAMILY_CARE_ID;
                break;
            case "GOOD_NIGHT":
                message = getRandomMessage(GOOD_NIGHT, "GOOD_NIGHT", context);
                notificationId = GOOD_NIGHT_ID;
                break;
            case "SCREEN_TIME":
                message = getRandomMessage(SCREEN_TIME, "SCREEN_TIME", context);
                notificationId = SCREEN_TIME_ID;
                break;
            case "ADVANCE_BIRTHDAY":
                message = getRandomMessage(ADVANCE_BIRTHDAY, "ADVANCE_BIRTHDAY", context);
                notificationId = ADVANCE_BIRTHDAY_ID;
                break;
            case "BIRTHDAY":
                int hour = intent.getIntExtra("hour", 0);
                message = getRandomMessage(BIRTHDAY_DAY, "BIRTHDAY", context);
                notificationId = BIRTHDAY_ID + hour;
                break;
        }

        if (!message.isEmpty()) {
            showNotification(context, notificationId, message);
        }
    }

    private void showNotification(Context context, int notificationId, String message) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (notificationManager == null) return;

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stat_romance)
                .setContentTitle("Reddy Sai")
                .setContentText(message)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true);

        notificationManager.notify(notificationId, builder.build());
    }

    private String getRandomMessage(String[] messages, String type, Context context) {
        if (messages.length == 0) return "";
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String lastMessage = prefs.getString(LAST_MESSAGE_KEY + type, "");
        String selectedMessage;
        int attempts = 0;
        do {
            selectedMessage = messages[new Random().nextInt(messages.length)];
            attempts++;
        } while (selectedMessage.equals(lastMessage) && attempts < 3 && messages.length > 1);
        prefs.edit().putString(LAST_MESSAGE_KEY + type, selectedMessage).apply();
        return selectedMessage;
    }
}

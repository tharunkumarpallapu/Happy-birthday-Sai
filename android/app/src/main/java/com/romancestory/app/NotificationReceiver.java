package com.romancestory.app;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import androidx.core.app.NotificationCompat;
import java.util.Calendar;
import java.util.Random;

/**
 * Android Native Notification Receiver
 * Handles all notification types with randomized message pools
 * Prevents duplicate consecutive messages
 * Supports 9 notification types with proper scheduling
 */
public class NotificationReceiver extends BroadcastReceiver {
    private static final String CHANNEL_ID = "romance_story_notifications";
    private static final String PREFS_NAME = "notification_prefs";
    private static final String LAST_MESSAGE_KEY = "last_message_";
    
    // Notification Type IDs (non-overlapping ranges)
    private static final int GOOD_MORNING_ID = 1001;
    private static final int BREAKFAST_ID = 1002;
    private static final int LUNCH_ID = 1003;
    private static final int MOOD_CHECK_ID = 1004;
    private static final int FAMILY_CARE_ID = 1005;
    private static final int DINNER_ID = 1006;
    private static final int GOOD_NIGHT_ID = 1007;
    private static final int SCREEN_TIME_ID = 1008;
    private static final int ADVANCE_BIRTHDAY_ID = 2001;
    private static final int BIRTHDAY_ID = 3001; // Base ID for hourly birthday notifications (3001-3024)

    // ==================== MESSAGE POOLS ====================
    
    private static final String[] GOOD_MORNING = {
        "🌅 Good Morning Reddy Sai ❤️",
        "☀️ Rise and shine, beautiful soul!",
        "💖 Wishing you an amazing day ahead",
        "🌸 Good morning to my favorite person",
        "✨ Another beautiful day to cherish",
        "🌹 Wake up with a smile, Reddy Sai",
        "💌 Good morning, my love ❤️",
        "🌟 Let's make today unforgettable"
    };

    private static final String[] BREAKFAST = {
        "🥞 Time for breakfast, Reddy Sai!",
        "🍳 Have you had your breakfast yet?",
        "☕ Start your day with a good meal",
        "🥐 Breakfast is the most important meal",
        "🍎 Fuel your body with good nutrition",
        "🥤 Don't skip breakfast, my love",
        "🍽️ Time to nourish yourself",
        "💪 Eat well to stay healthy and strong"
    };

    private static final String[] LUNCH = {
        "🍽️ Lunch time, Reddy Sai!",
        "🥗 Time for a delicious lunch",
        "🍜 Have you eaten lunch yet?",
        "🥘 Treat yourself to a good meal",
        "🍱 Lunch break is here!",
        "🥙 Eat something healthy and tasty",
        "🍲 Fuel up for the afternoon",
        "🥕 Nourish your body with love"
    };

    private static final String[] MOOD_CHECK = {
        "😊 Mood baagundha, Reddy Sai?",
        "💭 Antha okayna?",
        "😔 Low ga feel avuthunnava?",
        "🤔 Emaina problem undha?",
        "💫 How are you feeling today?",
        "🌈 Share your feelings with me",
        "💝 I'm here for you always",
        "🎭 What's on your mind today?"
    };

    private static final String[] FAMILY_CARE = {
        "📞 Intlo vallaki call cheyyi",
        "👨‍👩‍👧 Amma nanna tho maatladu",
        "🏠 Lonely ga undaku",
        "❤️ Family is everything",
        "👪 Check on your loved ones",
        "💬 Call your parents today",
        "🤗 Share your day with family",
        "🏡 Family time is precious"
    };

    private static final String[] DINNER = {
        "🍽️ Dinner time, Reddy Sai!",
        "🥘 What's for dinner tonight?",
        "🍜 Time for a good dinner",
        "🥗 Have you eaten dinner yet?",
        "🍲 Treat yourself to something special",
        "🥙 End your day with a good meal",
        "🍱 Dinner is ready!",
        "🥕 Eat well and sleep well"
    };

    private static final String[] GOOD_NIGHT = {
        "🌙 Good Night Reddy Sai ❤️",
        "💤 Sleep peacefully, my love",
        "✨ Sweet dreams await you",
        "🌟 Rest well and recharge",
        "💫 Good night, beautiful soul",
        "🌌 May your sleep be peaceful",
        "😴 Sleep tight, Reddy Sai",
        "🛌 Dream of beautiful things"
    };

    private static final String[] SCREEN_TIME = {
        "📱 Phone pakkana petti paduko",
        "⏰ Screen time reduce cheyyi",
        "😴 Put your phone away",
        "👀 Give your eyes some rest",
        "🌙 Time to disconnect",
        "📵 Phone down, sleep time",
        "💤 Let's get some good sleep",
        "🧘 Relax without your phone"
    };

    private static final String[] ADVANCE_BIRTHDAY = {
        "🎉 Just a few days until your birthday, Reddy Sai!",
        "🎂 Counting down to your special day",
        "🎁 Your birthday is almost here, Reddy Sai!",
        "🌹 Soon it will be your day to shine",
        "💖 Getting excited for Reddy Sai's birthday",
        "✨ Your special day is coming soon",
        "🎊 Preparing to celebrate you, Reddy Sai",
        "🌟 The countdown to your birthday begins"
    };

    private static final String[] BIRTHDAY = {
        "🎉 Happy Birthday Reddy Sai ❤️ May this year bring endless happiness and love",
        "🌹 You deserve every happiness this world can offer, Reddy Sai",
        "💖 May your smile never fade, Reddy Sai",
        "✨ You are one of the most precious people in this world",
        "🎂 Wishing you a year filled with love and success, Reddy Sai",
        "🎁 May every moment of your birthday be beautiful, Reddy Sai",
        "💌 Sending endless birthday blessings to you, Reddy Sai",
        "🌸 Today is special because you are special, Reddy Sai",
        "❤️ Happy Birthday to someone truly amazing, Reddy Sai",
        "🌟 May your life shine brighter, Reddy Sai",
        "🎊 Celebrating the beautiful soul that is Reddy Sai",
        "💝 You make every day special, Happy Birthday Reddy Sai",
        "🌈 Your birthday is a celebration of you, Reddy Sai",
        "🎈 Wishing you joy and laughter, Reddy Sai",
        "🎀 You are loved more than words can say, Reddy Sai",
        "💫 Another year older, more beautiful, Reddy Sai",
        "🌺 May your dreams come true, Reddy Sai",
        "🎵 Celebrating the music of your life, Reddy Sai",
        "🎭 You are the star of today, Reddy Sai",
        "🎪 Let's make this birthday unforgettable, Reddy Sai",
        "🏆 You deserve the world, Reddy Sai",
        "👑 Happy Birthday to my queen, Reddy Sai",
        "💎 You are precious beyond measure, Reddy Sai",
        "🌠 Wishing you a magical birthday, Reddy Sai"
    };

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (action == null) return;

        switch (action) {
            case "GOOD_MORNING":
                showNotification(context, "Our Story ❤️", getRandomMessage(GOOD_MORNING, context, "morning"), GOOD_MORNING_ID);
                AlarmScheduler.scheduleGoodMorning(context);
                break;
            case "BREAKFAST":
                showNotification(context, "Our Story ❤️", getRandomMessage(BREAKFAST, context, "breakfast"), BREAKFAST_ID);
                AlarmScheduler.scheduleBreakfast(context);
                break;
            case "LUNCH":
                showNotification(context, "Our Story ❤️", getRandomMessage(LUNCH, context, "lunch"), LUNCH_ID);
                AlarmScheduler.scheduleLunch(context);
                break;
            case "MOOD_CHECK":
                showNotification(context, "Our Story ❤️", getRandomMessage(MOOD_CHECK, context, "mood"), MOOD_CHECK_ID);
                AlarmScheduler.scheduleMoodCheck(context);
                break;
            case "FAMILY_CARE":
                showNotification(context, "Our Story ❤️", getRandomMessage(FAMILY_CARE, context, "family"), FAMILY_CARE_ID);
                AlarmScheduler.scheduleFamilyCare(context);
                break;
            case "DINNER":
                showNotification(context, "Our Story ❤️", getRandomMessage(DINNER, context, "dinner"), DINNER_ID);
                AlarmScheduler.scheduleDinner(context);
                break;
            case "GOOD_NIGHT":
                showNotification(context, "Our Story ❤️", getRandomMessage(GOOD_NIGHT, context, "night"), GOOD_NIGHT_ID);
                AlarmScheduler.scheduleGoodNight(context);
                break;
            case "SCREEN_TIME":
                showNotification(context, "Our Story ❤️", getRandomMessage(SCREEN_TIME, context, "screen"), SCREEN_TIME_ID);
                AlarmScheduler.scheduleScreenTime(context);
                break;
            case "ADVANCE_BIRTHDAY":
                showNotification(context, "Our Story ❤️", getRandomMessage(ADVANCE_BIRTHDAY, context, "adv_birthday"), ADVANCE_BIRTHDAY_ID);
                AlarmScheduler.scheduleAdvanceBirthday(context);
                break;
            case "BIRTHDAY":
                int hour = intent.getIntExtra("hour", 0);
                showNotification(context, "Our Story ❤️", getRandomMessage(BIRTHDAY, context, "birthday"), BIRTHDAY_ID + hour);
                if (hour < 23) {
                    AlarmScheduler.scheduleBirthdayHourly(context, hour + 1);
                }
                break;
        }
    }

    /**
     * Get random message from pool, preventing consecutive duplicates
     */
    private String getRandomMessage(String[] messages, Context context, String type) {
        if (messages.length == 0) return "Our Story ❤️";
        
        Random random = new Random();
        String message;
        String lastMessage = getLastMessage(context, type);
        
        do {
            message = messages[random.nextInt(messages.length)];
        } while (message.equals(lastMessage) && messages.length > 1);
        
        saveLastMessage(context, type, message);
        return message;
    }

    /**
     * Get last message from SharedPreferences
     */
    private String getLastMessage(Context context, String type) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getString(LAST_MESSAGE_KEY + type, "");
    }

    /**
     * Save last message to SharedPreferences
     */
    private void saveLastMessage(Context context, String type, String message) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(LAST_MESSAGE_KEY + type, message).apply();
    }

    /**
     * Show notification with proper formatting
     */
    private void showNotification(Context context, String title, String message, int notificationId) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, notificationId, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

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

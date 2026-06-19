package com.romancestory.app;
import android.util.Log;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import androidx.core.app.NotificationCompat;
import com.romance.story.R;
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

    // ==================== CUSTOM MESSAGE POOLS ====================
    
    private static final String[] GOOD_MORNING = {
        "Good morning Reddy Sai ☀️",
        "Lechava papa 😅",
        "Rise and shine 🌞",
        "Morning sunshine ❤️",
        "New day start ayyindhi 😊",
        "Nidra bagundha papa?",
        "Water thagi fresh avvu 💧",
        "Breakfast miss cheyyaku 🍳",
        "Today smile marchipoku 😊",
        "Happy ga start cheyyi eeroju ni ❤️",
        "Good vibes matrame today ✨",
        "Fresh ga ready avvu papa",
        "Phone charge undho chusko 🔋",
        "Time ki ready avvu 😄",
        "Healthy ga start cheddam",
        "Eeroju bagundali ani korukuntunna ❤️",
        "Coffee ayinda papa ☕",
        "Tea tho day start chesthunava? ☕",
        "Positive ga alochinchu 🌸",
        "Morning hugs from far away 🤗",
        "Lechi konchem stretch cheyyi 💪",
        "Water first, phone later 😄",
        "Queue line gurthu undha? 😅",
        "Smile tho start cheyyi eeroju ni 😊",
        "Sunshine kanna bright ga undu ☀️",
        "Papa jagratha ga ready avvu",
        "Healthy breakfast thinuko ❤️",
        "Good morning beautiful soul 🌷",
        "New opportunities waiting today ✨",
        "Fresh mind tho day start cheyyi",
        "Alarm tho fight ayinda? 😄",
        "Morning energy maintain cheyyi 💪",
        "Lechi curtains open cheyyi ☀️",
        "Morning breeze enjoy cheyyi 🌿",
        "Today kuda nuvvu super ❤️",
        "Phone pakkana petti ready avvu 😄",
        "Happy thoughts tho start cheyyi",
        "Smile because it is a new day 😊",
        "Morning reminder: take care ❤️",
        "Breakfast skip cheyyaku papa",
        "Today ni enjoy cheyyi 🌸",
        "Morning motivation ready aa? 😄",
        "Papa hydration important 💧",
        "Lechi konchem walk cheyyi 🚶",
        "Peaceful morning wishes ❤️",
        "Good morning and take care ☀️",
        "Fresh ga feel avuthunnava?",
        "Today stress takkuva undali ❤️",
        "Morning blessings to you 🌷",
        "Have a lovely day Reddy Sai ❤️"
    };

    private static final String[] BREAKFAST = {
        "Breakfast ayinda papa? 🍳",
        "Morning nundi thinakunda undaku.",
        "Healthy breakfast thinuko ❤️",
        "Breakfast skip cheyyaku.",
        "Water kuda thagu 💧",
        "Food first, migatha anni tharvatha 😄",
        "Energy kosam breakfast important.",
        "Konchem fruits kuda thinava? 🍎",
        "Breakfast reminder papa 😊",
        "Empty stomach tho undaku.",
        "Healthy ga start cheyyi day ni 🌞",
        "Protein emaina thinava? 💪",
        "Time ki breakfast cheyyi.",
        "Busy ayina breakfast miss cheyyaku.",
        "Good food = good mood ❤️",
        "Breakfast ayyaka water marchipoku.",
        "Papa care teesuko 😌",
        "Healthy habits maintain cheyyi 🌿",
        "Breakfast complete chesthe energy untundhi 😄",
        "Morning meal important papa ❤️"
    };

    private static final String[] LUNCH = {
        "Lunch ayinda papa? 🍛",
        "Lunch skip cheyyaledhu kada?",
        "Food bagundha? 😊",
        "Water thagava? 💧",
        "Busy ayina lunch miss cheyyaku.",
        "Time ki thinuko papa ❤️",
        "Healthy ga lunch cheyyi.",
        "Rice thinava? 🍚",
        "Lunch tarvatha konchem rest teesuko.",
        "Body ki fuel kavali kada 😄",
        "Papa take care ❤️",
        "Afternoon energy maintain cheyyali 💪",
        "Food first, work later 😄",
        "Lunch reminder 🌸",
        "Konchem vegetables kuda thinava? 🥗",
        "Lunch complete ayyaka water thagu.",
        "Lunch break enjoy cheyyi 😊",
        "Health important papa ❤️",
        "Afternoon lo tired avvakudadhu kada 😄",
        "Lunch miss cheyyaku papa 🍛"
    };

    private static final String[] DINNER = {
        "Dinner ayinda papa? 🍽️",
        "Dinner skip cheyyaku ❤️",
        "Time ki thinuko papa 😊",
        "Night food important kada 😄",
        "Food ayyaka water kuda thagu 💧",
        "Healthy ga dinner cheyyi 🌿",
        "Papa, empty stomach tho padukoku.",
        "Dinner reminder ❤️",
        "Rice thinava? 🍚",
        "Dinner complete ayyaka relax avvu.",
        "Body ki energy kavali kada 😊",
        "Healthy food choose cheyyi.",
        "Take care papa ❤️",
        "Night meal miss cheyyaku.",
        "Dinner ayyaka konchem walk cheyyi 🚶",
        "Food first, sleep later 😄",
        "Konchem fruits kuda thinava? 🍎",
        "Papa jagratha ga thinuko.",
        "Good food, good sleep 😴",
        "Dinner complete cheyyi papa ❤️"
    };

    private static final String[] MOOD_CHECK = {
        "Mood baagundha papa? ❤️",
        "Antha okayna?",
        "Low ga feel avuthunnava?",
        "Eeroju ela gadichindhi?",
        "Need anything today? 😊",
        "Smile chesthunava? 🌸",
        "Stress ekkuva teesukoku.",
        "Everything alright papa?",
        "Konchem tired ga unnava?",
        "Manasu bagundha? ❤️",
        "Overthink cheyyaku papa.",
        "Eeroju happy moments emaina unnaya? 😊",
        "Nee gurinchi care chese vallam unnaru ❤️",
        "Konchem relax avvu.",
        "Work stress ekkuva undha?",
        "Mind ki rest ivvu 🌿",
        "Anni okay aipothayi ❤️",
        "Need a small break? 😌",
        "Happy ga undalani korukuntunna.",
        "Papa, nuvvu okay ga unnava?",
        "Emaina matladali anipistundha?",
        "Today konchem hectic ga undha?",
        "Take care of your heart ❤️",
        "Konchem smile cheyyi 😊",
        "Low ga feel ayithe lonely ga undaku.",
        "Eeroju best part enti? 🌸",
        "Nee health kuda important ❤️",
        "Konchem deep breath teesuko 😌",
        "Rest konchem help chestundhi.",
        "Mind calm ga unchuko 🌿",
        "Need some positivity today? ✨",
        "Everything doesn't need to be perfect ❤️",
        "Papa, nee smile valuable 😊",
        "Konchem self-care time teesuko.",
        "Emaina burden ga anipistundha?",
        "You are doing your best ❤️",
        "Take things slowly today.",
        "Need a little encouragement? 🌷",
        "Remember to be kind to yourself ❤️",
        "Mood check-in papa 😊"
    };

    private static final String[] FAMILY_CARE = {
        "Intlo vallaki call chesava papa? 📞",
        "Amma tho maatladava? ❤️",
        "Nanna ki call cheyyi konchem 😊",
        "Family tho konchem time spend cheyyi.",
        "Lonely ga undaku papa ❤️",
        "Amma voice vinthe baguntundhi kada 😊",
        "Nanna ela unnaro adugu.",
        "Intlo andharu bagunnara ani adugu ❤️",
        "Family care important 🌸",
        "Call cheyyadaniki 5 mins chalu 😄",
        "Papa, intiki call cheyyi.",
        "Family ni miss avuthunnava?",
        "Konchem Amma tho matladithe manasu light avuthundhi ❤️",
        "Nanna advice eppudu useful 😄",
        "Family support valuable ❤️",
        "Intlo vallaki good evening cheppu 😊",
        "Family tho touch lo undu.",
        "Amma ki water thagava ani adugu 😄",
        "Nanna busy ga unnara ani adugu.",
        "Family smiles are special ❤️",
        "Papa, call cheyyadam marchipoku.",
        "Konchem video call cheyyava? 📱",
        "Family ni gurthu chesukoni smile cheyyi 😊",
        "Intiki call chesi happy ga undu ❤️",
        "Lonely feeling vasthe family tho maatladu.",
        "Family ki nee voice vinadam ishtam ❤️",
        "Konchem Amma Nanna tho navvu 😄",
        "Home memories gurthu vastunnaya? 🌸",
        "Family first papa ❤️",
        "Call reminder 📞❤️"
    };

    private static final String[] GOOD_NIGHT = {
        "Good night papa ❤️",
        "Sweet dreams 😴",
        "Paduko papa, rest important.",
        "Phone pakkana petti nidra po 😊",
        "Eeroju bagane complete chesav ❤️",
        "Aalisipoyi untav kada, rest teesuko.",
        "Night ekkuva alochinchaku 🌙",
        "Repu malli fresh ga start cheddam ✨",
        "Nidra sarigga pattali papa 😴",
        "Mind ki kuda rest kavali ❤️",
        "Take care and sleep well 🌸",
        "Good night Reddy Sai ❤️",
        "Dreams beautiful ga undali ✨",
        "Room light off chesi paduko 😄",
        "Peaceful sleep wishes ❤️",
        "Nidra mundhu water konchem thagu 💧",
        "Today stress anni vadilesey 🌙",
        "Happy thoughts tho paduko 😊",
        "Tomorrow kuda manchi roju untundhi ❤️",
        "Sleep tight papa 😴",
        "Rest mode ON cheyyi 😄",
        "Pillow waiting for you 😴",
        "Body ki rest ivvu papa ❤️",
        "Konchem relax ayyi paduko 🌸",
        "Smile tho nidra po 😊",
        "Good night and sweet dreams ❤️",
        "Mind calm ga unchuko 🌿",
        "Rest teesukunte repu energy untundhi 💪",
        "Padukune time ayipoyindhi 😄",
        "Nidra best recharge ❤️",
        "Night breeze enjoy chesi paduko 🌙",
        "Care teesuko papa ❤️",
        "Peaceful night wishes ✨",
        "Stress free sleep kavali 😊",
        "Room silent ga unda? 😄",
        "Tomorrow gurinchi repu alochiddam ❤️",
        "Sleep first, migatha anni tharvatha 😴",
        "Comfortable ga paduko papa 🌸",
        "Good night beautiful soul ❤️",
        "Nuvvu important, rest kuda important 😊",
        "Relax and sleep well 🌙",
        "Warm wishes before sleep ❤️",
        "Blanket cover chesuko 😄",
        "Face wash chesi paduko 😊",
        "Night hugs from far away 🤗",
        "Dream big, sleep peacefully ✨",
        "Safe ga unnav ani korukuntunna ❤️",
        "Tomorrow ni smile tho start cheyyi 😊",
        "Take complete rest papa 😴",
        "Good night and take care ❤️"
    };

    private static final String[] SCREEN_TIME = {
        "Phone pakkana petti paduko papa 😴",
        "Screen time konchem thagginchu ❤️",
        "Reels repu kuda untayi 😄",
        "Sleep important papa 🌙",
        "Inka melukoni unnava? 😅",
        "Night scrolling stop cheddama? 😊",
        "Eyes ki rest ivvu 👀",
        "Phone ki kuda break ivvu 😄",
        "Nidra body ki important ❤️",
        "Screen off, dreams on ✨",
        "Late night scrolling vaddu papa.",
        "Rest teesuko, repu fresh ga untav 😊",
        "Phone brightness tagginchu 🌙",
        "Konchem digital detox cheddam 😄",
        "Mind calm ga untundhi sleep chesthe ❤️",
        "Notifications repu chudachu 😊",
        "Night mode lo paduko 😴",
        "Screen kanna sleep valuable ❤️",
        "Papa, phone charge petti paduko 🔋",
        "Midnight ayindhi, rest time 😄",
        "Sleep schedule maintain cheyyi 🌸",
        "Blue light ki break ivvu 👀",
        "Scrolling ki end undadhu 😅",
        "Paduko papa, tomorrow awaits ❤️",
        "Good night, screen off 😴"
    };

    private static final String[] ADVANCE_BIRTHDAY = {
        "🎂 Advance Happy Birthday Reddy Sai ❤️",
        "🎉 Few more days left Reddy Sai.",
        "🎈 Birthday daggara paduthundhi Reddy Sai.",
        "🎁 Counting days for your special day Reddy Sai.",
        "🎂 Birthday month vibes Reddy Sai ❤️",
        "🎉 Advance wishes Reddy Sai.",
        "🎈 Your special day is getting closer Reddy Sai.",
        "🎁 Excited for your birthday Reddy Sai ❤️",
        "🎂 Happy advance birthday Reddy Sai.",
        "🎉 Another day closer to your birthday Reddy Sai.",
        "🎈 Waiting for June 25 Reddy Sai 😄",
        "🎁 Birthday countdown started Reddy Sai.",
        "🎂 Cake ready aa Reddy Sai? 😅",
        "🎉 Smile, your birthday is coming Reddy Sai.",
        "🎈 Just a little more wait Reddy Sai.",
        "🎁 Hope your birthday becomes memorable Reddy Sai.",
        "🎂 Advance birthday hugs Reddy Sai ❤️",
        "🎉 Looking forward to your smile on birthday Reddy Sai.",
        "🎈 Birthday excitement increasing Reddy Sai.",
        "🎁 June 25 is waiting for you Reddy Sai.",
        "🎂 Advance Happy Birthday dear Reddy Sai ❤️",
        "🎉 Wishing happiness in advance Reddy Sai.",
        "🎈 One step closer to your birthday Reddy Sai.",
        "🎁 Countdown continues Reddy Sai.",
        "🎂 Special wishes for special Reddy Sai.",
        "🎉 Hope you are excited Reddy Sai.",
        "🎈 Birthday vibes around you Reddy Sai.",
        "🎁 Advance celebrations loading Reddy Sai.",
        "🎂 A beautiful day is coming Reddy Sai.",
        "🎉 Keep smiling Reddy Sai, birthday soon.",
        "🎈 Birthday week feels better because of you Reddy Sai.",
        "🎁 Advance wishes with lots of care Reddy Sai.",
        "🎂 Looking forward to June 25 Reddy Sai.",
        "🎉 Birthday happiness loading Reddy Sai.",
        "🎈 Soon it will be your day Reddy Sai.",
        "🎁 Advance birthday love for Reddy Sai.",
        "🎂 Counting smiles until your birthday Reddy Sai.",
        "🎉 Your special day is almost here Reddy Sai.",
        "🎈 Advance birthday reminder Reddy Sai.",
        "🎁 Waiting for birthday cake photos Reddy Sai 😄"
    };

    private static final String[] BIRTHDAY_DAY = {
        "🎂 Happy Birthday Reddy Sai ❤️",
        "🎉 Many Happy Returns Reddy Sai 🎂",
        "🎈 Today is your special day Reddy Sai ❤️",
        "🎁 Wishing you endless happiness Reddy Sai.",
        "🌸 Happy Birthday beautiful Reddy Sai.",
        "✨ May your smile shine brighter today Reddy Sai.",
        "🎂 Enjoy every moment of your birthday Reddy Sai.",
        "🎉 Hope your day is filled with joy Reddy Sai.",
        "🎈 Another beautiful year begins Reddy Sai.",
        "🎁 Best wishes for a wonderful year ahead Reddy Sai.",
        "🎂 Happy Birthday Reddy Sai, stay blessed ❤️",
        "🎉 Celebrate yourself today Reddy Sai.",
        "🎈 Your day has finally arrived Reddy Sai.",
        "🎁 Hope all your wishes come true Reddy Sai.",
        "🌷 Sending birthday smiles to Reddy Sai.",
        "✨ You deserve all the happiness today Reddy Sai.",
        "🎂 Have an amazing birthday Reddy Sai.",
        "🎉 May today be unforgettable Reddy Sai.",
        "🎈 Birthday hugs for Reddy Sai 🤗",
        "🎁 Enjoy your special moments Reddy Sai.",
        "🎂 Cheers to you Reddy Sai.",
        "🎉 Happiness looks good on you Reddy Sai.",
        "🎈 Keep smiling today Reddy Sai.",
        "🎁 A special day for a special person Reddy Sai.",
        "🌸 Wishing peace and happiness to Reddy Sai.",
        "✨ May this year bring beautiful memories Reddy Sai.",
        "🎂 Hope your birthday is magical Reddy Sai.",
        "🎉 Best birthday vibes to Reddy Sai.",
        "🎈 Today belongs to you Reddy Sai.",
        "🎁 Birthday blessings coming your way Reddy Sai.",
        "🎂 Another year, another reason to celebrate Reddy Sai.",
        "🎉 Hope your heart feels happy today Reddy Sai.",
        "🎈 May your dreams grow bigger Reddy Sai.",
        "🎁 Enjoy every smile today Reddy Sai.",
        "🌸 Birthday joy for Reddy Sai.",
        "✨ May your day be filled with love Reddy Sai.",
        "🎂 Happy moments only today Reddy Sai.",
        "🎉 Keep shining Reddy Sai.",
        "🎈 Wishing lots of laughter to Reddy Sai.",
        "🎁 Have a memorable birthday Reddy Sai.",
        "🎂 Happy Birthday Reddy Sai, enjoy your cake 🍰",
        "🎉 A day full of happiness for Reddy Sai.",
        "🎈 Birthday magic is here Reddy Sai.",
        "🎁 Celebrate every little moment Reddy Sai.",
        "🌸 Sending warm wishes to Reddy Sai.",
        "✨ Hope this birthday becomes your favorite one Reddy Sai.",
        "🎂 Smile more today Reddy Sai.",
        "🎉 A beautiful celebration for Reddy Sai.",
        "🎈 Happiness and success to Reddy Sai.",
        "🎁 Wishing you positivity Reddy Sai.",
        "🎂 Birthday wishes wrapped with care Reddy Sai.",
        "🎉 Keep making beautiful memories Reddy Sai.",
        "🎈 May today feel extra special Reddy Sai.",
        "🎁 Wishing joy, peace and success Reddy Sai.",
        "🌸 Happy Birthday once again Reddy Sai.",
        "✨ Your smile deserves a celebration Reddy Sai.",
        "🎂 Enjoy your birthday vibes Reddy Sai.",
        "🎉 Lots of happiness for Reddy Sai.",
        "🎈 Hope today brings wonderful surprises Reddy Sai.",
        "🎁 Stay happy always Reddy Sai.",
        "🎂 Happy Birthday superstar Reddy Sai.",
        "🎉 Make beautiful memories today Reddy Sai.",
        "🎈 Hope today feels magical Reddy Sai.",
        "🎁 Sending positive birthday energy Reddy Sai.",
        "🌸 Have a lovely birthday Reddy Sai.",
        "✨ Another chapter begins Reddy Sai.",
        "🎂 Best wishes today and always Reddy Sai.",
        "🎉 Wishing sunshine and smiles Reddy Sai.",
        "🎈 Enjoy every second today Reddy Sai.",
        "🎁 Birthday blessings for Reddy Sai.",
        "🎂 Happy Birthday dear Reddy Sai.",
        "🎉 A celebration made just for you Reddy Sai.",
        "🎈 Hope today is amazing Reddy Sai.",
        "🎁 Birthday happiness unlocked Reddy Sai.",
        "🌸 Smile, it is your day Reddy Sai.",
        "✨ Keep shining bright Reddy Sai.",
        "🎂 Have a joyful birthday Reddy Sai.",
        "🎉 Sending lots of birthday cheer Reddy Sai.",
        "🎈 Enjoy the attention today Reddy Sai 😄",
        "🎁 You deserve the best Reddy Sai.",
        "🎂 Wishing success and happiness Reddy Sai.",
        "🎉 Enjoy every cake bite today Reddy Sai 🍰",
        "🎈 A beautiful birthday for Reddy Sai.",
        "🎁 Happy Birthday and take care Reddy Sai.",
        "🌸 May your heart stay happy Reddy Sai.",
        "✨ Wishing positivity throughout the year Reddy Sai.",
        "🎂 Another year of greatness Reddy Sai.",
        "🎉 Hope your day is full of smiles Reddy Sai.",
        "🎈 Birthday sparkle for Reddy Sai.",
        "🎁 Celebrate big today Reddy Sai.",
        "🎂 Happy Birthday Reddy Sai ❤️🎉",
        "🎉 Stay blessed and happy Reddy Sai.",
        "🎈 Wishing love and laughter Reddy Sai.",
        "🎁 Hope this year treats you kindly Reddy Sai.",
        "🌸 A special birthday wish for Reddy Sai.",
        "✨ May your dreams come true Reddy Sai.",
        "🎂 Keep smiling forever Reddy Sai.",
        "🎉 Enjoy your special day Reddy Sai.",
        "🎈 Wishing a wonderful year ahead Reddy Sai.",
        "🎁 Happy Birthday Reddy Sai 🎂❤️"
    };

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.e("TEST_ALARM", "FIRED");
        showNotification(context, 9999, "ALARM RECEIVED");
        String action = intent.getAction();

        if ("TEST_RANDOM".equals(action)) {

            String[][] pools = {
                GOOD_MORNING,
                BREAKFAST,
                LUNCH,
                MOOD_CHECK,
                FAMILY_CARE,
                DINNER,
                GOOD_NIGHT
            };

            Random random = new Random();

            String[] selectedPool =
                    pools[random.nextInt(pools.length)];

            String message =
                    selectedPool[random.nextInt(selectedPool.length)];

            showNotification(
                    context,
                    9998,
                    message
            );

            return;
        }
        if (action == null) {
        }

        String message = "";
        int notificationId = 0;

        // Determine which notification type and select random message
        switch (action) {
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
            AlarmScheduler.scheduleAllNotifications(context);
        }
    }



    /**
     * Display notification
     */
    private void showNotification(Context context, int notificationId, String message) {
        NotificationManager notificationManager = 
            (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        if (notificationManager != null) {
            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(R.drawable.ic_stat_romance)
                    .setContentTitle("Reddy Sai")
                    .setContentText(message)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setAutoCancel(true);

            notificationManager.notify(notificationId, builder.build());
        }
    }

    /**
     * Get SharedPreferences for storing last messages
     */
    private SharedPreferences getSharedPreferences() {
        // Context will be available during onReceive
        // This is a placeholder - actual context passed in onReceive
        return null;
    }

    /**
     * Overloaded method to get random message with context
     */
    private String getRandomMessage(String[] messages, String type, Context context) {
        if (messages.length == 0) {
            return "";
        }

        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String lastMessage = prefs.getString(LAST_MESSAGE_KEY + type, "");
        
        Random random = new Random();
        String selectedMessage;
        
        // Try to avoid duplicate consecutive messages
        int attempts = 0;
        do {
            selectedMessage = messages[random.nextInt(messages.length)];
            attempts++;
        } while (selectedMessage.equals(lastMessage) && attempts < 3 && messages.length > 1);

        // Save as last message
        prefs.edit().putString(LAST_MESSAGE_KEY + type, selectedMessage).apply();

        return selectedMessage;
    }
}

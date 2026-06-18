/**
 * Comprehensive Notification Message Pool
 * All messages for Reddy Sai's romantic notification system
 * 9 notification types with randomization and duplicate prevention
 */

export interface NotificationMessagePool {
  goodMorning: string[];
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  moodCheck: string[];
  familyReminder: string[];
  goodNight: string[];
  screenTime: string[];
  advanceBirthdayWishes: string[];
  birthdayWishes: string[];
}

export const NOTIFICATION_MESSAGES: NotificationMessagePool = {
  // 1. Good Morning (6:00 AM)
  goodMorning: [
    '🌅 Good Morning Reddy Sai ❤️',
    '☀️ Rise and shine, my love ❤️',
    '🌞 Good Morning to the most beautiful person ❤️',
    '💕 Wake up to a beautiful day, Reddy Sai ❤️',
    '✨ Morning brings new hopes with you ❤️',
    '🌸 Good Morning, my sweetheart ❤️',
    '💖 Start your day with a smile, Reddy Sai ❤️',
    '🌺 Good Morning, my everything ❤️',
    '🎀 Rise up and conquer the day, my love ❤️',
    '🌟 Good Morning to my heart ❤️',
    '💝 Every morning is special with you ❤️',
    '🌈 Good Morning, Reddy Sai ❤️',
  ],

  // 2. Breakfast Reminder (8:00 AM)
  breakfast: [
    '🥗 Breakfast time, Reddy Sai ❤️',
    '☕ Start your day with a healthy breakfast ❤️',
    '🥞 Don\'t skip breakfast, my love ❤️',
    '🍳 Time for some nutritious breakfast ❤️',
    '🥐 Fuel your body with a good breakfast ❤️',
    '🍎 Eat well, stay healthy, Reddy Sai ❤️',
    '🥤 Have your breakfast and coffee ❤️',
    '🍞 Breakfast is the most important meal ❤️',
    '🥛 Nourish yourself with breakfast ❤️',
    '🌾 Healthy breakfast = healthy you ❤️',
  ],

  // 3. Lunch Reminder (1:00 PM)
  lunch: [
    '🍱 Lunch time, Reddy Sai ❤️',
    '🥙 Time for a delicious lunch ❤️',
    '🍜 Lunch break - take care of yourself ❤️',
    '🍛 Eat your lunch and recharge ❤️',
    '🥗 Healthy lunch for a healthy you ❤️',
    '🍲 Lunch time is self-care time ❤️',
    '🥘 Enjoy your lunch, my love ❤️',
    '🍽️ Midday meal time ❤️',
    '🥙 Fuel up with a good lunch ❤️',
    '🍱 Take a break and eat well ❤️',
  ],

  // 4. Dinner Reminder (8:00 PM)
  dinner: [
    '🍜 Dinner time, Reddy Sai ❤️',
    '🍽️ Time for a delicious dinner ❤️',
    '🥘 Enjoy your dinner, my love ❤️',
    '🍛 Dinner is ready for you ❤️',
    '🥗 Healthy dinner for a good night ❤️',
    '🍲 End your day with a good meal ❤️',
    '🍱 Dinner time - nourish yourself ❤️',
    '🥙 Eat well and rest well ❤️',
    '🍞 Dinner brings families together ❤️',
    '🍴 Time to relax and enjoy dinner ❤️',
  ],

  // 5. Mood Check (6:00 PM)
  moodCheck: [
    '😊 Mood baagundha, Reddy Sai? ❤️',
    '💭 Antha okayna? ❤️',
    '😔 Low ga feel avuthunnava? ❤️',
    '🤔 Emundhi, my love? ❤️',
    '💕 How are you feeling today? ❤️',
    '😌 Everything okay, Reddy Sai? ❤️',
    '🌟 Smile for me, my love ❤️',
    '💖 I\'m here for you always ❤️',
    '🎀 Tell me what\'s on your mind ❤️',
    '✨ You\'re stronger than you think ❤️',
    '🌈 Every moment with you is precious ❤️',
    '💝 I care about how you feel ❤️',
  ],

  // 6. Family Reminder (7:00 PM)
  familyReminder: [
    '📞 Intlo vallaki call chesi maatladu ❤️',
    '👨‍👩‍👧 Amma nanna tho maatladu ❤️',
    '💕 Lonely ga undaku ❤️',
    '👪 Family time is important ❤️',
    '📱 Call your parents, my love ❤️',
    '💬 Connect with your family ❤️',
    '🏠 Home is where the heart is ❤️',
    '👨‍👩‍👧‍👦 Spend time with loved ones ❤️',
    '💖 Family bonds are precious ❤️',
    '🌟 Don\'t feel lonely, reach out ❤️',
    '📞 A call can brighten someone\'s day ❤️',
    '❤️ Family is forever ❤️',
  ],

  // 7. Good Night (10:00 PM)
  goodNight: [
    '🌙 Good Night, Reddy Sai ❤️',
    '😴 Sleep well, my love ❤️',
    '⭐ Sweet dreams, Reddy Sai ❤️',
    '🌛 Rest well tonight ❤️',
    '💤 Good Night to my everything ❤️',
    '🌟 Sleep tight, my sweetheart ❤️',
    '🛌 Time to rest and recharge ❤️',
    '✨ Good Night, my beautiful one ❤️',
    '💕 Dream of me tonight ❤️',
    '🌙 May your sleep be peaceful ❤️',
    '😴 Good Night, sleep like a baby ❤️',
    '⭐ Tomorrow is a new day ❤️',
  ],

  // 8. Screen Time Reduction (11:30 PM)
  screenTime: [
    '📱 Phone pakkana petti paduko ❤️',
    '😴 Screen time reduce cheyyi ❤️',
    '🌙 Put your phone away now ❤️',
    '💤 Time to disconnect and sleep ❤️',
    '📵 No more screens for tonight ❤️',
    '🛌 Phone down, sleep time ❤️',
    '✨ Rest your eyes, Reddy Sai ❤️',
    '🌙 Blue light is bad for sleep ❤️',
    '😴 Keep phone away from bed ❤️',
    '💤 Your health matters more ❤️',
    '🌟 Sleep better without screens ❤️',
    '📱 Technology can wait until morning ❤️',
  ],

  // 9. Advance Birthday Wishes (June 18-24)
  advanceBirthdayWishes: [
    '🎂 Countdown to Reddy Sai\'s birthday! ❤️',
    '🎉 Getting closer to your special day ❤️',
    '🎁 Soon it will be your birthday ❤️',
    '🎊 Excited for your birthday, Reddy Sai ❤️',
    '🌟 Your birthday is almost here ❤️',
    '💝 Can\'t wait to celebrate you ❤️',
    '🎈 Birthday countdown begins ❤️',
    '✨ You deserve all the happiness ❤️',
    '🎀 Your special day is coming ❤️',
    '💖 Reddy Sai\'s birthday is near ❤️',
    '🎂 Let\'s celebrate you soon ❤️',
    '🌺 Your birthday will be magical ❤️',
    '🎊 Preparing to celebrate Reddy Sai ❤️',
    '💕 You\'re worth celebrating every day ❤️',
    '🎉 Reddy Sai\'s special day awaits ❤️',
  ],

  // 10. Birthday Day Wishes (June 25 - Hourly)
  birthdayWishes: [
    '🎂 Happy Birthday Reddy Sai! ❤️',
    '🎉 Happy Birthday to my love ❤️',
    '🎊 Reddy Sai\'s birthday is here! ❤️',
    '🌟 Happy Birthday, my sweetheart ❤️',
    '💝 Happy Birthday to you ❤️',
    '🎁 Wishing you the happiest birthday ❤️',
    '✨ Happy Birthday, Reddy Sai ❤️',
    '🎈 Today is your special day ❤️',
    '💖 Happy Birthday to my everything ❤️',
    '🌺 Celebrating you today ❤️',
    '🎀 Happy Birthday, my beautiful one ❤️',
    '🎊 You deserve the best birthday ❤️',
    '💕 Happy Birthday, Reddy Sai ❤️',
    '🌟 Today we celebrate you ❤️',
    '🎂 Happy Birthday to the love of my life ❤️',
    '🎉 Reddy Sai\'s birthday wishes ❤️',
    '✨ Happy Birthday, my heart ❤️',
    '💝 You make every day special ❤️',
    '🎁 Happy Birthday to you, my love ❤️',
    '🌈 Happy Birthday, Reddy Sai ❤️',
    '🎊 Celebrating the most special person ❤️',
    '💖 Happy Birthday to my sweetheart ❤️',
    '🌟 Your birthday is magical ❤️',
    '🎀 Happy Birthday, forever yours ❤️',
  ],
};

/**
 * Utility function to get random message from pool
 * @param messages - Array of messages
 * @param lastMessage - Previous message to avoid duplicates
 * @returns Random message different from last
 */
export function getRandomMessage(
  messages: string[],
  lastMessage?: string
): string {
  if (messages.length === 0) return '';
  if (messages.length === 1) return messages[0];

  let message = messages[Math.floor(Math.random() * messages.length)];

  // Prevent consecutive duplicates
  while (message === lastMessage && messages.length > 1) {
    message = messages[Math.floor(Math.random() * messages.length)];
  }

  return message;
}

/**
 * Get notification type based on hour
 * @param hour - Hour of day (0-23)
 * @returns Notification type and message pool
 */
export function getNotificationTypeByHour(
  hour: number
): { type: string; messages: string[] } | null {
  switch (hour) {
    case 6:
      return { type: 'goodMorning', messages: NOTIFICATION_MESSAGES.goodMorning };
    case 8:
      return { type: 'breakfast', messages: NOTIFICATION_MESSAGES.breakfast };
    case 13:
      return { type: 'lunch', messages: NOTIFICATION_MESSAGES.lunch };
    case 18:
      return { type: 'moodCheck', messages: NOTIFICATION_MESSAGES.moodCheck };
    case 19:
      return { type: 'familyReminder', messages: NOTIFICATION_MESSAGES.familyReminder };
    case 20:
      return { type: 'dinner', messages: NOTIFICATION_MESSAGES.dinner };
    case 22:
      return { type: 'goodNight', messages: NOTIFICATION_MESSAGES.goodNight };
    case 23:
      return { type: 'screenTime', messages: NOTIFICATION_MESSAGES.screenTime };
    default:
      return null;
  }
}

/**
 * Get all scheduled hours for daily notifications
 */
export const DAILY_NOTIFICATION_HOURS = [6, 8, 13, 18, 19, 20, 22, 23];

/**
 * Get birthday notification hours (0-23, one per hour)
 */
export const BIRTHDAY_NOTIFICATION_HOURS = Array.from({ length: 24 }, (_, i) => i);

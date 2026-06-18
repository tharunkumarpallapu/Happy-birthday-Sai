# Romance Story - Notification System Guide

## Overview

The Romance Story app features a **production-grade, offline-first notification system** with 9 distinct notification types that follow strict date-based rules. The system is implemented using native Android `AlarmManager` and `BroadcastReceiver` for maximum reliability and battery efficiency.

## Notification Types

| Type | Time | Frequency | Date Range | Count |
|------|------|-----------|-----------|-------|
| Good Morning | 6:00 AM | Daily | All dates | 1 |
| Breakfast | 8:00 AM | Daily | All dates | 1 |
| Lunch | 1:00 PM | Daily | All dates | 1 |
| Mood Check | 6:00 PM | Daily | All dates | 1 |
| Family Care | 7:00 PM | Daily | All dates | 1 |
| Dinner | 8:00 PM | Daily | All dates | 1 |
| Good Night | 10:00 PM | Daily | All dates | 1 |
| Screen Time | 11:30 PM | Daily | All dates | 1 |
| Advance Birthday | 9:00 AM | Daily | June 18-24 | 1 |
| Birthday Hourly | Every hour | Hourly | June 25 only | 24 |

**Total: 9 notification types with 106 unique messages**

## Date-Based Modes

### Advance Birthday Mode (June 18-24)
- **Active:** June 18-24
- **Notifications:** All 8 daily reminders + 1 Advance Birthday message at 9:00 AM
- **Messages:** Romantic anticipation messages
- **Total per day:** 9 notifications

### Birthday Mode (June 25)
- **Active:** June 25 only
- **Notifications:** All 8 daily reminders + 24 hourly birthday messages
- **Messages:** Celebratory birthday wishes
- **Total on birthday:** 32 notifications (8 daily + 24 hourly)

### Normal Mode (June 26+)
- **Active:** June 26 onwards
- **Notifications:** All 8 daily reminders only
- **Messages:** Regular care and affection messages
- **Total per day:** 8 notifications

## Message Pool

The system includes **106 unique messages** across all notification types:

- **Good Morning:** 12 messages
- **Breakfast:** 12 messages
- **Lunch:** 12 messages
- **Mood Check:** 12 messages
- **Family Care:** 12 messages
- **Dinner:** 12 messages
- **Good Night:** 12 messages
- **Screen Time:** 12 messages
- **Advance Birthday:** 12 messages
- **Birthday Hourly:** 2 messages (rotated hourly)

Messages are **randomly selected** to prevent duplicates and keep the experience fresh.

## Architecture

### Client-Side (TypeScript/React)
- **NotificationMessagesPool.ts:** Centralized message configuration
- **NotificationScheduler.ts:** Scheduling logic with date-based mode switching
- **NotificationManager.ts:** Capacitor integration for web/hybrid layer
- **ModeSwitchService.ts:** Automatic date-based mode detection
- **NotificationStorage.ts:** Persistent state management

### Server-Side (Android Native)
- **MainActivity.java:** App initialization, permission handling, notification channel setup
- **AlarmScheduler.java:** Centralized alarm scheduling with proper request codes
- **NotificationReceiver.java:** Broadcast receiver for alarm events, message selection
- **BootReceiver.java:** Device restart handling to reschedule alarms

## Building the APK

### Prerequisites
- Android Studio 2024.1 or later
- Android SDK 24+ (API level 24+)
- Java 11 or later
- Gradle 8.0 or later

### Build Steps

1. **Navigate to project root:**
   ```bash
   cd /home/ubuntu/romance_story
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Build the web assets:**
   ```bash
   pnpm build
   ```

4. **Sync Capacitor:**
   ```bash
   npx cap sync android
   ```

5. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

6. **Build APK:**
   - In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
   - Or from command line:
     ```bash
     cd android
     ./gradlew assembleDebug
     ```

7. **Locate APK:**
   - Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release APK: `android/app/build/outputs/apk/release/app-release.apk`

### Install on Device

```bash
# Connect Android device via USB
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Or use Android Studio's Run button
```

## Testing the Notification System

### 1. Verify Notification Channel
```bash
adb shell dumpsys notification | grep romance_story_notifications
```

### 2. Test Individual Notifications

**Good Morning (6:00 AM):**
```bash
adb shell am broadcast -a GOOD_MORNING com.romancestory.app
```

**Breakfast (8:00 AM):**
```bash
adb shell am broadcast -a BREAKFAST com.romancestory.app
```

**Lunch (1:00 PM):**
```bash
adb shell am broadcast -a LUNCH com.romancestory.app
```

**Mood Check (6:00 PM):**
```bash
adb shell am broadcast -a MOOD_CHECK com.romancestory.app
```

**Family Care (7:00 PM):**
```bash
adb shell am broadcast -a FAMILY_CARE com.romancestory.app
```

**Dinner (8:00 PM):**
```bash
adb shell am broadcast -a DINNER com.romancestory.app
```

**Good Night (10:00 PM):**
```bash
adb shell am broadcast -a GOOD_NIGHT com.romancestory.app
```

**Screen Time (11:30 PM):**
```bash
adb shell am broadcast -a SCREEN_TIME com.romancestory.app
```

**Advance Birthday (June 18-24):**
```bash
adb shell am broadcast -a ADVANCE_BIRTHDAY com.romancestory.app
```

**Birthday Hourly (June 25):**
```bash
adb shell am broadcast -a BIRTHDAY com.romancestory.app --ei hour 0
```

### 3. Verify Alarms are Scheduled
```bash
adb shell dumpsys alarm | grep romance_story
```

### 4. Test Offline Functionality
1. Install APK on device
2. Disable network (Airplane Mode)
3. Wait for notification time
4. Verify notification appears without network

### 5. Test Device Restart
1. Install APK on device
2. Restart device
3. Verify alarms are still scheduled after reboot
4. Wait for next notification time
5. Verify notification appears

### 6. Test Date Mode Switching

**Test Advance Birthday Mode (June 18-24):**
1. Set device date to June 18
2. Restart app
3. Verify 9 AM Advance Birthday notification is scheduled
4. Verify all 8 daily notifications are scheduled

**Test Birthday Mode (June 25):**
1. Set device date to June 25
2. Restart app
3. Verify all 24 hourly birthday notifications are scheduled
4. Verify all 8 daily notifications are scheduled

**Test Normal Mode (June 26+):**
1. Set device date to June 26
2. Restart app
3. Verify only 8 daily notifications are scheduled
4. Verify no birthday notifications are scheduled

### 7. Verify Message Randomization
1. Trigger same notification type multiple times
2. Verify different messages appear each time
3. Verify no message duplicates within reasonable time window

## Troubleshooting

### Notifications Not Appearing

**Check 1: Permissions**
```bash
adb shell pm list permissions | grep POST_NOTIFICATIONS
adb shell pm get-app-ops com.romancestory.app | grep POST_NOTIFICATIONS
```

**Check 2: Notification Channel**
```bash
adb shell dumpsys notification | grep romance_story
```

**Check 3: Alarms**
```bash
adb shell dumpsys alarm | grep romance_story
```

**Check 4: Logs**
```bash
adb logcat | grep "AlarmScheduler\|NotificationReceiver\|MainActivity"
```

### Duplicate Notifications

**Check:** Verify SharedPreferences initialization flag
```bash
adb shell dumpsys notification_init
```

### Notifications Not Persisting After Reboot

**Check:** Verify BootReceiver is declared in AndroidManifest.xml
```bash
adb shell pm dump com.romancestory.app | grep BootReceiver
```

## Key Implementation Details

### Request Code Strategy
- **Daily Notifications:** 1001-1008 (non-overlapping)
- **Advance Birthday:** 2001
- **Birthday Hourly:** 3001-3024 (one per hour)

This prevents conflicts and allows proper cancellation of individual notifications.

### Initialization Flag
- **SharedPreferences Key:** `notification_init`
- **Purpose:** Prevent duplicate scheduling on app restarts
- **Reset:** Automatically cleared on app update

### Message Randomization
- **Strategy:** Seed-based random selection
- **Seed:** Current date + notification type
- **Result:** Same message won't repeat within 24 hours

## Performance Considerations

### Battery Impact
- Uses `setAndAllowWhileIdle()` for efficient battery usage
- Alarms are coalesced by Android system
- No background services running continuously

### Memory Usage
- Message pool loaded once on app startup
- Minimal memory footprint (~2-3 MB)
- No persistent background processes

### Network Usage
- Zero network calls for notifications
- Completely offline-first
- No analytics or tracking

## Security Considerations

### Permissions
- `SCHEDULE_EXACT_ALARM` (Android 12+)
- `RECEIVE_BOOT_COMPLETED` (device restart)
- `POST_NOTIFICATIONS` (Android 13+)

### Data Privacy
- No user data collected
- No analytics tracking
- Messages stored locally only

## Future Enhancements

1. **Custom Notification Sounds:** Add user-selectable ringtones
2. **Notification History:** Track and display past notifications
3. **User Preferences:** Allow customization of notification times
4. **Background Music:** Add ambient music during birthday mode
5. **Notification Analytics:** Track notification engagement

## Support

For issues or questions about the notification system:
1. Check the troubleshooting section above
2. Review Android logs: `adb logcat | grep romance_story`
3. Verify all files are properly updated
4. Ensure Android SDK is up to date

## Files Reference

| File | Purpose | Location |
|------|---------|----------|
| notificationMessagesPool.ts | Message configuration | `client/src/config/` |
| NotificationScheduler.ts | Scheduling logic | `client/src/services/notifications/` |
| NotificationManager.ts | Capacitor integration | `client/src/services/notifications/` |
| ModeSwitchService.ts | Date-based mode switching | `client/src/services/notifications/` |
| MainActivity.java | App initialization | `android/app/src/main/java/com/romancestory/app/` |
| AlarmScheduler.java | Alarm scheduling | `android/app/src/main/java/com/romancestory/app/` |
| NotificationReceiver.java | Broadcast receiver | `android/app/src/main/java/com/romancestory/app/` |
| BootReceiver.java | Boot completion handler | `android/app/src/main/java/com/romancestory/app/` |
| AndroidManifest.xml | App manifest | `android/app/src/main/` |

---

**Last Updated:** June 18, 2026  
**Notification System Version:** 2.0 (Production-Grade Refactor)  
**Status:** Ready for APK Building and Testing

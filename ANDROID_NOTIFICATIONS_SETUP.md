# Android Notifications Setup Guide

## Overview

This guide explains how to properly configure Android notifications for the Romance Story APK using Capacitor Local Notifications.

## Prerequisites

- Node.js and pnpm installed
- Android SDK installed
- Capacitor CLI: `npm install -g @capacitor/cli`

## Installation Steps

### 1. Install Capacitor and Plugins

```bash
cd /home/ubuntu/romance_story

# Install Capacitor core
pnpm add @capacitor/core @capacitor/cli

# Install local notifications plugin
pnpm add @capacitor/local-notifications

# Install preferences plugin for persistent storage
pnpm add @capacitor/preferences
```

### 2. Initialize Capacitor Project

```bash
# Initialize Capacitor
npx cap init

# Add Android platform
npx cap add android
```

### 3. Configure Android Permissions

The `android/app/src/main/AndroidManifest.xml` file includes:

- **POST_NOTIFICATIONS** (Android 13+): Required to display notifications
- **SCHEDULE_EXACT_ALARM**: Required for precise notification scheduling
- **RECEIVE_BOOT_COMPLETED**: Required to reschedule notifications on device restart
- **WAKE_LOCK**: Required to wake device for notifications

### 4. Build and Deploy APK

```bash
# Build web assets
pnpm build

# Sync with Android project
npx cap sync android

# Open Android Studio
npx cap open android

# In Android Studio:
# 1. Select "Build" > "Build Bundle(s) / APK(s)" > "Build APK(s)"
# 2. Wait for build to complete
# 3. APK will be in: android/app/build/outputs/apk/debug/app-debug.apk
```

## Notification System Architecture

### Client-Side Services

1. **NotificationManager** (`client/src/services/notifications/NotificationManager.ts`)
   - Handles Capacitor Local Notifications API
   - Manages permissions
   - Schedules and cancels notifications

2. **NotificationScheduler** (`client/src/services/notifications/NotificationScheduler.ts`)
   - Schedules notifications for Test/Production/Birthday modes
   - Generates notification batches

3. **NotificationStorage** (`client/src/services/notifications/NotificationStorage.ts`)
   - Persists state using Capacitor Preferences
   - Tracks current mode and completion status

4. **ModeSwitchService** (`client/src/services/notifications/ModeSwitchService.ts`)
   - Detects current date and mode
   - Auto-switches modes
   - Reschedules notifications on mode change

### Initialization Flow

1. App launches
2. `App.tsx` calls `modeSwitchService.initialize()`
3. ModeSwitchService:
   - Initializes NotificationStorage
   - Checks current mode based on date
   - Switches mode if needed
   - Schedules all notifications for current mode

### Notification Modes

**Test Mode** (Until June 20)
- Random romantic messages every 5 minutes
- Automatically transitions to Production Mode on June 20

**Production Mode** (June 20-24)
- 7:00 AM: Good morning message
- 9:00 PM: Advance birthday message
- Automatically transitions to Birthday Mode on June 25

**Birthday Mode** (June 25+)
- 12:00 AM: Happy Birthday message
- 7:00 AM: Birthday morning message
- 10:00 AM: Special day message
- 1:00 PM: Happiness message
- 6:00 PM: Gratitude message
- 10:00 PM: Final birthday message

## Testing on Device

### Prerequisites

- Android device with Android 8.0+ (API level 26+)
- USB debugging enabled
- USB cable

### Steps

1. Connect device via USB
2. Run: `adb devices` (should show your device)
3. Build and deploy:
   ```bash
   npx cap sync android
   npx cap open android
   # In Android Studio: Run > Run 'app'
   ```

4. Or install APK directly:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Verification

1. Open the app
2. Check Android system logs:
   ```bash
   adb logcat | grep "NotificationManager\|ModeSwitchService\|NotificationScheduler"
   ```

3. Check notification settings:
   - Settings > Apps > Romance Story > Notifications
   - Ensure "Allow notifications" is enabled

4. Verify scheduled notifications:
   - The app will schedule notifications for the current mode
   - Notifications will appear at scheduled times
   - Check system notification history

## Troubleshooting

### Notifications Not Appearing

1. **Check permissions:**
   ```bash
   adb shell pm list permissions | grep POST_NOTIFICATIONS
   adb shell pm grant com.romance.story android.permission.POST_NOTIFICATIONS
   ```

2. **Check notification channel:**
   - Settings > Apps > Romance Story > Notifications
   - Ensure channel is enabled

3. **Check logs:**
   ```bash
   adb logcat | grep -i notification
   ```

4. **Verify scheduling:**
   - Open app and check console logs
   - Should see "[NotificationScheduler] Scheduled X notifications"

### Notifications Stop After App Close

This is expected behavior - Capacitor Local Notifications uses Android's AlarmManager which persists even when app is closed.

### Notifications Not Rescheduling on Mode Change

1. Check if date detection is working:
   ```bash
   adb logcat | grep "ModeSwitchService"
   ```

2. Verify storage is persisting:
   ```bash
   adb shell
   sqlite3 /data/data/com.romance.story/databases/capacitor.db
   SELECT * FROM preferences;
   ```

## Production Build

For release APK:

```bash
# In Android Studio:
# 1. Build > Generate Signed Bundle / APK
# 2. Select APK
# 3. Create or select keystore
# 4. Fill in signing details
# 5. Choose release build type
# 6. Click Finish

# Or via command line:
cd android
./gradlew assembleRelease
```

Release APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

## Important Notes

1. **Offline Support:** Notifications work completely offline. No internet required after initial scheduling.

2. **Background Execution:** Notifications will appear even if app is closed, as long as device is powered on.

3. **Device Sleep:** Notifications will wake the device at scheduled time (if device supports it).

4. **Battery Impact:** Minimal - uses Android's native AlarmManager which is optimized for battery.

5. **Persistence:** Notifications persist across app restarts and device restarts (if BootCompletedReceiver is implemented).

## Files Modified

- `capacitor.config.ts` - Capacitor configuration
- `android/app/src/main/AndroidManifest.xml` - Android permissions and receivers
- `client/src/App.tsx` - Notification system initialization
- `client/src/services/notifications/*` - Notification services

## Next Steps

1. Build APK and test on Android device
2. Verify notifications appear at scheduled times
3. Test mode switching on June 20
4. Test birthday mode on June 25
5. Monitor logs for any errors

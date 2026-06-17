# Build Android APK - Complete Guide

## Prerequisites

### Required Software

1. **Node.js & npm** (v16+)
   ```bash
   node --version  # Should be v16 or higher
   npm --version
   ```

2. **Android SDK** (API 26+)
   - Download from: https://developer.android.com/studio
   - Or use Android Studio (recommended)

3. **Java Development Kit (JDK)** (v11+)
   ```bash
   java -version  # Should be 11 or higher
   ```

4. **Gradle** (included with Android Studio or standalone)

### Environment Variables

Set these in your system environment:

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Windows:**
```
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\sdk
PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

## Build Steps

### Step 1: Clone/Download Project

```bash
cd /path/to/romance_story
```

### Step 2: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 3: Build Web Assets

```bash
npm run build
# or
pnpm build
```

### Step 4: Sync with Android

```bash
npx cap sync android
```

### Step 5: Build APK

#### Option A: Using Android Studio (Recommended)

1. Open Android Studio
2. File → Open → Select `/path/to/romance_story/android`
3. Wait for Gradle sync to complete
4. Build → Build Bundle(s) / APK(s) → Build APK(s)
5. Wait for build to complete
6. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Option B: Using Command Line

```bash
cd android
./gradlew assembleDebug
```

APK will be generated at: `app/build/outputs/apk/debug/app-debug.apk`

### Step 6: Install on Device

```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

Or drag-and-drop the APK file onto your Android device.

## Troubleshooting

### Build Fails: "Android SDK not found"

**Solution:** Set ANDROID_HOME environment variable

```bash
export ANDROID_HOME=/path/to/android/sdk
```

### Build Fails: "Java not found"

**Solution:** Install JDK 11+

- macOS: `brew install openjdk@11`
- Linux: `sudo apt-get install openjdk-11-jdk`
- Windows: Download from https://www.oracle.com/java/technologies/javase-jdk11-downloads.html

### Build Fails: "Gradle sync failed"

**Solution:**
1. Close Android Studio
2. Delete `android/.gradle` folder
3. Reopen Android Studio
4. Wait for Gradle sync

### APK Installation Fails

**Solution:** Uninstall old version first

```bash
adb uninstall com.romancestory.app
adb install app-debug.apk
```

## Testing Notifications

### After Installation

1. **Open App**
   - App should open normally
   - No crashes or errors

2. **Grant Permissions**
   - Permission dialog appears (Android 13+)
   - Grant "Allow notifications"

3. **Verify Alarms Scheduled**
   ```bash
   adb shell dumpsys alarm | grep com.romancestory.app
   ```

4. **Check Logs**
   ```bash
   adb logcat | grep -i notification
   ```

### Manual Notification Test

1. **Morning Notification (7:00 AM)**
   - Wait until 7:00 AM
   - Notification should appear in system tray
   - Close app and verify notification still appears

2. **Night Notification (10:00 PM)**
   - Wait until 10:00 PM
   - Notification should appear in system tray

3. **Birthday Mode (June 25)**
   - Set device date to June 25
   - Restart app
   - 6 notifications should be scheduled:
     - 12:00 AM
     - 7:00 AM
     - 10:00 AM
     - 1:00 PM
     - 6:00 PM
     - 10:00 PM

### Device Restart Test

1. **Close App**
   ```bash
   adb shell am force-stop com.romancestory.app
   ```

2. **Restart Device**
   - Power off and on
   - Or use: `adb reboot`

3. **Verify Alarms Still Scheduled**
   ```bash
   adb shell dumpsys alarm | grep com.romancestory.app
   ```

## APK Details

| Property | Value |
|----------|-------|
| Package Name | `com.romancestory.app` |
| App Name | Romance Story |
| Min API | 26 (Android 8.0) |
| Target API | 33+ (Android 13+) |
| Build Type | Debug |
| File Size | ~50-80 MB |

## Release Build (Production)

For production release:

```bash
cd android
./gradlew assembleRelease
```

This requires signing certificate setup. See Android documentation for details.

## File Locations

```
romance_story/
├── dist/
│   └── public/              ← Web assets (built by npm run build)
├── android/
│   ├── app/
│   │   ├── build/           ← Build output
│   │   │   └── outputs/
│   │   │       └── apk/
│   │   │           └── debug/
│   │   │               └── app-debug.apk  ← Final APK
│   │   └── src/
│   │       └── main/
│   │           ├── java/com/romancestory/app/
│   │           │   ├── MainActivity.java
│   │           │   ├── NotificationReceiver.java
│   │           │   ├── BootReceiver.java
│   │           │   └── AlarmScheduler.java
│   │           └── AndroidManifest.xml
│   └── capacitor.settings.gradle
├── capacitor.config.ts
└── BUILD_APK_GUIDE.md
```

## Success Indicators

✅ Build completes without errors
✅ APK file is generated
✅ APK can be installed on device
✅ App opens without crashes
✅ Permission dialog appears (Android 13+)
✅ Notifications appear at scheduled times
✅ Notifications work when app is closed
✅ Alarms reschedule on device restart

## Support

For issues:
1. Check build logs carefully
2. Verify all prerequisites are installed
3. Check ANDROID_HOME environment variable
4. Try cleaning build: `./gradlew clean`
5. Check Android documentation: https://developer.android.com/studio

## Next Steps After APK Build

1. **Test Notifications** - Follow testing section above
2. **Customize Messages** - Edit NotificationReceiver.java message arrays
3. **Add Music** - Integrate background music in web app
4. **Personalize Content** - Update all placeholder text with real memories
5. **Deploy to Play Store** - Create release build and submit to Google Play

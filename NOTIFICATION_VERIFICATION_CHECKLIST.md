# Notification System Verification Checklist

## Pre-Deployment Testing

### 1. Code Quality
- [ ] No TypeScript errors: `pnpm check`
- [ ] No ESLint warnings: `pnpm lint` (if configured)
- [ ] All imports resolve correctly
- [ ] No console errors in browser dev tools

### 2. Build Process
- [ ] Web build succeeds: `pnpm build`
- [ ] No build warnings or errors
- [ ] Dist folder created with all assets
- [ ] Capacitor sync succeeds: `npx cap sync android`

### 3. Android Configuration
- [ ] `capacitor.config.ts` exists and is valid
- [ ] `android/app/src/main/AndroidManifest.xml` includes:
  - [ ] POST_NOTIFICATIONS permission
  - [ ] SCHEDULE_EXACT_ALARM permission
  - [ ] RECEIVE_BOOT_COMPLETED permission
  - [ ] WAKE_LOCK permission
- [ ] Android project builds without errors

### 4. Client-Side Services
- [ ] NotificationManager.ts compiles without errors
- [ ] NotificationScheduler.ts compiles without errors
- [ ] NotificationStorage.ts compiles without errors
- [ ] ModeSwitchService.ts compiles without errors
- [ ] All services export correctly

### 5. App Integration
- [ ] App.tsx imports modeSwitchService
- [ ] Notification initialization useEffect added
- [ ] No runtime errors on app launch
- [ ] Console logs appear: "[App] Initializing notification system"

## On-Device Testing (Android)

### Prerequisites
- [ ] Android device with Android 8.0+ (API 26+)
- [ ] USB debugging enabled
- [ ] Device connected via USB
- [ ] `adb devices` shows device

### Installation
- [ ] APK builds successfully
- [ ] APK installs without errors: `adb install app-debug.apk`
- [ ] App launches without crashing
- [ ] App appears in Settings > Apps

### Permissions
- [ ] Permission request dialog appears on first launch
- [ ] User can grant notification permission
- [ ] Permission persists after app restart
- [ ] Check: Settings > Apps > Romance Story > Permissions > Notifications

### Notification Scheduling (Test Mode)
- [ ] Console logs show: "[NotificationScheduler] Scheduling test mode notifications"
- [ ] Console logs show: "[NotificationScheduler] Scheduled X test mode notifications"
- [ ] Notifications appear in system notification history
- [ ] Notifications have correct title: "Our Story ❤️"
- [ ] Notifications have correct body (romantic messages)

### Notification Persistence
- [ ] Close app completely
- [ ] Notifications still appear at scheduled times
- [ ] Restart device
- [ ] Notifications still appear after device restart
- [ ] Check notification history shows all received notifications

### Mode Switching (June 20)
- [ ] On June 20, check console logs for mode switch
- [ ] Console logs show: "[ModeSwitchService] Mode switched from test to production"
- [ ] Production mode notifications start appearing
- [ ] Production notifications have correct times (7 AM, 9 PM)
- [ ] Test mode notifications stop appearing

### Birthday Mode (June 25)
- [ ] On June 25, check console logs for mode switch
- [ ] Console logs show: "[ModeSwitchService] Mode switched from production to birthday"
- [ ] Birthday notifications appear at scheduled times:
  - [ ] 12:00 AM: Happy Birthday message
  - [ ] 7:00 AM: Birthday morning message
  - [ ] 10:00 AM: Special day message
  - [ ] 1:00 PM: Happiness message
  - [ ] 6:00 PM: Gratitude message
  - [ ] 10:00 PM: Final birthday message

### Storage Persistence
- [ ] Check stored preferences: `adb shell sqlite3 /data/data/com.romance.story/databases/capacitor.db "SELECT * FROM preferences;"`
- [ ] Notification state is stored
- [ ] Mode is persisted
- [ ] Completion flags are set correctly

### Logging
- [ ] Check logs: `adb logcat | grep -i "notification\|ModeSwitchService"`
- [ ] All service logs appear
- [ ] No error messages
- [ ] No permission denied errors
- [ ] No "window is not defined" errors

### Edge Cases
- [ ] App restart: Notifications reschedule correctly
- [ ] Device restart: Notifications reschedule correctly
- [ ] Time change: Notifications adjust correctly
- [ ] Timezone change: Notifications adjust correctly
- [ ] Notification permission denied: App handles gracefully
- [ ] Low battery: Notifications still appear

### Performance
- [ ] App launch time is acceptable
- [ ] No memory leaks (check Android Studio Profiler)
- [ ] CPU usage is minimal
- [ ] Battery drain is minimal
- [ ] No ANR (Application Not Responding) errors

## Browser Testing (Development)

### Web Version
- [ ] App runs in browser: `pnpm dev`
- [ ] No console errors
- [ ] Notification services initialize
- [ ] Console logs show initialization messages
- [ ] No crashes or warnings

### Browser Notifications
- [ ] Browser notification permission request appears
- [ ] User can grant permission
- [ ] Notifications appear in browser (if supported)
- [ ] Notifications have correct content

## Debugging Commands

### Check Device Connection
```bash
adb devices
adb shell getprop ro.build.version.release  # Android version
```

### View Logs
```bash
adb logcat | grep -i notification
adb logcat | grep -i "ModeSwitchService\|NotificationManager\|NotificationScheduler"
adb logcat | grep -i "error\|exception"
```

### Check Permissions
```bash
adb shell pm list permissions | grep POST_NOTIFICATIONS
adb shell pm grant com.romance.story android.permission.POST_NOTIFICATIONS
```

### Check Scheduled Alarms
```bash
adb shell dumpsys alarm | grep com.romance.story
```

### Check Stored Data
```bash
adb shell
sqlite3 /data/data/com.romance.story/databases/capacitor.db
SELECT * FROM preferences;
.exit
```

### Clear App Data
```bash
adb shell pm clear com.romance.story
```

### Uninstall App
```bash
adb uninstall com.romance.story
```

## Deployment Checklist

### Before Release
- [ ] All tests pass
- [ ] No console errors
- [ ] Notifications work on multiple Android devices
- [ ] Notifications work on different Android versions (8.0, 10, 12, 13+)
- [ ] Battery drain is acceptable
- [ ] No memory leaks
- [ ] Performance is acceptable

### Release Build
- [ ] Generate signed APK/AAB
- [ ] Test signed APK on device
- [ ] Verify all notifications work in signed build
- [ ] Create backup of signing keystore
- [ ] Document keystore password securely

### Post-Deployment
- [ ] Monitor crash reports
- [ ] Monitor user feedback
- [ ] Check notification delivery rates
- [ ] Monitor battery impact
- [ ] Monitor app crashes

## Known Issues & Workarounds

### Issue: Notifications not appearing on Android 13+
**Cause:** POST_NOTIFICATIONS permission not granted
**Workaround:** Manually grant permission in Settings > Apps > Romance Story > Permissions

### Issue: Notifications stop after app close
**Cause:** Expected behavior - app not running
**Workaround:** This is normal. Notifications use Android AlarmManager which works in background.

### Issue: Notifications appear late
**Cause:** Device in Doze mode or battery saver
**Workaround:** Add app to battery optimization whitelist in Settings

### Issue: Duplicate notifications
**Cause:** App rescheduled notifications without canceling old ones
**Workaround:** Clear app data and restart

## Success Criteria

✅ Notifications appear at scheduled times  
✅ Notifications work offline  
✅ Notifications work when app is closed  
✅ Notifications persist across app restart  
✅ Notifications persist across device restart  
✅ Mode switches automatically on correct dates  
✅ No console errors or warnings  
✅ No memory leaks  
✅ Acceptable battery impact  
✅ Acceptable app launch time  

## Sign-Off

- [ ] Developer: Tested and verified all items
- [ ] QA: Tested on multiple devices and Android versions
- [ ] Ready for production deployment

---

**Test Date:** _______________  
**Tester Name:** _______________  
**Device Model:** _______________  
**Android Version:** _______________  
**Notes:** _______________________________________________

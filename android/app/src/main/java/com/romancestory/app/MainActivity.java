package com.romancestory.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

/**
 * MainActivity - Entry point for Romance Story APK
 * Initializes notification system with proper permission handling
 * Prevents duplicate scheduling on app restarts
 */
public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    private static final int PERMISSION_REQUEST_CODE = 100;
    private static final String CHANNEL_ID = "romance_story_notifications";
    private static final String PREFS_NAME = "notification_init";
    private static final String INIT_KEY = "notifications_initialized";

    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(TAG, "onCreate called");
        initializeNotificationSystem();
    }

    /**
     * Initialize notification system on app launch
     * Creates channel, requests permissions, and schedules notifications
     */
    private void initializeNotificationSystem() {
        Log.d(TAG, "Initializing notification system");
        
        // Step 1: Create notification channel (required for Android 8+)
        createNotificationChannel();
        
        // Step 2: Request notification permission (required for Android 13+)
        requestNotificationPermission();
        
        // Step 3: Schedule notifications (only if permissions granted)
        if (hasNotificationPermission()) {
            scheduleNotifications();
        } else {
            Log.w(TAG, "Notification permission not granted, will retry after permission grant");
        }
    }

    /**
     * Create notification channel for Android 8.0+
     * Required for all notifications on Android Oreo and above
     */
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                NotificationChannel channel = new NotificationChannel(
                        CHANNEL_ID,
                        "Romance Story Notifications",
                        NotificationManager.IMPORTANCE_HIGH
                );
                channel.setDescription("Daily wishes, birthday wishes and special memories.");
                channel.enableVibration(true);
                channel.setShowBadge(true);
                channel.setSound(
                        android.media.RingtoneManager.getDefaultUri(android.media.RingtoneManager.TYPE_NOTIFICATION),
                        new android.media.AudioAttributes.Builder()
                                .setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION)
                                .build()
                );

                NotificationManager notificationManager = getSystemService(NotificationManager.class);
                if (notificationManager != null) {
                    notificationManager.createNotificationChannel(channel);
                    Log.d(TAG, "Notification channel created");
                }
            } catch (Exception e) {
                Log.e(TAG, "Failed to create notification channel", e);
            }
        }
    }

    /**
     * Request POST_NOTIFICATIONS permission for Android 13+
     * This permission is required to show notifications on Android Tiramisu and above
     */
    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "Requesting POST_NOTIFICATIONS permission");
                ActivityCompat.requestPermissions(
                        this,
                        new String[]{android.Manifest.permission.POST_NOTIFICATIONS},
                        PERMISSION_REQUEST_CODE
                );
            } else {
                Log.d(TAG, "POST_NOTIFICATIONS permission already granted");
            }
        }
    }

    /**
     * Check if notification permission is granted
     */
    private boolean hasNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return ContextCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS)
                    == PackageManager.PERMISSION_GRANTED;
        }
        return true; // Pre-Android 13 doesn't require this permission
    }

    /**
     * Schedule all notifications based on current date
     * Prevents duplicate scheduling by checking initialization flag
     */
    private void scheduleNotifications() {
        try {
            // Check if already initialized to prevent duplicate scheduling
            SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            boolean alreadyInitialized = prefs.getBoolean(INIT_KEY, false);

            if (alreadyInitialized) {
                Log.d(TAG, "Notifications already initialized, skipping duplicate scheduling");
                return;
            }

            // Schedule all notifications based on current date
            Log.d(TAG, "Scheduling all notifications");
            AlarmScheduler.scheduleAllNotifications(this);

            // Mark as initialized
            prefs.edit().putBoolean(INIT_KEY, true).apply();
            Log.d(TAG, "Notifications scheduled and marked as initialized");

        } catch (Exception e) {
            Log.e(TAG, "Failed to schedule notifications", e);
        }
    }

    /**
     * Handle permission request result
     * If user grants permission, schedule notifications
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "Notification permission granted");
                scheduleNotifications();
            } else {
                Log.w(TAG, "Notification permission denied");
            }
        }
    }

    /**
     * Handle app resume
     * Check if notifications need to be rescheduled
     */
    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "onResume called");
        
        // Optional: Check if notifications are still scheduled
        // This helps recover from cases where alarms were cleared
        // Uncomment to enable auto-recovery:
        // verifyNotificationsScheduled();
    }

    /**
     * Optional: Verify notifications are still scheduled and reschedule if needed
     * Useful for recovery after system events that clear alarms
     */
    private void verifyNotificationsScheduled() {
        try {
            if (hasNotificationPermission()) {
                Log.d(TAG, "Verifying notifications are scheduled");
                AlarmScheduler.scheduleAllNotifications(this);
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to verify notifications", e);
        }
    }
}

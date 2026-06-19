package com.romancestory.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class BootReceiver extends BroadcastReceiver {
    private static final String TAG = "BootReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent != null &&
            (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction()) ||
             "android.intent.action.QUICKBOOT_POWERON".equals(intent.getAction()))) {
            
            Log.d(TAG, "Device rebooted, rescheduling all notifications including TEST_RANDOM");
            
            // Reschedule production notifications
            AlarmScheduler.scheduleAllNotifications(context);
            
            // Reschedule test mode
            AlarmScheduler.scheduleTestMode(context);
        }
    }
}

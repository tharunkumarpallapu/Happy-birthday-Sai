package com.romancestory.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction() != null && 
            (intent.getAction().equals(Intent.ACTION_BOOT_COMPLETED) || 
             intent.getAction().equals("android.intent.action.QUICKBOOT_POWERON"))) {
            
            AlarmScheduler.scheduleMorningNotification(context);
            AlarmScheduler.scheduleNightNotification(context);
            AlarmScheduler.scheduleBirthdayNotifications(context);
        }
    }
}

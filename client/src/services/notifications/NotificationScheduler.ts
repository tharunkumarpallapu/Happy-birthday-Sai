import NotificationManager from './NotificationManager';
import {
  TEST_MODE_MESSAGES,
  PRODUCTION_MODE_MORNING,
  PRODUCTION_MODE_EVENING,
  BIRTHDAY_MESSAGES_DYNAMIC,
} from '@/config/notificationMessages';

// Construct PRODUCTION_MESSAGES object from imported arrays
const PRODUCTION_MESSAGES = {
  morning: {
    title: '🌅 Good Morning Reddy Sai ❤️',
    bodies: PRODUCTION_MODE_MORNING,
  },
  evening: {
    title: '🎂 Advance Birthday Wishes ❤️',
    bodies: PRODUCTION_MODE_EVENING,
  },
};

// Construct BIRTHDAY_MESSAGES object from imported array
const BIRTHDAY_MESSAGES = {
  title: '🎂 Happy Birthday Reddy Sai ❤️',
  bodies: BIRTHDAY_MESSAGES_DYNAMIC,
};

export interface ScheduleOptions {
  mode: 'test' | 'production' | 'birthday';
}

/**
 * CLIENT-SIDE NotificationScheduler
 * Manages scheduling notifications for all modes
 * Test Mode: Random messages every 5 minutes (until June 20)
 * Production Mode: Scheduled messages at specific times (June 20-24)
 * Birthday Mode: Special messages on June 25
 */
export class NotificationScheduler {
  private static instance: NotificationScheduler;
  private lastTestMessage: string = '';
  private scheduledNotificationIds: number[] = [];

  private constructor() {}

  static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  /**
   * Schedule all notifications for a given mode
   * Generates all future notifications in advance
   */
  async scheduleNotifications(mode: 'test' | 'production' | 'birthday'): Promise<void> {
    console.log(`[NotificationScheduler] Scheduling ${mode} mode notifications`);

    try {
      // Cancel existing notifications first
      await this.cancelAll();

      if (mode === 'test') {
        await this.scheduleTestMode();
      } else if (mode === 'production') {
        await this.scheduleProductionMode();
      } else if (mode === 'birthday') {
        await this.scheduleBirthdayMode();
      }
    } catch (error) {
      console.error(`[NotificationScheduler] Failed to schedule ${mode} notifications:`, error);
    }
  }

  /**
   * Schedule Test Mode notifications
   * Every 5 minutes from now until June 20
   */
  private async scheduleTestMode(): Promise<void> {
    console.log('[NotificationScheduler] Scheduling Test Mode notifications');

    const now = new Date();
    const testModeEndDate = new Date(2026, 5, 20, 0, 0, 0); // June 20, 12:00 AM

    // Generate notifications every 5 minutes until June 20
    const notifications = [];
    let currentTime = new Date(now);
    let notificationId = 1000;

    while (currentTime < testModeEndDate) {
      // Get random message
      let message = this.getRandomTestMessage();
      while (message === this.lastTestMessage && TEST_MODE_MESSAGES.length > 1) {
        message = this.getRandomTestMessage();
      }
      this.lastTestMessage = message;

      notifications.push({
        id: notificationId,
        title: 'Our Story ❤️',
        body: message,
        schedule: {
          at: new Date(currentTime),
        },
      });

      this.scheduledNotificationIds.push(notificationId);
      notificationId++;

      // Add 5 minutes
      currentTime = new Date(currentTime.getTime() + 5 * 60 * 1000);

      // Limit to prevent too many notifications
      if (notifications.length >= 288) { // 288 = 24 hours * 60 minutes / 5 minutes
        break;
      }
    }

    // Schedule in batches
    for (let i = 0; i < notifications.length; i += 10) {
      const batch = notifications.slice(i, i + 10);
      await NotificationManager.scheduleMultiple(batch);
    }

    console.log(`[NotificationScheduler] Scheduled ${notifications.length} test mode notifications`);
  }

  /**
   * Schedule Production Mode notifications
   * June 20-24: 7:00 AM and 9:00 PM daily
   */
  private async scheduleProductionMode(): Promise<void> {
    console.log('[NotificationScheduler] Scheduling Production Mode notifications');

    const notifications = [];
    let notificationId = 2000;

    // June 20-24
    for (let day = 20; day < 25; day++) {
      // 7:00 AM
      const morningDate = new Date(2026, 5, day, 7, 0, 0);
      if (morningDate > new Date()) {
        const morningBody = PRODUCTION_MESSAGES.morning.bodies[
          Math.floor(Math.random() * PRODUCTION_MESSAGES.morning.bodies.length)
        ];

        notifications.push({
          id: notificationId,
          title: PRODUCTION_MESSAGES.morning.title,
          body: morningBody,
          schedule: {
            at: morningDate,
          },
        });
        this.scheduledNotificationIds.push(notificationId);
        notificationId++;
      }

      // 9:00 PM
      const eveningDate = new Date(2026, 5, day, 21, 0, 0);
      if (eveningDate > new Date()) {
        const eveningBody = PRODUCTION_MESSAGES.evening.bodies[
          Math.floor(Math.random() * PRODUCTION_MESSAGES.evening.bodies.length)
        ];

        notifications.push({
          id: notificationId,
          title: PRODUCTION_MESSAGES.evening.title,
          body: eveningBody,
          schedule: {
            at: eveningDate,
          },
        });
        this.scheduledNotificationIds.push(notificationId);
        notificationId++;
      }
    }

    // Schedule all
    if (notifications.length > 0) {
      await NotificationManager.scheduleMultiple(notifications);
      console.log(`[NotificationScheduler] Scheduled ${notifications.length} production mode notifications`);
    }
  }

  /**
   * Schedule Birthday Mode notifications
   * June 25: 12:00 AM, 7:00 AM, 10:00 AM, 1:00 PM, 6:00 PM, 10:00 PM
   */
  private async scheduleBirthdayMode(): Promise<void> {
    console.log('[NotificationScheduler] Scheduling Birthday Mode notifications');

    const notifications = [];
    let notificationId = 3000;

    const times = [0, 7, 10, 13, 18, 22]; // Hours

    for (const hour of times) {
      const birthdayDate = new Date(2026, 5, 25, hour, 0, 0);

      if (birthdayDate > new Date()) {
        const body = BIRTHDAY_MESSAGES.bodies[
          Math.floor(Math.random() * BIRTHDAY_MESSAGES.bodies.length)
        ];

        notifications.push({
          id: notificationId,
          title: BIRTHDAY_MESSAGES.title,
          body,
          schedule: {
            at: birthdayDate,
          },
        });
        this.scheduledNotificationIds.push(notificationId);
        notificationId++;
      }
    }

    // Schedule all
    if (notifications.length > 0) {
      await NotificationManager.scheduleMultiple(notifications);
      console.log(`[NotificationScheduler] Scheduled ${notifications.length} birthday mode notifications`);
    }
  }

  /**
   * Get random test message avoiding duplicates
   */
  private getRandomTestMessage(): string {
    return TEST_MODE_MESSAGES[Math.floor(Math.random() * TEST_MODE_MESSAGES.length)];
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAll(): Promise<void> {
    try {
      if (this.scheduledNotificationIds.length > 0) {
        await NotificationManager.cancelMultiple(this.scheduledNotificationIds);
        console.log(`[NotificationScheduler] Cancelled ${this.scheduledNotificationIds.length} notifications`);
        this.scheduledNotificationIds = [];
      }
    } catch (error) {
      console.error('[NotificationScheduler] Failed to cancel notifications:', error);
    }
  }

  /**
   * Get all scheduled notification IDs
   */
  getScheduledIds(): number[] {
    return [...this.scheduledNotificationIds];
  }
}

export default NotificationScheduler.getInstance();

/**
 * CLIENT-SIDE NotificationScheduler
 * Manages scheduling notifications for all modes
 * Production: June 18-24 (Daily + Advance Birthday)
 * Birthday: June 25 (Hourly - 24 notifications)
 * Normal: June 26+ (Daily only)
 */

import NotificationManager from './NotificationManager';
import {
  NOTIFICATION_MESSAGES,
  getRandomMessage,
  DAILY_NOTIFICATION_HOURS,
  BIRTHDAY_NOTIFICATION_HOURS,
} from '@/config/notificationMessagesPool';

interface ScheduleOptions {
  mode: 'test' | 'production' | 'birthday' | 'normal';
}

export class NotificationScheduler {
  private static instance: NotificationScheduler;
  private lastMessages: Map<string, string> = new Map();
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
   */
  async scheduleNotifications(mode: 'test' | 'production' | 'birthday' | 'normal'): Promise<void> {
    console.log(`[NotificationScheduler] Scheduling ${mode} mode notifications`);

    try {
      // Cancel existing notifications first
      await this.cancelAll();

      switch (mode) {
        case 'test':
          await this.scheduleTestMode();
          break;
        case 'production':
          await this.scheduleProductionMode();
          break;
        case 'birthday':
          await this.scheduleBirthdayMode();
          break;
        case 'normal':
          await this.scheduleNormalMode();
          break;
      }

      console.log(`[NotificationScheduler] ${mode} mode scheduled successfully`);
    } catch (error) {
      console.error(`[NotificationScheduler] Failed to schedule ${mode} notifications:`, error);
      throw error;
    }
  }

  /**
   * Schedule Test Mode notifications (every 5 minutes until June 17)
   */
  private async scheduleTestMode(): Promise<void> {
    console.log('[NotificationScheduler] Scheduling Test Mode notifications');

    const now = new Date();
    const testModeEndDate = new Date(2026, 5, 17, 12, 0, 0); // June 17, 12:00 PM

    const notifications: any[] = [];
    let currentTime = new Date(now);
    let notificationId = 1000;

    while (currentTime < testModeEndDate && notificationId < 2000) {
      const message = getRandomMessage(
        NOTIFICATION_MESSAGES.goodMorning,
        this.lastMessages.get('test')
      );
      this.lastMessages.set('test', message);

      notifications.push({
        id: notificationId,
        title: '❤️ Our Story ❤️',
        body: message,
        schedule: {
          at: new Date(currentTime),
        },
      });

      this.scheduledNotificationIds.push(notificationId);
      notificationId++;

      // Add 5 minutes
      currentTime = new Date(currentTime.getTime() + 5 * 60 * 1000);
    }

    // Schedule in batches
    for (let i = 0; i < notifications.length; i += 10) {
      const batch = notifications.slice(i, i + 10);
      await NotificationManager.scheduleMultiple(batch);
    }

    console.log(`[NotificationScheduler] Scheduled ${notifications.length} test notifications`);
  }

  /**
   * Schedule Production Mode notifications (June 18-24)
   * Daily notifications at 8 specific times + Advance Birthday wishes
   */
  private async scheduleProductionMode(): Promise<void> {
    console.log('[NotificationScheduler] Scheduling Production Mode notifications');

    const notifications: any[] = [];
    let notificationId = 2000;

    // June 18 to June 24 (7 days)
    for (let day = 18; day < 25; day++) {
      // Schedule daily notifications at specific hours
      for (const hour of DAILY_NOTIFICATION_HOURS) {
        const notificationDate = new Date(2026, 5, day, hour, 0, 0);

        // Skip if in the past
        if (notificationDate < new Date()) {
          continue;
        }

        const notificationType = this.getNotificationTypeByHour(hour);

        if (notificationType) {
          const message = getRandomMessage(
            notificationType.messages,
            this.lastMessages.get(notificationType.type)
          );
          this.lastMessages.set(notificationType.type, message);

          notifications.push({
            id: notificationId,
            title: '❤️ Our Story ❤️',
            body: message,
            schedule: {
              at: notificationDate,
            },
          });

          this.scheduledNotificationIds.push(notificationId);
          notificationId++;
        }
      }

      // Advance birthday wishes at 12 PM
      const advanceBirthdayDate = new Date(2026, 5, day, 12, 0, 0);
      if (advanceBirthdayDate >= new Date()) {
        const advanceBirthdayMessage = getRandomMessage(
          NOTIFICATION_MESSAGES.advanceBirthdayWishes,
          this.lastMessages.get('advanceBirthday')
        );
        this.lastMessages.set('advanceBirthday', advanceBirthdayMessage);

        notifications.push({
          id: notificationId,
          title: '🎂 Advance Birthday Wishes 🎂',
          body: advanceBirthdayMessage,
          schedule: {
            at: advanceBirthdayDate,
          },
        });

        this.scheduledNotificationIds.push(notificationId);
        notificationId++;
      }
    }

    // Schedule in batches
    for (let i = 0; i < notifications.length; i += 10) {
      const batch = notifications.slice(i, i + 10);
      await NotificationManager.scheduleMultiple(batch);
    }

    console.log(`[NotificationScheduler] Scheduled ${notifications.length} production notifications`);
  }

  /**
   * Schedule Birthday Mode notifications (June 25)
   * One notification every hour (24 total)
   */
  private async scheduleBirthdayMode(): Promise<void> {
    console.log('[NotificationScheduler] Scheduling Birthday Mode notifications');

    const notifications: any[] = [];
    let notificationId = 3000;

    const birthdayDate = new Date(2026, 5, 25); // June 25

    // Schedule one notification for each hour (0-23)
    for (const hour of BIRTHDAY_NOTIFICATION_HOURS) {
      const notificationDate = new Date(birthdayDate);
      notificationDate.setHours(hour, 0, 0, 0);

      // Skip if in the past
      if (notificationDate < new Date()) {
        continue;
      }

      const message = getRandomMessage(
        NOTIFICATION_MESSAGES.birthdayWishes,
        this.lastMessages.get('birthday')
      );
      this.lastMessages.set('birthday', message);

      notifications.push({
        id: notificationId,
        title: '🎂 Happy Birthday Reddy Sai 🎂',
        body: message,
        schedule: {
          at: notificationDate,
        },
      });

      this.scheduledNotificationIds.push(notificationId);
      notificationId++;
    }

    // Schedule in batches
    for (let i = 0; i < notifications.length; i += 10) {
      const batch = notifications.slice(i, i + 10);
      await NotificationManager.scheduleMultiple(batch);
    }

    console.log(`[NotificationScheduler] Scheduled ${notifications.length} birthday notifications`);
  }

  /**
   * Schedule Normal Mode notifications (June 26+)
   * Daily notifications at 8 specific times (no birthday wishes)
   */
  private async scheduleNormalMode(): Promise<void> {
    console.log('[NotificationScheduler] Scheduling Normal Mode notifications');

    const notifications: any[] = [];
    let notificationId = 4000;

    // Get current date and schedule for next 30 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let daysAhead = 0; daysAhead < 30; daysAhead++) {
      const scheduleDate = new Date(today);
      scheduleDate.setDate(scheduleDate.getDate() + daysAhead);

      // Skip if before June 26
      if (scheduleDate.getMonth() === 5 && scheduleDate.getDate() < 26) {
        continue;
      }

      // Schedule daily notifications at specific hours
      for (const hour of DAILY_NOTIFICATION_HOURS) {
        const notificationDate = new Date(scheduleDate);
        notificationDate.setHours(hour, 0, 0, 0);

        // Skip if in the past
        if (notificationDate < new Date()) {
          continue;
        }

        const notificationType = this.getNotificationTypeByHour(hour);

        if (notificationType) {
          const message = getRandomMessage(
            notificationType.messages,
            this.lastMessages.get(notificationType.type)
          );
          this.lastMessages.set(notificationType.type, message);

          notifications.push({
            id: notificationId,
            title: '❤️ Our Story ❤️',
            body: message,
            schedule: {
              at: notificationDate,
            },
          });

          this.scheduledNotificationIds.push(notificationId);
          notificationId++;
        }
      }
    }

    // Schedule in batches
    for (let i = 0; i < notifications.length; i += 10) {
      const batch = notifications.slice(i, i + 10);
      await NotificationManager.scheduleMultiple(batch);
    }

    console.log(`[NotificationScheduler] Scheduled ${notifications.length} normal notifications`);
  }

  /**
   * Get notification type and messages by hour
   */
  private getNotificationTypeByHour(
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

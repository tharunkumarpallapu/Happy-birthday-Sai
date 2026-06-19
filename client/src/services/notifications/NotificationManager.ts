import { LocalNotifications } from '@capacitor/local-notifications';

export interface NotificationOptions {
  id: number;
  title: string;
  body: string;
  schedule?: {
    at: Date;
  };
  smallIcon?: string;
  largeBody?: string;
  summaryText?: string;
}

/**
 * CLIENT-SIDE NotificationManager
 * Handles all Capacitor local notification operations
 * Works completely offline in APK
 */
export class NotificationManager {
  private static instance: NotificationManager;
  private listeners: any[] = [];

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Request notification permissions from the user
   * Required for Android 13+ (POST_NOTIFICATIONS) and iOS
   */
  async requestPermissions(): Promise<boolean> {
    try {
      console.log('[NotificationManager] Requesting notification permissions');
      const result = await LocalNotifications.requestPermissions();
      const granted = result.display === 'granted';
      console.log(`[NotificationManager] Permission result: ${result.display}`);
      return granted;
    } catch (error) {
      console.error('[NotificationManager] Permission request failed:', error);
      return false;
    }
  }

  /**
   * Check if notifications are enabled
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const result = await LocalNotifications.checkPermissions();
      const granted = result.display === 'granted';
      console.log(`[NotificationManager] Permission check: ${result.display}`);
      return granted;
    } catch (error) {
      console.error('[NotificationManager] Permission check failed:', error);
      return false;
    }
  }

  /**
   * Schedule a single notification
   */
  async scheduleNotification(options: NotificationOptions): Promise<number> {
    try {
      // Check permissions
      let hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.log('[NotificationManager] Permission not granted, requesting...');
        const granted = await this.requestPermissions();
        if (!granted) {
          console.warn('[NotificationManager] Notification permission denied');
          return -1;
        }
        hasPermission = true;
      }

      // Schedule notification
      await LocalNotifications.schedule({
        notifications: [
          {
            id: options.id,
            title: options.title,
            body: options.body,
            schedule: options.schedule ? {
              at: options.schedule.at,
            } : undefined,
            smallIcon: 'ic_stat_romance',
            largeBody: options.largeBody,
            summaryText: options.summaryText,
          },
        ],
      });

      console.log(`[NotificationManager] Scheduled notification ${options.id}: ${options.title}`);
      return options.id;
    } catch (error) {
      console.error('[NotificationManager] Schedule failed:', error);
      return -1;
    }
  }

  /**
   * Schedule multiple notifications
   */
  async scheduleMultiple(options: NotificationOptions[]): Promise<number[]> {
    try {
      // Check permissions
      let hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.log('[NotificationManager] Permission not granted, requesting...');
        const granted = await this.requestPermissions();
        if (!granted) {
          console.warn('[NotificationManager] Notification permission denied');
          return [];
        }
        hasPermission = true;
      }

      const notifications = options.map(opt => ({
        id: opt.id,
        title: opt.title,
        body: opt.body,
        schedule: opt.schedule ? {
          at: opt.schedule.at,
        } : undefined,
        smallIcon: 'ic_stat_romance',
        largeBody: opt.largeBody,
        summaryText: opt.summaryText,
      }));

      await LocalNotifications.schedule({ notifications });

      console.log(`[NotificationManager] Scheduled ${options.length} notifications`);
      return options.map(opt => opt.id);
    } catch (error) {
      console.error('[NotificationManager] Batch schedule failed:', error);
      return [];
    }
  }

  /**
   * Cancel a notification by ID
   */
  async cancelNotification(id: number): Promise<boolean> {
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
      console.log(`[NotificationManager] Cancelled notification ${id}`);
      return true;
    } catch (error) {
      console.error('[NotificationManager] Cancel failed:', error);
      return false;
    }
  }

  /**
   * Cancel multiple notifications
   */
  async cancelMultiple(ids: number[]): Promise<boolean> {
    try {
      if (ids.length === 0) return true;
      
      const notifications = ids.map(id => ({ id }));
      await LocalNotifications.cancel({ notifications });
      console.log(`[NotificationManager] Cancelled ${ids.length} notifications`);
      return true;
    } catch (error) {
      console.error('[NotificationManager] Batch cancel failed:', error);
      return false;
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAll(): Promise<boolean> {
    try {
      const pending = await this.getPendingNotifications();
      if (pending.length > 0) {
        const ids = pending.map((n: any) => n.id);
        await this.cancelMultiple(ids);
      }
      console.log('[NotificationManager] Cancelled all notifications');
      return true;
    } catch (error) {
      console.error('[NotificationManager] Cancel all failed:', error);
      return false;
    }
  }

  /**
   * Get all pending notifications
   */
  async getPendingNotifications(): Promise<any[]> {
    try {
      const result = await LocalNotifications.getPending();
      const notifications = result.notifications || [];
      console.log(`[NotificationManager] Found ${notifications.length} pending notifications`);
      return notifications;
    } catch (error) {
      console.error('[NotificationManager] Get pending failed:', error);
      return [];
    }
  }

  /**
   * Listen to notification click events
   */
  onNotificationClicked(callback: (notification: any) => void): () => void {
    LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (event) => {
        console.log('[NotificationManager] Notification clicked:', event);
        callback(event);
      }
    ).then((listener: any) => {
      this.listeners.push(listener);
    });

    // Return unsubscribe function
    return () => {
      const index = this.listeners.length - 1;
      if (index >= 0) {
        this.listeners[index].remove();
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Listen to notification received events
   */
  onNotificationReceived(callback: (notification: any) => void): () => void {
    LocalNotifications.addListener(
      'localNotificationReceived',
      (event) => {
        console.log('[NotificationManager] Notification received:', event);
        callback(event);
      }
    ).then((listener: any) => {
      this.listeners.push(listener);
    });

    // Return unsubscribe function
    return () => {
      const index = this.listeners.length - 1;
      if (index >= 0) {
        this.listeners[index].remove();
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Clean up all listeners
   */
  cleanup(): void {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
    console.log('[NotificationManager] Cleaned up all listeners');
  }
}

export default NotificationManager.getInstance();

/**
 * CLIENT-SIDE ModeSwitchService
 * Automatically detects current date and switches notification modes
 * Test Mode: Until June 17 (12:00 PM)
 * Production Mode: June 18-24
 * Birthday Mode: June 25 only
 * Normal Mode: June 26+ (NEVER return to birthday mode)
 */

import NotificationStorage from './NotificationStorage';
import NotificationScheduler from './NotificationScheduler';

export class ModeSwitchService {
  private static instance: ModeSwitchService;

  private constructor() {}

  static getInstance(): ModeSwitchService {
    if (!ModeSwitchService.instance) {
      ModeSwitchService.instance = new ModeSwitchService();
    }
    return ModeSwitchService.instance;
  }

  /**
   * Detect current mode based on today's date
   * CRITICAL: After June 25, NEVER return to birthday mode
   */
  private detectCurrentMode(): 'test' | 'production' | 'birthday' | 'normal' {
    const now = new Date();
    const year = 2026;
    const month = 5; // June (0-indexed)

    // Define date boundaries
    const testModeEnd = new Date(year, month, 17, 12, 0, 0); // June 17, 12:00 PM
    const productionModeStart = new Date(year, month, 18, 0, 0, 0); // June 18, 12:00 AM
    const productionModeEnd = new Date(year, month, 24, 23, 59, 59); // June 24, 11:59:59 PM
    const birthdayModeStart = new Date(year, month, 25, 0, 0, 0); // June 25, 12:00 AM
    const birthdayModeEnd = new Date(year, month, 25, 23, 59, 59); // June 25, 11:59:59 PM
    const normalModeStart = new Date(year, month, 26, 0, 0, 0); // June 26, 12:00 AM

    // Determine mode based on current date
    if (now < testModeEnd) {
      return 'test';
    } else if (now >= productionModeStart && now <= productionModeEnd) {
      return 'production';
    } else if (now >= birthdayModeStart && now <= birthdayModeEnd) {
      return 'birthday';
    } else if (now >= normalModeStart) {
      return 'normal';
    } else {
      // Fallback: shouldn't reach here, but default to normal
      return 'normal';
    }
  }

  /**
   * Check if mode has changed and update if necessary
   * Should be called on app launch and periodically
   * CRITICAL: Prevents birthday mode from persisting after June 25
   */
  async checkAndSwitchMode(): Promise<'test' | 'production' | 'birthday' | 'normal' | null> {
    try {
      const currentMode = this.detectCurrentMode();
      const storedMode = await NotificationStorage.getMode();

      console.log(`[ModeSwitchService] Current mode: ${currentMode}, Stored mode: ${storedMode}`);

      // CRITICAL FIX: If stored mode is birthday but current mode is normal, force switch
      if (storedMode === 'birthday' && currentMode === 'normal') {
        console.log('[ModeSwitchService] CRITICAL: Birthday mode ended, switching to normal');
        await NotificationStorage.setMode('normal');
        await NotificationScheduler.scheduleNotifications('normal');
        await NotificationStorage.completeBirthdayMode();
        return 'normal';
      }

      // Mode hasn't changed
      if (currentMode === storedMode) {
        console.log('[ModeSwitchService] Mode unchanged');
        return null;
      }

      // Mode has changed - update and reschedule
      console.log(`[ModeSwitchService] Mode switched from ${storedMode} to ${currentMode}`);
      await NotificationStorage.setMode(currentMode);
      await NotificationScheduler.scheduleNotifications(currentMode);

      // Mark previous mode as completed
      if (storedMode === 'test') {
        await NotificationStorage.completeTestMode();
      } else if (storedMode === 'production') {
        await NotificationStorage.completeProductionMode();
      } else if (storedMode === 'birthday') {
        await NotificationStorage.completeBirthdayMode();
      }

      return currentMode;
    } catch (error) {
      console.error('[ModeSwitchService] Mode switch failed:', error);
      return null;
    }
  }

  /**
   * Initialize notification system on app launch
   * Checks mode, requests permissions, and schedules notifications
   */
  async initialize(): Promise<void> {
    try {
      console.log('[ModeSwitchService] Initializing notification system');

      // Initialize storage
      await NotificationStorage.initialize();

      // Check and switch mode if needed
      const switchedMode = await this.checkAndSwitchMode();

      // If mode didn't change, still need to schedule notifications
      if (!switchedMode) {
        const currentMode = await NotificationStorage.getMode();
        console.log(`[ModeSwitchService] Rescheduling ${currentMode} mode notifications`);
        await NotificationScheduler.scheduleNotifications(currentMode);
      }

      console.log('[ModeSwitchService] Initialization complete');
    } catch (error) {
      console.error('[ModeSwitchService] Initialization failed:', error);
    }
  }

  /**
   * Get days remaining until birthday
   */
  getDaysUntilBirthday(): number {
    const now = new Date();
    const birthday = new Date(2026, 5, 25, 0, 0, 0); // June 25

    if (now > birthday) {
      return 0;
    }

    const diff = birthday.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  }

  /**
   * Check if today is the birthday
   */
  isBirthdayToday(): boolean {
    const now = new Date();
    return now.getMonth() === 5 && now.getDate() === 25; // June 25
  }

  /**
   * Check if birthday has passed
   */
  hasBirthdayPassed(): boolean {
    const now = new Date();
    const birthday = new Date(2026, 5, 25, 0, 0, 0);
    return now > birthday;
  }

  /**
   * Get current mode info
   */
  async getModeInfo(): Promise<{
    mode: 'test' | 'production' | 'birthday' | 'normal';
    daysUntilBirthday: number;
    isBirthdayToday: boolean;
    hasBirthdayPassed: boolean;
  }> {
    const mode = await NotificationStorage.getMode();
    return {
      mode,
      daysUntilBirthday: this.getDaysUntilBirthday(),
      isBirthdayToday: this.isBirthdayToday(),
      hasBirthdayPassed: this.hasBirthdayPassed(),
    };
  }

  /**
   * Debug: Log current mode info
   */
  async debug(): Promise<void> {
    try {
      const info = await this.getModeInfo();
      console.log('[ModeSwitchService] Mode info:', info);
      await NotificationStorage.debug();
    } catch (error) {
      console.error('[ModeSwitchService] Debug failed:', error);
    }
  }
}

export default ModeSwitchService.getInstance();

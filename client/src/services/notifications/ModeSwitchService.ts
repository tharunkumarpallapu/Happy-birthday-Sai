import NotificationStorage from './NotificationStorage';
import NotificationScheduler from './NotificationScheduler';

/**
 * CLIENT-SIDE ModeSwitchService
 * Automatically detects current date and switches notification modes
 * Test Mode: Until June 20
 * Production Mode: June 20-24
 * Birthday Mode: June 25+
 */
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
   */
  private detectCurrentMode(): 'test' | 'production' | 'birthday' {
    const now = new Date();
    const year = 2026;
    const month = 5; // June (0-indexed)

    const testModeEnd = new Date(year, month, 20, 0, 0, 0); // June 20
    const productionModeEnd = new Date(year, month, 25, 0, 0, 0); // June 25
    const birthdayModeEnd = new Date(year, month, 26, 0, 0, 0); // June 26 (birthday ends at midnight)

    if (now < testModeEnd) {
      return 'test';
    } else if (now < productionModeEnd) {
      return 'production';
    } else if (now < birthdayModeEnd) {
      return 'birthday';
    } else {
      // After birthday
      return 'birthday';
    }
  }

  /**
   * Check if mode has changed and update if necessary
   * Should be called on app launch and periodically
   */
  async checkAndSwitchMode(): Promise<'test' | 'production' | 'birthday' | null> {
    try {
      const currentMode = this.detectCurrentMode();
      const storedMode = await NotificationStorage.getMode();

      console.log(`[ModeSwitchService] Current mode: ${currentMode}, Stored mode: ${storedMode}`);

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
   * Get current mode info
   */
  async getModeInfo(): Promise<{
    mode: 'test' | 'production' | 'birthday';
    daysUntilBirthday: number;
    isBirthdayToday: boolean;
  }> {
    const mode = await NotificationStorage.getMode();
    return {
      mode,
      daysUntilBirthday: this.getDaysUntilBirthday(),
      isBirthdayToday: this.isBirthdayToday(),
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

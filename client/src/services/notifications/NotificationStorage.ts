import { Preferences } from '@capacitor/preferences';

export interface NotificationState {
  mode: 'test' | 'production' | 'birthday';
  testModeCompleted: boolean;
  productionModeCompleted: boolean;
  birthdayModeCompleted: boolean;
  firstInstalledAt: string;
  lastModeSwitchAt: string;
  lastScheduledAt: string;
}

/**
 * CLIENT-SIDE NotificationStorage
 * Persists notification state locally using Capacitor Preferences
 * Works completely offline on the device
 */
export class NotificationStorage {
  private static instance: NotificationStorage;
  private static readonly STORAGE_KEY = 'notification_state';
  private static readonly FIRST_INSTALL_KEY = 'first_installed_at';
  private static readonly LAST_MODE_SWITCH_KEY = 'last_mode_switch_at';
  private static readonly LAST_SCHEDULED_KEY = 'last_scheduled_at';

  private constructor() {}

  static getInstance(): NotificationStorage {
    if (!NotificationStorage.instance) {
      NotificationStorage.instance = new NotificationStorage();
    }
    return NotificationStorage.instance;
  }

  /**
   * Initialize storage on first app launch
   */
  async initialize(): Promise<void> {
    try {
      const existing = await this.getState();
      if (!existing) {
        // First time - create initial state
        const now = new Date().toISOString();
        await this.setState({
          mode: 'test',
          testModeCompleted: false,
          productionModeCompleted: false,
          birthdayModeCompleted: false,
          firstInstalledAt: now,
          lastModeSwitchAt: now,
          lastScheduledAt: '',
        });
        console.log('[NotificationStorage] Initialized on first install');
      }
    } catch (error) {
      console.error('[NotificationStorage] Initialization failed:', error);
    }
  }

  /**
   * Get current notification state
   */
  async getState(): Promise<NotificationState | null> {
    try {
      const result = await Preferences.get({ key: NotificationStorage.STORAGE_KEY });
      if (result.value) {
        const state = JSON.parse(result.value) as NotificationState;
        console.log('[NotificationStorage] Retrieved state:', state.mode);
        return state;
      }
      return null;
    } catch (error) {
      console.error('[NotificationStorage] Get state failed:', error);
      return null;
    }
  }

  /**
   * Update notification state
   */
  async setState(state: Partial<NotificationState>): Promise<void> {
    try {
      const current = await this.getState();
      const updated = {
        ...current,
        ...state,
      } as NotificationState;

      await Preferences.set({
        key: NotificationStorage.STORAGE_KEY,
        value: JSON.stringify(updated),
      });

      console.log('[NotificationStorage] Updated state:', updated.mode);
    } catch (error) {
      console.error('[NotificationStorage] Set state failed:', error);
    }
  }

  /**
   * Set current notification mode
   */
  async setMode(mode: 'test' | 'production' | 'birthday'): Promise<void> {
    try {
      const now = new Date().toISOString();
      await this.setState({
        mode,
        lastModeSwitchAt: now,
      });
      console.log(`[NotificationStorage] Mode switched to: ${mode}`);
    } catch (error) {
      console.error('[NotificationStorage] Set mode failed:', error);
    }
  }

  /**
   * Get current notification mode
   */
  async getMode(): Promise<'test' | 'production' | 'birthday'> {
    try {
      const state = await this.getState();
      return state?.mode || 'test';
    } catch (error) {
      console.error('[NotificationStorage] Get mode failed:', error);
      return 'test';
    }
  }

  /**
   * Mark test mode as completed
   */
  async completeTestMode(): Promise<void> {
    try {
      await this.setState({ testModeCompleted: true });
      console.log('[NotificationStorage] Test mode marked as completed');
    } catch (error) {
      console.error('[NotificationStorage] Complete test mode failed:', error);
    }
  }

  /**
   * Check if test mode is completed
   */
  async isTestModeCompleted(): Promise<boolean> {
    try {
      const state = await this.getState();
      return state?.testModeCompleted || false;
    } catch (error) {
      console.error('[NotificationStorage] Check test mode failed:', error);
      return false;
    }
  }

  /**
   * Mark production mode as completed
   */
  async completeProductionMode(): Promise<void> {
    try {
      await this.setState({ productionModeCompleted: true });
      console.log('[NotificationStorage] Production mode marked as completed');
    } catch (error) {
      console.error('[NotificationStorage] Complete production mode failed:', error);
    }
  }

  /**
   * Check if production mode is completed
   */
  async isProductionModeCompleted(): Promise<boolean> {
    try {
      const state = await this.getState();
      return state?.productionModeCompleted || false;
    } catch (error) {
      console.error('[NotificationStorage] Check production mode failed:', error);
      return false;
    }
  }

  /**
   * Mark birthday mode as completed
   */
  async completeBirthdayMode(): Promise<void> {
    try {
      await this.setState({ birthdayModeCompleted: true });
      console.log('[NotificationStorage] Birthday mode marked as completed');
    } catch (error) {
      console.error('[NotificationStorage] Complete birthday mode failed:', error);
    }
  }

  /**
   * Check if birthday mode is completed
   */
  async isBirthdayModeCompleted(): Promise<boolean> {
    try {
      const state = await this.getState();
      return state?.birthdayModeCompleted || false;
    } catch (error) {
      console.error('[NotificationStorage] Check birthday mode failed:', error);
      return false;
    }
  }

  /**
   * Get first installation date
   */
  async getFirstInstalledAt(): Promise<Date | null> {
    try {
      const state = await this.getState();
      if (state?.firstInstalledAt) {
        return new Date(state.firstInstalledAt);
      }
      return null;
    } catch (error) {
      console.error('[NotificationStorage] Get first installed failed:', error);
      return null;
    }
  }

  /**
   * Get last mode switch date
   */
  async getLastModeSwitchAt(): Promise<Date | null> {
    try {
      const state = await this.getState();
      if (state?.lastModeSwitchAt) {
        return new Date(state.lastModeSwitchAt);
      }
      return null;
    } catch (error) {
      console.error('[NotificationStorage] Get last mode switch failed:', error);
      return null;
    }
  }

  /**
   * Update last scheduled time
   */
  async updateLastScheduledAt(): Promise<void> {
    try {
      const now = new Date().toISOString();
      await this.setState({ lastScheduledAt: now });
      console.log('[NotificationStorage] Updated last scheduled time');
    } catch (error) {
      console.error('[NotificationStorage] Update last scheduled failed:', error);
    }
  }

  /**
   * Get last scheduled time
   */
  async getLastScheduledAt(): Promise<Date | null> {
    try {
      const state = await this.getState();
      if (state?.lastScheduledAt) {
        return new Date(state.lastScheduledAt);
      }
      return null;
    } catch (error) {
      console.error('[NotificationStorage] Get last scheduled failed:', error);
      return null;
    }
  }

  /**
   * Clear all stored data (for testing/reset)
   */
  async clear(): Promise<void> {
    try {
      await Preferences.remove({ key: NotificationStorage.STORAGE_KEY });
      console.log('[NotificationStorage] Cleared all data');
    } catch (error) {
      console.error('[NotificationStorage] Clear failed:', error);
    }
  }

  /**
   * Debug: Log all stored data
   */
  async debug(): Promise<void> {
    try {
      const state = await this.getState();
      console.log('[NotificationStorage] Current state:', state);
    } catch (error) {
      console.error('[NotificationStorage] Debug failed:', error);
    }
  }
}

export default NotificationStorage.getInstance();

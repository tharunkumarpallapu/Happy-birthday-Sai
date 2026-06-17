import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.romancestory.app',
  appName: 'Romance Story',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#FF1493',
      sound: 'beep.wav',
    },
  },
};

export default config;

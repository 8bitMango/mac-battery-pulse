import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9d2af06867de4fdbbe33ab21bbe1c923',
  appName: 'mac-battery-pulse',
  webDir: 'dist',
  server: {
    url: 'https://9d2af068-67de-4fdb-be33-ab21bbe1c923.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
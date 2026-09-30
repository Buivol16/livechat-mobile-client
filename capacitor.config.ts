import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pl.denys',
  appName: 'LiveChat',
  webDir: 'dist/livechat-mobile-client/browser',

  ios: {
    webContentsDebuggingEnabled: true,
  },
};

export default config;

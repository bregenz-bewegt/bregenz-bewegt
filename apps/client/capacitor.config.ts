import { CapacitorConfig } from '@capacitor/cli';
import ip from 'ip';

const config: CapacitorConfig = {
  appId: 'at.bregenz.bewegt',
  appName: 'Bregenz bewegt',
  webDir: '../../dist/apps/client',
  bundledWebRuntime: false,
  server: {
    url: `http://${ip.address()}:4200`,
    cleartext: true,
  },
};

export default config;

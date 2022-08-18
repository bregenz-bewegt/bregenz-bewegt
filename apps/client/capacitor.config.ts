import { CapacitorConfig } from '@capacitor/cli';
import ip from 'ip';

console.log(ip.address());

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'client',
  webDir: '../../dist/apps/client',
  bundledWebRuntime: false,
  server: {
    url: `http://${ip.address()}:4200`,
    cleartext: true,
  },
};

export default config;

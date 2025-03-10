// import type { CapacitorConfig } from '@capacitor/cli';

// const config: CapacitorConfig = {
//   appId: 'app.vercel.adminsmokyrho',
//   appName: 'Admin',
//   webDir: 'public'
// };

// export default config;

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.vercel.adminsmokyrho',
  appName: 'Admin',
  webDir: 'build',
  server: {
    url: process.env.NEXT_PUBLIC_API_URL || 'https://admin-smoky-rho.vercel.app/',
  }
};

export default config;

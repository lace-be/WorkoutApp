import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'thomas.workouts.app',
  appName: 'workouts',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['phone', 'google.com', 'facebook.com'],
    },
    Geolocation: {
      enabled: true
    },
    Http: {
      enabled: true
    }
  }
};

export default config;

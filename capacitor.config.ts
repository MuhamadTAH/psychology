// 🧠 FILE PURPOSE
// Capacitor configuration for DuoLearn mobile app.
// This configures how the web app is wrapped as a native iOS/Android app.

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Step 1: Set app identity
  appId: 'com.duolearn.app',  // Unique bundle identifier
  appName: 'DuoLearn',          // App name shown on device

  // Step 2: Configure server settings
  // For development: Use local dev server
  // For production: Build and deploy web app, then use that URL
  server: {
    url: 'http://localhost:3000',  // Dev server URL
    cleartext: true                // Allow HTTP in development
  },

  // Step 3: Plugin configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      showSpinner: false
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
};

export default config;

// ✅ In this file we achieved:
// Configured Capacitor to use local dev server (http://localhost:3000)
// Added splash screen and keyboard plugin settings
// This allows testing mobile app while Next.js dev server is running

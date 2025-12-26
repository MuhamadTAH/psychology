// 🧠 FILE PURPOSE
// Next.js configuration for PWA support and Capacitor static export.
// Enables offline functionality and wrapping as native mobile app.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Step 1: Enable static export for Capacitor
  // Capacitor requires a static build to wrap as a native app
  output: 'export',

  // Step 2: Disable image optimization for static export
  // Static export doesn't support Next.js Image Optimization
  images: {
    unoptimized: true,
  },

  // Step 3: Enable PWA support with service worker
  // This allows the app to work offline and be installable
  reactStrictMode: true,

  // Step 4: Configure headers for PWA
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

// ✅ In this file we achieved:
// Configured Next.js for static export (required by Capacitor)
// Disabled image optimization (incompatible with static export)
// Maintained PWA headers for service worker and manifest

// 🧠 FILE PURPOSE
// This script generates placeholder splash screen SVGs for iOS devices.
// Splash screens are shown while the PWA is loading on iOS devices.

const fs = require('fs');
const path = require('path');

// Step 1: Define iOS device splash screen sizes
// These cover all major iPhone and iPad models
const splashSizes = [
  { name: 'iphone5', width: 640, height: 1136 },
  { name: 'iphone6', width: 750, height: 1334 },
  { name: 'iphoneplus', width: 1242, height: 2208 },
  { name: 'iphonex', width: 1125, height: 2436 },
  { name: 'iphonexr', width: 828, height: 1792 },
  { name: 'iphonexsmax', width: 1242, height: 2688 },
  { name: 'ipad', width: 1536, height: 2048 },
  { name: 'ipadpro10', width: 1668, height: 2224 },
  { name: 'ipadpro12', width: 2048, height: 2732 },
];

// Step 2: Create SVG splash screen template
// Simple centered logo design with brand color background
function generateSplashSVG(width, height) {
  const logoSize = Math.min(width, height) * 0.3;
  const centerX = width / 2;
  const centerY = height / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#1cb0f6"/>
  <circle cx="${centerX}" cy="${centerY}" r="${logoSize / 2}" fill="white" opacity="0.2"/>
  <text x="${centerX}" y="${centerY}" font-family="Arial, sans-serif" font-size="${logoSize * 0.4}" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">DuoLearn</text>
  <text x="${centerX}" y="${centerY + logoSize * 0.8}" font-family="Arial, sans-serif" font-size="${logoSize * 0.15}" fill="white" text-anchor="middle" dominant-baseline="middle">Master Languages & Psychology</text>
</svg>`;
}

// Step 3: Ensure splash directory exists
const splashDir = path.join(__dirname, '..', 'public', 'splash');
if (!fs.existsSync(splashDir)) {
  fs.mkdirSync(splashDir, { recursive: true });
  console.log('✅ Created splash screens directory');
}

// Step 4: Generate all splash screen sizes
console.log('🎨 Generating iOS splash screens...\n');
splashSizes.forEach(({ name, width, height }) => {
  const filename = `apple-splash-${name}.svg`;
  const filepath = path.join(splashDir, filename);
  const svg = generateSplashSVG(width, height);

  fs.writeFileSync(filepath, svg);
  console.log(`✅ Created ${filename} (${width}x${height})`);
});

console.log('\n✨ All splash screens generated successfully!');
console.log('\n📝 Note: These are placeholder SVG splash screens.');
console.log('For production, create custom PNG splash screens with your branding.');

// ✅ In this script we achieved:
// Generated splash screens for all major iOS devices
// Created scalable SVG versions for testing

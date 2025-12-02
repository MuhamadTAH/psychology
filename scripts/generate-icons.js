// 🧠 FILE PURPOSE
// This script generates placeholder PWA icons in all required sizes.
// Run this if you don't have custom icons yet - it creates simple colored squares.

const fs = require('fs');
const path = require('path');

// Step 1: Define icon sizes needed for PWA
// These sizes cover all major devices and platforms
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Step 2: Create SVG template function
// We'll generate SVG icons with the DuoLearn brand color
function generateSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1cb0f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">DL</text>
</svg>`;
}

// Step 3: Ensure icons directory exists
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('✅ Created icons directory');
}

// Step 4: Generate all icon sizes
console.log('🎨 Generating PWA icons...\n');
sizes.forEach(size => {
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  const svg = generateSVG(size);

  fs.writeFileSync(filepath, svg);
  console.log(`✅ Created ${filename}`);
});

console.log('\n✨ All icons generated successfully!');
console.log('\n📝 Note: These are placeholder SVG icons.');
console.log('For production, replace with PNG icons using the ICON-GENERATION-GUIDE.md');
console.log('\nRecommended: Use https://www.pwabuilder.com/imageGenerator to create proper icons.');

// ✅ In this script we achieved:
// Quick placeholder icon generation for testing the PWA
// All required sizes for Android, iOS, and Chrome

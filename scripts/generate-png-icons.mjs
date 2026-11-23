import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconSvg = fs.readFileSync('public/icon.svg');
const maskableSvg = fs.readFileSync('public/icon-maskable.svg');

async function generate() {
  console.log('Generating PWA PNG icons...');

  // 192x192 standard icon
  await sharp(iconSvg)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('Created public/pwa-192x192.png');

  // 512x512 standard icon
  await sharp(iconSvg)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('Created public/pwa-512x512.png');

  // 512x512 maskable icon with safe-zone margin
  await sharp(maskableSvg)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-maskable-512x512.png');
  console.log('Created public/pwa-maskable-512x512.png');

  // 180x180 Apple Touch Icon for iOS Safari
  await sharp(iconSvg)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Created public/apple-touch-icon.png');

  // 32x32 Favicon PNG
  await sharp(iconSvg)
    .resize(32, 32)
    .png()
    .toFile('public/favicon-32x32.png');
  console.log('Created public/favicon-32x32.png');

  console.log('All PWA icons generated successfully!');
}

generate().catch(err => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});

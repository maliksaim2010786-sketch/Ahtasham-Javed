import sharp from 'sharp';
import fs from 'fs';

const logoPath = 'public/assets/aistudio/4d3001bf-002a-413a-8817-5afe29ac5538_6e3a9df5.png';
const logoBuffer = fs.readFileSync(logoPath);

async function generate() {
  console.log('Generating PWA PNG icons from uploaded brand logo...');

  // 192x192 standard icon
  await sharp(logoBuffer)
    .resize(192, 192, { fit: 'cover', position: 'top' })
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('Created public/pwa-192x192.png');

  // 512x512 standard icon
  await sharp(logoBuffer)
    .resize(512, 512, { fit: 'cover', position: 'top' })
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('Created public/pwa-512x512.png');

  // 512x512 maskable icon with safe-zone background padding
  const innerBuffer = await sharp(logoBuffer)
    .resize(416, 416, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 5, g: 5, b: 8, alpha: 1 },
    },
  })
    .composite([{ input: innerBuffer, gravity: 'center' }])
    .png()
    .toFile('public/pwa-maskable-512x512.png');
  console.log('Created public/pwa-maskable-512x512.png');

  // 180x180 Apple Touch Icon for iOS Safari
  await sharp(logoBuffer)
    .resize(180, 180, { fit: 'cover', position: 'top' })
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Created public/apple-touch-icon.png');

  // 32x32 Favicon PNG
  await sharp(logoBuffer)
    .resize(32, 32, { fit: 'cover', position: 'top' })
    .png()
    .toFile('public/favicon-32x32.png');
  console.log('Created public/favicon-32x32.png');

  console.log('All PWA icons updated successfully!');
}

generate().catch((err) => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});

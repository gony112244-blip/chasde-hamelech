/**
 * OG share image — square 1200×1200.
 * Reuses crown + title from the original banner (large, styled) centered in frame.
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const bannerPath = join(publicDir, 'og-share-banner.jpg');
const outPath = join(publicDir, 'og-share.jpg');

const SIZE = 1200;

const bgSvg = `
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a3460"/>
      <stop offset="100%" stop-color="#0a1628"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="48%">
      <stop offset="0%" stop-color="#f0c040" stop-opacity="0.26"/>
      <stop offset="55%" stop-color="#d4a017" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#0a1628" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#glow)"/>
</svg>`;

async function main() {
    const banner = readFileSync(bannerPath);

    // Crown + 3D title from original banner — wide enough to keep full "חסדי המלך"
    const hero = await sharp(banner)
        .extract({ left: 120, top: 8, width: 960, height: 430 })
        .resize(1080, null, { fit: 'inside' })
        .png()
        .toBuffer();

    const heroInfo = await sharp(hero).metadata();
    const heroLeft = Math.round((SIZE - heroInfo.width) / 2);
    const heroTop = Math.round((SIZE - heroInfo.height) / 2 - 40);

    const bg = await sharp(Buffer.from(bgSvg)).png().toBuffer();

    await sharp(bg)
        .composite([{ input: hero, top: Math.max(60, heroTop), left: heroLeft }])
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(outPath);

    const { width, height } = await sharp(outPath).metadata();
    console.log(`Wrote ${outPath} — ${width}×${height}, hero ${heroInfo.width}×${heroInfo.height}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

/**
 * OG share image — square 1200×1200, compact center layout.
 * WhatsApp thumbnails are tiny; only crown + title in the safe zone.
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
    <radialGradient id="glow" cx="50%" cy="46%" r="38%">
      <stop offset="0%" stop-color="#f0c040" stop-opacity="0.28"/>
      <stop offset="55%" stop-color="#d4a017" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#0a1628" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#glow)"/>
</svg>`;

const textSvg = `
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font-family: Arial, 'Segoe UI', sans-serif; font-weight: bold; font-size: 76px; }
    .sub { fill: rgba(255,255,255,0.88); font-family: Arial, 'Segoe UI', sans-serif; font-size: 30px; }
  </style>
  <text x="600" y="720" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" class="title">
    <tspan fill="#ffffff">חסדי</tspan><tspan fill="#f0c040" dx="14">המלך</tspan>
  </text>
  <text x="600" y="780" text-anchor="middle" direction="rtl" class="sub">מחזירים חיוך לגיבורים הקטנים</text>
</svg>`;

async function main() {
    const banner = readFileSync(bannerPath);

    const crown = await sharp(banner)
        .extract({ left: 370, top: 40, width: 460, height: 220 })
        .resize(320, null, { fit: 'inside' })
        .png()
        .toBuffer();

    const crownInfo = await sharp(crown).metadata();
    const crownLeft = Math.round((SIZE - crownInfo.width) / 2);
    const crownTop = 430;

    const bg = await sharp(Buffer.from(bgSvg)).png().toBuffer();
    const textLayer = await sharp(Buffer.from(textSvg)).png().toBuffer();

    await sharp(bg)
        .composite([
            { input: crown, top: crownTop, left: crownLeft },
            { input: textLayer, top: 0, left: 0 },
        ])
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(outPath);

    const { width, height } = await sharp(outPath).metadata();
    console.log(`Wrote ${outPath} — ${width}×${height}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

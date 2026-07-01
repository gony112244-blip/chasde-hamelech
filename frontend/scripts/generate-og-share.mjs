/**
 * OG share image — square 1200×1200.
 * WhatsApp crops link-preview thumbnails to a square; a square OG image avoids side clipping.
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
    <radialGradient id="glow" cx="50%" cy="28%" r="42%">
      <stop offset="0%" stop-color="#f0c040" stop-opacity="0.24"/>
      <stop offset="60%" stop-color="#d4a017" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#0a1628" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#glow)"/>
</svg>`;

const textSvg = `
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font-family: Arial, 'Segoe UI', sans-serif; font-weight: bold; font-size: 82px; }
    .sub { fill: rgba(255,255,255,0.93); font-family: Arial, 'Segoe UI', sans-serif; font-size: 34px; }
    .sub2 { fill: rgba(255,255,255,0.78); font-family: Arial, 'Segoe UI', sans-serif; font-size: 26px; }
    .line { stroke: #d4a017; stroke-width: 2; opacity: 0.65; }
  </style>
  <text x="600" y="680" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" class="title">
    <tspan fill="#ffffff">חסדי</tspan><tspan fill="#f0c040" dx="12">המלך</tspan>
  </text>
  <text x="600" y="750" text-anchor="middle" direction="rtl" class="sub">מחזירים את החיוך לגיבורים הקטנים</text>
  <line x1="300" y1="790" x2="470" y2="790" class="line"/>
  <line x1="730" y1="790" x2="900" y2="790" class="line"/>
  <text x="600" y="835" text-anchor="middle" direction="rtl" class="sub2">חלוקת משחקים וספרים לילדים בבתי חולים</text>
</svg>`;

async function main() {
    // Keep source banner for crown extraction (original wide design)
    const banner = readFileSync(bannerPath);

    const crown = await sharp(banner)
        .extract({ left: 400, top: 45, width: 400, height: 230 })
        .resize(380, null, { fit: 'inside' })
        .png()
        .toBuffer();

    const crownInfo = await sharp(crown).metadata();
    const crownLeft = Math.round((SIZE - crownInfo.width) / 2);
    const crownTop = 150;

    const bg = await sharp(Buffer.from(bgSvg)).png().toBuffer();
    const textLayer = await sharp(Buffer.from(textSvg)).png().toBuffer();

    await sharp(bg)
        .composite([
            { input: crown, top: crownTop, left: crownLeft },
            { input: textLayer, top: 0, left: 0 },
        ])
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(outPath);

    const { width, height, size } = await sharp(outPath).metadata();
    console.log(`Wrote ${outPath} — ${width}×${height}, ${Math.round(size / 1024)}KB`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

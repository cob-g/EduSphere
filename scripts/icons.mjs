// Regenerates the app icons in src/app from the brand mark. Run from the
// project root: node scripts/icons.mjs (sharp comes with Next).
import sharp from "sharp";
import { writeFileSync } from "node:fs";
const SRC = "public/brand/edusphere-mark-black.png";
const mark = await sharp(SRC).trim().toBuffer();

// White tile with the black mark. `scale` = mark width as a share of the
// tile; small tab icons get a bigger mark so it survives downsampling.
async function tile(size, scale, radius) {
  const w = Math.round(size * scale);
  const m = await sharp(mark).resize({ width: w, fit: "inside" }).toBuffer({ resolveWithObject: true });
  const bg = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#fff"/></svg>`);
  return sharp(bg).composite([{ input: m.data, left: Math.round((size - m.info.width) / 2), top: Math.round((size - m.info.height) / 2) }]).png().toBuffer();
}

// PNG-in-ICO container (supported by every browser since Vista).
function ico(pngs) {
  const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length; const dirs = []; const datas = [];
  for (const { size, buf } of pngs) {
    const d = Buffer.alloc(16); d[0] = size === 256 ? 0 : size; d[1] = size === 256 ? 0 : size; d[2] = 0; d[3] = 0;
    d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6); d.writeUInt32LE(buf.length, 8); d.writeUInt32LE(offset, 12);
    dirs.push(d); datas.push(buf); offset += buf.length;
  }
  return Buffer.concat([header, ...dirs, ...datas]);
}

// Tab icon: 32px tile, mark at 82%, rounded a touch so it reads as a badge.
writeFileSync("src/app/icon.png", await tile(64, 0.8, 14));
// iOS home screen: Apple applies its own corner mask, so a square tile.
writeFileSync("src/app/apple-icon.png", await tile(180, 0.7, 0));
// Legacy favicon.ico with 16/32/48 entries.
writeFileSync("src/app/favicon.ico", ico([
  { size: 16, buf: await tile(16, 0.86, 3) },
  { size: 32, buf: await tile(32, 0.82, 7) },
  { size: 48, buf: await tile(48, 0.8, 10) },
]));
// Preview sheet: how the tab icon reads at real sizes on light and dark.
const cell = async (size, bg) => sharp({ create: { width: 72, height: 72, channels: 4, background: bg } })
  .composite([{ input: await tile(size, size <= 32 ? 0.82 : 0.8, Math.round(size * 0.22)), left: Math.round((72 - size) / 2), top: Math.round((72 - size) / 2) }]).png().toBuffer();
const cells = [];
for (const bg of ["#f5f5f7", "#202124"]) for (const s of [16, 32, 48, 64]) cells.push({ input: await cell(s, bg), left: cells.length % 4 * 72, top: Math.floor(cells.length / 4) * 72 });
await sharp({ create: { width: 288, height: 144, channels: 4, background: "#fff" } }).composite(cells).png().toFile("scripts/icon-preview.png");
console.log("written");

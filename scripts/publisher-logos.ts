/**
 * The two logos Google Publisher Center asks for.
 *
 *   npx tsx scripts/publisher-logos.ts
 *
 * Writes public/brand/, which is in the repo so the files can be re-made and
 * re-uploaded without anyone hunting for the original. Publisher Center wants:
 *
 *   - square, PNG, 1000x1000 recommended and 512x512 minimum
 *   - rectangular, PNG, 400px wide minimum, ratio no wider than 10:1
 *
 * The square one is the site icon as it is. Upscaling a 512px raster to 1000
 * would only soften it, and 512 is inside the stated minimum.
 *
 * The rectangular one is drawn here: the monogram beside the wordmark, in the
 * site's ink rather than its page text colour, because Google renders these on
 * white and the site's near-white foreground would disappear.
 */
import { mkdirSync, copyFileSync } from "node:fs";
import sharp from "sharp";

const ICON = "app/(frontend)/icon.png";
const OUT = "public/brand";

/**
 * Two widths of the same wordmark. Publisher Center recommends 400px wide and
 * accepts up to a 10:1 ratio, and it rejected the 1000px file without saying
 * why — so the 400 is the one to upload, and the larger is kept for anywhere
 * that wants it.
 */
const SIZES = [
  { w: 1000, h: 200, name: "root-notes-logo-rectangular.png" },
  { w: 400, h: 80, name: "root-notes-logo-rectangular-400.png" },
];

/** The site's darkest ink, which is what reads on the white Google renders on. */
const INK = "#0d111a";
const ACCENT = "#3b7dff";

mkdirSync(OUT, { recursive: true });

copyFileSync(ICON, `${OUT}/root-notes-logo-square.png`);

for (const { w, h, name } of SIZES) {
  const scale = h / 200;
  const mark = Math.round(150 * scale);
  const pad = Math.round(24 * scale);
  const textX = pad + mark + Math.round(36 * scale);

  const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <text x="${textX}" y="${h / 2 + 2 * scale}" dominant-baseline="middle"
        font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="${86 * scale}"
        font-weight="700" letter-spacing="${10 * scale}" fill="${INK}">ROOT NOTES</text>
  <text x="${textX}" y="${h / 2 + 62 * scale}" dominant-baseline="middle"
        font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="${26 * scale}"
        letter-spacing="${6 * scale}" fill="${ACCENT}">ROOTNOTES.IN</text>
</svg>`;

  const monogram = await sharp(ICON).resize(mark, mark).png().toBuffer();

  await sharp({
    create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: monogram, top: Math.round((h - mark) / 2), left: pad },
      { input: Buffer.from(wordmark), top: 0, left: 0 },
    ])
    .png()
    .toFile(`${OUT}/${name}`);
}

for (const file of [
  "root-notes-logo-square.png",
  "root-notes-logo-rectangular.png",
  "root-notes-logo-rectangular-400.png",
]) {
  const meta = await sharp(`${OUT}/${file}`).metadata();
  console.log(`${OUT}/${file} — ${meta.width}x${meta.height}`);
}

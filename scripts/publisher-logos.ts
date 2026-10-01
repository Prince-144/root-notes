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

const W = 1000;
const H = 200;
const MARK = 150;
const PAD = 24;

/** The site's darkest ink, which is what reads on the white Google renders on. */
const INK = "#0d111a";
const ACCENT = "#3b7dff";

mkdirSync(OUT, { recursive: true });

copyFileSync(ICON, `${OUT}/root-notes-logo-square.png`);

const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="${PAD + MARK + 36}" y="${H / 2 + 2}" dominant-baseline="middle"
        font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="86"
        font-weight="700" letter-spacing="10" fill="${INK}">ROOT NOTES</text>
  <text x="${PAD + MARK + 36}" y="${H / 2 + 62}" dominant-baseline="middle"
        font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="26"
        letter-spacing="6" fill="${ACCENT}">ROOTNOTES.IN</text>
</svg>`;

const mark = await sharp(ICON).resize(MARK, MARK).png().toBuffer();

await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([
    { input: mark, top: Math.round((H - MARK) / 2), left: PAD },
    { input: Buffer.from(wordmark), top: 0, left: 0 },
  ])
  .png()
  .toFile(`${OUT}/root-notes-logo-rectangular.png`);

for (const file of ["root-notes-logo-square.png", "root-notes-logo-rectangular.png"]) {
  const meta = await sharp(`${OUT}/${file}`).metadata();
  console.log(`${OUT}/${file} — ${meta.width}x${meta.height}`);
}

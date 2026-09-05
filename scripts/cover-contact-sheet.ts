/**
 * Builds one labelled contact sheet from candidate Unsplash photo ids.
 *
 *   npx tsx --env-file=.env.local scripts/cover-contact-sheet.ts <id> <id> ...
 *   npx tsx --env-file=.env.local scripts/cover-contact-sheet.ts --out sheet.png <id> ...
 *
 * Cover selection is the slowest part of a research batch: candidates have to
 * be looked at, and looking at them one file at a time is both slow and a poor
 * way to compare. This fetches them all at thumbnail size, marks the ones
 * already used by an article, and writes a single grid image.
 *
 * Ids already in use are drawn dimmed with a USED badge rather than dropped,
 * so a near-duplicate of an existing cover is visible as such instead of
 * silently vanishing from the sheet.
 */
import { writeFileSync } from "node:fs";
import sharp, { type OverlayOptions } from "sharp";
import { getPayload } from "payload";
import config from "@payload-config";

const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const out =
  outIndex === -1
    ? "cover-sheet.png"
    : (args[outIndex + 1] ?? "cover-sheet.png");
const ids = args.filter((a, i) => a.startsWith("photo-") && i !== outIndex + 1);

if (ids.length === 0) {
  console.error("usage: cover-contact-sheet.ts [--out file.png] <photo-id> ...");
  process.exit(1);
}

const COLS = 4;
const CW = 400;
const CH = 260;
const LABEL = 34;
const CELL = CH + LABEL;

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles",
  limit: 1000,
  depth: 0,
});

const used = new Set<string>();
for (const doc of docs) {
  const match = String(doc.coverImageUrl).match(/photo-[0-9]{13}-[0-9a-f]{12}/);
  if (match) used.add(match[0]);
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const rows = Math.ceil(ids.length / COLS);
const W = COLS * CW;
const H = rows * CELL;

const layers: OverlayOptions[] = [];

for (const [i, id] of ids.entries()) {
  const x = (i % COLS) * CW;
  const y = Math.floor(i / COLS) * CELL;
  const url = `https://images.unsplash.com/${id}?w=${CW}&h=${CH}&fit=crop&crop=entropy&q=70`;

  let thumb: Buffer;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = Buffer.from(await res.arrayBuffer());
    const isUsed = used.has(id);
    thumb = await sharp(raw)
      .resize(CW, CH, { fit: "cover" })
      .modulate(isUsed ? { brightness: 0.35, saturation: 0.2 } : {})
      .png()
      .toBuffer();
    console.log(`${String(i).padStart(2)}  ${id}  ${isUsed ? "USED" : "free"}`);
  } catch (error) {
    console.log(`${String(i).padStart(2)}  ${id}  FAILED (${String(error)})`);
    thumb = await sharp({
      create: { width: CW, height: CH, channels: 3, background: "#2a1616" },
    })
      .png()
      .toBuffer();
  }

  layers.push({ input: thumb, left: x, top: y });

  const badge = used.has(id)
    ? `<rect x="8" y="8" width="70" height="26" rx="4" fill="#c0392b"/><text x="43" y="26" font-family="monospace" font-size="15" fill="#fff" text-anchor="middle">USED</text>`
    : "";

  const label = Buffer.from(
    `<svg width="${CW}" height="${CELL}" xmlns="http://www.w3.org/2000/svg">
      ${badge}
      <rect x="0" y="${CH}" width="${CW}" height="${LABEL}" fill="#11161f"/>
      <text x="10" y="${CH + 23}" font-family="monospace" font-size="17" fill="#3b7dff">${String(i).padStart(2)}</text>
      <text x="42" y="${CH + 23}" font-family="monospace" font-size="15" fill="#c3ccdb">${esc(id)}</text>
    </svg>`,
  );
  layers.push({ input: label, left: x, top: y });
}

const sheet = await sharp({
  create: { width: W, height: H, channels: 3, background: "#0d111a" },
})
  .composite(layers)
  .png()
  .toBuffer();

writeFileSync(out, sheet);
console.log(`\nwrote ${out} (${W}x${H}, ${ids.length} candidates)`);
process.exit(0);

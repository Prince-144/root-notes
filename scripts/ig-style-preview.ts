/**
 * Renders one slide's content in three background treatments so the direction
 * can be chosen by looking rather than by describing. Standalone — it does not
 * touch Payload, so it runs without env.
 *
 *   npx tsx scripts/ig-style-preview.ts
 *
 * Output: instagram/style-preview/{a,b,c}.png
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const W = 1080;
const H = 1350;
const PAD = 84;

const BG = "#0d111a";
const FG = "#f2f5f9";
const DIM = "#4a5670";
const ACCENT = "#3b7dff";
const BODY_ON_IMAGE = "#d5dde8";
const MONO = "Consolas, 'DejaVu Sans Mono', monospace";
const SANS = "'Segoe UI', Arial, sans-serif";

const HEADING = "A CVSS 10 with no CVE";
const BODY =
  "A vulnerability with no CVE does not enter the NVD feed, and a scanner built on NVD data has nothing to match against. The dashboard stays clean while the instance is being exploited.";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(text: string, size: number, maxWidth: number, ratio = 0.53): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length * size * ratio > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function tspans(lines: string[], x: number, y: number, lineHeight: number): string {
  return lines
    .map(
      (l, i) =>
        `<tspan x="${x}" y="${y + i * lineHeight}">${esc(l)}</tspan>`,
    )
    .join("");
}

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* A — photographic. A real image, a heavy scrim, oversized type.       */
/* ------------------------------------------------------------------ */

const PHOTO =
  "https://images.unsplash.com/photo-1762163516269-3c143e04175c?w=1080&h=1350&fit=crop&crop=entropy&q=80";

function treatmentA(): string {
  const headSize = 66;
  const headLead = 80;
  const bodySize = 38;
  const bodyLead = 56;
  const headLines = wrap(HEADING, headSize, W - PAD * 2, 0.55);
  const bodyLines = wrap(BODY, bodySize, W - PAD * 2, 0.52);

  const blockH = headLines.length * headLead + 60 + bodyLines.length * bodyLead;
  const top = H - 210 - blockH + headLead;
  const bodyTop = top + headLines.length * headLead + 60;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BG}" stop-opacity="0.10"/>
      <stop offset="34%" stop-color="${BG}" stop-opacity="0.30"/>
      <stop offset="58%" stop-color="${BG}" stop-opacity="0.80"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0.96"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#shade)"/>
  <text x="${PAD}" y="${PAD + 40}" font-family="${MONO}" font-size="27" letter-spacing="5" fill="${ACCENT}">01 / 05</text>
  <text font-family="${SANS}" font-size="${headSize}" font-weight="700" fill="${FG}">${tspans(headLines, PAD, top, headLead)}</text>
  <text font-family="${SANS}" font-size="${bodySize}" fill="${BODY_ON_IMAGE}">${tspans(bodyLines, PAD, bodyTop, bodyLead)}</text>
  <line x1="${PAD}" y1="${H - 150}" x2="${W - PAD}" y2="${H - 150}" stroke="#232b3a" stroke-width="2"/>
  <text x="${PAD}" y="${H - 96}" font-family="${MONO}" font-size="26" letter-spacing="4" fill="${DIM}">ROOTNOTES.IN</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* B — graphic poster. Flat colour field, one oversized element,        */
/*     heavy type. No photograph, no texture.                           */
/* ------------------------------------------------------------------ */

function treatmentB(): string {
  const headSize = 72;
  const headLead = 84;
  const bodySize = 38;
  const bodyLead = 56;
  const headLines = wrap(HEADING, headSize, W - PAD * 2, 0.55);
  const bodyLines = wrap(BODY, bodySize, W - PAD * 2, 0.52);

  const top = 470;
  const bodyTop = top + headLines.length * headLead + 64;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#0b1d3d"/>

  <!-- oversized ghost numeral, bottom-right so it fills the space the copy
       leaves rather than crowding the space the copy needs -->
  <text x="${W + 30}" y="${H - 40}" text-anchor="end" font-family="${SANS}" font-size="620"
        font-weight="700" fill="#ffffff" fill-opacity="0.06">10</text>

  <!-- accent slab -->
  <rect x="0" y="196" width="${PAD + 250}" height="86" fill="${ACCENT}"/>
  <text x="${PAD}" y="253" font-family="${MONO}" font-size="30" letter-spacing="6"
        font-weight="700" fill="#04122c">CVSS 10.0</text>

  <text x="${PAD}" y="${PAD + 40}" font-family="${MONO}" font-size="27" letter-spacing="5" fill="#7fb0ff">01 / 05</text>

  <text font-family="${SANS}" font-size="${headSize}" font-weight="700" fill="#ffffff">${tspans(headLines, PAD, top, headLead)}</text>
  <text font-family="${SANS}" font-size="${bodySize}" fill="#c3d4ee">${tspans(bodyLines, PAD, bodyTop, bodyLead)}</text>

  <line x1="${PAD}" y1="${H - 150}" x2="${W - PAD}" y2="${H - 150}" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>
  <text x="${PAD}" y="${H - 96}" font-family="${MONO}" font-size="26" letter-spacing="4" fill="#7f95bb">ROOTNOTES.IN</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* C — the drawn cyber motif currently in the generator, for reference. */
/* ------------------------------------------------------------------ */

function treatmentCBackground(): string {
  const r = rng(90210);
  const between = (lo: number, hi: number) => lo + r() * (hi - lo);
  const parts: string[] = [];

  const nodes: { x: number; y: number }[] = [];
  for (let i = 0; i < 34; i += 1) {
    nodes.push({ x: between(-40, W + 40), y: between(-40, H + 40) });
  }
  for (const n of nodes) {
    const near = nodes
      .filter((m) => m !== n)
      .sort((a, b) => (a.x - n.x) ** 2 + (a.y - n.y) ** 2 - ((b.x - n.x) ** 2 + (b.y - n.y) ** 2))
      .slice(0, 2);
    for (const m of near) {
      parts.push(
        `<line x1="${n.x.toFixed(0)}" y1="${n.y.toFixed(0)}" x2="${m.x.toFixed(0)}" y2="${m.y.toFixed(0)}" stroke="#5b93e6" stroke-opacity="0.3" stroke-width="1.5"/>`,
      );
    }
    parts.push(
      `<circle cx="${n.x.toFixed(0)}" cy="${n.y.toFixed(0)}" r="${between(3, 7).toFixed(1)}" fill="#7fb0ff" fill-opacity="0.45"/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#16305c"/>
      <stop offset="100%" stop-color="#0d111a"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#base)" fill-opacity="0.85"/>
  ${parts.join("")}
</svg>`;
}

function treatmentCText(): string {
  const headSize = 54;
  const headLead = 68;
  const bodySize = 40;
  const bodyLead = 60;
  const headLines = wrap(HEADING, headSize, W - PAD * 2, 0.55);
  const bodyLines = wrap(BODY, bodySize, W - PAD * 2, 0.52);

  const blockH = headLines.length * headLead + 56 + bodyLines.length * bodyLead;
  const top = Math.max(300, (H - 150 - 190 - blockH) / 2 + 190);
  const bodyTop = top + headLines.length * headLead + 56;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BG}" stop-opacity="0.05"/>
      <stop offset="22%" stop-color="${BG}" stop-opacity="0.30"/>
      <stop offset="40%" stop-color="${BG}" stop-opacity="0.68"/>
      <stop offset="68%" stop-color="${BG}" stop-opacity="0.68"/>
      <stop offset="86%" stop-color="${BG}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0.06"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <text x="${PAD}" y="${PAD + 40}" font-family="${MONO}" font-size="27" letter-spacing="5" fill="${ACCENT}">01 / 05</text>
  <text font-family="${SANS}" font-size="${headSize}" font-weight="700" fill="${FG}">${tspans(headLines, PAD, top, headLead)}</text>
  <text font-family="${SANS}" font-size="${bodySize}" fill="${BODY_ON_IMAGE}">${tspans(bodyLines, PAD, bodyTop, bodyLead)}</text>
  <line x1="${PAD}" y1="${H - 150}" x2="${W - PAD}" y2="${H - 150}" stroke="#232b3a" stroke-width="2"/>
  <text x="${PAD}" y="${H - 96}" font-family="${MONO}" font-size="26" letter-spacing="4" fill="${DIM}">ROOTNOTES.IN</text>
</svg>`;
}

/* ------------------------------------------------------------------ */

const OUT = "instagram/style-preview";
await mkdir(OUT, { recursive: true });

// A — composite the text over a fetched photograph.
const res = await fetch(PHOTO);
if (!res.ok) throw new Error(`photo fetch failed: ${res.status}`);
const photo = await sharp(Buffer.from(await res.arrayBuffer()))
  .resize(W, H, { fit: "cover" })
  .toBuffer();
await sharp(photo)
  .composite([{ input: Buffer.from(treatmentA()), top: 0, left: 0 }])
  .png()
  .toFile(`${OUT}/a-photographic.png`);

// B — pure vector, nothing to composite.
await sharp(Buffer.from(treatmentB())).png().toFile(`${OUT}/b-poster.png`);

// C — drawn motif under the current text layer.
await sharp(Buffer.from(treatmentCBackground()))
  .composite([{ input: Buffer.from(treatmentCText()), top: 0, left: 0 }])
  .png()
  .toFile(`${OUT}/c-drawn.png`);

await writeFile(
  `${OUT}/README.txt`,
  "a-photographic — real photo, heavy scrim, bottom-weighted type\nb-poster — flat colour field, oversized numeral, accent slab\nc-drawn — the procedural cyber motif currently in the generator\n",
);

console.log(`wrote ${OUT}/a-photographic.png, b-poster.png, c-drawn.png`);

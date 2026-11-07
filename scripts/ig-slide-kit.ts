/**
 * The renderer behind a hand-written Instagram carousel.
 *
 * instagram-carousel.ts builds five cards from an article's own `##` headings,
 * which is right for the daily run. Some stories need slides that no heading
 * in the piece states on its own, usually because the value is a correction
 * or a figure that has to be taken apart. Those decks are written by hand and
 * rendered through here, so they still carry the same palette, type, scrim,
 * footer and slide counter and sit correctly beside the generated ones.
 *
 * Nothing in this file reaches the database or the network.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import sharp from "sharp";

export const W = 1080;
export const H = 1350;

const PAD = 84;

/**
 * The cover keeps a wider margin than the rest.
 *
 * The profile grid crops a post to a portrait rectangle and the exact ratio
 * has moved more than once, so cover text is held inside 120px on every side
 * and the crop stops mattering. Only the cover is cropped that way; the other
 * slides are seen at full height.
 */
const COVER_PAD = 120;

const BG = "#0d111a";
const PANEL = "#11161f";
const LINE = "#232b3a";
const FG = "#f2f5f9";
const MUTED = "#8b97b0";
const DIM = "#4a5670";
const ACCENT = "#3b7dff";
const BODY = "#d5dde8";

const MONO = "Consolas, 'DejaVu Sans Mono', monospace";
const SANS = "'Segoe UI', Arial, sans-serif";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * SVG has no text wrapping, so lines are measured here. The ratios are rough
 * per-character widths for these families at a given size, deliberately a
 * little wide, since a line running past the edge is worse than a short one.
 */
function wrap(text: string, size: number, maxWidth: number, ratio = 0.53): string[] {
  const maxChars = Math.floor(maxWidth / (size * ratio));
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars) line = candidate;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function tspans(lines: string[], x: number, y: number, lineHeight: number): string {
  return lines.map((l, i) => `<tspan x="${x}" y="${y + i * lineHeight}">${esc(l)}</tspan>`).join("");
}

/** mulberry32, seeded from the slug so re-running a deck reproduces it exactly. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(slug: string, index: number): number {
  let h = 2166136261;
  for (const ch of `${slug}:${index}`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deep blues and slates only. Anything warmer stops looking like the site. */
const FIELDS = ["#0b1d3d", "#0d2233", "#111a33", "#0a2430", "#121a2c", "#0e1f2e"];

function backgroundSvg(slug: string, index: number): string {
  const r = rng(seedFrom(slug, index));
  const start = Math.floor(r() * FIELDS.length);
  const field = FIELDS[(start + index) % FIELDS.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="field" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stop-color="${field}"/>
      <stop offset="100%" stop-color="${BG}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#field)"/>
</svg>`;
}

const SCRIM = `
<defs>
  <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${BG}" stop-opacity="0.22"/>
    <stop offset="30%" stop-color="${BG}" stop-opacity="0.06"/>
    <stop offset="78%" stop-color="${BG}" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="${BG}" stop-opacity="0.24"/>
  </linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#scrim)"/>`;

const FOOTER = `
<line x1="${PAD}" y1="${H - 150}" x2="${W - PAD}" y2="${H - 150}" stroke="${LINE}" stroke-width="2"/>
<text x="${PAD}" y="${H - 96}" font-family="${MONO}" font-size="26" letter-spacing="4" fill="${DIM}">ROOTNOTES.IN</text>`;

function counter(index: number, total: number): string {
  return `<text x="${PAD}" y="${PAD + 40}" font-family="${MONO}" font-size="27" letter-spacing="5" fill="${ACCENT}">${String(
    index,
  ).padStart(2, "0")} / ${String(total).padStart(2, "0")}</text>`;
}

/**
 * The cover. Six words or fewer at 96px, which is the size that still reads
 * in the grid at thumbnail, with one line of promise under it.
 *
 * 96 rather than something larger because the first deck's headline ran eight
 * pixels past the cover margin at 104.
 */
function coverSlide(category: string, date: string, headline: string, promise: string): string {
  const size = 96;
  const lead = 112;
  const lines = wrap(headline.toUpperCase(), size, W - COVER_PAD * 2, 0.6);
  const promiseLines = wrap(promise, 40, W - COVER_PAD * 2, 0.52);

  const blockH = lines.length * lead + 44 + promiseLines.length * 54;
  const top = (H - blockH) / 2 + 40;
  const promiseTop = top + (lines.length - 1) * lead + 108;
  const chip = category.toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${SCRIM}
<rect x="${COVER_PAD}" y="${COVER_PAD}" width="${chip.length * 22 + 56}" height="56" rx="6" fill="${ACCENT}"/>
<text x="${COVER_PAD + 28}" y="${COVER_PAD + 38}" font-family="${MONO}" font-size="27" letter-spacing="6" font-weight="700" fill="${BG}">${esc(chip)}</text>

<text font-family="${SANS}" font-size="${size}" font-weight="700" fill="${FG}">${tspans(lines, COVER_PAD, top, lead)}</text>
<line x1="${COVER_PAD}" y1="${promiseTop - 56}" x2="${COVER_PAD + 220}" y2="${promiseTop - 56}" stroke="${ACCENT}" stroke-width="6"/>
<text font-family="${SANS}" font-size="40" fill="${BODY}">${tspans(promiseLines, COVER_PAD, promiseTop, 54)}</text>

<line x1="${COVER_PAD}" y1="${H - 186}" x2="${W - COVER_PAD}" y2="${H - 186}" stroke="${LINE}" stroke-width="2"/>
<text x="${COVER_PAD}" y="${H - 128}" font-family="${MONO}" font-size="26" letter-spacing="4" fill="${MUTED}">ROOTNOTES.IN</text>
<text x="${W - COVER_PAD}" y="${H - 128}" text-anchor="end" font-family="${MONO}" font-size="26" fill="${DIM}">${esc(date)}</text>
<text x="${W - COVER_PAD}" y="${H - 80}" text-anchor="end" font-family="${MONO}" font-size="26" fill="${ACCENT}">swipe &#8594;</text>
</svg>`;
}

/** One idea per slide: a heading of three to seven words, at most 25 words under it. */
function pointSlide(index: number, total: number, heading: string, body: string): string {
  const headSize = 54;
  const headLead = 68;
  const bodySize = 40;
  const bodyLead = 60;

  const headLines = wrap(heading, headSize, W - PAD * 2, 0.55);
  const bodyLines = wrap(body, bodySize, W - PAD * 2, 0.52);

  const blockH = headLines.length * headLead + 56 + bodyLines.length * bodyLead;
  const top = Math.max(300, (H - 150 - 190 - blockH) / 2 + 190);
  const bodyTop = top + headLines.length * headLead + 56;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${SCRIM}
${counter(index, total)}
<text font-family="${SANS}" font-size="${headSize}" font-weight="700" fill="${FG}">${tspans(headLines, PAD, top, headLead)}</text>
<text font-family="${SANS}" font-size="${bodySize}" fill="${BODY}">${tspans(bodyLines, PAD, bodyTop, bodyLead)}</text>
${FOOTER}
</svg>`;
}

/**
 * A slide that is one quoted sentence, set large with a rule beside it.
 *
 * For the decks where somebody else's own wording is the strongest thing on
 * the page and paraphrasing it would be the whole problem.
 */
function quoteSlide(index: number, total: number, quote: string, attribution: string): string {
  const size = 50;
  const lead = 66;
  const lines = wrap(quote, size, W - PAD * 2 - 56, 0.53);

  const blockH = lines.length * lead + 80;
  const top = Math.max(320, (H - 150 - 190 - blockH) / 2 + 190);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${SCRIM}
${counter(index, total)}
<line x1="${PAD}" y1="${top - 46}" x2="${PAD}" y2="${top + (lines.length - 1) * lead + 16}" stroke="${ACCENT}" stroke-width="5"/>
<text font-family="${SANS}" font-size="${size}" font-style="italic" fill="${FG}">${tspans(lines, PAD + 44, top, lead)}</text>
<text x="${PAD + 44}" y="${top + (lines.length - 1) * lead + 92}" font-family="${MONO}" font-size="28" fill="${MUTED}">${esc(attribution)}</text>
${FOOTER}
</svg>`;
}

/**
 * The recap, which is the slide people screenshot and send on. Monospace and
 * checkboxes rather than a shell prompt: not every line on one of these is
 * something you type, and a "$" in front of a thing to go and look for reads
 * as a command that does not exist.
 */
function recapSlide(index: number, total: number, heading: string, items: string[]): string {
  const headSize = 54;
  const headLead = 68;
  const itemSize = 34;
  const itemLead = 52;
  const marker = "[ ]";
  const itemX = PAD + 76;
  const itemWidth = W - itemX - PAD;

  const headLines = wrap(heading, headSize, W - PAD * 2, 0.55);
  const wrapped = items.map((item) => wrap(item, itemSize, itemWidth, 0.6));
  const rowCount = wrapped.reduce((n, lines) => n + lines.length, 0);

  const blockH = headLines.length * headLead + 60 + rowCount * itemLead;
  const top = Math.max(300, (H - 150 - 190 - blockH) / 2 + 190);
  const listTop = top + headLines.length * headLead + 70;

  let row = 0;
  const bullets = wrapped
    .map((lines) => {
      const y = listTop + row * itemLead;
      row += lines.length;
      return `<text x="${PAD}" y="${y}" font-family="${MONO}" font-size="${itemSize}" fill="${ACCENT}">${marker}</text>
<text font-family="${MONO}" font-size="${itemSize}" fill="${FG}">${tspans(lines, itemX, y, itemLead)}</text>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${SCRIM}
${counter(index, total)}
<text font-family="${SANS}" font-size="${headSize}" font-weight="700" fill="${FG}">${tspans(headLines, PAD, top, headLead)}</text>
${bullets}
${FOOTER}
</svg>`;
}

/** One action, in the site's own panel. */
function ctaSlide(index: number, total: number, prompt: string, line: string): string {
  const lines = wrap(line, 44, W - PAD * 2 - 96, 0.53);
  const panelH = 150 + lines.length * 58 + 110;
  const panelY = (H - 150 - 190 - panelH) / 2 + 190;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${SCRIM}
${counter(index, total)}
<rect x="${PAD}" y="${panelY}" width="${W - PAD * 2}" height="${panelH}" rx="18" fill="${PANEL}" stroke="${LINE}" stroke-width="2"/>
<text x="${PAD + 48}" y="${panelY + 82}" font-family="${MONO}" font-size="28" letter-spacing="5" fill="${ACCENT}">${esc(prompt)}</text>
<text font-family="${SANS}" font-size="44" font-weight="600" fill="${FG}">${tspans(lines, PAD + 48, panelY + 158, 58)}</text>
<text x="${PAD + 48}" y="${panelY + panelH - 46}" font-family="${MONO}" font-size="30" fill="${MUTED}">Link in bio  &#8594;  rootnotes.in</text>
${FOOTER}
</svg>`;
}

export type Card =
  | { kind: "point"; name: string; heading: string; body: string }
  | { kind: "quote"; name: string; quote: string; attribution: string };

export type Deck = {
  /** The article's slug. Names the output folder and seeds the backgrounds. */
  slug: string;
  category: string;
  /** Rendered on the cover, in the site's own YYYY-MM-DD form. */
  date: string;
  cover: { headline: string; promise: string };
  cards: Card[];
  recap: { heading: string; items: string[] };
  cta: { prompt: string; line: string };
  caption: string;
  altText: string;
};

/**
 * Renders a deck into instagram/<slug>/ and returns the files written.
 *
 * Stale PNGs are cleared first, because slide filenames carry their heading
 * and a re-run after an edit would otherwise leave the previous name behind.
 */
export async function renderDeck(deck: Deck): Promise<string[]> {
  const total = deck.cards.length + 3;

  const slides: { name: string; svg: string }[] = [
    {
      name: "01-cover",
      svg: coverSlide(deck.category, deck.date, deck.cover.headline, deck.cover.promise),
    },
    ...deck.cards.map((card, i) => ({
      name: `${String(i + 2).padStart(2, "0")}-${card.name}`,
      svg:
        card.kind === "quote"
          ? quoteSlide(i + 2, total, card.quote, card.attribution)
          : pointSlide(i + 2, total, card.heading, card.body),
    })),
    {
      name: `${String(total - 1).padStart(2, "0")}-recap`,
      svg: recapSlide(total - 1, total, deck.recap.heading, deck.recap.items),
    },
    {
      name: `${String(total).padStart(2, "0")}-cta`,
      svg: ctaSlide(total, total, deck.cta.prompt, deck.cta.line),
    },
  ];

  const dir = `instagram/${deck.slug}`;
  mkdirSync(dir, { recursive: true });
  for (const stale of readdirSync(dir).filter((f) => f.endsWith(".png"))) {
    rmSync(`${dir}/${stale}`);
  }

  const written: string[] = [];
  for (let i = 0; i < slides.length; i += 1) {
    const { name, svg } = slides[i];
    const file = `${dir}/${name}.png`;
    await sharp(Buffer.from(backgroundSvg(deck.slug, i)))
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .png()
      .toFile(file);
    written.push(file);
  }

  writeFileSync(`${dir}/caption.txt`, deck.caption, "utf8");
  writeFileSync(`${dir}/cover-alt-text.txt`, `${deck.altText}\n`, "utf8");

  return written;
}

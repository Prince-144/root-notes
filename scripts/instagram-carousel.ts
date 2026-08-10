/**
 * Turns a published article into an Instagram carousel.
 *
 *   npx tsx --env-file=.env.local scripts/instagram-carousel.ts <slug>
 *
 * Writes 1080x1350 PNGs and a caption.txt into instagram/<slug>/. Posting is
 * manual: the Content Publishing API needs a Facebook Page, a Meta app and an
 * app review that takes weeks, which is not worth doing before knowing whether
 * this content works on Instagram at all.
 *
 * Slides come from the article's own `##` headings and the first paragraph
 * under each, so the carousel follows the piece rather than being written
 * twice and drifting from it.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { getPayload } from "payload";
import config from "@payload-config";
import { siteConfig } from "@/site.config";

const W = 1080;
const H = 1350;
const PAD = 84;

const BG = "#0d111a";
const PANEL = "#11161f";
const LINE = "#232b3a";
const FG = "#f2f5f9";
const MUTED = "#8b97b0";
const DIM = "#4a5670";
const ACCENT = "#3b7dff";

const MONO = "Consolas, 'DejaVu Sans Mono', monospace";
const SANS = "'Segoe UI', Arial, sans-serif";

/** Instagram crops nothing at 4:5, but faces of text still need margin. */
const MAX_SLIDES = 10; // the API caps carousels at 10; keep parity with it

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * SVG has no text wrapping, so lines are measured here. The ratios are rough
 * per-character widths for these families at a given size — deliberately a
 * little wide, since a line running past the edge is worse than a short one.
 */
function wrap(text: string, size: number, maxWidth: number, ratio = 0.53): string[] {
  const perChar = size * ratio;
  const maxChars = Math.floor(maxWidth / perChar);
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
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
  return lines
    .map((l, i) => `<tspan x="${x}" y="${y + i * lineHeight}">${esc(l)}</tspan>`)
    .join("");
}

/** Faint dotted grid, same texture as the article covers. */
const GRID = `
<defs>
  <pattern id="g" width="44" height="44" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1.2" fill="#2c3a52" opacity="0.35"/>
  </pattern>
</defs>
<rect width="${W}" height="${H}" fill="${BG}"/>
<rect width="${W}" height="${H}" fill="url(#g)"/>`;

const FOOTER = `
<line x1="${PAD}" y1="${H - 150}" x2="${W - PAD}" y2="${H - 150}" stroke="${LINE}" stroke-width="2"/>
<text x="${PAD}" y="${H - 96}" font-family="${MONO}" font-size="26" letter-spacing="4" fill="${DIM}">ROOTNOTES.IN</text>`;

/**
 * Text layer for the cover, composited over the article's own image.
 *
 * Set bottom-heavy with a gradient behind it: a headline over a photograph is
 * only readable if something guarantees the contrast, and a photo chosen for
 * the article was never chosen to have text on it.
 */
function coverOverlay(category: string, title: string, dateLabel: string): string {
  const size = 72;
  const lead = 86;
  const lines = wrap(title.toUpperCase(), size, W - PAD * 2, 0.58);
  const blockBottom = H - 250;
  const blockTop = blockBottom - (lines.length - 1) * lead;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d111a" stop-opacity="0.55"/>
      <stop offset="38%" stop-color="#0d111a" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="#0d111a" stop-opacity="0.97"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#shade)"/>

  <rect x="${PAD}" y="${PAD}" width="${category.length * 22 + 56}" height="56" rx="6" fill="${ACCENT}"/>
  <text x="${PAD + 28}" y="${PAD + 38}" font-family="${MONO}" font-size="27" letter-spacing="6" font-weight="700" fill="#0d111a">${esc(
    category.toUpperCase(),
  )}</text>

  <text font-family="${SANS}" font-size="${size}" font-weight="700" fill="${FG}">${tspans(
    lines,
    PAD,
    blockTop,
    lead,
  )}</text>

  <line x1="${PAD}" y1="${H - 186}" x2="${W - PAD}" y2="${H - 186}" stroke="${LINE}" stroke-width="2"/>
  <text x="${PAD}" y="${H - 128}" font-family="${MONO}" font-size="26" letter-spacing="4" fill="${MUTED}">ROOTNOTES.IN</text>
  <text x="${W - PAD}" y="${H - 128}" text-anchor="end" font-family="${MONO}" font-size="26" fill="${DIM}">${esc(
    dateLabel,
  )}</text>
  <text x="${W - PAD}" y="${H - 80}" text-anchor="end" font-family="${MONO}" font-size="26" fill="${ACCENT}">swipe →</text>
</svg>`;
}

/** Typographic fallback for an article with no cover image. */
function coverSlide(category: string, title: string, dateLabel: string): string {
  const lines = wrap(title, 66, W - PAD * 2, 0.55);
  // Centred like the point slides, so the set reads as one thing.
  const blockTop = Math.max(340, (H - 150 - 190 - lines.length * 84) / 2 + 190);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${GRID}
<text x="${PAD}" y="${PAD + 40}" font-family="${MONO}" font-size="27" letter-spacing="7" fill="${ACCENT}">${esc(
    category.toUpperCase(),
  )}</text>
<text x="${PAD}" y="${PAD + 84}" font-family="${MONO}" font-size="24" fill="${DIM}">${esc(dateLabel)}</text>

<text font-family="${SANS}" font-size="66" font-weight="700" fill="${FG}">${tspans(
    lines,
    PAD,
    blockTop,
    84,
  )}</text>
<line x1="${PAD}" y1="${blockTop + lines.length * 84 + 20}" x2="${PAD + 220}" y2="${
    blockTop + lines.length * 84 + 20
  }" stroke="${ACCENT}" stroke-width="6"/>
${FOOTER}
<text x="${W - PAD}" y="${H - 96}" text-anchor="end" font-family="${MONO}" font-size="24" fill="${MUTED}">swipe →</text>
</svg>`;
}

function pointSlide(
  index: number,
  total: number,
  heading: string,
  body: string,
  isQuote: boolean,
): string {
  const headSize = 54;
  const headLead = 68;
  const bodySize = 40;
  const bodyLead = 60;

  const headLines = wrap(heading, headSize, W - PAD * 2, 0.55);
  const bodyLines = wrap(body, bodySize, W - PAD * 2 - (isQuote ? 40 : 0), 0.52).slice(0, 11);

  // Centre the block between the header rule and the footer rule. Text pinned
  // to the top left most of a 1350px slide empty, which reads as unfinished.
  const blockH = headLines.length * headLead + 56 + bodyLines.length * bodyLead;
  const top = Math.max(300, (H - 150 - 190 - blockH) / 2 + 190);
  const bodyTop = top + headLines.length * headLead + 56;
  const bodyX = PAD + (isQuote ? 40 : 0);

  const quoteBar = isQuote
    ? `<line x1="${PAD}" y1="${bodyTop - 42}" x2="${PAD}" y2="${
        bodyTop + (bodyLines.length - 1) * bodyLead + 14
      }" stroke="${ACCENT}" stroke-width="5"/>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${GRID}
<text x="${PAD}" y="${PAD + 40}" font-family="${MONO}" font-size="27" letter-spacing="5" fill="${ACCENT}">${String(
    index,
  ).padStart(2, "0")} / ${String(total).padStart(2, "0")}</text>

<text font-family="${SANS}" font-size="${headSize}" font-weight="700" fill="${FG}">${tspans(
    headLines,
    PAD,
    top,
    headLead,
  )}</text>
${quoteBar}
<text font-family="${SANS}" font-size="${bodySize}" ${
    isQuote ? `font-style="italic" fill="${FG}"` : `fill="${MUTED}"`
  }>${tspans(bodyLines, bodyX, bodyTop, bodyLead)}</text>
${FOOTER}
</svg>`;
}

function ctaSlide(title: string): string {
  const lines = wrap(title, 44, W - PAD * 2 - 96, 0.53);

  // Panel sized to its contents and centred, rather than a fixed box with the
  // text floating in the top of it.
  const panelH = 150 + lines.length * 58 + 110;
  const panelY = (H - 150 - 190 - panelH) / 2 + 190;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${GRID}
<rect x="${PAD}" y="${panelY}" width="${W - PAD * 2}" height="${panelH}" rx="18" fill="${PANEL}" stroke="${LINE}" stroke-width="2"/>
<text x="${PAD + 48}" y="${panelY + 82}" font-family="${MONO}" font-size="28" letter-spacing="5" fill="${ACCENT}">$ read --full</text>
<text font-family="${SANS}" font-size="44" font-weight="600" fill="${FG}">${tspans(
    lines,
    PAD + 48,
    panelY + 158,
    58,
  )}</text>
<text x="${PAD + 48}" y="${panelY + panelH - 46}" font-family="${MONO}" font-size="30" fill="${MUTED}">Link in bio  →  rootnotes.in</text>
${FOOTER}
</svg>`;
}

function clean(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pulls `## Heading` blocks and the best paragraph under each.
 *
 * Quotes are included rather than skipped — in a piece built on a first-person
 * account they are usually the strongest line on the page, and skipping them
 * left slides ending on a dangling "In his words:" with the words missing.
 */
function sections(body: string): { heading: string; text: string; isQuote: boolean }[] {
  const out: { heading: string; text: string; isQuote: boolean }[] = [];

  for (const block of body.split(/\n(?=## )/)) {
    const match = block.match(/^## (.+)/);
    if (!match) continue;

    const paragraphs = block
      .slice(match[0].length)
      .trim()
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    const quote = paragraphs.find((p) => p.startsWith(">"));
    // Tables, lists and code don't reduce to a slide; a lead-in ending in a
    // colon is only half a thought without whatever followed it.
    const prose = paragraphs.find(
      (p) => !/^[|\-*>`#]/.test(p) && !p.endsWith(":") && clean(p).length > 40,
    );

    const chosen = quote ?? prose;
    if (!chosen) continue;

    out.push({
      heading: match[1].trim(),
      text: clean(chosen.replace(/^>\s?/gm, "")),
      isQuote: Boolean(quote),
    });
  }
  return out;
}

const slug = process.argv[2];
if (!slug) {
  console.error("usage: instagram-carousel.ts <article-slug>");
  process.exit(1);
}

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles",
  where: { slug: { equals: slug } },
  limit: 1,
  depth: 0,
});

const article = docs[0] as any;
if (!article) {
  console.error(`no article with slug "${slug}"`);
  process.exit(1);
}

const dir = `instagram/${slug}`;
mkdirSync(dir, { recursive: true });

const picked = sections(article.body).slice(0, MAX_SLIDES - 2);
const total = picked.length;

const dateLabel = article.publishedAt.slice(0, 10);

/**
 * The cover is built separately from the rest: it composites the article's own
 * image under the text, which sharp has to do in two passes rather than in a
 * single SVG. Falls back to the typographic version when there is no image.
 */
async function writeCover(path: string): Promise<void> {
  const src: string | undefined = article.coverImageUrl;

  if (!src) {
    await sharp(Buffer.from(coverSlide(article.categorySlug, article.title, dateLabel)))
      .png()
      .toFile(path);
    return;
  }

  const url = src.startsWith("http") ? src : `${siteConfig.url}${src}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`cover image ${res.status} for ${url}`);
  const photo = Buffer.from(await res.arrayBuffer());

  await sharp(photo)
    .resize(W, H, { fit: "cover", position: "centre" })
    .composite([
      { input: Buffer.from(coverOverlay(article.categorySlug, article.title, dateLabel)), top: 0, left: 0 },
    ])
    .png()
    .toFile(path);
}

const slides: { name: string; svg: string }[] = [
  ...picked.map((s, i) => ({
    name: `${String(i + 2).padStart(2, "0")}-${s.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`,
    svg: pointSlide(i + 1, total, s.heading, s.text, s.isQuote),
  })),
  { name: `${String(picked.length + 2).padStart(2, "0")}-cta`, svg: ctaSlide(article.title) },
];

await writeCover(`${dir}/01-cover.png`);
for (const slide of slides) {
  await sharp(Buffer.from(slide.svg)).png().toFile(`${dir}/${slide.name}.png`);
}

const caption = `${article.title}

${article.excerpt}

Full piece: ${siteConfig.url}/article/${article.slug}
(link in bio)

${(article.tags ?? []).map((t: string) => `#${t.replace(/-/g, "")}`).join(" ")}`;

writeFileSync(`${dir}/caption.txt`, caption, "utf8");

console.log(`${dir}/ — ${slides.length + 1} slides + caption.txt`);
console.log("  01-cover.png");
for (const s of slides) console.log(`  ${s.name}.png`);
process.exit(0);

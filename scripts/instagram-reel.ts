/**
 * Turns an already-generated carousel into a 9:16 Reel.
 *
 *   npx tsx scripts/instagram-reel.ts <article-slug>
 *
 * Reads the PNGs in instagram/<slug>/ — run instagram-carousel.ts first — and
 * writes reel.mp4 beside them. Needs ffmpeg on PATH.
 *
 * The slides are 4:5 and a Reel is 9:16, so each one is padded top and bottom
 * with the site's background rather than cropped. Cropping a slide built to
 * exactly fit its text would cut the text.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import sharp from "sharp";

const W = 1080;
const H = 1920;
const BG = "#0d111a";
const ACCENT = "0x3b7dff";

/** Long enough to read a paragraph slide, short enough to keep a swipe-through pace. */
const SLIDE_SECONDS = 4;
const FADE_SECONDS = 0.6;

const slug = process.argv[2];
if (!slug) {
  console.error("usage: instagram-reel.ts <article-slug>");
  process.exit(1);
}

const dir = `instagram/${slug}`;
const work = `${dir}/.reel`;

let slides: string[];
try {
  slides = readdirSync(dir)
    .filter((f) => f.endsWith(".png"))
    .sort();
} catch {
  console.error(`no carousel at ${dir}/ — run instagram-carousel.ts ${slug} first`);
  process.exit(1);
}

if (slides.length < 2) {
  console.error(`need at least 2 slides in ${dir}/, found ${slides.length}`);
  process.exit(1);
}

rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

// Pad each slide to 9:16 on the site's background.
const padded: string[] = [];
for (let i = 0; i < slides.length; i += 1) {
  const out = `${work}/${String(i).padStart(2, "0")}.png`;
  await sharp(`${dir}/${slides[i]}`)
    .resize(W, H, { fit: "contain", background: BG })
    .png()
    .toFile(out);
  padded.push(out);
}

const total = slides.length * SLIDE_SECONDS - (slides.length - 1) * FADE_SECONDS;

/**
 * xfade chains pairwise, and each transition's offset is measured from the
 * start of the whole chain — so the offsets accumulate by (slide - fade)
 * rather than sitting at multiples of the slide length.
 */
const inputs: string[] = [];
for (const p of padded) {
  inputs.push("-loop", "1", "-t", String(SLIDE_SECONDS), "-i", p);
}

const steps: string[] = [];
let last = "0:v";
for (let i = 1; i < padded.length; i += 1) {
  const offset = (i * (SLIDE_SECONDS - FADE_SECONDS)).toFixed(2);
  const label = i === padded.length - 1 ? "faded" : `x${i}`;
  steps.push(
    `[${last}][${i}:v]xfade=transition=fade:duration=${FADE_SECONDS}:offset=${offset}[${label}]`,
  );
  last = label;
}

// A progress bar along the bottom, so a viewer can see how much is left —
// the single strongest signal against an early swipe-away.
steps.push(
  `[faded]drawbox=x=0:y=ih-10:w=iw*t/${total.toFixed(2)}:h=10:color=${ACCENT}:t=fill[v]`,
);

const out = `${dir}/reel.mp4`;

const args = [
  "-y",
  ...inputs,
  // Instagram treats a track-less file inconsistently; a silent track is safer.
  "-f",
  "lavfi",
  "-t",
  String(total),
  "-i",
  "anullsrc=channel_layout=stereo:sample_rate=44100",
  "-filter_complex",
  steps.join(";"),
  "-map",
  "[v]",
  "-map",
  `${padded.length}:a`,
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-r",
  "30",
  "-c:a",
  "aac",
  "-shortest",
  "-movflags",
  "+faststart",
  out,
];

try {
  execFileSync("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
} catch (err: unknown) {
  const e = err as { stderr?: Buffer; message?: string };
  console.error("ffmpeg failed:\n" + (e.stderr?.toString().slice(-2000) ?? e.message));
  process.exit(1);
}

rmSync(work, { recursive: true, force: true });

console.log(
  `${out} — ${slides.length} slides, ${total.toFixed(1)}s, ${W}x${H}\n` +
    slides.map((s) => `  ${s}`).join("\n"),
);

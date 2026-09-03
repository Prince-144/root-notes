/**
 * Builds a self-contained HTML page showing a carousel's slides and caption.
 *
 *   npx tsx scripts/carousel-preview.ts <slug>
 *
 * The slides are PNGs on disk and the chat client renders file attachments as
 * download cards, so the only reliable way to actually look at a carousel
 * before posting it is a web page. This has been hand-written six times as a
 * throwaway script; it is the same page every time, so it lives here now.
 *
 * Slides are embedded as base64 JPEGs rather than linked, because the page is
 * published to a host that cannot reach this machine. Quality 88 with 4:4:4
 * chroma keeps the slide text crisp — the default subsampling smears white
 * text on the dark ground badly enough to look like a rendering bug.
 *
 * Output goes next to the slides, in instagram/<slug>/preview.html, which is
 * gitignored along with the rest of that directory.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: carousel-preview.ts <slug>");
  process.exit(1);
}

const dir = `instagram/${slug}`;
if (!existsSync(dir)) {
  console.error(`${dir} does not exist — generate the carousel first`);
  process.exit(1);
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** "03-both-ai-stack-auth-bugs-.png" -> "Both ai stack auth bugs" */
function role(file: string, index: number, total: number): string {
  if (index === 0) return "Cover";
  if (index === total - 1) return "Read the full piece";
  const words = file
    .replace(/^\d+-/, "")
    .replace(/\.png$/, "")
    .replace(/-+$/, "")
    .split("-")
    .filter(Boolean);
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const files = readdirSync(dir)
  .filter((f) => f.endsWith(".png"))
  .sort();

if (files.length === 0) {
  console.error(`no slides in ${dir}`);
  process.exit(1);
}

const captionPath = `${dir}/caption.txt`;
const caption = existsSync(captionPath) ? readFileSync(captionPath, "utf8").trim() : "";

const cards: string[] = [];
for (const [i, file] of files.entries()) {
  const buf = await sharp(`${dir}/${file}`)
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toBuffer();
  const label = esc(role(file, i, files.length));
  cards.push(
    [
      '      <figure class="slide">',
      `        <img src="data:image/jpeg;base64,${buf.toString("base64")}" alt="Slide ${i + 1}: ${label}" width="1080" height="1350">`,
      "        <figcaption>",
      `          <span class="num">${String(i + 1).padStart(2, "0")}</span>`,
      `          <span class="role">${label}</span>`,
      "        </figcaption>",
      "      </figure>",
    ].join("\n"),
  );
  console.error(`${file} -> ${Math.round(buf.length / 1024)} KB`);
}

const html = `<title>${esc(slug)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>
  :root {
    --ground: #e9edf3;
    --surface: #ffffff;
    --ink: #121821;
    --muted: #5c6a80;
    --faint: #8593ab;
    --line: #cdd6e2;
    --accent: #2f6ce0;
    --shadow: 0 1px 2px rgba(18, 24, 33, 0.08), 0 12px 28px -12px rgba(18, 24, 33, 0.28);
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --ground: #05080d;
      --surface: #0e141e;
      --ink: #e9eef6;
      --muted: #8593ab;
      --faint: #67748c;
      --line: #1c2431;
      --accent: #6398ff;
      --shadow: 0 1px 2px rgba(0, 0, 0, 0.5), 0 14px 32px -14px rgba(0, 0, 0, 0.8);
    }
  }
  :root[data-theme="dark"] {
    --ground: #05080d;
    --surface: #0e141e;
    --ink: #e9eef6;
    --muted: #8593ab;
    --faint: #67748c;
    --line: #1c2431;
    --accent: #6398ff;
    --shadow: 0 1px 2px rgba(0, 0, 0, 0.5), 0 14px 32px -14px rgba(0, 0, 0, 0.8);
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: var(--ground);
    color: var(--ink);
    font-family: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .wrap {
    max-width: 1080px;
    margin: 0 auto;
    padding: 56px 28px 96px;
    display: flex;
    flex-direction: column;
    gap: 44px;
  }

  header { display: flex; flex-direction: column; gap: 14px; }

  .eyebrow {
    font-family: "IBM Plex Mono", ui-monospace, Consolas, monospace;
    font-size: 12px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0;
  }

  h1 {
    font-family: "IBM Plex Mono", ui-monospace, Consolas, monospace;
    font-size: clamp(18px, 2.6vw, 24px);
    line-height: 1.35;
    font-weight: 500;
    letter-spacing: -0.01em;
    word-break: break-word;
    margin: 0;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 10px;
    font-family: "IBM Plex Mono", ui-monospace, Consolas, monospace;
    font-size: 12.5px;
    color: var(--muted);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .meta li { display: flex; align-items: center; gap: 10px; }
  .meta li + li::before {
    content: "";
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--faint);
  }

  .strip {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: min(76vw, 300px);
    gap: 22px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    margin: 0 -28px;
    padding: 0 28px 8px;
    scrollbar-color: var(--line) transparent;
  }

  .slide {
    margin: 0;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .slide img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 5;
    border-radius: 8px;
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
    background: #0d111a;
  }

  figcaption {
    display: flex;
    align-items: baseline;
    gap: 10px;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.45;
  }
  .num {
    font-family: "IBM Plex Mono", ui-monospace, Consolas, monospace;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    color: var(--accent);
    flex: none;
  }

  section { display: flex; flex-direction: column; gap: 16px; }

  .section-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    border-top: 1px solid var(--line);
    padding-top: 20px;
  }

  h2 {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.01em;
    margin: 0;
  }

  button.copy {
    font-family: "IBM Plex Mono", ui-monospace, Consolas, monospace;
    font-size: 12px;
    letter-spacing: 0.04em;
    color: var(--accent);
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    transition: border-color 0.15s ease;
  }
  button.copy:hover { border-color: var(--accent); }
  button.copy:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  pre.caption {
    font-family: "IBM Plex Mono", ui-monospace, Consolas, monospace;
    font-size: 13.5px;
    line-height: 1.75;
    white-space: pre-wrap;
    word-break: break-word;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 22px 24px;
    margin: 0;
    overflow-x: auto;
    color: var(--ink);
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }
</style>

<div class="wrap">
  <header>
    <p class="eyebrow">rootnotes.in / instagram</p>
    <h1>${esc(slug)}</h1>
    <ul class="meta">
      <li>${files.length} slides</li>
      <li>1080 &times; 1350</li>
      <li>swipe order, left to right</li>
    </ul>
  </header>

  <div class="strip">
${cards.join("\n")}
  </div>

  <section>
    <div class="section-head">
      <h2>Caption</h2>
      <button class="copy" type="button">Copy caption</button>
    </div>
    <pre class="caption" id="caption">${esc(caption)}</pre>
  </section>
</div>

<script>
  document.querySelector("button.copy").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const text = document.getElementById("caption").textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = "Copy caption";
    }, 1600);
  });
</script>
`;

const out = `${dir}/preview.html`;
writeFileSync(out, html);
console.error(`wrote ${out} (${Math.round(html.length / 1024)} KB)`);

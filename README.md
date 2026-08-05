# Newsblog — Step 1: Design system + layout shell

Terminal-aesthetic news blog. Next.js 16 (App Router) + Tailwind CSS v4.

## Run it

```bash
cd newsblog
npm install
npm run dev
```

Open http://localhost:3000

> Node 20+ required. First `npm install` takes 1–2 minutes.

## What's in this step

```
site.config.ts              ← site name, tagline, categories, nav. Change name here only.
app/
  globals.css               ← ALL design tokens: colours, fonts, spacing, article typography
  layout.tsx                ← root shell, fonts, SEO metadata
  page.tsx                  ← homepage (terminal hero + latest grid + trending sidebar)
components/
  site-header.tsx           ← sticky header, mono nav, mobile menu
  site-footer.tsx           ← footer + socials + status line
  theme-provider.tsx        ← next-themes wrapper (dark default)
  theme-toggle.tsx          ← dark/light switch
  terminal-window.tsx       ← the fake terminal chrome (reusable)
  article-card.tsx          ← card + numbered trending row
  tag-chip.tsx              ← category chips
  newsletter-box.tsx        ← subscribe form (UI only for now)
lib/
  articles.ts               ← sample data + HN gravity trending algorithm
```

## Design tokens

Everything visual lives in `app/globals.css`. Two layers:

1. **Palette** (`@theme`) — `--color-shell-*` (navy canvas), `--color-flame-*` (coral accent), `--color-sig-*` (category colours).
2. **Semantics** (`:root` / `.light`) — `--bg`, `--fg`, `--line`, `--accent`. Components only use these, exposed as Tailwind utilities: `bg-canvas`, `bg-panel`, `text-fg-muted`, `border-line`, `text-accent`.

Change the accent colour once in `--color-flame-500` and the entire site follows.

### Custom utilities

| Utility | Use |
|---|---|
| `container-page` | Standard page width + responsive padding |
| `label-mono` | Small uppercase mono section label |
| `tag-chip` | Bordered uppercase category chip |
| `panel` | Bordered card surface |
| `link-underline` | Underline grows on hover |
| `cursor-blink` | Blinking terminal cursor |
| `.article-body` | Full article typography (h2 gets a `##` prefix) |

## Rename the site

Open `site.config.ts`, change `name`. That's it — header, footer, page titles, OG tags all update.

## Next steps

- **Step 2** — article page, category pages, MDX rendering, related posts
- **Step 3** — Payload CMS + Postgres, replacing `lib/articles.ts`
- **Step 4** — SEO: JSON-LD, sitemap, RSS, OG image generation
- **Step 5** — newsletter API + Resend, search, deploy to Vercel

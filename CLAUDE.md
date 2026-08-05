# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Root Notes" — a terminal-aesthetic news blog. Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript, content served by an embedded Payload CMS on Postgres (Neon). Steps 1–3 of the multi-step build are done: design system, layout shell, homepage, article/category pages, MDX rendering, and the Payload-backed content layer. See "Roadmap" below for what's left.

## Commands

```bash
npm install                # first install takes 1-2 minutes; Node 20+ required
npm run dev                # start dev server at http://localhost:3000
npm run build               # production build
npm run start                # serve the production build
npm run lint                 # next lint (not yet configured — no eslint devDependency installed)
npm run generate:types       # regenerate payload-types.ts after changing a collection
npm run generate:importmap   # regenerate app/(payload)/admin/importMap.js after changing admin components
npx tsx scripts/seed.ts      # (re)seed sample articles into Postgres — skips slugs that already exist
```

Requires `DATABASE_URI` (Postgres connection string) and `PAYLOAD_SECRET` in `.env.local` — see `.env.example`. There is no test suite configured yet.

## Architecture

### Content layer is Payload CMS on Postgres

[lib/articles.ts](lib/articles.ts) wraps Payload's local API and exposes the same read functions the rest of the app calls: `getArticles(limit?)`, `getFeatured()`, `getByCategory(slug)`, `getBySlug(slug)`, `getRelated(article, limit?)`, `getTrending(limit)`, `formatDate(iso)`. All of these except `formatDate` are now `async` (they weren't in the Step-1/2 in-memory version) — every call site awaits them. The `articles` collection is defined in [collections/Articles.ts](collections/Articles.ts); its `body` field stores raw MDX source (a `code` field, not Payload richText) specifically so `article.body` keeps flowing straight into `<MDXRemote source={article.body} />` unchanged. When adding content-related functionality, add it here rather than calling Payload's local API directly from components or pages.

### Admin panel lives in its own route group

The Payload admin UI needs its own `<html>` document, so the app is split into two route groups under `app/`: `(frontend)/` holds the actual site (former root `layout.tsx`, `page.tsx`, `globals.css`, `article/`, `category/` — moved here unchanged, URLs unaffected since route groups don't appear in the path), and `(payload)/` holds the admin panel (`/admin`) plus the REST (`/api/[...slug]`) and GraphQL (`/api/graphql`) routes. `payload.config.ts` lives at the repo root; `@payload-config` (see `tsconfig.json` paths) points to it. `next.config.ts` is wrapped in `withPayload(...)`.

`getTrending` ranks by Hacker News-style gravity: `score = views / (hours_since_publish + 2)^1.5` — recency beats raw popularity.

### Site identity is centralized in site.config.ts

[site.config.ts](site.config.ts) is the single source of truth for site name, tagline, nav, and categories — it drives the header, footer, page titles, and OG tags. Renaming the site or adding/removing a category only requires editing this file. Each `Category` carries a `color` that is a CSS custom property reference (e.g. `var(--color-sig-violet)`) into the token system in `globals.css`, not a raw color value.

### Design tokens: two-layer system in globals.css

[app/globals.css](app/globals.css) is the only place visual styling constants live. Two layers, both under Tailwind v4's `@theme`:

1. **Palette** (`@theme`) — raw scales: `--color-shell-*` (navy canvas grays), `--color-flame-*` (coral accent), `--color-sig-*` (per-category signal colors), plus `--color-dot-*` for the fake terminal window dots.
2. **Semantics** (`:root`/`.dark` and `.light`) — `--bg`, `--fg`, `--line`, `--accent`, etc., remapped per theme, then re-exposed via a second `@theme inline` block as Tailwind utilities (`bg-canvas`, `bg-panel`, `text-fg-muted`, `border-line`, `text-accent`, ...).

**Components must consume only the semantic utilities (layer 2), never the raw palette (layer 1) directly** — that's what makes theme switching and re-skinning (e.g. changing `--color-flame-500`) propagate site-wide without touching component code.

Dark is the default theme; light mode is opt-in via the `.light` class, driven by `next-themes` with class-based `attribute="class"` (see [components/theme-provider.tsx](components/theme-provider.tsx)). The `@custom-variant light (&:where(.light, .light *))` line is what makes Tailwind's implicit dark-first tokens work.

Custom utility classes defined in this file: `container-page` (page width + responsive padding), `label-mono` (uppercase mono section eyebrow), `tag-chip` (bordered uppercase category chip), `panel` (bordered card surface), `link-underline` (animated hover underline), `cursor-blink` (blinking terminal cursor). `.article-body` provides full prose typography for future article content, including a CSS-generated `## ` prefix on `h2`.

### The "terminal window" motif is a reusable chrome component

[components/terminal-window.tsx](components/terminal-window.tsx) exports `TerminalWindow` (the bordered window with red/amber/green dots) and `Prompt` (a `$ command` line). This is the site's signature visual device and is reused anywhere content should look like terminal output (currently the homepage hero; intended for code samples and the newsletter box too).

### Component conventions

- Server components by default; `"use client"` only where interactivity is needed (`theme-provider.tsx`, `site-header.tsx` for mobile menu state, `theme-toggle.tsx`).
- Path alias `@/*` maps to the repo root (see [tsconfig.json](tsconfig.json)) — import as `@/lib/articles`, `@/site.config`, `@/components/...`.
- Category-colored UI (chips, coverage grid) reads `color` off `site.config.ts` categories and applies it via inline `style`, since Tailwind can't statically pick up dynamic CSS-variable class names.

## Roadmap (for context on scope)

- ~~Step 2 — article page, category pages, MDX rendering, related posts~~ done
- ~~Step 3 — Payload CMS + Postgres, replacing `lib/articles.ts`~~ done
- ~~Step 4 — SEO: JSON-LD, sitemap, RSS, OG image generation~~ done
- Step 5 — newsletter API + Resend (done), search (done), deploy to Vercel (not started)

Don't build ahead of the current step unless asked.

### Search (Step 5)

`/search` is a fully client-side live filter, not a server round trip per keystroke: `app/(frontend)/search/page.tsx` fetches the full article list once (server-side, via the same cached `getArticles()`) and hands it to `components/search-client.tsx` (`"use client"`), which filters in the browser on every keystroke via `lib/search-match.ts`'s `matchesQuery`. `lib/articles.ts` also exposes an async `searchArticles(query)` for any future server-side use, built on the same matcher. Fine at this content scale (tens of articles); revisit if the catalog grows into the hundreds.

### Newsletter (Step 5)

Double opt-in via a `subscribers` Payload collection (`collections/Subscribers.ts`) + Resend. Flow: `NewsletterBox` (client) → `POST /api/newsletter` → `lib/newsletter.ts#subscribe` creates/reuses a `subscribers` row with a random `confirmToken` and emails a confirm link via Resend → `GET /api/newsletter/confirm?token=...` → `lib/newsletter.ts#confirmSubscription` marks it confirmed and redirects to `/newsletter/confirmed`. Needs `RESEND_API_KEY` in `.env.local`; `RESEND_FROM_EMAIL` defaults to Resend's shared `onboarding@resend.dev` sender (works without domain verification) — swap it for a verified-domain address once `siteConfig.url` is a real domain. Without `RESEND_API_KEY` set, `subscribe()` just logs the confirm link instead of emailing it (dev fallback, not an error).

### Client/server bundle boundary — a real gotcha hit during Step 5

`lib/articles.ts` imports Payload's server-only SDK (`getPayload`, `@payload-config`). Early in Step 5, `components/search-client.tsx` (a `"use client"` component) imported `type Article` and `article-card.tsx` imported the real `formatDate` function from `lib/articles.ts` — since `article-card.tsx` is now reachable from a client component, Turbopack tried to bundle *all* of `lib/articles.ts`, including the Payload/Postgres imports, into the browser bundle, and the build failed hard (`file-type` package incompatibility deep in Payload's upload code). Fix: `lib/article-types.ts` holds the plain `Article` type and `formatDate` — zero server-only imports — and `lib/articles.ts` re-exports both for convenience. **Any component that might end up inside a `"use client"` tree must import `Article`/`formatDate` from `lib/article-types`, never from `lib/articles`**, even for a type-only import, to stay safe by construction.

### Migrations need `y` piped on first run after a dev-push project

`payload migrate` prompts "It looks like you've run Payload in dev mode... proceed? (y/N)" any time the project has push-mode history (ours does, from Step 3's initial setup) — it hangs forever with no output in a non-interactive shell. Run it as `echo "y" | npm run migrate`, and read the actual migration file first to confirm it's additive before agreeing — the prompt's "data loss will occur" wording is boilerplate, not a description of that specific migration.

### SEO surface (Step 4)

- `app/(frontend)/sitemap.ts` → `/sitemap.xml`, `app/(frontend)/rss.xml/route.ts` → `/rss.xml`. Both work fine inside the `(frontend)` route group.
- `app/robots.ts` → `/robots.txt` lives at the **true app root**, not inside `(frontend)` — Next.js did not pick it up from inside the route group (unlike `sitemap.ts`, which does work there). If robots.txt ever needs edits, keep it at `app/robots.ts`.
- `NewsArticle` + `BreadcrumbList` JSON-LD is inlined directly in `article/[slug]/page.tsx`; `BreadcrumbList` only on `category/[slug]/page.tsx`.
- OG images are dynamic via `next/og`'s `ImageResponse`: `app/(frontend)/opengraph-image.tsx` (site-wide default) and `app/(frontend)/article/[slug]/opengraph-image.tsx` (per-article, colored by category). Category-to-color mapping is hardcoded in that file (`CATEGORY_COLORS`) since Satori can't resolve the CSS custom properties `site.config.ts` normally uses.
- `siteConfig.url` in `site.config.ts` is still the placeholder `https://example.com` — sitemap/RSS/OG-image/JSON-LD URLs all derive from it, so set it to the real domain before deploying (Step 5).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Manga Spelling

Spelling-test PWA for the English statutory word lists (Years 3–6), built with Qwik City and exported as a static site. See `README.md` for features.

## Commands

- `npm run dev` — dev server (SSR mode)
- `npm run build` — client build + static-adapter server build; output in `dist/`
- `npm run build.types` / `npm run lint` / `npm run fmt.check` — type check, lint, prettier check

## Layout

- `src/routes/` — `index.tsx` (home), `play/`, `map/` (heat map), `layout.tsx` (settings context, theme)
- `src/data/words.ts` — word lists; word families (e.g. eight / eighth) count as one entry
- `src/lib/` — `settings.ts` and `progress.ts` (both `localStorage`, keys prefixed `manga-spell:`)
- `src/components/` — `mochi`, `keyboard`, `tx` (English/katakana text), `lang-toggle`, `game-bits`, `icon`
- `src/fonts.css` + `public/fonts/` — self-hosted fonts (Fontsource woff2: Latin plus katakana slices only; `index.json` lists files for SW precache). If a word list/UI ever needs other Japanese glyphs, add the slices covering them and update `index.json`.
- `public/audio/` — pre-rendered speech (Amazon Polly, neural, en-GB "Arthur", eu-west-1), committed to the repo; `index.json` lists files for SW precache. Per word form: `<word>.mp3`, `<word>-slow.mp3`, `<word>-sentence.mp3` (names via `src/lib/audio.ts`). After adding or changing words/sentences run `node scripts/generate-audio.mjs` (needs AWS CLI credentials; skips existing files, `--force` regenerates). `src/lib/speak.ts` plays the clips and falls back to browser speech synthesis if one can't play. Hints/tips are text only and not voiced.
- `public/sw.js` — service worker; precaches pages, every bundle in `q-manifest.json`, fonts and audio. Audio is served with `Range` support (iOS Safari needs it). Bump `CACHE` (`manga-spell-vN`) when changing its caching logic.

## Deployment

- Hosted on GitHub Pages at **https://manga-spell.euans.space** (repo `euangoddard/manga-spell`, branch `main`).
- `.github/workflows/deploy.yml` builds and deploys on every push to `main` (and manual dispatch). Actions are pinned to exact latest versions: checkout v7.0.1, setup-node v7.1.0, configure-pages v6.0.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1. When asked to update, check `gh api repos/actions/<name>/releases/latest`.
- Custom-domain places that must stay in sync (no `CNAME` file: with Actions deploys the domain is set in repo settings, and a `CNAME` file is ignored):
  - `adapters/static/vite.config.ts` — `staticAdapter({ origin })`, used for the generated sitemap
  - `public/robots.txt` — `Sitemap:` URL
  - `public/sitemap.xml` (hand-written; the adapter's generated sitemap is disabled) and `SITE` in `src/components/router-head/router-head.tsx` (canonical, Open Graph and JSON-LD URLs)
- SEO: `router-head.tsx` emits description, canonical, Open Graph, Twitter card and JSON-LD (home only). `/play/` and `/map/` are `noindex` and left out of the sitemap. `public/og-image.png` is 1200×630.
- The site is served from the domain root, so no Vite/Qwik `base` is set and all asset paths in the manifest, service worker and `<head>` are root-relative. Do not set a base path.
- One-time manual setup (not in code): repo Settings → Pages → Source = **GitHub Actions**; Custom domain = `manga-spell.euans.space` with "Enforce HTTPS"; DNS for `euans.space` needs a `CNAME` record `manga-spell` → `euangoddard.github.io`.

## Conventions

- Prettier formatting, double quotes, Qwik `component$` style; match surrounding code.
- Progress and settings never leave the device; don't add network calls or analytics.

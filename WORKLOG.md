# WORKLOG — Calliper Creations storefront (workspace `aahgosh`)

> Resume note: read this file first. It holds what is done, what is half-done,
> and what comes next, so a new session can continue without re-discovering the
> project. Append a dated entry under "Changelog" after every work session.

Last updated: 2026-11-12

## What this is

A make-to-order gift shop storefront (Next.js 15 App Router) plus a small
password-protected admin dashboard for managing products and storefront copy.
Working directory `D:\MIRZA DIGITAL\aahgosh`. The shop is **Calliper Creations**
(Instagram **@calliper_creations**): vintage letters, journaling frames, cards,
phone cases and scrapbooks, made to order. The "Aghoash" name left over in the
brief/Docker image is not being applied to the content (decision 2026-11-11).

Git remote: `https://github.com/tamseelasanavu/caliper.git` (single commit
`83309e8 Initial commit`; the working tree holds a further uncommitted batch —
the admin/CMS work).

## Stack

- Next.js 15.5 (`app/` router, server components, server actions), React 19, TS 5.
- Tailwind CSS v4 (`@import "tailwindcss"` + `@theme` in `app/globals.css`).
- Fonts via `next/font/google`: Rokkitt (display) + Literata (body).
- No database. Data is JSON in `data/` (`products.json`, `settings.json`) read
  and written through `lib/data-store.ts` (`DATA_DIR`, default `./data`, process
  level write queue, atomic temp-file rename).
- Auth: single shared admin password, HMAC-signed httpOnly cookie (`lib/auth.ts`).
  The password can be changed from the dashboard; the new one is stored as a
  scrypt hash in `data/admin-auth.json` (or Blob) and overrides `ADMIN_PASSWORD`.
- Product photos: project's own Instagram photos in `public/assets/calliper/`,
  downloaded open-collection images in `public/assets/`, user uploads in
  `public/uploads/` (git-ignored, created at runtime).

## Where the work stands

Build is green: `npm run build` passes (type check included). `npm run lint`
calls the deprecated `next lint` and asks to configure ESLint — **no ESLint
config exists yet** (open decision, see below).

Done:
- Storefront: home (`app/page.tsx`), catalogue (`app/products`), product detail
  with customisation form + Instagram-DM order flow (`app/products/[slug]`).
- Theme and type system applied from the dealt design direction
  (`.taste-skill/direction.json`): green-black/bone palette, Rokkitt + Literata,
  "the page is the object" composition.
- Admin: login, dashboard, product list/search, product create/edit (details,
  photo manager, drag-order images, customisation-field builder), storefront
  settings editor, uploads API. Server actions in `app/admin/actions.ts`.
- Dockerfile (multi-stage, `DATA_DIR=/app/data`) and `.env.example`.

Half-done / not started:
- **Brand decision (settled 2026-11-11):** keep **Calliper Creations** and the
  handle **@calliper_creations**. The Aghoash name in the workspace/brief and
  Docker image is not being applied to the content. No mass rename.
- Design-skill gate: storefront pages now show **0 FAIL** at 1440/768/390
  (`inspect.mjs`). Remaining WARNs are listed under "Known warnings".
- ESLint is configured (flat config `eslint.config.mjs`, `eslint` 9 +
  `eslint-config-next`); `npm run lint` runs `eslint .` and is clean
  (0 errors, 0 warnings). The build also runs the TypeScript check.
- No `app/not-found.tsx` — **added 2026-11-11**; sitemap/robots/OG also added.
- Instagram feed still uses the local `FALLBACK_FEED`; `/api/instagram/feed`
  returns a one-item placeholder and is not called from the home page.
- Nothing beyond the initial import is committed (see git status) — do not commit
  until asked.

## Known warnings (accepted / to revisit)

From `inspect.mjs` (no FAILs):
- Home: ragged text edges (8 anchor lines) — WARN only.
- Product detail: mobile order button below the first screen; one 1px outlined
  box (customisation form); margins 12px vs 40px at 1440; 9 moving elements
  (target 16); no video on the page.
- Products: no video on the page.
- Admin login: uses the system UI font on purpose (app screen), so
  `inspect.mjs --app` reports `font-not-dealt`; tiny "Password" label; centered
  card leaves canvas unused. Run the gate with `--allow font-not-dealt`.

## Verify / run

```powershell
npm run build          # type check + production build (green 2026-11-11)
npm run lint           # ESLint flat config (clean 2026-11-11)
npm run dev            # dev server, default port 3000
npm run start          # serve the production build
```

Vercel: team `caliper5`, project `caliper-creations`, production
**https://caliper-creations.vercel.app** (Next.js preset, Node 26.x, region iad1).
GitHub `tamseelasanavu/caliper` is connected; `vercel link` created
`.vercel/repo.json` + `.env.production.local` (both git-ignored). Deploy manually
with `npx vercel --prod` if a push does not trigger a build.
The project has `vercel_authentication` deployment protection; production is
currently public (verified 200 on `/`, `/products`, `/admin/login`).

Admin at `/admin/login`. Dev fallback password is `calliper-admin` when
`ADMIN_PASSWORD` is unset and `NODE_ENV !== production`. Once the password is
changed in the dashboard (Storefront → Admin password), the stored hash is used
instead; `ADMIN_PASSWORD` becomes only the initial seed and can be rotated
without a redeploy.

Env (see `.env.example`): `ADMIN_PASSWORD`, `ADMIN_SECRET`, optional `DATA_DIR`,
`ADMIN_COOKIE_SECURE`.

Deploy (Docker, from the project root):

```powershell
docker build -t calliper-creations .
docker run -d --name calliper-app --restart unless-stopped -p 3000:3000 \
  -e ADMIN_PASSWORD=... -e ADMIN_SECRET=... calliper-creations:latest
```

(The old image name `aghoash-mvp` is legacy; content stays Calliper. Docker
Desktop was not running at the time of this audit.)

## Key files

| Path | Role |
| --- | --- |
| `app/layout.tsx` | fonts, metadata, navbar/footer chrome |
| `app/page.tsx` | home (featured pieces, how-it-works, Instagram) |
| `app/products/[slug]/page.tsx` | product detail + customisation |
| `app/admin/*` | dashboard pages + server actions |
| `app/products/page.tsx` | catalogue header (full-bleed image band) + filter/grid |
| `app/not-found.tsx` | branded 404 |
| `app/sitemap.ts`, `app/robots.ts` | SEO routes (disallow `/admin`, `/api`) |
| `lib/site.ts` | `getSiteUrl()` for canonical/OG/sitemap |
| `components/product/*` | storefront sections and forms |
| `components/admin/*` | dashboard UI |
| `lib/*` | data store, products, settings, auth, categories, order message |
| `.taste-skill/direction.json` | dealt design direction (art direction source) |

## Next up (ordered)

1. Confirm the real Instagram handle (currently `calliper_creations` in
   `lib/settings.ts` and `data/settings.json`) and phone/contact details.
2. Add CI checks (`npm run lint && npm run build`) once a CI target exists.
3. Expand the catalogue content (products, photos, copy) and swap
   `@calliper_creations`/feed data if the handle changes.
4. Set Vercel env `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`; move
   the JSON store to Vercel Blob/KV if the admin must work in production.
5. Redeploy the Docker image (`docker build -t calliper-creations .`) if hosting
   on a writable filesystem instead.

## Changelog

### 2026-11-12 — session 5 (admin password change)

- Added in-dashboard password change: `changePasswordAction` in
  `app/admin/actions.ts`, `components/admin/password-form.tsx`, rendered as the
  "Admin password" section on `/admin/settings`.
- `lib/auth.ts` now stores a scrypt-hashed credential (`salt`, `hash`,
  `updatedAt`) in `data/admin-auth.json` through the data store, so it survives
  redeploys on Vercel Blob and overrides `ADMIN_PASSWORD`. Passwords need 8–200
  characters; the current password is required to change it.
- Session tokens are now `v2` and include a credential revision (hash prefix), so
  changing the password signs out every other session; the active session is
  reissued after the change.
- `isAdminConfigured`, `passwordMatches`, `usesDefaultPassword` are async; login
  page passes `configured` to `LoginForm`. Shared limits live in
  `lib/auth-constants.ts` (client-safe).
- `.gitignore` excludes `data/admin-auth.json`; `.env.example` documents the
  dashboard override. `npm run lint` and `npm run build` pass.
- Note: when Blob storage is enabled the hash lives in a public-access blob, so
  the store URL is the only protection; the scrypt salt/hash keeps it from being
  directly usable. Keep `ADMIN_SECRET` set so session signatures do not fall back
  to the password.

### 2026-11-11 — session 4 (Vercel 404)

- `caliper-creations.vercel.app` returned Vercel's edge `NOT_FOUND`: the only
  production deployment (12:22, from the empty/reset repo state) had no working
  output attached to the domain. Build logs showed the deployment was Ready.
- Confirmed the repo had been reset to empty both locally and on GitHub; remote
  recreated earlier this session at `4e009d4`.
- Verified Vercel auth via `npx vercel` (scope `caliper5`, project
  `caliper-creations`), linked the folder (`vercel link`), deployed with
  `npx vercel --prod`. Production now serves `/`, `/products`,
  `/products/[slug]`, `/admin/login` with 200 and correct canonical URL.
- `vercel git connect` reports `tamseelasanavu/caliper` already connected.
- Note: on Vercel the filesystem is read-only, so JSON writes/uploads from the
  admin will fail; storefront reads work. A durable store (Blob/KV/DB) is needed
  for a live CMS there.

### 2026-11-11 — session 3 (ESLint)

- Added `eslint.config.mjs` (flat config via `FlatCompat` + `next/core-web-vitals`
  and `next/typescript`), ignoring `.next`, `node_modules`, `tmp`,
  `public/uploads`, `next-env.d.ts`.
- Installed `eslint@9.39.5`, `eslint-config-next@15.5.29`, `@eslint/eslintrc`.
- Changed the `lint` script from `next lint` to `eslint .`.
- Fixed the one error (`<a href="/products">` → `next/link`) and the unused
  `Image`/`value` in `file-upload-widget.tsx`; turned off `no-img-element` for
  admin/preview files (dynamic upload sources).
- `npm run lint` and `npm run build` both pass. Note: a killed `npm install`
  corrupted `@next/swc-win32-x64-msvc`; reinstall that platform package if
  `next build` reports "not a valid Win32 application".

### 2026-11-11 — session 2 (design gate + production polish)

Brand: user confirmed keeping **Calliper Creations** / `@calliper_creations`.

Design gate (`.taste-skill/inspect.mjs`), after fixes:
- `/` — **0 FAIL**; 1 WARN (ragged text edges).
- `/products` — **0 FAIL**; 1 WARN (no video).
- `/products/customised-vintage-letter` — **0 FAIL**; WARNs: one 1px outlined
  box, no video, off-centre margins, 9 moving elements, mobile first-action.
- `/admin/login` (`--app`) — 1 FAIL `font-not-dealt` (system UI font is
  deliberate for the admin); WARNs: micro-label, unused canvas.

Fixes and additions:
- Removed hairlines (nav, footer, cards, hero, sections), card shadows, login
  gradient/shadow, `backdrop-blur`; de-boxed how-it-works; `transition-all` →
  explicit; skip link via `clip-path`; `min-h-svh`; flat Instagram caption
  scrim; lighter `--color-muted` for contrast.
- Home hero: panel first on mobile, headline shortened (`heroTitle` →
  "Calliper Creations", `heroTitleAccent` → "Made to order."), card eyebrow
  removed, category moved into bottom strip, larger section spacing.
- Products: header restructured to heading + full-bleed image band
  (`h-[42svh]`/`md:h-[46svh]`) to fix the `focal-point` FAIL; filter buttons
  get staggered reveals (fixes `still-page`).
- Product detail: details column first on small screens, gallery reveals,
  related-products fallback to other products, category label below `h1`,
  canonical/OG metadata.
- Added `app/not-found.tsx`, `app/robots.ts`, `app/sitemap.ts`, `lib/site.ts`,
  `NEXT_PUBLIC_SITE_URL` in `.env.example`; layout OG/Twitter/robots metadata.
- Instagram posters added (`InstagramPost.poster`) for `<video poster>`.

Verified: `npm run build` green; `/robots.txt` and `/sitemap.xml` return
expected content (localhost base without `NEXT_PUBLIC_SITE_URL`); unknown routes
return 404.

### 2026-11-11 — session 1 (resume + audit)

- Reconstructed project state from git, filesystem timestamps, the deployed
  Docker image name (`aghoash-mvp`), `.taste-skill/direction.json` and
  `public/assets/credits.json`.
- Confirmed `npm run build` passes on the working tree.
- Wrote this log.

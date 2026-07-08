# Catalyst Applied AI Website (catalyst-applied-ai)

Production marketing site for **Catalyst Applied AI (CAAi)**: *production AI deployed
inside your environment* (RAG, agentic workflows, workforce intelligence, and
domain-trained AI agents; government and enterprise ready).

React (Vite) SPA + Cloudflare Worker contact API. Cloudflare fronts the DNS/CDN for
[catalystappliedai.com](https://catalystappliedai.com).

## Remotes and deploy reality (verified 2026-07-07)

- **Two synced remotes, one codebase:**
  - GitHub `kennethwallace21-sys/Company_Website`
  - GitLab `caai-main-group/caai_website` (the original repo, used by CAAI's GitLab agents)
  Keep BOTH in sync: push every change to both remotes.
- **Live host:** Cloudflare Worker named `website`, built by Workers Builds from this
  repo. Push to `main` on either synced remote and the live site deploys in about 5
  minutes.
- `wrangler.jsonc` must keep `name: "website"`, `main: "src/worker.js"`, and
  `assets.directory: "./dist"`. The Worker serves `/api/send-email`; static assets and
  SPA fallback are handled by Workers static assets.
- **Vercel:** `caaiwebsite.vercel.app` is only a preview mirror and currently has no
  production contact-form secrets. The public domain is not served from Vercel.
- If HTML looks stale after a Cloudflare deploy, purge the zone cache before assuming
  the build failed.

> Older repos: GitHub `CAAi-company-website` (static HTML, GitHub Pages era) is
> archived/retired. Do not use it.

---

## Stack

- **Vite + React (JSX)**, Tailwind CSS, Radix UI / shadcn-style components
- **Routing:** client-side; Workers static assets handle SPA fallback for non-asset paths
- **Worker API:** `/api/send-email` in `src/worker.js`
- **Lead pipeline:** Worker → **Resend** email, optional MongoDB Atlas Data API save,
  client-side Web3Forms fallback
- **Deploy:** Cloudflare Workers Builds from `main`

## Local development

```bash
npm install
npm run dev        # vite dev server
npm run build      # production build (outputs dist/)
npm run preview    # serve the build locally
npm run lint
```

Create a local `.env`/`.env.local` for build-time Vite vars. Set Worker runtime secrets
with `wrangler secret put` or in the Cloudflare dashboard.

## Required environment variables

The contact form falls back to Web3Forms without these, but Resend delivery will not be
active until they are set.

| Variable | Used by | Notes |
|----------|---------|-------|
| `RESEND_API_KEY` | `src/worker.js` | Resend API key. If unset, the browser falls back to Web3Forms. |
| `RESEND_TO_EMAIL` | `src/worker.js` | Where leads are delivered. Set this to the real sales inbox. |
| `RESEND_FROM_EMAIL` | `src/worker.js` | Verified Resend sender for `catalystappliedai.com` or a verified subdomain. |
| `TURNSTILE_SECRET_KEY` | `src/worker.js` | Optional. Enables server-side Turnstile verification when set. |
| `VITE_TURNSTILE_SITE_KEY` | Browser bundle | Optional. Build-time public site key that renders the Turnstile widget. |
| `MONGODB_DATA_API_KEY` | `src/worker.js` | Optional. Enables best-effort lead persistence through MongoDB Atlas Data API. |
| `MONGODB_DATA_API_URL` | `src/worker.js` | Optional. Atlas Data API endpoint ending before `/action/insertOne`. |
| `MONGODB_DATA_SOURCE` | `src/worker.js` | Optional. Defaults to `CatalystAppliedAI`. |
| `MONGODB_DATABASE` | `src/worker.js` | Optional. Defaults to `catalyst_db`. |
| `MONGODB_COLLECTION` | `src/worker.js` | Optional. Defaults to `contacts`. |

After setting Resend/Turnstile values, submit a real browser test from the live contact
form. Do not use curl or headless checks as the final proof; anti-abuse services can
reject non-browser traffic.

## SEO & social

`index.html` holds the crawlable metadata (the SPA is client-rendered, so crawlers and
link-preview bots mostly read this file — keep it in sync with the site's real
positioning). It includes title/description/keywords, Open Graph + Twitter cards,
Organization/WebSite/Services/Products JSON-LD, and a `<noscript>` fallback.

**Share image:** `public/og-cover.png` (1200×630). To edit, change the source
`public/og-cover.svg` and rasterize:

```bash
npm i @resvg/resvg-js
node -e 'const fs=require("fs"),{Resvg}=require("@resvg/resvg-js");const b="public/";const png=new Resvg(fs.readFileSync(b+"og-cover.svg","utf8"),{fitTo:{mode:"width",value:1200},font:{loadSystemFonts:true}}).render().asPng();fs.writeFileSync(b+"og-cover.png",png);'
```

Validate previews at <https://www.opengraph.xyz>. Other SEO files: `public/robots.txt`,
`public/sitemap.xml`, `public/manifest.json`.

## Related products / subdomains

These are **separate deployments** (a FastAPI app in the `caai-ops` repo), not part of
this site. They were returning 5xx errors as of last check — investigate separately:

- `commandcenter.catalystappliedai.com` — CAAi Command Center
- `gov-products.catalystappliedai.com` — CAAi CLERK
- `custom-models.catalystappliedai.com` — Catalyst Custom Models

## Notes / backlog

- [ ] Set the Worker Resend secrets/build vars and send a real live-browser test lead.
- [ ] If apex HTML preview looks stale after a deploy, **purge the Cloudflare cache**.
- [ ] Investigate the product subdomains' 5xx errors (caai-ops).
- [ ] Consider server-side rendering / prerender for richer crawler content (currently
      client-rendered with a `<noscript>` fallback).

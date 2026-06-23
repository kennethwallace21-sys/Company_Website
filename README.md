# Catalyst Applied AI — Website (catalyst-applied-ai)

Production marketing site for **Catalyst Applied AI (CAAi)** — *production AI deployed
inside your environment* (RAG, agentic workflows, workforce intelligence, and
domain-trained AI agents; government & enterprise ready).

**This is the live site at [catalystappliedai.com](https://catalystappliedai.com).**
React (Vite) SPA + serverless contact API, deployed on **Vercel** with Cloudflare in
front for DNS/CDN.

> A previous static-HTML version lived in the repo `CAAi-company-website` (GitHub Pages).
> It is **archived/retired** — do not use it. This repo is the single source of truth.

---

## Stack

- **Vite + React (JSX)**, Tailwind CSS, Radix UI / shadcn-style components
- **Routing:** client-side; `vercel.json` rewrites all non-`/api` paths to `index.html`
- **Serverless API:** `/api/*` (Vercel functions)
- **Lead pipeline:** `api/send-email.js` → email via **Resend** + persistence in **MongoDB** (Mongoose)
- **Deploy:** push to `main` → Vercel builds & deploys. PR branches get Vercel preview deploys.

## Local development

```bash
npm install
npm run dev        # vite dev server
npm run build      # production build (outputs dist/)
npm run preview    # serve the build locally
npm run lint
```

Create a `.env` (and set the same vars in **Vercel → Project → Settings → Environment
Variables**) — see below.

## Required environment variables

The contact form silently degrades without these — **leads can be lost if they're unset.**

| Variable | Used by | Notes |
|----------|---------|-------|
| `RESEND_API_KEY` | `api/send-email.js` | Resend API key. Without it, email send fails. |
| `RESEND_TO_EMAIL` | `api/send-email.js` | **Where leads are delivered.** Defaults to `delivered@resend.dev` (a black hole) if unset — set this to your real sales inbox. |
| `RESEND_FROM_EMAIL` | `api/send-email.js` | Verified Resend sender. Defaults to `onboarding@resend.dev`. |
| `MONGODB_URI` | `src/lib/mongodb.js` | MongoDB connection string. DB save is best-effort (email still sends if DB fails), but `mongodb.js` throws at import if unset. |

> ✅ Action for whoever owns deploy: confirm `RESEND_API_KEY` + `RESEND_TO_EMAIL` are set
> in Vercel, then submit a real test from the live contact form to confirm delivery.

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

- [ ] Verify Resend env vars in Vercel and send a live test lead (see above).
- [ ] If apex HTML preview looks stale after a deploy, **purge the Cloudflare cache**
      (Cloudflare caches in front of Vercel).
- [ ] Investigate the product subdomains' 5xx errors (caai-ops).
- [ ] Consider server-side rendering / prerender for richer crawler content (currently
      client-rendered with a `<noscript>` fallback).

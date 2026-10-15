# Catalyst Applied AI Website (catalyst-applied-ai)

Production marketing site for **Catalyst Applied AI (CAAi)**: *production AI deployed
inside your environment* (RAG, agentic workflows, workforce intelligence, and
domain-trained AI agents; government and enterprise ready).

React (Vite) SPA + Cloudflare Worker contact API. Cloudflare fronts the DNS/CDN for
[catalystappliedai.com](https://catalystappliedai.com).

## Remotes and deploy reality (verified 2026-07-07)

- **Two synced remotes, one codebase:**
  - GitHub `Company_Website` (the `origin` remote)
  - GitLab `caai-main-group/caai_website` (the original repo, used by CAAI's GitLab agents)
  Keep BOTH in sync: push every change to both remotes.
- **Live host:** Cloudflare Worker named `website`, built by Workers Builds from this
  repo. Push to `main` on either synced remote and the live site deploys in about 5
  minutes.
- `wrangler.jsonc` must keep `name: "website"`, `main: "src/worker.js"`, and
  `assets.directory: "./dist"`. The Worker serves `/api/send-email`; static assets and
  SPA fallback are handled by Workers static assets.
- **Vercel:** the public domain is not served from Vercel, and no Vercel code remains in
  this repo.
- If HTML looks stale after a Cloudflare deploy, purge the zone cache before assuming
  the build failed.

> Older repos: GitHub `CAAi-company-website` (static HTML, GitHub Pages era) is
> archived/retired. Do not use it.

---

## Stack

- **Vite + React (JSX)**, Tailwind CSS, Radix UI / shadcn-style components
- **Routing:** client-side; Workers static assets handle SPA fallback for non-asset paths
- **Worker API:** `/api/send-email` in `src/worker.js`
- **Lead pipeline:** browser form → Worker (`/api/send-email`) → **Resend** email to the
  sales mailbox, with `reply_to` set to the lead. There is no database and no
  client-side fallback; the mailbox is the only store.
- **Analytics:** Cloudflare Web Analytics (cookieless beacon injected by Cloudflare)
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

## Environment variables

Resend delivery will not work until the three Resend values are set.

| Variable | Kind | Used by | Notes |
|----------|------|---------|-------|
| `RESEND_API_KEY` | Worker secret | `src/worker.js` | Resend API key. |
| `RESEND_TO_EMAIL` | Worker secret | `src/worker.js` | Where leads are delivered. Set this to the real sales inbox. |
| `RESEND_FROM_EMAIL` | Worker secret | `src/worker.js` | Verified Resend sender for `catalystappliedai.com` or a verified subdomain. |
| `TURNSTILE_SECRET_KEY` | Worker secret (optional) | `src/worker.js` | Enables server-side Turnstile verification when set. |
| `VITE_TURNSTILE_SITE_KEY` | Build variable (optional) | Browser bundle | Public site key that renders the Turnstile widget on the contact page only. |

After setting Resend/Turnstile values, submit a real browser test from the live contact
form. Do not use curl or headless checks as the final proof; anti-abuse services can
reject non-browser traffic.

## SEO & social

`index.html` holds the crawlable metadata (the SPA is client-rendered, so crawlers and
link-preview bots mostly read this file, so keep it in sync with the site's real
positioning). It includes title/description/keywords, Open Graph + Twitter cards,
Organization/WebSite/Services/Products JSON-LD, and a `<noscript>` fallback.

**Share image:** `public/og-cover.png` (1200×630). It is a committed PNG; replace the
file directly to change it.

Validate previews at <https://www.opengraph.xyz>. Other SEO files: `public/robots.txt`,
`public/sitemap.xml`, `public/manifest.json`.

## Related products / subdomains

Product subdomains are served from the caai-ops repo and are not linked from this site.

## Notes / backlog

- [ ] Set the Worker Resend secrets/build vars and send a real live-browser test lead.
- [ ] If apex HTML preview looks stale after a deploy, **purge the Cloudflare cache**.
- [ ] Consider server-side rendering / prerender for richer crawler content (currently
      client-rendered with a `<noscript>` fallback).

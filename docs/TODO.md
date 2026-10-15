# Website open items (updated 2026-07-08)

Deploy pipeline (verified end-to-end 2026-07-07): the live domain is served by a
Cloudflare **Worker** named `website` (static assets + SPA fallback), auto-built by
**Workers Builds** from this repo. Push to `main` on either remote and it deploys live
in about 5 minutes: no dashboard steps required. Keep GitHub
`Company_Website` and GitLab `caai-main-group/caai_website` main
pushed in lockstep (push both). `wrangler.jsonc` must keep `name: "website"` and
`assets.directory: "./dist"`; removing either breaks the deploy step even though the
build step still succeeds (bit us 2026-07-07: two failed deploys before both fields
were correct). If HTML looks stale after a push, purge the zone cache using the
Cloudflare deploy token stored outside the repo; zone id in the password manager.
See README "Remotes and deploy reality".

## Owner decisions 2026-10-15

- (d) Cloudflare Web Analytics stays enabled; it is allowed in the CSP and disclosed in the Privacy policy.

- (a) Public git history exposure of the former Web3Forms key and the Cloudflare zone id is
  accepted as-is (no history rewrite); the key is to be rotated instead.
- (b) The SAM.gov registration claim is removed from the site until UEI and CAGE are
  available.

## Contact form status: Worker is the only intake, Resend configured

- `/api/send-email` runs through the Cloudflare Worker (`src/worker.js`). It handles
  CORS, rate limiting, honeypot rejection, input validation, optional Turnstile
  verification, an idempotency key, and Resend delivery. The Worker is the only intake
  path: there is no client-side fallback and no database. Persistence is intentionally
  the mailbox only until a D1/KV store is added.
- Resend is confirmed configured in production as of 2026-10-14 (`RESEND_API_KEY`,
  `RESEND_TO_EMAIL`, `RESEND_FROM_EMAIL`); a valid POST returned 200 with a message id.
- `src/components/home/ContactSection.jsx` renders Cloudflare Turnstile only when
  `VITE_TURNSTILE_SITE_KEY` is present at build time. The Worker verifies Turnstile
  only when `TURNSTILE_SECRET_KEY` is set. Turnstile is enforced since 2026-10-15: the public site key ships via .env.production and
  TURNSTILE_SECRET_KEY is set on the Worker; a POST without a valid token returns 403 (verified live).

## P3: Smaller cleanups

- [x] Vercel analytics call 404s/console-errors on the domain (not Vercel-hosted);
      removed 2026-07-05.
- [ ] Mirror the footer social badges onto the product subdomain pages served by
      caai-ops (`ui/static/clerk.html`, `custom-models.html`). Decided 2026-07-07: not
      doing this for now, revisit only if asked.
- [ ] Mail DNS cleanup: see the private ops notes.
- [ ] Legacy copy sweep: Terms/Privacy pages still carry a few em dashes and dated
      language outside the marketing surfaces addressed 2026-07-05.
- [ ] Vercel project: decommission or leave as an inert mirror.
- [x] Owner risk acceptance 2026-10-15: leads are stored only in the sales mailbox (no database). Accepted by the owner in chat on 2026-10-15; revisit if lead volume or retention requirements change. Controls CP-9, AU-12.
      database). Accept in writing or schedule a D1/KV store. Controls CP-9, AU-12.
- [x] Old Web3Forms access key neutralized 2026-10-15: the form now requires hCaptcha, so posts carrying the leaked key without a captcha token are rejected; server-side posts were already refused on the free plan. The form is unused by the site.
      public git history).
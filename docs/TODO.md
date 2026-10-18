# Website open items (updated 2026-10-18)

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
- (e) Owner decision 2026-10-15: the Team page is retired permanently; the former team photos and personal details were removed from the tree. They remain in public git history (see the history-exposure decision above).

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
  only when `TURNSTILE_SECRET_KEY` is set. Turnstile is enforced: the public site key
  ships via .env.production, and the secret is a runtime secret on the `website` Worker
  (Settings > Variables and Secrets, never a build variable). The only widget is
  "catalystappliedai.com contact form" (site key `0x4AAAAAAFXypB_E-uPhm5ga`); its
  hostname `catalystappliedai.com` also covers `www.` (Turnstile authorizes subdomains).
- Outage 2026-10-16 00:22Z to 2026-10-18 01:02Z (about 49 hours): the Worker held a
  value that was not the widget's secret, so siteverify answered `invalid-input-secret`
  and every real submission got a 503 (the form showed the email fallback). A dashboard
  re-entry at 2026-10-16 01:59Z put in another wrong value; the widget's real secret
  went in on 2026-10-18. Nothing alerted on it.
- After any change to `TURNSTILE_SECRET_KEY`, `VITE_TURNSTILE_SITE_KEY` or
  `src/worker.js`, run `npm run check:live` (or `node scripts/check-live.mjs
  <preview-url>`). It must print 4/4: a POST with an invalid token gets 403; 503 means
  the secret is wrong or siteverify is down. It sends no email. It cannot tell whether
  the secret belongs to this widget or whether Resend delivers, so then send one real
  message from /Contact and confirm it arrives.
- `.github/workflows/contact-form-monitor.yml` runs the same check against production
  at :17 and :47 every hour (GitHub Actions, free for this public repo). A failed run
  emails whoever last edited its cron line. GitHub pauses schedules in public repos
  after 60 days without repository activity; re-enable it from the Actions tab.
- `/api/send-email` is rate limited by the Workers Rate Limiting binding
  `CONTACT_RATE_LIMIT` (5 requests per 60 s per client IP, per Cloudflare location,
  namespace 41018), with the old in-memory Map as the fallback when the binding is
  missing. Cloudflare documents the binding as permissive and eventually consistent:
  on the 2026-10-18 preview, a 7-request burst inside about 2 s all got through, and
  sustained requests were refused with 429 within about 30 s. The in-memory Map it
  replaces refused nothing in the same burst against production (requests land on
  different isolates). A strict "429 on request 6" needs a zone rate limiting rule or
  a Durable Object counter; owner decision.

## P3: Smaller cleanups

- [x] Dependabot 2026-10-18: react-router 6.30.6 had two moderate advisories
      (GHSA-wrjc-x8rr-h8h6 open redirect via backslash in Link/useNavigate;
      GHSA-337j-9hxr-rhxg SSR hydration, not reachable in this client-only SPA) with no
      6.x fix; upgraded react-router-dom to 7.18.4. `npm audit --omit=dev` is clean.
- [ ] Dependabot GHSA-rj75-hqrm-r3gf (postcss-selector-parser < 7.1.6, CPU exhaustion
      on hostile selectors): dev/build-time only, pulled in by tailwindcss 3, which
      requires the 6.x line, and it only ever parses this repo's own CSS, so it is not
      reachable by visitors. It clears with a Tailwind v4 migration; until then the
      alert stays open for the owner to accept or dismiss.
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

## Before flipping SHOW_SERVICES back on (from the T024 review, 2026-10-16)

- Owner to confirm the new copy in src/data/offerings.js: the Discovery & Diagnostic description now matches the page subtitle, and the three nav group names (Architecture, Engineering, Automation & Enablement) and six taglines are new.
- Owner to accept that a tap on a collapsed accordion item navigates immediately (one tap, not two).
- Run a round 3 review (T027) on a scratch build with the flag on.

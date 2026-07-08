# Website open items (updated 2026-07-08)

Deploy pipeline (verified end-to-end 2026-07-07): the live domain is served by a
Cloudflare **Worker** named `website` (static assets + SPA fallback), auto-built by
**Workers Builds** from this repo. Push to `main` on either remote and it deploys live
in about 5 minutes: no dashboard steps required. Keep GitHub
`kennethwallace21-sys/Company_Website` and GitLab `caai-main-group/caai_website` main
pushed in lockstep (push both). `wrangler.jsonc` must keep `name: "website"` and
`assets.directory: "./dist"`; removing either breaks the deploy step even though the
build step still succeeds (bit us 2026-07-07: two failed deploys before both fields
were correct). If HTML looks stale after a push, purge the zone cache with the token
at `C:\Users\kenne\.cloudflare\claude-deploys.token` (zone id
`457c5260bc5194207e0daf632f202993`). See README "Remotes and deploy reality".

## Contact form status: Worker API ported, live secrets still required

- Implemented 2026-07-08: `/api/send-email` now runs through the Cloudflare Worker
  (`src/worker.js`) instead of the old Vercel-format function. The Worker handles
  CORS, rate limiting, honeypot rejection, input validation, optional Turnstile
  verification, optional MongoDB Atlas Data API persistence, and Resend delivery.
- `src/lib/submitLead.js` now tries the Worker first and falls back to Web3Forms when
  the Worker, Turnstile service, Resend, or required Worker config is unavailable.
  The Web3Forms path remains the stable client-side fallback verified 2026-07-06.
- `src/components/home/ContactSection.jsx` renders Cloudflare Turnstile only when
  `VITE_TURNSTILE_SITE_KEY` is present at build time. The Worker verifies Turnstile
  only when `TURNSTILE_SECRET_KEY` is set, so the rollout can happen without breaking
  the current fallback.
- Still required before calling this live-complete: find the Resend login/API key and
  set Worker secrets/vars (`RESEND_API_KEY`, `RESEND_TO_EMAIL`, `RESEND_FROM_EMAIL`,
  optional `TURNSTILE_SECRET_KEY`, optional MongoDB Data API vars) plus the build var
  `VITE_TURNSTILE_SITE_KEY` if Turnstile is enabled. Then verify with a real browser
  submission from the live page.

## P3: Smaller cleanups

- [x] Vercel analytics call 404s/console-errors on the domain (not Vercel-hosted);
      removed 2026-07-05.
- [ ] Mirror the footer social badges onto the product subdomain pages served by
      caai-ops (`ui/static/clerk.html`, `custom-models.html`). Decided 2026-07-07: not
      doing this for now, revisit only if asked.
- [ ] `msv1.invalid` leftover MX record and GoDaddy-default DMARC rua on the domain;
      now easy to clean up (CF token has DNS Read but not Write; add Write if pursuing
      this).
- [ ] Legacy copy sweep: Terms/Privacy pages still carry a few em dashes and dated
      language outside the marketing surfaces addressed 2026-07-05.
- [ ] Decide long-term host: the live Worker (current, working) vs the Vercel mirror
      (`caaiwebsite.vercel.app`, has zero env vars, its `api/send-email.js` path is
      dead). Vercel is currently just a preview mirror; either formally keep it as
      that or decommission to end the split-brain.

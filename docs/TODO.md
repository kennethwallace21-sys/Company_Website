# Website open items (updated 2026-07-07)

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

## NEXT UP: server-side contact form (Resend + Turnstile)

- Current state: the contact form delivers via Web3Forms client-side
  (`src/lib/submitLead.js`), live-verified 2026-07-06 and working. This is a stable
  fallback, not a dead end, keep it working even after the upgrade below.
- Upgrade available: DNS on the zone already has `resend._domainkey.catalystappliedai.com`
  and `send.catalystappliedai.com` (SPF for `amazonses.com`) records, meaning a Resend
  account was provisioned for this domain at some point. Find that Resend login (check
  password manager / whoever set up email sending) before starting this.
- The `development` git branch already has most of the work done: migrates the contact
  API to Cloudflare (Pages Functions era, will need porting to a Worker fetch handler
  or bound as the same Worker's routes) with Resend for delivery, Turnstile CAPTCHA,
  CORS, and input validation (commits `9a00ca0`, `b6e5710`). Review it, port anything
  that assumed Pages Functions to work with the Worker, then wire it up.
- Once ported: set env vars/secrets on the Worker (`RESEND_API_KEY`, `RESEND_TO_EMAIL`
  = real sales inbox, `RESEND_FROM_EMAIL`, Turnstile site/secret keys) via `wrangler
  secret put` or the dashboard. Verify with a real submission from the live page (same
  rule as Web3Forms: Resend/Turnstile will also reject non-browser test traffic, so
  test from the live site in a real browser, not curl or headless).
- Keep Web3Forms as a fallback path if the new endpoint errors, so a misconfigured
  secret never silently drops a lead again.

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

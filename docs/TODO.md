# Website open items (updated 2026-07-05)

Deploy pipeline (verified): push to GitLab `caai-main-group/caai_website` main and a
Cloudflare Pages build updates the live domain in a few minutes. Keep GitHub
`kennethwallace21-sys/Company_Website` main pushed in lockstep (Vercel preview mirror,
`caaiwebsite.vercel.app`). See README "Remotes and deploy reality".

## P1: Contact form does not deliver leads on the live domain

- `api/send-email.js` is Vercel-serverless format; Cloudflare Pages ignores it, so the
  form's POST hits the SPA rewrite and dies. Leads are silently lost.
- The `development` branch already migrates the API to Cloudflare Pages Functions and
  adds Turnstile CAPTCHA, CORS, and input validation (commits 9a00ca0, b6e5710).
- Plan: review that branch, rebase or cherry-pick onto current main, then set env vars
  (`RESEND_API_KEY`, `RESEND_TO_EMAIL` = real sales inbox, `RESEND_FROM_EMAIL`,
  `MONGODB_URI` if DB persistence is kept, Turnstile keys) in the Cloudflare Pages
  project settings. Verify with a real submission from the live page.
- Blocked on: access to the Cloudflare account that owns the Pages project.

## P2: Cloudflare account consolidation

- The zone and Pages project live in a Cloudflare account that is not the owner's
  personal-token account (token attempts saw zero zones). Identify the login, or plan a
  controlled migration. Until then: no cache purges, no Pages env vars, no cache-rule
  fixes.

## P3: Smaller cleanups

- [x] Vercel analytics call 404s/console-errors on the domain (not Vercel-hosted);
      removed 2026-07-05.
- [ ] Mirror the footer social badges onto the product subdomain pages served by
      caai-ops (`ui/static/clerk.html`, `custom-models.html`); ready-made markup exists
      in the archived static repo's last commit (C:\Users\kenne\Company_Website, 771399f).
- [ ] `msv1.invalid` leftover MX record and GoDaddy-default DMARC rua on the domain;
      clean up when DNS access exists.
- [ ] Legacy copy sweep: Terms/Privacy pages still carry a few em dashes and dated
      language outside the marketing surfaces addressed 2026-07-05.
- [ ] Decide long-term host: Cloudflare Pages (current) vs Vercel (has the serverless
      api/ as written). Whichever wins, decommission the other to end the split-brain.

# Website open items (updated 2026-07-05)

Deploy pipeline (verified): push to GitLab `caai-main-group/caai_website` main and a
Cloudflare Pages build updates the live domain in a few minutes. Keep GitHub
`kennethwallace21-sys/Company_Website` main pushed in lockstep (Vercel preview mirror,
`caaiwebsite.vercel.app`). See README "Remotes and deploy reality".

## RESOLVED 2026-07-06: Contact form now delivers leads

- Root cause: `api/send-email.js` is Vercel-serverless format; Cloudflare Pages ignores
  it, so the form's POST hit the SPA rewrite, and the 200 response made the UI show a
  FALSE success while the lead was lost.
- Fix shipped: client-side delivery via Web3Forms (`src/lib/submitLead.js`), submitted
  as FormData specifically because a JSON Content-Type triggers a CORS preflight that
  api.web3forms.com does not answer. Verified live 2026-07-06: real submission from the
  live domain showed the thank-you state and the email was received.
- Note: Web3Forms rejects non-browser and headless-localhost submissions by design; do
  not "verify" this form with curl or a headless browser, test from the live page.
- Optional upgrade (P3, unblocked only by Cloudflare account access): the `development`
  branch's Pages Functions migration (Resend + Turnstile + CORS, commits 9a00ca0,
  b6e5710) adds server-side delivery and DB persistence. If adopted, keep the Web3Forms
  path as fallback.

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

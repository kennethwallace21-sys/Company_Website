// Live check for the contact form's bot protection. Run with: npm run check:live
// Optional base URL (a Workers preview, for example) as the first argument or
// CHECK_BASE_URL; defaults to production. Run it after any change to
// TURNSTILE_SECRET_KEY, VITE_TURNSTILE_SITE_KEY or src/worker.js, and on a schedule
// (.github/workflows/contact-form-monitor.yml).
//
// It never sends an email: both POSTs carry an empty name, so even with Turnstile
// switched off the Worker stops at field validation (400).
//
// 1. The home page answers 200.
// 2. The shipped JavaScript carries the site key from .env.production (or, without that
//    file, any production-format 0x4AAAA... key) and no test key, so the form renders
//    the right widget. A missing, test or different key fails every real visitor.
// 3. POST without a token: 403 "Bot verification failed". 400 or 200 means the Worker
//    has no TURNSTILE_SECRET_KEY, so bot verification is off.
// 4. POST with an invalid token: 403 "Bot verification failed". 503 means siteverify
//    rejected TURNSTILE_SECRET_KEY or is failing, which also fails every real visitor
//    (the 2026-10-16 to 2026-10-18 outage looked exactly like this).
//
// What it cannot see: whether the secret belongs to the same widget as the site key
// (siteverify accepts any valid secret for an invalid token), and whether Resend
// delivers mail. Only a real submission from /Contact proves those, so after any change
// to the secret, the site key or the Resend settings, also send one real message.
//
// A failing attempt is retried (CHECK_ATTEMPTS, default 3, CHECK_RETRY_MS apart,
// default 40 s) so one network blip is not an alert; the spacing keeps the POSTs
// under the endpoint's 5 per 60 s rate limit.
import { existsSync, readFileSync } from 'node:fs';

const BASE = (process.argv[2] || process.env.CHECK_BASE_URL || 'https://www.catalystappliedai.com').replace(/\/+$/, '');
const ORIGIN = 'https://www.catalystappliedai.com';
const ATTEMPTS = Math.max(1, Math.floor(Number(process.env.CHECK_ATTEMPTS || 3)) || 1);
const RETRY_MS = Math.max(0, Number(process.env.CHECK_RETRY_MS || 40000) || 0);
const BOT_FAILED = 'Bot verification failed. Please try again.';
const SITE_KEY = /0x4AAAA[A-Za-z0-9_-]{15,}/;
const TEST_SITE_KEY = /\b[123]x00000000000000000000[A-Z]{2}\b/;
const ENV_FILE = new URL('../.env.production', import.meta.url);
const ENV_FILE_PRESENT = existsSync(ENV_FILE);
const EXPECTED_SITE_KEY = ENV_FILE_PRESENT
    ? readFileSync(ENV_FILE, 'utf8').match(/^\s*VITE_TURNSTILE_SITE_KEY\s*=\s*["']?([^"'\s]+)["']?\s*$/m)?.[1] || null
    : null;

const timeout = () => AbortSignal.timeout(15000);

async function getText(path) {
    const res = await fetch(`${BASE}${path}`, { signal: timeout(), headers: { 'User-Agent': 'caai-live-check' } });
    return { status: res.status, text: await res.text() };
}

async function post(body) {
    const res = await fetch(`${BASE}/api/send-email`, {
        method: 'POST',
        headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'User-Agent': 'caai-live-check' },
        body: JSON.stringify(body),
        signal: timeout(),
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* not JSON: a Cloudflare error or challenge page */ }
    return { status: res.status, json, text };
}

function describe(r) {
    return `HTTP ${r.status} ${r.json ? JSON.stringify(r.json) : `(not JSON: ${r.text.slice(0, 80).replace(/\s+/g, ' ')})`}`;
}

function judgePost(r, label) {
    if (r.status === 403 && r.json?.error === BOT_FAILED) return { ok: true, info: describe(r) };
    if (r.status === 429) return { ok: false, retry: true, info: `rate limited, retrying: ${describe(r)}` };
    if (r.status === 503) return { ok: false, info: `${describe(r)}: siteverify rejected TURNSTILE_SECRET_KEY or is unreachable; real submissions fail too` };
    if (r.status === 400 || r.status === 200) return { ok: false, info: `${describe(r)}: Turnstile is not enforced (TURNSTILE_SECRET_KEY missing on the Worker)` };
    if (r.status === 403 && !r.json) return { ok: false, info: `${describe(r)}: blocked before the Worker (Cloudflare challenge or WAF), not the Worker's bot check` };
    return { ok: false, info: `${describe(r)}: unexpected response to the ${label} probe` };
}

async function shippedSiteKeys(html) {
    const seen = new Set();
    const queue = [...html.matchAll(/\/assets\/[A-Za-z0-9._-]+\.js/g)].map((m) => m[0]);
    const keys = new Set();
    let testKey = null;
    while (queue.length > 0 && seen.size < 60) {
        const path = queue.shift();
        if (seen.has(path)) continue;
        seen.add(path);
        const { status, text } = await getText(path);
        if (status !== 200) continue;
        for (const m of text.matchAll(new RegExp(SITE_KEY.source, 'g'))) keys.add(m[0]);
        testKey = testKey || text.match(TEST_SITE_KEY)?.[0] || null;
        for (const m of text.matchAll(/assets\/[A-Za-z0-9._-]+\.js/g)) queue.push(`/${m[0]}`);
    }
    return { keys: [...keys], testKey, scanned: seen.size };
}

function judgeSiteKey({ keys, testKey, scanned }) {
    const shown = keys.map((k) => `${k.slice(0, 10)}...`).join(', ') || 'none';
    if (testKey) return { ok: false, info: `test key ${testKey} shipped (found ${shown} in ${scanned} files)` };
    if (ENV_FILE_PRESENT && !EXPECTED_SITE_KEY) return { ok: false, info: `.env.production has no readable VITE_TURNSTILE_SITE_KEY line (found ${shown} in ${scanned} files)` };
    if (EXPECTED_SITE_KEY) {
        const ok = keys.length === 1 && keys[0] === EXPECTED_SITE_KEY;
        return { ok, info: ok ? `matches .env.production (${shown}, ${scanned} files)` : `expected ${EXPECTED_SITE_KEY.slice(0, 10)}... from .env.production, found ${shown} in ${scanned} files` };
    }
    return { ok: keys.length === 1, info: `${shown} in ${scanned} files (no .env.production to compare)` };
}

async function attempt() {
    const rows = [];
    const home = await getText('/');
    rows.push({ name: 'home page answers 200', ok: home.status === 200 && home.text.includes('<div id="root"'), info: `HTTP ${home.status}` });

    rows.push({ name: 'shipped JavaScript has the expected Turnstile site key', ...judgeSiteKey(await shippedSiteKeys(home.text)) });

    const noToken = judgePost(await post({ name: '', email: 'probe@example.com', message: 'live check' }), 'no-token');
    rows.push({ name: 'POST without a token is refused by the bot check (403)', ...noToken });

    const badToken = judgePost(await post({ name: '', email: 'probe@example.com', message: 'live check', 'cf-turnstile-response': `live-check-invalid-${Date.now()}` }), 'invalid-token');
    rows.push({ name: 'POST with an invalid token is refused by siteverify (403, not 503)', ...badToken });
    return rows;
}

let rows = [];
for (let i = 1; i <= ATTEMPTS; i += 1) {
    try {
        rows = await attempt();
    } catch (err) {
        rows = [{ name: 'checks ran', ok: false, info: `request failed: ${err?.message || err}` }];
    }
    if (rows.every((r) => r.ok)) break;
    if (i < ATTEMPTS) {
        console.log(`attempt ${i} failed (${rows.filter((r) => !r.ok).map((r) => r.name).join('; ')}), retrying in ${RETRY_MS / 1000} s`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_MS));
    }
}

if (rows.length === 0) rows = [{ name: 'checks ran', ok: false, info: 'no checks ran' }];
console.log(`Live check of ${BASE}`);
for (const r of rows) {
    console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.name}  (${r.info})`);
    if (!r.ok && process.env.GITHUB_ACTIONS) console.log(`::error title=Contact form live check::${r.name}: ${r.info}`);
}
const failed = rows.filter((r) => !r.ok);
console.log(`\n${rows.length - failed.length}/${rows.length} passed`);
if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFileSync } = await import('node:fs');
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, [
        `### Contact form live check: ${failed.length === 0 ? 'PASS' : 'FAIL'}`,
        '',
        ...rows.map((r) => `- ${r.ok ? 'PASS' : 'FAIL'} ${r.name} (${r.info})`),
        '',
    ].join('\n'));
}
if (failed.length > 0) process.exitCode = 1;

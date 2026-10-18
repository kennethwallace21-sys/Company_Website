// Unit checks for /api/send-email in src/worker.js. Run with: npm run test:worker
// 1-4: the rate limiter, using a mock Workers Rate Limiting binding. Each request is a
//      valid-origin POST with an empty body, so a request that passes the limiter
//      stops at body parsing (400).
// 5:   Turnstile: siteverify is called with the trimmed secret; a rejected token is a
//      403, while a rejected secret or a failing siteverify is a logged 503. global
//      fetch is mocked, so nothing leaves the machine.
import worker from '../src/worker.js';

const URL_ = 'https://www.catalystappliedai.com/api/send-email';
const ORIGIN = 'https://www.catalystappliedai.com';

// Mirrors the binding contract: limit({ key }) resolves to { success }.
function mockBinding(limit) {
    const counts = new Map();
    const calls = [];
    return {
        calls,
        async limit({ key }) {
            calls.push(key);
            const n = (counts.get(key) || 0) + 1;
            counts.set(key, n);
            return { success: n <= limit };
        },
    };
}

async function burst(env, ip, n) {
    const statuses = [];
    for (let i = 0; i < n; i += 1) {
        const res = await worker.fetch(new Request(URL_, {
            method: 'POST',
            headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
            body: '',
        }), env);
        statuses.push(res.status);
    }
    return statuses;
}

const rows = [];
const check = (ok, name, info) => rows.push({ ok, name, info });
const expected7 = [400, 400, 400, 400, 400, 429, 429];

// 1. Binding present: it decides, keyed by CF-Connecting-IP, 429 from request 6.
{
    const binding = mockBinding(5);
    const statuses = await burst({ CONTACT_RATE_LIMIT: binding }, '203.0.113.10', 7);
    check(JSON.stringify(statuses) === JSON.stringify(expected7), 'binding: 7-request burst gets 429 on request 6 and 7', statuses.join(','));
    check(binding.calls.length === 7 && binding.calls.every((k) => k === 'send-email:203.0.113.10'), 'binding: called once per request with key send-email:<CF-Connecting-IP>', binding.calls[0]);
    const other = await burst({ CONTACT_RATE_LIMIT: binding }, '203.0.113.11', 1);
    check(other[0] === 400, 'binding: a different IP has its own budget', other.join(','));
}

// 2. Binding denies: request is refused even though the in-memory Map would allow it.
{
    const deny = { async limit() { return { success: false }; } };
    const statuses = await burst({ CONTACT_RATE_LIMIT: deny }, '203.0.113.20', 1);
    check(statuses[0] === 429, 'binding: its decision wins over the in-memory fallback', statuses.join(','));
}

// 3. No binding (local dev): in-memory Map fallback, same 5 per 60 s.
{
    const statuses = await burst({}, '203.0.113.30', 7);
    check(JSON.stringify(statuses) === JSON.stringify(expected7), 'fallback (no binding): 429 on request 6 and 7', statuses.join(','));
}

// 4. Binding throws: falls back to the Map instead of failing open or erroring.
{
    const errors = [];
    const origError = console.error;
    console.error = (...a) => errors.push(a.join(' '));
    const broken = { async limit() { throw new Error('binding unavailable'); } };
    const statuses = await burst({ CONTACT_RATE_LIMIT: broken }, '203.0.113.40', 7);
    console.error = origError;
    check(JSON.stringify(statuses) === JSON.stringify(expected7), 'binding throws: Map fallback still limits (429 on 6 and 7)', statuses.join(','));
    check(errors.length === 7 && errors[0].includes('Rate limit binding error'), 'binding throws: logged for observability', `${errors.length} log lines`);
}

// 5. Turnstile siteverify call (fetch mocked).
{
    const realFetch = globalThis.fetch;
    const origError = console.error;
    const errors = [];
    console.error = (...a) => errors.push(a.join(' '));
    const seen = [];
    let answer = { success: false, 'error-codes': ['invalid-input-response'] };
    globalThis.fetch = async (url, init) => {
        seen.push({ url: String(url), secret: init.body.get('secret'), response: init.body.get('response'), remoteip: init.body.get('remoteip') });
        return Response.json(answer);
    };
    // A permissive limiter keeps these Turnstile cases independent of rate limiting.
    const allowAll = { async limit() { return { success: true }; } };
    const post = (env) => worker.fetch(new Request(URL_, {
        method: 'POST',
        headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.50' },
        body: JSON.stringify({ name: '', email: 'probe@example.com', message: 'x', 'cf-turnstile-response': 'tok-123' }),
    }), { CONTACT_RATE_LIMIT: allowAll, ...env });

    let res = await post({ TURNSTILE_SECRET_KEY: 'secret-abc\n' });
    check(seen.length === 1 && seen[0].url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify', 'turnstile: siteverify is called when a token is present', seen[0]?.url);
    check(seen[0]?.secret === 'secret-abc' && seen[0]?.response === 'tok-123' && seen[0]?.remoteip === '203.0.113.50', 'turnstile: secret is trimmed; token and remoteip are sent', JSON.stringify(seen[0]));
    check(res.status === 403, 'turnstile: rejected token is 403', res.status);

    answer = { success: false, 'error-codes': ['invalid-input-secret'] };
    res = await post({ TURNSTILE_SECRET_KEY: 'secret-abc' });
    check(res.status === 503 && errors.some((e) => e.includes('invalid-input-secret')), 'turnstile: invalid secret is 503 and logged with its error code', `${res.status}; ${errors.at(-1)}`);

    answer = { success: true };
    res = await post({ TURNSTILE_SECRET_KEY: 'secret-abc' });
    check(res.status === 400, 'turnstile: accepted token proceeds to field validation (400 for empty name)', res.status);

    for (const code of ['internal-error', 'bad-request']) {
        answer = { success: false, 'error-codes': [code] };
        const before = errors.length;
        res = await post({ TURNSTILE_SECRET_KEY: 'secret-abc' });
        check(res.status === 503 && errors.length === before + 1 && errors.at(-1).includes(code), `turnstile: siteverify ${code} is 503 and logged, not a visitor 403`, `${res.status}; ${errors.at(-1)}`);
    }

    answer = { success: false, 'error-codes': ['timeout-or-duplicate'] };
    res = await post({ TURNSTILE_SECRET_KEY: 'secret-abc' });
    check(res.status === 403, 'turnstile: reused token is a visitor 403', res.status);

    globalThis.fetch = async () => new Response('upstream down', { status: 502 });
    let before = errors.length;
    res = await post({ TURNSTILE_SECRET_KEY: 'secret-abc' });
    check(res.status === 503 && errors.length === before + 1 && errors.at(-1).includes('HTTP 502'), 'turnstile: siteverify HTTP 502 is 503 and logged', `${res.status}; ${errors.at(-1)}`);

    globalThis.fetch = async () => { throw new Error('network down'); };
    before = errors.length;
    res = await post({ TURNSTILE_SECRET_KEY: 'secret-abc' });
    check(res.status === 503 && errors.length === before + 1 && errors.at(-1).includes('network down'), 'turnstile: siteverify network failure is 503 and logged', `${res.status}; ${errors.at(-1)}`);

    globalThis.fetch = async () => { throw new Error('siteverify must not be called without a token'); };
    res = await worker.fetch(new Request(URL_, {
        method: 'POST',
        headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.51' },
        body: JSON.stringify({ name: '', email: 'probe@example.com', message: 'x' }),
    }), { TURNSTILE_SECRET_KEY: 'secret-abc' });
    check(res.status === 403, 'turnstile: missing token is 403 without calling siteverify', res.status);

    // Replies that must never pass as success or as a visitor 403.
    const reply = (status, text) => { globalThis.fetch = async () => new Response(text, { status }); };
    reply(200, 'not json');
    before = errors.length;
    res = await post({ TURNSTILE_SECRET_KEY: 'secret-abc' });
    check(res.status === 503 && errors.length === before + 1 && errors.at(-1).includes('unreadable reply'), 'turnstile: unreadable 200 reply is 503 and logged', `${res.status}; ${errors.at(-1)}`);

    reply(200, JSON.stringify({ success: 'false' }));
    res = await post({ TURNSTILE_SECRET_KEY: 'secret-abc' });
    check(res.status === 503, 'turnstile: a non-boolean success is not accepted (503)', res.status);

    reply(200, JSON.stringify({ success: false, 'error-codes': ['some-new-code'] }));
    before = errors.length;
    res = await post({ TURNSTILE_SECRET_KEY: 'secret-abc' });
    check(res.status === 503 && errors.length === before + 1 && errors.at(-1).includes('some-new-code'), 'turnstile: an unknown error code is 503 and logged', `${res.status}; ${errors.at(-1)}`);

    reply(200, JSON.stringify({ success: false, 'error-codes': ['missing-input-response'] }));
    res = await post({ TURNSTILE_SECRET_KEY: 'secret-abc' });
    check(res.status === 403, 'turnstile: missing-input-response is a visitor 403', res.status);

    // A secret that is set but blank or not a string fails closed: no siteverify call,
    // no email, even for a complete lead without a token.
    let called = 0;
    globalThis.fetch = async () => { called += 1; return Response.json({ id: 'should-not-send' }); };
    const lead = { name: 'Probe Person', email: 'probe@example.com', message: 'A complete message for the probe.' };
    for (const [label, secret] of [['blank', ' \n'], ['empty', ''], ['non-string', 123]]) {
        before = errors.length;
        res = await worker.fetch(new Request(URL_, {
            method: 'POST',
            headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.52' },
            body: JSON.stringify(lead),
        }), { CONTACT_RATE_LIMIT: allowAll, TURNSTILE_SECRET_KEY: secret, RESEND_API_KEY: 're_test', RESEND_TO_EMAIL: 'to@example.com', RESEND_FROM_EMAIL: 'from@example.com' });
        check(res.status === 503 && called === 0 && errors.length === before + 1, `turnstile: ${label} secret fails closed (503, nothing sent, logged)`, `${res.status}; fetch calls ${called}`);
    }

    // Not set at all: Turnstile is off by design, and the request goes on to validation.
    res = await post({});
    check(res.status === 400 && called === 0, 'turnstile: unset secret means verification is off (400 at validation, no siteverify call)', res.status);

    globalThis.fetch = realFetch;
    console.error = origError;
}

// 6. Hourly self-check (the scheduled handler). fetch is mocked: siteverify answers come
//    from a queue (the last answer repeats), and Resend calls are recorded, not sent.
{
    const realFetch = globalThis.fetch;
    const origError = console.error;
    const origLog = console.log;
    const logs = [];
    console.error = (...a) => logs.push(a.join(' '));
    console.log = () => {};
    let answers = [];
    let resendStatus = 200;
    let emails = [];
    let siteverifyCalls = 0;
    const setSiteverify = (...list) => { answers = list; };
    globalThis.fetch = async (url, init) => {
        const u = String(url);
        if (u.includes('siteverify')) {
            siteverifyCalls += 1;
            const a = answers.length > 1 ? answers.shift() : answers[0];
            return a.status ? new Response('upstream', { status: a.status }) : Response.json(a);
        }
        if (u === 'https://api.resend.com/emails') {
            emails.push({ ...JSON.parse(init.body), auth: init.headers.Authorization });
            return resendStatus === 200 ? Response.json({ id: 'email-1' }) : Response.json({ message: 'resend down' }, { status: resendStatus });
        }
        throw new Error(`unexpected fetch ${u}`);
    };
    const baseEnv = { TURNSTILE_SECRET_KEY: 'secret-abc', RESEND_API_KEY: 're_test', RESEND_TO_EMAIL: 'to@example.com', RESEND_FROM_EMAIL: 'from@example.com', SELF_CHECK_RETRY_MS: 0 };
    let results = [];
    const run = async (envOverride, time) => {
        emails = [];
        siteverifyCalls = 0;
        const pending = [];
        await worker.scheduled({ scheduledTime: time, cron: '7 * * * *' }, { ...baseEnv, ...envOverride }, { waitUntil: (p) => pending.push(p) });
        results = await Promise.all(pending);
        return emails;
    };
    const HEALTHY = { success: false, 'error-codes': ['invalid-input-response'] };
    const PLAIN_HOUR = Date.parse('2026-10-25T08:07:00Z');
    const ANNOUNCE = Date.parse('2026-10-18T08:07:00Z');

    setSiteverify(HEALTHY);
    let sent = await run({}, PLAIN_HOUR);
    check(siteverifyCalls === 1 && sent.length === 0, 'self-check: a healthy hour calls siteverify once and sends nothing', `siteverify ${siteverifyCalls}, emails ${sent.length}`);

    setSiteverify({ success: false, 'error-codes': ['invalid-input-secret'] });
    sent = await run({}, PLAIN_HOUR);
    check(sent.length === 1 && siteverifyCalls === 2 && sent[0].subject === 'Website alert: the contact form is failing' && sent[0].to[0] === 'to@example.com' && sent[0].from === 'from@example.com' && sent[0].auth === 'Bearer re_test' && sent[0].text.includes('TURNSTILE_SECRET_KEY is wrong or blank'), 'self-check: a rejected secret is re-checked once, then emailed to RESEND_TO_EMAIL with the API key', `${sent[0]?.subject}; siteverify ${siteverifyCalls}`);

    setSiteverify({ success: false, 'error-codes': ['internal-error'] }, HEALTHY);
    sent = await run({}, PLAIN_HOUR);
    check(sent.length === 0 && siteverifyCalls === 2, 'self-check: one siteverify blip that clears on the re-check sends nothing', `siteverify ${siteverifyCalls}, emails ${sent.length}`);

    setSiteverify({ status: 502 });
    sent = await run({}, PLAIN_HOUR);
    check(sent.length === 1 && siteverifyCalls === 2, 'self-check: siteverify failing on both tries emails an alert', `siteverify ${siteverifyCalls}, emails ${sent.length}`);

    setSiteverify({ success: true });
    sent = await run({}, PLAIN_HOUR);
    check(sent.length === 1 && sent[0].text.includes('made-up Turnstile token was accepted'), 'self-check: an accepted made-up token emails an alert', sent[0]?.subject);

    setSiteverify(HEALTHY);
    sent = await run({ TURNSTILE_SECRET_KEY: undefined }, PLAIN_HOUR);
    check(sent.length === 1 && siteverifyCalls === 0 && sent[0].text.includes('TURNSTILE_SECRET_KEY is not set'), 'self-check: an unset secret emails an alert', sent[0]?.subject);

    sent = await run({ TURNSTILE_SECRET_KEY: ' \n' }, PLAIN_HOUR);
    check(sent.length === 1 && siteverifyCalls === 0 && sent[0].subject.includes('failing'), 'self-check: a blank secret emails an alert', sent[0]?.subject);

    let before = logs.length;
    sent = await run({ RESEND_API_KEY: undefined }, PLAIN_HOUR);
    check(sent.length === 0 && logs.slice(before).some((l) => l.includes('Email delivery is not configured')), 'self-check: missing Resend settings are logged (no way to email)', logs.at(-1));

    setSiteverify({ success: false, 'error-codes': ['invalid-input-secret'] });
    resendStatus = 500;
    before = logs.length;
    sent = await run({}, PLAIN_HOUR);
    check(sent.length === 1 && results[0]?.emailed === false && logs.slice(before).some((l) => l.includes('could not send its email')), 'self-check: a failed alert send is reported as not emailed and logged', `emailed ${results[0]?.emailed}`);
    resendStatus = 200;

    setSiteverify(HEALTHY);
    const weekly = [
        ['Mon 13:07Z', '2026-10-19T13:07:00Z', 1],
        ['Mon 12:07Z', '2026-10-19T12:07:00Z', 0],
        ['Mon 14:07Z', '2026-10-19T14:07:00Z', 0],
        ['Tue 13:07Z', '2026-10-20T13:07:00Z', 0],
    ];
    for (const [label, iso, expected] of weekly) {
        sent = await run({}, Date.parse(iso));
        check(sent.length === expected && (expected === 0 || sent[0].subject === 'Website check: the contact form is working (weekly)'), `self-check: weekly note only on Monday 13:00 UTC (${label}: ${expected})`, `${sent.length} sent`);
    }

    sent = await run({}, ANNOUNCE);
    check(sent.length === 1 && sent[0].subject === 'Website check: the hourly contact form check is running', 'self-check: runs before the announce time confirm the check is live', sent[0]?.subject);

    before = logs.length;
    sent = await run({}, Number.NaN);
    check(results.length === 1 && Array.isArray(results[0]?.problems) && results[0].problems.length === 0 && !logs.slice(before).some((l) => l.includes('crashed')), 'self-check: a missing scheduled time falls back to now without crashing', JSON.stringify(results[0]));

    globalThis.fetch = realFetch;
    console.error = origError;
    console.log = origLog;
}

for (const r of rows) {
    console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.name}  (${r.info})`);
}
const failed = rows.filter((r) => !r.ok);
console.log(`\n${rows.length - failed.length}/${rows.length} passed`);
if (failed.length > 0) {
    process.exitCode = 1;
}

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

    globalThis.fetch = realFetch;
    console.error = origError;
}

for (const r of rows) {
    console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.name}  (${r.info})`);
}
const failed = rows.filter((r) => !r.ok);
console.log(`\n${rows.length - failed.length}/${rows.length} passed`);
if (failed.length > 0) {
    process.exitCode = 1;
}

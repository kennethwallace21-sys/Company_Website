const ALLOWED_ORIGINS = new Set([
    "https://catalystappliedai.com",
    "https://www.catalystappliedai.com",
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 60;
const MAX_EMAIL = 100;
const MAX_COMPANY = 100;
const MAX_MESSAGE = 5000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_MAX_ENTRIES = 5000;
const MAX_BODY_BYTES = 32 * 1024;
const UPSTREAM_TIMEOUT_MS = 10 * 1000;
const IDEMPOTENCY_KEY_REGEX = /^[A-Za-z0-9-]{8,64}$/;
const APEX_HOST = "catalystappliedai.com";
const CANONICAL_ORIGIN = "https://www.catalystappliedai.com";

const SECURITY_HEADERS = {
    "Content-Security-Policy":
        "default-src 'self'; script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com; "
        + "style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://images.unsplash.com; "
        + "font-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com; "
        + "frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; "
        + "form-action 'self'; object-src 'none'; upgrade-insecure-requests",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), camera=(), microphone=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "X-Content-Type-Options": "nosniff",
};

// Client-side routes served by the SPA shell. Compared case-insensitively on the
// pathname (query and hash are not part of it). Anything else without a file
// extension that the asset layer answers with the SPA HTML is a soft 404.
const SPA_ROUTES = new Set([
    "/",
    "/home",
    "/contact",
    "/products",
    "/servicedetail",
    "/termsandconditions",
    "/faq",
    "/privacy",
    "/team",
]);

// Rate limiting for /api/send-email. Production uses the Workers Rate Limiting
// binding CONTACT_RATE_LIMIT (wrangler.jsonc "ratelimits": RATE_LIMIT_MAX requests
// per 60 s per client IP), whose counters are shared by every isolate in a
// Cloudflare location. Where the binding is absent (local dev, tests) or throws,
// this per-isolate Map is the fallback: it resets on Worker restarts and is not
// shared between isolates.
const rateLimitMap = new Map();

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Canonical host: apex redirects to www. localhost and *.workers.dev are untouched.
        if (url.hostname === APEX_HOST) {
            return Response.redirect(`${CANONICAL_ORIGIN}${url.pathname}${url.search}`, 301);
        }

        if (url.pathname === "/api/send-email") {
            return handleSendEmail(request, env);
        }

        if (env.ASSETS) {
            return serveAsset(request, url, env);
        }

        return new Response("Not found", { status: 404 });
    },

    // Hourly contact form self-check: wrangler.jsonc triggers.crons, see runContactSelfCheck.
    async scheduled(controller, env, ctx) {
        ctx.waitUntil(runContactSelfCheck(env, controller.scheduledTime));
    },
};

function normalizeRoutePath(pathname) {
    const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    return (trimmed || "/").toLowerCase();
}

function hasFileExtension(pathname) {
    const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
    return lastSegment.includes(".");
}

async function serveAsset(request, url, env) {
    const pathname = url.pathname;
    const isFileRequest = hasFileExtension(pathname);
    const isUnknownRoute = !isFileRequest
        && !pathname.startsWith("/assets/")
        && !SPA_ROUTES.has(normalizeRoutePath(pathname));

    let assetRequest = request;
    if (isUnknownRoute && (request.headers.has("If-None-Match") || request.headers.has("If-Modified-Since"))) {
        // A 304 would tell the browser to reuse a cached 200 for a path that is now a 404.
        const headers = new Headers(request.headers);
        headers.delete("If-None-Match");
        headers.delete("If-Modified-Since");
        assetRequest = new Request(request, { headers });
    }

    const response = await env.ASSETS.fetch(assetRequest);
    if (response.webSocket) return response;

    const contentType = (response.headers.get("Content-Type") || "").toLowerCase();
    const servedHtml = response.status === 200 && contentType.startsWith("text/html");
    if (!servedHtml) return withSecurityHeaders(response);

    // Missing hashed assets and other file requests fall through to the SPA shell
    // (200 HTML). That breaks open tabs after a deploy, so answer with a real 404.
    if ((pathname.startsWith("/assets/") || isFileRequest) && !pathname.endsWith(".html")) {
        return withSecurityHeaders(
            new Response("Not Found", {
                status: 404,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Cache-Control": "no-store",
                },
            })
        );
    }

    // Unknown client-side routes: keep the SPA HTML (so the app can render its own
    // not-found view) but report 404 instead of a soft 200.
    if (isUnknownRoute) {
        const headers = new Headers(response.headers);
        headers.set("Cache-Control", "no-store");
        headers.delete("ETag");
        headers.delete("Last-Modified");
        return withSecurityHeaders(
            new Response(response.body, { status: 404, statusText: "Not Found", headers })
        );
    }

    return withSecurityHeaders(response);
}

function withSecurityHeaders(response) {
    // WebSocket upgrade responses cannot be rebuilt.
    if (response.webSocket) return response;

    const wrapped = new Response(response.body, response);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
        wrapped.headers.set(name, value);
    }
    return wrapped;
}

async function handleSendEmail(request, env) {
    const origin = request.headers.get("Origin") || "";
    const requestUrl = new URL(request.url);
    const headers = corsHeaders(origin, requestUrl);

    if (request.method === "OPTIONS") {
        if (!isAllowedOrigin(origin, requestUrl)) {
            return json({ error: "Forbidden" }, 403, headers);
        }
        return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405, {
            ...headers,
            Allow: "POST, OPTIONS",
        });
    }

    if (!isAllowedOrigin(origin, requestUrl)) {
        return json({ error: "Forbidden" }, 403, headers);
    }

    const clientIp = request.headers.get("CF-Connecting-IP")
        || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim()
        || "unknown";
    if (!(await checkRateLimit(clientIp, env))) {
        return json({ error: "Too many requests. Please try again later." }, 429, headers);
    }

    const declaredLength = Number(request.headers.get("Content-Length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
        return json({ error: "Your message is too large to send." }, 413, headers);
    }

    let body;
    try {
        const rawBody = await request.text();
        // Content-Length can be absent or wrong (chunked uploads), so guard the real size too.
        if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
            return json({ error: "Your message is too large to send." }, 413, headers);
        }
        body = JSON.parse(rawBody);
    } catch {
        return json({ error: "Please submit the form again." }, 400, headers);
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return json({ error: "Please submit the form again." }, 400, headers);
    }

    if (body?.website) {
        return json({ success: true }, 200, headers);
    }

    const turnstileResult = await verifyTurnstile(body, request, env);
    if (!turnstileResult.ok) {
        return json(turnstileResult.payload, turnstileResult.status, headers);
    }

    const validation = normalizeAndValidate(body);
    if (!validation.ok) {
        return json({ error: validation.error }, 400, headers);
    }

    const missingConfig = [];
    if (!env.RESEND_API_KEY) missingConfig.push("RESEND_API_KEY");
    if (!env.RESEND_TO_EMAIL) missingConfig.push("RESEND_TO_EMAIL");
    if (!env.RESEND_FROM_EMAIL) missingConfig.push("RESEND_FROM_EMAIL");
    if (missingConfig.length > 0) {
        console.error(`Contact Worker missing required config: ${missingConfig.join(", ")}`);
        return json(
            {
                success: false,
                error: "Contact email is not configured yet.",
            },
            503,
            headers
        );
    }

    // Persistence is intentionally the mailbox only until a D1/KV store is added.
    const lead = validation.fields;
    const idempotencyKey = typeof body.idempotencyKey === "string" && IDEMPOTENCY_KEY_REGEX.test(body.idempotencyKey)
        ? body.idempotencyKey
        : null;
    const emailResult = await sendLeadEmail(lead, env, idempotencyKey);

    if (!emailResult.ok) {
        console.error("Resend delivery error:", emailResult.error);
        return json(
            {
                success: false,
                error: "Failed to send message. Please try again later.",
            },
            502,
            headers
        );
    }

    return json(
        {
            success: true,
            id: emailResult.id,
        },
        200,
        headers
    );
}

function isAllowedOrigin(origin, requestUrl) {
    if (ALLOWED_ORIGINS.has(origin)) return true;
    if (!origin) return false;

    try {
        const originUrl = new URL(origin);
        const localOrigin = ["localhost", "127.0.0.1"].includes(originUrl.hostname);
        const localRequest = ["localhost", "127.0.0.1"].includes(requestUrl.hostname);
        return localOrigin && localRequest;
    } catch {
        return false;
    }
}

function corsHeaders(origin, requestUrl) {
    // A rejected origin gets no Access-Control-Allow-Origin header at all.
    const headers = {
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin",
    };
    if (isAllowedOrigin(origin, requestUrl)) {
        headers["Access-Control-Allow-Origin"] = origin;
    }
    return headers;
}

async function checkRateLimit(ip, env) {
    const limiter = env?.CONTACT_RATE_LIMIT;
    if (limiter && typeof limiter.limit === "function") {
        try {
            const { success } = await limiter.limit({ key: `send-email:${ip}` });
            return success === true;
        } catch (err) {
            console.error("Rate limit binding error, using in-memory fallback:", err?.message || err);
        }
    }
    return checkRateLimitInMemory(ip);
}

function checkRateLimitInMemory(ip) {
    const now = Date.now();
    if (rateLimitMap.size > RATE_LIMIT_MAX_ENTRIES) {
        for (const [key, value] of rateLimitMap) {
            if (now - value.windowStart > RATE_LIMIT_WINDOW_MS) {
                rateLimitMap.delete(key);
            }
        }
    }
    const entry = rateLimitMap.get(ip);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { windowStart: now, count: 1 });
        return true;
    }

    entry.count += 1;
    return entry.count <= RATE_LIMIT_MAX;
}

// siteverify error codes that mean the visitor's token was bad. Any other failure
// (a bad secret, siteverify erroring, an unreadable or unexpected reply) is our side.
const TURNSTILE_TOKEN_ERRORS = new Set(["invalid-input-response", "missing-input-response", "timeout-or-duplicate"]);

function botCheckFailed() {
    return {
        ok: false,
        status: 403,
        payload: { success: false, error: "Bot verification failed. Please try again." },
    };
}

// 503, so the form offers the email fallback and scripts/check-live.mjs reports the
// outage instead of a healthy-looking 403.
function verificationUnavailable() {
    return {
        ok: false,
        status: 503,
        payload: { success: false, error: "Contact verification is temporarily unavailable." },
    };
}

async function verifyTurnstile(body, request, env) {
    // Turnstile is off only when TURNSTILE_SECRET_KEY is not set at all. A value that is
    // set but blank (for example from `echo | wrangler secret put`) is a misconfiguration
    // and fails closed, like a wrong secret.
    const rawSecret = env.TURNSTILE_SECRET_KEY;
    if (rawSecret === undefined || rawSecret === null) {
        return { ok: true };
    }
    // Trimmed because a secret saved with a trailing newline or space is rejected by
    // siteverify as invalid-input-secret.
    const turnstileSecret = typeof rawSecret === "string" ? rawSecret.trim() : "";
    if (!turnstileSecret) {
        console.error("TURNSTILE_SECRET_KEY is set but blank or not a string; refusing submissions until it is fixed.");
        return verificationUnavailable();
    }

    // When verification is enforced, a missing token is always a hard 403.
    const token = body?.["cf-turnstile-response"];
    if (!token || typeof token !== "string") {
        return botCheckFailed();
    }

    const form = new FormData();
    form.append("secret", turnstileSecret);
    form.append("response", token);
    const remoteIp = request.headers.get("CF-Connecting-IP");
    if (remoteIp) {
        form.append("remoteip", remoteIp);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
    try {
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: form,
            signal: controller.signal,
        });
        // null when the body is not JSON or the read is aborted by the timeout.
        const verifyData = await verifyRes.json().catch(() => null);
        if (verifyRes.ok && verifyData?.success === true) {
            return { ok: true };
        }

        // Only a rejected token is the visitor's 403; everything else is a logged 503.
        const errors = Array.isArray(verifyData?.["error-codes"]) ? verifyData["error-codes"] : [];
        const tokenRejected = verifyRes.ok && errors.length > 0 && errors.every((code) => TURNSTILE_TOKEN_ERRORS.has(code));
        if (tokenRejected) {
            return botCheckFailed();
        }
        // Visible in Workers observability logs; a bad TURNSTILE_SECRET_KEY otherwise fails silently.
        console.error(`Turnstile siteverify failed: HTTP ${verifyRes.status}, error-codes ${JSON.stringify(errors)}${verifyData === null ? ", unreadable reply" : ""}`);
        return verificationUnavailable();
    } catch (err) {
        console.error("Turnstile verification error:", err?.message || err);
        return verificationUnavailable();
    } finally {
        clearTimeout(timer);
    }
}

// Checks the contact form at its source every hour, so an outage like the bad
// TURNSTILE_SECRET_KEY of 2026-10-16 reaches the owner within the hour instead of going
// unnoticed for two days. It runs the same verifyTurnstile a real submission gets, with
// a made-up token that siteverify must reject, and checks the Resend settings. Problems
// are emailed to RESEND_TO_EMAIL. A "still working" note also goes out every Monday at
// 13:00 UTC (and on runs before SELF_CHECK_ANNOUNCE_BEFORE, to confirm the cron is live),
// so a monitor that has stopped running is noticed too.
const SELF_CHECK_ANNOUNCE_BEFORE = Date.parse("2026-10-18T09:30:00Z");

async function runContactSelfCheck(env, scheduledTime = Date.now()) {
    const problems = [];
    if (env.TURNSTILE_SECRET_KEY === undefined || env.TURNSTILE_SECRET_KEY === null) {
        problems.push("TURNSTILE_SECRET_KEY is not set on the Worker, so bot verification is off.");
    } else {
        const result = await verifyTurnstile(
            { "cf-turnstile-response": `self-check-${scheduledTime}` },
            new Request("https://self-check.invalid/"),
            env,
        );
        if (result.ok) {
            problems.push("A made-up Turnstile token was accepted, so verification is not working.");
        } else if (result.status !== 403) {
            problems.push("Turnstile verification is failing (TURNSTILE_SECRET_KEY is wrong or blank, or siteverify is unreachable), so every real submission gets a 503. The Worker logs show the exact reason.");
        }
    }
    const missing = ["RESEND_API_KEY", "RESEND_TO_EMAIL", "RESEND_FROM_EMAIL"].filter((name) => !env[name]);
    if (missing.length > 0) {
        problems.push(`Email delivery is not configured (${missing.join(", ")} missing), so no submission can be delivered.`);
    }

    if (problems.length > 0) {
        console.error(`Contact self-check failed: ${problems.join(" ")}`);
    } else {
        console.log("Contact self-check passed.");
    }

    const when = new Date(scheduledTime);
    let subject = null;
    if (problems.length > 0) {
        subject = "Website alert: the contact form is failing";
    } else if (scheduledTime < SELF_CHECK_ANNOUNCE_BEFORE) {
        subject = "Website check: the hourly contact form check is running";
    } else if (when.getUTCDay() === 1 && when.getUTCHours() === 13) {
        subject = "Website check: the contact form is working (weekly)";
    }
    // Without the Resend settings there is no way to send; the log line above is all we have.
    if (!subject || missing.length > 0) {
        return { problems, emailed: false };
    }

    const lines = problems.length > 0
        ? [
            "The hourly check of the contact form at www.catalystappliedai.com found:",
            "",
            ...problems.map((p) => `- ${p}`),
            "",
            "Fix and verify with the Contact form status section of docs/TODO.md in the website repo, then run npm run check:live.",
        ]
        : [
            "The hourly check of the contact form at www.catalystappliedai.com passed: Turnstile verification and the email settings work.",
            "",
            "This note comes every Monday. An alert arrives within the hour if the form breaks.",
        ];
    const sent = await sendSelfCheckEmail(env, subject, `${lines.join("\n")}\n\nChecked at ${when.toISOString()}.`);
    if (!sent.ok) {
        console.error(`Contact self-check could not send its email: ${sent.error}`);
    }
    return { problems, emailed: sent.ok };
}

async function sendSelfCheckEmail(env, subject, text) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to: [env.RESEND_TO_EMAIL], subject, text }),
            signal: controller.signal,
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            return { ok: false, error: data?.message || `Resend returned ${res.status}` };
        }
        return { ok: true };
    } catch (err) {
        return { ok: false, error: err?.name === "AbortError" ? "Resend request timed out" : (err?.message || String(err)) };
    } finally {
        clearTimeout(timer);
    }
}

function normalizeAndValidate(body) {
    const fields = {
        name: clean(body?.name, MAX_NAME),
        email: clean(body?.email, MAX_EMAIL).toLowerCase(),
        company: clean(body?.company, MAX_COMPANY),
        message: clean(body?.message, MAX_MESSAGE),
    };

    if (!fields.name) {
        return { ok: false, error: "Name is required." };
    }
    if (!fields.email) {
        return { ok: false, error: "Email is required." };
    }
    if (!EMAIL_REGEX.test(fields.email)) {
        return { ok: false, error: "Please provide a valid email address." };
    }
    if (!fields.message) {
        return { ok: false, error: "Message is required." };
    }

    if (String(body?.name || "").trim().length > MAX_NAME) {
        return { ok: false, error: `Name must be ${MAX_NAME} characters or fewer.` };
    }
    if (String(body?.email || "").trim().length > MAX_EMAIL) {
        return { ok: false, error: `Email must be ${MAX_EMAIL} characters or fewer.` };
    }
    if (String(body?.company || "").trim().length > MAX_COMPANY) {
        return { ok: false, error: `Company must be ${MAX_COMPANY} characters or fewer.` };
    }
    if (String(body?.message || "").trim().length > MAX_MESSAGE) {
        return { ok: false, error: `Message must be ${MAX_MESSAGE} characters or fewer.` };
    }

    return { ok: true, fields };
}

function clean(value, limit) {
    return String(value ?? "").trim().slice(0, limit);
}

async function sendLeadEmail(lead, env, idempotencyKey) {
    const emailHtml = buildLeadEmail(lead);
    const subjectName = stripControlChars(lead.name);
    const subjectCompany = stripControlChars(lead.company);
    const requestHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
    };
    if (idempotencyKey) {
        requestHeaders["Idempotency-Key"] = idempotencyKey;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify({
                from: env.RESEND_FROM_EMAIL,
                to: [env.RESEND_TO_EMAIL],
                reply_to: [lead.email],
                subject: `New Lead: ${subjectName}${subjectCompany ? ` [${subjectCompany}]` : ""}`,
                html: emailHtml,
            }),
            signal: controller.signal,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return { ok: false, error: data?.message || data?.error || `Resend returned ${res.status}` };
        }

        return { ok: true, id: data?.id };
    } catch (err) {
        return { ok: false, error: err?.name === "AbortError" ? "Resend request timed out" : (err?.message || String(err)) };
    } finally {
        clearTimeout(timer);
    }
}

// Replaces CR, LF, tab and every other character below 0x20 (plus DEL), the Unicode
// line/paragraph separators and bidi control characters with a space so user input
// cannot inject header-like content or reorder the subject line.
function stripControlChars(value) {
    let out = "";
    for (const ch of String(value ?? "")) {
        const code = ch.charCodeAt(0);
        const blocked = code < 0x20
            || code === 0x7f
            || code === 0x2028
            || code === 0x2029
            || (code >= 0x202a && code <= 0x202e)
            || (code >= 0x2066 && code <= 0x2069);
        out += blocked ? " " : ch;
    }
    return out.replace(/ {2,}/g, " ").trim();
}

function buildLeadEmail({ name, email, company, message }) {
    return `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 40px 20px; background-color: #060a14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0d1425; border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="padding: 30px; background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%); text-align: center;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.05em; color: white; text-transform: uppercase;">New Inbound Lead</h1>
            </div>
            <div style="padding: 40px;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #60a5fa; font-weight: 700; margin-bottom: 8px;">From</div>
              <div style="font-size: 16px; color: #e2e8f0; margin-bottom: 24px; line-height: 1.5;"><strong>${escapeHtml(name)}</strong></div>

              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #60a5fa; font-weight: 700; margin-bottom: 8px;">Email Address</div>
              <div style="font-size: 16px; color: #e2e8f0; margin-bottom: 24px; line-height: 1.5;">${escapeHtml(email)}</div>

              ${company ? `
                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #60a5fa; font-weight: 700; margin-bottom: 8px;">Company / Organization</div>
                <div style="font-size: 16px; color: #e2e8f0; margin-bottom: 24px; line-height: 1.5;">${escapeHtml(company)}</div>
              ` : ""}

              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #60a5fa; font-weight: 700; margin-bottom: 8px;">Detailed Request</div>
              <div style="background-color: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 20px; border-left: 3px solid #3b82f6; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                ${escapeHtml(message).replace(/\n/g, "<br>")}
              </div>
            </div>
            <div style="padding: 30px; text-align: center; border-top: 1px solid rgba(59, 130, 246, 0.1); font-size: 11px; color: #64748b; letter-spacing: 0.025em;">
              Sent via Catalyst Applied AI Lead Engine<br/>
              &copy; ${new Date().getFullYear()} Catalyst Applied AI. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
}

function escapeHtml(text) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return String(text ?? "").replace(/[&<>"']/g, (m) => map[m]);
}

function json(payload, status, headers) {
    return Response.json(payload, {
        status,
        headers: {
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            ...headers,
        },
    });
}

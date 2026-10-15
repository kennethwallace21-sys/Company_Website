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

// Soft anti-abuse only: this Map lives in isolate memory, so it resets on
// Worker restarts and is not shared across edge locations. Acceptable tradeoff
// for a low-traffic contact form where the goal is to deter casual spam, not
// provide a hard guarantee.
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
    if (!checkRateLimit(clientIp)) {
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

function checkRateLimit(ip) {
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

async function verifyTurnstile(body, request, env) {
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
        return { ok: true };
    }

    // When verification is enforced, a missing token is always a hard 403.
    const token = body?.["cf-turnstile-response"];
    if (!token || typeof token !== "string") {
        return {
            ok: false,
            status: 403,
            payload: { success: false, error: "Bot verification failed. Please try again." },
        };
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
        const verifyData = await verifyRes.json().catch(() => ({}));
        if (verifyData.success) {
            return { ok: true };
        }

        const errors = Array.isArray(verifyData["error-codes"]) ? verifyData["error-codes"] : [];
        const serverMisconfigured = errors.includes("invalid-input-secret") || errors.includes("missing-input-secret");
        return {
            ok: false,
            status: serverMisconfigured ? 503 : 403,
            payload: {
                success: false,
                error: serverMisconfigured
                    ? "Contact verification is temporarily unavailable."
                    : "Bot verification failed. Please try again.",
            },
        };
    } catch (err) {
        console.error("Turnstile verification error:", err?.message || err);
        return {
            ok: false,
            status: 503,
            payload: {
                success: false,
                error: "Contact verification is temporarily unavailable.",
            },
        };
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

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
// Soft anti-abuse only: this Map lives in isolate memory, so it resets on
// Worker restarts and is not shared across edge locations. Acceptable tradeoff
// for a low-traffic contact form where the goal is to deter casual spam, not
// provide a hard guarantee.
const rateLimitMap = new Map();

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname === "/api/send-email") {
            return handleSendEmail(request, env);
        }

        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }

        return new Response("Not found", { status: 404 });
    },
};

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

    let body;
    try {
        body = await request.json();
    } catch {
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
                fallback: true,
            },
            503,
            headers
        );
    }

    const lead = validation.fields;
    const dbSuccess = await saveLead(lead, env);
    const emailResult = await sendLeadEmail(lead, env);

    if (!emailResult.ok) {
        console.error("Resend delivery error:", emailResult.error);
        return json(
            {
                success: false,
                error: "Failed to send message. Please try again later.",
                dbSaved: dbSuccess,
                fallback: true,
            },
            502,
            headers
        );
    }

    return json(
        {
            success: true,
            id: emailResult.id,
            dbSaved: dbSuccess,
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
    const allowedOrigin = isAllowedOrigin(origin, requestUrl) ? origin : "https://catalystappliedai.com";
    return {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin",
    };
}

function checkRateLimit(ip) {
    const now = Date.now();
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

    const token = body?.["cf-turnstile-response"];
    const clientRenderedTurnstile = body?.turnstileEnabled === true;
    if (!token) {
        if (!clientRenderedTurnstile) {
            return {
                ok: false,
                status: 503,
                payload: {
                    success: false,
                    error: "Contact verification is not configured yet.",
                    fallback: true,
                },
            };
        }
        return {
            ok: false,
            status: 403,
            payload: { error: "Bot verification failed. Please try again." },
        };
    }

    const form = new FormData();
    form.append("secret", turnstileSecret);
    form.append("response", token);
    const remoteIp = request.headers.get("CF-Connecting-IP");
    if (remoteIp) {
        form.append("remoteip", remoteIp);
    }

    try {
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: form,
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
                error: "Bot verification failed. Please try again.",
                fallback: serverMisconfigured,
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
                fallback: true,
            },
        };
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

async function saveLead(lead, env) {
    if (!env.MONGODB_DATA_API_KEY || !env.MONGODB_DATA_API_URL) {
        return false;
    }

    try {
        const res = await fetch(`${env.MONGODB_DATA_API_URL}/action/insertOne`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": env.MONGODB_DATA_API_KEY,
            },
            body: JSON.stringify({
                dataSource: env.MONGODB_DATA_SOURCE || "CatalystAppliedAI",
                database: env.MONGODB_DATABASE || "catalyst_db",
                collection: env.MONGODB_COLLECTION || "contacts",
                document: {
                    ...lead,
                    createdAt: { $date: new Date().toISOString() },
                },
            }),
        });

        if (!res.ok) {
            console.error("MongoDB Data API error:", await res.text());
            return false;
        }
        return true;
    } catch (err) {
        console.error("MongoDB Data API save failed:", err?.message || err);
        return false;
    }
}

async function sendLeadEmail(lead, env) {
    const emailHtml = buildLeadEmail(lead);
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: env.RESEND_FROM_EMAIL,
            to: [env.RESEND_TO_EMAIL],
            subject: `New Lead: ${lead.name}${lead.company ? ` [${lead.company}]` : ""}`,
            html: emailHtml,
        }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        return { ok: false, error: data?.message || data?.error || `Resend returned ${res.status}` };
    }

    return { ok: true, id: data?.id };
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
    return Response.json(payload, { status, headers });
}

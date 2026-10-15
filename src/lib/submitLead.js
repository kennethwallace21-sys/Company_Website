const REQUEST_TIMEOUT_MS = 15 * 1000;
const FALLBACK_MESSAGE = "We could not send your message. Please email sales@catalystappliedai.com directly.";

function generateIdempotencyKey() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    // Same alphabet and length range the Worker accepts: [A-Za-z0-9-], 8 to 64 chars.
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}-${Math.random().toString(36).slice(2, 12)}`;
}

// One key per submission attempt series: retries of the same payload reuse the key
// (so a retry after a timeout cannot send a duplicate email), a changed payload gets
// a new key, and a successful send clears it.
let pendingAttempt = null;

function keyForPayload(fields) {
    // The Turnstile token changes on every widget reset, so it is not part of the payload identity.
    const { "cf-turnstile-response": _token, turnstileEnabled: _enabled, ...content } = fields || {};
    const signature = JSON.stringify(content);
    if (!pendingAttempt || pendingAttempt.signature !== signature) {
        pendingAttempt = { signature, key: generateIdempotencyKey() };
    }
    return pendingAttempt.key;
}

/**
 * Submits a lead form to the Worker contact API (the only intake path).
 *
 * @param {Record<string, unknown>} fields - the form fields to submit.
 * @returns {Promise<{ ok: boolean, message?: string, showEmailFallback?: boolean }>}
 */
export async function submitLead(fields) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const base = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${base}/api/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...(fields || {}), idempotencyKey: keyForPayload(fields) }),
            signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data?.success === true) {
            pendingAttempt = null;
            return { ok: true };
        }
        if (res.status === 429) {
            return { ok: false, message: "Too many attempts. Please wait a minute and try again." };
        }
        if (res.status === 403 || res.status === 400) {
            return {
                ok: false,
                message: data?.error || "Please check the form and try again.",
                // A 403 (bot check or blocked origin) is not something the visitor can fix, so offer email.
                ...(res.status === 403 ? { showEmailFallback: true } : {}),
            };
        }
        return { ok: false, message: FALLBACK_MESSAGE, showEmailFallback: true };
    } catch {
        return { ok: false, message: FALLBACK_MESSAGE, showEmailFallback: true };
    } finally {
        clearTimeout(timer);
    }
}

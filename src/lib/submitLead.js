// Web3Forms access keys are public client-side keys by design; same key as the previous site.
const WEB3FORMS_KEY = "ce776c26-fe34-4447-beb3-fda8fedd044f";

/**
 * Submits a lead form through the Worker contact API, then falls back to
 * Web3Forms if the Worker or its third-party services are unavailable.
 *
 * The fallback uses FormData (not JSON): a JSON Content-Type header triggers
 * a CORS preflight and api.web3forms.com does not answer preflights.
 *
 * @param {Record<string, unknown>} fields - the form fields to submit.
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function submitLead(fields) {
    const apiResult = await submitViaWorker(fields);
    if (apiResult.ok) {
        return apiResult;
    }

    if (!apiResult.shouldFallback) {
        return { ok: false, message: apiResult.message };
    }

    return submitViaWeb3Forms(fields);
}

async function submitViaWorker(fields) {
    try {
        const base = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${base}/api/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields || {}),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.success !== false) {
            return { ok: true, deliveredBy: "worker" };
        }

        const shouldFallback = data?.fallback === true || res.status >= 500;
        return {
            ok: false,
            shouldFallback,
            message: data?.error || "Something went wrong. Please try again or email us directly.",
        };
    } catch {
        return {
            ok: false,
            shouldFallback: true,
            message: "Something went wrong. Please try again or email us directly.",
        };
    }
}

async function submitViaWeb3Forms(fields) {
    try {
        const form = new FormData();
        form.append("access_key", WEB3FORMS_KEY);
        form.append("subject", "New lead from catalystappliedai.com");
        form.append("from_name", "Catalyst Applied AI website");
        form.append("botcheck", "");
        for (const [k, v] of Object.entries(fields || {})) {
            if (k === "cf-turnstile-response" || k === "turnstileEnabled") {
                continue;
            }
            form.append(k, v == null ? "" : String(v));
        }
        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: form,
        });
        const data = await res.json().catch(() => ({}));
        if (data?.success === true) {
            return { ok: true, message: data.message };
        }
        return { ok: false, message: data?.message || "Something went wrong. Please try again or email us directly." };
    } catch (err) {
        return { ok: false, message: "Something went wrong. Please try again or email us directly." };
    }
}

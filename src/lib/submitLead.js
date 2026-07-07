// Web3Forms access keys are public client-side keys by design; same key as the previous site.
const WEB3FORMS_KEY = "ce776c26-fe34-4447-beb3-fda8fedd044f";

/**
 * Submits a lead form directly to Web3Forms from the client.
 *
 * Cloudflare Pages does not run the Vercel-format serverless functions in
 * api/, so posting to /api/send-email falls through to the SPA rewrite and
 * returns a false HTTP 200. Web3Forms accepts the submission directly from
 * the browser, so no server is required.
 *
 * Uses FormData (not JSON) on purpose: a JSON Content-Type header triggers
 * a CORS preflight and api.web3forms.com does not answer preflights. A
 * FormData POST with no custom headers skips the preflight entirely (the
 * browser sets the multipart boundary itself).
 *
 * @param {Record<string, unknown>} fields - the form fields to submit.
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function submitLead(fields) {
    try {
        const form = new FormData();
        form.append("access_key", WEB3FORMS_KEY);
        form.append("subject", "New lead from catalystappliedai.com");
        form.append("from_name", "Catalyst Applied AI website");
        form.append("botcheck", "");
        for (const [k, v] of Object.entries(fields || {})) {
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

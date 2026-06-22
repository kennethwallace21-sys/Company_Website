import { Resend } from "resend";
import connectToDatabase from "../src/lib/mongodb.js";
import Contact from "../src/models/Contact.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const TO_EMAIL = process.env.RESEND_TO_EMAIL || "delivered@resend.dev";

// ─── Allowed origins (add Vercel preview pattern as needed) ───
const ALLOWED_ORIGINS = [
  "https://catalystappliedai.com",
  "https://www.catalystappliedai.com",
];
// Allow Vercel preview deployments
const isAllowedOrigin = (origin) => {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Match Vercel preview URLs: https://<project>-<hash>-<scope>.vercel.app
  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;
  // Allow localhost in development
  if (process.env.NODE_ENV !== "production" && origin.startsWith("http://localhost")) return true;
  return false;
};

// ─── Simple in-memory rate limiter (per Vercel function instance) ───
// For production, replace with Upstash Redis (@upstash/ratelimit)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 submissions per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return true;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return false;
  return true;
}

// ─── Input validation ───
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 60;
const MAX_EMAIL = 100;
const MAX_COMPANY = 100;
const MAX_MESSAGE = 5000;

function validateInput({ name, email, company, message }) {
  const errors = [];
  if (!name || typeof name !== "string" || !name.trim()) errors.push("Name is required.");
  else if (name.length > MAX_NAME) errors.push(`Name must be ${MAX_NAME} characters or fewer.`);

  if (!email || typeof email !== "string" || !email.trim()) errors.push("Email is required.");
  else if (email.length > MAX_EMAIL) errors.push(`Email must be ${MAX_EMAIL} characters or fewer.`);
  else if (!EMAIL_REGEX.test(email)) errors.push("Please provide a valid email address.");

  if (company && typeof company === "string" && company.length > MAX_COMPANY) {
    errors.push(`Company must be ${MAX_COMPANY} characters or fewer.`);
  }

  if (!message || typeof message !== "string" || !message.trim()) errors.push("Message is required.");
  else if (message.length > MAX_MESSAGE) errors.push(`Message must be ${MAX_MESSAGE} characters or fewer.`);

  return errors;
}

export default async function handler(req, res) {
  // ─── Method check ───
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // ─── CORS / Origin check ───
  const origin = req.headers["origin"];
  if (!isAllowedOrigin(origin)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ─── Rate limiting ───
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
    || req.headers["x-real-ip"]
    || req.socket?.remoteAddress
    || "unknown";
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({ error: "Too many requests. Please try again later." });
    return;
  }

  try {
    // ─── Parse body ───
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const { name, email, company, message } = body || {};

    // ─── Honeypot check (reject if hidden field is filled) ───
    if (body?.website) {
      // Silently accept but don't process — bots fill this field
      res.status(200).json({ success: true });
      return;
    }

    // ─── Validate inputs ───
    const validationErrors = validateInput({ name, email, company, message });
    if (validationErrors.length > 0) {
      res.status(400).json({ error: validationErrors.join(" ") });
      return;
    }

    // Sanitize inputs
    const cleanName = name.trim().slice(0, MAX_NAME);
    const cleanEmail = email.trim().toLowerCase().slice(0, MAX_EMAIL);
    const cleanCompany = (company || "").trim().slice(0, MAX_COMPANY);
    const cleanMessage = message.trim().slice(0, MAX_MESSAGE);

    // ─── Build email HTML ───
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 40px 20px; background-color: #060a14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0d1425; border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="padding: 30px; background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%); text-align: center;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.05em; color: white; text-transform: uppercase;">
                New Inbound Lead
              </h1>
            </div>
            <div style="padding: 40px;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #60a5fa; font-weight: 700; margin-bottom: 8px;">From</div>
              <div style="font-size: 16px; color: #e2e8f0; margin-bottom: 24px; line-height: 1.5;"><strong>${escapeHtml(cleanName)}</strong></div>
              
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #60a5fa; font-weight: 700; margin-bottom: 8px;">Email Address</div>
              <div style="font-size: 16px; color: #e2e8f0; margin-bottom: 24px; line-height: 1.5;">${escapeHtml(cleanEmail)}</div>
              
              ${cleanCompany ? `
                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #60a5fa; font-weight: 700; margin-bottom: 8px;">Company / Organization</div>
                <div style="font-size: 16px; color: #e2e8f0; margin-bottom: 24px; line-height: 1.5;">${escapeHtml(cleanCompany)}</div>
              ` : ""}
              
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #60a5fa; font-weight: 700; margin-bottom: 8px;">Detailed Request</div>
              <div style="background-color: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 20px; border-left: 3px solid #3b82f6; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                ${escapeHtml(cleanMessage).replace(/\n/g, "<br>")}
              </div>
            </div>
            <div style="padding: 30px; text-align: center; border-top: 1px solid rgba(59, 130, 246, 0.1); font-size: 11px; color: #64748b; letter-spacing: 0.025em;">
              Sent via Catalyst Applied AI Lead Engine<br/>
              © ${new Date().getFullYear()} Catalyst Applied AI. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    // ─── 1. Save to MongoDB ───
    let dbSuccess = false;
    try {
      await connectToDatabase();
      await Contact.create({
        name: cleanName,
        email: cleanEmail,
        company: cleanCompany,
        message: cleanMessage,
      });
      dbSuccess = true;
    } catch (dbError) {
      // Log without leaking connection details
      console.error("MongoDB save failed:", dbError.message);
    }

    // ─── 2. Send email via Resend ───
    // NOTE: replyTo intentionally omitted — copy the sender's email from the
    // body instead. Setting replyTo to user-supplied input allows attackers to
    // control where replies go and can be used for social engineering.
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `New Lead: ${cleanName}${cleanCompany ? ` [${cleanCompany}]` : ""}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend delivery error:", error.message);
      res.status(500).json({ error: "Failed to send message. Please try again later." });
      return;
    }

    res.status(200).json({
      success: true,
      id: data?.id,
      dbSaved: dbSuccess,
    });
  } catch (err) {
    console.error("API handler error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

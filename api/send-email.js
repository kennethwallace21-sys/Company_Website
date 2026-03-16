import { Resend } from "resend";
import connectToDatabase from "../src/lib/mongodb.js";
import Contact from "../src/models/Contact.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const TO_EMAIL = process.env.RESEND_TO_EMAIL || "delivered@resend.dev";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const { name, email, company, message } = body || {};

    if (!email || !message || !name) {
      res.status(400).json({
        error:
          "Missing required fields: name, email, and message are required.",
      });
      return;
    }

    // Save to MongoDB
    try {
      await connectToDatabase();
      await Contact.create({
        name,
        email,
        company: company || "",
        message
      });
      console.log("Contact saved to MongoDB");
    } catch (dbError) {
      console.error("MongoDB Save Error:", dbError);
      // We continue even if DB save fails to at least try sending the email
    }

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
              © ${new Date().getFullYear()} Catalyst Applied AI. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `[v1.0.4] New Lead: ${name} ${company ? `[${company}]` : ""}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      res.status(500).json({ error: error.message || "Failed to send email" });
      return;
    }

    res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Send email error:", err);
    res.status(500).json({ error: err.message || "Failed to send email" });
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

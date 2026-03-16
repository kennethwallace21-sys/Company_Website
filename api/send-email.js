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

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `Contact form: ${name}${company ? ` (${company})` : ""}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
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

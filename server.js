require("dotenv").config();

const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));

// Configure Nodemailer Transporter
const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

let transporter = null;
if (emailUser && emailPass) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
  console.log("⚡ Nodemailer active: Configured to transmit to skvishwakarma828401@gmail.com");
} else {
  console.log("ℹ️ Nodemailer: Set EMAIL_USER and EMAIL_PASS in .env to receive live Gmail alerts.");
}

// Contact API with Nodemailer Dispatch
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields (Name, Email, Message)."
    });
  }

  console.log("📨 New Contact Payload received:", {
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  });

  // If Nodemailer is configured, send live email to Gmail inbox
  if (transporter) {
    try {
      const recipient = process.env.RECIPIENT_EMAIL || "skvishwakarma828401@gmail.com";

      // 1. Mail to Sumit Kumar
      await transporter.sendMail({
        from: `"${name} (Portfolio Inquiry)" <${emailUser}>`,
        replyTo: email,
        to: recipient,
        subject: `🚀 Portfolio Message from ${name} [${email}]`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
            <div style="background: linear-gradient(135deg, #00f0ff, #a855f7); padding: 20px; text-align: center;">
              <h2 style="margin: 0; color: #030712; font-size: 22px;">⚡ New Subspace Message Received</h2>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">You have received a new contact submission from your 3D Robot Portfolio:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #00f0ff; font-weight: bold; width: 30%;">Transmitter:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #f8fafc;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #00f0ff; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #f8fafc;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #00f0ff; font-weight: bold;">Timestamp:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;">${new Date().toLocaleString()}</td>
                </tr>
              </table>
              <div style="background: #131b2e; padding: 18px; border-radius: 8px; border-left: 4px solid #00f0ff; margin-top: 15px;">
                <h4 style="margin: 0 0 8px 0; color: #00f0ff; font-size: 14px; text-transform: uppercase;">Message Payload:</h4>
                <p style="margin: 0; color: #f8fafc; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${message}</p>
              </div>
              <div style="margin-top: 24px; text-align: center;">
                <a href="mailto:${email}?subject=Re:%20Your%20Portfolio%20Inquiry%20to%20Sumit%20Kumar" style="display: inline-block; background: #00f0ff; color: #030712; font-weight: bold; padding: 12px 24px; border-radius: 50px; text-decoration: none;">Reply to ${name}</a>
              </div>
            </div>
          </div>
        `
      });

      console.log(`✅ Email successfully dispatched to ${recipient}`);
    } catch (err) {
      console.error("❌ Nodemailer send error:", err.message);
    }
  }

  res.status(201).json({
    success: true,
    message: "Transmission verified! Your message was received and logged."
  });
});

// Direct Resume Download Route
app.get("/resume.pdf", (req, res) => {
  const file = path.join(__dirname, "public", "resume.pdf");
  res.download(file, "Sumit_Kumar_FullStack_Resume.pdf");
});

// Fallback to frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Portfolio running at http://localhost:${PORT}`);
  });
}

module.exports = app;
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { run, get, all, close, toPgSql } from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import twilio from "twilio";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcodeTerminal from "qrcode-terminal";
import fs from "fs";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { syncParticipantToSalesforce, deleteParticipantFromSalesforce } from "./salesforce.js";
import { syncParticipantToZoho, deleteParticipantFromZoho } from "./zoho.js";
import {
  sendWhatsAppMessage,
  sendRegistrationWhatsApp,
  sendPaymentWhatsApp,
  isWhatsAppConfigured,
  activeProvider,
  normalizePhone,
} from "./whatsapp.js";
import { runPostRegistrationFlow, runPaymentConfirmedFlow } from "./automation.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in the environment.");
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;

app.use(mongoSanitize());
// Nodemailer SMTP Transporter (works with Gmail port 465 AND Brevo port 587)
const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: smtpPort,
  secure: smtpPort === 465, // true for port 465 (Gmail), false for 587 (Brevo/TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.warn("SMTP connection not available (running without email delivery):", err.message);
  } else {
    console.log("SMTP Server is ready to send emails!");
  }
});

// ---- NOTIFICATION HELPERS ----

async function sendRegistrationEmail(participant) {
  const raceLabel = participant.raceId === "5k" ? "5K Fun Run" : participant.raceId === "10k" ? "10K Challenge" : "Half Marathon (21K)";
  const feeMap = { "5k": "₹499", "10k": "₹799", "21k": "₹999" };
  const fee = feeMap[participant.raceId] || "₹799";
  const regDate = new Date(participant.registrationDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

  const plainText = `Dear ${participant.fullName},

Congratulations! You have successfully registered for Run Beyond Limits 2026.

YOUR REGISTRATION DETAILS:
- Full Name: ${participant.fullName}
- Phone: ${participant.phone}
- City: ${participant.cityId}
- Race Category: ${raceLabel}
- T-Shirt Size: ${participant.size}
- Registered On: ${regDate}
- Payment Status: PENDING — ${fee} due

Our team will send you the payment link shortly. Once payment is confirmed, you will receive your BIB number and a link to download your participation certificate.

If you have any questions, please contact us at support@infinitymiles.com.

Run Beyond Limits 2026 Team`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#F1F5F9;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#F1F5F9;">
        Registration confirmed for Run Beyond Limits 2026. Payment of ${fee} is pending. Details inside.
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:30px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <!-- View in Browser -->
            <tr>
              <td style="padding:12px 36px 0;text-align:right;">
                <a href="${BASE_URL}" style="color:#64748B;font-size:11px;text-decoration:underline;">View in browser</a>
              </td>
            </tr>
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#1E3A8A 0%,#F97316 100%);padding:40px 36px;text-align:center;">
                <p style="color:rgba(255,255,255,0.8);margin:0 0 6px;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Run Beyond Limits 2026</p>
                <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">Registration Confirmed</h1>
                <p style="color:rgba(255,255,255,0.9);margin:12px 0 0;font-size:15px;">You're one step closer to race day!</p>
              </td>
            </tr>
            <!-- Greeting -->
            <tr>
              <td style="padding:32px 36px 8px;">
                <p style="font-size:18px;color:#0F172A;margin:0;">Dear <strong>${participant.fullName}</strong>,</p>
                <p style="color:#475569;margin:14px 0 0;line-height:1.7;font-size:15px;">Thank you for registering! Your spot for <strong>${raceLabel}</strong> has been reserved. Please review your details below:</p>
              </td>
            </tr>
            <!-- Details Table -->
            <tr>
              <td style="padding:24px 36px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid #E2E8F0;">
                  <tr style="background:#F8FAFC;">
                    <td style="padding:14px 18px;font-weight:600;color:#1E3A8A;width:45%;border-bottom:1px solid #E2E8F0;font-size:14px;">Full Name</td>
                    <td style="padding:14px 18px;color:#334155;border-bottom:1px solid #E2E8F0;font-size:14px;">${participant.fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 18px;font-weight:600;color:#1E3A8A;border-bottom:1px solid #E2E8F0;font-size:14px;">Phone</td>
                    <td style="padding:14px 18px;color:#334155;border-bottom:1px solid #E2E8F0;font-size:14px;">${participant.phone}</td>
                  </tr>
                  <tr style="background:#F8FAFC;">
                    <td style="padding:14px 18px;font-weight:600;color:#1E3A8A;border-bottom:1px solid #E2E8F0;font-size:14px;">City</td>
                    <td style="padding:14px 18px;color:#334155;border-bottom:1px solid #E2E8F0;font-size:14px;text-transform:capitalize;">${participant.cityId}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 18px;font-weight:600;color:#1E3A8A;border-bottom:1px solid #E2E8F0;font-size:14px;">Race Category</td>
                    <td style="padding:14px 18px;color:#334155;border-bottom:1px solid #E2E8F0;font-size:14px;">${raceLabel}</td>
                  </tr>
                  <tr style="background:#F8FAFC;">
                    <td style="padding:14px 18px;font-weight:600;color:#1E3A8A;border-bottom:1px solid #E2E8F0;font-size:14px;">T-Shirt Size</td>
                    <td style="padding:14px 18px;color:#334155;border-bottom:1px solid #E2E8F0;font-size:14px;">${participant.size}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 18px;font-weight:600;color:#1E3A8A;border-bottom:1px solid #E2E8F0;font-size:14px;">Registered On</td>
                    <td style="padding:14px 18px;color:#334155;border-bottom:1px solid #E2E8F0;font-size:14px;">${regDate}</td>
                  </tr>
                  <tr style="background:#FFF7ED;">
                    <td style="padding:14px 18px;font-weight:600;color:#C2410C;font-size:14px;">Payment Status</td>
                    <td style="padding:14px 18px;color:#C2410C;font-weight:700;font-size:14px;">PENDING &mdash; ${fee} due</td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Info box -->
            <tr>
              <td style="padding:0 36px 28px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="background:#EFF6FF;border-left:4px solid #1E3A8A;border-radius:8px;padding:18px 22px;">
                      <p style="margin:0 0 4px;color:#1E3A8A;font-weight:600;font-size:14px;">What happens next?</p>
                      <p style="margin:0;color:#1E40AF;font-size:13px;line-height:1.7;">Our team will send you the payment link shortly. Once your payment is confirmed, you will receive your <strong>BIB number</strong> and a link to download your <strong>participation certificate</strong>.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Divider -->
            <tr><td style="padding:0 36px;"><hr style="border:none;border-top:1px solid #E2E8F0;margin:0;"></td></tr>
            <!-- Contact -->
            <tr>
              <td style="padding:24px 36px;text-align:center;">
                <p style="margin:0 0 4px;color:#64748B;font-size:13px;">Have questions? Reach out to us</p>
                <a href="mailto:support@infinitymiles.com" style="color:#1E3A8A;font-size:14px;font-weight:600;text-decoration:none;">support@infinitymiles.com</a>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#F8FAFC;padding:24px 36px;text-align:center;border-top:1px solid #E2E8F0;">
                <p style="margin:0;color:#94A3B8;font-size:12px;line-height:1.6;">Run Beyond Limits 2026 &bull; This is an automated email sent to ${participant.email}</p>
                <p style="margin:8px 0 0;color:#94A3B8;font-size:11px;">You received this because you registered for Run Beyond Limits 2026.</p>
                <p style="margin:6px 0 0;"><a href="mailto:support@infinitymiles.com?subject=Unsubscribe" style="color:#94A3B8;font-size:11px;text-decoration:underline;">Unsubscribe</a></p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body></html>
  `;

  try {
    await transporter.sendMail({
      from: `"Run Beyond Limits 2026" <${process.env.SMTP_FROM}>`,
      to: participant.email,
      replyTo: "support@infinitymiles.com",
      subject: `Run Beyond Limits 2026 — Registration Confirmed for ${participant.fullName}`,
      text: plainText,
      html: htmlContent,
      headers: {
        "List-Unsubscribe": `<mailto:support@infinitymiles.com?subject=unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Mailer": "RunBeyondLimits-Mailer/1.0",
        "X-Campaign": "marathon-2026"
      }
    });
    console.log(`Registration email sent to ${participant.email}`);
  } catch (err) {
    console.error(`Failed to send email to ${participant.email}:`, err.message);
  }
}

async function sendPaymentConfirmationEmail(participant) {
  const raceLabel = participant.raceId === "5k" ? "5K Fun Run" : participant.raceId === "10k" ? "10K Challenge" : "Half Marathon (21K)";
  const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
  const certLink = `${BASE_URL}/api/certificate/download/${participant._id}`;

  const raceDate = "September 27, 2026";

  const plainText = `Dear ${participant.fullName},

Your payment is confirmed! You're officially registered for Run Beyond Limits 2026.

CONFIRMED DETAILS:
- Race Category: ${raceLabel}
- City: ${participant.cityId}
- BIB Number: ${participant.bibNumber}
- T-Shirt Size: ${participant.size}
- Payment Status: CONFIRMED & PAID

WHAT'S NEXT:
- Race Day: ${raceDate}
- Arrival Time: 5:30 AM
- What to Bring: Valid photo ID, printed BIB number
- Wear your Run Beyond Limits 2026 T-shirt

Download your certificate: ${certLink}

If you have any questions, please contact us at support@infinitymiles.com.

See you on race day!
Run Beyond Limits 2026 Team`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#F1F5F9;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#F1F5F9;">
        Payment confirmed for Run Beyond Limits 2026. Your BIB number is ${participant.bibNumber}. Download your certificate now.
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:30px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <!-- View in Browser -->
            <tr>
              <td style="padding:12px 36px 0;text-align:right;">
                <a href="${BASE_URL}" style="color:#64748B;font-size:11px;text-decoration:underline;">View in browser</a>
              </td>
            </tr>
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#059669 0%,#1E3A8A 100%);padding:40px 36px;text-align:center;">
                <p style="color:rgba(255,255,255,0.8);margin:0 0 6px;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Run Beyond Limits 2026</p>
                <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">Payment Successful!</h1>
                <p style="color:rgba(255,255,255,0.9);margin:12px 0 0;font-size:15px;">You're officially in the race</p>
              </td>
            </tr>
            <!-- Greeting -->
            <tr>
              <td style="padding:32px 36px 8px;">
                <p style="font-size:18px;color:#0F172A;margin:0;">Dear <strong>${participant.fullName}</strong>,</p>
                <p style="color:#475569;margin:14px 0 0;line-height:1.7;font-size:15px;">Great news! Your payment has been confirmed and your spot for <strong>${raceLabel}</strong> is now locked in. Here are your confirmed details:</p>
              </td>
            </tr>
            <!-- Details Table -->
            <tr>
              <td style="padding:24px 36px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid #E2E8F0;">
                  <tr style="background:#F8FAFC;">
                    <td style="padding:14px 18px;font-weight:600;color:#1E3A8A;width:45%;border-bottom:1px solid #E2E8F0;font-size:14px;">Race Category</td>
                    <td style="padding:14px 18px;color:#334155;border-bottom:1px solid #E2E8F0;font-size:14px;">${raceLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 18px;font-weight:600;color:#1E3A8A;border-bottom:1px solid #E2E8F0;font-size:14px;">City</td>
                    <td style="padding:14px 18px;color:#334155;border-bottom:1px solid #E2E8F0;font-size:14px;text-transform:capitalize;">${participant.cityId}</td>
                  </tr>
                  <tr style="background:#F8FAFC;">
                    <td style="padding:14px 18px;font-weight:600;color:#1E3A8A;border-bottom:1px solid #E2E8F0;font-size:14px;">BIB Number</td>
                    <td style="padding:14px 18px;color:#1E3A8A;border-bottom:1px solid #E2E8F0;font-weight:700;font-size:18px;letter-spacing:1px;">${participant.bibNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 18px;font-weight:600;color:#1E3A8A;border-bottom:1px solid #E2E8F0;font-size:14px;">T-Shirt Size</td>
                    <td style="padding:14px 18px;color:#334155;border-bottom:1px solid #E2E8F0;font-size:14px;">${participant.size}</td>
                  </tr>
                  <tr style="background:#F0FDF4;">
                    <td style="padding:14px 18px;font-weight:600;color:#059669;font-size:14px;">Payment Status</td>
                    <td style="padding:14px 18px;color:#059669;font-weight:700;font-size:14px;">CONFIRMED & PAID</td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Certificate Button -->
            <tr>
              <td style="padding:8px 36px 32px;text-align:center;">
                <p style="color:#334155;margin:0 0 16px;font-size:15px;">Your participation certificate is ready to download:</p>
                <a href="${certLink}" style="display:inline-block;background:linear-gradient(135deg,#1E3A8A,#F97316);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:50px;font-weight:700;font-size:15px;letter-spacing:0.5px;">Download Certificate</a>
              </td>
            </tr>
            <!-- Divider -->
            <tr><td style="padding:0 36px;"><hr style="border:none;border-top:1px solid #E2E8F0;margin:0;"></td></tr>
            <!-- What's Next -->
            <tr>
              <td style="padding:28px 36px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="background:#F0FDF4;border-radius:10px;padding:24px 22px;border:1px solid #BBF7D0;">
                      <p style="margin:0 0 14px;color:#065F46;font-size:16px;font-weight:700;">What's Next?</p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:6px 0;color:#334155;font-size:14px;line-height:1.7;width:30px;vertical-align:top;">&#128197;</td>
                          <td style="padding:6px 0;color:#334155;font-size:14px;line-height:1.7;"><strong>Race Day:</strong> ${raceDate}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;color:#334155;font-size:14px;line-height:1.7;width:30px;vertical-align:top;">&#9200;</td>
                          <td style="padding:6px 0;color:#334155;font-size:14px;line-height:1.7;"><strong>Arrival Time:</strong> 5:30 AM (please be punctual)</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;color:#334155;font-size:14px;line-height:1.7;width:30px;vertical-align:top;">&#128196;</td>
                          <td style="padding:6px 0;color:#334155;font-size:14px;line-height:1.7;"><strong>Bring:</strong> Valid photo ID + printed BIB number</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;color:#334155;font-size:14px;line-height:1.7;width:30px;vertical-align:top;">&#127917;</td>
                          <td style="padding:6px 0;color:#334155;font-size:14px;line-height:1.7;"><strong>Wear:</strong> Your Run Beyond Limits 2026 T-shirt</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Divider -->
            <tr><td style="padding:0 36px;"><hr style="border:none;border-top:1px solid #E2E8F0;margin:0;"></td></tr>
            <!-- Contact -->
            <tr>
              <td style="padding:28px 36px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="background:#EFF6FF;border-radius:10px;padding:20px 22px;border:1px solid #BFDBFE;text-align:center;">
                      <p style="margin:0 0 6px;color:#1E3A8A;font-size:14px;font-weight:600;">Need Help?</p>
                      <p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">Contact our support team anytime</p>
                      <a href="mailto:support@infinitymiles.com" style="display:inline-block;margin-top:10px;color:#1E3A8A;font-size:14px;font-weight:600;text-decoration:none;">support@infinitymiles.com</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#F8FAFC;padding:24px 36px;text-align:center;border-top:1px solid #E2E8F0;">
                <p style="margin:0;color:#94A3B8;font-size:12px;line-height:1.6;">Run Beyond Limits 2026 &bull; This is an automated email sent to ${participant.email}</p>
                <p style="margin:8px 0 0;color:#94A3B8;font-size:11px;">You received this because you registered and paid for Run Beyond Limits 2026.</p>
                <p style="margin:6px 0 0;"><a href="mailto:support@infinitymiles.com?subject=Unsubscribe" style="color:#94A3B8;font-size:11px;text-decoration:underline;">Unsubscribe</a></p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body></html>
  `;

  try {
    await transporter.sendMail({
      from: `"Run Beyond Limits 2026" <${process.env.SMTP_FROM}>`,
      to: participant.email,
      replyTo: "support@infinitymiles.com",
      subject: `Run Beyond Limits 2026 — Payment Confirmed! Your BIB is ${participant.bibNumber}`,
      text: plainText,
      html: htmlContent,
      headers: {
        "List-Unsubscribe": `<mailto:support@infinitymiles.com?subject=unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Mailer": "RunBeyondLimits-Mailer/1.0",
        "X-Campaign": "marathon-2026-payment"
      }
    });
    console.log(`Payment confirmation email sent to ${participant.email} with BIB: ${participant.bibNumber}`);
  } catch (err) {
    console.error(`Failed to send payment email to ${participant.email}:`, err.message);
  }
}

// --- NOTIFICATION DELIVERY CHANNELS & MOCKS ---

async function sendSMS(phone, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  // Normalise to E.164 so trunk-prefixed numbers (09876543210) are handled.
  const to = normalizePhone(phone);
  if (!to) {
    console.warn(`[SMS] Invalid phone number: ${phone}`);
    return;
  }

  // Fallback to console mock if Twilio credentials are not configured
  if (!accountSid || !authToken || !fromNumber || accountSid === "your_twilio_account_sid" || authToken === "your_twilio_auth_token" || fromNumber === "your_twilio_phone_number") {
    console.log(`\n[SMS Mock] Sent to ${to}:\n${message}\n`);
    return;
  }

  try {
    const twilioClient = twilio(accountSid, authToken);
    await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to
    });
    console.log(`[Twilio SMS API] Successfully sent to ${to}`);
  } catch (error) {
    console.error(`[Twilio SMS API] Error sending to ${to}:`, error.message);
  }
}

// --- WHATSAPP WEB CLIENT CONFIGURATION ---
// Automatically detect and use Windows local Chrome path to bypass Puppeteer download issues
let chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
if (!fs.existsSync(chromePath)) {
  chromePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
}
if (!fs.existsSync(chromePath)) {
  chromePath = undefined;
}

const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
  },
  puppeteer: {
    headless: true,
    executablePath: chromePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
});

let isWhatsAppReady = false;

whatsappClient.on("qr", async (qr) => {
  console.log("\n------------------------------------------------------------");
  console.log("👉 SCAN THE QR CODE IN THE TERMINAL OR OPEN THE FILE:");
  console.log("👉 whatsapp-qr.png");
  console.log("------------------------------------------------------------\n");

  try {
    const qrPath = "whatsapp-qr.png";
    await QRCode.toFile(qrPath, qr, { width: 300 });
    console.log(`🖼️  QR Code image saved successfully to: ${qrPath}`);
  } catch (err) {
    console.error("❌ Failed to save QR PNG file:", err.message);
  }
});

whatsappClient.on("ready", () => {
  isWhatsAppReady = true;
  console.log("✅ WhatsApp Web Client is fully connected and ready!");
  
  try {
    const qrPath = "whatsapp-qr.png";
    if (fs.existsSync(qrPath)) {
      fs.unlinkSync(qrPath);
      console.log("🧹 Cleaned up temporary whatsapp-qr.png file.");
    }
  } catch (err) {
    console.error("❌ Failed to clean up QR PNG file:", err.message);
  }
});

whatsappClient.on("auth_failure", (msg) => {
  console.error("❌ WhatsApp Web authentication failed:", msg);
});

whatsappClient.on("disconnected", (reason) => {
  isWhatsAppReady = false;
  console.log("❌ WhatsApp Web was disconnected:", reason);
  // Re-initialize to generate a new QR code if not disabled
  if (process.env.DISABLE_WHATSAPP !== 'true') {
    whatsappClient.initialize().catch(err => console.error("Re-initialization error:", err));
  }
});

// Initialize the legacy whatsapp-web.js client only when explicitly enabled.
// The WhatsApp Cloud API is the primary channel; this browser-based client
// requires a QR scan and a local Chrome install, so it stays opt-in.
const USE_WEB_CLIENT = process.env.WHATSAPP_WEB_CLIENT === "true" && process.env.DISABLE_WHATSAPP !== "true";
if (USE_WEB_CLIENT) {
  whatsappClient.initialize().catch((err) => console.error("WhatsApp Initialization error:", err));
} else {
  const provider = activeProvider();
  console.log(
    provider === "mock"
      ? "WhatsApp not configured - messages will be logged to console (mock mode)."
      : `WhatsApp automation active via ${provider}.`
  );
}

// WhatsApp delivery. Uses the Meta Cloud API (or Twilio); falls back to a
// console mock when no provider is configured. Never throws.
async function sendWhatsApp(phone, message) {
  return sendWhatsAppMessage(phone, message);
}

function getVenue(cityId) {
  const venues = {
    chennai: "Marina Beach Outer Promenade, Chennai",
    bengaluru: "Kanteerava Stadium, Bengaluru",
    salem: "Mahatma Gandhi Stadium, Salem"
  };
  return venues[cityId.toLowerCase()] || "Main Marathon Venue";
}

// Send WhatsApp Notification (rich formatted message via the WhatsApp service)
function sendWhatsAppNotification(participant) {
  sendRegistrationWhatsApp(participant).catch((err) =>
    console.error("Registration WhatsApp error:", err.message)
  );
}

// --- CERTIFICATE PDF BUFFER GENERATOR ---

function generateCertificatePDF(participant) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
        margins: { top: 0, left: 0, bottom: 0, right: 0 }
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on("error", reject);

      const width = doc.page.width;
      const height = doc.page.height;

      // Outer border
      doc.rect(20, 20, width - 40, height - 40)
        .lineWidth(5)
        .stroke("#1E3A8A");

      // Inner thin border
      doc.rect(30, 30, width - 60, height - 60)
        .lineWidth(1)
        .stroke("#F97316");

      // Decorative corners
      const drawCorner = (x, y, dx, dy) => {
        doc.save()
          .rect(x, y, dx, dy)
          .fill("#1E3A8A");
      };
      drawCorner(20, 20, 30, 10);
      drawCorner(20, 20, 10, 30);
      drawCorner(width - 50, 20, 30, 10);
      drawCorner(width - 30, 20, 10, 30);
      drawCorner(20, height - 30, 30, 10);
      drawCorner(20, height - 40, 10, 30);
      drawCorner(width - 50, height - 30, 30, 10);
      drawCorner(width - 30, height - 40, 10, 30);

      // Header Logo/Text
      doc.fillColor("#1E3A8A")
        .font("Helvetica-Bold")
        .fontSize(36)
        .text("RUN BEYOND LIMITS 2026", 0, 80, { align: "center" });

      doc.fillColor("#F97316")
        .font("Helvetica")
        .fontSize(14)
        .text("OFFICIAL FINISHER CERTIFICATE", 0, 130, { align: "center", characterSpacing: 2 });

      // Middle text
      doc.fillColor("#334155")
        .font("Helvetica-Oblique")
        .fontSize(18)
        .text("This is proudly presented to", 0, 190, { align: "center" });

      // Participant Name
      doc.fillColor("#0F172A")
        .font("Helvetica-Bold")
        .fontSize(32)
        .text(participant.fullName.toUpperCase(), 0, 230, { align: "center" });

      // Race completion details
      let raceDetailsText = `For successfully completing the ${participant.raceId.toUpperCase()} category in the Run Beyond Limits 2026 Marathon held at ${getVenue(participant.cityId)}`;
      if (participant.raceStatus === "Finished" && participant.finishTime) {
        raceDetailsText += ` with an official finish time of ${participant.finishTime}.`;
      } else {
        raceDetailsText += `.`;
      }
      doc.fillColor("#334155")
        .font("Helvetica")
        .fontSize(16)
        .text(raceDetailsText, 100, 290, { align: "center", width: width - 200, lineGap: 6 });

      // Bib Number and Date
      doc.fillColor("#1E3A8A")
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(`BIB NUMBER: ${participant.bibNumber || "N/A"}`, 100, 380, { align: "left" });

      doc.fillColor("#1E3A8A")
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("DATE: SEPTEMBER 27, 2026", width - 280, 380, { align: "right" });

      // Signatures
      doc.save();

      // Signature Line 1
      doc.moveTo(100, 470).lineTo(250, 470).lineWidth(1).stroke("#94A3B8");
      doc.fillColor("#475569")
        .font("Helvetica")
        .fontSize(12)
        .text("Race Director", 100, 480, { width: 150, align: "center" });

      // Signature Line 2
      doc.moveTo(width - 250, 470).lineTo(width - 100, 470).lineWidth(1).stroke("#94A3B8");
      doc.fillColor("#475569")
        .font("Helvetica")
        .fontSize(12)
        .text("Event Coordinator", width - 250, 480, { width: 150, align: "center" });

      // QR Code for verification
      const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
      const verifyUrl = `${BASE_URL}/api/certificate/lookup?query=${encodeURIComponent(participant.email)}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 120, margin: 1 });
      const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, "");
      const qrBuffer = Buffer.from(qrBase64, "base64");
      doc.image(qrBuffer, width - 150, height - 160, { width: 80, height: 80 });
      doc.fillColor("#475569")
        .font("Helvetica")
        .fontSize(8)
        .text("Scan to verify", width - 150, height - 75, { width: 80, align: "center" });

      doc.restore();
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// --- PRE-EVENT & POST-EVENT NOTIFICATION SENDERS ---

async function send7DayReminder(participant) {
  const raceLabel = participant.raceId === "5k" ? "5K Fun Run" : participant.raceId === "10k" ? "10K Challenge" : "Half Marathon (21K)";
  const venue = getVenue(participant.cityId);
  const marathonDateStr = process.env.MARATHON_DATE || "2026-09-27T05:30:00+05:30";
  const marathonDate = new Date(marathonDateStr);
  const dateStr = marathonDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const waMessage = `Hello ${participant.fullName}! 🏃‍♂️ Only *7 Days Left* until Run Beyond Limits 2026!\n\n📅 Date: ${dateStr}\n⏰ Reporting: 5:00 AM IST\n📍 Venue: ${venue}\n\nGet plenty of rest, hydrate well, and prepare your gear. We'll see you at the starting line! 💪`;
  sendWhatsApp(participant.phone, waMessage);

  const smsMessage = `Hi ${participant.fullName}, only 7 days to go for Run Beyond Limits 2026! Reporting time: 5:00 AM at ${venue}. Get ready!`;
  sendSMS(participant.phone, smsMessage);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#F1F5F9;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:30px 0;">
        <tr><td align="center">
          <table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <tr>
              <td style="background:linear-gradient(135deg,#1E3A8A 0%,#F97316 100%);padding:40px 36px;text-align:center;color:#ffffff;">
                <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Run Beyond Limits 2026</p>
                <h1 style="margin:10px 0 0;font-size:28px;">7 Days to Go! 🏃‍♂️</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 36px;">
                <p style="font-size:16px;color:#0F172A;">Dear <strong>${participant.fullName}</strong>,</p>
                <p style="color:#475569;font-size:15px;line-height:1.6;">The countdown has officially begun! In exactly one week, you'll be running beyond your limits. Here are the event details:</p>
                <table width="100%" style="border-collapse:collapse;margin:20px 0;border:1px solid #E2E8F0;">
                  <tr style="background:#F8FAFC;"><td style="padding:12px;font-weight:bold;width:30%;">Date</td><td style="padding:12px;">${dateStr}</td></tr>
                  <tr><td style="padding:12px;font-weight:bold;">Reporting</td><td style="padding:12px;">5:00 AM IST sharp</td></tr>
                  <tr style="background:#F8FAFC;"><td style="padding:12px;font-weight:bold;">Venue</td><td style="padding:12px;">${venue}</td></tr>
                  <tr><td style="padding:12px;font-weight:bold;">Category</td><td style="padding:12px;">${raceLabel}</td></tr>
                </table>
                <p style="color:#1E3A8A;font-weight:bold;margin-top:20px;">💡 Pro Runner Tips for this week:</p>
                <ul style="color:#475569;font-size:14px;line-height:1.6;">
                  <li><strong>Hydration</strong>: Increase your daily water intake starting today.</li>
                  <li><strong>Sleep</strong>: Aim for at least 7-8 hours of quality sleep each night.</li>
                  <li><strong>Training</strong>: Keep your runs light and comfortable. Do not over-exert.</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:24px 36px;text-align:center;border-top:1px solid #E2E8F0;font-size:12px;color:#94A3B8;">
                Run Beyond Limits 2026 &bull; support@infinitymiles.com
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Run Beyond Limits 2026" <${process.env.SMTP_FROM}>`,
      to: participant.email,
      subject: `Run Beyond Limits 2026 — 7 Days To Go! 🏃‍♂️`,
      html: htmlContent
    });
    console.log(`7-day reminder email sent to ${participant.email}`);
  } catch (err) {
    console.error(`Failed to send 7-day email to ${participant.email}:`, err.message);
  }
}

async function send3DayReminder(participant) {
  const raceLabel = participant.raceId === "5k" ? "5K Fun Run" : participant.raceId === "10k" ? "10K Challenge" : "Half Marathon (21K)";
  const venue = getVenue(participant.cityId);

  const waMessage = `Hello ${participant.fullName}! ⏳ Just *3 Days Left* until Run Beyond Limits 2026!\n\n💼 Check-in opens at 5:00 AM IST.\n🆔 Required Documents: Please bring a valid photo ID card for check-in verification.\n\nSet your target, double-check your gear, and let's make it count! 👟`;
  sendWhatsApp(participant.phone, waMessage);

  const smsMessage = `Hi ${participant.fullName}, the countdown is on! 3 days to Run Beyond Limits 2026. Remember to bring your original ID card for check-in verification.`;
  sendSMS(participant.phone, smsMessage);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#F1F5F9;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:30px 0;">
        <tr><td align="center">
          <table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <tr>
              <td style="background:linear-gradient(135deg,#1E3A8A 0%,#F97316 100%);padding:40px 36px;text-align:center;color:#ffffff;">
                <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Run Beyond Limits 2026</p>
                <h1 style="margin:10px 0 0;font-size:28px;">3 Days Left! ⏳</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 36px;">
                <p style="font-size:16px;color:#0F172A;">Dear <strong>${participant.fullName}</strong>,</p>
                <p style="color:#475569;font-size:15px;line-height:1.6;">The countdown is heating up! Here is your essential guide for check-in and preparation:</p>
                <div style="background:#FFF7ED;border-left:4px solid #F97316;padding:15px;margin:20px 0;border-radius:6px;color:#C2410C;font-size:14px;line-height:1.6;">
                  <strong>⚠️ CRITICAL CHECK-IN INFORMATION:</strong><br/>
                  - Check-in desks open at **5:00 AM IST** sharp.<br/>
                  - You **MUST** bring a valid original photo ID card (Aadhaar, DL, Passport, etc.).<br/>
                  - Please have your registration email/SMS handy.
                </div>
                <p style="color:#1E3A8A;font-weight:bold;">🎒 Marathon Check-List:</p>
                <ul style="color:#475569;font-size:14px;line-height:1.6;">
                  <li>Comfortable running shoes & socks</li>
                  <li>Your allocated BIB (if picked up early or will be collected)</li>
                  <li>Light pre-race breakfast plan</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:24px 36px;text-align:center;border-top:1px solid #E2E8F0;font-size:12px;color:#94A3B8;">
                Run Beyond Limits 2026 &bull; support@infinitymiles.com
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Run Beyond Limits 2026" <${process.env.SMTP_FROM}>`,
      to: participant.email,
      subject: `Run Beyond Limits 2026 — Countdown: 3 Days Left! ⏳`,
      html: htmlContent
    });
    console.log(`3-day reminder email sent to ${participant.email}`);
  } catch (err) {
    console.error(`Failed to send 3-day email to ${participant.email}:`, err.message);
  }
}

async function send24HourReminder(participant) {
  const venue = getVenue(participant.cityId);

  const waMessage = `Final reminder, ${participant.fullName}! 📢 Run Beyond Limits 2026 starts tomorrow!\n\n📍 Venue: ${venue}\n⏰ Reporting: 5:00 AM IST sharp\n📞 Emergency Support: +91 98765 43210\n\nEnsure your BIB is pinned, rest well tonight, and bring your energy! See you at the starting line! 🏁`;
  sendWhatsApp(participant.phone, waMessage);

  const smsMessage = `Final call, ${participant.fullName}! Run Beyond Limits 2026 starts in 24 hours. Venue: ${venue} at 5:00 AM. Emergency contact: +91 98765 43210.`;
  sendSMS(participant.phone, smsMessage);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#F1F5F9;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:30px 0;">
        <tr><td align="center">
          <table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <tr>
              <td style="background:linear-gradient(135deg,#1E3A8A 0%,#F97316 100%);padding:40px 36px;text-align:center;color:#ffffff;">
                <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Run Beyond Limits 2026</p>
                <h1 style="margin:10px 0 0;font-size:28px;">Tomorrow is the Day! 🏁</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 36px;">
                <p style="font-size:16px;color:#0F172A;">Dear <strong>${participant.fullName}</strong>,</p>
                <p style="color:#475569;font-size:15px;line-height:1.6;">This is it! 24 hours until the marathon. Here is the last-minute information you need to know:</p>
                <table width="100%" style="border-collapse:collapse;margin:20px 0;border:1px solid #E2E8F0;">
                  <tr style="background:#F8FAFC;"><td style="padding:12px;font-weight:bold;width:30%;">Venue</td><td style="padding:12px;">${venue}</td></tr>
                  <tr><td style="padding:12px;font-weight:bold;">Reporting Time</td><td style="padding:12px;">5:00 AM IST sharp</td></tr>
                  <tr style="background:#F8FAFC;"><td style="padding:12px;font-weight:bold;">Support Contact</td><td style="padding:12px;">+91 98765 43210</td></tr>
                </table>
                <p style="color:#1E3A8A;font-weight:bold;">⚠️ Last-Minute Tips:</p>
                <ul style="color:#475569;font-size:14px;line-height:1.6;">
                  <li><strong>Early Dinner</strong>: Eat a carb-rich, easily digestible dinner tonight.</li>
                  <li><strong>Hydration</strong>: Keep sipping water, but don't drink excessively right before sleeping.</li>
                  <li><strong>Pin Your BIB</strong>: Pin your BIB to the front of your t-shirt tonight so it is ready.</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:24px 36px;text-align:center;border-top:1px solid #E2E8F0;font-size:12px;color:#94A3B8;">
                Run Beyond Limits 2026 &bull; support@infinitymiles.com
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Run Beyond Limits 2026" <${process.env.SMTP_FROM}>`,
      to: participant.email,
      subject: `Run Beyond Limits 2026 — Tomorrow is the Day! 🏁`,
      html: htmlContent
    });
    console.log(`24-hour reminder email sent to ${participant.email}`);
  } catch (err) {
    console.error(`Failed to send 24-hour email to ${participant.email}:`, err.message);
  }
}

async function sendThankYouNotification(participant) {
  const waMessage = `Thank you, ${participant.fullName}! 🎉 You successfully completed the Run Beyond Limits 2026 Marathon! We appreciate your passion, energy, and sportsmanship. We hope to see you in our future events! 🏃‍♀️✨`;
  sendWhatsApp(participant.phone, waMessage);

  const smsMessage = `Thank you ${participant.fullName} for running in Run Beyond Limits 2026! You did amazing. Stay tuned for certificate distribution.`;
  sendSMS(participant.phone, smsMessage);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#F1F5F9;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:30px 0;">
        <tr><td align="center">
          <table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <tr>
              <td style="background:linear-gradient(135deg,#1E3A8A 0%,#F97316 100%);padding:40px 36px;text-align:center;color:#ffffff;">
                <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Run Beyond Limits 2026</p>
                <h1 style="margin:10px 0 0;font-size:28px;">Thank You, Runners! 🎉</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 36px;">
                <p style="font-size:16px;color:#0F172A;">Dear <strong>${participant.fullName}</strong>,</p>
                <p style="color:#475569;font-size:15px;line-height:1.6;">Congratulations on completing the marathon! We are incredibly inspired by your strength, determination, and community spirit.</p>
                <p style="color:#475569;font-size:15px;line-height:1.6;">Thank you for making Run Beyond Limits 2026 an unforgettable experience. Stay tuned for details about our future events and runner forums!</p>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:24px 36px;text-align:center;border-top:1px solid #E2E8F0;font-size:12px;color:#94A3B8;">
                Run Beyond Limits 2026 &bull; support@infinitymiles.com
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Run Beyond Limits 2026" <${process.env.SMTP_FROM}>`,
      to: participant.email,
      subject: `Run Beyond Limits 2026 — Thank You for Participating! 🎉`,
      html: htmlContent
    });
    console.log(`Thank-you email sent to ${participant.email}`);
  } catch (err) {
    console.error(`Failed to send thank-you email to ${participant.email}:`, err.message);
  }
}

async function sendCertificateNotification(participant) {
  const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
  const downloadLink = `${BASE_URL}/api/certificate/download/${participant._id}`;

  const waMessage = `Hello ${participant.fullName}! 🏆 Your official participation certificate is ready for download!\n\nDownload here: ${downloadLink}\n\nCongratulations on running beyond your limits! 🎖️`;
  sendWhatsApp(participant.phone, waMessage);

  const smsMessage = `Hi ${participant.fullName}, download your official Run Beyond Limits 2026 certificate here: ${downloadLink}`;
  sendSMS(participant.phone, smsMessage);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#F1F5F9;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:30px 0;">
        <tr><td align="center">
          <table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <tr>
              <td style="background:linear-gradient(135deg,#1E3A8A 0%,#F97316 100%);padding:40px 36px;text-align:center;color:#ffffff;">
                <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Run Beyond Limits 2026</p>
                <h1 style="margin:10px 0 0;font-size:28px;">Your Finisher Certificate 🏆</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 36px;">
                <p style="font-size:16px;color:#0F172A;">Dear <strong>${participant.fullName}</strong>,</p>
                <p style="color:#475569;font-size:15px;line-height:1.6;">Congratulations on completing your race! We are proud to present you with your official participation certificate.</p>
                <p style="color:#475569;font-size:15px;line-height:1.6;">Your certificate is attached to this email as a PDF. You can also download it at any time using the link below:</p>
                <p style="text-align:center;margin:30px 0;">
                  <a href="${downloadLink}" style="background:#1E3A8A;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">Download Certificate PDF</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:24px 36px;text-align:center;border-top:1px solid #E2E8F0;font-size:12px;color:#94A3B8;">
                Run Beyond Limits 2026 &bull; support@infinitymiles.com
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  try {
    const pdfBuffer = await generateCertificatePDF(participant);

    await transporter.sendMail({
      from: `"Run Beyond Limits 2026" <${process.env.SMTP_FROM}>`,
      to: participant.email,
      subject: `Run Beyond Limits 2026 — Your Finisher Certificate! 🏆`,
      html: htmlContent,
      attachments: [
        {
          filename: `Certificate-${participant.fullName.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer
        }
      ]
    });
    console.log(`Certificate email sent to ${participant.email}`);
  } catch (err) {
    console.error(`Failed to send certificate email to ${participant.email}:`, err.message);
  }
}

// --- AUTOMATED SCHEDULER ---

async function runNotificationScheduler() {
  const marathonDateStr = process.env.MARATHON_DATE || "2026-09-27T05:30:00+05:30";
  const marathonDate = new Date(marathonDateStr);
  const now = new Date();
  const timeDiffMs = marathonDate.getTime() - now.getTime();
  
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;

  console.log(`[Scheduler] Checking notifications at ${now.toISOString()}. Time until marathon: ${(timeDiffMs / (1000 * 60 * 60 * 24)).toFixed(2)} days.`);

  try {
    // 1. Pre-event notifications (7 days, 3 days, 24 hours before)
    if (timeDiffMs > 0) {
      // 7-day reminder
      if (timeDiffMs <= sevenDaysMs) {
        const participants = await Participant.find({ "sentNotifications.sevenDaysBefore": false });
        if (participants.length > 0) {
          console.log(`[Scheduler] Found ${participants.length} participants for 7-day reminder.`);
          for (const p of participants) {
            await send7DayReminder(p);
            p.sentNotifications.sevenDaysBefore = true;
            await p.save();
          }
        }
      }
      
      // 3-day reminder
      if (timeDiffMs <= threeDaysMs) {
        const participants = await Participant.find({ "sentNotifications.threeDaysBefore": false });
        if (participants.length > 0) {
          console.log(`[Scheduler] Found ${participants.length} participants for 3-day reminder.`);
          for (const p of participants) {
            await send3DayReminder(p);
            p.sentNotifications.threeDaysBefore = true;
            await p.save();
          }
        }
      }

      // 24-hour reminder
      if (timeDiffMs <= twentyFourHoursMs) {
        const participants = await Participant.find({ "sentNotifications.twentyFourHoursBefore": false });
        if (participants.length > 0) {
          console.log(`[Scheduler] Found ${participants.length} participants for 24-hour reminder.`);
          for (const p of participants) {
            await send24HourReminder(p);
            p.sentNotifications.twentyFourHoursBefore = true;
            await p.save();
          }
        }
      }
    } else {
      // 2. Post-event notifications (after event completion)
      // Thank You Message
      const thankYouParticipants = await Participant.find({ "sentNotifications.thankYou": false });
      if (thankYouParticipants.length > 0) {
        console.log(`[Scheduler] Found ${thankYouParticipants.length} participants for post-event thank you message.`);
        for (const p of thankYouParticipants) {
          await sendThankYouNotification(p);
          p.sentNotifications.thankYou = true;
          await p.save();
        }
      }

      // Certificate Delivery (Paid participants only)
      const certificateParticipants = await Participant.find({ 
        paymentStatus: "Paid", 
        "sentNotifications.certificate": false 
      });
      if (certificateParticipants.length > 0) {
        console.log(`[Scheduler] Found ${certificateParticipants.length} paid participants for certificate distribution.`);
        for (const p of certificateParticipants) {
          await sendCertificateNotification(p);
          p.sentNotifications.certificate = true;
          await p.save();
        }
      }
    }
  } catch (error) {
    console.error("[Scheduler] Error running notification scheduler:", error);
  }
}

// Start scheduler on launch (with 20-second delay to ensure database connection and WhatsApp client are ready)
setTimeout(() => {
  runNotificationScheduler();
}, 20000);

// Run scheduler check once every hour
setInterval(runNotificationScheduler, 60 * 60 * 1000);


// PostgreSQL database schema setup
async function ensureSchema() {
  await run(`
CREATE TABLE IF NOT EXISTS participants (
  _id SERIAL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "dob" TEXT NOT NULL,
  "gender" TEXT NOT NULL,
  "phone" TEXT NOT NULL UNIQUE,
  "email" TEXT NOT NULL UNIQUE,
  "emergencyContact" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "pincode" TEXT NOT NULL,
  "size" TEXT NOT NULL,
  "cityId" TEXT NOT NULL,
  "raceId" TEXT NOT NULL,
  "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
  "paymentTxnId" TEXT DEFAULT '',
  "bibNumber" TEXT DEFAULT '',
  "salesforceLeadId" TEXT DEFAULT '',
  "zohoLeadId" TEXT DEFAULT '',
  "registrationDate" TEXT NOT NULL DEFAULT NOW(),
  "finishTime" TEXT DEFAULT '',
  "raceStatus" TEXT NOT NULL DEFAULT 'Pending',
  "sentSeven" INTEGER NOT NULL DEFAULT 0,
  "sentThree" INTEGER NOT NULL DEFAULT 0,
  "sentTwentyFour" INTEGER NOT NULL DEFAULT 0,
  "sentThankYou" INTEGER NOT NULL DEFAULT 0,
  "sentCertificate" INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS contact_messages (
  _id SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "date" TEXT NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS admins (
  _id SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL
);
`);
}

await ensureSchema();


function participantDefaults(p = {}) {
  return Object.assign({
    _id: undefined,
    paymentStatus: "Pending",
    paymentTxnId: "",
    bibNumber: "",
    salesforceLeadId: "",
    zohoLeadId: "",
    registrationDate: new Date().toISOString(),
    finishTime: "",
    raceStatus: "Pending",
    sentNotifications: {
      sevenDaysBefore: false,
      threeDaysBefore: false,
      twentyFourHoursBefore: false,
      thankYou: false,
      certificate: false,
    },
  }, p || {});
}

function sentToColumns(sn = {}) {
  return [
    sn.sevenDaysBefore ? 1 : 0,
    sn.threeDaysBefore ? 1 : 0,
    sn.twentyFourHoursBefore ? 1 : 0,
    sn.thankYou ? 1 : 0,
    sn.certificate ? 1 : 0,
  ];
}

function rowToParticipant(row) {
  if (!row) return null;
  const obj = {
    _id: row._id,
    fullName: row.fullName,
    dob: row.dob,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    emergencyContact: row.emergencyContact,
    address: row.address,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    size: row.size,
    cityId: row.cityId,
    raceId: row.raceId,
    paymentStatus: row.paymentStatus,
    paymentTxnId: row.paymentTxnId,
    bibNumber: row.bibNumber,
    salesforceLeadId: row.salesforceLeadId,
    zohoLeadId: row.zohoLeadId,
    registrationDate: row.registrationDate,
    finishTime: row.finishTime,
    raceStatus: row.raceStatus,
    sentNotifications: {
      sevenDaysBefore: !!row.sentSeven,
      threeDaysBefore: !!row.sentThree,
      twentyFourHoursBefore: !!row.sentTwentyFour,
      thankYou: !!row.sentThankYou,
      certificate: !!row.sentCertificate,
    },
  };
  obj.save = async function () {
    const sn = this.sentNotifications || {};
    const params = [
      this.fullName, this.dob, this.gender, this.phone, this.email, this.emergencyContact,
      this.address, this.city, this.state, this.pincode, this.size, this.cityId, this.raceId,
      this.paymentStatus, this.paymentTxnId, this.bibNumber, this.salesforceLeadId, this.zohoLeadId,
      this.registrationDate instanceof Date ? this.registrationDate.toISOString() : this.registrationDate,
      this.finishTime, this.raceStatus,
      ...sentToColumns(sn),
    ];
    if (!this._id) {
      const r = await run(`INSERT INTO participants (
        "fullName", "dob", "gender", "phone", "email", "emergencyContact", "address", "city", "state", "pincode",
        "size", "cityId", "raceId", "paymentStatus", "paymentTxnId", "bibNumber", "salesforceLeadId", "zohoLeadId",
        "registrationDate", "finishTime", "raceStatus", "sentSeven", "sentThree", "sentTwentyFour", "sentThankYou", "sentCertificate"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING _id`, params);
      this._id = r.rows[0]._id;
    } else {
      await run(`UPDATE participants SET
        "fullName"=?, "dob"=?, "gender"=?, "phone"=?, "email"=?, "emergencyContact"=?, "address"=?, "city"=?, "state"=?, "pincode"=?,
        "size"=?, "cityId"=?, "raceId"=?, "paymentStatus"=?, "paymentTxnId"=?, "bibNumber"=?, "salesforceLeadId"=?, "zohoLeadId"=?,
        "registrationDate"=?, "finishTime"=?, "raceStatus"=?, "sentSeven"=?, "sentThree"=?, "sentTwentyFour"=?, "sentThankYou"=?, "sentCertificate"=?
        WHERE _id=?`, [...params, this._id]);
    }
    return this;
  };
  return obj;
}

const SENT_COLUMN_MAP = {
  "sentNotifications.sevenDaysBefore": "sentSeven",
  "sentNotifications.threeDaysBefore": "sentThree",
  "sentNotifications.twentyFourHoursBefore": "sentTwentyFour",
  "sentNotifications.thankYou": "sentThankYou",
  "sentNotifications.certificate": "sentCertificate",
};

// PostgreSQL folds unquoted identifiers to lowercase, which would break the
// app's camelCase field names. Always quote interpolated column names.
function quoteIdent(name) {
  if (typeof name !== "string" || !/^[A-Za-z_][A-Za-z0-9_.]*$/.test(name)) {
    throw new Error(`Unsafe SQL identifier: ${name}`);
  }
  if (name.includes(".")) {
    return name
      .split(".")
      .map((part) => `"${part}"`)
      .join(".");
  }
  return `"${name}"`;
}

function buildWhere(filter = {}) {
  const where = [];
  const params = [];
  for (const [key, val] of Object.entries(filter || {})) {
    if (SENT_COLUMN_MAP[key]) {
      where.push(`${quoteIdent(SENT_COLUMN_MAP[key])} = ?`);
      params.push(val ? 1 : 0);
    } else if (val && typeof val === "object" && !Array.isArray(val)) {
      // skip complex operators; handled in specific routes
    } else {
      where.push(`${quoteIdent(key)} = ?`);
      params.push(val);
    }
  }
  return { where, params };
}

class ParticipantQuery {
  constructor(filter) { this.filter = filter || {}; this.sortSpec = null; this.leanFlag = false; }
  sort(spec) { this.sortSpec = spec; return this; }
  lean() { this.leanFlag = true; return this; }
  async _run() {
    const { where, params } = buildWhere(this.filter);
    let sql = "SELECT * FROM participants";
    if (where.length) sql += " WHERE " + where.join(" AND ");
    if (this.sortSpec) {
      const order = Object.entries(this.sortSpec).map(([k, v]) => `${quoteIdent(k)} ${v === -1 || v === "desc" ? "DESC" : "ASC"}`).join(", ");
      if (order) sql += " ORDER BY " + order;
    }
    const rows = await all(sql, params);
    let res = rows.map(rowToParticipant);
    if (this.leanFlag) res = res.map((x) => { const { save, ...rest } = x; return rest; });
    return res;
  }
  then(resolve, reject) {
    this._run().then(resolve, reject);
  }
}

// Build a new document with defaults AND a save() method (rowToParticipant
// attaches save(), participantDefaults alone would return a plain object).
const Participant = function (data) {
  return rowToParticipant(participantDefaults(data || {}));
};
Participant.find = function (filter) { return new ParticipantQuery(filter || {}); };
Participant.findOne = async function (filter = {}) {
  const rows = await new ParticipantQuery(filter)._run();
  return rows[0] || null;
};
Participant.findById = async function (id) {
  const row = await get("SELECT * FROM participants WHERE _id = ?", [id]);
  return row ? rowToParticipant(row) : null;
};
Participant.countDocuments = async function (filter = {}) {
  const { where, params } = buildWhere(filter);
  let sql = "SELECT COUNT(*) AS c FROM participants";
  if (where.length) sql += " WHERE " + where.join(" AND ");
  const r = await get(sql, params);
  return r ? parseInt(r.c, 10) : 0;
};
Participant.findByIdAndDelete = async function (id) {
  await run("DELETE FROM participants WHERE _id = ?", [id]);
  return Promise.resolve();
};

class ContactQuery {
  constructor(filter) { this.filter = filter || {}; this.sortSpec = null; }
  sort(spec) { this.sortSpec = spec; return this; }
  async _run() {
    let sql = "SELECT * FROM contact_messages";
    if (this.sortSpec) {
      const order = Object.entries(this.sortSpec).map(([k, v]) => `${quoteIdent(k)} ${v === -1 || v === "desc" ? "DESC" : "ASC"}`).join(", ");
      if (order) sql += " ORDER BY " + order;
    }
    const rows = await all(sql);
    return rows.map((r) => ({
      _id: r._id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      message: r.message,
      date: r.date,
    }));
  }
  then(resolve, reject) {
    this._run().then(resolve, reject);
  }
}

const ContactMessage = function (data) {
  const obj = Object.assign({ _id: undefined, name: "", email: "", phone: "", message: "", date: new Date().toISOString() }, data || {});
  obj.save = async function () {
    const r = await run(`INSERT INTO contact_messages ("name", "email", "phone", "message", "date") VALUES (?, ?, ?, ?, ?) RETURNING _id`, [
      this.name, this.email, this.phone, this.message, this.date instanceof Date ? this.date.toISOString() : this.date
    ]);
    this._id = r.rows[0]._id;
    return this;
  };
  return obj;
};
ContactMessage.find = function (filter) { return new ContactQuery(filter || {}); };

const Admin = {
  findOne: async function ({ username }) {
    const row = await get("SELECT * FROM admins WHERE username = ?", [username]);
    if (!row) return null;
    const obj = { _id: row._id, username: row.username, password: row.password };
    obj.save = async function () { return this; };
    return obj;
  },
};

console.log("Connected to PostgreSQL database successfully!");

// Admin JWT Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token." });
  }
};

// --- API ROUTES ---

// Public: Health Check / Root Route
app.get("/", (req, res) => {
  res.send("Run Beyond Limits 2026 API is running smoothly. 🏃‍♂️💨");
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 registrations per window
  message: { error: "Too many registrations from this IP, please try again later." }
});

const registerSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  emergencyContact: z.string().min(10, "Valid emergency contact is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
  cityId: z.enum(["chennai", "bengaluru", "salem"]),
  raceId: z.enum(["5k", "10k", "21k"]),
});

// Public: Participant Registration
app.post("/api/register", registerLimiter, async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const newParticipant = new Participant(validatedData);
    await newParticipant.save();

    // --- Automation pipeline -------------------------------------------
    // Zoho CRM lead -> Salesforce lead -> WhatsApp -> email -> SMS.
    // Each step is isolated so a CRM/messaging outage never fails registration.
    const automation = await runPostRegistrationFlow(newParticipant, {
      save: (p) => p.save(),
      sendEmail: sendRegistrationEmail,
      sendSms: (p) => {
        const raceLabel =
          p.raceId === "5k" ? "5K Fun Run" : p.raceId === "10k" ? "10K Challenge" : "Half Marathon (21K)";
        return sendSMS(
          p.phone,
          `Hi ${p.fullName}, your registration for Run Beyond Limits 2026 (${raceLabel}) is confirmed! ` +
            `Your BIB number and certificate will be issued once payment is received.`
        );
      },
    });

    res.status(201).json({
      success: true,
      message: "Registration created successfully!",
      participant: newParticipant,
      automation: {
        zoho: automation.zoho?.ok ? "synced" : automation.zoho?.detail || "skipped",
        salesforce: automation.salesforce?.ok ? "synced" : automation.salesforce?.detail || "skipped",
        whatsapp: automation.whatsapp?.ok ? automation.whatsapp.detail : automation.whatsapp?.detail,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation Error", details: error.errors });
    }
    if (error && (/UNIQUE constraint failed/i.test(String(error.message)) || /duplicate key value violates unique constraint/i.test(String(error.message)) || (error && error.code === "23505"))) {
      return res.status(400).json({ error: "Email or Phone already registered." });
    }
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to create registration." });
  }
});

// Public: Submit Contact Message
app.post("/api/contact", async (req, res) => {
  try {
    const newMessage = new ContactMessage(req.body);
    await newMessage.save();
    res.status(201).json({ success: true, message: "Contact message saved successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Public: Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get Participants List (Players List)
app.get("/api/admin/participants", authenticateAdmin, async (req, res) => {
  try {
    const participants = await Participant.find().sort({ registrationDate: -1 });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update Payment Status & Bib Assignment
app.put("/api/admin/participants/:id/payment", authenticateAdmin, async (req, res) => {
  const { paymentStatus, paymentTxnId } = req.body;
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    participant.paymentStatus = paymentStatus;
    if (paymentTxnId) {
      participant.paymentTxnId = paymentTxnId;
    }

    // Automatically generate Bib if paid and not already set
    if (paymentStatus === "Paid" && !participant.bibNumber) {
      // Find count of paid participants in the same race and city to make it unique
      const count = await Participant.countDocuments({
        cityId: participant.cityId,
        raceId: participant.raceId,
        paymentStatus: "Paid"
      });
      const cityPrefix = participant.cityId.substring(0, 3).toUpperCase();
      const racePrefix = participant.raceId.toUpperCase();
      const nextNum = String(count + 1).padStart(4, "0");
      participant.bibNumber = `${cityPrefix}-${racePrefix}-${nextNum}`;
    }

    await participant.save();

    // --- Payment automation pipeline -----------------------------------
    // Re-sync both CRMs with the BIB number, then notify the runner.
    const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
    let automation = null;

    if (paymentStatus === "Paid") {
      automation = await runPaymentConfirmedFlow(participant, {
        save: (p) => p.save(),
        baseUrl: BASE_URL,
      });

      sendPaymentConfirmationEmail(participant);

      const downloadLink = `${BASE_URL}/api/certificate/download/${participant._id}`;
      sendSMS(
        participant.phone,
        `Hi ${participant.fullName}, your payment for Run Beyond Limits 2026 is confirmed! ` +
          `BIB: ${participant.bibNumber}. Download certificate: ${downloadLink}`
      );
    } else {
      // Keep CRM records in step even when payment is not approved.
      try {
        const zohoLeadId = await syncParticipantToZoho(participant);
        if (zohoLeadId && !participant.zohoLeadId) {
          participant.zohoLeadId = zohoLeadId;
          await participant.save();
        }
      } catch (zhErr) {
        console.error("Zoho CRM payment update sync error:", zhErr.message);
      }
    }

    res.json({ success: true, participant, automation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get Contact Messages
app.get("/api/admin/contacts", authenticateAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ date: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Edit Participant
app.put("/api/admin/participants/:id", authenticateAdmin, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.status(404).json({ error: "Participant not found" });

    const allowed = ["fullName", "phone", "email", "city", "cityId", "raceId", "size", "dob", "gender", "address", "state", "pincode", "emergencyContact", "paymentTxnId", "bibNumber", "finishTime", "raceStatus"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) participant[key] = req.body[key];
    }
    await participant.save();

    // Sync updated details to Salesforce
    try {
      const leadId = await syncParticipantToSalesforce(participant);
      if (leadId && !participant.salesforceLeadId) {
        participant.salesforceLeadId = leadId;
        await participant.save();
      }
    } catch (sfErr) {
      console.error("Salesforce edit sync error:", sfErr.message);
    }

    // Sync updated details to Zoho CRM
    try {
      const zohoLeadId = await syncParticipantToZoho(participant);
      if (zohoLeadId && !participant.zohoLeadId) {
        participant.zohoLeadId = zohoLeadId;
        await participant.save();
      }
    } catch (zhErr) {
      console.error("Zoho CRM edit sync error:", zhErr.message);
    }

    res.json({ success: true, participant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete Participant
app.delete("/api/admin/participants/:id", authenticateAdmin, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.status(404).json({ error: "Participant not found" });

    if (participant.salesforceLeadId) {
      try {
        await deleteParticipantFromSalesforce(participant.salesforceLeadId);
      } catch (sfErr) {
        console.error("Salesforce delete sync error:", sfErr.message);
      }
    }

    if (participant.zohoLeadId) {
      try {
        await deleteParticipantFromZoho(participant.zohoLeadId);
      } catch (zhErr) {
        console.error("Zoho CRM delete sync error:", zhErr.message);
      }
    }

    await Participant.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Participant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: T-Shirt Size Report
app.get("/api/admin/reports/tshirt", authenticateAdmin, async (req, res) => {
  try {
    const participants = await Participant.find().lean();
    const sizeMap = {};
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    for (const s of sizes) {
      sizeMap[s] = { size: s, total: 0, races: { "5k": 0, "10k": 0, "21k": 0 } };
    }
    for (const p of participants) {
      const s = (p.size || "").toUpperCase();
      const r = (p.raceId || "10k").toLowerCase();
      if (sizeMap[s]) {
        sizeMap[s].total++;
        if (sizeMap[s].races[r] !== undefined) sizeMap[s].races[r]++;
      }
    }
    res.json(Object.values(sizeMap));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Send Certificate Email
app.post("/api/admin/participants/:id/send-certificate", authenticateAdmin, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.status(404).json({ error: "Participant not found" });
    if (participant.paymentStatus !== "Paid") return res.status(400).json({ error: "Participant has not paid yet" });
    await sendPaymentConfirmationEmail(participant);
    res.json({ success: true, message: `Certificate email sent to ${participant.email}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public: Certificate Lookup
app.get("/api/certificate/lookup", async (req, res) => {
  const { query } = req.query; // email or phone
  if (!query) {
    return res.status(400).json({ error: "Search query (email or phone) is required" });
  }

  try {
    const row = await get(`SELECT * FROM participants WHERE "paymentStatus" = 'Paid' AND (LOWER("email") = LOWER(?) OR "phone" = ?) LIMIT 1`, [query.trim(), query.trim()]);
    const participant = row ? rowToParticipant(row) : null;

    if (!participant) {
      return res.status(404).json({ error: "No paid participant found with this email or phone number." });
    }

    res.json({
      id: participant._id,
      fullName: participant.fullName,
      city: participant.city,
      raceId: participant.raceId,
      bibNumber: participant.bibNumber
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Trigger Test Notifications
app.post("/api/admin/notifications/test-trigger", authenticateAdmin, async (req, res) => {
  const { participantId, type } = req.body;
  try {
    const participant = await Participant.findById(participantId);
    if (!participant) return res.status(404).json({ error: "Participant not found" });

    switch (type) {
      case "7days":
        await send7DayReminder(participant);
        break;
      case "3days":
        await send3DayReminder(participant);
        break;
      case "24hours":
        await send24HourReminder(participant);
        break;
      case "thankyou":
        await sendThankYouNotification(participant);
        break;
      case "certificate":
        if (participant.paymentStatus !== "Paid") {
          return res.status(400).json({ error: "Participant must be 'Paid' to receive a certificate." });
        }
        await sendCertificateNotification(participant);
        break;
      default:
        return res.status(400).json({ error: "Invalid notification type (supported: 7days, 3days, 24hours, thankyou, certificate)" });
    }

    res.json({ success: true, message: `Notification of type '${type}' successfully triggered for ${participant.fullName}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public: Generate and Download Certificate PDF
app.get("/api/certificate/download/:id", async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant || participant.paymentStatus !== "Paid") {
      return res.status(404).send("Certificate not found or participant has not paid.");
    }
    const pdfBuffer = await generateCertificatePDF(participant);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Certificate-${participant.fullName.replace(/\s+/g, "_")}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send("Error generating certificate: " + error.message);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

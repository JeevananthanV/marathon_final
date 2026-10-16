/**
 * WhatsApp automation for Run Beyond Limits 2026.
 *
 * Providers
 * ---------
 *  cloud  -> Meta WhatsApp Cloud API (recommended; server-to-server, no QR scan)
 *  twilio -> Twilio WhatsApp (uses the existing Twilio dependency)
 *  mock   -> logs the message to the console (default when unconfigured)
 *
 * Meta rules that this module handles for you:
 *  - Numbers must be E.164 (e.g. +919876543210). Indian 10-digit numbers are
 *    prefixed with the configured default country code.
 *  - You may only send free-form text inside the 24-hour customer service
 *    window. Outside it, Meta requires an APPROVED TEMPLATE. Any free-form
 *    message attempted in that state fails with code 131009, so we detect it
 *    and (if a template is configured) fall back to sending that template.
 *
 * Nothing in here throws: a messaging failure must never break a registration.
 */

import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const WA_ACCESS_TOKEN = process.env.WA_ACCESS_TOKEN;
const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID;
const WA_API_VERSION = process.env.WA_API_VERSION || "v21.0";
const WA_DEFAULT_COUNTRY_CODE = process.env.WA_DEFAULT_COUNTRY_CODE || "91";
const WA_TEMPLATE_NAME = process.env.WA_TEMPLATE_NAME || "";
const WA_TEMPLATE_LANG = process.env.WA_TEMPLATE_LANG || "en_US";

const PLACEHOLDER_VALUES = new Set([
  "your_meta_system_user_token",
  "your_whatsapp_phone_number_id",
  "your_wa_access_token",
  "",
]);

function configured(value) {
  return !!value && !PLACEHOLDER_VALUES.has(String(value).trim().toLowerCase());
}

export function isWhatsAppConfigured() {
  const provider = (process.env.WHATSAPP_PROVIDER || "").toLowerCase();
  if (provider === "twilio") {
    return configured(process.env.TWILIO_ACCOUNT_SID) && configured(process.env.TWILIO_AUTH_TOKEN);
  }
  return configured(WA_ACCESS_TOKEN) && configured(WA_PHONE_NUMBER_ID);
}

export function activeProvider() {
  const explicit = (process.env.WHATSAPP_PROVIDER || "").toLowerCase();
  if (explicit === "mock" || explicit === "none") return "mock";
  if (explicit === "twilio" && isWhatsAppConfigured()) return "twilio";
  if (explicit === "cloud" && isWhatsAppConfigured()) return "cloud";
  return isWhatsAppConfigured() ? "cloud" : "mock";
}

/**
 * Convert a stored phone value into E.164 format.
 * "9876543210" -> "+919876543210"
 */
export function normalizePhone(phone) {
  if (phone === undefined || phone === null) return null;
  let digits = String(phone).replace(/\D/g, "");
  if (!digits) return null;

  // Drop a trunk prefix used in local formats (e.g. 09876543210) BEFORE
  // deciding whether a country code is already present.
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Already carries the default country code (91XXXXXXXXXX).
  const cc = WA_DEFAULT_COUNTRY_CODE;
  if (cc && digits.length === cc.length + 10 && digits.startsWith(cc)) {
    return `+${digits}`;
  }

  // Standard 10-digit local number -> add the default country code.
  if (digits.length === 10) {
    return `+${cc}${digits}`;
  }

  // Assume any other longer number is already in international form.
  if (digits.length > 10) {
    return `+${digits}`;
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* Providers                                                           */
/* ------------------------------------------------------------------ */

async function sendViaCloudApi(to, message) {
  const url = `https://graph.facebook.com/${WA_API_VERSION}/${WA_PHONE_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: message },
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Meta Cloud API ${res.status}: ${text}`);
    err.raw = text;
    err.status = res.status;
    throw err;
  }
  return JSON.parse(text || "{}");
}

async function sendViaTwilio(to, message) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const from = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
  const res = await client.messages.create({
    body: message,
    from,
    to: `whatsapp:${to}`,
  });
  return { sid: res.sid, status: res.status };
}

async function sendTemplate(to, message) {
  const url = `https://graph.facebook.com/${WA_API_VERSION}/${WA_PHONE_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "template",
      template: {
        name: WA_TEMPLATE_NAME,
        language: { code: WA_TEMPLATE_LANG },
      },
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Meta template send ${res.status}: ${text}`);
    err.status = res.status;
    throw err;
  }
  return JSON.parse(text || "{}");
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Send a WhatsApp message. Never throws.
 * @returns {Promise<{ok:boolean, provider:string, to?:string, mock?:boolean, error?:string, id?:string}>}
 */
export async function sendWhatsAppMessage(phone, message) {
  const to = normalizePhone(phone);
  const provider = activeProvider();

  if (!to) {
    console.warn(`[WhatsApp] Invalid phone number: ${phone}`);
    return { ok: false, provider, error: "invalid_phone" };
  }

  if (provider === "mock") {
    console.log(`\n💬 [WhatsApp Mock -> ${to}]\n${message}\n`);
    return { ok: true, provider: "mock", to, mock: true };
  }

  const attempts = 3;
  let lastError = "";

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      let result;
      if (provider === "twilio") {
        result = await sendViaTwilio(to, message);
        console.log(`✅ [WhatsApp via Twilio] Sent to ${to} (sid: ${result.sid})`);
        return { ok: true, provider, to, id: result.sid };
      }

      result = await sendViaCloudApi(to, message);
      const id = result?.messages?.[0]?.id;
      console.log(`✅ [WhatsApp Cloud API] Sent to ${to} (id: ${id})`);
      return { ok: true, provider, to, id };
    } catch (err) {
      lastError = err.message;
      const status = err.status;

      // 131009 = outside the 24h window -> Meta needs an approved template.
      const outsideWindow =
        status === 400 && /131009|template/i.test(err.raw || err.message || "");

      if (outsideWindow && WA_TEMPLATE_NAME) {
        try {
          const result = await sendTemplate(to, message);
          console.log(`✅ [WhatsApp Template] Sent to ${to} (id: ${result?.messages?.[0]?.id})`);
          return { ok: true, provider, to, id: result?.messages?.[0]?.id, viaTemplate: true };
        } catch (tplErr) {
          lastError = tplErr.message;
        }
      }

      // Don't retry client errors (bad token, invalid number); do retry transient ones.
      if (status && status >= 400 && status < 500) break;

      if (attempt < attempts) {
        await sleep(400 * attempt);
      }
    }
  }

  console.error(`❌ [WhatsApp] Failed to send to ${to}: ${lastError}`);
  return { ok: false, provider, to, error: lastError };
}

/* ------------------------------------------------------------------ */
/* Domain messages                                                     */
/* ------------------------------------------------------------------ */

const raceLabel = (raceId) =>
  raceId === "5k" ? "5K Fun Run" : raceId === "10k" ? "10K Challenge" : "Half Marathon (21K)";

const cityLabel = (cityId) =>
  String(cityId || "").charAt(0).toUpperCase() + String(cityId || "").slice(1);

export function buildRegistrationMessage(participant) {
  return `Hello ${participant.fullName}! 🎉

You have successfully registered for *Run Beyond Limits 2026*.

📍 City: ${cityLabel(participant.cityId)}
🏃 Category: ${raceLabel(participant.raceId)}
👕 T-Shirt: ${participant.size}

Your registration is confirmed and your spot is reserved. Payment instructions will be sent to your email shortly.

Once payment is confirmed you will receive your *BIB number* and a link to download your participation certificate.

See you on race day! 💪

— Run Beyond Limits 2026 Team`;
}

export function buildPaymentMessage(participant, baseUrl) {
  const link = `${baseUrl}/api/certificate/download/${participant._id}`;
  return `Congratulations ${participant.fullName}! 🎉

Your payment for *Run Beyond Limits 2026* is confirmed.

🏅 BIB Number: *${participant.bibNumber}*
🏃 Category: ${raceLabel(participant.raceId)}
📍 City: ${cityLabel(participant.cityId)}

🏆 Your finisher certificate is ready:
${link}

See you on race day! 🏁

— Run Beyond Limits 2026 Team`;
}

export async function sendRegistrationWhatsApp(participant) {
  return sendWhatsAppMessage(participant.phone, buildRegistrationMessage(participant));
}

export async function sendPaymentWhatsApp(participant, baseUrl) {
  return sendWhatsAppMessage(
    participant.phone,
    buildPaymentMessage(participant, baseUrl || process.env.BASE_URL || "http://localhost:5000")
  );
}
/**
 * Unified WhatsApp gateway for Run Beyond Limits 2026.
 *
 * Sends registration / payment messages automatically. Channels are tried in
 * order and the first working one wins:
 *
 *   1. whatsapp-web.js  -> a real WhatsApp number linked via QR scan (no API keys)
 *   2. Meta Cloud API   -> official business API (server-to-server)
 *   3. Twilio WhatsApp  -> via the existing Twilio dependency
 *   4. mock             -> logs to console (default when nothing is configured)
 *
 * The QR-linked web client is the recommended channel for this project: it
 * needs no third-party subscription, and the session persists to disk so the
 * QR is scanned only once.
 *
 * Nothing here throws — a messaging failure must never break a registration.
 */

import path from "path";
import fs from "fs";
import { execFileSync } from "child_process";
import dotenv from "dotenv";
import QRCode from "qrcode";

dotenv.config();

const {
  WA_ACCESS_TOKEN,
  WA_PHONE_NUMBER_ID,
  WA_API_VERSION = "v21.0",
  WA_DEFAULT_COUNTRY_CODE = "91",
  WA_TEMPLATE_NAME = "",
  WA_TEMPLATE_LANG = "en_US",
} = process.env;

const PLACEHOLDERS = new Set([
  "your_meta_system_user_token",
  "your_whatsapp_phone_number_id",
  "your_wa_access_token",
  "",
]);

const configured = (v) => !!v && !PLACEHOLDERS.has(String(v).trim().toLowerCase());

/* ------------------------------------------------------------------ */
/* Phone helpers                                                       */
/* ------------------------------------------------------------------ */

export function normalizePhone(phone) {
  if (phone === undefined || phone === null) return null;
  let digits = String(phone).replace(/\D/g, "");
  if (!digits) return null;

  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);

  const cc = WA_DEFAULT_COUNTRY_CODE;
  if (cc && digits.length === cc.length + 10 && digits.startsWith(cc)) return `+${digits}`;
  if (digits.length === 10) return `+${cc}${digits}`;
  if (digits.length > 10) return `+${digits}`;
  return null;
}

/* ------------------------------------------------------------------ */
/* Channel availability                                                */
/* ------------------------------------------------------------------ */

const cloudConfigured = () => configured(WA_ACCESS_TOKEN) && configured(WA_PHONE_NUMBER_ID);
const twilioConfigured = () =>
  configured(process.env.TWILIO_ACCOUNT_SID) && configured(process.env.TWILIO_AUTH_TOKEN);

/* ------------------------------------------------------------------ */
/* whatsapp-web.js client (QR-linked real number)                      */
/* ------------------------------------------------------------------ */

const WEB_ENABLED = process.env.WHATSAPP_WEB_CLIENT !== "false";
const AUTH_DIR = process.env.WHATSAPP_AUTH_DIR || path.join(process.cwd(), ".wwebjs_auth");

let waClient = null;
let waStatus = WEB_ENABLED ? "starting" : "disabled";
let currentQR = null; // base64 data URL
let initPromise = null; // shared initialisation promise (prevents races)
let retryAfter = 0; // cooldown timestamp after a failed init attempt
let consecutiveFailures = 0; // drives the auto-retry backoff
let retryTimer = null; // pending auto-retry timeout

function detectChrome() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ];
  return candidates.find((p) => fs.existsSync(p));
}

async function createWebClient() {
  // Lazy import so the app starts even if puppeteer/Chrome is unavailable.
  const pkg = await import("whatsapp-web.js");
  // whatsapp-web.js exposes its classes on `.default` (and Client at top level).
  const { Client, LocalAuth } = pkg.default?.Client ? pkg.default : pkg;

  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

  return new Client({
    authStrategy: new LocalAuth({ dataPath: AUTH_DIR }),
    puppeteer: {
      headless: true,
      executablePath: detectChrome(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });
}

/**
 * A previous server process can be killed (task manager, redeploy, crash)
 * while its Chrome instance is still alive. That orphan keeps the LocalAuth
 * profile directory locked and every later start then fails with:
 *   "The browser is already running for .../​.wwebjs_auth/session"
 * Kill any browser still using our profile and drop Chrome's stale lock files.
 * Best effort only - never throws. Only called when no client is active.
 */
function cleanupStaleBrowser() {
  try {
    if (process.platform === "win32") {
      const ps =
        "$d = '" + AUTH_DIR.replace(/'/g, "''") + "'\n" +
        "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe' OR Name='headless_shell.exe' OR Name='chromium.exe'\" |\n" +
        "  Where-Object { $_.CommandLine -and $_.CommandLine -like ('*' + $d + '*') } |\n" +
        "  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }";
      const encoded = Buffer.from(ps, "utf16le").toString("base64");
      execFileSync("powershell", ["-NoProfile", "-NonInteractive", "-EncodedCommand", encoded], {
        stdio: "ignore",
        timeout: 15000,
      });
    } else {
      try {
        execFileSync("pkill", ["-f", AUTH_DIR], { stdio: "ignore" });
      } catch {
        /* exit code 1 = no matching process, that is fine */
      }
    }
  } catch {
    /* cleanup is best effort - startup must not fail because of it */
  }

  try {
    const sessionDir = path.join(AUTH_DIR, "session");
    for (const f of ["SingletonCookie", "SingletonLock", "SingletonSocket", "lockfile"]) {
      fs.rmSync(path.join(sessionDir, f), { force: true });
    }
  } catch {
    /* ignore */
  }
}

function attachClientHandlers(client) {
  client.on("qr", async (qr) => {
    waStatus = "qr_pending";
    try {
      currentQR = await QRCode.toDataURL(qr, { width: 256, margin: 1 });
    } catch {
      currentQR = null;
    }
    console.log("[WhatsApp] A new QR code is ready - open the admin WhatsApp tab to scan it.");
  });

  client.on("ready", () => {
    waStatus = "connected";
    currentQR = null;
    console.log("[WhatsApp] Web client connected - automated messages enabled.");
  });

  client.on("authenticated", () => {
    waStatus = "connected";
    currentQR = null;
  });

  client.on("auth_failure", (msg) => {
    waStatus = "error";
    currentQR = null;
    console.error("[WhatsApp] Authentication failed:", msg);
  });

  client.on("disconnected", (reason) => {
    console.warn("[WhatsApp] Disconnected:", reason);
    waClient = null;
    initPromise = null;
    if (process.env.WHATSAPP_AUTO_RECONNECT === "true" && WEB_ENABLED) {
      waStatus = "starting";
      initWebClient().catch(() => {});
    } else {
      waStatus = "disconnected";
    }
  });
}

/** Keep retrying in the background (bounded) so the tab self-heals. */
function scheduleAutoRetry() {
  if (retryTimer || !WEB_ENABLED || consecutiveFailures >= 5) return;
  const delay = Math.min(30000, 5000 * consecutiveFailures);
  retryTimer = setTimeout(() => {
    retryTimer = null;
    if (!waClient && WEB_ENABLED) initWebClient().catch(() => {});
  }, delay);
}

/**
 * Start (or reuse) the whatsapp-web.js client.
 * @param {boolean} force - ignore the failure cooldown (manual user action)
 */
async function initWebClient(force = false) {
  // Guard against concurrent calls: the first caller wins and everyone else
  // reuses the same promise. Without this, two simultaneous calls each create
  // a Client with the same dataPath and puppeteer throws
  // "The browser is already running for .../.wwebjs_auth/session".
  if (initPromise) return initPromise;
  if (!force && Date.now() < retryAfter) return waClient; // short cooldown after a failure

  initPromise = (async () => {
    if (waClient || !WEB_ENABLED) return waClient;

    // Clear an orphaned browser / stale lock left behind by a previous process.
    cleanupStaleBrowser();
    waStatus = "starting";
    currentQR = null;

    let lastError = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const client = await createWebClient();
        attachClientHandlers(client);
        waClient = client;
        await client.initialize();
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        waClient = null;
        if (attempt === 1) {
          cleanupStaleBrowser(); // the failed attempt may leave a browser behind
          await sleep(1500);
        }
      }
    }

    if (lastError) {
      console.error("[WhatsApp] Web client init failed:", lastError.message);
      waStatus = "error";
      waClient = null;
      initPromise = null; // let the next status/QR request retry
      consecutiveFailures += 1;
      retryAfter = Date.now() + Math.min(30000, 5000 * consecutiveFailures);
      scheduleAutoRetry();
    } else {
      consecutiveFailures = 0;
      retryAfter = 0;
    }

    return waClient;
  })();

  return initPromise;
}

async function sendViaWeb(to, message) {
  if (!waClient) return { ok: false, error: "web_client_not_ready" };
  const jid = `${to.replace("+", "")}@c.us`;
  await waClient.sendMessage(jid, message);
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Meta Cloud API + Twilio                                             */
/* ------------------------------------------------------------------ */

async function sendViaCloudApi(to, message) {
  const res = await fetch(
    `https://graph.facebook.com/${WA_API_VERSION}/${WA_PHONE_NUMBER_ID}/messages`,
    {
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
    }
  );
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Meta Cloud API ${res.status}: ${text}`);
    err.status = res.status;
    err.raw = text;
    throw err;
  }
  return JSON.parse(text || "{}");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sendViaTwilio(to, message) {
  const twilio = (await import("twilio")).default;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const from = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
  const r = await client.messages.create({ body: message, from, to: `whatsapp:${to}` });
  return { sid: r.sid, status: r.status };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function getWhatsAppStatus() {
  return {
    status: waStatus,
    qr: currentQR,
    webEnabled: WEB_ENABLED,
    channels: {
      web: waStatus === "connected",
      cloud: cloudConfigured(),
      twilio: twilioConfigured(),
    },
  };
}

export async function ensureWebClientStarted(force = false) {
  return initWebClient(force);
}

export async function disconnectWebClient() {
  if (waClient) {
    try {
      await waClient.destroy();
    } catch {
      /* ignore */
    }
    waClient = null;
  }
  initPromise = null; // allow a fresh client on the next start request
  waStatus = "disconnected";
  currentQR = null;
}

/**
 * Send a WhatsApp message. Tries channels in priority order and never throws.
 * @returns {Promise<{ok:boolean, provider:string, to?:string, mock?:boolean, error?:string, id?:string}>}
 */
export async function sendWhatsAppMessage(phone, message) {
  const to = normalizePhone(phone);

  if (!to) {
    console.warn(`[WhatsApp] Invalid phone number: ${phone}`);
    return { ok: false, error: "invalid_phone" };
  }

  // 1. Linked WhatsApp Web session (a real number, no API keys needed)
  if (WEB_ENABLED && waStatus === "connected") {
    try {
      await sendViaWeb(to, message);
      console.log(`[WhatsApp] Sent to ${to} via web client`);
      return { ok: true, provider: "web", to };
    } catch (err) {
      console.warn(`[WhatsApp] Web client send failed: ${err.message} — trying other channels.`);
    }
  }

  // 2. Meta Cloud API
  if (cloudConfigured()) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await sendViaCloudApi(to, message);
        const id = res?.messages?.[0]?.id;
        console.log(`[WhatsApp] Sent to ${to} via Meta Cloud API (id: ${id})`);
        return { ok: true, provider: "cloud", to, id };
      } catch (err) {
        if (attempt < 3 && !(err.status >= 400 && err.status < 500)) {
          await sleep(400 * attempt);
          continue;
        }
        console.error(`[WhatsApp] Meta Cloud API failed: ${err.message}`);
        break;
      }
    }
  }

  // 3. Twilio WhatsApp
  if (twilioConfigured()) {
    try {
      const r = await sendViaTwilio(to, message);
      console.log(`[WhatsApp] Sent to ${to} via Twilio (sid: ${r.sid})`);
      return { ok: true, provider: "twilio", to, id: r.sid };
    } catch (err) {
      console.error(`[WhatsApp] Twilio failed: ${err.message}`);
    }
  }

  // 4. Mock — log so the flow is still observable without credentials.
  console.log(`\n[WhatsApp Mock -> ${to}]\n${message}\n`);
  return { ok: true, provider: "mock", to, mock: true };
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
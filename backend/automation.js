/**
 * Registration automation pipeline for Run Beyond Limits 2026.
 *
 * Flow (fires automatically after a successful registration):
 *
 *   1. Save participant to PostgreSQL          (already done by the caller)
 *   2. Create/update Lead in Zoho CRM          -> stores zohoLeadId
 *   3. Create/update Lead in Salesforce         -> stores salesforceLeadId
 *   4. Send WhatsApp confirmation               -> automated message
 *   5. Send styled HTML email
 *   6. Send SMS
 *
 * Design rules
 * ------------
 *  - The participant record is saved FIRST, so the registration is never lost.
 *  - Every downstream step is isolated: a CRM outage or WhatsApp failure is
 *    logged and skipped, and the registration still succeeds.
 *  - CRM ids are persisted back onto the participant so later updates and
 *    deletes stay in sync.
 *  - Messaging is fired without blocking the HTTP response.
 */

import { syncParticipantToZoho } from "./zoho.js";
import { syncParticipantToSalesforce } from "./salesforce.js";
import {
  sendRegistrationWhatsApp,
  sendPaymentWhatsApp,
  sendWhatsAppMessage,
  sendVerifyQrWhatsApp,
} from "./whatsapp.js";

function step(name, ok, detail) {
  return { step: name, ok, detail: detail || undefined };
}

/**
 * Post-registration automation.
 *
 * @param {object} participant  participant document (must have _id and phone)
 * @param {object} deps
 * @param {(p:object)=>Promise<object>} deps.save   persists field changes
 * @param {(p:object)=>Promise<void>}  deps.sendEmail
 * @param {(phone:string,msg:string)=>Promise<void>} deps.sendSms
 * @returns {Promise<{zoho:object, salesforce:object, whatsapp:object, email:string, sms:string}>}
 */
export async function runPostRegistrationFlow(participant, deps) {
  const { save, sendEmail, sendSms } = deps;
  const report = { zoho: null, salesforce: null, whatsapp: null, whatsappQr: null, email: "fired", sms: "fired" };
  const results = [];

  // --- 1. Zoho CRM -----------------------------------------------------
  try {
    const zohoLeadId = await syncParticipantToZoho(participant);
    if (zohoLeadId) {
      participant.zohoLeadId = zohoLeadId;
      await save(participant);
      report.zoho = step("zoho", true, `Lead ${zohoLeadId}`);
    } else {
      report.zoho = step("zoho", false, "not configured or skipped");
    }
  } catch (err) {
    report.zoho = step("zoho", false, err.message);
    console.error("[Automation] Zoho CRM sync error:", err.message);
  }

  // --- 2. Salesforce ---------------------------------------------------
  try {
    const salesforceLeadId = await syncParticipantToSalesforce(participant);
    if (salesforceLeadId) {
      participant.salesforceLeadId = salesforceLeadId;
      await save(participant);
      report.salesforce = step("salesforce", true, `Lead ${salesforceLeadId}`);
    } else {
      report.salesforce = step("salesforce", false, "not configured or skipped");
    }
  } catch (err) {
    report.salesforce = step("salesforce", false, err.message);
    console.error("[Automation] Salesforce sync error:", err.message);
  }

  // --- 3. WhatsApp -----------------------------------------------------
  try {
    const wa = await sendRegistrationWhatsApp(participant);
    report.whatsapp = wa.ok
      ? step("whatsapp", true, wa.mock ? "mock (no provider configured)" : `sent via ${wa.provider}`)
      : step("whatsapp", false, wa.error);
  } catch (err) {
    report.whatsapp = step("whatsapp", false, err.message);
    console.error("[Automation] WhatsApp error:", err.message);
  }

  // --- 3b. Entry QR code ----------------------------------------------
  // Sent together with the confirmation: the runner shows this QR at the
  // registration booth on race day, where scanning it verifies the runner.
  try {
    if (participant.verifyCode) {
      const waQr = await sendVerifyQrWhatsApp(participant);
      report.whatsappQr = waQr.ok
        ? step("whatsapp_qr", true, waQr.mock ? "mock (no provider configured)" : `sent via ${waQr.provider}`)
        : step("whatsapp_qr", false, waQr.error);
    } else {
      report.whatsappQr = step("whatsapp_qr", false, "no verify code");
    }
  } catch (err) {
    report.whatsappQr = step("whatsapp_qr", false, err.message);
    console.error("[Automation] WhatsApp QR error:", err.message);
  }

  // --- 4/5. Email + SMS (non-blocking) --------------------------------
  Promise.resolve(sendEmail(participant)).catch((err) =>
    console.error("[Automation] Email error:", err.message)
  );
  Promise.resolve(sendSms(participant)).catch((err) =>
    console.error("[Automation] SMS error:", err.message)
  );

  for (const r of results) void r; // reserved for step timings
  console.log(
    `[Automation] Registration pipeline complete for ${participant.email}: ` +
      `Zoho=${report.zoho?.ok} WhatsApp=${report.whatsapp?.ok} Qr=${report.whatsappQr?.ok} Salesforce=${report.salesforce?.ok}`
  );

  return report;
}

/**
 * Fires after an admin approves payment: re-syncs both CRMs with the BIB number
 * and sends the WhatsApp confirmation with the certificate link.
 */
export async function runPaymentConfirmedFlow(participant, deps) {
  const { save, baseUrl } = deps;
  const report = {};

  try {
    const zohoLeadId = await syncParticipantToZoho(participant);
    if (zohoLeadId) {
      participant.zohoLeadId = zohoLeadId;
      await save(participant);
    }
    report.zoho = { ok: !!zohoLeadId };
  } catch (err) {
    report.zoho = { ok: false, error: err.message };
    console.error("[Automation] Zoho payment sync error:", err.message);
  }

  try {
    const salesforceLeadId = await syncParticipantToSalesforce(participant);
    if (salesforceLeadId) {
      participant.salesforceLeadId = salesforceLeadId;
      await save(participant);
    }
    report.salesforce = { ok: !!salesforceLeadId };
  } catch (err) {
    report.salesforce = { ok: false, error: err.message };
    console.error("[Automation] Salesforce payment sync error:", err.message);
  }

  try {
    const wa = await sendPaymentWhatsApp(participant, baseUrl);
    report.whatsapp = { ok: wa.ok, provider: wa.provider, error: wa.error };
  } catch (err) {
    report.whatsapp = { ok: false, error: err.message };
    console.error("[Automation] WhatsApp payment error:", err.message);
  }

  console.log(
    `[Automation] Payment pipeline complete for ${participant.email}: ` +
      `Zoho=${report.zoho?.ok} WhatsApp=${report.whatsapp?.ok}`
  );

  return report;
}

export { sendWhatsAppMessage };
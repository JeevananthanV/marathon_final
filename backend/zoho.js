import dotenv from "dotenv";

dotenv.config();

const {
  ZOHO_ACCOUNTS_URL,
  ZOHO_API_URL,
  ZOHO_CLIENT_ID,
  ZOHO_CLIENT_SECRET,
  ZOHO_REFRESH_TOKEN
} = process.env;

// Values shipped in .env / .env.example are treated as "not configured" so the
// integration skips cleanly instead of failing an auth round-trip.
const ZOHO_PLACEHOLDERS = new Set([
  "your_zoho_client_id",
  "your_zoho_client_secret",
  "your_zoho_refresh_token",
  "",
]);

function zohoValue(v) {
  return typeof v === "string" && !ZOHO_PLACEHOLDERS.has(v.trim().toLowerCase()) ? v.trim() : "";
}

// Helper to check if Zoho CRM is fully configured
export function isZohoConfigured() {
  return !!(
    zohoValue(ZOHO_ACCOUNTS_URL) &&
    zohoValue(ZOHO_API_URL) &&
    zohoValue(ZOHO_CLIENT_ID) &&
    zohoValue(ZOHO_CLIENT_SECRET) &&
    zohoValue(ZOHO_REFRESH_TOKEN)
  );
}

// Which variables are missing/placeholder — surfaced in the admin CRM tab so
// it is obvious exactly what still has to be filled in.
export function getZohoStatus() {
  const missing = [];
  if (!zohoValue(ZOHO_ACCOUNTS_URL)) missing.push("ZOHO_ACCOUNTS_URL");
  if (!zohoValue(ZOHO_API_URL)) missing.push("ZOHO_API_URL");
  if (!zohoValue(ZOHO_CLIENT_ID)) missing.push("ZOHO_CLIENT_ID");
  if (!zohoValue(ZOHO_CLIENT_SECRET)) missing.push("ZOHO_CLIENT_SECRET");
  if (!zohoValue(ZOHO_REFRESH_TOKEN)) missing.push("ZOHO_REFRESH_TOKEN");
  return { configured: missing.length === 0, missing };
}

// The refresh-token grant mints a fresh access token per call — cache it so a
// bulk sync of hundreds of registrations only refreshes once per hour.
let cachedAccessToken = null;
let accessTokenExpiresAt = 0;

// Get Access Token using OAuth 2.0 Refresh Token Flow
async function getAccessToken() {
  if (!isZohoConfigured()) {
    throw new Error("Zoho integration is not fully configured in environment variables.");
  }

  if (cachedAccessToken && Date.now() < accessTokenExpiresAt) {
    return cachedAccessToken;
  }

  const accountsUrl = ZOHO_ACCOUNTS_URL.replace(/\/$/, ""); // Remove trailing slash if any
  const tokenUrl = `${accountsUrl}/oauth/v2/token`;

  const params = new URLSearchParams({
    refresh_token: ZOHO_REFRESH_TOKEN,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token"
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Zoho authentication failed: ${response.statusText} - ${errText}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`Zoho token generation failed: ${data.error}`);
  }

  cachedAccessToken = data.access_token;
  // Refresh one minute before the token actually expires.
  accessTokenExpiresAt = Date.now() + Math.max(60, (Number(data.expires_in) || 3600) - 60) * 1000;
  return cachedAccessToken;
}

// Map participant data to Zoho CRM Lead fields
function mapParticipantToLead(participant) {
  // Split full name into First Name and Last Name
  const nameParts = (participant.fullName || "").trim().split(/\s+/);
  let firstName = "";
  let lastName = "Participant"; // LastName is required in Zoho CRM Lead

  if (nameParts.length > 1) {
    firstName = nameParts[0];
    lastName = nameParts.slice(1).join(" ");
  } else if (nameParts.length === 1 && nameParts[0]) {
    lastName = nameParts[0];
  }

  const raceLabel = participant.raceId === "5k" ? "5K Fun Run" : participant.raceId === "10k" ? "10K Challenge" : "Half Marathon (21K)";
  const description = [
    `Run Beyond Limits 2026 Registration Details:`,
    `- Date of Birth: ${participant.dob || "N/A"}`,
    `- Gender: ${participant.gender || "N/A"}`,
    `- Emergency Contact: ${participant.emergencyContact || "N/A"}`,
    `- City Route: ${participant.cityId || "N/A"}`,
    `- Race Category: ${raceLabel}`,
    `- T-Shirt Size: ${participant.size || "N/A"}`,
    `- Payment Status: ${participant.paymentStatus || "Pending"}`,
    `- Payment Txn ID: ${participant.paymentTxnId || "N/A"}`,
    `- BIB Number: ${participant.bibNumber || "N/A"}`,
    `- Registered On: ${participant.registrationDate ? new Date(participant.registrationDate).toLocaleString() : "N/A"}`
  ].join("\n");

  const lead = {
    First_Name: firstName,
    Last_Name: lastName,
    Email: participant.email,
    Phone: participant.phone,
    Street: participant.address || "",
    City: participant.city || "",
    State: participant.state || "",
    Zip_Code: participant.pincode || "",
    Company: "Run Beyond Limits 2026", // Lead requires Company field in Zoho CRM
    Lead_Source: "Marathon Website",
    Description: description
  };

  // Reflect the payment lifecycle in the CRM pipeline stage.
  // Skippable via ZOHO_SKIP_LEAD_STATUS=true for orgs that use custom
  // picklist values which would otherwise reject the whole upsert.
  if (!process.env.ZOHO_SKIP_LEAD_STATUS) {
    lead.Lead_Status = participant.paymentStatus === "Paid" ? "Converted" : "New";
  }

  return lead;
}

/**
 * Creates or updates a Lead in Zoho CRM with full result detail.
 * If participant has zohoLeadId, we update. Otherwise, we create a new one.
 * Returns { ok, id?, error?, skipped? } and never throws.
 */
export async function syncParticipantToZohoDetailed(participant) {
  if (!isZohoConfigured()) {
    console.log(`[Zoho CRM Service] Sync skipped: Credentials not configured.`);
    return { ok: false, skipped: true, error: "not_configured" };
  }

  try {
    const accessToken = await getAccessToken();
    const leadData = mapParticipantToLead(participant);
    const apiUrl = ZOHO_API_URL.replace(/\/$/, "");

    if (participant.zohoLeadId) {
      // Update existing Lead
      const updateUrl = `${apiUrl}/Leads`;
      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Authorization": `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: [
            {
              id: participant.zohoLeadId,
              ...leadData
            }
          ]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to update Lead in Zoho CRM: ${response.statusText} - ${errText}`);
      }

      const result = await response.json();
      if (result.data && result.data[0] && result.data[0].status === "error") {
        throw new Error(`Zoho API update error: ${JSON.stringify(result.data[0].message)}`);
      }

      console.log(`[Zoho CRM Service] Successfully updated Lead ${participant.zohoLeadId} for ${participant.email}`);
      return { ok: true, id: participant.zohoLeadId, updated: true };
    }

    // Create new Lead
    const createUrl = `${apiUrl}/Leads`;
    const response = await fetch(createUrl, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: [leadData]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to create Lead in Zoho CRM: ${response.statusText} - ${errText}`);
    }

    const result = await response.json();
    if (result.data && result.data[0]) {
      if (result.data[0].status === "error") {
        throw new Error(`Zoho API create error: ${JSON.stringify(result.data[0].message)}`);
      }
      const createdId = result.data[0].details.id;
      console.log(`[Zoho CRM Service] Successfully created Lead ${createdId} for ${participant.email}`);
      return { ok: true, id: createdId, created: true };
    }

    throw new Error(`Zoho API response format is invalid: ${JSON.stringify(result)}`);
  } catch (error) {
    console.error(`[Zoho CRM Service Error] Sync failed:`, error.message);
    return { ok: false, error: error.message };
  }
}

/**
 * Backwards-compatible wrapper: returns the Lead ID or null.
 */
export async function syncParticipantToZoho(participant) {
  const result = await syncParticipantToZohoDetailed(participant);
  return result.ok && result.id ? result.id : null;
}

/**
 * Full round-trip connection test used by the admin CRM tab:
 * refreshes the token, creates a throwaway Lead, then removes it again.
 * Exercises exactly the create/update/delete path the site relies on.
 */
export async function testZohoConnection() {
  const status = getZohoStatus();
  if (!status.configured) {
    return { ok: false, error: "Zoho is not configured", missing: status.missing };
  }

  const marker = `rbl-api-test-${Date.now()}`;
  try {
    const accessToken = await getAccessToken();
    const apiUrl = ZOHO_API_URL.replace(/\/$/, "");

    const createRes = await fetch(`${apiUrl}/Leads`, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: [
          {
            First_Name: "Connection",
            Last_Name: "Test",
            Company: "Run Beyond Limits — API test",
            Email: `${marker}@example.com`,
            Lead_Source: "Marathon Website"
          }
        ]
      })
    });

    const createText = await createRes.text();
    if (!createRes.ok) throw new Error(`Create failed: ${createRes.status} - ${createText}`);
    const createJson = JSON.parse(createText || "{}");
    const entry = createJson?.data?.[0];
    if (!entry || entry.status === "error") {
      throw new Error(`Create failed: ${JSON.stringify(entry?.message || createJson)}`);
    }
    const leadId = entry.details?.id;

    // Remove the throwaway lead so the CRM stays clean.
    let removed = false;
    if (leadId) {
      try {
        const delRes = await fetch(`${apiUrl}/Leads?ids=${leadId}`, {
          method: "DELETE",
          headers: { "Authorization": `Zoho-oauthtoken ${accessToken}` }
        });
        removed = delRes.ok || delRes.status === 404;
      } catch {
        removed = false;
      }
    }

    console.log(`[Zoho CRM Service] Connection test passed (created & removed lead ${leadId})`);
    return { ok: true, leadId, removed };
  } catch (error) {
    console.error(`[Zoho CRM Service Error] Connection test failed:`, error.message);
    return { ok: false, error: error.message };
  }
}

/**
 * Deletes a Lead in Zoho CRM if participant is removed.
 */
export async function deleteParticipantFromZoho(zohoLeadId) {
  if (!isZohoConfigured() || !zohoLeadId) {
    return;
  }

  try {
    const accessToken = await getAccessToken();
    const apiUrl = ZOHO_API_URL.replace(/\/$/, "");
    const deleteUrl = `${apiUrl}/Leads?ids=${zohoLeadId}`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Authorization": `Zoho-oauthtoken ${accessToken}`
      }
    });

    if (!response.ok && response.status !== 404) {
      const errText = await response.text();
      throw new Error(`Failed to delete Lead in Zoho CRM: ${response.statusText} - ${errText}`);
    }

    console.log(`[Zoho CRM Service] Successfully deleted Lead ${zohoLeadId} from Zoho CRM`);
  } catch (error) {
    console.error(`[Zoho CRM Service Error] Delete failed:`, error.message);
  }
}

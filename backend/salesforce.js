import dotenv from "dotenv";

dotenv.config();

const {
  SF_LOGIN_URL,
  SF_USERNAME,
  SF_PASSWORD,
  SF_SECURITY_TOKEN,
  SF_CLIENT_ID,
  SF_CLIENT_SECRET
} = process.env;

// Helper to check if Salesforce is fully configured
export function isSalesforceConfigured() {
  return !!(
    SF_LOGIN_URL &&
    SF_USERNAME &&
    SF_PASSWORD &&
    SF_SECURITY_TOKEN &&
    SF_CLIENT_ID &&
    SF_CLIENT_SECRET
  );
}

// Get Access Token using OAuth 2.0 Username-Password Flow
async function getAccessToken() {
  if (!isSalesforceConfigured()) {
    throw new Error("Salesforce integration is not fully configured in environment variables.");
  }

  const loginUrl = SF_LOGIN_URL.replace(/\/$/, ""); // Remove trailing slash if any
  const tokenUrl = `${loginUrl}/services/oauth2/token`;

  const params = new URLSearchParams({
    grant_type: "password",
    client_id: SF_CLIENT_ID,
    client_secret: SF_CLIENT_SECRET,
    username: SF_USERNAME,
    password: `${SF_PASSWORD}${SF_SECURITY_TOKEN}`
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
    throw new Error(`Salesforce authentication failed: ${response.statusText} - ${errText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    instanceUrl: data.instance_url
  };
}

// Map participant data to Salesforce Lead fields
function mapParticipantToLead(participant) {
  // Split full name into First Name and Last Name
  const nameParts = (participant.fullName || "").trim().split(/\s+/);
  let firstName = "";
  let lastName = "Participant"; // LastName is required in Salesforce Lead

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

  return {
    FirstName: firstName,
    LastName: lastName,
    Email: participant.email,
    Phone: participant.phone,
    Street: participant.address || "",
    City: participant.city || "",
    State: participant.state || "",
    PostalCode: participant.pincode || "",
    Company: "Run Beyond Limits 2026", // Lead requires Company field
    LeadSource: "Marathon Website",
    Description: description,
    Status: participant.paymentStatus === "Paid" ? "Working - Contacted" : "Open - Not Contacted"
  };
}

/**
 * Creates or updates a Lead in Salesforce.
 * If participant has salesforceLeadId, we update. Otherwise, we create a new one.
 * Returns the Lead ID if successful.
 */
export async function syncParticipantToSalesforce(participant) {
  if (!isSalesforceConfigured()) {
    console.log(`[Salesforce Service] Sync skipped: Credentials not configured.`);
    return null;
  }

  try {
    const { accessToken, instanceUrl } = await getAccessToken();
    const leadData = mapParticipantToLead(participant);
    const apiVersion = "v57.0";

    if (participant.salesforceLeadId) {
      // Update existing Lead
      const updateUrl = `${instanceUrl}/services/data/${apiVersion}/sobjects/Lead/${participant.salesforceLeadId}`;
      const response = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(leadData)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to update Lead in Salesforce: ${response.statusText} - ${errText}`);
      }

      console.log(`[Salesforce Service] Successfully updated Lead ${participant.salesforceLeadId} for ${participant.email}`);
      return participant.salesforceLeadId;
    } else {
      // Create new Lead
      const createUrl = `${instanceUrl}/services/data/${apiVersion}/sobjects/Lead`;
      const response = await fetch(createUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(leadData)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to create Lead in Salesforce: ${response.statusText} - ${errText}`);
      }

      const result = await response.json();
      console.log(`[Salesforce Service] Successfully created Lead ${result.id} for ${participant.email}`);
      return result.id;
    }
  } catch (error) {
    console.error(`[Salesforce Service Error] Sync failed:`, error.message);
    return null;
  }
}

/**
 * Deletes a Lead in Salesforce if participant is removed.
 */
export async function deleteParticipantFromSalesforce(leadId) {
  if (!isSalesforceConfigured() || !leadId) {
    return;
  }

  try {
    const { accessToken, instanceUrl } = await getAccessToken();
    const apiVersion = "v57.0";
    const deleteUrl = `${instanceUrl}/services/data/${apiVersion}/sobjects/Lead/${leadId}`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!response.ok && response.status !== 404) {
      const errText = await response.text();
      throw new Error(`Failed to delete Lead in Salesforce: ${response.statusText} - ${errText}`);
    }

    console.log(`[Salesforce Service] Successfully deleted Lead ${leadId} from Salesforce`);
  } catch (error) {
    console.error(`[Salesforce Service Error] Delete failed:`, error.message);
  }
}

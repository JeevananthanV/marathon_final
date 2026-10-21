#!/usr/bin/env node
/**
 * One-time helper to finish the Zoho CRM setup.
 *
 * Steps
 * -----
 *  1. Go to https://api-console.zoho.in (or https://api-console.zoho.com for
 *     the global DC) and create a **Self-Client** application.
 *  2. Copy the Client ID / Client Secret into backend/.env:
 *        ZOHO_CLIENT_ID=...
 *        ZOHO_CLIENT_SECRET=...
 *  3. In the app's **Generate Code** panel add these scopes and generate a code:
 *        ZohoCRM.modules.CREATE, ZohoCRM.modules.READ,
 *        ZohoCRM.modules.UPDATE, ZohoCRM.modules.DELETE
 *     (the code is valid for ~5 minutes)
 *  4. Exchange it for a refresh token — this writes it into backend/.env:
 *        npm run zoho-auth -- <CODE>
 *  5. Validate everything that is in .env:
 *        npm run zoho-auth -- --check
 *  6. Restart the server (npm start) and use **Admin → Zoho CRM**.
 *
 * The refresh token never expires (until revoked), so this is a one-time step.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.join(__dirname, ".env");
dotenv.config({ path: ENV_PATH });

const ACCOUNTS_URL = (process.env.ZOHO_ACCOUNTS_URL || "https://accounts.zoho.in").replace(/\/$/, "");
const CLIENT_ID = (process.env.ZOHO_CLIENT_ID || "").trim();
const CLIENT_SECRET = (process.env.ZOHO_CLIENT_SECRET || "").trim();

function isPlaceholder(v) {
  return !v || /^your[_-]/i.test(v);
}

function readEnvFile() {
  return fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf8") : "";
}

/** Insert or replace a KEY=value line in backend/.env (preserves everything else). */
function setEnvValue(key, value) {
  const content = readEnvFile();
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  const next = pattern.test(content) ? content.replace(pattern, line) : `${content.replace(/\s*$/, "")}\n${line}\n`;
  fs.writeFileSync(ENV_PATH, next, "utf8");
}

async function tokenRequest(params) {
  const res = await fetch(`${ACCOUNTS_URL}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString()
  });
  const text = await res.text();
  let json = {};
  try {
    json = JSON.parse(text || "{}");
  } catch {
    /* keep raw */
  }
  if (!res.ok || json.error) {
    const hint =
      json.error === "invalid_code"
        ? "\n  The code expired or was already used — generate a fresh one (codes last ~5 minutes)."
        : json.error === "invalid_client" || json.error === "unauthorized_client"
          ? "\n  Client ID / Client Secret do not match — check backend/.env."
          : json.error === "invalid_scope"
            ? "\n  The code was generated without the required ZohoCRM.modules.* scopes."
            : "";
    throw new Error(`Zoho rejected the request (${res.status}): ${json.error || text}${hint}`);
  }
  return json;
}

function requireCredentials() {
  if (isPlaceholder(CLIENT_ID) || isPlaceholder(CLIENT_SECRET)) {
    console.error("✖ ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET are not set yet.");
    console.error("  Create a Self-Client app at https://api-console.zoho.in and put both values into backend/.env.");
    process.exit(1);
  }
}

/** Align ZOHO_API_URL with the data centre (.in/.com) that issued the token. */
function syncApiDomain(data) {
  const domain = typeof data?.api_domain === "string" ? data.api_domain.replace(/\/$/, "") : "";
  if (!domain) return false;
  const apiUrl = `${domain}/crm/v3`;
  if ((process.env.ZOHO_API_URL || "").trim() === apiUrl) return false;
  setEnvValue("ZOHO_API_URL", apiUrl);
  process.env.ZOHO_API_URL = apiUrl;
  console.log(`  Data centre detected: ${domain} → ZOHO_API_URL updated to ${apiUrl}`);
  return true;
}

async function main() {
  const arg = process.argv[2];

  if (!arg || arg === "--help" || arg === "-h") {
    console.log("\nZoho CRM one-time setup\n");
    console.log("  npm run zoho-auth -- <CODE>    exchange an authorization code (writes ZOHO_REFRESH_TOKEN into .env)");
    console.log("  npm run zoho-auth -- --check   validate the credentials already stored in .env\n");
    console.log("  Get the CODE from API Console → your Self-Client app → Generate Code, with scopes:");
    console.log("    ZohoCRM.modules.CREATE, ZohoCRM.modules.READ, ZohoCRM.modules.UPDATE, ZohoCRM.modules.DELETE\n");
    return;
  }

  if (arg === "--check") {
    requireCredentials();
    if (isPlaceholder(process.env.ZOHO_REFRESH_TOKEN)) {
      console.error("✖ ZOHO_REFRESH_TOKEN is not set yet — run: npm run zoho-auth -- <CODE>");
      process.exit(1);
    }
    const data = await tokenRequest({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN.trim(),
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "refresh_token"
    });
    syncApiDomain(data);
    console.log("✔ Zoho credentials are valid — access token acquired.");
    console.log(`  Expires in: ${Math.round((Number(data.expires_in) || 3600) / 60)} minutes (auto-refreshes)`);
    if (data.scope) console.log(`  Scopes: ${data.scope}`);
    console.log("\n  Restart the server, then open Admin → Zoho CRM to sync registrations.");
    return;
  }

  // Otherwise treat the argument as the authorization CODE.
  requireCredentials();
  const code = arg.trim();
  const data = await tokenRequest({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code
  });

  if (!data.refresh_token) {
    throw new Error(`Zoho did not return a refresh_token (response: ${JSON.stringify(data)})`);
  }

  setEnvValue("ZOHO_REFRESH_TOKEN", data.refresh_token);
  syncApiDomain(data);
  console.log("✔ Refresh token obtained and written to backend/.env (ZOHO_REFRESH_TOKEN).");
  if (data.scope) console.log(`  Scopes: ${data.scope}`);
  console.log("\n  Next steps:");
  console.log("   1. Restart the server:  npm start");
  console.log("   2. Open Admin → Zoho CRM → Test connection");
  console.log("   3. Click \"Sync all registrations\" to push existing data into Zoho.\n");
}

main().catch((err) => {
  console.error(`✖ ${err.message}`);
  process.exit(1);
});

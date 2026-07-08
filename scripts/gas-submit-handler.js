/**
 * ctsDAO / HokkaiDAO — Interest Form Handler
 * Deploy this script as a Google Apps Script Web App.
 *
 * SETUP INSTRUCTIONS
 * ------------------
 * 1. Go to https://script.google.com → New Project
 * 2. Paste this entire file, replacing the default content.
 * 3. Project Settings → Script Properties → Add:
 *      SECRET_TOKEN   →  (random string ≥ 32 chars; generate with `openssl rand -hex 32`)
 *      SPREADSHEET_ID →  (the ID portion of your Google Sheet URL)
 * 4. Deploy → New Deployment → Web App
 *      Execute as:    Me (your account)
 *      Who can access: Anyone
 * 5. Copy the Web App URL and set these env vars in your Next.js project:
 *      NEXT_PUBLIC_GAS_URL=<Web App URL>
 *      NEXT_PUBLIC_GAS_TOKEN=<same value as SECRET_TOKEN>
 * 6. On Cloudflare Pages, add both vars in Settings → Environment variables.
 *
 * UPDATING THE SCRIPT
 * -------------------
 * After any change, click Deploy → Manage deployments → select the deployment
 * → Edit → New version → Deploy. The URL stays the same.
 *
 * COLUMNS
 * -------
 * The script auto-creates the header row on first submission. Column order
 * matches FIELDS below. Do not reorder FIELDS without re-creating the sheet.
 */

// ---------------------------------------------------------------------------
// Field definitions — must match the payload keys sent from lib/gas-form.ts
// ---------------------------------------------------------------------------
const FIELDS = [
  { key: "name",                          label: "Name" },
  { key: "email",                         label: "Email" },
  { key: "x_handle",                      label: "X Handle" },
  { key: "telegram",                      label: "Telegram" },
  { key: "role",                          label: "Role" },
  { key: "interest_type",                 label: "Interest Type" },
  { key: "organization_or_project",       label: "Organization / Project" },
  { key: "github_or_website",             label: "GitHub / Website" },
  { key: "wallet_address",                label: "Wallet Address" },
  { key: "location",                      label: "Location" },
  { key: "reason",                        label: "Why do you belong?" },
  { key: "full_commitment",               label: "Full Commitment" },
  { key: "working_style",                 label: "Working Style" },
  { key: "work_plan",                     label: "Work Plan" },
  { key: "accommodation_or_grant_needs",  label: "Accommodation / Grant Needs" },
  { key: "dietary_or_special_requirements", label: "Dietary / Special Requirements" },
  { key: "prior_events",                  label: "Prior Events" },
  { key: "wants_to_help_organize",        label: "Wants to Help Organize?" },
  { key: "referral_source",               label: "Referral Source" },
  { key: "notes",                         label: "Notes" },
  { key: "attribution",                   label: "Attribution" },
];

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const SECRET_TOKEN = props.getProperty("SECRET_TOKEN");
    const SPREADSHEET_ID = props.getProperty("SPREADSHEET_ID");

    if (!SECRET_TOKEN || !SPREADSHEET_ID) {
      return respond("Server misconfigured: missing script properties.");
    }

    const params = e.parameter || {};

    // Token check — silently succeed to not reveal whether the token is wrong.
    if (params.token !== SECRET_TOKEN) {
      Logger.log("Rejected: invalid token from " + (e.parameter.email || "unknown"));
      return respond("OK"); // return 200 so bots don't know they were rejected
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet(ss, "Responses");

    // Write header row if the sheet is brand new.
    if (sheet.getLastRow() === 0) {
      const headers = ["Timestamp"].concat(FIELDS.map((f) => f.label));
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
    }

    // Build the data row.
    const timestamp = new Date().toISOString();
    const row = [timestamp].concat(FIELDS.map((f) => params[f.key] || ""));
    sheet.appendRow(row);

    Logger.log("Submitted by: " + params.email);
    return respond("OK");
  } catch (err) {
    Logger.log("Error: " + err.message);
    return respond("OK"); // always 200 to prevent retry storms
  }
}

// Handle CORS preflight (OPTIONS) — required for browsers that send it.
function doOptions() {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function respond(message) {
  return ContentService.createTextOutput(message)
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

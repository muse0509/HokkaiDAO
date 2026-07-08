/**
 * Google Apps Script (GAS) integration for the interest form.
 *
 * Instead of posting directly to Google Forms (which can't capture all fields),
 * we post to a GAS Web App that writes every field to Google Sheets.
 *
 * Setup:
 *   1. Open the GAS editor (extensions.google.com) and paste the script from
 *      scripts/gas-submit-handler.js into a new project.
 *   2. In GAS → Project Settings → Script Properties, add:
 *        SECRET_TOKEN  →  (any random string, min 32 chars)
 *        SPREADSHEET_ID  →  (ID from your Google Sheet URL)
 *   3. Deploy: Deploy → New deployment → Web App.
 *      Execute as: Me. Who has access: Anyone.
 *   4. Copy the deployment URL and set in your environment:
 *        NEXT_PUBLIC_GAS_URL=https://script.google.com/macros/s/.../exec
 *        NEXT_PUBLIC_GAS_TOKEN=(same value as SECRET_TOKEN above)
 */

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL ?? "";
const GAS_TOKEN = process.env.NEXT_PUBLIC_GAS_TOKEN ?? "";

export const GAS_CONFIGURED = !!(GAS_URL && GAS_TOKEN);

export interface GASPayload {
  name: string;
  email: string;
  role: string[];
  interest_type: string[];
  reason: string;
  full_commitment: string;
  working_style: string;
  work_plan: string;
  accommodation_or_grant_needs?: string;
  dietary_or_special_requirements?: string;
  x_handle?: string;
  telegram?: string;
  organization_or_project?: string;
  github_or_website?: string;
  wallet_address?: string;
  location?: string;
  prior_events?: string;
  wants_to_help_organize?: boolean;
  referral_source?: string;
  notes?: string;
  attribution?: Record<string, string> | null;
}

function buildBody(payload: GASPayload): string {
  const body = new URLSearchParams();
  body.set("token", GAS_TOKEN);

  for (const [key, value] of Object.entries(payload)) {
    if (value == null || value === "") continue;
    if (Array.isArray(value)) {
      const joined = value.filter(Boolean).join(", ");
      if (joined) body.set(key, joined);
    } else if (typeof value === "boolean") {
      body.set(key, value ? "Yes" : "No");
    } else if (typeof value === "object") {
      body.set(key, JSON.stringify(value));
    } else {
      body.set(key, String(value));
    }
  }

  return body.toString();
}

/**
 * Submit a payload to the configured GAS Web App.
 * Uses no-cors (same as Google Forms) — a completed fetch is treated as success.
 * Rejects only on network failure.
 */
export async function submitToGAS(payload: GASPayload): Promise<void> {
  await fetch(GAS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: buildBody(payload),
  });
}

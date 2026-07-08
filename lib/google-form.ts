/**
 * Google Form integration for the interest list.
 *
 * The site is fully static (no server), so the form posts straight to a
 * Google Form from the browser. To wire it up:
 *
 *   1. Create a Google Form with one question per field below. Use the types
 *      noted in the comments (short answer, paragraph, dropdown, checkboxes).
 *   2. Form → ⋮ (top-right) → "Get pre-filled link". Fill every field with a
 *      dummy value, click "Get link", and copy it. Each field in that URL
 *      carries its id as `entry.1234567890=...`.
 *   3. Paste the ids into ENTRY_IDS below, and set ACTION to the form's POST
 *      URL: take the form's normal URL and replace `/viewform` with
 *      `/formResponse`, e.g.
 *        https://docs.google.com/forms/d/e/FORM_ID/formResponse
 *
 * Google Forms doesn't return CORS headers, so we submit with
 * `mode: "no-cors"`. That means we can't read the response, a completed
 * request is treated as success. Validation runs client-side first.
 */

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdGYrlsohyd7cr1kSLMXeneDFY_FcYJyA-8BEjSXhTmgjge5w/formResponse";

/**
 * Maps each app field to its Google Form `entry.NNN` id.
 *
 * Multi-select fields (role, interest_type) are sent as one comma-separated
 * string, so their Google Form questions should be **short-answer / paragraph**
 * (not single-choice), otherwise unmatched values are rejected.
 *
 * Fields marked `entry.REPLACE_*` are new questions that don't exist in the
 * Google Form yet. They are silently skipped on submit until you add the
 * question and paste its real id here — the rest of the form keeps working.
 */
export const GOOGLE_FORM_ENTRY_IDS = {
  name: "entry.2123645487",
  email: "entry.1088612587",
  x_handle: "entry.1096493252",
  role: "entry.1284312230",
  interest_type: "entry.1090788412",
  organization_or_project: "entry.1425261769",
  github_or_website: "entry.1080664792",
  wallet_address: "entry.REPLACE_WALLET",
  location: "entry.1333922230",
  telegram: "entry.478724343",
  prior_events: "entry.REPLACE_PRIOR_EVENTS",
  wants_to_help_organize: "entry.REPLACE_HELP_ORGANIZE",
  reason: "entry.1321128930",
  full_commitment: "entry.REPLACE_FULL_COMMITMENT",
  working_style: "entry.REPLACE_WORKING_STYLE",
  work_plan: "entry.REPLACE_WORK_PLAN",
  accommodation_or_grant_needs: "entry.REPLACE_ACCOMMODATION_OR_GRANT",
  dietary_or_special_requirements: "entry.REPLACE_DIETARY_OR_SPECIAL",
  referral_source: "entry.1665304784",
  notes: "entry.334088344",
  attribution: "entry.754212873",
};

/** Core fields that must have real ids for the form to count as wired up.
 *  Newer optional questions may stay as `entry.REPLACE_*` placeholders. */
const REQUIRED_ENTRY_FIELDS = [
  "name",
  "email",
  "role",
  "interest_type",
  "reason",
] as const;

export const GOOGLE_FORM_CONFIGURED =
  !GOOGLE_FORM_ACTION.includes("REPLACE") &&
  REQUIRED_ENTRY_FIELDS.every(
    (field) => !GOOGLE_FORM_ENTRY_IDS[field].includes("REPLACE"),
  );

export interface GoogleFormPayload {
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

function appendField(body: URLSearchParams, entryId: string, value: unknown) {
  if (value == null || value === "" || entryId.includes("REPLACE")) return;
  if (Array.isArray(value)) {
    // The Google Form's interest field is a single short-answer question, so
    // send every selected value as one comma-separated string (a short-answer
    // field would otherwise only retain one of several repeated params).
    const joined = value
      .filter((item) => item != null && item !== "")
      .join(", ");
    if (joined) body.append(entryId, joined);
  } else if (typeof value === "boolean") {
    if (value) body.append(entryId, "Yes");
  } else if (typeof value === "object") {
    body.append(entryId, JSON.stringify(value));
  } else {
    body.append(entryId, String(value));
  }
}

/**
 * Submit a payload to the configured Google Form. Resolves when the request
 * completes; rejects only on a network failure (Google's opaque response is
 * treated as success because no-cors hides the status code).
 */
export async function submitToGoogleForm(payload: GoogleFormPayload): Promise<void> {
  const body = new URLSearchParams();
  for (const [field, entryId] of Object.entries(GOOGLE_FORM_ENTRY_IDS)) {
    appendField(body, entryId, payload[field as keyof GoogleFormPayload]);
  }

  await fetch(GOOGLE_FORM_ACTION, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

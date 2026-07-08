import { z } from "zod";

export const INTEREST_TYPES = [
  "participant",
  "sponsor",
  "speaker",
  "volunteer",
  "designer",
  "partner",
  "media",
  "investor",
  "other",
] as const;

export const ROLES = [
  "founder",
  "builder",
  "designer",
  "researcher",
  "investor",
  "sponsor",
  "ecosystem",
  "media",
  "student",
  "other",
] as const;

/** Strip control characters (keeps newlines/tabs in multi-line fields). */
function sanitize(value: string): string {
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
}

const sanitized = (max: number) =>
  z.string().transform(sanitize).pipe(z.string().max(max));

const optionalSanitized = (max: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v ? sanitize(v) : undefined))
    .pipe(z.string().max(max).optional())
    .transform((v) => (v && v.length > 0 ? v : undefined));

/** Accepts "@handle" or "handle"; stores the bare handle. Optional. */
const optionalXHandle = z
  .string()
  .optional()
  .transform((v) => (v ? sanitize(v).replace(/^@/, "") : undefined))
  .pipe(
    z
      .string()
      .max(50)
      .regex(/^[A-Za-z0-9_.]+$/, "That doesn't look like a valid X handle")
      .optional(),
  )
  .transform((v) => (v && v.length > 0 ? v : undefined));

export const interestFormSchema = z.object({
  // Required — kept deliberately minimal.
  name: sanitized(120).pipe(z.string().min(1, "Name is required")),
  email: sanitized(254).pipe(z.string().email("Please enter a valid email")),
  role: z.array(z.enum(ROLES)).min(1, "Select at least one role"),
  interest_type: z
    .array(z.enum(INTEREST_TYPES))
    .min(1, "Select at least one option"),
  reason: sanitized(2000).pipe(
    z.string().min(20, "Tell us a little more, at least 20 characters"),
  ),
  full_commitment: z.enum(["yes", "mostly", "no", "not_applicable"], {
    message: "Please select one.",
  }),
  working_style: z.enum(
    ["solo", "team", "open_to_team", "not_sure", "not_applicable"],
    { message: "Please select one." },
  ),
  work_plan: sanitized(1200).pipe(
    z.string().min(20, "Please share what you plan to work on."),
  ),
  accommodation_or_grant_needs: optionalSanitized(800),
  dietary_or_special_requirements: optionalSanitized(800),
  // Recommended but optional.
  x_handle: optionalXHandle,
  telegram: optionalSanitized(120),
  // Optional details.
  organization_or_project: optionalSanitized(200),
  github_or_website: optionalSanitized(300),
  wallet_address: optionalSanitized(120),
  location: optionalSanitized(120),
  prior_events: optionalSanitized(2000),
  referral_source: optionalSanitized(300),
  wants_to_help_organize: z.boolean().optional(),
  notes: optionalSanitized(2000),
  // Honeypot, humans never see or fill this field. Validation accepts any
  // value; the route silently discards submissions where it's non-empty.
  company_website: z.string().max(500).optional(),
  consent_analytics: z.boolean().optional(),
});

export type InterestFormValues = z.infer<typeof interestFormSchema>;

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
  "engineer",
  "designer",
  "devrel",
  "researcher",
  "investor",
  "writer",
  "student",
  "ecosystem contributor",
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

/** Accepts "@handle" or "handle"; stores the bare handle. */
const xHandle = z
  .string()
  .transform((v) => sanitize(v).replace(/^@/, ""))
  .pipe(
    z
      .string()
      .min(1, "X handle is required")
      .max(50)
      .regex(/^[A-Za-z0-9_.]+$/, "That doesn't look like a valid X handle"),
  );

export const interestFormSchema = z.object({
  name: sanitized(120).pipe(z.string().min(1, "Name is required")),
  email: sanitized(254).pipe(z.string().email("Please enter a valid email")),
  x_handle: xHandle,
  role: z.enum(ROLES, { message: "Please select a role" }),
  interest_type: z
    .array(z.enum(INTEREST_TYPES))
    .min(1, "Select at least one option"),
  reason: sanitized(2000).pipe(
    z.string().min(20, "Tell us a little more, at least 20 characters"),
  ),
  organization_or_project: optionalSanitized(200),
  location: optionalSanitized(120),
  website: optionalSanitized(300),
  github: optionalSanitized(120),
  telegram: optionalSanitized(120),
  has_attended_mtndao_or_similar: z.boolean().optional(),
  referral_source: optionalSanitized(300),
  notes: optionalSanitized(2000),
  // Honeypot, humans never see or fill this field. Validation accepts any
  // value; the route silently discards submissions where it's non-empty.
  company_website: z.string().max(500).optional(),
  consent_analytics: z.boolean().optional(),
});

export type InterestFormValues = z.infer<typeof interestFormSchema>;

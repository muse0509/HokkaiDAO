"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getConsent, readAttributionCookie, track } from "@/lib/analytics";
import { INTEREST_TYPES, ROLES, interestFormSchema } from "@/lib/validation";
import { GAS_CONFIGURED, submitToGAS } from "@/lib/gas-form";
import { SectionViewTracker } from "@/components/SectionViewTracker";

type FieldErrors = Record<string, string>;

const INTEREST_LABELS: Record<(typeof INTEREST_TYPES)[number], string> = {
participant: "Participant",
sponsor: "Sponsor",
speaker: "Speaker",
volunteer: "Volunteer",
designer: "Designer",
partner: "Partner",
media: "Media",
investor: "Investor",
other: "Other",
};

const ROLE_LABELS: Record<(typeof ROLES)[number], string> = {
founder: "Founder",
builder: "Builder / Engineer",
designer: "Designer",
researcher: "Researcher",
investor: "Investor",
sponsor: "Sponsor",
ecosystem: "Ecosystem / Community",
media: "Media / Writer",
student: "Student",
other: "Other",
};

function Field({
label,
name,
error,
required = false,
recommended = false,
children,
hint,
}: {
label: string;
name: string;
error?: string;
required?: boolean;
recommended?: boolean;
children: React.ReactNode;
hint?: string;
}) {
return ( <div> <label htmlFor={name} className="mb-1.5 block text-sm text-sumi">
{label}
{required ? ( <span className="ml-1 text-akane" aria-hidden="true">
* </span>
) : recommended ? ( <span className="ml-2 font-normal text-ink-400">recommended</span>
) : ( <span className="ml-2 font-normal text-ink-400">optional</span>
)} </label>
{children}
{hint && !error && <p className="mt-1.5 text-xs text-ink-400">{hint}</p>}
{error && (
<p id={`${name}-error`} role="alert" className="mt-1.5 text-xs text-akane">
{error} </p>
)} </div>
);
}

/** A multi-select chip group (used for both Role and Interest). */
function ChipGroup({
options,
selected,
onToggle,
ariaLabel,
}: {
options: { value: string; label: string }[];
selected: string[];
onToggle: (value: string) => void;
ariaLabel: string;
}) {
return ( <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2.5">
{options.map(({ value, label }) => {
const active = selected.includes(value);
return (
<button
key={value}
type="button"
onClick={() => onToggle(value)}
aria-pressed={active}
className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
              active
                ? "border-akane bg-akane/[0.07] text-akane"
                : "border border-line bg-washi text-ink-500 hover:border-sumi/25 hover:text-sumi"
            }`}
>
{label} </button>
);
})} </div>
);
}

/** A thin-ruled form section with a small mono label. */
function FormSection({
label,
children,
}: {
label: string;
children: React.ReactNode;
}) {
return ( <section className="border-t border-line pt-8"> <p className="mono-label mb-5">{label}</p> <div className="space-y-6">{children}</div> </section>
);
}

export function ApplyForm({
formEnabled,
fallbackUrl,
}: {
formEnabled: boolean;
fallbackUrl: string;
}) {
const reduced = useReducedMotion();
const [roles, setRoles] = useState<string[]>([]);
const [interestTypes, setInterestTypes] = useState<string[]>([]);
const [errors, setErrors] = useState<FieldErrors>({});
const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
const [globalError, setGlobalError] = useState("");
const startedRef = useRef(false);

const markStarted = () => {
if (!startedRef.current) {
startedRef.current = true;
track("interest_form_started");
}
};

const toggleRole = (value: string) => {
markStarted();
setRoles((prev) =>
prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
);
setErrors((prev) => ({ ...prev, role: "" }));
};

const toggleInterest = (value: string) => {
markStarted();
setInterestTypes((prev) =>
prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
);
setErrors((prev) => ({ ...prev, interest_type: "" }));
};

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();
if (status === "submitting") return;
setStatus("submitting");
setGlobalError("");
setErrors({});

const fd = new FormData(e.currentTarget);
const text = (key: string) => (fd.get(key) as string | null)?.toString() ?? "";

const raw = {
  name: text("name"),
  email: text("email"),
  role: roles,
  interest_type: interestTypes,
  reason: text("reason"),
  full_commitment: text("full_commitment"),
  working_style: text("working_style"),
  work_plan: text("work_plan"),
  accommodation_or_grant_needs: text("accommodation_or_grant_needs") || undefined,
  dietary_or_special_requirements:
    text("dietary_or_special_requirements") || undefined,
  x_handle: text("x_handle") || undefined,
  telegram: text("telegram") || undefined,
  organization_or_project: text("organization_or_project") || undefined,
  github_or_website: text("github_or_website") || undefined,
  wallet_address: text("wallet_address") || undefined,
  location: text("location") || undefined,
  prior_events: text("prior_events") || undefined,
  referral_source: text("referral_source") || undefined,
  wants_to_help_organize: fd.get("wants_to_help_organize") === "on",
  notes: text("notes") || undefined,
  company_website: text("company_website"),
  consent_analytics: getConsent() === "granted",
};

// Validate in the browser, there's no server to fall back on.
const parsed = interestFormSchema.safeParse(raw);
if (!parsed.success) {
  const fieldErrors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (!fieldErrors[field]) fieldErrors[field] = issue.message;
  }
  setStatus("error");
  setErrors(fieldErrors);
  setGlobalError("Please fix the highlighted fields.");
  track("interest_form_failed", { status: "validation" });
  return;
}

// Honeypot filled -> pretend success so bots don't adapt; submit nothing.
if (parsed.data.company_website) {
  setStatus("success");
  return;
}

if (!GAS_CONFIGURED) {
  setStatus("error");
  setGlobalError(
    "The form isn't connected yet. Please reach out via the contact links below.",
  );
  track("interest_form_failed", { status: "unconfigured" });
  return;
}

const { company_website: _honeypot, consent_analytics: _consent, ...fields } =
  parsed.data;
void _honeypot;
void _consent;

try {
  await submitToGAS({
    ...fields,
    attribution: readAttributionCookie(),
  });
  setStatus("success");
  track("interest_form_submitted", { role: roles, interest_type: interestTypes });
} catch {
  setStatus("error");
  setGlobalError("Network error, please check your connection and try again.");
  track("interest_form_failed", { status: "network" });
}

}

const inputProps = (name: string) => ({
id: name,
name,
className: "field-input",
"aria-invalid": errors[name] ? true : undefined,
"aria-describedby": errors[name] ? `${name}-error` : undefined,
});

return ( <div className="relative"> <SectionViewTracker event="form_view" />

  {!formEnabled ? (
    <div className="rounded border border-line bg-washi p-8 text-center">
      <p className="text-ink-500">
        The embedded form is temporarily closed.
        {fallbackUrl ? (
          <>
            {" "}
            Please use{" "}
            <a href={fallbackUrl} className="text-akane underline underline-offset-4">
              this form
            </a>{" "}
            instead.
          </>
        ) : (
          <> Please reach out via the X account above.</>
        )}
      </p>
    </div>
  ) : (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded border border-line bg-washi p-10 text-center"
        >
          <p className="mono-label text-akane">Received</p>
          <h2 className="mt-4 text-2xl font-light text-sumi">
            Your request is in.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-500">
            Thank you for raising your hand. We&apos;ll be in touch as
            applications and details open up. A request does not guarantee a
            seat — every place is considered by hand.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          onFocus={markStarted}
          noValidate
          initial={false}
          exit={{ opacity: 0 }}
          className="space-y-10"
        >
          {/* Honeypot, hidden from humans, baited for bots. */}
          <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="company_website">Company website</label>
            <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <FormSection label="About you">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Name" name="name" required error={errors.name}>
                <input {...inputProps("name")} type="text" autoComplete="name" placeholder="Satoshi Builder" />
              </Field>
              <Field label="Email" name="email" required error={errors.email}>
                <input {...inputProps("email")} type="email" autoComplete="email" placeholder="you@example.com" />
              </Field>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="X handle" name="x_handle" recommended error={errors.x_handle} hint="@handle or plain handle">
                <input {...inputProps("x_handle")} type="text" placeholder="@yourhandle" />
              </Field>
              <Field label="Telegram" name="telegram" recommended error={errors.telegram} hint="So we can reach you quickly.">
                <input {...inputProps("telegram")} type="text" placeholder="@yourhandle" />
              </Field>
            </div>
          </FormSection>

          <FormSection label="Your role">
            <Field label="What best describes you?" name="role" required error={errors.role} hint="Select all that apply.">
              <ChipGroup
                ariaLabel="Your role (select all that apply)"
                selected={roles}
                onToggle={toggleRole}
                options={ROLES.map((value) => ({ value, label: ROLE_LABELS[value] }))}
              />
            </Field>
            <Field label="I'm interested as" name="interest_type" required error={errors.interest_type} hint="Select all that apply.">
              <ChipGroup
                ariaLabel="Interest type (select all that apply)"
                selected={interestTypes}
                onToggle={toggleInterest}
                options={INTEREST_TYPES.map((value) => ({ value, label: INTEREST_LABELS[value] }))}
              />
            </Field>
          </FormSection>

          <FormSection label="What you'd work on">
            <Field
              label="Why do you belong in the room?"
              name="reason"
              required
              error={errors.reason}
              hint="Tell us what you can bring to the room, what you're building, and why you should be there."
            >
              <textarea
                {...inputProps("reason")}
                rows={4}
                placeholder="I'm building…, and I can contribute by…"
              />
            </Field>
            <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Can you commit to the full two weeks?"
              name="full_commitment"
              required
              error={errors.full_commitment}
              hint="We prioritize people who can be present for the full residency."
            >
              <select {...inputProps("full_commitment")} defaultValue="">
                <option value="" disabled>
                  Select one
                </option>
                <option value="yes">Yes, I can commit to the full two weeks</option>
                <option value="mostly">Mostly, but I may miss a small part</option>
                <option value="no">No, I can only attend partially</option>
                <option value="not_applicable">Not applicable</option>
              </select>
            </Field>

            <Field
              label="Will you work solo or with a team?"
              name="working_style"
              required
              error={errors.working_style}
            >
              <select {...inputProps("working_style")} defaultValue="">
                <option value="" disabled>
                  Select one
                </option>
                <option value="solo">Solo</option>
                <option value="team">With an existing team</option>
                <option value="open_to_team">Open to forming a team there</option>
                <option value="not_sure">Not sure yet</option>
                <option value="not_applicable">Not applicable</option>
              </select>
            </Field>
          </div>

          <Field
            label="What do you plan to ship during ctsDAO?"
            name="work_plan"
            required
            error={errors.work_plan}
            hint="Existing project, new project, feature, demo, research, or contribution you want to complete."
          >
            <textarea
              {...inputProps("work_plan")}
              rows={4}
              placeholder="I plan to work on… By the end of the residency, I want to ship…"
            />
          </Field>
            <Field
              label="Which builder events or residencies have you attended, and when?"
              name="prior_events"
              error={errors.prior_events}
              hint="If yes, please share the name and year."
            >
              <textarea {...inputProps("prior_events")} rows={3} placeholder="e.g. mtnDAO 2023…" />
            </Field>
          </FormSection>

          <FormSection label="Project & links">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Organization or project" name="organization_or_project" error={errors.organization_or_project}>
                <input {...inputProps("organization_or_project")} type="text" placeholder="Project or company" />
              </Field>
              <Field label="GitHub or website" name="github_or_website" error={errors.github_or_website}>
                <input {...inputProps("github_or_website")} type="text" placeholder="https:// or github.com/you" />
              </Field>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Solana wallet address" name="wallet_address" error={errors.wallet_address} hint="Optional - handy for a Solana builder event.">
                <input {...inputProps("wallet_address")} type="text" placeholder="Your Solana address" />
              </Field>
              <Field label="Location" name="location" error={errors.location}>
                <input {...inputProps("location")} type="text" placeholder="City, country" />
              </Field>
            </div>
            <Field label="How did you hear about ctsDAO?" name="referral_source" error={errors.referral_source}>
              <input {...inputProps("referral_source")} type="text" />
            </Field>
          </FormSection>

          <FormSection label="Practical details">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="Do you need help with accommodation or grants?"
                name="accommodation_or_grant_needs"
                error={errors.accommodation_or_grant_needs}
                hint="Optional. This helps us understand support needs."
              >
                <textarea
                  {...inputProps("accommodation_or_grant_needs")}
                  rows={3}
                  placeholder="I may need help finding accommodation / travel support / grant support…"
                />
              </Field>

              <Field
                label="Dietary restrictions or special requirements"
                name="dietary_or_special_requirements"
                error={errors.dietary_or_special_requirements}
                hint="Optional. Food, accessibility, health, or other practical needs."
              >
                <textarea
                  {...inputProps("dietary_or_special_requirements")}
                  rows={3}
                  placeholder="Vegetarian, allergies, accessibility needs, etc."
                />
              </Field>
            </div>
          </FormSection>

          <FormSection label="Anything else">
            <Field label="Anything you'd like to add?" name="notes" error={errors.notes}>
              <textarea {...inputProps("notes")} rows={3} />
            </Field>
            <label className="flex items-start gap-3 text-sm text-ink-500">
              <input
                type="checkbox"
                name="wants_to_help_organize"
                className="mt-0.5 h-4 w-4 accent-[#C8362D]"
              />
              I&apos;m also interested in helping organize or contribute to ctsDAO,
              not just attending.
            </label>
          </FormSection>

          {globalError && (
            <div
              role="alert"
              className="rounded border border-akane/30 bg-akane/[0.06] px-4 py-3 text-sm text-akane"
            >
              {globalError}
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <motion.button
              type="submit"
              disabled={status === "submitting"}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-akane px-8 py-3.5 text-sm font-medium text-washi transition-colors duration-200 hover:bg-akane-deep disabled:cursor-wait disabled:opacity-60"
            >
              {status === "submitting" ? "Submitting…" : "Request invitation"}
            </motion.button>
            <p className="text-xs text-ink-400">
              By invitation - every seat is considered by hand.
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )}
</div>

);
}

"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getConsent, track } from "@/lib/analytics";
import { INTEREST_TYPES, ROLES } from "@/lib/validation";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionViewTracker } from "@/components/SectionViewTracker";
import { Reveal } from "@/components/Reveal";

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

function Field({
  label,
  name,
  error,
  required = false,
  children,
  hint,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ice-200">
        {label}
        {required ? (
          <span className="ml-1 text-gold" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-2 font-normal text-ice-500">optional</span>
        )}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ice-500">{hint}</p>}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function InterestForm({
  formEnabled,
  fallbackUrl,
}: {
  formEnabled: boolean;
  fallbackUrl: string;
}) {
  const reduced = useReducedMotion();
  const [interestTypes, setInterestTypes] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [globalError, setGlobalError] = useState("");
  const startedRef = useRef(false);

  // Fired via a bubbling focus listener on the form, never during render.
  const markStarted = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("interest_form_started");
    }
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

    const payload = {
      name: text("name"),
      email: text("email"),
      x_handle: text("x_handle"),
      role: text("role"),
      interest_type: interestTypes,
      reason: text("reason"),
      organization_or_project: text("organization_or_project") || undefined,
      location: text("location") || undefined,
      website: text("website") || undefined,
      github: text("github") || undefined,
      telegram: text("telegram") || undefined,
      has_attended_mtndao_or_similar: fd.get("has_attended_mtndao_or_similar") === "on",
      referral_source: text("referral_source") || undefined,
      notes: text("notes") || undefined,
      company_website: text("company_website"),
      consent_analytics: getConsent() === "granted",
    };

    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("success");
        track("interest_form_submitted", { interest_type: interestTypes });
        return;
      }

      setStatus("error");
      setErrors(data.fieldErrors ?? {});
      setGlobalError(data.error ?? "Something went wrong. Please try again.");
      track("interest_form_failed", { status: res.status });
    } catch {
      setStatus("error");
      setGlobalError("Network error — please check your connection and try again.");
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

  return (
    <section id="interest" className="relative border-t hairline bg-night-900 py-28 sm:py-36">
      <SectionViewTracker event="form_view" />
      <div aria-hidden="true" className="map-grid-fine absolute inset-0 opacity-50" />

      <div className="relative mx-auto max-w-3xl px-6 sm:px-10">
        <SectionHeading
          label="Interest list"
          sub="open now"
          title={
            <>
              Join the{" "}
              <span className="serif-accent text-cyan-soft">interest list.</span>
            </>
          }
        />

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-ice-300">
            Tell us who you are and why you want to be in the room. This is an
            interest form, not final acceptance — HokkaiDAO is application-only
            and curated.
          </p>
        </Reveal>

        {!formEnabled ? (
          <div className="mt-12 rounded-lg border hairline bg-night-800/60 p-8 text-center">
            <p className="text-ice-300">
              The embedded form is temporarily closed.
              {fallbackUrl ? (
                <>
                  {" "}
                  Please use{" "}
                  <a href={fallbackUrl} className="text-cyan-soft underline underline-offset-4">
                    this form
                  </a>{" "}
                  instead.
                </>
              ) : (
                <> Please reach out via email or X below.</>
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
                className="mt-12 rounded-lg border border-cyan-soft/30 bg-night-800/70 p-10 text-center"
              >
                <p className="mono-label text-cyan-soft">Received</p>
                <h3 className="mt-4 text-2xl font-semibold text-ice-100">
                  You&apos;re on the list.
                </h3>
                <p className="mx-auto mt-4 max-w-md text-ice-300">
                  Thanks for raising your hand. We&apos;ll reach out as
                  applications and details open up. Joining the interest list
                  does not guarantee acceptance — every seat is curated.
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
                className="mt-12 space-y-10"
              >
                {/* Honeypot — hidden from humans, baited for bots. */}
                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="company_website">Company website</label>
                  <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <fieldset className="space-y-6">
                  <legend className="mono-label mb-2">About you</legend>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Name" name="name" required error={errors.name}>
                      <input {...inputProps("name")} type="text" autoComplete="name" placeholder="Satoshi Builder" />
                    </Field>
                    <Field label="Email" name="email" required error={errors.email}>
                      <input {...inputProps("email")} type="email" autoComplete="email" placeholder="you@example.com" />
                    </Field>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="X handle" name="x_handle" required error={errors.x_handle} hint="@handle or plain handle">
                      <input {...inputProps("x_handle")} type="text" placeholder="@yourhandle" />
                    </Field>
                    <Field label="Role" name="role" required error={errors.role}>
                      <select {...inputProps("role")} defaultValue="">
                        <option value="" disabled>
                          Select your role
                        </option>
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mono-label mb-4">
                    I&apos;m interested as <span className="ml-1 text-gold">*</span>
                  </legend>
                  <div
                    role="group"
                    aria-label="Interest type (select all that apply)"
                    className="flex flex-wrap gap-2.5"
                  >
                    {INTEREST_TYPES.map((type) => {
                      const active = interestTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleInterest(type)}
                          aria-pressed={active}
                          className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                            active
                              ? "border-cyan-soft/60 bg-cyan-soft/10 text-ice-100"
                              : "hairline border bg-night-800/60 text-ice-400 hover:border-ice-400/40 hover:text-ice-200"
                          }`}
                        >
                          {INTEREST_LABELS[type]}
                        </button>
                      );
                    })}
                  </div>
                  {errors.interest_type && (
                    <p role="alert" className="mt-2 text-xs text-red-300">
                      {errors.interest_type}
                    </p>
                  )}
                </fieldset>

                <Field
                  label="Why do you want to be in the room?"
                  name="reason"
                  required
                  error={errors.reason}
                  hint="What you're building, what you'd work on, or why this matters to you."
                >
                  <textarea {...inputProps("reason")} rows={4} placeholder="I'm building…" />
                </Field>

                <details className="group rounded-lg border hairline bg-night-800/40 open:bg-night-800/60">
                  <summary className="cursor-pointer select-none list-none px-5 py-4 text-sm text-ice-300 transition-colors hover:text-ice-100 [&::-webkit-details-marker]:hidden">
                    Optional details — org, links, referral
                    <span className="ml-2 text-ice-500 transition-transform duration-200 group-open:hidden">+</span>
                    <span className="ml-2 hidden text-ice-500 group-open:inline">−</span>
                  </summary>
                  <div className="space-y-6 px-5 pb-6 pt-2">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field label="Organization / project" name="organization_or_project" error={errors.organization_or_project}>
                        <input {...inputProps("organization_or_project")} type="text" />
                      </Field>
                      <Field label="Location" name="location" error={errors.location}>
                        <input {...inputProps("location")} type="text" placeholder="City, country" />
                      </Field>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-3">
                      <Field label="Website" name="website" error={errors.website}>
                        <input {...inputProps("website")} type="text" placeholder="https://" />
                      </Field>
                      <Field label="GitHub" name="github" error={errors.github}>
                        <input {...inputProps("github")} type="text" />
                      </Field>
                      <Field label="Telegram" name="telegram" error={errors.telegram}>
                        <input {...inputProps("telegram")} type="text" />
                      </Field>
                    </div>
                    <Field label="How did you hear about HokkaiDAO?" name="referral_source" error={errors.referral_source}>
                      <input {...inputProps("referral_source")} type="text" />
                    </Field>
                    <Field label="Anything else?" name="notes" error={errors.notes}>
                      <textarea {...inputProps("notes")} rows={3} />
                    </Field>
                    <label className="flex items-center gap-3 text-sm text-ice-300">
                      <input
                        type="checkbox"
                        name="has_attended_mtndao_or_similar"
                        className="h-4 w-4 accent-[#7fd8e8]"
                      />
                      I&apos;ve attended mtnDAO or a similar builder retreat
                    </label>
                  </div>
                </details>

                {globalError && (
                  <div
                    role="alert"
                    className="rounded-md border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-200"
                  >
                    {globalError}
                  </div>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    whileTap={reduced ? undefined : { scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-ice-100 px-8 py-3.5 text-sm font-semibold text-night-900 transition duration-200 hover:bg-white hover:shadow-[0_0_32px_rgba(127,216,232,0.25)] disabled:cursor-wait disabled:opacity-60"
                  >
                    {status === "submitting" ? "Submitting…" : "Apply interest"}
                  </motion.button>
                  <p className="text-xs text-ice-500">
                    Interest only — applications and curation come later.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

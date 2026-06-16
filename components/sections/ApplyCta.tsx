import { Reveal } from "@/components/Reveal";
import { TrackedLink } from "@/components/TrackedLink";
import { FollowX } from "@/components/apply/FollowX";

/** Full-screen closing call to action — the primary route into /apply. */
export function ApplyCta() {
  return (
    <section
      id="apply-cta"
      className="relative flex min-h-svh flex-col justify-center border-t hairline bg-washi-raised py-24"
    >
      <div className="mx-auto w-full max-w-4xl px-6 text-center sm:px-10">
        <Reveal>
          <h2 className="text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-sumi">
            Request an <span className="text-akane">invitation</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
            ctsDAO is application-only and curated. Tell us who you are and how
            you&apos;d like to be involved.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <TrackedLink
              href="/apply"
              event="interest_cta_clicked"
              eventProps={{ location: "closing_cta" }}
              className="group inline-flex min-h-11 items-center gap-2 rounded-sm bg-akane px-7 py-3.5 text-sm font-medium text-washi transition-colors duration-200 hover:bg-akane-deep"
            >
              Request an invitation
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </TrackedLink>
            <FollowX label="Follow for 2027 updates" location="closing_cta" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/Reveal";
import { TrackedLink } from "@/components/TrackedLink";

export function SponsorCta({
  contactEmail,
  contactXHandle,
  xUrl,
}: {
  contactEmail: string;
  contactXHandle: string;
  xUrl: string;
}) {
  return (
    <section id="sponsor" className="relative flex min-h-svh flex-col justify-center overflow-hidden border-t hairline bg-washi py-24">
      <div className="relative mx-auto w-full max-w-4xl px-6 text-center sm:px-10">
        <Reveal>
          <h2 className="text-3xl font-light tracking-[-0.018em] text-sumi sm:text-5xl">
            Sponsor or partner with ctsDAO
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-500">
            Support{" "}
            <span className="text-sumi">
              the room where the next projects are built.
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <TrackedLink
              href={`mailto:${contactEmail}?subject=ctsDAO%20Sponsorship`}
              event="email_clicked"
              eventProps={{ location: "sponsor_cta" }}
              className="group inline-flex items-center gap-2 rounded-sm bg-akane px-7 py-3.5 text-sm font-medium text-washi transition-colors duration-200 hover:bg-akane-deep"
            >
              {contactEmail}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </TrackedLink>
            <TrackedLink
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              event="x_link_clicked"
              eventProps={{ location: "sponsor_cta" }}
              className="inline-flex items-center gap-2 rounded-sm border border-line px-7 py-3.5 text-sm text-sumi transition-colors duration-200 hover:border-sumi/30"
            >
              {contactXHandle} on X
            </TrackedLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

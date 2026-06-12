import { Reveal } from "@/components/Reveal";
import { Snowfall } from "@/components/Snowfall";
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
    <section id="sponsor" className="relative overflow-hidden border-t hairline bg-night-950 py-32 sm:py-40">
      <div aria-hidden="true" className="map-grid absolute inset-0 opacity-40" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,163,92,0.5), transparent)",
        }}
      />
      <Snowfall className="opacity-50" />

      <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-10">
        <Reveal>
          <p className="mono-label text-gold">Sponsor / Partner</p>
          <h2 className="mt-6 text-3xl text-ice-100 sm:text-5xl">
            Sponsor / Partner with HokkaiDAO
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ice-300">
            Support{" "}
            <span className="serif-accent text-ice-100">
              the room where the next projects are built.
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <TrackedLink
              href={`mailto:${contactEmail}?subject=HokkaiDAO%20Sponsorship`}
              event="email_clicked"
              eventProps={{ location: "sponsor_cta" }}
              className="group inline-flex items-center gap-2 rounded-md bg-gold px-7 py-3.5 text-sm text-night-950 transition duration-200 hover:bg-[#d9b56e] hover:shadow-[0_0_32px_rgba(201,163,92,0.3)]"
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
              className="inline-flex items-center gap-2 rounded-md border hairline px-7 py-3.5 text-sm text-ice-200 transition duration-200 hover:border-ice-400/40 hover:text-ice-100"
            >
              {contactXHandle} on X
            </TrackedLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

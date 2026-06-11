import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionViewTracker } from "@/components/SectionViewTracker";

export function Concept() {
  return (
    <section id="concept" className="relative border-t hairline bg-night-900 py-28 sm:py-36">
      <SectionViewTracker event="concept_view" />
      <div aria-hidden="true" className="map-grid-fine absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading index="01" label="Concept" title="A working hackathon, not a conference." />

        <div className="mt-14 grid gap-12 md:grid-cols-[3fr_2fr] md:gap-20">
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-ice-300 sm:text-xl">
              Inspired by the spirit of{" "}
              <span className="text-ice-100">mtnDAO</span>, HokkaiDAO brings
              builders together in Sapporo for two weeks of focused work,
              shared meals, mountain weekends, and real project launches — all
              inside the Solana ecosystem.
            </p>
            <p className="mt-8 text-2xl leading-snug text-ice-100 sm:text-3xl">
              This is not a conference.
              <br />
              <span className="serif-accent text-cyan-soft">
                It is a room for people who ship.
              </span>
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="space-y-6 border-l hairline pl-6">
              {[
                ["Duration", "Two weeks, March 2027"],
                ["Location", "Sapporo, Hokkaido, Japan"],
                ["Format", "Builder retreat / working hackathon"],
                ["Ecosystem", "Solana-focused"],
                ["Admission", "Application-only, curated"],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="mono-label">{term}</dt>
                  <dd className="mt-1 text-ice-200">{detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

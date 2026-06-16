import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionViewTracker } from "@/components/SectionViewTracker";

export function Concept() {
  return (
    <section id="concept" className="relative flex min-h-svh flex-col justify-center border-t hairline bg-washi py-24">
      <SectionViewTracker event="concept_view" />

      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10">
        <SectionHeading title="A working residency, not a conference." />

        <div className="mt-12 grid gap-12 md:grid-cols-[3fr_2fr] md:gap-20">
          <Reveal delay={0.1}>
            <p className="text-2xl font-light leading-snug tracking-[-0.01em] text-sumi sm:text-3xl">
              This is not a conference.
              <br />
              <span className="text-ink-400">
                It is a room for people who <span className="accent">ship</span>.
              </span>
            </p>
            <p className="mt-8 max-w-md leading-relaxed text-ink-500">
              Two weeks in Sapporo — focused work, shared meals, mountain
              weekends, and real launches, inside the Solana ecosystem.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="space-y-5 border-l hairline pl-6">
              {[
                ["Duration", "Two weeks, March 2027"],
                ["Location", "Sapporo, Hokkaido, Japan"],
                ["Format", "Builder residency / working hackathon"],
                ["Ecosystem", "Solana-focused"],
                ["Admission", "Application-only, curated"],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="mono-label">{term}</dt>
                  <dd className="mt-1 text-ink-700">{detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

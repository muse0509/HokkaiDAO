import { SectionViewTracker } from "@/components/SectionViewTracker";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

/** The fourteen days at a glance — three phases, one calm screen. */

const PHASES = [
  {
    word: "Work",
    days: "D01 – D06",
    accent: "text-kojiki",
    detail: "Coworking, workshops, build sessions, shared meals.",
  },
  {
    word: "Powder",
    days: "D07 – D08",
    accent: "text-kojiki",
    detail: "Ski weekends, local Hokkaido, informal bonding.",
  },
  {
    word: "Demo",
    days: "D09 – D14",
    accent: "text-akane",
    detail: "Demo day, recap, sponsor intros, launches.",
  },
] as const;

export function Format() {
  return (
    <section
      id="format"
      className="relative flex min-h-svh flex-col justify-center border-t hairline bg-washi py-24"
    >
      <SectionViewTracker event="format_view" />
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <SectionHeading
          title={
            <>
              Work. Powder. <span className="accent">Demo.</span>
            </>
          }
        />

        <div className="mt-20 grid divide-y divide-line border-t border-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {PHASES.map((phase, i) => (
            <Reveal key={phase.word} delay={i * 0.1}>
              <article className="py-12 md:px-12 md:py-10 lg:px-20">
                <p className="mono-label text-kojiki">{phase.days}</p>
                <h3 className="mt-3 text-4xl font-light tracking-[-0.02em] text-sumi">
                  {phase.word}
                  <span className={phase.accent}>.</span>
                </h3>
                <p className="mt-4 leading-relaxed text-ink-500">{phase.detail}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

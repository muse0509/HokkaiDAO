import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const REASONS = [
  {
    title: "Two weeks of focused work",
    body: "Long enough to ship something real. Short enough to stay intense.",
  },
  {
    title: "Curated Solana ecosystem peers",
    body: "The people next to you are chosen, not whoever bought a ticket.",
  },
  {
    title: "Feedback and intros",
    body: "Founders, funds, and ecosystem operators in the same room, every day.",
  },
  {
    title: "Project launch pressure",
    body: "Demo day is real. The deadline does what deadlines do.",
  },
  {
    title: "Shared meals and mountain weekends",
    body: "Relationships compound over dinners and chairlifts, not lanyards.",
  },
  {
    title: "Hokkaido as deep-work context",
    body: "Snow outside, focus inside. A setting that makes long work feel light.",
  },
];

export function Participants() {
  return (
    <section id="participants" className="relative border-t hairline bg-night-900 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          label="For participants"
          sub="why builders apply"
          title={
            <>
              Two weeks that{" "}
              <span className="serif-accent text-cyan-soft">compound.</span>
            </>
          }
        />

        <div className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={(i % 3) * 0.1}>
              <div className="flex gap-4">
                <span aria-hidden="true" className="mt-0.5 shrink-0 text-gold/70">
                  ✦
                </span>
                <div>
                  <h3 className="text-ice-100">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ice-400">{reason.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionViewTracker } from "@/components/SectionViewTracker";

const PILLARS = [
  {
    title: "Access",
    body: "A room you cannot buy at a conference — real proximity to the builders shaping what ships next.",
  },
  {
    title: "Backing",
    body: "Visible support for a community at the moment it forms, not after it's priced in.",
  },
  {
    title: "Distinction",
    body: "Not another logo on a stage. Your support is woven into moments people remember.",
  },
];

const MOMENTS = [
  "Venue",
  "Powder weekends",
  "Dinners",
  "Demo Day",
  "Workshops",
  "Builder grants",
];

export function Sponsors() {
  return (
    <section
      id="sponsors"
      className="relative flex min-h-svh flex-col justify-center border-t hairline bg-washi py-24"
    >
      <SectionViewTracker event="sponsors_view" />

      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10">
        <SectionHeading
          title={
            <>
              The product is <span className="accent">access</span>, not logo
              placement.
            </>
          }
        />

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.12}>
              <div className="border-t border-kojiki pt-6 md:px-10 lg:px-14">
                <h3 className="text-xl text-sumi">{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-500">{pillar.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Ownable moments — a quiet, compact line, not a wall of cards. */}
        <Reveal delay={0.1}>
          <div className="mt-20 border-t border-line pt-8">
            <p className="text-ink-400">
              Ownable moments — what you put your name on.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {MOMENTS.map((name) => (
                <li
                  key={name}
                  className="inline-flex items-center rounded-full border border-line px-4 py-2 text-sm text-ink-500"
                >
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl text-sm text-ink-400">
              Sponsorship is being shaped with early partners — conversations are
              open now.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

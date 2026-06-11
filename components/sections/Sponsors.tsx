"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionViewTracker } from "@/components/SectionViewTracker";

const PILLARS = [
  {
    title: "Access",
    body: "A room you cannot buy at a conference. Two weeks of real proximity to the builders shaping what ships next.",
  },
  {
    title: "Backing",
    body: "Visible support for a young builder community, at the moment it forms — not after it's already priced in.",
  },
  {
    title: "Distinction",
    body: "Not another logo on a stage. Your support is woven into moments people actually remember.",
  },
];

const MOMENTS = [
  ["Venue", "The room itself"],
  ["Lift tickets", "Powder weekends"],
  ["Transport", "Getting builders there"],
  ["Dinners", "Where deals happen"],
  ["Demo Day", "The closing stage"],
  ["Swag", "Worn long after"],
  ["Workshops", "Hands-on sessions"],
  ["Builder grants", "Fuel for projects"],
  ["Monitor rentals", "The build setup"],
];

export function Sponsors() {
  const reduced = useReducedMotion();

  return (
    <section id="sponsors" className="relative border-t hairline bg-night-950 py-28 sm:py-36">
      <SectionViewTracker event="sponsors_view" />
      <div aria-hidden="true" className="map-grid absolute inset-0 opacity-50" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading index="04" label="Why sponsors care" title="The product is access, not logo placement." />

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.12}>
              <div className="border-t-2 border-gold/60 pt-6">
                <h3 className="text-xl font-semibold text-ice-100">{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-ice-400">{pillar.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Ownable moments */}
        <div className="mt-28">
          <Reveal>
            <p className="mono-label flex items-center gap-3">
              <span className="text-gold">05</span>
              <span aria-hidden="true" className="h-px w-8 bg-ice-500/30" />
              Ownable moments
            </p>
            <h3 className="mt-5 max-w-2xl text-2xl font-semibold tracking-tight text-ice-100 sm:text-3xl">
              Own a moment builders remember —{" "}
              <span className="serif-accent text-ice-300">not a banner they forget.</span>
            </h3>
          </Reveal>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border hairline bg-ice-500/10 sm:grid-cols-2 lg:grid-cols-3">
            {MOMENTS.map(([name, note], i) => (
              <motion.li
                key={name}
                initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: reduced ? 0.2 : 0.5,
                  delay: reduced ? 0 : (i % 3) * 0.08,
                }}
                className="group flex items-baseline justify-between gap-4 bg-night-900 px-6 py-5 transition-colors duration-200 hover:bg-night-800"
              >
                <span className="font-medium text-ice-200 transition-colors group-hover:text-ice-100">
                  {name}
                </span>
                <span className="mono-label text-right normal-case tracking-normal text-ice-500 transition-colors group-hover:text-cyan-soft">
                  {note}
                </span>
              </motion.li>
            ))}
          </ul>

          <p className="mt-8 max-w-xl text-sm text-ice-500">
            Sponsorship structure is being shaped with early partners —
            conversations are open now.
          </p>
        </div>
      </div>
    </section>
  );
}

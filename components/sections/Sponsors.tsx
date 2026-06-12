"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionViewTracker } from "@/components/SectionViewTracker";
import { TiltCard } from "@/components/motion/TiltCard";

const PILLARS = [
  {
    title: "Access",
    body: "A room you cannot buy at a conference. Two weeks of real proximity to the builders shaping what ships next.",
  },
  {
    title: "Backing",
    body: "Visible support for a young builder community, at the moment it forms, not after it's already priced in.",
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
        <SectionHeading
          label="Why sponsors care"
          title="The product is access, not logo placement."
        />

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.12}>
              <div className="border-t-2 border-gold/60 pt-6">
                <h3 className="text-xl text-ice-100">{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-ice-400">{pillar.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Ownable moments */}
        <div className="mt-28">
          <Reveal>
            <p className="mono-label">
              Ownable moments
              <span aria-hidden="true" className="mx-2 text-ice-500/40">
                /
              </span>
              what you can put your name on
            </p>
            <h3 className="mt-5 max-w-2xl text-2xl text-ice-100 sm:text-3xl">
              Own a moment builders remember,{" "}
              <span className="serif-accent text-ice-300">not a banner they forget.</span>
            </h3>
          </Reveal>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOMENTS.map(([name, note], i) => (
              <motion.li
                key={name}
                initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: reduced ? 0.2 : 0.55,
                  delay: reduced ? 0 : (i % 3) * 0.08,
                  ease: [0.21, 0.6, 0.35, 1],
                }}
              >
                <TiltCard className="glass group h-full rounded-lg px-6 py-6">
                  <span className="block text-ice-200 transition-colors group-hover:text-ice-100">
                    {name}
                  </span>
                  <span className="mono-label mt-2 block normal-case tracking-normal text-ice-500 transition-colors group-hover:text-cyan-soft">
                    {note}
                  </span>
                </TiltCard>
              </motion.li>
            ))}
          </ul>

          <p className="mt-8 max-w-xl text-sm text-ice-500">
            Sponsorship structure is being shaped with early partners,
            conversations are open now.
          </p>
        </div>
      </div>
    </section>
  );
}

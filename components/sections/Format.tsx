"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionViewTracker } from "@/components/SectionViewTracker";

const PHASES = [
  {
    word: "Work",
    glyph: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
        <rect x="8" y="12" width="32" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 38h20M24 34v4" stroke="currentColor" strokeWidth="2" />
        <path d="M16 20l4 4-4 4M24 28h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    detail: "Coworking, workshops, build sessions, shared meals.",
    accent: "text-cyan-soft",
  },
  {
    word: "Powder",
    glyph: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
        <path d="M6 38l12-20 8 12 6-9 10 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M18 18l3 4 3-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="38" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    detail: "Ski weekends, local Hokkaido experiences, informal bonding.",
    accent: "text-ice-300",
  },
  {
    word: "Demo",
    glyph: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
        <path d="M10 36V20M20 36V12M30 36V24M40 36V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 40h36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    detail: "Demo day, recap, sponsor intros, project launches.",
    accent: "text-gold",
  },
];

export function Format() {
  const reduced = useReducedMotion();

  return (
    <section id="format" className="relative border-t hairline bg-night-950 py-28 sm:py-36">
      <SectionViewTracker event="format_view" />

      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          index="02"
          label="Format"
          title={
            <>
              Work. Powder.{" "}
              <span className="serif-accent text-gold">Demo.</span>
            </>
          }
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border hairline bg-ice-500/10 md:grid-cols-3">
          {PHASES.map((phase, i) => (
            <motion.article
              key={phase.word}
              initial={{ opacity: 0, y: reduced ? 0 : 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: reduced ? 0.2 : 0.7,
                delay: reduced ? 0 : i * 0.15,
                ease: [0.21, 0.6, 0.35, 1],
              }}
              className="group relative bg-night-900 p-8 transition-colors duration-300 hover:bg-night-800 sm:p-10"
            >
              <div className={`${phase.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}>
                {phase.glyph}
              </div>
              <p className="mono-label mt-8">{`Phase 0${i + 1}`}</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-ice-100">
                {phase.word}
              </h3>
              <p className="mt-4 leading-relaxed text-ice-400">{phase.detail}</p>
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current ${phase.accent} transition-transform duration-500 group-hover:scale-x-100`}
              />
            </motion.article>
          ))}
        </div>

        <p className="mt-10 max-w-xl text-ice-400">
          Two weeks of building, punctuated by Hokkaido&apos;s best powder —
          and closed by a demo day where projects actually launch.
        </p>
      </div>
    </section>
  );
}

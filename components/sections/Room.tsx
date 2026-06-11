"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const PROFILES = [
  "protocol engineers",
  "founders",
  "designers",
  "DevRel",
  "DAO operators",
  "researchers",
  "hackers",
  "angels & VCs",
  "ecosystem funds",
  "writers & creators",
];

export function Room() {
  const reduced = useReducedMotion();

  return (
    <section id="room" className="relative border-t hairline bg-night-900 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          index="03"
          label="The Room"
          title={
            <>
              50–100 curated builders.
              <br />
              <span className="serif-accent text-ice-300">Not badge scans.</span>
            </>
          }
        />

        <Reveal delay={0.1} className="mt-8 max-w-2xl">
          <p className="text-lg leading-relaxed text-ice-300">
            Every seat in the room is application-only. We curate for people
            who build, fund, design, and write the Solana ecosystem into
            existence — and who want two weeks of real proximity to do it.
          </p>
        </Reveal>

        <ul className="mt-14 flex flex-wrap gap-3" aria-label="Builder profiles">
          {PROFILES.map((profile, i) => (
            <motion.li
              key={profile}
              initial={{ opacity: 0, scale: reduced ? 1 : 0.9, y: reduced ? 0 : 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: reduced ? 0.2 : 0.5,
                delay: reduced ? 0 : i * 0.06,
                ease: [0.21, 0.6, 0.35, 1],
              }}
              className="cursor-default rounded-full border hairline bg-night-800/70 px-5 py-2.5 font-mono text-sm text-ice-300 transition-colors duration-200 hover:border-cyan-soft/40 hover:text-ice-100"
            >
              {profile}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

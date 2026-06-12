"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionViewTracker } from "@/components/SectionViewTracker";
import { TrackedLink } from "@/components/TrackedLink";
import { Magnetic } from "@/components/motion/Magnetic";

const ease = [0.21, 0.6, 0.35, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const item = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0.2 : 0.9, delay, ease },
  });

  return (
    <header
      id="hero"
      ref={heroRef}
      className="relative flex min-h-svh flex-col overflow-hidden bg-night-950"
    >
      <SectionViewTracker event="hero_view" />

      <div aria-hidden="true" className="hero-backdrop">
        <div className="hero-aurora" />
        <div className="hero-horizon-glow" />
        <div className="hero-mountain hero-mountain-back" />
        <div className="hero-mountain hero-mountain-mid" />
        <div className="hero-snow-sheen" />
        <div className="hero-mountain hero-mountain-front" />
        <div className="hero-ice-fog" />
      </div>

      <motion.div
        {...item(0.15)}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-24 text-center sm:px-10"
      >
        <h1
          className="text-[clamp(4rem,14vw,10rem)] leading-none text-ice-100"
        >
          HokkaiDAO
        </h1>

        <motion.div
          {...item(0.35)}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <Magnetic>
            <TrackedLink
              href="#interest"
              event="interest_cta_clicked"
              eventProps={{ location: "hero" }}
              className="sheen group inline-flex min-h-11 items-center gap-2 rounded-md bg-ice-100 px-6 py-3 text-sm text-night-900 transition duration-200 hover:bg-white hover:shadow-[0_0_40px_rgba(127,216,232,0.35)]"
            >
              Join the interest list
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </TrackedLink>
          </Magnetic>
          <Magnetic strength={0.18}>
            <TrackedLink
              href="#sponsor"
              event="sponsor_cta_clicked"
              eventProps={{ location: "hero" }}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border hairline bg-night-900/40 px-6 py-3 text-sm text-ice-200 backdrop-blur-sm transition duration-200 hover:border-ice-400/40 hover:text-ice-100"
            >
              Sponsor / Partner with us
            </TrackedLink>
          </Magnetic>
        </motion.div>
      </motion.div>
    </header>
  );
}

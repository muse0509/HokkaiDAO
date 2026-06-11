"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Snowfall } from "@/components/Snowfall";
import { SectionViewTracker } from "@/components/SectionViewTracker";
import { TrackedLink } from "@/components/TrackedLink";

const ease = [0.21, 0.6, 0.35, 1] as const;

function Ridge() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-x-0 bottom-0 h-[36vh] w-full"
    >
      <polygon
        points="0,320 180,140 320,230 470,70 640,250 830,110 1010,220 1200,90 1340,200 1440,150 1440,320"
        fill="rgba(10,20,38,0.85)"
      />
      <polygon
        points="470,70 540,145 400,145"
        fill="rgba(214,230,244,0.07)"
      />
      <polygon
        points="1200,90 1255,155 1145,155"
        fill="rgba(214,230,244,0.06)"
      />
      <polygon
        points="0,320 120,230 260,290 420,180 600,300 800,200 980,290 1160,190 1320,280 1440,230 1440,320"
        fill="rgba(6,13,26,0.95)"
      />
    </svg>
  );
}

export function Hero() {
  const reduced = useReducedMotion();

  const item = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0.2 : 0.9, delay, ease },
  });

  return (
    <header className="relative flex min-h-svh flex-col overflow-hidden bg-night-950">
      <SectionViewTracker event="hero_view" />

      {/* atmosphere */}
      <div aria-hidden="true" className="map-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="aurora absolute -top-1/4 left-1/2 h-[70vh] w-[120vw] -translate-x-1/2 rounded-[100%] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(127,216,232,0.10) 0%, rgba(62,127,150,0.05) 40%, transparent 70%)",
        }}
      />
      <Ridge />
      <Snowfall />

      {/* top bar */}
      <motion.div
        {...item(0.1)}
        className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10"
      >
        <span className="mono-label text-ice-300">HOKKAIDAO</span>
        <span className="mono-label hidden sm:block">43.06°N&thinsp;/&thinsp;141.35°E</span>
        <span className="mono-label">EST. 2027</span>
      </motion.div>

      {/* main */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-32 pt-20 sm:px-10">
        <motion.p {...item(0.25)} className="mono-label">
          Sapporo, Japan · March 2027
        </motion.p>

        <motion.h1
          {...item(0.4)}
          className="mt-6 text-[clamp(3.5rem,11vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ice-100"
        >
          Hokkai
          <span className="text-cyan-soft">DAO</span>
        </motion.h1>

        <motion.p
          {...item(0.55)}
          className="mt-8 max-w-2xl text-2xl leading-snug text-ice-300 sm:text-3xl"
        >
          Asia&apos;s first Web3 winter builder retreat.
          <br />
          <span className="serif-accent text-ice-100">
            Two weeks. One room. Real builders.
          </span>
        </motion.p>

        <motion.div
          {...item(0.7)}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          <span className="mono-label flex items-center gap-2">
            <span aria-hidden="true" className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-gold" />
            Application-only
          </span>
          <span className="mono-label">50–100 builders</span>
          <span className="mono-label">Solana ecosystem</span>
        </motion.div>

        <motion.div {...item(0.85)} className="mt-12 flex flex-wrap gap-4">
          <TrackedLink
            href="#interest"
            event="interest_cta_clicked"
            eventProps={{ location: "hero" }}
            className="group inline-flex items-center gap-2 rounded-md bg-ice-100 px-6 py-3 text-sm font-semibold text-night-900 transition duration-200 hover:bg-white hover:shadow-[0_0_32px_rgba(127,216,232,0.25)]"
          >
            Join the interest list
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </TrackedLink>
          <TrackedLink
            href="#sponsor"
            event="sponsor_cta_clicked"
            eventProps={{ location: "hero" }}
            className="inline-flex items-center gap-2 rounded-md border hairline px-6 py-3 text-sm font-medium text-ice-200 transition duration-200 hover:border-ice-400/40 hover:text-ice-100"
          >
            Sponsor / Partner with us
          </TrackedLink>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <span className="mono-label text-ice-500/70">Scroll</span>
      </motion.div>
    </header>
  );
}

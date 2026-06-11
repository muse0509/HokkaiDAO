"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ParallaxMountains } from "@/components/ParallaxMountains";
import { Snowfall } from "@/components/Snowfall";
import { SectionViewTracker } from "@/components/SectionViewTracker";
import { TrackedLink } from "@/components/TrackedLink";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";

const ease = [0.21, 0.6, 0.35, 1] as const;

const WORDMARK = [
  { char: "H", accent: false },
  { char: "o", accent: false },
  { char: "k", accent: false },
  { char: "k", accent: false },
  { char: "a", accent: false },
  { char: "i", accent: false },
  { char: "D", accent: true },
  { char: "A", accent: true },
  { char: "O", accent: true },
];

const TICKER_ITEMS = [
  "Sapporo, Japan",
  "43.06°N / 141.35°E",
  "March 2027",
  "Two weeks",
  "Application-only",
  "50–100 builders",
  "Solana ecosystem",
  "Work · Powder · Demo",
];

export function Hero() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Content drifts up and fades slightly faster than the mountains,
  // separating the planes as you scroll away.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const item = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0.2 : 0.9, delay, ease },
  });

  return (
    <header
      ref={heroRef}
      className="relative flex min-h-svh flex-col overflow-hidden bg-night-950"
    >
      <SectionViewTracker event="hero_view" />

      {/* atmosphere: grid, twin aurora curtains, parallax ridges, deep snow */}
      <div aria-hidden="true" className="map-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="aurora-a absolute -top-[30%] left-[8%] h-[80vh] w-[70vw] rounded-[100%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(127,216,232,0.13) 0%, rgba(62,127,150,0.05) 45%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
      <div
        aria-hidden="true"
        className="aurora-b absolute -top-[20%] right-[-10%] h-[70vh] w-[55vw] rounded-[100%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(143,178,232,0.09) 0%, rgba(201,163,92,0.03) 50%, transparent 72%)",
          filter: "blur(16px)",
        }}
      />
      <ParallaxMountains heroRef={heroRef} />
      <Snowfall density={1.2} />

      {/* top bar */}
      <motion.div
        {...item(0.1)}
        className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10"
      >
        <span className="mono-label text-ice-300">HOKKAIDAO</span>
        <span className="mono-label hidden sm:block">WINTER BUILDER RETREAT</span>
        <span className="mono-label">EST. 2027</span>
      </motion.div>

      {/* main */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-40 pt-20 sm:px-10"
      >
        <motion.p {...item(0.2)} className="mono-label">
          Sapporo, Japan · March 2027
        </motion.p>

        <h1
          aria-label="HokkaiDAO"
          className="mt-6 text-[clamp(3.5rem,11vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ice-100"
        >
          {WORDMARK.map((letter, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className={`inline-block ${letter.accent ? "text-cyan-soft" : ""}`}
              initial={{
                opacity: 0,
                y: reduced ? 0 : "0.45em",
                rotate: reduced ? 0 : 4,
              }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                duration: reduced ? 0.2 : 0.8,
                delay: reduced ? 0.1 : 0.32 + i * 0.045,
                ease,
              }}
            >
              {letter.char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          {...item(0.75)}
          className="mt-8 max-w-2xl text-2xl leading-snug text-ice-300 sm:text-3xl"
        >
          Asia&apos;s first Web3 winter builder retreat.
          <br />
          <span className="serif-accent text-ice-100">
            Two weeks. One room. Real builders.
          </span>
        </motion.p>

        <motion.div
          {...item(0.9)}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          <span className="mono-label flex items-center gap-2">
            <span
              aria-hidden="true"
              className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-gold"
            />
            Application-only
          </span>
          <span className="mono-label">50–100 builders</span>
          <span className="mono-label">Solana ecosystem</span>
        </motion.div>

        <motion.div {...item(1.05)} className="mt-12 flex flex-wrap gap-4">
          <Magnetic>
            <TrackedLink
              href="#interest"
              event="interest_cta_clicked"
              eventProps={{ location: "hero" }}
              className="sheen group inline-flex items-center gap-2 rounded-md bg-ice-100 px-6 py-3 text-sm font-semibold text-night-900 transition duration-200 hover:bg-white hover:shadow-[0_0_40px_rgba(127,216,232,0.35)]"
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
              className="inline-flex items-center gap-2 rounded-md border hairline bg-night-900/40 px-6 py-3 text-sm font-medium text-ice-200 backdrop-blur-sm transition duration-200 hover:border-ice-400/40 hover:text-ice-100"
            >
              Sponsor / Partner with us
            </TrackedLink>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* ticker strip pinned above the ridgeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="relative z-10 border-y hairline bg-night-950/55 backdrop-blur-sm"
      >
        <Marquee duration={46}>
          {TICKER_ITEMS.map((text) => (
            <span key={text} className="mono-label flex items-center px-7 py-3">
              <span aria-hidden="true" className="mr-7 text-gold/70">
                ✦
              </span>
              {text}
            </span>
          ))}
        </Marquee>
      </motion.div>
    </header>
  );
}

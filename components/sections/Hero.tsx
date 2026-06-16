"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionViewTracker } from "@/components/SectionViewTracker";
import { TrackedLink } from "@/components/TrackedLink";
import { FollowX } from "@/components/apply/FollowX";

const ease = [0.21, 0.6, 0.35, 1] as const;

/**
 * Hero: a small logo, a single tagline, and a restrained pair of CTAs on Washi
 * White with generous ma. Quiet and premium, but enough to orient and act.
 */
export function Hero() {
  const reduced = useReducedMotion();

  const item = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0.2 : 0.8, delay, ease },
  });

  return (
    <header
      id="hero"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-washi px-6 text-center"
    >
      <SectionViewTracker event="hero_view" />

      <motion.div
        {...item(0.05)}
        className="w-full max-w-[11rem] sm:max-w-[13rem] md:max-w-[15rem]"
      >
        <Image
          src="/ctsdaohero.png"
          alt="ctsDAO — a winter residency for builders in Japan"
          width={2092}
          height={668}
          priority
          sizes="(min-width: 768px) 15rem, (min-width: 640px) 13rem, 11rem"
          className="h-auto w-full select-none"
        />
      </motion.div>

      <motion.h1
        {...item(0.2)}
        className="mt-10 max-w-2xl text-[clamp(1.6rem,4vw,2.5rem)] font-light leading-[1.2] tracking-[-0.01em] text-sumi"
      >
        A winter residency in Japan
        <br className="hidden sm:block" /> for Solana builders.
      </motion.h1>

      <motion.div
        {...item(0.35)}
        className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
      >
        <TrackedLink
          href="/apply"
          event="interest_cta_clicked"
          eventProps={{ location: "hero" }}
          className="group inline-flex min-h-11 items-center gap-2 rounded-sm bg-akane px-6 py-3 text-sm font-medium text-washi transition-colors duration-200 hover:bg-akane-deep"
        >
          Request an invitation
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </TrackedLink>
        <FollowX label="Follow on X" location="hero" />
      </motion.div>

      <motion.p {...item(0.5)} className="mt-10 text-sm text-ink-400">
        Sapporo · Hokkaido · March 2027
      </motion.p>

      {/* Quiet scroll cue. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-10 flex justify-center"
        animate={reduced ? undefined : { opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="h-10 w-px bg-ink-400/40" />
      </motion.div>
    </header>
  );
}

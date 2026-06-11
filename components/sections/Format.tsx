"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { SectionViewTracker } from "@/components/SectionViewTracker";
import { Reveal } from "@/components/Reveal";

/**
 * The signature moment of the page: the two weeks play out as you scroll.
 * A sticky viewport scrubs from D01 to D14 — Work, then the Powder weekend,
 * then the run-up to Demo Day. Under reduced motion (or no JS) it renders
 * as a static three-phase layout instead.
 */

const PHASES = [
  {
    word: "Work",
    days: "D01 – D06",
    accent: "text-cyan-soft",
    bar: "bg-cyan-soft",
    detail: "Coworking, workshops, build sessions, shared meals.",
    note: "Heads down. The room settles into a rhythm of long, focused days.",
  },
  {
    word: "Powder",
    days: "D07 – D08",
    accent: "text-ice-300",
    bar: "bg-ice-300",
    detail: "Ski weekends, local Hokkaido experiences, informal bonding.",
    note: "The weekend the relationships form — on chairlifts, not lanyards.",
  },
  {
    word: "Demo",
    days: "D09 – D14",
    accent: "text-gold",
    bar: "bg-gold",
    detail: "Demo day, recap, sponsor intros, project launches.",
    note: "Deadline gravity. Everything converges on the final demo day.",
  },
] as const;

function PhasePanel({
  phase,
  active,
}: {
  phase: (typeof PHASES)[number];
  active: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 26 }}
      transition={{ duration: 0.45, ease: [0.21, 0.6, 0.35, 1] }}
      className="absolute inset-0 flex flex-col justify-center"
      aria-hidden={!active}
    >
      <p className={`mono-label ${phase.accent}`}>{phase.days}</p>
      <h3 className="mt-3 text-6xl font-semibold tracking-tight text-ice-100 sm:text-8xl">
        {phase.word}
        <span className={phase.accent}>.</span>
      </h3>
      <p className="mt-6 max-w-md text-lg text-ice-300">{phase.detail}</p>
      <p className="serif-accent mt-3 max-w-md text-ice-400">{phase.note}</p>
    </motion.div>
  );
}

function StickyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [day, setDay] = useState(1);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setDay(Math.min(14, Math.max(1, Math.ceil(p * 14))));
  });

  const phaseIndex = day <= 6 ? 0 : day <= 8 ? 1 : 2;

  return (
    <div ref={containerRef} className="relative h-[340vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div aria-hidden="true" className="map-grid-fine absolute inset-0 opacity-50" />

        <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10">
          <p className="mono-label">
            The format <span aria-hidden="true" className="mx-2 text-ice-500/40">/</span>{" "}
            fourteen days
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ice-100 sm:text-4xl">
            Work. Powder.{" "}
            <span className="serif-accent text-gold">Demo.</span>
          </h2>

          <div className="mt-10 grid items-center gap-10 md:grid-cols-[auto_1fr] md:gap-20">
            {/* day counter */}
            <div className="select-none">
              <span className="mono-label block">Day</span>
              <span className="font-mono text-[clamp(5rem,14vw,11rem)] font-bold leading-none tracking-tight text-ice-100/90 tabular-nums">
                {String(day).padStart(2, "0")}
              </span>
              <span className="mono-label block text-ice-500">of 14</span>
            </div>

            {/* phase panels */}
            <div className="relative h-[20rem] sm:h-[22rem]">
              {PHASES.map((phase, i) => (
                <PhasePanel key={phase.word} phase={phase} active={i === phaseIndex} />
              ))}
            </div>
          </div>

          {/* progress rail with day ticks */}
          <div className="mt-12">
            <div className="relative h-px w-full bg-ice-500/15">
              <motion.div
                className={`absolute inset-y-0 left-0 w-full origin-left ${PHASES[phaseIndex].bar}`}
                style={{ scaleX: scrollYProgress, height: "2px", top: "-0.5px" }}
              />
              <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
                {Array.from({ length: 14 }, (_, i) => {
                  const d = i + 1;
                  const isWeekend = d === 7 || d === 8;
                  return (
                    <span
                      key={d}
                      className={`h-2 w-px ${
                        d <= day
                          ? isWeekend
                            ? "bg-ice-300"
                            : "bg-cyan-soft/80"
                          : "bg-ice-500/25"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="mt-3 flex justify-between">
              <span className="mono-label text-ice-500">Arrive</span>
              <span className="mono-label text-ice-500">Powder weekend</span>
              <span className="mono-label text-gold">Demo day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaticPhases() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-36">
      <Reveal>
        <p className="mono-label">
          The format <span aria-hidden="true" className="mx-2 text-ice-500/40">/</span>{" "}
          fourteen days
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ice-100 sm:text-5xl">
          Work. Powder. <span className="serif-accent text-gold">Demo.</span>
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border hairline bg-ice-500/10 md:grid-cols-3">
        {PHASES.map((phase) => (
          <article key={phase.word} className="bg-night-900 p-8 sm:p-10">
            <p className={`mono-label ${phase.accent}`}>{phase.days}</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-ice-100">
              {phase.word}
            </h3>
            <p className="mt-4 leading-relaxed text-ice-400">{phase.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Format() {
  const reduced = useReducedMotion();

  return (
    <section id="format" className="relative bg-night-950">
      <SectionViewTracker event="format_view" />
      {reduced ? <StaticPhases /> : <StickyTimeline />}
    </section>
  );
}

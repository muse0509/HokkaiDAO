"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const PROFILES = [
  { text: "Protocol engineers", muted: false },
  { text: "Founders", muted: true },
  { text: "Designers & DevRel", muted: false },
  { text: "DAO operators", muted: true },
  { text: "Researchers", muted: false },
  { text: "Angels & VCs", muted: true },
  { text: "Writers & creators", muted: false },
];

const STATS = [
  { value: 100, prefix: "", suffix: "+", label: "curated builders" },
  { value: 14, prefix: "", suffix: "", label: "days in one room" },
  { value: 1, prefix: "", suffix: "", label: "demo day" },
];

function CountUp({
  value,
  prefix,
  suffix,
  label,
}: {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.21, 0.6, 0.35, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  // Reduced motion (and pre-animation SSR) shows the final number directly.
  const shown = reduced || (!inView && display === 0) ? value : display;

  return (
    <div className="border-l border-kojiki/50 pl-5">
      <span
        ref={ref}
        className="num whitespace-nowrap text-3xl font-light text-sumi sm:text-4xl lg:text-5xl"
      >
        {prefix}
        {shown}
        {suffix}
      </span>
      <p className="mono-label mt-2">{label}</p>
    </div>
  );
}


export function Room() {
  return (
    <section id="room" className="relative flex min-h-svh flex-col justify-center border-t hairline bg-washi py-24">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <SectionHeading
          title={
            <>
              100+ <span className="accent">curated</span> builders.
              <br />
              <span className="text-ink-400">Not badge scans.</span>
            </>
          }
        />

        <div className="mt-12 grid gap-10 md:grid-cols-[3fr_2fr] md:gap-16">
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-ink-500">
              Every seat is application-only. We curate for people who build,
              fund, design, and write the Solana ecosystem into existence — and
              want two weeks of real proximity to do it.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col gap-7 sm:gap-8">
              {STATS.map((stat) => (
                <CountUp key={stat.label} {...stat} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-20 border-t border-line" aria-label="Builder profiles">
        {PROFILES.map((profile, i) => (
          <Reveal key={profile.text} delay={i * 0.06}>
            <div className="mx-auto w-full max-w-6xl border-b border-line px-6 py-6 sm:px-10">
              <p
                className={`text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-none tracking-[-0.02em] ${
                  profile.muted ? "text-ink-400" : "text-sumi"
                }`}
              >
                {profile.text}.
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

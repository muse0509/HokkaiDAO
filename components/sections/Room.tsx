"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Marquee } from "@/components/motion/Marquee";

const PROFILES_A = [
  "protocol engineers",
  "founders",
  "designers",
  "DevRel",
  "DAO operators",
];

const PROFILES_B = [
  "researchers",
  "hackers",
  "angels & VCs",
  "ecosystem funds",
  "writers & creators",
];

const STATS = [
  { value: 100, prefix: "50–", label: "curated builders" },
  { value: 14, prefix: "", label: "days in one room" },
  { value: 1, prefix: "", label: "demo day" },
];

function CountUp({
  value,
  prefix,
  label,
}: {
  value: number;
  prefix: string;
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
      </span>
      <p className="mono-label mt-2">{label}</p>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-2 cursor-default whitespace-nowrap rounded-full border border-line bg-washi-raised px-5 py-2.5 font-mono text-sm text-ink-500 transition-colors duration-200 hover:border-sumi/25 hover:text-sumi">
      {children}
    </span>
  );
}

export function Room() {
  return (
    <section id="room" className="relative flex min-h-svh flex-col justify-center overflow-hidden border-t hairline bg-washi py-24">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <SectionHeading
          title={
            <>
              50–100 <span className="accent">curated</span> builders.
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

      {/* profile chips drift in opposite directions, edge-faded */}
      <div
        className="mt-16 space-y-4 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
        aria-label="Builder profiles"
      >
        <Marquee duration={36}>
          {PROFILES_A.map((profile) => (
            <Chip key={profile}>{profile}</Chip>
          ))}
        </Marquee>
        <Marquee duration={44} className="[&_.marquee-track]:[animation-direction:reverse]">
          {PROFILES_B.map((profile) => (
            <Chip key={profile}>{profile}</Chip>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

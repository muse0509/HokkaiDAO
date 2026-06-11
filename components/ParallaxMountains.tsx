"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, type RefObject } from "react";

/**
 * Layered mountain scene with atmospheric perspective: far ridges are
 * fog-lightened, near ridges dark. Layers shift on mouse move and drift at
 * different rates on scroll, which is what gives the hero real depth.
 * Everything is transform-only; static under reduced motion.
 */

const RIDGES = [
  // far — lightest, slowest
  {
    points:
      "0,200 140,120 260,170 420,60 560,150 720,90 880,160 1040,80 1200,150 1320,110 1440,160 1440,320 0,320",
    fill: "rgba(58, 86, 124, 0.38)",
    mouse: 6,
    drift: 0.12,
  },
  {
    points:
      "0,240 120,160 300,210 470,100 620,200 800,130 980,210 1150,140 1300,200 1440,170 1440,320 0,320",
    fill: "rgba(26, 44, 72, 0.75)",
    mouse: 14,
    drift: 0.24,
  },
  // near — darkest, fastest
  {
    points:
      "0,320 100,240 240,295 420,190 600,300 780,215 960,295 1140,205 1320,285 1440,240 1440,320 0,320",
    fill: "#04080f",
    mouse: 26,
    drift: 0.4,
  },
];

function Ridge({
  points,
  fill,
  mouse,
  drift,
  mx,
  my,
  scrollY,
  snowcaps,
}: (typeof RIDGES)[number] & {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  scrollY: MotionValue<number>;
  snowcaps?: boolean;
}) {
  const x = useTransform(mx, (v) => v * mouse);
  const yMouse = useTransform(my, (v) => v * mouse * 0.4);
  const yScroll = useTransform(scrollY, (v) => v * drift);
  const y = useTransform(() => yMouse.get() + yScroll.get());

  return (
    <motion.svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-x-[-3%] bottom-0 h-[34vh] w-[106%]"
      style={{ x, y }}
      aria-hidden="true"
    >
      <polygon points={points} fill={fill} />
      {snowcaps && (
        <>
          <polygon points="420,190 468,242 372,242" fill="rgba(214,230,244,0.10)" />
          <polygon points="1140,205 1184,252 1096,252" fill="rgba(214,230,244,0.08)" />
        </>
      )}
    </motion.svg>
  );
}

export function ParallaxMountains({
  heroRef,
}: {
  heroRef: RefObject<HTMLElement | null>;
}) {
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 50, damping: 20, mass: 0.8 });
  const my = useSpring(rawY, { stiffness: 50, damping: 20, mass: 0.8 });

  const { scrollY } = useScroll();
  const zero = useMotionValue(0);
  const scrollSource = reduced ? zero : scrollY;

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, rawX, rawY]);

  // Freeze mouse values under reduced motion.
  const mxFinal = reduced ? zero : mx;
  const myFinal = reduced ? zero : my;

  // Fog bands between ridge layers sell the depth.
  const fogY = useTransform(scrollSource, (v) => v * 0.18);

  void heroRef;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Ridge {...RIDGES[0]} mx={mxFinal} my={myFinal} scrollY={scrollSource} />
      <motion.div
        className="absolute inset-x-0 bottom-[8vh] h-[18vh]"
        style={{
          y: fogY,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(141,183,221,0.07) 45%, rgba(141,183,221,0.02) 100%)",
          filter: "blur(6px)",
        }}
      />
      <Ridge {...RIDGES[1]} mx={mxFinal} my={myFinal} scrollY={scrollSource} />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[12vh]"
        style={{
          y: fogY,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(182,210,234,0.06) 60%, rgba(182,210,234,0.03) 100%)",
          filter: "blur(8px)",
        }}
      />
      <Ridge {...RIDGES[2]} mx={mxFinal} my={myFinal} scrollY={scrollSource} snowcaps />
    </div>
  );
}

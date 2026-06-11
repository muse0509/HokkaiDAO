"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

/**
 * Perspective tilt that follows the cursor, with a glow spot driven by the
 * --mx/--my custom properties (see .tilt-glow in globals.css).
 * Static under reduced motion and for touch input.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 7,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 20 });
  const sy = useSpring(py, { stiffness: 180, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    px.set(nx);
    py.set(ny);
    ref.current.style.setProperty("--mx", `${nx * 100}%`);
    ref.current.style.setProperty("--my", `${ny * 100}%`);
  };

  const onPointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={
        reduced
          ? undefined
          : { rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 900 }
      }
      className={`tilt-glow relative ${className}`}
    >
      {children}
    </motion.div>
  );
}

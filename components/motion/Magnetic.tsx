"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

/**
 * Pulls its child gently toward the cursor while hovered, springs back on
 * leave. No-op under reduced motion and on touch devices (no pointermove).
 */
export function Magnetic({
  children,
  strength = 0.25,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

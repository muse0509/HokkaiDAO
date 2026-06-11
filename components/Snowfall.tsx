"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas snowfall with three depth bands: far flakes are small, dim, and
 * slow; near flakes are larger, brighter, faster, and react more to wind.
 * Respects prefers-reduced-motion (renders nothing), pauses when the tab is
 * hidden, and caps particle count by viewport size so mobile stays cheap.
 */
export function Snowfall({
  className = "",
  density = 1,
}: {
  className?: string;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let wind = 0;
    let windTarget = 0;
    let lastWindShift = 0;

    interface Flake {
      x: number;
      y: number;
      depth: number; // 0 far .. 1 near
      r: number;
      vy: number;
      o: number;
      sway: number;
    }
    let flakes: Flake[] = [];

    const makeFlake = (y?: number): Flake => {
      const depth = Math.random();
      return {
        x: Math.random() * width,
        y: y ?? Math.random() * height,
        depth,
        r: 0.5 + depth * 2.2,
        vy: 0.2 + depth * 0.85,
        o: 0.18 + depth * 0.55,
        sway: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.floor((width * height) / 18000) * density, 130);
      flakes = Array.from({ length: count }, () => makeFlake());
    };

    const tick = (t: number) => {
      // Wind shifts direction every few seconds, eased toward a target.
      if (t - lastWindShift > 5000) {
        windTarget = (Math.random() - 0.5) * 0.7;
        lastWindShift = t;
      }
      wind += (windTarget - wind) * 0.002;

      ctx.clearRect(0, 0, width, height);
      for (const f of flakes) {
        f.sway += 0.008 + f.depth * 0.01;
        f.y += f.vy;
        f.x += wind * (0.3 + f.depth) + Math.sin(f.sway) * (0.1 + f.depth * 0.25);
        if (f.y > height + 4) {
          Object.assign(f, makeFlake(-4));
        }
        if (f.x > width + 6) f.x = -6;
        if (f.x < -6) f.x = width + 6;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(222, 236, 248, ${f.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}

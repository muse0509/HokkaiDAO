"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight canvas snowfall. Respects prefers-reduced-motion (renders
 * nothing), pauses when the tab is hidden, and caps particle count by
 * viewport size so mobile stays cheap.
 */
export function Snowfall({ className = "" }: { className?: string }) {
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
    let flakes: { x: number; y: number; r: number; vy: number; vx: number; o: number }[] = [];

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

      const count = Math.min(Math.floor((width * height) / 22000), 90);
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.7,
        vy: 0.25 + Math.random() * 0.6,
        vx: -0.15 + Math.random() * 0.3,
        o: 0.25 + Math.random() * 0.5,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (const flake of flakes) {
        flake.y += flake.vy;
        flake.x += flake.vx + Math.sin(flake.y * 0.01) * 0.15;
        if (flake.y > height + 4) {
          flake.y = -4;
          flake.x = Math.random() * width;
        }
        if (flake.x > width + 4) flake.x = -4;
        if (flake.x < -4) flake.x = width + 4;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(222, 236, 248, ${flake.o})`;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}

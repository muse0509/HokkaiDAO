"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { TrackedLink } from "@/components/TrackedLink";

const NAV_ITEMS = [
  { href: "#concept", label: "Concept" },
  { href: "#format", label: "Format" },
  { href: "#room", label: "Room" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#status", label: "Status" },
  { href: "#sponsor", label: "Partner" },
];

/**
 * Top navigation bar. Fades in once the hero is scrolled past, tracks the
 * active section, and keeps a persistent "Request an invitation" CTA on every
 * screen size. Replaces the former left-hand vertical nav.
 */
export function TopNav() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(NAV_ITEMS[0].href);

  // Show the bar once the hero leaves the viewport.
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Scroll-spy: highlight whichever section is most in view.
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.querySelector<HTMLElement>(item.href),
    ).filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current?.target.id) setActive(`#${current.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Primary"
          initial={{ opacity: 0, y: reduced ? 0 : -18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -18 }}
          transition={{ duration: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
          className="fixed inset-x-0 top-0 z-40 border-b border-line bg-washi/85 backdrop-blur"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 sm:px-10">
            <a href="#hero" aria-label="ctsDAO — top" className="shrink-0">
              <Logo className="h-5" wordmarkClassName="text-base" />
            </a>

            <div className="hidden items-center md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative px-3 py-1.5 text-sm transition-colors duration-200 ${
                      isActive ? "text-sumi" : "text-ink-400 hover:text-sumi"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-px h-px bg-akane"
                        transition={{ duration: reduced ? 0 : 0.3, ease: [0.21, 0.6, 0.35, 1] }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            <TrackedLink
              href="/apply"
              event="interest_cta_clicked"
              eventProps={{ location: "top_nav" }}
              className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-sm bg-akane px-4 py-2 text-sm font-medium text-washi transition-colors duration-200 hover:bg-akane-deep"
            >
              Request an invitation
              <span aria-hidden="true">→</span>
            </TrackedLink>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

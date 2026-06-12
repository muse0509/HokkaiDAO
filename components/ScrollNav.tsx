"use client";

import { useEffect, useState } from "react";

const navItems = [
  { href: "#concept", label: "Concept", code: "01" },
  { href: "#format", label: "Format", code: "02" },
  { href: "#room", label: "Room", code: "03" },
  { href: "#sponsors", label: "Sponsors", code: "04" },
  { href: "#status", label: "Status", code: "05" },
  { href: "#interest", label: "Apply", code: "06" },
  { href: "#sponsor", label: "Partner", code: "07" },
];

function isHTMLElement(section: HTMLElement | null): section is HTMLElement {
  return section !== null;
}

export function ScrollNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(navItems[0].href);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.08 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter(isHTMLElement);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (current?.target.id) {
          setActive(`#${current.target.id}`);
        }
      },
      {
        rootMargin: "-42% 0px -48% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-5 top-1/2 z-50 hidden -translate-y-1/2 md:block"
    >
      <div className="side-nav-shell">
        <span className="side-nav-mark" aria-hidden="true">
          HKD
        </span>
        {navItems.map((item) => {
          const isActive = active === item.href;

          return (
            <a
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "location" : undefined}
              className={`side-nav-link ${isActive ? "is-active" : ""}`}
            >
              <span className="side-nav-dot" aria-hidden="true" />
              <span className="side-nav-code" aria-hidden="true">
                {item.code}
              </span>
              <span className="side-nav-en" aria-hidden="true">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

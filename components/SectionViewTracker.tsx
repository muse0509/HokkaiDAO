"use client";

import { useEffect, useRef } from "react";
import { track, type TrackEvent } from "@/lib/analytics";

/**
 * Fires a tracking event once when the wrapping section scrolls into view.
 * Render it inside the section; it observes its parent element.
 */
export function SectionViewTracker({ event }: { event: TrackEvent }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const target = ref.current?.parentElement;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !fired.current) {
          fired.current = true;
          track(event);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [event]);

  return <span ref={ref} aria-hidden="true" className="hidden" />;
}

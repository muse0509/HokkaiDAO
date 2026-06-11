"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track, type TrackEvent } from "@/lib/analytics";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  event: TrackEvent;
  eventProps?: Record<string, unknown>;
  children: ReactNode;
}

export function TrackedLink({ event, eventProps, children, onClick, ...rest }: TrackedLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, eventProps);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}

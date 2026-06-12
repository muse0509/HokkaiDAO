"use client";

/**
 * Tiny tracking helper. Behavior:
 *  - always logs to console in development
 *  - forwards to GA (gtag) if NEXT_PUBLIC_GA_ID is set and consent was given
 *  - forwards to PostHog via its HTTP capture endpoint if configured
 *  - silently no-ops when nothing is configured
 *
 * Analytics must never be required for the page to function.
 */

export type TrackEvent =
  | "page_view"
  | "hero_view"
  | "concept_view"
  | "format_view"
  | "sponsors_view"
  | "form_view"
  | "interest_cta_clicked"
  | "sponsor_cta_clicked"
  | "x_link_clicked"
  | "email_clicked"
  | "interest_form_started"
  | "interest_form_submitted"
  | "interest_form_failed"
  | "attribution_cookie_set"
  | "attribution_cookie_missing";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export const ANALYTICS_CONFIGURED = Boolean(GA_ID || POSTHOG_KEY);

export const CONSENT_COOKIE = "hkd_consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type ConsentValue = "granted" | "denied" | null;

const consentListeners = new Set<() => void>();

export function getConsent(): ConsentValue {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)hkd_consent=(granted|denied)/);
  return (match?.[1] as "granted" | "denied") ?? null;
}

export function setConsent(value: "granted" | "denied") {
  if (typeof document === "undefined") return;
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  for (const listener of consentListeners) listener();
}

/** Subscribe/snapshot pair for useSyncExternalStore. */
export function subscribeConsent(listener: () => void): () => void {
  consentListeners.add(listener);
  return () => consentListeners.delete(listener);
}

function posthogDistinctId(): string {
  try {
    const key = "hkd_ph_id";
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

export function track(event: TrackEvent, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV === "development") {
    console.debug(`[track] ${event}`, props);
  }

  if (!ANALYTICS_CONFIGURED || getConsent() !== "granted") return;

  try {
    if (GA_ID && typeof window.gtag === "function") {
      window.gtag("event", event, props);
    }

    if (POSTHOG_KEY) {
      const payload = {
        api_key: POSTHOG_KEY,
        event,
        distinct_id: posthogDistinctId(),
        properties: {
          ...props,
          $current_url: window.location.href,
          $pathname: window.location.pathname,
          $referrer: document.referrer,
        },
        timestamp: new Date().toISOString(),
      };
      const url = `${POSTHOG_HOST.replace(/\/$/, "")}/capture/`;
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    }
  } catch {
    // Tracking must never throw into the UI.
  }
}

/** Read the attribution cookie on the client (maintained by captureAttributionClient). */
export function readAttributionCookie(): Record<string, string> | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)hkd_attr=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

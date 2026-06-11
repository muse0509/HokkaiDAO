"use client";

import { useEffect, useSyncExternalStore } from "react";
import Script from "next/script";
import {
  ANALYTICS_CONFIGURED,
  GA_ID,
  getConsent,
  readAttributionCookie,
  setConsent,
  subscribeConsent,
  track,
} from "@/lib/analytics";

function useConsent() {
  return useSyncExternalStore(subscribeConsent, getConsent, () => null);
}

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Fires page_view + attribution debug events on load, and renders the
 * consent banner / GA loader only when analytics is actually configured.
 */
export function AnalyticsBootstrap() {
  const consent = useConsent();
  const hydrated = useHydrated();

  useEffect(() => {
    const attribution = readAttributionCookie();
    if (attribution) {
      track("attribution_cookie_set", {
        utm_source: attribution.utm_source,
        ref: attribution.ref,
        sponsor: attribution.sponsor,
        invite: attribution.invite,
      });
    } else {
      track("attribution_cookie_missing");
    }
    track("page_view", { path: window.location.pathname });
  }, []);

  const choose = (value: "granted" | "denied") => {
    setConsent(value);
    if (value === "granted") {
      track("page_view", { path: window.location.pathname, consent: "granted" });
    }
  };

  const bannerVisible = hydrated && ANALYTICS_CONFIGURED && consent === null;

  return (
    <>
      {GA_ID && consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {bannerVisible && (
        <div
          role="dialog"
          aria-label="Cookie notice"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-lg border hairline bg-night-800/95 p-4 shadow-2xl backdrop-blur sm:flex sm:items-center sm:gap-4"
        >
          <p className="text-sm text-ice-300">
            We use optional analytics cookies to understand interest in
            HokkaiDAO. First-party attribution for the interest form works
            either way.
          </p>
          <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
            <button
              onClick={() => choose("granted")}
              className="rounded-md bg-ice-200 px-3 py-1.5 text-sm font-medium text-night-900 transition hover:bg-ice-100"
            >
              Allow
            </button>
            <button
              onClick={() => choose("denied")}
              className="rounded-md border hairline px-3 py-1.5 text-sm text-ice-300 transition hover:text-ice-100"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}

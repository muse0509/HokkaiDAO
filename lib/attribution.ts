/**
 * First-party attribution cookie.
 *
 * Captured by `proxy.ts` on every request: first-touch fields are written once
 * and preserved; last-touch fields are refreshed on subsequent visits. The
 * cookie is strictly first-party, contains no identifiers beyond what the
 * visitor's own URL carried, and expires after 90 days.
 */

export const ATTRIBUTION_COOKIE = "hkd_attr";
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

/** Query params we capture for attribution, in priority order. */
export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
  "sponsor",
  "invite",
  "source",
] as const;

export type AttributionParam = (typeof ATTRIBUTION_PARAMS)[number];

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  ref?: string;
  sponsor?: string;
  invite?: string;
  source?: string;
  landing_path?: string;
  first_referrer?: string;
  first_landing_url?: string;
  first_seen_at?: string;
  last_seen_at?: string;
  last_landing_path?: string;
}

const MAX_FIELD_LENGTH = 200;

function clean(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, MAX_FIELD_LENGTH);
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseAttributionCookie(raw: string | undefined): Attribution | null {
  if (!raw) return null;
  try {
    // Server-side cookie APIs hand us the decoded JSON; document.cookie on
    // the client is still percent-encoded, so fall back to decoding.
    let json = raw;
    if (!raw.trimStart().startsWith("{")) {
      json = decodeURIComponent(raw);
    }
    const parsed = JSON.parse(json);
    if (typeof parsed !== "object" || parsed === null) return null;
    const out: Attribution = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string") {
        (out as Record<string, string | undefined>)[key] = clean(value);
      }
    }
    return out;
  } catch {
    return null;
  }
}

// NextResponse.cookies.set percent-encodes the value itself, so we hand it
// plain JSON and let the platform handle encoding.
export function serializeAttributionCookie(attr: Attribution): string {
  return JSON.stringify(attr);
}

/**
 * Merge an incoming request into the existing attribution state.
 * Returns the next cookie value, or null if nothing needs to be written.
 */
export function buildAttribution(opts: {
  existing: Attribution | null;
  url: URL;
  referrer: string | null;
  now?: Date;
  defaultUtmSource?: string;
}): Attribution | null {
  const { existing, url, referrer } = opts;
  const now = (opts.now ?? new Date()).toISOString();

  const incoming: Partial<Record<AttributionParam, string>> = {};
  for (const param of ATTRIBUTION_PARAMS) {
    const value = clean(url.searchParams.get(param));
    if (value) incoming[param] = value;
  }

  const hasIncomingParams = Object.keys(incoming).length > 0;

  if (!existing) {
    // First touch: record everything we know about this visit.
    const attr: Attribution = {
      ...incoming,
      landing_path: clean(url.pathname) ?? "/",
      first_referrer: clean(referrer) ?? "",
      first_landing_url: clean(url.pathname + url.search) ?? "/",
      first_seen_at: now,
      last_seen_at: now,
    };
    if (!attr.utm_source && opts.defaultUtmSource) {
      attr.utm_source = clean(opts.defaultUtmSource);
    }
    return attr;
  }

  // Returning visitor: preserve first-touch fields, refresh last-touch.
  const next: Attribution = { ...existing, last_seen_at: now };
  if (hasIncomingParams) {
    // Only fill params that were never set (first-touch attribution wins),
    // but keep the latest values in dedicated last-touch storage.
    for (const param of ATTRIBUTION_PARAMS) {
      if (incoming[param] && !existing[param]) next[param] = incoming[param];
    }
    next.last_landing_path = clean(url.pathname + url.search);
  }
  return next;
}

/**
 * Client-side attribution capture. On a fully static site there is no server
 * middleware, so the browser maintains the first-party `hkd_attr` cookie:
 * read the current value, merge this visit, write it back (90 days, readable
 * by JS so the form can attach it). No-op outside the browser, and never
 * throws into page load.
 */
export function captureAttributionClient(): Attribution | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(/(?:^|;\s*)hkd_attr=([^;]+)/);
    const existing = parseAttributionCookie(match?.[1]);
    const next = buildAttribution({
      existing,
      url: new URL(window.location.href),
      referrer: document.referrer || null,
      defaultUtmSource: process.env.NEXT_PUBLIC_DEFAULT_UTM_SOURCE,
    });
    if (next) {
      const value = encodeURIComponent(serializeAttributionCookie(next));
      const secure = window.location.protocol === "https:" ? "; secure" : "";
      document.cookie = `${ATTRIBUTION_COOKIE}=${value}; path=/; max-age=${ATTRIBUTION_MAX_AGE}; samesite=lax${secure}`;
    }
    return next ?? existing;
  } catch {
    return null;
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE,
  buildAttribution,
  parseAttributionCookie,
  serializeAttributionCookie,
} from "@/lib/attribution";

/**
 * Captures first-party attribution (UTM / ref / sponsor / invite) into a
 * 90-day cookie on every page view. First-touch fields are preserved;
 * last-touch metadata is refreshed. If cookies are disabled this is a no-op
 * and the site keeps working.
 */
export default function proxy(request: NextRequest) {
  const response = NextResponse.next();

  try {
    const existing = parseAttributionCookie(
      request.cookies.get(ATTRIBUTION_COOKIE)?.value,
    );
    const next = buildAttribution({
      existing,
      url: request.nextUrl,
      referrer: request.headers.get("referer"),
      defaultUtmSource: process.env.NEXT_PUBLIC_DEFAULT_UTM_SOURCE,
    });
    if (next) {
      response.cookies.set(ATTRIBUTION_COOKIE, serializeAttributionCookie(next), {
        maxAge: ATTRIBUTION_MAX_AGE,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        // Readable by the client so the form and analytics can attach it.
        httpOnly: false,
      });
    }
  } catch {
    // Attribution must never break a page load.
  }

  return response;
}

export const config = {
  matcher: [
    // Run on pages only — skip API routes, static assets, and internals.
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|xml|woff2?)).*)",
  ],
};

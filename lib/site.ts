/** Server-side site configuration derived from environment variables. */

// Single source of truth for the project's X account: @cts_dao
// (https://x.com/cts_dao). Override via the CONTACT_X_HANDLE env var if needed.
// Every CTA reads from siteConfig.contactXHandle / xProfileUrl — never hardcode
// the handle anywhere else.
const X_HANDLE = (process.env.CONTACT_X_HANDLE || "@cts_dao").replace(/^@?/, "@");

export const siteConfig = {
  name: "ctsDAO",
  title: "ctsDAO — A Winter Residency for Builders in Japan",
  description:
    "A two-week Solana builder residency in Sapporo, Japan. Quiet, focused, application-only. Work, powder, and demo with 50–100 curated builders in March 2027.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  contactEmail: process.env.CONTACT_EMAIL || "hokkai_dao@proton.me",
  contactXHandle: X_HANDLE,
  formEnabled: process.env.NEXT_PUBLIC_FORM_ENABLED !== "false",
  formFallbackUrl: process.env.INTEREST_FORM_FALLBACK_URL || "",
  /** Route of the standalone interest/application form. */
  applyPath: "/apply",
};

export const xProfileUrl = `https://x.com/${siteConfig.contactXHandle.slice(1)}`;

/** Server-side site configuration derived from environment variables. */

export const siteConfig = {
  name: "HokkaiDAO",
  title: "HokkaiDAO — Asia's First Web3 Winter Builder Retreat",
  description:
    "A two-week Solana builder retreat in Sapporo, Japan. Work, powder, and demo with 50–100 curated builders in March 2027.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  contactEmail: process.env.CONTACT_EMAIL || "hokkai_dao@proton.me",
  contactXHandle: (process.env.CONTACT_X_HANDLE || "@Hokkai_dao").replace(/^@?/, "@"),
  formEnabled: process.env.NEXT_PUBLIC_FORM_ENABLED !== "false",
  formFallbackUrl: process.env.INTEREST_FORM_FALLBACK_URL || "",
};

export const xProfileUrl = `https://x.com/${siteConfig.contactXHandle.slice(1)}`;

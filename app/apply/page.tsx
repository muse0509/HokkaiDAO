import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { FollowX } from "@/components/apply/FollowX";
import { ApplyForm } from "@/components/apply/ApplyForm";

export const metadata: Metadata = {
  title: "Request an invitation — ctsDAO",
  description:
    "Apply to ctsDAO, a winter residency in Japan for global crypto builders. Sapporo, March 2027. Application-only and curated.",
  alternates: { canonical: "/apply" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/apply`,
    siteName: siteConfig.name,
    title: "Request an invitation — ctsDAO",
    description:
      "A winter residency in Japan for global crypto builders. Sapporo, March 2027.",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function ApplyPage() {
  return (
    <main className="min-h-svh bg-washi">
      {/* Top bar: logo + back to site. */}
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-8 sm:px-10">
        <Link href="/" aria-label="ctsDAO home">
          <Logo className="h-6" wordmarkClassName="text-xl" />
        </Link>
        <Link
          href="/"
          className="mono-label transition-colors hover:text-sumi"
        >
          ← Back
        </Link>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 pb-28 pt-20 sm:px-10 sm:pt-28">
        {/* Intro. */}
        <h1 className="text-[clamp(2.4rem,6vw,4rem)] font-light leading-[1.06] tracking-[-0.02em] text-sumi">
          Request an <span className="text-akane">invitation</span>.
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-500">
          ctsDAO is a winter residency in Japan for global crypto builders. Tell
          us who you are, what you&apos;re building, and how you&apos;d like to be
          involved.
        </p>

        {/* Top X CTA — follow even if not ready to apply. */}
        <div className="mt-10">
          <FollowX label="Follow ctsDAO on X" location="apply_top" />
        </div>

        {/* The form. */}
        <div className="mt-20">
          <ApplyForm
            formEnabled={siteConfig.formEnabled}
            fallbackUrl={siteConfig.formFallbackUrl}
          />
        </div>

        {/* Bottom X CTA — useful while details are still early. */}
        <div className="mt-20 border-t border-line pt-10">
          <p className="mb-4 text-ink-400">Not ready yet?</p>
          <FollowX
            block
            label="Follow for 2027 updates"
            sublabel="Winter residency news as dates, venue, and partners are confirmed."
            location="apply_bottom"
          />
        </div>
      </div>
    </main>
  );
}

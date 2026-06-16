import { TrackedLink } from "@/components/TrackedLink";
import { siteConfig, xProfileUrl } from "@/lib/site";

/**
 * "Follow on X" CTA. Reads the handle/URL from siteConfig (single source of
 * truth — never hardcode the handle). Two shapes: a compact inline button and
 * a wider block used at the foot of the form page.
 */
export function FollowX({
  label,
  sublabel,
  location,
  block = false,
}: {
  label: string;
  sublabel?: string;
  location: string;
  block?: boolean;
}) {
  if (block) {
    return (
      <TrackedLink
        href={xProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        event="x_link_clicked"
        eventProps={{ location }}
        className="group flex items-center justify-between gap-6 rounded border border-line bg-washi px-6 py-5 transition-colors duration-200 hover:border-sumi/25"
      >
        <span>
          <span className="block text-sumi">{label}</span>
          {sublabel && (
            <span className="mt-1 block text-sm text-ink-400">{sublabel}</span>
          )}
        </span>
        <span className="num shrink-0 text-sm text-akane transition-transform duration-200 group-hover:translate-x-0.5">
          {siteConfig.contactXHandle} →
        </span>
      </TrackedLink>
    );
  }

  return (
    <TrackedLink
      href={xProfileUrl}
      target="_blank"
      rel="noopener noreferrer"
      event="x_link_clicked"
      eventProps={{ location }}
      className="group inline-flex items-center gap-2 rounded-sm border border-line px-5 py-2.5 text-sm text-sumi transition-colors duration-200 hover:border-sumi/30"
    >
      {label}
      <span className="num text-akane">{siteConfig.contactXHandle}</span>
      <span
        aria-hidden="true"
        className="text-akane transition-transform duration-200 group-hover:translate-x-0.5"
      >
        →
      </span>
    </TrackedLink>
  );
}

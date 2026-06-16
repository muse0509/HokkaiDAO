import { TrackedLink } from "@/components/TrackedLink";
import { Logo } from "@/components/Logo";

export function Footer({
  contactEmail,
  contactXHandle,
  xUrl,
}: {
  contactEmail: string;
  contactXHandle: string;
  xUrl: string;
}) {
  return (
    <footer className="border-t hairline bg-washi py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:px-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo className="h-6" wordmarkClassName="text-lg" />
          <p className="mt-4 text-sm text-ink-500">Sapporo, Hokkaido</p>
          <p className="text-sm text-ink-400">Winter 2027 · Application-only</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <a href="#concept" className="text-ink-500 transition-colors hover:text-sumi">
            Concept
          </a>
          <a href="#sponsors" className="text-ink-500 transition-colors hover:text-sumi">
            Sponsors
          </a>
          <a href="/apply" className="text-ink-500 transition-colors hover:text-sumi">
            Apply
          </a>
          <TrackedLink
            href={`mailto:${contactEmail}`}
            event="email_clicked"
            eventProps={{ location: "footer" }}
            className="text-ink-500 transition-colors hover:text-akane"
          >
            {contactEmail}
          </TrackedLink>
          <TrackedLink
            href={xUrl}
            target="_blank"
            rel="noopener noreferrer"
            event="x_link_clicked"
            eventProps={{ location: "footer" }}
            className="text-ink-500 transition-colors hover:text-akane"
          >
            {contactXHandle}
          </TrackedLink>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-6 sm:px-10">
        <p className="text-xs leading-relaxed text-ink-400">
          ctsDAO is an independent community event inspired by the spirit of
          mtnDAO. It is not affiliated with or endorsed by mtnDAO or the Solana
          Foundation. Dates, venue, and partners are in planning and subject to
          change.
        </p>
      </div>
    </footer>
  );
}

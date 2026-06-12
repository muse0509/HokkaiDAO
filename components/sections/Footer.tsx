import { TrackedLink } from "@/components/TrackedLink";

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
    <footer className="border-t hairline bg-night-950 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:px-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-lg text-ice-100">HokkaiDAO</p>
          <p className="mono-label mt-2">
            Sapporo, Japan / March 2027 / Application-only
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <a href="#concept" className="text-ice-400 transition-colors hover:text-ice-100">
            Concept
          </a>
          <a href="#sponsors" className="text-ice-400 transition-colors hover:text-ice-100">
            Sponsors
          </a>
          <a href="#interest" className="text-ice-400 transition-colors hover:text-ice-100">
            Interest list
          </a>
          <TrackedLink
            href={`mailto:${contactEmail}`}
            event="email_clicked"
            eventProps={{ location: "footer" }}
            className="text-ice-400 transition-colors hover:text-ice-100"
          >
            {contactEmail}
          </TrackedLink>
          <TrackedLink
            href={xUrl}
            target="_blank"
            rel="noopener noreferrer"
            event="x_link_clicked"
            eventProps={{ location: "footer" }}
            className="text-ice-400 transition-colors hover:text-ice-100"
          >
            {contactXHandle}
          </TrackedLink>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-6 sm:px-10">
        <p className="text-xs leading-relaxed text-ice-500/80">
          HokkaiDAO is an independent community event inspired by the spirit of
          mtnDAO. It is not affiliated with or endorsed by mtnDAO or the Solana
          Foundation. Dates, venue, and partners are in planning and subject to
          change.
        </p>
      </div>
    </footer>
  );
}

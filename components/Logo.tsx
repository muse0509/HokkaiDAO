/**
 * ctsDAO logo lockup — the official mark from /public.
 *
 * Belongs on a solid Washi White background with generous clear space; never
 * recolored, stretched, rotated, or placed over imagery. Set the height on the
 * parent (e.g. `className="h-6"`) and the mark scales to it.
 */
export function Logo({
  src = "/ctsdaohero.png",
  className = "",
}: {
  src?: string;
  className?: string;
  /** Accepted for call-site compatibility; no longer used. */
  wordmarkClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Plain <img>: static export, unoptimized images, height-driven sizing. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="ctsDAO"
        className="block h-full w-auto select-none"
        draggable={false}
      />
    </span>
  );
}

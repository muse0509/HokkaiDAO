import { Reveal } from "@/components/Reveal";

export function SectionHeading({
  label,
  sub,
  title,
  className = "",
}: {
  label: string;
  sub?: string;
  title: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <p className="mono-label">
        {label}
        {sub && (
          <>
            <span aria-hidden="true" className="mx-2 text-ice-500/40">
              /
            </span>
            {sub}
          </>
        )}
      </p>
      <h2 className="mt-5 max-w-2xl text-3xl text-ice-100 sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}

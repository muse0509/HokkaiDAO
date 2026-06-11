import { Reveal } from "@/components/Reveal";

export function SectionHeading({
  index,
  label,
  title,
  className = "",
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <p className="mono-label flex items-center gap-3">
        <span className="text-gold">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-ice-500/30" />
        {label}
      </p>
      <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-ice-100 sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}

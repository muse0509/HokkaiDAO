import { Reveal } from "@/components/Reveal";

export function SectionHeading({
  title,
  className = "",
}: {
  // label/sub are accepted for call-site compatibility but no longer rendered —
  // the mono section-marker eyebrows were removed for a calmer, more spacious feel.
  label?: string;
  sub?: string;
  title: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <h2 className="max-w-2xl text-3xl font-light leading-[1.12] tracking-[-0.018em] text-sumi sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}

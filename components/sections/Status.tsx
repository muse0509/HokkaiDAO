import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const STATUS_ITEMS = [
  { label: "Date", value: "Planned for March 2027, Sapporo", state: "planned" },
  { label: "Venue", value: "Candidate under discussion", state: "in progress" },
  { label: "Sponsors", value: "Conversations in progress", state: "in progress" },
  { label: "Interest list", value: "Opening now", state: "live" },
  { label: "Details", value: "More as partners are confirmed", state: "upcoming" },
];

export function Status() {
  return (
    <section id="status" className="relative border-t hairline bg-night-950 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          index="07"
          label="Current status"
          title={
            <>
              Where things stand,{" "}
              <span className="serif-accent text-ice-300">honestly.</span>
            </>
          }
        />

        <Reveal delay={0.1} className="mt-14">
          <ul className="divide-y divide-ice-500/10 border-y hairline">
            {STATUS_ITEMS.map((item) => (
              <li
                key={item.label}
                className="grid grid-cols-[7rem_1fr_auto] items-baseline gap-4 py-5 sm:grid-cols-[10rem_1fr_auto]"
              >
                <span className="mono-label">{item.label}</span>
                <span className="text-ice-200">{item.value}</span>
                <span
                  className={`mono-label flex items-center gap-2 ${
                    item.state === "live" ? "text-cyan-soft" : "text-ice-500"
                  }`}
                >
                  {item.state === "live" && (
                    <span aria-hidden="true" className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-cyan-soft" />
                  )}
                  {item.state}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-sm text-ice-500">
            We&apos;d rather under-promise. Nothing above is final until it&apos;s
            confirmed — and when it is, you&apos;ll hear it here first.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

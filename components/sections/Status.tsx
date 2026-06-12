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
          label="Current status"
          sub="updated honestly"
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
                className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 py-5 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline"
              >
                <span className="mono-label">{item.label}</span>
                <span className="col-span-2 text-ice-200 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                  {item.value}
                </span>
                <span
                  className={`mono-label col-start-2 row-start-1 flex items-center gap-2 justify-self-end sm:col-start-3 ${
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
            confirmed, and when it is, you&apos;ll hear it here first.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

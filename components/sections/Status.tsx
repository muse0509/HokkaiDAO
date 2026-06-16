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
    <section id="status" className="relative flex min-h-svh flex-col justify-center border-t hairline bg-washi py-24">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <SectionHeading
          title={
            <>
              Where things stand,{" "}
              <span className="text-ink-400">honestly.</span>
            </>
          }
        />

        <Reveal delay={0.1} className="mt-14">
          <ul className="divide-y divide-line border-y border-line">
            {STATUS_ITEMS.map((item) => (
              <li
                key={item.label}
                className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 py-5 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline"
              >
                <span className="mono-label">{item.label}</span>
                <span className="col-span-2 text-ink-700 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                  {item.value}
                </span>
                <span
                  className={`mono-label col-start-2 row-start-1 flex items-center gap-2 justify-self-end sm:col-start-3 ${
                    item.state === "live" ? "text-akane" : "text-ink-400"
                  }`}
                >
                  {item.state === "live" && (
                    <span aria-hidden="true" className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-akane" />
                  )}
                  {item.state}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-sm text-ink-400">
            We&apos;d rather under-promise. Nothing above is final until it&apos;s
            confirmed, and when it is, you&apos;ll hear it here first.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

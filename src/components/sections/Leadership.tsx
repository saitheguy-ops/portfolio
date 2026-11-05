import { leadership, skills } from "@/content";
import SectionHeader from "../SectionHeader";
import { Reveal } from "../motion/Reveal";

function Ledger({ title, rows }: { title: string; rows: { title: string; detail: string }[] }) {
  return (
    <div>
      <h3 className="label mb-4">{title}</h3>
      <ul className="border-t border-line">
        {rows.map((r, i) => (
          <Reveal
            as="li"
            key={r.title}
            delay={i * 0.05}
            y={12}
            className="flex items-baseline gap-4 border-b border-line py-4"
          >
            <span className="text-[1.0625rem] text-ink">{r.title}</span>
            <span aria-hidden="true" className="min-w-6 flex-1 translate-y-[-0.25em] border-b border-dotted border-line-strong" />
            <span className="text-right font-mono text-xs text-muted">{r.detail}</span>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

export default function Leadership() {
  return (
    <>
      <section
        id="leadership"
        data-readout="leadership"
        aria-labelledby="leadership-title"
        className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
      >
        <SectionHeader index="05" label="Leadership" title={leadership.heading} id="leadership-title" />
        <div className="mt-14 grid gap-12 md:grid-cols-2 lg:ml-[25%] lg:mt-16 lg:gap-16">
          <Ledger title="Roles" rows={leadership.roles} />
          <Ledger title="Honors" rows={leadership.honors} />
        </div>
      </section>

      <section
        id="skills"
        data-readout="skills"
        aria-labelledby="skills-title"
        className="mx-auto max-w-[90rem] px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12"
      >
        <div className="grid gap-6 border-t border-line pt-12 lg:grid-cols-12 lg:gap-8">
          <h2 id="skills-title" className="label flex items-center gap-3 lg:col-span-3">
            <span className="text-accent">06</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
            {skills.heading}
          </h2>
          <Reveal className="lg:col-span-9">
            <dl className="grid gap-4 font-mono text-sm">
              {skills.groups.map((g) => (
                <div key={g.label} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-6">
                  <dt className="text-muted">{g.label}</dt>
                  <dd>
                    <ul className="flex flex-wrap leading-7 text-ink-soft">
                      {g.items.map((item, i) => (
                        <li key={item} className="whitespace-nowrap">
                          {item}
                          {i < g.items.length - 1 ? (
                            <span className="px-2.5 text-line-strong" aria-hidden="true">
                              ·
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}

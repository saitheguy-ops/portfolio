import { research } from "@/content";
import ResearchFigure from "../ResearchFigure";
import SectionHeader from "../SectionHeader";
import { Reveal } from "../motion/Reveal";

export default function Research() {
  return (
    <section
      id="research"
      data-readout={research[0]?.id}
      aria-labelledby="research-title"
      className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      <SectionHeader
        index="04"
        label="Research"
        title="Measuring things that move faster."
        id="research-title"
      />

      <div className="mt-14 grid gap-6 lg:mt-20">
        {research.map((r) => (
          <article
            key={r.id}
            data-readout={r.id}
            aria-labelledby={`research-${r.id}`}
            className="grid gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:gap-8 lg:pt-14 [&:not(:first-child)]:mt-10"
          >
            <Reveal className="lg:col-span-3">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted tabular">
                {r.dates}
              </p>
              <p className="label mt-3 !text-ink-soft">{r.org}</p>
              <p className="mt-1 text-sm text-muted">{r.role}</p>
              <p className="display mt-8 text-[clamp(2.5rem,4.4vw,4rem)] text-accent">
                {r.readout.label}
              </p>
              <p className="mt-2 font-mono text-[0.6875rem] text-muted">{r.readout.caption}</p>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-5">
              <h3 id={`research-${r.id}`} className="display text-[clamp(1.9rem,3vw,2.75rem)]">
                {r.title}
              </h3>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft">{r.description}</p>
              <ul className="mt-6 grid gap-2.5">
                {r.details.map((d) => (
                  <li key={d} className="flex gap-3 font-mono text-xs text-ink-soft">
                    <span aria-hidden="true" className="text-accent">
                      →
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
              {r.advisors ? <p className="mt-6 text-sm italic text-muted">{r.advisors}</p> : null}
            </Reveal>

            <Reveal
              delay={0.16}
              className="frame-marks self-start border border-line bg-bg-raised/50 p-4 lg:col-span-4"
            >
              <ResearchFigure kind={r.figure} />
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  );
}

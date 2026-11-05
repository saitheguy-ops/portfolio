import { experience, experienceStats } from "@/content";
import Counter from "../motion/Counter";
import { Reveal } from "../motion/Reveal";
import SectionHeader from "../SectionHeader";

export default function Experience() {
  return (
    <section
      id="experience"
      data-readout={experience[0]?.id}
      aria-labelledby="experience-title"
      className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      <SectionHeader index="02" label="Experience" title="Work that ships." id="experience-title" />

      <ol className="mt-14 border-t border-line lg:mt-20">
        {experience.map((job, i) => (
          <li
            key={job.id}
            data-readout={job.id}
            className="grid gap-6 border-b border-line py-12 lg:grid-cols-12 lg:gap-8 lg:py-16"
          >
            <Reveal className="lg:col-span-3">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted tabular">
                {job.dates}
              </p>
              <p className="mt-3 font-mono text-[0.6875rem] text-accent">{job.readout.label}</p>
            </Reveal>

            <div className="lg:col-span-9">
              <Reveal delay={0.05}>
                <p className="label !text-ink-soft">{job.org}</p>
                <h3 className="display mt-3 text-[clamp(2rem,4vw,3.25rem)]">{job.role}</h3>
                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft">{job.summary}</p>
              </Reveal>

              <ul className="mt-8 grid max-w-3xl gap-4">
                {job.bullets.map((b, j) => (
                  <Reveal
                    as="li"
                    key={j}
                    delay={0.1 + j * 0.06}
                    y={16}
                    className="flex gap-4 leading-relaxed text-ink-soft"
                  >
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-5 shrink-0 bg-accent" />
                    <span>{b}</span>
                  </Reveal>
                ))}
              </ul>

              {i === 0 ? (
                <dl className="mt-12 grid grid-cols-1 border-y border-line sm:grid-cols-3">
                  {experienceStats.map((s, j) => (
                    <div
                      key={s.label}
                      className={`flex flex-col-reverse py-6 sm:px-6 ${j > 0 ? "border-t border-line sm:border-l sm:border-t-0" : "sm:pl-0"}`}
                    >
                      <dt className="label mt-2">{s.label}</dt>
                      <dd className="display text-[clamp(2.75rem,5vw,4.25rem)] text-ink">
                        <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {job.note ? (
                <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.6875rem] text-muted">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
                  {job.note}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

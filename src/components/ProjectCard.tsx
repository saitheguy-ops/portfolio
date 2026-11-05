import type { Project } from "@/content";
import Counter from "./motion/Counter";
import SafeImage from "./SafeImage";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden="true" fill="none">
      <path d="M3 9 L9 3 M4 3 H9 V8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export default function ProjectCard({
  project,
  index,
  total,
  imageClassName = "",
}: {
  project: Project;
  index: number;
  total: number;
  imageClassName?: string;
}) {
  const p = project;
  const hasLinks = Boolean(p.links.code || p.links.live);

  return (
    <article
      data-readout={p.id}
      aria-labelledby={`project-${p.id}`}
      className="group/card flex h-full flex-col"
    >
      <div className="mb-4 flex items-center justify-between font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
        <span className="tabular">
          P/{String(index + 1).padStart(2, "0")}
          <span className="text-line-strong"> / {String(total).padStart(2, "0")}</span>
        </span>
        <span className="text-accent">{p.scale}</span>
      </div>

      <div className="frame-marks relative">
        <SafeImage
          src={p.image.src}
          alt={p.image.alt}
          width={1600}
          height={1000}
          className={imageClassName}
          imgClassName="object-top transition-transform duration-[1.2s] ease-out-expo group-hover/card:scale-[1.03]"
        />
        {p.inset ? (
          <div className="absolute bottom-3 right-3 w-[34%] border border-line-strong shadow-2xl shadow-black/40">
            <SafeImage src={p.inset.src} alt={p.inset.alt} width={900} height={560} />
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <p className="label">{p.kicker}</p>
        <h3 id={`project-${p.id}`} className="display mt-2 text-[clamp(1.9rem,2.6vw,2.6rem)]">
          {p.title}
        </h3>
        <p className="mt-3 max-w-[38rem] text-[0.975rem] leading-relaxed text-ink-soft">
          {p.description}
        </p>

        {p.stats ? (
          <dl className="mt-5 flex gap-8">
            {p.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="label mt-1">{s.label}</dt>
                <dd className="display text-4xl text-ink">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} duration={1.4} />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pt-6">
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {p.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.625rem] text-muted"
              >
                {t}
              </li>
            ))}
          </ul>

          {hasLinks ? (
            <div className="flex gap-2">
              {p.links.code ? (
                <a
                  href={p.links.code}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title}: code on GitHub`}
                  className="btn"
                >
                  Code <ArrowIcon />
                </a>
              ) : null}
              {p.links.live ? (
                <a
                  href={p.links.live}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title}: live site`}
                  className="btn btn-accent"
                >
                  Live <ArrowIcon />
                </a>
              ) : null}
            </div>
          ) : p.codeNote ? (
            <p className="flex items-center gap-2 font-mono text-[0.6875rem] text-muted">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
              {p.codeNote}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

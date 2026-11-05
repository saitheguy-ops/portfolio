import { SplitText } from "./motion/Reveal";

export default function SectionHeader({
  index,
  label,
  title,
  id,
  aside,
}: {
  index: string;
  label: string;
  title: string;
  id: string;
  aside?: React.ReactNode;
}) {
  return (
    <header className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <p className="label flex items-center gap-3 lg:col-span-3 lg:pt-4">
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        {label}
      </p>
      <h2 id={id} className="display text-[clamp(2.5rem,6vw,5.25rem)] text-ink lg:col-span-9">
        <SplitText text={title} />
      </h2>
      {aside ? <div className="lg:col-span-9 lg:col-start-4">{aside}</div> : null}
    </header>
  );
}

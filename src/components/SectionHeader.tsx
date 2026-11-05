import { SplitText } from "./motion/Reveal";

/**
 * Section heading: index + label on the left, serif title on the right.
 * Uses a container query, so it also fits narrow panels (the pinned
 * projects intro) without a separate layout.
 */
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
    <div className="@container">
      <header className="grid gap-6 @4xl:grid-cols-12 @4xl:gap-8">
        <p className="label flex items-center gap-3 @4xl:col-span-3 @4xl:pt-4">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          {label}
        </p>
        <h2
          id={id}
          className="display text-[clamp(2.5rem,8.5cqi,5.25rem)] text-ink @4xl:col-span-9"
        >
          <SplitText text={title} />
        </h2>
        {aside ? <div className="@4xl:col-span-9 @4xl:col-start-4">{aside}</div> : null}
      </header>
    </div>
  );
}

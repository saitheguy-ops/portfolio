import { hero, site } from "@/content";

export default function Home() {
  return (
    <main id="main" className="px-5 py-24 sm:px-10">
      <p className="label">{hero.eyebrow}</p>
      <h1 className="display mt-4 text-6xl sm:text-8xl">{site.name}</h1>
      <p className="mt-6 max-w-xl text-lg text-ink-soft">{hero.line}</p>
      <p className="mt-10 font-mono text-sm text-accent">{hero.readout.label}</p>
    </main>
  );
}

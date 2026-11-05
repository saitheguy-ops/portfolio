"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Pin only where there is room for a full card and motion is welcome.
const PIN_QUERY =
  "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Desktop: the section pins and the cards scroll sideways as you scroll down.
 * Mobile, short screens and reduced motion: a plain vertical stack.
 */
export default function ProjectsTrack({
  intro,
  cards,
}: {
  intro: React.ReactNode;
  cards: React.ReactNode[];
}) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!pinned) {
    return (
      <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        {intro}
        <ol className="mt-16 grid gap-20 md:grid-cols-2 md:gap-x-10">
          {cards.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ol>
      </div>
    );
  }
  return <Pinned intro={intro} cards={cards} />;
}

function Pinned({ intro, cards }: { intro: React.ReactNode; cards: React.ReactNode[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);

  useIsoLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distance);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={outer} className="relative" style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pb-10 pt-16">
        <motion.ol
          ref={track}
          style={{ x }}
          className="flex w-max items-center gap-[6vw] pl-12 pr-[10vw] will-change-transform"
        >
          <li className="flex w-[min(34vw,32rem)] shrink-0 flex-col justify-center">{intro}</li>
          {cards.map((c, i) => (
            <li key={i} className="project-slide shrink-0">
              {c}
            </li>
          ))}
        </motion.ol>

        <div
          aria-hidden="true"
          className="absolute inset-x-12 bottom-8 flex items-center gap-4 pl-[16rem]"
        >
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
            fast
          </span>
          <div className="relative h-px flex-1 bg-line">
            <motion.div
              className="absolute inset-0 origin-left bg-accent"
              style={{ scaleX: progress }}
            />
          </div>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
            still
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/content";
import MuonMark from "./MuonMark";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only-focusable left-4 top-3 z-50 rounded-sm bg-ink px-3 py-2 font-mono text-xs text-bg"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12"
      >
        <a href="#top" className="flex items-center gap-2.5 text-ink" aria-label={`${site.name}, back to top`}>
          <MuonMark className="size-7" />
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-soft max-sm:hidden">
            {site.name}
          </span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center">
            {nav.map((item) => (
              <li
                key={item.href}
                className={item.href === "#projects" || item.href === "#contact" ? "" : "max-md:hidden"}
              >
                <a
                  href={item.href}
                  className="rounded-sm px-2.5 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink sm:px-3"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

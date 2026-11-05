"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => mo.disconnect();
}

const getTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

export default function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, getTheme, () => "dark");
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {
          /* storage unavailable: the choice lasts for this visit only */
        }
      }}
      aria-label={`${theme === "dark" ? "Dark" : "Light"} theme: switch to ${next}`}
      className="group inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-full border border-line px-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-line-strong hover:text-ink"
    >
      <span
        aria-hidden="true"
        className="relative inline-block size-2.5 rounded-full border border-current"
      >
        <span
          className={`absolute inset-0 rounded-full bg-current transition-transform duration-500 ease-out-expo ${
            theme === "dark" ? "scale-[0.45]" : "scale-100"
          }`}
        />
      </span>
      <span suppressHydrationWarning className="max-sm:hidden">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}

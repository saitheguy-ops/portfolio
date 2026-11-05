"use client";

import { useState } from "react";

/**
 * A lazy-loaded image in a fixed-ratio box (so nothing shifts). If the file is
 * missing, it falls back to an on-theme placeholder that names the file.
 */
export default function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  imgClassName = "",
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-bg-raised ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {failed ? (
        <div className="absolute inset-0 flex flex-col justify-end gap-1 p-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
          <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 bg-line-strong" />
          <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-y-1/2 bg-line-strong" />
          <span>{alt}</span>
          <span className="normal-case tracking-normal">public{src}</span>
        </div>
      ) : (
        // Plain <img>: the site is a static export, images are pre-sized.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}

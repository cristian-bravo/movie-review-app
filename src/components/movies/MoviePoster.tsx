"use client";

import { useEffect, useState } from "react";

const FALLBACK_POSTER = "/placeholder-poster.png";

interface MoviePosterProps {
  src?: string;
  title: string;
  className?: string;
}

function resolveInitialPoster(src?: string) {
  if (!src || src === "N/A") {
    return FALLBACK_POSTER;
  }

  return src;
}

export function MoviePoster({
  src,
  title,
  className,
}: MoviePosterProps) {
  const [posterSrc, setPosterSrc] = useState(resolveInitialPoster(src));

  useEffect(() => {
    setPosterSrc(resolveInitialPoster(src));
  }, [src]);

  return (
    // OMDb poster rendering is intentionally using a plain img element here.
    // The direct browser request avoids optimizer issues with remote poster assets.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={posterSrc}
      alt={title}
      className={className}
      loading="lazy"
      onError={() => setPosterSrc(FALLBACK_POSTER)}
    />
  );
}

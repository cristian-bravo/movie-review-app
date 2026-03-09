"use client";

import { useEffect, useState } from "react";

const FALLBACK_POSTER = "/placeholder-poster.png";

interface MoviePosterProps {
  src?: string;
  title: string;
  className?: string;
  fallbackSrc?: string | null;
  onError?: () => void;
}

function resolveInitialPoster(src?: string, fallbackSrc: string | null = FALLBACK_POSTER) {
  if (!src || src === "N/A") {
    return fallbackSrc ?? undefined;
  }

  return src;
}

export function MoviePoster({
  src,
  title,
  className,
  fallbackSrc = FALLBACK_POSTER,
  onError,
}: MoviePosterProps) {
  const [posterSrc, setPosterSrc] = useState(resolveInitialPoster(src, fallbackSrc));

  useEffect(() => {
    setPosterSrc(resolveInitialPoster(src, fallbackSrc));
  }, [fallbackSrc, src]);

  if (!posterSrc) {
    return null;
  }

  return (
    // OMDb poster rendering is intentionally using a plain img element here.
    // The direct browser request avoids optimizer issues with remote poster assets.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={posterSrc}
      alt={title}
      className={className}
      loading="lazy"
      onError={() => {
        onError?.();
        setPosterSrc(fallbackSrc ?? undefined);
      }}
    />
  );
}

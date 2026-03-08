"use client";

import { animate } from "animejs";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { MovieCard } from "@/components/movies/MovieCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Movie } from "@/types";
import { cn } from "@/utils/cn";

import styles from "@/styles/components/movie-row.module.css";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.1">
      <path d="M15 6L9 12L15 18" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.1">
      <path d="M9 6L15 12L9 18" />
    </svg>
  );
}

export function MovieRow({
  title,
  movies,
}: MovieRowProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transition, setTransition] = useState<{
    direction: "left" | "right";
    fromStartIndex: number;
    toStartIndex: number;
  } | null>(null);
  const trackWindowRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<{ cancel: () => void } | null>(null);
  const metricsRef = useRef({ itemWidth: 0, gap: 0 });

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1280) {
        setVisibleCount(5);
        return;
      }

      if (window.innerWidth >= 1024) {
        setVisibleCount(4);
        return;
      }

      if (window.innerWidth >= 640) {
        setVisibleCount(3);
        return;
      }

      setVisibleCount(2);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  useEffect(() => {
    const maxStartIndex = Math.max(0, movies.length - visibleCount);

    if (startIndex > maxStartIndex) {
      setStartIndex(maxStartIndex);
    }
  }, [movies.length, startIndex, visibleCount]);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const trackWindow = trackWindowRef.current;
    const firstItem = row?.querySelector<HTMLElement>("[data-row-item='true']");

    if (!row || !trackWindow || !firstItem) {
      return;
    }

    const rowStyles = window.getComputedStyle(row);
    const gap = parseFloat(rowStyles.gap || "0");
    const itemWidth = firstItem.getBoundingClientRect().width;
    const visibleWidth = itemWidth * visibleCount + gap * Math.max(visibleCount - 1, 0);

    metricsRef.current = { itemWidth, gap };
    trackWindow.style.width = `${visibleWidth}px`;
    trackWindow.style.maxWidth = "100%";

    animationRef.current?.cancel();

    if (!transition) {
      row.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    const shift = itemWidth + gap;
    row.style.transform =
      transition.direction === "right"
        ? "translate3d(0, 0, 0)"
        : `translate3d(${-shift}px, 0, 0)`;

    requestAnimationFrame(() => {
      animationRef.current = animate(row, {
        translateX: transition.direction === "right" ? -shift : 0,
        duration: 640,
        easing: "inOutSine",
        onComplete: () => {
          row.style.transform = "translate3d(0, 0, 0)";
          setStartIndex(transition.toStartIndex);
          setTransition(null);
          setIsAnimating(false);
        },
      });
    });

    return () => {
      animationRef.current?.cancel();
    };
  }, [transition, visibleCount]);

  useEffect(() => {
    const handleResize = () => {
      const row = rowRef.current;
      const trackWindow = trackWindowRef.current;
      const firstItem = row?.querySelector<HTMLElement>("[data-row-item='true']");

      if (!row || !trackWindow || !firstItem) {
        return;
      }

      const rowStyles = window.getComputedStyle(row);
      const gap = parseFloat(rowStyles.gap || "0");
      const itemWidth = firstItem.getBoundingClientRect().width;
      const visibleWidth = itemWidth * visibleCount + gap * Math.max(visibleCount - 1, 0);

      metricsRef.current = { itemWidth, gap };
      trackWindow.style.width = `${visibleWidth}px`;
      trackWindow.style.maxWidth = "100%";
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [visibleCount, movies.length]);

  function handleArrowClick(direction: "left" | "right") {
    const step = 1;
    const maxStartIndex = Math.max(0, movies.length - visibleCount);
    const nextStartIndex =
      direction === "left"
        ? Math.max(0, startIndex - step)
        : Math.min(maxStartIndex, startIndex + step);

    if (nextStartIndex === startIndex || isAnimating || transition) {
      return;
    }

    setIsAnimating(true);
    setTransition({
      direction,
      fromStartIndex: startIndex,
      toStartIndex: nextStartIndex,
    });
  }

  const renderStartIndex = transition
    ? transition.direction === "right"
      ? transition.fromStartIndex
      : transition.toStartIndex
    : startIndex;
  const renderCount = transition ? visibleCount + 1 : visibleCount;
  const visibleMovies = movies.slice(renderStartIndex, renderStartIndex + renderCount);
  const canScrollLeft = startIndex > 0 && !isAnimating && !transition;
  const canScrollRight = startIndex + visibleCount < movies.length && !isAnimating && !transition;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {movies.length > 0 ? (
        <div className={styles.viewport} aria-label={title}>
          <button
            type="button"
            onClick={() => handleArrowClick("left")}
            disabled={!canScrollLeft}
            aria-label={`Scroll ${title} left`}
            className={cn(
              styles.edgeArrow,
              styles.edgeArrowLeft,
              !canScrollLeft && styles.edgeArrowHidden,
            )}
          >
            <ChevronLeftIcon />
          </button>

          <div ref={trackWindowRef} className={styles.trackWindow}>
            <div
              ref={rowRef}
              className={cn(
                styles.row,
                "flex gap-6 py-4",
              )}
              role="list"
            >
              {visibleMovies.map((movie) => (
                <div
                  key={movie.imdbID}
                  data-row-item="true"
                  className={cn(
                    styles.item,
                    "w-[156px] flex-shrink-0 sm:w-[176px] lg:w-[198px] xl:w-[212px] 2xl:w-[224px]",
                  )}
                  role="listitem"
                >
                  <MovieCard movie={movie} variant="row" />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleArrowClick("right")}
            disabled={!canScrollRight}
            aria-label={`Scroll ${title} right`}
            className={cn(
              styles.edgeArrow,
              styles.edgeArrowRight,
              !canScrollRight && styles.edgeArrowHidden,
            )}
          >
            <ChevronRightIcon />
          </button>
        </div>
      ) : (
        <EmptyState
          title={`No titles available for ${title.toLowerCase()}`}
          description="The live movie feed returned an empty row. Open the catalog or retry the current section."
          actionHref="/catalog"
          actionLabel="Open Catalog"
        />
      )}
    </section>
  );
}

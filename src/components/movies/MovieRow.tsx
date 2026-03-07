"use client";

import { animate, stagger } from "animejs";
import { useEffect, useRef, useState } from "react";

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
  const [direction, setDirection] = useState<"left" | "right">("right");
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

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
    const targets = itemRefs.current.filter((item): item is HTMLDivElement => Boolean(item));

    if (targets.length === 0) {
      return;
    }

    animate(targets, {
      opacity: [{ from: 0 }, { to: 1 }],
      translateX: [{ from: direction === "right" ? 28 : -28 }, { to: 0 }],
      scale: [{ from: 0.96 }, { to: 1 }],
      easing: "easeOutExpo",
      duration: 420,
      delay: stagger(95, { start: 0 }),
    });
  }, [direction, startIndex, visibleCount]);

  useEffect(() => {
    const maxStartIndex = Math.max(0, movies.length - visibleCount);

    if (startIndex > maxStartIndex) {
      setStartIndex(maxStartIndex);
    }
  }, [movies.length, startIndex, visibleCount]);

  function handleArrowClick(direction: "left" | "right") {
    const step = visibleCount;
    const maxStartIndex = Math.max(0, movies.length - visibleCount);
    const nextStartIndex =
      direction === "left"
        ? Math.max(0, startIndex - step)
        : Math.min(maxStartIndex, startIndex + step);

    if (isAnimating || nextStartIndex === startIndex) {
      return;
    }

    setDirection(direction);
    setIsAnimating(true);

    const targets = itemRefs.current.filter((item): item is HTMLDivElement => Boolean(item));

    animate(targets, {
      opacity: [{ from: 1 }, { to: 0 }],
      translateX: [{ from: 0 }, { to: direction === "right" ? -22 : 22 }],
      scale: [{ from: 1 }, { to: 0.985 }],
      easing: "easeInOutQuad",
      duration: 180,
      delay: stagger(55, { start: 0 }),
      onComplete: () => {
        setStartIndex(nextStartIndex);
        setIsAnimating(false);
      },
    });
  }

  const visibleMovies = movies.slice(startIndex, startIndex + visibleCount);
  const canScrollLeft = startIndex > 0 && !isAnimating;
  const canScrollRight = startIndex + visibleCount < movies.length && !isAnimating;
  itemRefs.current = [];

  return (
    <section className="py-6 sm:py-7 xl:py-8">
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

          <div
            className={cn(
              styles.row,
              "animate-row-stagger flex gap-6 py-4",
            )}
            role="list"
          >
            {/* Render only the active window so the row never exposes all fetched titles at once. */}
            {visibleMovies.map((movie, index) => (
              <div
                key={movie.imdbID}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
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

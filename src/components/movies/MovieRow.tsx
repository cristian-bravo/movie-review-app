"use client";

import { animate } from "animejs";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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

function getVisibleCount(width: number) {
  if (width >= 1280) {
    return 5;
  }

  if (width >= 1024) {
    return 4;
  }

  if (width >= 640) {
    return 3;
  }

  return 2;
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const trackWindowRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<{ cancel: () => void } | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const metricsRef = useRef({
    itemWidth: 0,
    gap: 0,
    step: 0,
  });
  const translateRef = useRef(0);

  const maxIndex = Math.max(0, movies.length - visibleCount);

  const setRowTranslate = useCallback((value: number) => {
    const row = rowRef.current;

    if (!row) {
      return;
    }

    row.style.transform = `translate3d(${value}px, 0, 0)`;
    translateRef.current = value;
  }, []);

  const cancelAnimation = useCallback(() => {
    animationRef.current?.cancel();
    animationRef.current = null;
    setIsAnimating(false);
  }, []);

  const syncMobileIndexFromScroll = useCallback(() => {
    const trackWindow = trackWindowRef.current;
    const { step } = metricsRef.current;

    if (!trackWindow || step <= 0) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(maxIndex, Math.round(trackWindow.scrollLeft / step)));

    setCurrentIndex((previous) => (previous === nextIndex ? previous : nextIndex));
  }, [maxIndex]);

  useEffect(() => {
    const updateLayoutMode = () => {
      const width = window.innerWidth;

      setVisibleCount(getVisibleCount(width));
      setIsDesktop(width >= 1024);
    };

    updateLayoutMode();
    window.addEventListener("resize", updateLayoutMode);

    return () => {
      window.removeEventListener("resize", updateLayoutMode);
    };
  }, []);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  useLayoutEffect(() => {
    const trackWindow = trackWindowRef.current;
    const row = rowRef.current;
    const firstItem = row?.querySelector<HTMLElement>("[data-row-item='true']");

    if (!trackWindow || !row || !firstItem) {
      return;
    }

    const rowStyles = window.getComputedStyle(row);
    const gap = parseFloat(rowStyles.gap || "0");
    const itemWidth = firstItem.getBoundingClientRect().width;
    const step = itemWidth + gap;
    const visibleWidth = itemWidth * visibleCount + gap * Math.max(visibleCount - 1, 0);

    metricsRef.current = {
      itemWidth,
      gap,
      step,
    };

    trackWindow.style.width = `${visibleWidth}px`;
    trackWindow.style.maxWidth = "100%";

    if (isDesktop) {
      trackWindow.scrollLeft = 0;

      if (!isAnimating) {
        setRowTranslate(-(currentIndex * step));
      }

      return;
    }

    if (isAnimating) {
      cancelAnimation();
    }

    setRowTranslate(0);

    const maxScrollLeft = Math.max(0, trackWindow.scrollWidth - trackWindow.clientWidth);
    trackWindow.scrollLeft = Math.min(currentIndex * step, maxScrollLeft);
  }, [cancelAnimation, currentIndex, isAnimating, isDesktop, setRowTranslate, visibleCount]);

  useEffect(() => {
    const trackWindow = trackWindowRef.current;

    if (!trackWindow || isDesktop) {
      return;
    }

    function handleScroll() {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        syncMobileIndexFromScroll();
        scrollFrameRef.current = null;
      });
    }

    trackWindow.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      trackWindow.removeEventListener("scroll", handleScroll);

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, [isDesktop, syncMobileIndexFromScroll]);

  useEffect(() => {
    return () => {
      cancelAnimation();
    };
  }, [cancelAnimation]);

  const animateToIndex = useCallback(
    (nextIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(nextIndex, maxIndex));
      const { step } = metricsRef.current;

      if (!isDesktop || step <= 0) {
        return;
      }

      cancelAnimation();
      setIsAnimating(true);

      const motion = { value: translateRef.current };
      const targetTranslate = -(clampedIndex * step);

      animationRef.current = animate(motion, {
        value: targetTranslate,
        duration: 820,
        easing: "inOutQuart",
        onUpdate: () => {
          setRowTranslate(motion.value);
        },
        onComplete: () => {
          animationRef.current = null;
          setRowTranslate(targetTranslate);
          setCurrentIndex(clampedIndex);
          setIsAnimating(false);
        },
      });
    },
    [cancelAnimation, isDesktop, maxIndex, setRowTranslate],
  );

  const navigate = useCallback(
    (direction: "left" | "right") => {
      if (!isDesktop || isAnimating) {
        return;
      }

      const nextIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

      if (nextIndex === currentIndex || nextIndex < 0 || nextIndex > maxIndex) {
        return;
      }

      animateToIndex(nextIndex);
    },
    [animateToIndex, currentIndex, isAnimating, isDesktop, maxIndex],
  );

  const canScrollLeft = currentIndex > 0 && !isAnimating;
  const canScrollRight = currentIndex < maxIndex && !isAnimating;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {movies.length > 0 ? (
        <div className={styles.viewport} aria-label={title}>
          {isDesktop ? (
            <>
              <div
                className={cn(styles.hitZone, styles.hitZoneLeft, !canScrollLeft && styles.hitZoneDisabled)}
                onClick={() => {
                  if (canScrollLeft) {
                    navigate("left");
                  }
                }}
                aria-hidden="true"
              />

              <div
                className={cn(styles.hitZone, styles.hitZoneRight, !canScrollRight && styles.hitZoneDisabled)}
                onClick={() => {
                  if (canScrollRight) {
                    navigate("right");
                  }
                }}
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={() => navigate("left")}
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
            </>
          ) : null}

          <div
            ref={trackWindowRef}
            className={cn(styles.trackWindow, !isDesktop && styles.mobileTrackWindow)}
          >
            <div
              ref={rowRef}
              className={cn(
                styles.row,
                "flex gap-6 py-4",
                !isDesktop && styles.mobileRow,
              )}
              role="list"
            >
              {movies.map((movie) => (
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

          {isDesktop ? (
            <button
              type="button"
              onClick={() => navigate("right")}
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
          ) : null}
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

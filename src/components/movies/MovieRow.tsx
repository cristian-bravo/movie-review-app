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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackWindowRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<{ cancel: () => void } | null>(null);
  const metricsRef = useRef({
    itemWidth: 0,
    gap: 0,
    step: 0,
  });
  const translateRef = useRef(0);
  const touchStateRef = useRef({
    startX: 0,
    deltaX: 0,
    active: false,
  });

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

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(getVisibleCount(window.innerWidth));
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
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

    if (!isAnimating && !isDragging) {
      setRowTranslate(-currentIndex * step);
    }
  }, [currentIndex, isAnimating, isDragging, setRowTranslate, visibleCount]);

  useEffect(() => {
    return () => {
      cancelAnimation();
    };
  }, [cancelAnimation]);

  const animateToIndex = useCallback(
    (nextIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(nextIndex, maxIndex));
      const { step } = metricsRef.current;

      if (step <= 0) {
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
    [cancelAnimation, maxIndex, setRowTranslate],
  );

  const navigate = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating || isDragging) {
        return;
      }

      const nextIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

      if (nextIndex === currentIndex || nextIndex < 0 || nextIndex > maxIndex) {
        return;
      }

      animateToIndex(nextIndex);
    },
    [animateToIndex, currentIndex, isAnimating, isDragging, maxIndex],
  );

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (isAnimating) {
      cancelAnimation();
    }

    touchStateRef.current = {
      startX: event.touches[0]?.clientX ?? 0,
      deltaX: 0,
      active: true,
    };
    setIsDragging(true);
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    const touchState = touchStateRef.current;
    const currentTouch = event.touches[0];

    if (!touchState.active || !currentTouch) {
      return;
    }

    const { step } = metricsRef.current;

    if (step <= 0) {
      return;
    }

    const deltaX = currentTouch.clientX - touchState.startX;
    touchState.deltaX = deltaX;

    const isEdgeResistance =
      (currentIndex === 0 && deltaX > 0) || (currentIndex === maxIndex && deltaX < 0);
    const resistance = isEdgeResistance ? 0.28 : 0.9;
    const baseTranslate = -(currentIndex * step);

    setRowTranslate(baseTranslate + deltaX * resistance);

    if (Math.abs(deltaX) > 6) {
      event.preventDefault();
    }
  }

  function finishTouchGesture() {
    const touchState = touchStateRef.current;
    const { step } = metricsRef.current;
    const threshold = Math.min(96, step * 0.22 || 72);

    touchState.active = false;
    setIsDragging(false);

    if (touchState.deltaX <= -threshold && currentIndex < maxIndex) {
      animateToIndex(currentIndex + 1);
      return;
    }

    if (touchState.deltaX >= threshold && currentIndex > 0) {
      animateToIndex(currentIndex - 1);
      return;
    }

    animateToIndex(currentIndex);
  }

  const canScrollLeft = currentIndex > 0 && !isAnimating;
  const canScrollRight = currentIndex < maxIndex && !isAnimating;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {movies.length > 0 ? (
        <div className={styles.viewport} aria-label={title}>
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

          <div
            ref={trackWindowRef}
            className={styles.trackWindow}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={finishTouchGesture}
            onTouchCancel={finishTouchGesture}
          >
            <div
              ref={rowRef}
              className={cn(
                styles.row,
                "flex gap-6 py-4",
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

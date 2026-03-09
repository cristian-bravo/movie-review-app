"use client";

import { animate } from "animejs";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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

function hasRenderablePoster(movie: Movie) {
  const poster = (movie.Poster ?? movie.poster ?? "").trim();

  if (!poster || poster === "N/A") {
    return false;
  }

  return true;
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loopOffset, setLoopOffset] = useState(0);
  const [edgeGhost, setEdgeGhost] = useState<{ direction: "left" | "right"; movie: Movie } | null>(null);
  const [hiddenPosterIds, setHiddenPosterIds] = useState<Set<string>>(new Set());
  const trackWindowRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const edgeGhostRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<{ cancel: () => void } | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
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

  const availableMovies = useMemo(
    () => movies.filter((movie) => hasRenderablePoster(movie) && !hiddenPosterIds.has(movie.imdbID)),
    [hiddenPosterIds, movies],
  );
  const displayMovies = useMemo(() => {
    if (availableMovies.length === 0) {
      return [];
    }

    const normalizedOffset = ((loopOffset % availableMovies.length) + availableMovies.length) % availableMovies.length;

    return [
      ...availableMovies.slice(normalizedOffset),
      ...availableMovies.slice(0, normalizedOffset),
    ];
  }, [availableMovies, loopOffset]);
  const maxIndex = Math.max(0, availableMovies.length - visibleCount);

  const setRowTranslate = useCallback((value: number) => {
    const row = rowRef.current;

    if (!row) {
      return;
    }

    row.style.transform = `translate3d(${value}px, 0, 0)`;
    translateRef.current = value;
  }, []);

  const setGhostTranslate = useCallback((value: number) => {
    const ghost = edgeGhostRef.current;

    if (!ghost) {
      return;
    }

    ghost.style.transform = `translate3d(${value}px, 0, 0)`;
  }, []);

  const cancelAnimation = useCallback(() => {
    animationRef.current?.cancel();
    animationRef.current = null;
    setGhostTranslate(0);
    setEdgeGhost(null);
    setIsAnimating(false);
  }, [setGhostTranslate]);

  const syncMobileIndexFromScroll = useCallback(() => {
    const trackWindow = trackWindowRef.current;
    const { step } = metricsRef.current;

    if (!trackWindow || step <= 0 || isAnimating) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(maxIndex, Math.round(trackWindow.scrollLeft / step)));

    setCurrentIndex((previous) => (previous === nextIndex ? previous : nextIndex));
  }, [isAnimating, maxIndex]);

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

  useEffect(() => {
    setHiddenPosterIds((previous) => {
      if (previous.size === 0) {
        return previous;
      }

      const movieIds = new Set(movies.map((movie) => movie.imdbID));
      const next = new Set([...previous].filter((id) => movieIds.has(id)));

      return next.size === previous.size ? previous : next;
    });
  }, [movies]);

  useEffect(() => {
    setLoopOffset((previous) => {
      if (availableMovies.length === 0) {
        return 0;
      }

      return ((previous % availableMovies.length) + availableMovies.length) % availableMovies.length;
    });
  }, [availableMovies.length]);

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

      if (!isAnimating && !isDragging) {
        setRowTranslate(-(currentIndex * step));
      }

      return;
    }

    if (isAnimating) {
      return;
    }

    setRowTranslate(0);

    const maxScrollLeft = Math.max(0, trackWindow.scrollWidth - trackWindow.clientWidth);
    trackWindow.scrollLeft = Math.min(currentIndex * step, maxScrollLeft);
  }, [currentIndex, displayMovies, isAnimating, isDesktop, isDragging, setRowTranslate, visibleCount]);

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

  const completeAnimation = useCallback(
    (
      nextIndex: number,
      options?: {
        afterCommit?: () => void;
        nextLoopOffset?: (current: number) => number;
      },
    ) => {
      setCurrentIndex(nextIndex);
      if (options?.nextLoopOffset) {
        setLoopOffset(options.nextLoopOffset);
      }
      window.requestAnimationFrame(() => {
        options?.afterCommit?.();
        window.requestAnimationFrame(() => {
          setEdgeGhost(null);
          setIsAnimating(false);
        });
      });
    },
    [],
  );

  const animateToIndex = useCallback(
    (nextIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(nextIndex, maxIndex));
      const { step } = metricsRef.current;
      const trackWindow = trackWindowRef.current;

      if (!trackWindow || step <= 0) {
        return;
      }

      cancelAnimation();
      setIsAnimating(true);

      if (!isDesktop) {
        const startScrollLeft = trackWindow.scrollLeft;
        const maxScrollLeft = Math.max(0, trackWindow.scrollWidth - trackWindow.clientWidth);
        const targetScrollLeft = Math.min(clampedIndex * step, maxScrollLeft);
        const motion = { value: -startScrollLeft };

        // Keep the current visual position, then animate the whole track like desktop.
        trackWindow.scrollLeft = 0;
        setRowTranslate(-startScrollLeft);

        animationRef.current = animate(motion, {
          value: -targetScrollLeft,
          duration: 720,
          easing: "inOutQuart",
          onUpdate: () => {
            setRowTranslate(motion.value);
          },
          onComplete: () => {
            animationRef.current = null;
            trackWindow.scrollLeft = targetScrollLeft;
            setRowTranslate(0);
            setCurrentIndex(clampedIndex);
            window.requestAnimationFrame(() => {
              setIsAnimating(false);
            });
          },
        });

        return;
      }

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

  const animateWrap = useCallback(
    (direction: "left" | "right") => {
      const { step } = metricsRef.current;
      const trackWindow = trackWindowRef.current;

      if (!trackWindow || step <= 0 || availableMovies.length === 0) {
        return;
      }

      cancelAnimation();
      setIsAnimating(true);
      setEdgeGhost({
        direction,
        movie: direction === "right"
          ? displayMovies[0]
          : displayMovies[displayMovies.length - 1],
      });

      window.requestAnimationFrame(() => {
        if (direction === "right") {
          if (isDesktop) {
            const startTranslate = -(currentIndex * step);
            const targetTranslate = -((currentIndex + 1) * step);
            const motion = { row: startTranslate, ghost: step };

            setRowTranslate(startTranslate);
            setGhostTranslate(step);

            animationRef.current = animate(motion, {
              row: targetTranslate,
              ghost: 0,
              duration: 760,
              easing: "inOutQuart",
              onUpdate: () => {
                setRowTranslate(motion.row);
                setGhostTranslate(motion.ghost);
              },
              onComplete: () => {
                animationRef.current = null;
                completeAnimation(maxIndex, {
                  nextLoopOffset: (current) => (current + 1) % availableMovies.length,
                  afterCommit: () => {
                    setRowTranslate(-(maxIndex * step));
                    setGhostTranslate(0);
                  },
                });
              },
            });

            return;
          }

          const startScrollLeft = trackWindow.scrollLeft;
          const targetScrollLeft = startScrollLeft + step;
          const motion = { row: -startScrollLeft, ghost: step };

          trackWindow.scrollLeft = 0;
          setRowTranslate(-startScrollLeft);
          setGhostTranslate(step);

          animationRef.current = animate(motion, {
            row: -targetScrollLeft,
            ghost: 0,
            duration: 760,
            easing: "inOutQuart",
            onUpdate: () => {
              setRowTranslate(motion.row);
              setGhostTranslate(motion.ghost);
            },
            onComplete: () => {
              animationRef.current = null;
              completeAnimation(maxIndex, {
                nextLoopOffset: (current) => (current + 1) % availableMovies.length,
                afterCommit: () => {
                  trackWindow.scrollLeft = Math.max(0, maxIndex * step);
                  setRowTranslate(0);
                  setGhostTranslate(0);
                },
              });
            },
          });

          return;
        }

        if (isDesktop) {
          const motion = { row: 0, ghost: -step };

          setRowTranslate(0);
          setGhostTranslate(-step);

          animationRef.current = animate(motion, {
            row: step,
            ghost: 0,
            duration: 760,
            easing: "inOutQuart",
            onUpdate: () => {
              setRowTranslate(motion.row);
              setGhostTranslate(motion.ghost);
            },
            onComplete: () => {
              animationRef.current = null;
              completeAnimation(0, {
                nextLoopOffset: (current) => (current - 1 + availableMovies.length) % availableMovies.length,
                afterCommit: () => {
                  setRowTranslate(0);
                  setGhostTranslate(0);
                },
              });
            },
          });

          return;
        }

        const motion = { row: 0, ghost: -step };

        trackWindow.scrollLeft = 0;
        setRowTranslate(0);
        setGhostTranslate(-step);

        animationRef.current = animate(motion, {
          row: step,
          ghost: 0,
          duration: 760,
          easing: "inOutQuart",
          onUpdate: () => {
            setRowTranslate(motion.row);
            setGhostTranslate(motion.ghost);
          },
          onComplete: () => {
            animationRef.current = null;
            completeAnimation(0, {
              nextLoopOffset: (current) => (current - 1 + availableMovies.length) % availableMovies.length,
              afterCommit: () => {
                trackWindow.scrollLeft = 0;
                setRowTranslate(0);
                setGhostTranslate(0);
              },
            });
          },
        });
      });
    },
    [availableMovies.length, cancelAnimation, completeAnimation, currentIndex, displayMovies, isDesktop, maxIndex, setGhostTranslate, setRowTranslate],
  );

  const canNavigate = maxIndex > 0;

  const navigate = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating || isDragging || !canNavigate) {
        return;
      }

      if (direction === "right" && currentIndex >= maxIndex) {
        animateWrap("right");
        return;
      }

      if (direction === "left" && currentIndex <= 0) {
        animateWrap("left");
        return;
      }

      animateToIndex(direction === "left" ? currentIndex - 1 : currentIndex + 1);
    },
    [animateToIndex, animateWrap, canNavigate, currentIndex, isAnimating, isDragging, maxIndex],
  );

  function handleDesktopTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (!isDesktop) {
      return;
    }

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

  function handleDesktopTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (!isDesktop || !touchStateRef.current.active) {
      return;
    }

    const currentTouch = event.touches[0];
    const { step } = metricsRef.current;

    if (!currentTouch || step <= 0) {
      return;
    }

    const deltaX = currentTouch.clientX - touchStateRef.current.startX;
    touchStateRef.current.deltaX = deltaX;

    const isEdgeResistance =
      (currentIndex === 0 && deltaX > 0) || (currentIndex === maxIndex && deltaX < 0);
    const resistance = isEdgeResistance ? 0.28 : 0.92;
    const baseTranslate = -(currentIndex * step);

    setRowTranslate(baseTranslate + deltaX * resistance);

    if (Math.abs(deltaX) > 6) {
      event.preventDefault();
    }
  }

  function finishDesktopTouchGesture() {
    if (!isDesktop || !touchStateRef.current.active) {
      return;
    }

    const { step } = metricsRef.current;
    const threshold = Math.min(96, step * 0.22 || 72);
    const deltaX = touchStateRef.current.deltaX;

    touchStateRef.current.active = false;
    setIsDragging(false);

    if (deltaX <= -threshold && currentIndex < maxIndex) {
      animateToIndex(currentIndex + 1);
      return;
    }

    if (deltaX >= threshold && currentIndex > 0) {
      animateToIndex(currentIndex - 1);
      return;
    }

    animateToIndex(currentIndex);
  }

  const canScrollLeft = canNavigate && !isAnimating && !isDragging;
  const canScrollRight = canNavigate && !isAnimating && !isDragging;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {availableMovies.length > 0 ? (
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

          {!isDesktop ? (
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
          ) : null}

          <div
            ref={trackWindowRef}
            className={cn(styles.trackWindow, !isDesktop && styles.mobileTrackWindow)}
            style={!isDesktop && isAnimating ? { scrollSnapType: "none" } : undefined}
            onTouchStart={handleDesktopTouchStart}
            onTouchMove={handleDesktopTouchMove}
            onTouchEnd={finishDesktopTouchGesture}
            onTouchCancel={finishDesktopTouchGesture}
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
              {displayMovies.map((movie) => (
                <div
                  key={movie.imdbID}
                  data-row-item="true"
                  className={cn(
                    styles.item,
                    "w-[156px] flex-shrink-0 sm:w-[176px] lg:w-[198px] xl:w-[212px] 2xl:w-[224px]",
                  )}
                  role="listitem"
                >
                  <MovieCard
                    movie={movie}
                    variant="row"
                    onPosterError={(movieId) => {
                      setHiddenPosterIds((previous) => {
                        if (previous.has(movieId)) {
                          return previous;
                        }

                        const next = new Set(previous);
                        next.add(movieId);
                        return next;
                      });
                    }}
                  />
                </div>
              ))}
            </div>

            {edgeGhost ? (
              <div
                ref={edgeGhostRef}
                className={cn(
                  styles.edgeGhost,
                  edgeGhost.direction === "left" ? styles.edgeGhostLeft : styles.edgeGhostRight,
                )}
                style={{
                  width: `${metricsRef.current.itemWidth}px`,
                }}
                aria-hidden="true"
              >
                <MovieCard
                  movie={edgeGhost.movie}
                  variant="row"
                  onPosterError={(movieId) => {
                    setHiddenPosterIds((previous) => {
                      if (previous.has(movieId)) {
                        return previous;
                      }

                      const next = new Set(previous);
                      next.add(movieId);
                      return next;
                    });
                  }}
                />
              </div>
            ) : null}
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
          ) : (
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
          )}
        </div>
      ) : (
        <EmptyState
          title={`No titles available for ${title.toLowerCase()}`}
          description="This row only shows titles with working poster art. Open the catalog or retry the current section."
          actionHref="/catalog"
          actionLabel="Open Catalog"
        />
      )}
    </section>
  );
}

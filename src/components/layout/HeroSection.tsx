"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { HeroParticlesCanvas } from "@/components/layout/HeroParticlesCanvas";
import { Container } from "@/components/layout/Container";
import { MoviePoster } from "@/components/movies/MoviePoster";
import type { Movie } from "@/types";
import { formatRating } from "@/utils/formatRating";

import styles from "@/styles/components/hero-section.module.css";

interface HeroSectionProps {
  movie: Movie | null;
  movies?: Movie[];
}

function getHeroPills(movie: Movie) {
  return [movie.releaseYear, movie.runtime, ...movie.genres.slice(0, 2)].filter(Boolean);
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="m12 3.25 2.77 5.61 6.19.9-4.48 4.37 1.06 6.17L12 17.4l-5.54 2.9 1.06-6.17L3.04 9.76l6.19-.9L12 3.25Z" />
    </svg>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  return (
    <div className={styles.ratingBadge}>
      <span className={styles.ratingIcon}>
        <StarIcon />
      </span>
      <span className={styles.ratingValue}>{formatRating(rating)}</span>
      <span className={styles.ratingLabel}>Viewer score</span>
    </div>
  );
}

export function HeroSection({ movie, movies = [] }: HeroSectionProps) {
  const heroMovies = useMemo(() => {
    const items = movies.filter(Boolean);

    if (items.length > 0) {
      return items;
    }

    return movie ? [movie] : [];
  }, [movie, movies]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [heroMovies]);

  useEffect(() => {
    if (heroMovies.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroMovies.length);
    }, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, [heroMovies]);

  const activeMovie = heroMovies[activeIndex] ?? movie;
  const backgroundImage =
    activeMovie?.Poster && activeMovie.Poster !== "N/A" ? { backgroundImage: `url(${activeMovie.Poster})` } : undefined;
  const description =
    activeMovie?.synopsis ?? activeMovie?.description ?? "Browse the live movie feed and jump into rich detail pages.";
  const heroPills = activeMovie ? getHeroPills(activeMovie) : [];
  const activeTitle = activeMovie?.Title ?? "Movie night is warming up.";
  const titleLength = activeTitle.length;
  const isVeryLongTitle = titleLength >= 38;
  const isLongTitle = titleLength >= 28 && titleLength < 38;
  const isMediumTitle = titleLength >= 20 && titleLength < 28;
  const titleClassName = [
    styles.title,
    isVeryLongTitle ? styles.titleVeryLong : "",
    isLongTitle ? styles.titleLong : "",
    isMediumTitle ? styles.titleMedium : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={`${styles.stage} animate-hero-in`}>
      {backgroundImage ? <div className={styles.media} style={backgroundImage} aria-hidden="true" /> : null}
      <HeroParticlesCanvas />
      <div className={styles.overlay} aria-hidden="true" />

      <Container variant="wide" className="relative z-10">
        <div className="flex min-h-[82vh] items-center py-24 md:py-24 lg:py-24">
          <div className={styles.layout}>
            <div className={`${styles.copy} mx-auto w-full max-w-xl text-center md:mx-0 md:text-left`}>
              <div className={styles.leadBlock}>
                <div className={styles.titleRegion}>
                  <p className="eyebrow text-white/72">Featured Pick</p>
                  <h1 className={titleClassName}>{activeTitle}</h1>
                </div>
                <p className={styles.summary}>{description}</p>
                {activeMovie?.rating !== null ? (
                  <div className={styles.mobileRating}>
                    <RatingBadge rating={activeMovie.rating} />
                  </div>
                ) : null}
              </div>

              {activeMovie ? (
                <div className={`${styles.metaRow} justify-center md:justify-start`}>
                  {heroPills.map((item) => (
                    <span key={item} className={styles.pill}>
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className={`${styles.actions} justify-center md:justify-start`}>
                {activeMovie ? (
                  <>
                    <Link
                      href={`/movies/${activeMovie.imdbID}`}
                      className="stream-button stream-button--primary animate-button-glow min-h-13 px-6 text-base"
                    >
                      Watch Details
                    </Link>
                    <Link
                      href={`/search?q=${encodeURIComponent(activeMovie.Title)}`}
                      className="stream-button stream-button--secondary min-h-13 px-6 text-base"
                    >
                      More Info
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/catalog"
                      className="stream-button stream-button--primary animate-button-glow min-h-13 px-6 text-base"
                    >
                      Browse Catalog
                    </Link>
                    <Link
                      href="/search"
                      className="stream-button stream-button--secondary min-h-13 px-6 text-base"
                    >
                      Search Movies
                    </Link>
                  </>
                )}
              </div>

              {heroMovies.length > 1 ? (
                <div className={`${styles.thumbRow} flex flex-wrap items-center justify-center gap-2.5 pt-1 md:justify-start`}>
                  {heroMovies.map((heroMovie, index) => (
                    <button
                      key={heroMovie.imdbID}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`group relative overflow-hidden rounded-xl border transition duration-300 ${
                        index === activeIndex
                          ? "border-white/40 shadow-soft"
                          : "border-white/10 opacity-75 hover:border-white/25 hover:opacity-100"
                      }`}
                      aria-label={`Show ${heroMovie.Title} in hero`}
                    >
                      <MoviePoster
                        src={heroMovie.Poster}
                        title={heroMovie.Title}
                        className="h-16 w-11 object-cover transition duration-300 group-hover:scale-[1.04]"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {activeMovie?.rating !== null ? (
              <div className={`${styles.ratingColumn} ${styles.desktopRating}`}>
                <RatingBadge rating={activeMovie.rating} />
              </div>
            ) : null}

            {activeMovie ? (
              <div className={styles.posterColumn}>
                <Link
                  href={`/movies/${activeMovie.imdbID}`}
                  aria-label={`Open ${activeMovie.Title} details`}
                  className="group block"
                >
                  <MoviePoster
                    src={activeMovie.Poster}
                    title={activeMovie.Title}
                    className={styles.posterCard}
                  />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

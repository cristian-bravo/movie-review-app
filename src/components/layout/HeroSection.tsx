import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { MoviePoster } from "@/components/movies/MoviePoster";
import type { Movie } from "@/types";
import { formatRating } from "@/utils/formatRating";

import styles from "@/styles/components/hero-section.module.css";

interface HeroSectionProps {
  movie: Movie | null;
}

function getHeroPills(movie: Movie) {
  return [movie.releaseYear, movie.runtime, ...movie.genres.slice(0, 2)].filter(Boolean);
}

export function HeroSection({ movie }: HeroSectionProps) {
  const backgroundImage =
    movie?.Poster && movie.Poster !== "N/A" ? { backgroundImage: `url(${movie.Poster})` } : undefined;
  const description = movie?.synopsis ?? movie?.description ?? "Browse the live movie feed and jump into rich detail pages.";
  const heroPills = movie ? getHeroPills(movie) : [];

  return (
    <section className={`${styles.stage} animate-hero-in`}>
      {backgroundImage ? <div className={styles.media} style={backgroundImage} aria-hidden="true" /> : null}
      <div className={styles.overlay} aria-hidden="true" />

      <Container variant="wide" className="relative z-10">
        <div className="flex min-h-[80vh] items-center py-28 md:py-32 lg:py-36">
          <div className={styles.layout}>
            <div className={`${styles.copy} mx-auto w-full max-w-xl text-center md:mx-0 md:text-left`}>
              <div className="grid gap-3">
                <p className="eyebrow text-white/72">Featured Pick</p>
                <h1 className={styles.title}>{movie?.Title ?? "Movie night is warming up."}</h1>
                <p className={styles.summary}>{description}</p>
              </div>

              {movie ? (
                <div className={`${styles.metaRow} justify-center md:justify-start`}>
                  {heroPills.map((item) => (
                    <span key={item} className={styles.pill}>
                      {item}
                    </span>
                  ))}
                  {movie.rating !== null ? (
                    <span className={`${styles.pill} ${styles.ratingPill}`}>
                      {formatRating(movie.rating)}
                    </span>
                  ) : null}
                </div>
              ) : null}

              <div className={`${styles.actions} justify-center md:justify-start`}>
                {movie ? (
                  <>
                    <Link
                      href={`/movies/${movie.imdbID}`}
                      className="stream-button stream-button--primary animate-button-glow min-h-13 px-6 text-base"
                    >
                      Watch Details
                    </Link>
                    <Link
                      href={`/search?q=${encodeURIComponent(movie.Title)}`}
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
            </div>

            {movie ? (
              <div className={styles.posterColumn}>
                <MoviePoster src={movie.Poster} title={movie.Title} className={styles.posterCard} />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

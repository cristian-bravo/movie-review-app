import Link from "next/link";

import { MoviePoster } from "@/components/movies/MoviePoster";
import type { Movie } from "@/types";
import { formatRating } from "@/utils/formatRating";

import styles from "@/styles/components/hero-movie.module.css";

interface HeroMovieProps {
  movie: Movie | null;
}

function getHeroPills(movie: Movie) {
  return [movie.releaseYear, movie.runtime, ...movie.genres.slice(0, 2)].filter(Boolean);
}

export function HeroMovie({ movie }: HeroMovieProps) {
  if (!movie) {
    return (
      <section className={styles.stage}>
        <div className={styles.shell}>
          <div className={styles.copy}>
            <p className="eyebrow">Featured Tonight</p>
            <h1 className={styles.title}>The live movie feed is still warming up.</h1>
            <p className={styles.summary}>
              Open the catalog or run a search while the featured title is being resolved from
              OMDb.
            </p>
            <div className={styles.actions}>
              <Link href="/catalog" className="stream-button stream-button--primary animate-button-glow">
                Browse Catalog
              </Link>
              <Link href="/search" className="stream-button stream-button--secondary">
                Search Movies
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const backdropSource = movie.backdrop ?? (movie.Poster !== "N/A" ? movie.Poster : undefined);
  const heroPills = getHeroPills(movie);

  return (
    <section className={`${styles.stage} animate-hero-in`}>
      {backdropSource ? (
        <div
          className={styles.backdrop}
          style={{ backgroundImage: `url(${backdropSource})` }}
          aria-hidden="true"
        />
      ) : null}

      <div className={styles.shell}>
        <div className={styles.copy}>
          <div className={styles.header}>
            <p className="eyebrow">Featured Tonight</p>
            <h1 className={styles.title}>{movie.Title}</h1>
            <p className={styles.summary}>{movie.synopsis ?? movie.description}</p>
          </div>

          <div className={styles.metaRow}>
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

          <div className={styles.actions}>
            <Link
              href={`/movies/${movie.imdbID}`}
              className="stream-button stream-button--primary animate-button-glow"
            >
              View Details
            </Link>
            <Link href="/catalog" className="stream-button stream-button--secondary">
              Browse Catalog
            </Link>
          </div>
        </div>

        <div className={styles.posterPanel}>
          <div className={styles.posterFrame}>
            <MoviePoster src={movie.Poster} title={movie.Title} className={styles.poster} />
          </div>
        </div>
      </div>
    </section>
  );
}

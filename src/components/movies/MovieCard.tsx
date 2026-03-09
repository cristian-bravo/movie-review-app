import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import type { Movie } from "@/types";
import { cn } from "@/utils/cn";
import { formatRating } from "@/utils/formatRating";

import { MoviePoster } from "@/components/movies/MoviePoster";

import styles from "@/styles/components/movie-card.module.css";

interface MovieCardProps {
  movie: Movie;
  variant?: "default" | "catalog" | "row";
  onPosterError?: (movieId: string) => void;
}

function getMovieMeta(movie: Movie) {
  return {
    id: movie.imdbID,
    title: movie.Title ?? movie.title,
    year: movie.Year ?? movie.releaseYear,
    poster: movie.Poster ?? movie.poster,
  };
}

export function MovieCard({ movie, variant = "default", onPosterError }: MovieCardProps) {
  const isRowCard = variant === "row";
  const { id, title, year, poster } = getMovieMeta(movie);
  const topLabel = movie.genres[0] ?? movie.titleType ?? "Movie";

  if (isRowCard && (!poster || poster.trim() === "" || poster === "N/A")) {
    return null;
  }

  return (
    <Link
      href={`/movies/${id}`}
      aria-label={`View details for ${title}`}
      className={cn(
        styles.link,
        styles.card,
        isRowCard ? styles.rowCard : styles.catalogCard,
        "focus-visible:ring-2 focus-visible:ring-primary/55 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
      )}
    >
      {isRowCard ? (
        <article className={styles.posterWrap}>
          <MoviePoster
            src={poster}
            title={title}
            className={styles.poster}
            fallbackSrc={null}
            onError={() => onPosterError?.(id)}
          />

          <div className={styles.rowOverlay}>
            <p className={styles.rowYear}>{year}</p>
            <h3 className={styles.rowTitle}>{title}</h3>
          </div>
        </article>
      ) : (
        <article className={styles.catalogShell}>
          <div className={styles.posterWrap}>
            <MoviePoster src={poster} title={title} className={styles.poster} />

            <div className={styles.topRow}>
              <Badge className="border-white/15 bg-black/36 text-white backdrop-blur-xl">
                {topLabel}
              </Badge>
              {movie.rating !== null ? (
                <span className="rounded-full border border-gold/25 bg-black/42 px-3 py-1 text-xs font-semibold text-gold backdrop-blur-xl">
                  {formatRating(movie.rating)}
                </span>
              ) : null}
            </div>
          </div>

          <div className={styles.catalogBody}>
            <div className="grid gap-1">
              <p className={styles.year}>{year}</p>
              <h3 className={styles.title}>{title}</h3>
            </div>

            <div className={styles.buttonRow}>
              <span className="stream-button stream-button--primary animate-button-glow">
                View Details
              </span>
            </div>
          </div>
        </article>
      )}
    </Link>
  );
}

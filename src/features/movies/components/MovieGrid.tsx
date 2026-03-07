import { MovieCard } from "@/components/movies/MovieCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Movie } from "@/types";
import { cn } from "@/utils/cn";

import styles from "@/styles/components/movie-grid.module.css";

interface MovieGridProps {
  eyebrow?: string;
  title: string;
  description?: string;
  movies: Movie[];
  cardVariant?: "default" | "catalog";
  gridClassName?: string;
  align?: "left" | "center";
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionHref?: string;
  emptyActionLabel?: string;
}

export function MovieGrid({
  eyebrow,
  title,
  description,
  movies,
  cardVariant = "default",
  gridClassName = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  align = "left",
  emptyTitle = "No movies found",
  emptyDescription = "Try another title or another search term from the live catalog.",
  emptyActionHref = "/search",
  emptyActionLabel = "Search again",
}: MovieGridProps) {
  return (
    <section className={styles.section}>
      <div className={align === "center" ? styles.centered : undefined}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align={align}
        />
      </div>

      {movies.length > 0 ? (
        <div className={cn(styles.grid, "animate-grid-stagger", gridClassName)}>
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} variant={cardVariant} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionHref={emptyActionHref}
          actionLabel={emptyActionLabel}
        />
      )}
    </section>
  );
}

import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import type { Movie } from "@/types";
import { formatRating } from "@/utils/formatRating";

import { MoviePoster } from "@/components/movies/MoviePoster";

interface MovieSpotlightProps {
  movie: Movie;
}

export function MovieSpotlight({ movie }: MovieSpotlightProps) {
  const stats = [
    { label: "Rating", value: formatRating(movie.rating) },
    { label: "Runtime", value: movie.runtime },
    { label: "Release", value: movie.releaseDate ?? movie.releaseYear },
  ];

  return (
    <Surface className="overflow-hidden p-4 lg:p-5">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-surface-strong">
          <MoviePoster
            src={movie.Poster}
            title={movie.Title}
            className="aspect-[4/5] h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center gap-6 rounded-[1.8rem] border border-white/8 bg-black/10 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border-gold/20 bg-gold/10 text-gold">Featured Pick</Badge>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {movie.titleType ?? "Movie"}
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {[movie.releaseYear, movie.runtime, movie.rated].filter(Boolean).join(" / ")}
            </p>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {movie.title}
            </h2>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              {movie.synopsis ?? movie.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.4rem] border border-white/8 bg-surface-strong px-4 py-4"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {movie.genres.slice(0, 4).map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-white/10 bg-surface-strong px-3 py-1 text-sm text-foreground"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm leading-7 text-muted-foreground">
              Cast: <span className="font-medium text-foreground">{movie.cast.join(", ")}</span>
            </p>
            <Link
              href={`/movies/${movie.imdbID}`}
              className="stream-button stream-button--primary animate-button-glow"
            >
              Open movie details
            </Link>
          </div>
        </div>
      </div>
    </Surface>
  );
}

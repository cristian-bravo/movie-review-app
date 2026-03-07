import { Badge } from "@/components/ui/Badge";
import type { Movie } from "@/types";
import { formatRating } from "@/utils/formatRating";

import { MoviePoster } from "@/components/movies/MoviePoster";

import styles from "@/features/movies/components/MovieHero.module.css";

interface MovieHeroProps {
  movie: Movie;
}

export function MovieHero({ movie }: MovieHeroProps) {
  const infoChips = [
    movie.releaseDate ?? movie.releaseYear,
    movie.runtime,
    movie.rated,
    movie.titleType,
  ].filter(Boolean);

  const highlightStats = [
    { label: "Rating", value: formatRating(movie.rating) },
    { label: "Votes", value: movie.votes ?? "Unavailable" },
    { label: "Director", value: movie.director ?? "Unavailable" },
  ];

  return (
    <section
      className={`${styles.hero} relative rounded-[2.4rem] border border-white/10 bg-cover bg-center shadow-card`}
      style={{ backgroundImage: `url(${movie.backdrop ?? movie.poster})` }}
    >
      <div className="relative z-10 grid gap-8 p-5 md:p-8 xl:grid-cols-[0.46fr_1fr] xl:p-10">
        <div className="mx-auto w-full max-w-sm xl:max-w-none">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-surface-strong shadow-card">
            <MoviePoster
              src={movie.Poster}
              title={movie.Title}
              className="aspect-[2/3] h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex min-h-full flex-col justify-end gap-6 xl:py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border-gold/18 bg-gold/12 text-gold">Movie Details</Badge>
            {movie.source === "omdb" ? (
              <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/78">
                Live catalog data
              </span>
            ) : null}
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
              {infoChips.join(" / ")}
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl xl:text-6xl">
              {movie.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-white/78">
              {movie.synopsis ?? movie.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {highlightStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.5rem] border border-white/10 bg-black/24 px-4 py-4 backdrop-blur-xl"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/58">
                  {stat.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-white sm:text-base">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {(movie.genres.length > 0 ? movie.genres : ["Feature film"]).map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-sm text-white"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="grid gap-4 text-sm text-white/75 md:grid-cols-2">
            <p>
              Writer: <span className="font-medium text-white">{movie.writer ?? "Unavailable"}</span>
            </p>
            <p>
              Cast:{" "}
              <span className="font-medium text-white">
                {movie.cast.join(", ") || "Unavailable"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

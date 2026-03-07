import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { Surface } from "@/components/ui/Surface";
import { MovieHero } from "@/features/movies";
import { ReviewsSection } from "@/features/reviews";
import { mockReviews } from "@/lib/mockReviews";
import { omdbService } from "@/services/omdb.service";

interface MovieDetailsPageProps {
  params: Promise<{
    movieId: string;
  }>;
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { movieId } = await params;
  const detailsResult = await omdbService.getMovieDetails(movieId);
  const movie = detailsResult.item;

  if (!movie) {
    notFound();
  }

  const seededReviews = mockReviews.filter((review) => review.movieId === movieId);
  const detailCards = [
    { label: "Release", value: movie.releaseDate ?? movie.releaseYear },
    { label: "Certification", value: movie.rated ?? "Unavailable" },
    { label: "Color", value: movie.colorations?.join(", ") || "Unavailable" },
    { label: "Keywords", value: movie.keywords?.join(", ") || "Unavailable" },
  ];

  return (
    <Container className="section-spacing stack-gap">
      <MovieHero movie={movie} />

      {detailsResult.error ? <StatusBanner tone="info" message={detailsResult.error} /> : null}

      <section className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
        <Surface className="space-y-6 p-6 lg:p-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Synopsis
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              Story and context
            </h2>
          </div>

          <p className="text-base leading-8 text-muted-foreground">
            {movie.synopsis ?? movie.description}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.6rem] border border-white/10 bg-surface-strong p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Director
              </p>
              <p className="mt-3 text-base font-semibold text-foreground">
                {movie.director ?? "Unavailable"}
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-surface-strong p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Writer
              </p>
              <p className="mt-3 text-base font-semibold text-foreground">
                {movie.writer ?? "Unavailable"}
              </p>
            </div>
          </div>
        </Surface>

        <div className="grid gap-4">
          {detailCards.map((card) => (
            <Surface key={card.label} className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-3 text-base font-semibold leading-7 text-foreground">
                {card.value}
              </p>
            </Surface>
          ))}

          <Surface className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Cast
            </p>
            <p className="mt-3 text-base leading-8 text-foreground">
              {movie.cast.join(", ") || "Unavailable"}
            </p>
          </Surface>

          <Surface className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Rating note
            </p>
            <p className="mt-3 text-base leading-8 text-foreground">
              {movie.ratingReason ?? "No additional certification note returned by the API."}
            </p>
          </Surface>
        </div>
      </section>

      <ReviewsSection movieId={movie.id} initialReviews={seededReviews} />
    </Container>
  );
}

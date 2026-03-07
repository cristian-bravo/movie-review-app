import { Container } from "@/components/layout/Container";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { MovieGrid, MovieSpotlight } from "@/features/movies";
import { omdbService } from "@/services/omdb.service";

export default async function MoviesPage() {
  const featuredMovies = await omdbService.getFeaturedMovies(4);
  const spotlightMovie = featuredMovies[0] ?? null;

  return (
    <Container className="section-spacing stack-gap">
      <div className="grid gap-4">
        <p className="eyebrow">Featured</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Streaming-ready featured collection
        </h1>
        <p className="section-subtitle max-w-3xl">
          A focused lineup of live OMDb titles used to power the home hero, detail pages, and the
          broader browsing system.
        </p>
      </div>

      {featuredMovies.length === 0 ? (
        <StatusBanner
          tone="error"
          message="Unable to load featured movies right now. Check the OMDb connection and try again."
        />
      ) : null}

      {spotlightMovie ? <MovieSpotlight movie={spotlightMovie} /> : null}

      <MovieGrid
        eyebrow="Library"
        title="Live movie selection"
        description="All titles below are coming from OMDb responses rather than local mock movie data."
        movies={featuredMovies}
        emptyTitle="Unable to load movies"
        emptyDescription="The featured movie feed is unavailable right now."
        emptyActionHref="/catalog"
        emptyActionLabel="Open Catalog"
      />
    </Container>
  );
}

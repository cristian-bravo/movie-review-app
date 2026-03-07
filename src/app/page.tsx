import { Container } from "@/components/layout/Container";
import { HeroSection } from "@/components/layout/HeroSection";
import { MovieRow } from "@/components/movies/MovieRow";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { movieService } from "@/services/movieService";

function getHomeStatusMessage(hasRows: boolean, hasError: boolean) {
  if (!hasError) {
    return null;
  }

  return hasRows
    ? "Some movie rows could not be completed, so the home feed may be partial."
    : "Unable to load the home movie feed right now.";
}

export default async function HomePage() {
  const { heroMovie, rows, error } = await movieService.getHomeMovies();
  const hasRows = rows.some((row) => row.movies.length > 0);
  const statusMessage = getHomeStatusMessage(hasRows, Boolean(error));

  return (
    <>
      <HeroSection movie={heroMovie} />

      <section className="relative z-20 pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
        <Container variant="wide" className="grid min-w-0 gap-1 sm:gap-2">
          {statusMessage ? (
            <StatusBanner tone={hasRows ? "info" : "error"} message={statusMessage} />
          ) : null}

          {rows.map((row) => (
            <MovieRow
              key={row.id}
              title={row.title}
              movies={row.movies}
            />
          ))}
        </Container>
      </section>
    </>
  );
}

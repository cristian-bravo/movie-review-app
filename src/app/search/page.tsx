import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/movies/SearchBar";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { Surface } from "@/components/ui/Surface";
import { MovieGrid } from "@/features/movies";
import { omdbService } from "@/services/omdb.service";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const searchValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = searchValue?.trim() ?? "";
  const featuredMovies = query ? [] : await omdbService.getFeaturedMovies(4);
  const result = query
    ? await omdbService.searchMovies(query, 8)
    : {
        items: featuredMovies,
        totalResults: featuredMovies.length,
        source: "omdb" as const,
        error: featuredMovies.length === 0 ? "Unable to load featured movies." : null,
      };

  const summaryCards = [
    {
      label: "Results",
      value: String(result.items.length),
    },
    {
      label: "Mode",
      value: query ? "Search" : "Featured",
    },
    {
      label: "Query",
      value: query || "Live Picks",
    },
  ];

  return (
    <Container className="section-spacing stack-gap">
      <section className="hero-shell relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/90 px-5 py-8 shadow-card backdrop-blur-2xl md:px-8 md:py-10 xl:px-12">
        <div className="relative z-10 grid gap-8">
          <div className="grid gap-4">
            <p className="eyebrow">Search</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl xl:text-6xl">
              Search the live movie library.
            </h1>
            <p className="section-subtitle max-w-3xl">
              Look up a specific title and move directly into the same polished card system and
              detail experience used across the catalog.
            </p>
          </div>

          <SearchBar
            defaultValue={query}
            buttonLabel="Run Search"
            helperText="Use titles, franchises, or broad terms. Results come directly from the OMDb search endpoint with valid poster filtering."
          />

          <div className="grid gap-4 md:grid-cols-3">
            {summaryCards.map((card) => (
              <Surface key={card.label} className="p-5">
                <p className="metric-label text-muted-foreground">{card.label}</p>
                <p className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
                  {card.value}
                </p>
              </Surface>
            ))}
          </div>
        </div>
      </section>

      {result.error ? <StatusBanner tone="error" message={result.error} /> : null}

      <MovieGrid
        eyebrow={query ? "Results" : "Live Picks"}
        title={query ? `Results for "${query}"` : "Featured movies before search"}
        description="Each tile links directly to the movie details page, where you can inspect metadata and publish a review."
        movies={result.items}
        emptyTitle="No movies found"
        emptyDescription="Try a broader title, a franchise name, or another live search term."
      />
    </Container>
  );
}

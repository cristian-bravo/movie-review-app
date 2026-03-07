import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/movies/SearchBar";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { Surface } from "@/components/ui/Surface";
import { MovieGrid } from "@/features/movies";
import { movieService } from "@/services/movieService";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse a cinematic catalog of movie titles with responsive poster cards and rich detail pages.",
};

function getCatalogStatusMessage(hasItems: boolean, hasError: boolean) {
  if (!hasError) {
    return null;
  }

  return hasItems ? "Some OMDb requests did not complete, so the catalog may be partial." : "Unable to load movies";
}

export default async function CatalogPage() {
  const result = await movieService.getCatalogMovies();
  const statusMessage = getCatalogStatusMessage(result.items.length > 0, Boolean(result.error));

  const summaryItems = [
    {
      label: "Titles",
      value: `${result.items.length}`,
    },
    {
      label: "Collections",
      value: `${result.queries.length}`,
    },
    {
      label: "Mode",
      value: "Live",
    },
  ];

  return (
    <Container className="section-spacing stack-gap">
      <section className="hero-shell relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/90 px-5 py-10 shadow-card backdrop-blur-2xl md:px-8 md:py-14 xl:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.18),transparent_18%),radial-gradient(circle_at_left,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_right,rgba(147,51,234,0.2),transparent_26%)]" />

        <div className="relative z-10 mx-auto max-w-5xl space-y-8 text-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Catalog
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl xl:text-6xl">
              Discover great movies
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
              Browse popular titles and explore details.
            </p>
          </div>

          <div className="mx-auto w-full max-w-3xl">
            <SearchBar
              action="/search"
              buttonLabel="Search Movies"
              placeholder="Search by title, director, or mood..."
              helperText="Start with live catalog rows, then jump into direct search when you want something more specific."
              suggestions={["Batman", "Avengers", "Star", "Dune", "Interstellar"]}
              className="bg-white/6 text-left"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/6 px-5 py-5 shadow-soft backdrop-blur-xl"
              >
                <p className="text-sm font-medium text-muted-foreground opacity-70">{item.label}</p>
                <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {result.queries.map((query) => (
              <span
                key={query}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground"
              >
                {query}
              </span>
            ))}
          </div>
        </div>
      </section>

      {statusMessage ? (
        <StatusBanner
          tone={result.items.length > 0 ? "info" : "error"}
          message={statusMessage}
        />
      ) : null}

      {result.error && result.items.length === 0 ? (
        <Surface className="mx-auto max-w-3xl p-6 text-center lg:p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                Unable to load movies
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                The catalog request failed. Retry the catalog or switch to direct search while the
                OMDb feed reconnects.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/catalog"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-electric via-primary to-pink-glow px-5 text-sm font-semibold text-primary-foreground transition duration-300 hover:brightness-110"
              >
                Retry
              </Link>
              <Link
                href="/search"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/12 px-5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-white/5"
              >
                Open Search
              </Link>
            </div>
          </div>
        </Surface>
      ) : (
        <MovieGrid
          eyebrow="Popular Picks"
          title="Streamline your next watch"
          description="A clean poster wall with stronger hierarchy, wider spacing, and responsive columns designed for mobile, tablet, laptop, and desktop browsing."
          movies={result.items}
          cardVariant="catalog"
          gridClassName="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          emptyTitle="Unable to load movies"
          emptyDescription="The catalog could not be assembled right now. Open search to try a direct title lookup."
          emptyActionHref="/search"
          emptyActionLabel="Open Search"
        />
      )}
    </Container>
  );
}

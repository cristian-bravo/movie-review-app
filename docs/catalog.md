# Catalog

## Purpose

The catalog route introduces a browse-first movie wall at `/catalog`.

Instead of waiting for a user query, the page builds a discovery-ready collection by running a fixed set of broad search terms against OMDb and merging the results into one responsive grid.

## Query Strategy

The catalog currently uses these predefined search terms:

- `batman`
- `avengers`
- `star`
- `dune`
- `interstellar`

These searches are executed in parallel and then merged.

## Deduplication

OMDb search results come from:

```text
${process.env.OMDB_BASE_URL}?apikey=${process.env.OMDB_API_KEY}&s=<query>
```

Movies are read from `data.Search`.

Only entries with a valid poster are kept:

- `Poster !== "N/A"`

OMDb search results use `imdbID` as the stable identifier.

Inside the application, that identifier is normalized into `Movie.id`, so the catalog deduplicates the merged result set by `Movie.id`.

This keeps the UI free from repeated posters when the same title appears in more than one query group.

## Architecture

Service responsibilities:

- `src/services/omdb.service.ts`
  Handles low-level OMDb search and detail requests, mapping raw `Search` results into the shared `Movie` type.
- `src/services/movieService.ts`
  Handles catalog-specific orchestration by running multiple searches, merging results, and removing duplicates.

Presentation responsibilities:

- `src/app/catalog/page.tsx`
  Owns the route composition, summary metrics, and page-level messaging.
- `src/features/movies/components/MovieGrid.tsx`
  Renders responsive movie collections with configurable card variants and empty-state actions.
- `src/components/movies/MovieCard.tsx`
  Renders the catalog card surface with poster, title, year, and detail CTA.

## UI Decisions

The catalog UI is intentionally cinematic and browse-first:

- large poster surfaces
- centered card composition
- calm typography hierarchy
- subtle hover lift
- responsive layout from mobile to ultrawide screens

Grid behavior:

- mobile: 1 column
- tablet: 2 columns
- desktop and large screens: 4 columns

## Loading, Error, and Empty States

The route includes dedicated App Router states:

- `src/app/catalog/loading.tsx`
  Uses skeleton cards that match the final grid rhythm.
- `src/app/catalog/error.tsx`
  Provides retry and redirect actions without exposing provider details to end users.
- `MovieGrid` empty state
  Gives a clear action back to direct search.

## Poster Rendering

Catalog posters use the raw OMDb `Poster` field.

Rendering behavior:

- `MovieCard` passes `movie.Poster` into the shared poster component
- if `Poster` is unavailable or equal to `N/A`, the UI falls back to `/placeholder-poster.png`
- if the remote browser request fails, the same placeholder is applied

This keeps the catalog visually consistent even when OMDb returns incomplete image data.

## Environment Variables

The catalog depends on these variables:

```bash
OMDB_API_KEY=8040347c
OMDB_BASE_URL=https://www.omdbapi.com/
```

The variable names are intentionally stable and should not be changed because the service layer reads them directly.

## Provider Decision

OMDb is the active provider for this catalog.

Why not IMDb:

- official IMDb access is paid
- OMDb is already approved for this project
- OMDb is simpler and more practical for current development and deployment

The provider choice stays isolated behind the service layer, so migrating later remains feasible.

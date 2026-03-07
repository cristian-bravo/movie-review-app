# Catalog UI

## Objective

The catalog UI was refactored to feel closer to a real streaming product instead of a prototype.

The work focused on three areas:

- stronger poster presentation
- cleaner typography hierarchy
- a more balanced responsive grid

## Architecture

The catalog UI keeps data, image handling, and layout concerns separated.

Key files:

- `src/app/catalog/page.tsx`
  Composes the route-level hero, search entry, summary stats, and grid section.
- `src/features/movies/components/MovieGrid.tsx`
  Handles responsive collection rendering and empty-state behavior.
- `src/components/movies/MovieCard.tsx`
  Renders the card shell, title block, and CTA.
- `src/components/movies/MoviePoster.tsx`
  Handles poster fallback behavior and remote-image resilience.
- `src/components/movies/MovieSkeleton.tsx`
  Provides the catalog loading placeholder.

## Poster Loading

Movie posters come from OMDb.

The shared `Movie` contract normalizes poster URLs into `movie.poster`, and the UI also supports the raw provider-shaped `movie.Poster` field for resilience.

Poster flow:

1. The service layer maps OMDb `Poster` into the shared movie object.
2. `MoviePoster` resolves the best available source.
3. If the poster is missing or equal to `N/A`, the component falls back to a local placeholder.
4. If the remote request fails in the browser, the component swaps to the same fallback asset.

This avoids empty or broken poster surfaces in the catalog.

## Responsive Grid

The catalog grid is designed for wide poster cards with breathing room.

Breakpoints:

- mobile: 1 column
- tablet: 2 columns
- laptop: 3 columns
- desktop: 4 columns

Grid class:

```text
grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

## Typography

The catalog typography now follows a simpler hierarchy:

- page title: large display headline with bold tracking-tight styling
- subtitle: short supporting sentence in `text-lg`
- card title: `text-xl` with stronger weight
- metadata: smaller low-contrast supporting text

This keeps the UI readable while letting posters carry more of the visual weight.

## Loading and Error States

The catalog route includes dedicated route-level states:

- `src/app/catalog/loading.tsx`
  Shows 8 `MovieSkeleton` cards.
- `src/app/catalog/error.tsx`
  Shows a centered error panel with retry and search actions.

## Design Direction

The visual direction is intentionally cinematic:

- rounded poster cards
- stronger shadows
- subtle hover lift
- gradient CTA buttons
- centered discovery hero

There is no provider branding in the visible catalog UI.

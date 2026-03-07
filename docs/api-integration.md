# API Integration

## Provider Choice

The application now integrates with OMDb:

- https://www.omdbapi.com/

## Why OMDb

OMDb is the live provider for practical reasons:

- the team has permission to use it
- the official IMDb developer access is paid
- OMDb is operationally simpler for this project's current needs
- the app architecture still keeps the provider replaceable later

## Runtime Requirements

The service expects:

```bash
OMDB_API_KEY=your_omdb_api_key_here
OMDB_BASE_URL=https://www.omdbapi.com/
```

## Service File

Primary integration seam:

- `src/services/omdb.service.ts`

Public methods:

- `searchMovies(query, limit)`
- `getMovieDetails(id)`
- `getFeaturedMovies(limit)`

Catalog orchestration:

- `src/services/movieService.ts`
- `getCatalogMovies(perQueryLimit)`

## Request Strategy

The service currently follows this flow:

1. `searchMovies` calls OMDb search with `s=<query>`.
2. Matching search results are enriched through follow-up detail requests with `i=<imdbID>`.
3. `getMovieDetails` loads one title with full plot data.
4. `getFeaturedMovies` resolves a curated list of OMDb title IDs so the home page and catalog can use live data.
5. `getCatalogMovies` runs multiple broad OMDb searches in parallel, merges the results, and removes duplicates by `imdbID`.

## Resilience Strategy

If OMDb configuration is incomplete or requests fail:

- search returns an error state instead of local mock movie content
- title details return `null` with an error message
- featured surfaces render empty or degraded states rather than fabricated movie data

## Mapping Layer

Raw OMDb payloads are mapped into the shared `Movie` type before reaching route or component code.

Mapped fields include:

- title text
- release date and release year
- runtime
- rating and vote count
- genres
- plot
- directors, writers, and cast
- title type
- language and country
- awards
- certification
- poster URL when available

## Route Usage

Route handlers under `src/app/api` consume the same service:

- `/api/movies`
- `/api/movies/[movieId]`

This keeps the page layer and API layer aligned around one integration contract.

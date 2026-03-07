# Features

## Home

Route:

- `/`

Behavior:

- uses `getFeaturedMovies` for the hero content and featured lineup
- exposes the main reusable search entry
- highlights product capabilities, community activity, and featured movies in a cleaner editorial sequence
- acts as the visual tone setter for the rest of the application

## Search

Route:

- `/search`

Behavior:

- reads the `q` query parameter
- resolves live OMDb movie results through `searchMovies`
- displays result counts, source feedback, errors, and empty states
- reuses the same `MovieGrid` and `MovieCard` components as the rest of the product

## Catalog

Route:

- `/catalog`

Behavior:

- performs multiple predefined broad searches in parallel
- merges the responses into one collection and removes duplicates by movie id
- renders a browse-first discovery wall with stronger poster-first card styling
- uses a centered hero message and search surface for top-of-page discovery
- includes dedicated loading, error, and empty states

## Movie Details

Route:

- `/movies/[movieId]`

Behavior:

- fetches a single title through `getMovieDetails`
- renders a large hero with richer metadata
- shows synopsis, cast, release data, keywords, and certification context
- mounts the full review section below the detail surface

## Reviews

Behavior:

- reviews are stored in local storage
- seeded reviews keep the interface populated for known mock titles
- local reviews merge into the same presentation flow
- authenticated users publish reviews under their local profile identity

## Authentication

Routes:

- `/login`
- `/register`
- `/profile`
- `/auth/session`

Behavior:

- local auth service seeds a demo account
- register creates a local user record and session
- login restores a local session
- profile reads local auth state and local review history

## Theme Switching

Behavior:

- dark mode is the default experience
- users can toggle to light mode from the navbar
- preference is persisted in local storage
- theme is applied before hydration to reduce flicker

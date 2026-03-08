# Architecture

## Overview

The application preserves the original scaffold boundaries and extends them with functional modules:

- `src/app` contains route composition and API handlers
- `src/components` contains shared UI and layout primitives
- `src/features` contains domain composition for auth, movies, and reviews
- `src/services` contains OMDb integration plus client-side bridges for auth, reviews, and theme
- `src/lib` contains constants, seed data, MongoDB helpers, and server auth utilities
- `src/types` contains shared contracts
- `src/utils` contains framework-agnostic helpers

This keeps the project scalable while allowing the current product to feel complete enough for real UI and flow validation.

## Runtime Boundaries

### Server-Side

- movie search and movie details data retrieval
- OMDb API orchestration
- MongoDB-backed auth session handling
- cookie issuance and session validation
- route-level composition for app pages
- API route wrappers under `src/app/api`

### Client-Side

- theme persistence
- local review creation and retrieval
- auth session refresh and cross-tab sync against server session endpoints
- interactive form handling

This split keeps browser-only state out of server code while preserving thin route files.

## Service Layer

Current services:

- `omdb.service.ts`
- `auth.service.ts`
- `review.service.ts`
- `theme.service.ts`

### `omdb.service.ts`

- integrates with OMDb through simple REST requests
- resolves catalog and search results through live OMDb requests
- maps raw OMDb responses into the shared `Movie` contract
- returns error states instead of fabricating mock movie content at runtime

### `auth.service.ts`

- acts as the client bridge to `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, and `/api/auth/session`
- keeps React auth state in sync with the server session
- emits lightweight client-side sync events after auth changes

### `review.service.ts`

- stores user reviews in local storage
- merges seeded reviews with local reviews
- exposes movie-scoped and user-scoped review retrieval

### `theme.service.ts`

- reads and writes persisted theme preference
- applies the selected theme to the document root

## Auth Infrastructure

Mongo-backed auth infrastructure lives outside the client service layer:

- `src/lib/mongodb.ts` manages MongoDB connection setup and env fallbacks
- `src/lib/auth/server.ts` handles password hashing, users, sessions, indexes, and cookie helpers
- `scripts/migrate-auth.mjs` ensures auth indexes and optionally seeds a demo account

## Provider Layer

Two client providers sit near the root layout:

- `ThemeProvider`
- `AuthProvider`

This keeps navigation, forms, profile UI, and theme toggle behavior decoupled from route files.

## Presentation Layer

The presentation layer is intentionally split:

- shared primitives in `src/components`
- domain composition in `src/features`
- route-specific composition in `src/app`

Examples:

- `SearchBar`, `Surface`, `Badge`, and `StatusBanner` are reusable primitives
- `MovieHero`, `MovieGrid`, `ReviewsSection`, and `ProfileDashboard` are feature-level assemblies
- `src/app/page.tsx`, `src/components/layout/HeroSection.tsx`, and `src/components/movies/MovieRow.tsx` handle home-page-specific composition without leaking that styling into the rest of the app

## Data Flow Direction

Preferred flow:

`route -> service or lib -> feature component -> shared component`

For browser-only state:

`provider or client service -> feature component -> shared component`

This direction keeps provider logic out of visual primitives and prevents raw OMDb payloads from leaking into UI code.

## Provider Choice Note

OMDb is the active movie-data provider because it is approved for practical use in this project.
The official IMDb developer access is paid and less practical for the current scope, so the provider boundary remains isolated in case that decision changes later.

## Scalability

The current structure is ready for these next steps:

- replace local reviews with database-backed persistence
- extend auth beyond the current email/password flow if the product grows
- add server actions or authenticated API mutations
- add tests per service, component, and feature flow
- continue polishing route-specific presentation without weakening architectural boundaries

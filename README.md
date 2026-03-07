# Movie Review App

Movie Review App is a cinematic movie discovery application built with Next.js App Router, React, TypeScript, and Tailwind CSS.

The project started as a scaffold and now includes a functional OMDb-backed movie flow, a redesigned frontend, local review persistence, mock local authentication, and persistent dark/light mode.

## Current Product State

The application currently supports:

- catalog discovery in `/catalog` using real OMDb search results merged into one deduplicated wall
- refactored streaming-style home feed with a featured movie hero and horizontal browse rows
- refactored movie tiles, search surfaces, and theme toggle
- OMDb-backed movie search in `/search`
- richer movie details in `/movies/[movieId]`
- OMDb-backed featured movie retrieval for home and catalog surfaces
- local review creation with profile-linked authors when a session exists
- local auth flow for login, register, logout, and profile
- persistent theme switching with pre-hydration theme application
- responsive cinematic UI across home, search, movie details, auth, and profile

## Provider Decision

The live movie provider is now OMDb.

Reason:

- the official IMDb developer access is paid and operationally heavier for this project
- OMDb was approved for use and is more practical for day-to-day development and deployment
- the service boundary keeps the provider replaceable in the future if IMDb access becomes worthwhile later

## Recent Updates

Most recent architectural and frontend changes:

- added a dedicated `/catalog` discovery route backed by a service-level query aggregator
- connected the catalog directly to OMDb search queries for Batman, Avengers, Star, Dune, and Interstellar
- replaced the old home landing composition with a streaming-style hero plus horizontal title rows
- rebuilt the hero, poster cards, search bar, grid, and theme toggle around a modular streaming-style CSS architecture
- introduced dedicated style modules under `src/styles` instead of growing a single global CSS file
- switched the live provider from IMDb to OMDb
- removed AWS Data Exchange integration and related dependency weight
- adapted all movie endpoints and route messages to the OMDb flow
- preserved the redesigned frontend and current visual hierarchy
- kept documentation aligned with the actual implementation state

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- OMDb API

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
OMDB_API_KEY=8040347c
OMDB_BASE_URL=https://www.omdbapi.com/
```

How they work:

- `OMDB_API_KEY` authenticates requests to the OMDb search and detail endpoints
- `OMDB_BASE_URL` defines the base endpoint used by the service layer

Next.js reads these values from `.env.local` at runtime. The movie UI no longer depends on local mock movie data.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Demo Auth

The local auth service seeds a demo user:

```text
email: elena@example.com
password: demo1234
```

## Visual Overview

Current UI surfaces worth capturing in future screenshots:

- Home page featured movie hero and horizontal streaming rows
- Catalog page cinematic discovery wall and poster grid
- Search page hero with summary metrics and result grid
- Movie details hero, metadata panels, and review section
- Login/register split authentication layout
- Profile dashboard with review activity

## Project Structure

```text
movie-review-app/
|- docs/
|- public/
|- src/
|  |- app/
|  |- components/
|  |- features/
|  |- hooks/
|  |- lib/
|  |- services/
|  |- styles/
|  |- types/
|  `- utils/
|- .env.example
|- next.config.ts
|- package.json
`- tsconfig.json
```

## Notes

- Movie data is fetched through `src/services/omdb.service.ts`.
- The catalog route merges OMDb search queries through `src/services/movieService.ts`.
- `searchMovies(query)` calls `?apikey=<key>&s=<query>` and reads movies from `data.Search`.
- Search results keep the raw OMDb fields `imdbID`, `Title`, `Year`, and `Poster` while also preserving the app's normalized movie fields.
- Poster rendering is handled through `src/components/movies/MoviePoster.tsx`, which swaps to `/placeholder-poster.png` if the OMDb poster is missing, `N/A`, or fails in the browser.
- The UI styling system now lives under `src/styles/` with small focused files for globals, layout, animations, utilities, and component modules.
- The UI is cinematic in dark mode and more editorial in light mode.
- Auth, theme, and reviews are still client-side services backed by local storage.

## Documentation

- [Architecture](./docs/architecture.md)
- [Catalog](./docs/catalog.md)
- [CSS Architecture](./docs/css-architecture.md)
- [Catalog UI](./docs/catalog-ui.md)
- [Development](./docs/development.md)
- [UI Design](./docs/ui-design.md)
- [API Integration](./docs/api-integration.md)
- [Components](./docs/components.md)
- [Features](./docs/features.md)
- [Decisions](./docs/decisions.md)
- [Prompt History](./docs/prompts-history.md)
- [Catalog Prompt Record](./docs/prompt-history/catalog-generation.md)
- [Catalog API Prompt Record](./docs/prompt-history/catalog-api-connection.md)
- [Catalog UI Prompt Record](./docs/prompt-history/catalog-ui-refactor.md)
- [Home Streaming Layout Prompt Record](./docs/prompt-history/home-streaming-layout.md)
- [Streaming UI Prompt Record](./docs/prompt-history/ui-streaming-refactor.md)

## OMDb Documentation

- https://www.omdbapi.com/

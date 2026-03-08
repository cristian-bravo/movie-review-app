<div align="center">
  <img src="./public/logo/logo-movie.png" alt="ReelReview logo" width="96" />
  <h1>ReelReview</h1>
  <p><strong>Cinematic movie discovery and review platform built with Next.js, OMDb, and MongoDB.</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs" alt="Next.js 15 badge" />
    <img src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white" alt="React 19 badge" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5 badge" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4 badge" />
    <img src="https://img.shields.io/badge/MongoDB-Auth-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB badge" />
    <img src="https://img.shields.io/badge/OMDb-Live_Data-1F6FEB?style=for-the-badge" alt="OMDb API badge" />
  </p>
</div>

ReelReview is a cinematic movie discovery application built with Next.js App Router, React, TypeScript, and Tailwind CSS.

The project started as a scaffold and now includes a live OMDb-backed movie flow, a redesigned streaming-style frontend, MongoDB-backed authentication, local review persistence, and persistent dark/light mode.

Quick highlights:

- :clapper: Streaming-style home feed with a rotating featured movie hero and horizontal browse rows
- :lock: MongoDB-backed login, register, logout, session, and profile flow with cookie-based sessions
- :milky_way: Responsive split auth experience with a CSS aurora background on `/login`
- :iphone: Cinematic UI across home, catalog, search, movie details, auth, and profile

---

## Table of Contents

- [Current Product State](#current-product-state)
- [Provider Decision](#provider-decision)
- [Recent Updates](#recent-updates)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Demo Auth](#demo-auth)
- [Visual Overview](#visual-overview)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Notes](#notes)
- [Documentation](#documentation)
- [OMDb Documentation](#omdb-documentation)

---

## Current Product State

The application currently supports:

- catalog discovery in `/catalog` using real OMDb search results merged into one deduplicated wall
- a streaming-style home feed with a featured movie hero, viewer score highlight, and browse rows
- refactored movie tiles, search surfaces, footer, navbar, and theme toggle
- OMDb-backed movie search in `/search`
- richer movie details in `/movies/[movieId]`
- OMDb-backed featured movie retrieval for home and catalog surfaces
- local review creation with profile-linked authors when a session exists
- MongoDB-backed auth flow for login, register, logout, session, and profile
- redesigned `/login` and `/register` split layouts with stronger hero/auth panel balance
- a CSS animated aurora background for `/login`
- persistent theme switching with pre-hydration theme application
- responsive cinematic UI across home, catalog, search, movie details, auth, and profile

## Provider Decision

The live movie provider remains OMDb.

Reason:

- the official IMDb developer access is paid and operationally heavier for this project
- OMDb was approved for use and is more practical for day-to-day development and deployment
- the service boundary keeps the movie provider replaceable in the future if IMDb access becomes worthwhile later

Authentication persistence is handled separately through MongoDB so the movie-data decision stays isolated from the auth stack.

## Recent Updates

Most recent architectural and frontend changes:

- moved authentication from local mock state to MongoDB-backed API routes with cookie sessions
- added a database migration/bootstrap script for auth indexes and optional demo account seeding
- redesigned `/login` and `/register` into a split auth layout with improved hero/auth panel balance
- added a CSS-only aurora background to `/login` to reduce empty space and improve atmosphere
- refined the streaming-style home hero, footer, navbar, and browse-row interactions
- introduced dedicated style modules under `src/styles` instead of growing a single global CSS file
- kept OMDb as the live movie provider and preserved the service boundary around it
- preserved the redesigned frontend while aligning the documentation with the actual implementation state

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- MongoDB
- OMDb API
- anime.js for selected UI motion

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
OMDB_API_KEY=8040347c
OMDB_BASE_URL=https://www.omdbapi.com/

MONGODB_URI=
MONGODB_DB=
AUTH_SEED_DEMO=false
```

Recommended usage:

- `OMDB_API_KEY` authenticates requests to the OMDb search and detail endpoints
- `OMDB_BASE_URL` defines the base endpoint used by the movie service layer
- `MONGODB_URI` points the auth layer to MongoDB
- `MONGODB_DB` optionally pins the database name when it is not already included in the URI
- `AUTH_SEED_DEMO=true` seeds the demo account when you run `npm run db:migrate`

Compatibility aliases are also supported for MongoDB:

- `DATABASE_URL`
- `MONGO_URI`
- `MONGODB_URL`
- `MONGO_DB_NAME`

Next.js reads these values from `.env.local` at runtime. The movie UI no longer depends on local mock movie data, and auth now requires a working MongoDB connection.

## Getting Started

```bash
npm install
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`.

If you want the demo account, set `AUTH_SEED_DEMO=true` before running `npm run db:migrate`.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run db:migrate
```

## Demo Auth

The auth migration can seed a demo user when `AUTH_SEED_DEMO=true`:

```text
email: elena@example.com
password: demo1234
```

Run `npm run db:migrate` after enabling the seed flag.

## Visual Overview

Current UI surfaces worth capturing in future screenshots:

- Home page featured movie hero and horizontal streaming rows
- Catalog page cinematic discovery wall and poster grid
- Search page hero with summary metrics and result grid
- Movie details hero, metadata panels, and review section
- Login/register split authentication layout
- Profile dashboard with review activity

## Screenshots

Screenshot placeholders for future updates:

- home hero and browse rows
- catalog discovery wall
- movie detail page
- auth split layout
- profile dashboard

## Project Structure

```text
movie-review-app/
|- docs/
|- public/
|  `- logo/
|- scripts/
|- src/
|  |- app/
|  |  |- api/
|  |  |- catalog/
|  |  |- login/
|  |  |- movies/
|  |  |- profile/
|  |  |- register/
|  |  `- search/
|  |- components/
|  |- features/
|  |- hooks/
|  |- lib/
|  |- services/
|  |- styles/
|  |- types/
|  `- utils/
|- styles/
|- .env.example
|- package.json
`- README.md
```

## Notes

- Movie data is fetched through `src/services/omdb.service.ts`.
- The catalog route merges OMDb search queries through `src/services/movieService.ts`.
- `searchMovies(query)` calls `?apikey=<key>&s=<query>` and reads movies from `data.Search`.
- Search results keep the raw OMDb fields `imdbID`, `Title`, `Year`, and `Poster` while also preserving the app's normalized movie fields.
- Poster rendering is handled through `src/components/movies/MoviePoster.tsx`, which swaps to `/placeholder-poster.png` if the OMDb poster is missing, `N/A`, or fails in the browser.
- Mongo-backed auth lives in `src/lib/auth/server.ts` and connects through `src/lib/mongodb.ts`.
- Client auth state sync runs through `src/services/auth.service.ts` and the `/api/auth/*` routes.
- Reviews remain local-storage-backed through `src/services/review.service.ts`.
- The auth UI uses a split layout in `src/features/auth/components`, and the `/login` aurora background is defined in `src/styles/global.css`.
- The UI styling system now lives under `src/styles/` with focused files for globals, layout, animations, utilities, and component modules.
- The UI is cinematic in dark mode and more editorial in light mode.

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

## OMDb Documentation

- https://www.omdbapi.com/

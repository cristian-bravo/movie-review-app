# Development Guide

## Prerequisites

- Node.js 20+
- npm 10+
- OMDb API key
- MongoDB connection string for auth routes and migrations

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
OMDB_API_KEY=8040347c
OMDB_BASE_URL=https://www.omdbapi.com/

MONGODB_URI=
MONGODB_DB=
AUTH_SEED_DEMO=false
```

Compatibility aliases are also supported for MongoDB:

- `DATABASE_URL`
- `MONGO_URI`
- `MONGODB_URL`
- `MONGO_DB_NAME`

Next.js only reads runtime values from `.env.local`, not from `.env.example`.

## Run Locally

```bash
npm install
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`.

If you want the demo account, set `AUTH_SEED_DEMO=true` before running `npm run db:migrate`.

## Validation

Main validation commands:

```bash
npm run lint
npm run typecheck
npm run build
```

These are the expected checks after service changes, route updates, auth changes, or frontend redesign work.

## Recommended Workflow

1. Update domain contracts in `src/types` first when data shape changes.
2. Keep external integration changes inside `src/services` or `src/lib`.
3. Build feature-specific behavior inside `src/features`.
4. Use `src/components` only for shared reusable primitives.
5. Keep route files in `src/app` focused on orchestration and layout composition.
6. Keep route-specific presentation isolated when a page needs custom styling.
7. Update the docs whenever architecture, feature behavior, provider strategy, auth strategy, or UI strategy changes.

## Conventions

### General

- TypeScript everywhere.
- Server components by default.
- Client components only where browser APIs or interactivity are required.
- Use the `@/` alias for `src`.

### Styling

- Global style entry lives in `src/app/globals.css`.
- Global CSS is split into small files under `src/styles/`.
- Component-specific styling lives in `src/styles/components/*.module.css`.
- Tailwind is still used for responsive layout and fast utility composition.

### State

- Theme preference is stored in local storage.
- Auth sessions are persisted in MongoDB and exposed to the client through `/api/auth/*` plus an `httpOnly` cookie.
- Reviews are stored in local storage.
- Movie search and movie details are server-fetched through the OMDb integration service.
- Runtime movie content no longer falls back to mock movie records.

### Demo Credentials

The auth migration can seed a demo user when `AUTH_SEED_DEMO=true`:

```text
email: elena@example.com
password: demo1234
```

Run `npm run db:migrate` after enabling the flag.

## Provider Decision

OMDb is used for movie data because it is the practical approved option for the project right now.
MongoDB is used for authentication persistence so login, register, session, and logout behave like a real product flow.

## Documentation Practice

Update documentation whenever one of these changes:

- service strategy
- provider choice
- auth or session flow
- theme system
- component contracts
- feature flows
- major visual redesigns
- environment or migration requirements

# Development Guide

## Prerequisites

- Node.js 20+
- npm 10+
- OMDb API key

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
OMDB_API_KEY=8040347c
OMDB_BASE_URL=https://www.omdbapi.com/
```

Next.js only reads runtime values from `.env.local`, not from `.env.example`.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

Main validation commands:

```bash
npm run lint
npm run typecheck
npm run build
```

These are the expected checks after service changes, route updates, or frontend redesign work.

## Recommended Workflow

1. Update domain contracts in `src/types` first when data shape changes.
2. Keep provider or external integration changes inside `src/services`.
3. Build feature-specific behavior inside `src/features`.
4. Use `src/components` only for shared reusable primitives.
5. Keep route files in `src/app` focused on orchestration and layout composition.
6. Keep route-specific presentation isolated when a page needs custom styling.
7. Update the docs whenever architecture, feature behavior, provider strategy, or UI strategy changes.

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
- Auth is stored in local storage.
- Reviews are stored in local storage.
- Movie search and movie details are server-fetched through the OMDb integration service.
- Runtime movie content no longer falls back to mock movie records.

### Demo Credentials

The local auth service seeds a demo user:

```text
email: elena@example.com
password: demo1234
```

## Provider Decision

OMDb is used because it is the practical approved option for the project right now.
IMDb developer access is not the active choice because it requires paid access and more overhead than the current product needs.

## Documentation Practice

Update documentation whenever one of these changes:

- service strategy
- provider choice
- theme system
- component contracts
- feature flows
- major visual redesigns
- prompts used during implementation

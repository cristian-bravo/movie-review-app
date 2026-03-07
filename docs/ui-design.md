# UI Design

## Visual Direction

The interface is designed as a cinematic product with a more editorial and controlled presentation than the earlier iterations.

Primary visual goals:

- strong first-screen impact on home, search, and movie detail views
- layered glass surfaces instead of flat cards
- large typography for titles and hero copy
- subtle motion through hover elevation, image zoom, and glow transitions
- usable light mode without losing the product identity
- calmer composition with less duplicated visual emphasis

## Color Palette

The palette follows the requested logo-inspired colors:

- Deep Navy: `#0A0A2A`
- Electric Blue: `#2563EB`
- Purple Gradient: `#9333EA`
- Magenta Accent: `#C026D3`
- Gold Accent: `#FACC15`

These tokens now live in `src/styles/variables.css`.

## Theme System

Theme handling is split into three parts:

- `ThemeScript` applies the stored theme before hydration
- `ThemeProvider` manages the active mode in React
- `ThemeToggle` exposes the switch from the navbar

Dark mode is the default cinematic experience.
Light mode keeps the same structure and accents but moves to brighter editorial surfaces and softer shadows.

## Layout Language

The current frontend uses a repeated layout language:

- oversized hero shells for top-of-page impact
- glass panels for modular content areas
- poster-first cards with metadata overlays
- stacked information panels on detail and profile views
- wider containers to support ultrawide screens without feeling cramped

## Home Page Strategy

The home page now follows a streaming front-page pattern instead of a landing-page pattern.

Key changes:

- one dominant featured-movie hero with a taller poster and tighter copy
- horizontal movie rows for discovery instead of a home-page grid
- lower text density and less marketing copy in the first screen
- section rhythm closer to Netflix, Prime Video, and Apple TV+ browsing patterns
- cleaner visual separation between hero storytelling and browse content

Home-specific styling now lives in:

- `src/styles/components/hero-movie.module.css`
- `src/styles/components/movie-row.module.css`

## Motion and Effects

Motion remains subtle and purposeful:

- poster zoom on movie card hover
- small lift on actionable buttons
- gradient overlays on cards and featured surfaces
- film grain and background blur for atmosphere

Advanced visual effects remain isolated in:

- `src/styles/components/hero-movie.module.css`
- `src/styles/components/movie-card.module.css`
- `src/styles/components/movie-row.module.css`
- `src/styles/components/search-bar.module.css`
- `src/styles/components/theme-toggle.module.css`
- `src/features/movies/components/MovieHero.module.css`

## Responsive Strategy

The layout is mobile-first and expands through clear breakpoints:

- mobile: stacked content and single-column flows
- tablet: split panels begin for grids and dashboards
- desktop: hero sections and spotlight rows use asymmetric columns
- ultrawide: larger container width and four-column movie grids with breathing space

## Key Frontend Outcomes

- Home now reads like a streaming platform entry surface instead of a SaaS landing page.
- Search has a clearer hero, stronger query entry, and better result context.
- Movie details feel closer to a premium title page with poster, hero background, metadata, and reviews.
- Login/register and profile now match the quality of the public-facing routes.
- Shared surfaces are more restrained, which improves overall polish.

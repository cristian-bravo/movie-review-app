# CSS Architecture

## Objective

The frontend styling system is now split into small focused CSS files instead of growing one large stylesheet.

This keeps the streaming-style UI maintainable while still allowing richer visual treatments than utility classes alone.

## Global Entry Point

Global CSS enters the app through:

- `src/app/globals.css`

That file only imports Tailwind and the smaller CSS files that define the system.

## File Structure

Global layers:

- `src/styles/variables.css`
  Theme variables, color tokens, shadows, and transition tokens.
- `src/styles/global.css`
  Base resets, font usage, background, selection, and theme transitions.
- `src/styles/layout.css`
  Shared layout atmospherics such as the page backdrop and hero shell treatment.
- `src/styles/animations.css`
  Shared keyframes and animation utility classes.

Shared utility layers:

- `src/styles/utils/spacing.css`
  Section spacing and stack-gap utilities.
- `src/styles/utils/typography.css`
  Shared typography utility classes such as eyebrows and page titles.

Shared component layers:

- `src/styles/components/buttons.css`
  Global button variants reused across pages and components.

Component modules:

- `src/styles/components/hero-movie.module.css`
- `src/styles/components/movie-card.module.css`
- `src/styles/components/movie-grid.module.css`
- `src/styles/components/movie-row.module.css`
- `src/styles/components/movie-skeleton.module.css`
- `src/styles/components/search-bar.module.css`
- `src/styles/components/theme-toggle.module.css`

## How Styles Are Imported

Global files are imported only through `src/app/globals.css`.

Component modules are imported directly by the component they belong to.

Examples:

- `HeroMovie.tsx` imports `hero-movie.module.css`
- `MovieCard.tsx` imports `movie-card.module.css`
- `MovieRow.tsx` imports `movie-row.module.css`
- `SearchBar.tsx` imports `search-bar.module.css`
- `ThemeToggle.tsx` imports `theme-toggle.module.css`

This keeps component-specific styling colocated at the usage boundary without forcing route files to know CSS details.

## Animation Strategy

Shared animations live in `src/styles/animations.css`.

Current animation responsibilities:

- hero entrance fade-up
- staggered grid reveal
- staggered row reveal
- button glow

Animations are intentionally subtle and short. The goal is to add polish without making the interface feel noisy or unstable.

## How To Add New Styles Safely

1. Decide whether the style is global, shared utility, shared component, or local component styling.
2. Add global concerns under `src/styles/`.
3. Add component-specific rules as a CSS module under `src/styles/components/`.
4. Keep CSS files small and focused.
5. Avoid pushing component-specific selectors into `global.css`.
6. Prefer shared button or typography utilities before creating one-off duplicates.

## Why This Structure

This approach balances Tailwind speed with maintainable CSS architecture:

- Tailwind still handles responsive layout and quick utility composition.
- CSS modules handle richer streaming-style visuals and hover states.
- Global CSS stays small and system-oriented.
- The styling model scales without turning into a single fragile file.

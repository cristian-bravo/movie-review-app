# Components

## Layout Components

- `Container`
  Shared page width wrapper with wider desktop support.
- `Navbar`
  Sticky global navigation with active route feedback, auth-aware actions, and theme switching.
- `Footer`
  Product footer with exploration links and developer notes.
- `HeroMovie`
  Home-page featured title composition with dominant poster, metadata pills, and browse actions.

## UI Components

- `Surface`
  Base glass panel used across cards, forms, dashboards, and hero support areas.
- `Badge`
  Small label chip for section or content emphasis.
- `SectionHeading`
  Shared heading block for section title, eyebrow, and description.
- `StatusBanner`
  Inline system feedback for info, error, and success states.
- `EmptyState`
  Shared zero-state presentation for empty grids and guest-only views.
- `ThemeToggle`
  Navbar-level switch for persistent dark/light mode with smoother visual transitions.
- `LoadingCard`
  Simple loading surface used by placeholder routes.

## Movie Components

- `SearchBar`
  Reusable live-search entry with helper copy and quick suggestion chips.
- `MoviePoster`
  Dedicated poster renderer with local fallback behavior for missing or broken remote images.
- `MovieCard`
  Streaming-style poster card that supports both catalog cards and row tiles.
- `MovieRow`
  Horizontal scroller used by the home page to present browseable rows of OMDb titles.
- `MovieSkeleton`
  Poster-card loading placeholder used by the catalog route.
- `MovieGrid`
  Responsive live-movie grid wrapper with staggered reveal and empty-state actions.
- `MovieSpotlight`
  Featured editorial row used on the catalog route.
- `MovieHero`
  Full movie-detail hero with poster, backdrop, stat cards, and metadata chips.

## Review Components

- `RatingStars`
  Shared rating visualization that supports both display and interactive review input.
- `ReviewCard`
  Review presentation card with user summary and rating badge.
- `ReviewList`
  Review collection wrapper with empty-state handling.
- `ReviewForm`
  Local-first review submission form.
- `ReviewFeed`
  Review list presentation used for landing-page and section-level community previews.
- `ReviewsSection`
  Feature composition that pairs the form and the list for movie details.

## Auth Components

- `AuthForm`
  Shared login/register experience with split layout and variant-specific messaging.
- `ProfileDashboard`
  Authenticated profile surface with summary cards and review history.
- `SessionPanel`
  Session and theme debug surface for development.

## CSS Modules

Current component-specific style modules:

- `src/styles/components/hero-movie.module.css`
- `src/styles/components/movie-card.module.css`
- `src/styles/components/movie-grid.module.css`
- `src/styles/components/movie-row.module.css`
- `src/styles/components/movie-skeleton.module.css`
- `src/styles/components/search-bar.module.css`
- `src/styles/components/theme-toggle.module.css`
- `src/features/movies/components/MovieHero.module.css`

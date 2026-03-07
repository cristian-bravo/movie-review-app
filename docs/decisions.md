# Architectural Decisions

## Why Next.js

Next.js remains the correct foundation because the project needs:

- search routes with server data fetching
- movie detail pages with shareable URLs
- API handlers for integration boundaries
- layout-driven page composition
- a mix of server-rendered data and client-side interactive state

## Why Tailwind CSS

Tailwind continues to fit because it enables:

- rapid component composition
- consistent responsive behavior
- controlled design tokens
- fast iteration across dark and light themes

CSS modules are used only where effect-heavy styling is easier to manage outside utility classes.

## Why OMDb Instead of IMDb Right Now

OMDb is the active provider because:

- it is approved for use in this project
- it is more practical for everyday implementation and deployment
- the official IMDb developer access is paid and operationally heavier for the current scope
- the app only needs a clean search and detail flow, which OMDb covers well enough

The provider still remains isolated behind `src/services/omdb.service.ts`, so switching again later is possible.

## Why Local Storage for Auth and Reviews

For this iteration, local storage remains the pragmatic choice because it:

- keeps the app functional without backend setup
- allows real interaction flows to be implemented now
- preserves clean service boundaries for future migration

## Why Providers for Theme and Auth

Theme and auth affect multiple parts of the UI, especially:

- navbar
- profile
- auth pages
- review form

Using providers keeps this cross-cutting state out of page files and shared presentational components.

## Why the Home Page Was Reworked Again

The earlier functional home page was technically complete but visually noisy.

The redesign decision prioritized:

- clearer hierarchy above the fold
- fewer competing panels
- stronger editorial composition
- better balance between product messaging and featured content

This is why the current home page uses a dedicated route-level CSS module and a more restrained sequence of sections instead of stacking multiple similar spotlight surfaces.

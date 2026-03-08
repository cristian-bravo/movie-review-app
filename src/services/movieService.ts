import { omdbService } from "@/services/omdb.service";
import type { Movie, MovieCatalogResult, MovieHomeResult, MovieHomeRow } from "@/types";

const CATALOG_QUERIES = ["batman", "avengers", "star", "dune", "interstellar"] as const;
const DEFAULT_PER_QUERY_LIMIT = 5;
const HOME_ROW_LIMIT = 6;
const HOME_ROW_FETCH_LIMIT = 15;
const HOME_ROW_CONFIG = [
    {
    id: "popular",
    title: "Popular Movies",
    description: "Franchise favorites and big-screen staples that keep the platform feeling active.",
    query: "avengers",
  },
  {
    id: "trending",
    title: "Trending Now",
    description: "A tighter row of crowd-pleasing titles with immediate visual impact.",
    query: "batman",
  },

  {
    id: "recommended",
    title: "Recommended For You",
    description: "A recommendation-style row that keeps the home feed closer to a streaming platform.",
    query: "interstellar",
  },
  {
    id: "drama",
    title: "Drama Movies",
    description: "More character-driven titles gathered into a slower, moodier browse row.",
    query: "love",
  },
] as const;

function dedupeMovies(movies: Movie[]) {
  const uniqueMovies = new Map<string, Movie>();

  for (const movie of movies) {
    if (!uniqueMovies.has(movie.imdbID)) {
      uniqueMovies.set(movie.imdbID, movie);
    }
  }

  return [...uniqueMovies.values()];
}

async function collectMoviesByQuery(query: string, limit: number) {
  return omdbService.searchMovies(query, limit);
}

class MovieService {
  async getCatalogMovies(
    perQueryLimit = DEFAULT_PER_QUERY_LIMIT,
  ): Promise<MovieCatalogResult> {
    // Run the predefined discovery searches in parallel and merge their results into one catalog.
    const catalogResponses = await Promise.all(
      CATALOG_QUERIES.map((query) => collectMoviesByQuery(query, perQueryLimit)),
    );

    const items = dedupeMovies(catalogResponses.flatMap((response) => response.items));
    const error = catalogResponses.find((response) => response.error)?.error ?? null;

    return {
      items,
      source: "omdb",
      error,
      queries: [...CATALOG_QUERIES],
    };
  }

  async getHomeMovies(rowLimit = HOME_ROW_LIMIT): Promise<MovieHomeResult> {
    const fetchLimit = Math.max(rowLimit, HOME_ROW_FETCH_LIMIT);

    const [heroCandidates, rowResponses] = await Promise.all([
      omdbService.getFeaturedMovies(5),
      Promise.all(
        HOME_ROW_CONFIG.map((row) => collectMoviesByQuery(row.query, fetchLimit)),
      ),
    ]);

    const rows: MovieHomeRow[] = HOME_ROW_CONFIG.map((row, index) => ({
      ...row,
      // `rowLimit` is the intended baseline for the row, but the carousel needs extra items
      // loaded so the right arrow can reveal additional titles after the initial viewport.
      movies: dedupeMovies(rowResponses[index]?.items ?? []).slice(0, fetchLimit),
    }));
    const fallbackHeroMovies = dedupeMovies(rows.flatMap((row) => row.movies)).slice(0, 5);
    const heroMovies = dedupeMovies(heroCandidates).slice(0, 5);
    const resolvedHeroMovies = heroMovies.length > 0 ? heroMovies : fallbackHeroMovies;
    const heroMovie = resolvedHeroMovies[0] ?? null;
    const error = rowResponses.find((response) => response.error)?.error ?? null;

    return {
      heroMovie,
      heroMovies: resolvedHeroMovies,
      rows,
      error,
    };
  }
}

export const movieService = new MovieService();

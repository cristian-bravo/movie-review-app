import type { Movie, MovieDetailsResult, MovieSearchResult } from "@/types";

const DEFAULT_LIMIT = 8;
const MAX_SEARCH_LIMIT = 30;
const DEFAULT_BASE_URL = process.env.OMDB_BASE_URL ?? "https://www.omdbapi.com/";
const CURATED_OMDB_IDS = [
  "tt15239678",
  "tt15398776",
  "tt9362722",
  "tt1375666",
  "tt0816692",
];

interface OmdbBaseResponse {
  Response?: "True" | "False";
  Error?: string;
}

interface OmdbSearchItem {
  Title?: string;
  Year?: string;
  imdbID?: string;
  Type?: string;
  Poster?: string;
}

interface OmdbSearchResponse extends OmdbBaseResponse {
  Search?: OmdbSearchItem[];
  totalResults?: string;
}

interface OmdbMovieResponse extends OmdbBaseResponse {
  Title?: string;
  Year?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID?: string;
  Type?: string;
}

function compactStrings(values: Array<string | undefined | null>) {
  return values.filter((value): value is string => Boolean(value?.trim()));
}

function cleanOmdbValue(value?: string) {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.trim();
  return normalizedValue === "N/A" ? undefined : normalizedValue;
}

function hasUsablePoster(value?: string) {
  const poster = value?.trim();

  if (!poster || poster === "N/A") {
    return false;
  }

  const normalizedPoster = poster.toLowerCase();

  return !normalizedPoster.includes("poster unavailable")
    && !normalizedPoster.includes("image unavailable")
    && !normalizedPoster.includes("unavailable");
}

function clampLimit(limit: number, fallback = DEFAULT_LIMIT) {
  if (!Number.isFinite(limit) || limit <= 0) {
    return fallback;
  }

  return Math.min(Math.floor(limit), MAX_SEARCH_LIMIT);
}

function splitOmdbList(value?: string) {
  return compactStrings(cleanOmdbValue(value)?.split(",").map((item) => item.trim()) ?? []);
}

function extractReleaseYear(value?: string) {
  const yearMatch = cleanOmdbValue(value)?.match(/\d{4}/);
  return yearMatch?.[0] ?? "Unknown";
}

function formatRuntime(value?: string) {
  const runtime = cleanOmdbValue(value);

  if (!runtime) {
    return "Runtime unavailable";
  }

  const minutes = Number.parseInt(runtime, 10);

  if (!Number.isFinite(minutes) || minutes <= 0) {
    return runtime;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours <= 0) {
    return `${remainingMinutes}m`;
  }

  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function normalizeRating(value?: string) {
  const rating = Number.parseFloat(cleanOmdbValue(value) ?? "");
  return Number.isFinite(rating) ? rating : null;
}

function normalizeTitleType(value?: string) {
  const titleType = cleanOmdbValue(value);

  if (!titleType) {
    return undefined;
  }

  return `${titleType.charAt(0).toUpperCase()}${titleType.slice(1)}`;
}

function mapOmdbSearchItemToMovie(movie?: OmdbSearchItem | null): Movie | null {
  const title = cleanOmdbValue(movie?.Title);
  const imdbID = cleanOmdbValue(movie?.imdbID);
  const year = cleanOmdbValue(movie?.Year);
  const poster = hasUsablePoster(movie?.Poster) ? cleanOmdbValue(movie?.Poster) : undefined;

  if (!title || !imdbID || !year || !poster) {
    return null;
  }

  return {
    imdbID,
    Title: title,
    Year: year,
    Poster: poster,
    id: imdbID,
    title,
    poster,
    description: "Open the details page to view the full synopsis, credits, and reviews.",
    rating: null,
    cast: [],
    releaseYear: extractReleaseYear(year),
    genres: [],
    runtime: "Runtime unavailable",
    source: "omdb",
  };
}

function mapOmdbMovieToMovie(movie?: OmdbMovieResponse | null): Movie | null {
  const title = cleanOmdbValue(movie?.Title);
  const imdbID = cleanOmdbValue(movie?.imdbID);
  const poster = hasUsablePoster(movie?.Poster) ? cleanOmdbValue(movie?.Poster) : undefined;

  if (!title || !imdbID || !poster) {
    return null;
  }

  const plot =
    cleanOmdbValue(movie?.Plot) ?? "Detailed synopsis is not available for this title yet.";

  return {
    imdbID,
    Title: title,
    Year: cleanOmdbValue(movie?.Year) ?? extractReleaseYear(movie?.Year),
    Poster: poster,
    id: imdbID,
    title,
    poster,
    backdrop: poster,
    description: plot,
    synopsis: plot,
    rating: normalizeRating(movie?.imdbRating),
    cast: splitOmdbList(movie?.Actors),
    releaseYear: extractReleaseYear(movie?.Year),
    releaseDate: cleanOmdbValue(movie?.Released),
    genres: splitOmdbList(movie?.Genre),
    runtime: formatRuntime(movie?.Runtime),
    director: cleanOmdbValue(movie?.Director),
    writer: cleanOmdbValue(movie?.Writer),
    language: splitOmdbList(movie?.Language),
    country: cleanOmdbValue(movie?.Country),
    awards: cleanOmdbValue(movie?.Awards),
    rated: cleanOmdbValue(movie?.Rated),
    votes: cleanOmdbValue(movie?.imdbVotes),
    titleType: normalizeTitleType(movie?.Type),
    source: "omdb",
  };
}

class OmdbService {
  private get config() {
    return {
      apiKey: process.env.OMDB_API_KEY,
      baseUrl: process.env.OMDB_BASE_URL ?? DEFAULT_BASE_URL,
    };
  }

  private hasCredentials() {
    return Boolean(this.config.apiKey);
  }

  private buildUrl(params: Record<string, string>) {
    const { apiKey, baseUrl } = this.config;

    if (!apiKey) {
      throw new Error("OMDb API configuration is incomplete. Set OMDB_API_KEY.");
    }

    const url = new URL(baseUrl);
    url.search = new URLSearchParams({
      ...params,
      apikey: apiKey,
    }).toString();

    return url.toString();
  }

  private async request<TData extends OmdbBaseResponse>(params: Record<string, string>) {
    const response = await fetch(this.buildUrl(params), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`OMDb request failed with status ${response.status}.`);
    }

    return (await response.json()) as TData;
  }

  private async fetchMovieById(id: string, plot: "short" | "full" = "full") {
    const response = await this.request<OmdbMovieResponse>({
      i: id,
      plot,
    });

    if (response.Response === "False") {
      return {
        item: null as Movie | null,
        error: response.Error ?? "OMDb could not resolve this title.",
      };
    }

    return {
      item: mapOmdbMovieToMovie(response),
      error: null as string | null,
    };
  }

  private async fetchMoviesByIds(ids: string[], plot: "short" | "full" = "short") {
    const requestedIds = compactStrings(ids);

    if (requestedIds.length === 0) {
      return {
        items: [] as Movie[],
        error: null as string | null,
      };
    }

    const detailResults = await Promise.all(
      requestedIds.map((id) => this.fetchMovieById(id, plot)),
    );
    const mappedMovies = detailResults
      .map((result) => result.item)
      .filter((movie): movie is Movie => Boolean(movie));
    const moviesById = new Map(mappedMovies.map((movie) => [movie.imdbID, movie] as const));
    const orderedMovies = requestedIds
      .map((id) => moviesById.get(id))
      .filter((movie): movie is Movie => Boolean(movie));
    const errorMessage =
      detailResults.find((result) => result.error && !result.item)?.error ?? null;

    return {
      items: orderedMovies,
      error: errorMessage,
    };
  }

  async searchMovies(query: string, limit = DEFAULT_LIMIT): Promise<MovieSearchResult> {
    const normalizedQuery = query.trim();
    const safeLimit = clampLimit(limit);

    if (!normalizedQuery) {
      return {
        items: [],
        totalResults: 0,
        source: "omdb",
        error: null,
      };
    }

    if (!this.hasCredentials()) {
      return {
        items: [],
        totalResults: 0,
        source: "omdb",
        error: "OMDb API credentials are not configured.",
      };
    }

    try {
      const pageCount = Math.max(1, Math.ceil(safeLimit / 10));
      const searchResponses = await Promise.all(
        Array.from({ length: pageCount }, (_, index) =>
          this.request<OmdbSearchResponse>({
            s: normalizedQuery,
            type: "movie",
            page: String(index + 1),
          }),
        ),
      );

      const firstErrorResponse = searchResponses.find((response) => response.Response === "False");

      if (firstErrorResponse && !(firstErrorResponse.Search?.length)) {
        return {
          items: [],
          totalResults: 0,
          source: "omdb",
          error: firstErrorResponse.Error ?? "OMDb search failed.",
        };
      }

      const filteredMovies = searchResponses
        .flatMap((response) => response.Search ?? [])
        .filter((movie) => hasUsablePoster(movie.Poster))
        .map((movie) => mapOmdbSearchItemToMovie(movie))
        .filter((movie): movie is Movie => Boolean(movie))
        .slice(0, safeLimit);

      const totalResults =
        Number.parseInt(searchResponses[0]?.totalResults ?? "", 10) || filteredMovies.length;

      return {
        items: filteredMovies,
        totalResults,
        source: "omdb",
        error: filteredMovies.length === 0 ? "OMDb returned no movies with valid posters." : null,
      };
    } catch (error) {
      return {
        items: [],
        totalResults: 0,
        source: "omdb",
        error: error instanceof Error ? error.message : "OMDb search failed.",
      };
    }
  }

  async getMovieDetails(id: string): Promise<MovieDetailsResult> {
    if (!this.hasCredentials()) {
      return {
        item: null,
        source: "omdb",
        error: "OMDb API credentials are not configured.",
      };
    }

    try {
      const response = await this.fetchMovieById(id, "full");

      return {
        item: response.item,
        source: "omdb",
        error: response.error ?? (!response.item ? "Movie not found." : null),
      };
    } catch (error) {
      return {
        item: null,
        source: "omdb",
        error: error instanceof Error ? error.message : "OMDb title lookup failed.",
      };
    }
  }

  async getFeaturedMovies(limit = 4): Promise<Movie[]> {
    const safeLimit = clampLimit(limit, 4);

    if (!this.hasCredentials()) {
      return [];
    }

    try {
      const featuredResult = await this.fetchMoviesByIds(
        CURATED_OMDB_IDS.slice(0, safeLimit),
        "short",
      );

      return featuredResult.items;
    } catch {
      return [];
    }
  }
}

export const omdbService = new OmdbService();

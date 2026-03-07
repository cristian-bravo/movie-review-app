export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  id: string;
  title: string;
  poster: string;
  description: string;
  rating: number | null;
  cast: string[];
  releaseYear: string;
  genres: string[];
  runtime: string;
  synopsis?: string;
  director?: string;
  writer?: string;
  language?: string[];
  country?: string;
  awards?: string;
  rated?: string;
  ratingReason?: string;
  votes?: string;
  backdrop?: string;
  releaseDate?: string;
  titleType?: string;
  keywords?: string[];
  colorations?: string[];
  posterCaption?: string;
  source?: "omdb" | "mock";
  featured?: boolean;
}

export interface MovieSearchResult {
  items: Movie[];
  totalResults: number;
  source: "omdb" | "mock";
  error: string | null;
}

export interface MovieDetailsResult {
  item: Movie | null;
  source: "omdb" | "mock";
  error: string | null;
}

export interface MovieCatalogResult {
  items: Movie[];
  source: "omdb" | "mock";
  error: string | null;
  queries: string[];
}

export interface MovieHomeRow {
  id: string;
  title: string;
  description: string;
  query: string;
  movies: Movie[];
}

export interface MovieHomeResult {
  heroMovie: Movie | null;
  rows: MovieHomeRow[];
  error: string | null;
}

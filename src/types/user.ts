export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  favoriteGenres?: string[];
  createdAt?: string;
}

export interface Session {
  status: "authenticated" | "guest" | "loading";
  user: User | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export type ThemeMode = "dark" | "light";

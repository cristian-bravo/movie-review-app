import type { User } from "@/types/user";

export interface Review {
  id: string;
  movieId: string;
  user: Pick<User, "id" | "name" | "email" | "avatar">;
  rating: number;
  comment: string;
  date: string;
  source?: "seed" | "local";
}

export interface ReviewDraft {
  movieId: string;
  username: string;
  comment: string;
  rating: number;
  user?: Pick<User, "id" | "name" | "email" | "avatar"> | null;
}

import { mockReviews } from "@/lib/mockReviews";
import { storageKeys } from "@/lib/constants/storage";
import type { Review, ReviewDraft } from "@/types";
import { isBrowser } from "@/utils/isBrowser";

function readLocalReviews(): Review[] {
  if (!isBrowser()) {
    return [];
  }

  const rawReviews = window.localStorage.getItem(storageKeys.reviews);

  if (!rawReviews) {
    return [];
  }

  try {
    return JSON.parse(rawReviews) as Review[];
  } catch {
    return [];
  }
}

function writeLocalReviews(reviews: Review[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(storageKeys.reviews, JSON.stringify(reviews));
}

function sortReviews(reviews: Review[]) {
  return [...reviews].sort((left, right) => right.date.localeCompare(left.date));
}

function dedupeReviews(reviews: Review[]) {
  const map = new Map<string, Review>();

  for (const review of reviews) {
    map.set(review.id, review);
  }

  return [...map.values()];
}

class ReviewService {
  getReviewsByMovieId(movieId: string, seededReviews: Review[] = mockReviews) {
    const localReviews = readLocalReviews();

    return sortReviews(
      dedupeReviews([...seededReviews, ...localReviews]).filter((review) => review.movieId === movieId),
    );
  }

  getReviewsByUserId(userId: string, seededReviews: Review[] = mockReviews) {
    const localReviews = readLocalReviews();

    return sortReviews(
      dedupeReviews([...seededReviews, ...localReviews]).filter((review) => review.user.id === userId),
    );
  }

  createReview(draft: ReviewDraft): Review {
    const nextReview: Review = {
      id: globalThis.crypto?.randomUUID?.() ?? `review-${Date.now()}`,
      movieId: draft.movieId,
      user: draft.user ?? {
        id: `guest-${Date.now()}`,
        name: draft.username.trim(),
        email: `${draft.username.trim().toLowerCase().replace(/\s+/g, ".")}@local.review`,
        avatar: "/avatars/default-avatar.svg",
      },
      rating: draft.rating,
      comment: draft.comment.trim(),
      date: new Date().toISOString(),
      source: "local",
    };

    const localReviews = readLocalReviews();
    writeLocalReviews(sortReviews([nextReview, ...localReviews]));

    return nextReview;
  }
}

export const reviewService = new ReviewService();


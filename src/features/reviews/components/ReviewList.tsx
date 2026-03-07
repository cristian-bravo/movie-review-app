import { ReviewCard } from "@/components/reviews/ReviewCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Review } from "@/types";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Be the first to rate this movie. Reviews are stored locally for now and can be migrated to a backend later."
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

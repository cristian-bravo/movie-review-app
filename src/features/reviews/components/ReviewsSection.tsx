"use client";

import { useEffect, useState } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { reviewService } from "@/services/review.service";
import type { Review } from "@/types";

interface ReviewsSectionProps {
  movieId: string;
  initialReviews: Review[];
}

export function ReviewsSection({
  movieId,
  initialReviews,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  useEffect(() => {
    function refreshReviews() {
      setReviews(reviewService.getReviewsByMovieId(movieId, initialReviews));
    }

    refreshReviews();

    function handleStorage() {
      refreshReviews();
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [movieId, initialReviews]);

  return (
    <section className="space-y-8">
      <SectionHeading
        eyebrow="Reviews"
        title="Community reactions"
        description="Seed content and locally stored reviews are merged here so the user flow remains real before a database is introduced."
      />
      <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
        <ReviewForm
          movieId={movieId}
          onCreated={() => {
            setReviews(reviewService.getReviewsByMovieId(movieId, initialReviews));
          }}
        />
        <ReviewList reviews={reviews} />
      </div>
    </section>
  );
}

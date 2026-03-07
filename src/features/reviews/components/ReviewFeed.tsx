import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import type { Review } from "@/types";

interface ReviewFeedProps {
  eyebrow?: string;
  title: string;
  description?: string;
  reviews: Review[];
}

export function ReviewFeed({
  eyebrow,
  title,
  description,
  reviews,
}: ReviewFeedProps) {
  return (
    <section className="space-y-8">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <ReviewList reviews={reviews} />
    </section>
  );
}


import Image from "next/image";

import { RatingStars } from "@/components/reviews/RatingStars";
import { Surface } from "@/components/ui/Surface";
import type { Review } from "@/types";
import { formatDate } from "@/utils/formatDate";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Surface className="h-full space-y-5 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={review.user.avatar ?? "/avatars/default-avatar.svg"}
            alt={`${review.user.name} avatar`}
            width={52}
            height={52}
            className="rounded-full border border-white/10"
          />
          <div>
            <p className="font-semibold text-foreground">{review.user.name}</p>
            <p className="text-sm text-muted-foreground">{formatDate(review.date)}</p>
          </div>
        </div>

        <div className="rounded-full border border-gold/20 bg-gold/10 px-3 py-2">
          <RatingStars rating={review.rating} scale={5} />
        </div>
      </div>

      <p className="text-sm leading-7 text-muted-foreground">{review.comment}</p>
    </Surface>
  );
}

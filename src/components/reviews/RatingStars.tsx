import { formatRating } from "@/utils/formatRating";

interface RatingStarsProps {
  rating: number | null;
  scale?: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onRate?: (value: number) => void;
  showLabel?: boolean;
}

function StarIcon({
  filled,
  size,
}: {
  filled: boolean;
  size: "sm" | "md";
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} ${filled ? "fill-gold text-gold" : "fill-transparent text-gold/35"}`}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M10 1.75L12.54 6.89L18.22 7.72L14.11 11.72L15.08 17.38L10 14.71L4.92 17.38L5.89 11.72L1.78 7.72L7.46 6.89L10 1.75Z" />
    </svg>
  );
}

export function RatingStars({
  rating,
  scale = 10,
  size = "sm",
  interactive = false,
  onRate,
  showLabel = true,
}: RatingStarsProps) {
  const normalizedRating = rating ?? 0;
  const rounded = Math.round((normalizedRating / scale) * 5);

  return (
    <div
      className="flex items-center gap-2"
      aria-label={`Rating ${rating === null ? "not available" : formatRating(rating, scale)}`}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          const filled = value <= rounded;

          if (interactive && onRate) {
            return (
              <button
                key={value}
                type="button"
                onClick={() => onRate(value)}
                className="transition hover:scale-110"
                aria-label={`Set rating to ${value}`}
              >
                <StarIcon filled={filled} size={size} />
              </button>
            );
          }

          return <StarIcon key={value} filled={filled} size={size} />;
        })}
      </div>
      {showLabel ? (
        <span className="text-sm font-semibold text-foreground">{formatRating(rating, scale)}</span>
      ) : null}
    </div>
  );
}

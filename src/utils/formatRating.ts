export function formatRating(rating: number | null, scale = 10) {
  if (rating === null || Number.isNaN(rating)) {
    return "N/A";
  }

  return `${rating.toFixed(1)}/${scale}`;
}

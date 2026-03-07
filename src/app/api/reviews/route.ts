import { NextResponse } from "next/server";

import { mockReviews } from "@/lib/mockReviews";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");

  const items = movieId
    ? mockReviews.filter((review) => review.movieId === movieId)
    : [...mockReviews].sort((left, right) => right.date.localeCompare(left.date));

  return NextResponse.json({
    source: "seed",
    items,
  });
}

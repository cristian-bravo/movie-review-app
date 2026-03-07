import { NextResponse } from "next/server";

import { omdbService } from "@/services/omdb.service";

interface RouteContext {
  params: Promise<{
    movieId: string;
  }>;
}

export async function GET(_: Request, { params }: RouteContext) {
  const { movieId } = await params;
  const result = await omdbService.getMovieDetails(movieId);

  if (!result.item) {
    return NextResponse.json({ message: "Movie not found." }, { status: 404 });
  }

  return NextResponse.json(result);
}

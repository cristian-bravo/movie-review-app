import { NextResponse } from "next/server";

import { omdbService } from "@/services/omdb.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 8;

  const result = await omdbService.searchMovies(query, Number.isFinite(limit) ? limit : 8);

  return NextResponse.json(result);
}

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "client-managed",
    user: null,
    implemented: false,
  });
}

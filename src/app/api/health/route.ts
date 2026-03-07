import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    scope: "functional-app",
    timestamp: new Date().toISOString(),
  });
}

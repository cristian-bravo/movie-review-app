import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Registration is currently handled client-side through local storage.",
    implemented: false,
  });
}

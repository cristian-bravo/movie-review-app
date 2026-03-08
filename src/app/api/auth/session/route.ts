import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  clearSessionCookie,
  getSessionUser,
} from "@/lib/auth/server";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return NextResponse.json({
      status: "guest",
      user: null,
    });
  }

  try {
    const user = await getSessionUser(sessionToken);

    if (!user) {
      const response = NextResponse.json({
        status: "guest",
        user: null,
      });

      clearSessionCookie(response);
      return response;
    }

    return NextResponse.json({
      status: "authenticated",
      user,
    });
  } catch {
    const response = NextResponse.json(
      {
        status: "guest",
        user: null,
      },
      { status: 500 },
    );

    clearSessionCookie(response);
    return response;
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  clearSessionCookie,
  deleteSession,
} from "@/lib/auth/server";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    try {
      await deleteSession(sessionToken);
    } catch {
      // Ignore server-side cleanup errors and still clear the browser cookie.
    }
  }

  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);

  return response;
}

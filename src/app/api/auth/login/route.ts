import { NextResponse } from "next/server";

import { attachSessionCookie, loginUser } from "@/lib/auth/server";
import { MissingMongoConfigError } from "@/lib/mongodb";

export const runtime = "nodejs";

interface LoginRequestBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  let body: LoginRequestBody;

  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json({ error: "We could not process your request." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Please enter your email address and password." },
      { status: 400 },
    );
  }

  try {
    const session = await loginUser({ email, password });

    if (!session) {
      return NextResponse.json(
        { error: "We could not match that email and password." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ user: session.user, error: null });
    attachSessionCookie(response, session.sessionToken, session.expiresAt);

    return response;
  } catch (error) {
    const message =
      error instanceof MissingMongoConfigError
        ? "We could not open sign-in right now. Please try again soon."
        : "We could not sign you in right now. Please try again in a moment.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

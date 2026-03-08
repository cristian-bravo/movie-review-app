import { NextResponse } from "next/server";

import {
  DuplicateEmailError,
  attachSessionCookie,
  registerUser,
} from "@/lib/auth/server";
import { MissingMongoConfigError } from "@/lib/mongodb";

export const runtime = "nodejs";

interface RegisterRequestBody {
  email?: string;
  name?: string;
  password?: string;
}

export async function POST(request: Request) {
  let body: RegisterRequestBody;

  try {
    body = (await request.json()) as RegisterRequestBody;
  } catch {
    return NextResponse.json({ error: "We could not process your request." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Please complete every required field." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Choose a password with at least 8 characters." },
      { status: 400 },
    );
  }

  try {
    const session = await registerUser({ name, email, password });
    const response = NextResponse.json({ user: session.user, error: null }, { status: 201 });

    attachSessionCookie(response, session.sessionToken, session.expiresAt);

    return response;
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    const message =
      error instanceof MissingMongoConfigError
        ? "We could not open sign-up right now. Please try again soon."
        : "We could not create your account right now. Please try again in a moment.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

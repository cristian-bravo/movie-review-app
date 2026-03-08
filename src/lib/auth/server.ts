import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import type { Db } from "mongodb";
import { ObjectId } from "mongodb";
import type { NextResponse } from "next/server";

import { getDatabase } from "@/lib/mongodb";
import type { User } from "@/types";

const USERS_COLLECTION = "users";
const SESSIONS_COLLECTION = "auth_sessions";
const DEFAULT_AVATAR = "/avatars/default-avatar.svg";
const DEFAULT_BIO = "Movie fan profile stored in MongoDB.";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

export const SESSION_COOKIE_NAME = "movie-review-session";

interface AuthUserDocument {
  _id: ObjectId;
  name: string;
  email: string;
  emailNormalized: string;
  passwordHash: string;
  avatar?: string;
  bio?: string;
  favoriteGenres: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AuthSessionDocument {
  _id: string;
  userId: ObjectId;
  createdAt: Date;
  expiresAt: Date;
}

export class DuplicateEmailError extends Error {
  constructor() {
    super("An account with this email already exists. Sign in to keep going.");
    this.name = "DuplicateEmailError";
  }
}

let authCollectionsPromise: Promise<void> | null = null;

function getUsersCollection(database: Db) {
  return database.collection<AuthUserDocument>(USERS_COLLECTION);
}

function getSessionsCollection(database: Db) {
  return database.collection<AuthSessionDocument>(SESSIONS_COLLECTION);
}

function isDuplicateKeyError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHash] = storedHash.split(":");

  if (!salt || !expectedHash) {
    return false;
  }

  const expected = Buffer.from(expectedHash, "hex");
  const actual = scryptSync(password, salt, 64);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function sanitizeUser(user: AuthUserDocument): User {
  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    favoriteGenres: user.favoriteGenres,
    createdAt: user.createdAt.toISOString(),
  };
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function ensureAuthCollections() {
  if (!authCollectionsPromise) {
    authCollectionsPromise = (async () => {
      const database = await getDatabase();

      await Promise.all([
        getUsersCollection(database).createIndex(
          { emailNormalized: 1 },
          { unique: true, name: "users_email_normalized_unique" },
        ),
        getSessionsCollection(database).createIndex(
          { expiresAt: 1 },
          { expireAfterSeconds: 0, name: "auth_sessions_expires_ttl" },
        ),
        getSessionsCollection(database).createIndex(
          { userId: 1 },
          { name: "auth_sessions_user_id" },
        ),
      ]);
    })();
  }

  return authCollectionsPromise;
}

async function findUserByEmail(email: string) {
  await ensureAuthCollections();

  const database = await getDatabase();
  return getUsersCollection(database).findOne({ emailNormalized: normalizeEmail(email) });
}

async function createSession(userId: ObjectId) {
  await ensureAuthCollections();

  const database = await getDatabase();
  const sessionToken = randomBytes(32).toString("hex");
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_DURATION_MS);

  await getSessionsCollection(database).insertOne({
    _id: sessionToken,
    userId,
    createdAt,
    expiresAt,
  });

  return { sessionToken, expiresAt };
}

export async function registerUser(input: {
  email: string;
  name: string;
  password: string;
}) {
  await ensureAuthCollections();

  const database = await getDatabase();
  const usersCollection = getUsersCollection(database);
  const emailNormalized = normalizeEmail(input.email);
  const existingUser = await usersCollection.findOne({ emailNormalized });

  if (existingUser) {
    throw new DuplicateEmailError();
  }

  const now = new Date();
  const userDocument: AuthUserDocument = {
    _id: new ObjectId(),
    name: input.name.trim() || "Movie fan",
    email: emailNormalized,
    emailNormalized,
    passwordHash: hashPassword(input.password),
    avatar: DEFAULT_AVATAR,
    bio: DEFAULT_BIO,
    favoriteGenres: [],
    createdAt: now,
    updatedAt: now,
  };

  try {
    const result = await usersCollection.insertOne(userDocument);
    const session = await createSession(result.insertedId);

    return {
      user: sanitizeUser(userDocument),
      ...session,
    };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new DuplicateEmailError();
    }

    throw error;
  }
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await findUserByEmail(input.email);

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    return null;
  }

  const session = await createSession(user._id);

  return {
    user: sanitizeUser(user),
    ...session,
  };
}

export async function getSessionUser(sessionToken: string) {
  await ensureAuthCollections();

  const database = await getDatabase();
  const session = await getSessionsCollection(database).findOne({
    _id: sessionToken,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    return null;
  }

  const user = await getUsersCollection(database).findOne({ _id: session.userId });

  if (!user) {
    await getSessionsCollection(database).deleteOne({ _id: sessionToken });
    return null;
  }

  return sanitizeUser(user);
}

export async function deleteSession(sessionToken: string) {
  await ensureAuthCollections();

  const database = await getDatabase();
  await getSessionsCollection(database).deleteOne({ _id: sessionToken });
}

export function attachSessionCookie(
  response: NextResponse,
  sessionToken: string,
  expiresAt: Date,
) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

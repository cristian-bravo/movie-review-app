import { mockUsers } from "@/lib/mockUsers";
import { storageKeys } from "@/lib/constants/storage";
import type { AuthCredentials, AuthResult, Session, User } from "@/types";
import { isBrowser } from "@/utils/isBrowser";

interface StoredUser extends User {
  password: string;
}

interface StoredSession {
  userId: string;
}

function sanitizeUser(user: StoredUser): User {
  const { password, ...safeUser } = user;
  void password;

  return safeUser;
}

function createDefaultUsers(): StoredUser[] {
  return mockUsers.map((user, index) => ({
    ...user,
    password: index === 0 ? "demo1234" : "password123",
    createdAt: user.createdAt ?? new Date().toISOString(),
  }));
}

function readUsers(): StoredUser[] {
  if (!isBrowser()) {
    return [];
  }

  const rawUsers = window.localStorage.getItem(storageKeys.authUsers);

  if (!rawUsers) {
    const seededUsers = createDefaultUsers();
    window.localStorage.setItem(storageKeys.authUsers, JSON.stringify(seededUsers));
    return seededUsers;
  }

  try {
    return JSON.parse(rawUsers) as StoredUser[];
  } catch {
    const seededUsers = createDefaultUsers();
    window.localStorage.setItem(storageKeys.authUsers, JSON.stringify(seededUsers));
    return seededUsers;
  }
}

function writeUsers(users: StoredUser[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(storageKeys.authUsers, JSON.stringify(users));
}

function readSessionRecord(): StoredSession | null {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(storageKeys.authSession);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as StoredSession;
  } catch {
    return null;
  }
}

class AuthService {
  getSession(): Session {
    if (!isBrowser()) {
      return {
        status: "loading",
        user: null,
      };
    }

    const users = readUsers();
    const sessionRecord = readSessionRecord();
    const matchedUser = users.find((user) => user.id === sessionRecord?.userId);

    if (!matchedUser) {
      return {
        status: "guest",
        user: null,
      };
    }

    return {
      status: "authenticated",
      user: sanitizeUser(matchedUser),
    };
  }

  login(credentials: AuthCredentials): AuthResult {
    const users = readUsers();
    const matchedUser = users.find(
      (user) =>
        user.email.toLowerCase() === credentials.email.trim().toLowerCase() &&
        user.password === credentials.password,
    );

    if (!matchedUser) {
      return {
        user: null,
        error: "Invalid email or password.",
      };
    }

    window.localStorage.setItem(
      storageKeys.authSession,
      JSON.stringify({ userId: matchedUser.id } satisfies StoredSession),
    );

    return {
      user: sanitizeUser(matchedUser),
      error: null,
    };
  }

  register(credentials: AuthCredentials): AuthResult {
    const users = readUsers();
    const normalizedEmail = credentials.email.trim().toLowerCase();

    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      return {
        user: null,
        error: "An account with this email already exists.",
      };
    }

    const newUser: StoredUser = {
      id: globalThis.crypto?.randomUUID?.() ?? `user-${Date.now()}`,
      name: credentials.name?.trim() || "Movie fan",
      email: normalizedEmail,
      password: credentials.password,
      avatar: "/avatars/default-avatar.svg",
      bio: "New reviewer profile created in local storage.",
      favoriteGenres: [],
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [...users, newUser];
    writeUsers(nextUsers);
    window.localStorage.setItem(
      storageKeys.authSession,
      JSON.stringify({ userId: newUser.id } satisfies StoredSession),
    );

    return {
      user: sanitizeUser(newUser),
      error: null,
    };
  }

  logout() {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.removeItem(storageKeys.authSession);
  }
}

export const authService = new AuthService();

import { storageKeys } from "@/lib/constants/storage";
import type { AuthCredentials, AuthResult, Session, User } from "@/types";
import { isBrowser } from "@/utils/isBrowser";

interface AuthApiResponse {
  error?: string | null;
  status?: Session["status"];
  user?: User | null;
}

interface AuthSessionMarker {
  updatedAt: string;
}

async function readJsonSafely<T>(response: Response) {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function notifyAuthChanged() {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      storageKeys.authSession,
      JSON.stringify({ updatedAt: new Date().toISOString() } satisfies AuthSessionMarker),
    );
  } catch {
    // Swallow sync-marker failures. Auth still relies on server cookies.
  }

  window.dispatchEvent(new Event("auth:changed"));
}

class AuthService {
  async getSession(): Promise<Session> {
    if (!isBrowser()) {
      return {
        status: "loading",
        user: null,
      };
    }

    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await readJsonSafely<AuthApiResponse>(response);

      if (!response.ok || data?.status !== "authenticated" || !data.user) {
        return {
          status: "guest",
          user: null,
        };
      }

      return {
        status: "authenticated",
        user: data.user,
      };
    } catch {
      return {
        status: "guest",
        user: null,
      };
    }
  }

  async login(credentials: AuthCredentials): Promise<AuthResult> {
    return this.authenticate("/api/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });
  }

  async register(credentials: AuthCredentials): Promise<AuthResult> {
    return this.authenticate("/api/auth/register", {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    });
  }

  async logout() {
    if (!isBrowser()) {
      return;
    }

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      notifyAuthChanged();
    }
  }

  private async authenticate(
    endpoint: string,
    credentials: AuthCredentials,
  ): Promise<AuthResult> {
    if (!isBrowser()) {
      return {
        user: null,
        error: "Please open this page in your browser to continue.",
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await readJsonSafely<AuthApiResponse>(response);

      if (!response.ok || !data?.user) {
        return {
          user: null,
          error: data?.error ?? "We could not complete your request right now.",
        };
      }

      notifyAuthChanged();

      return {
        user: data.user,
        error: null,
      };
    } catch {
      return {
        user: null,
        error: "We could not connect right now. Please try again in a moment.",
      };
    }
  }
}

export const authService = new AuthService();

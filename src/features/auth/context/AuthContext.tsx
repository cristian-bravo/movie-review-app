"use client";

import { createContext, startTransition, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { authService } from "@/services/auth.service";
import type { AuthCredentials, AuthResult, Session } from "@/types";

interface AuthContextValue {
  session: Session;
  login: (credentials: AuthCredentials) => Promise<AuthResult>;
  register: (credentials: AuthCredentials) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({
    status: "loading",
    user: null,
  });

  const refreshSession = useCallback(async () => {
    const nextSession = await authService.getSession();

    startTransition(() => {
      setSession(nextSession);
    });
  }, []);

  useEffect(() => {
    void refreshSession();

    function handleAuthChange() {
      void refreshSession();
    }

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth:changed", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth:changed", handleAuthChange);
    };
  }, [refreshSession]);

  const value: AuthContextValue = {
    session,
    login: async (credentials) => {
      const result = await authService.login(credentials);

      if (!result.error) {
        await refreshSession();
      }

      return result;
    },
    register: async (credentials) => {
      const result = await authService.register(credentials);

      if (!result.error) {
        await refreshSession();
      }

      return result;
    },
    logout: () => {
      void (async () => {
        await authService.logout();
        await refreshSession();
      })();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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

function getCurrentSession(): Session {
  return authService.getSession();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({
    status: "loading",
    user: null,
  });

  useEffect(() => {
    setSession(getCurrentSession());

    function handleStorage() {
      setSession(getCurrentSession());
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      login: async (credentials) => {
        const result = authService.login(credentials);

        startTransition(() => {
          setSession(getCurrentSession());
        });

        return result;
      },
      register: async (credentials) => {
        const result = authService.register(credentials);

        startTransition(() => {
          setSession(getCurrentSession());
        });

        return result;
      },
      logout: () => {
        authService.logout();

        startTransition(() => {
          setSession(getCurrentSession());
        });
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

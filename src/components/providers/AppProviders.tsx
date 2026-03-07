"use client";

import type { PropsWithChildren } from "react";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/features/auth/context/AuthContext";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}


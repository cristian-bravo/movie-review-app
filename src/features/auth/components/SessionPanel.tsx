"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { useAuth } from "@/features/auth/context/AuthContext";

export function SessionPanel() {
  const { session } = useAuth();
  const { theme } = useTheme();

  return (
    <Surface className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Session Debug
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Current server-backed state
          </h1>
        </div>
        <Badge>{session.status}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-surface-strong p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Theme
          </p>
          <p className="mt-3 text-base font-semibold text-foreground">{theme}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface-strong p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            User
          </p>
          <p className="mt-3 text-base font-semibold text-foreground">
            {session.user?.name ?? "Guest"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface-strong p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Email
          </p>
          <p className="mt-3 text-base font-semibold text-foreground">
            {session.user?.email ?? "No active session"}
          </p>
        </div>
      </div>
    </Surface>
  );
}

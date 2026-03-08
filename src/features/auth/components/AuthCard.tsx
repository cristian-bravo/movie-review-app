"use client";

import type { PropsWithChildren } from "react";

import { StatusBanner } from "@/components/ui/StatusBanner";
import { cn } from "@/utils/cn";

interface AuthCardProps extends PropsWithChildren {
  title: string;
  description: string;
  error: string | null;
  eyebrow: string;
  align?: "edge" | "center";
}

export function AuthCard({
  title,
  description,
  error,
  eyebrow,
  align = "edge",
  children,
}: AuthCardProps) {
  return (
    <section
      id="auth-card"
      className={cn(
        "relative mx-auto flex w-full max-w-md flex-1 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/60 p-5 shadow-2xl backdrop-blur-xl lg:p-6",
        align === "center" ? "lg:mx-auto lg:max-w-md" : "lg:ml-auto lg:max-w-lg",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_28%)]" />

      <div className="relative z-10 flex w-full flex-col justify-center space-y-4">
        <div className="space-y-3 text-center">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
          <div className="space-y-2">
            <h2 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {title}
            </h2>
            <p className="text-[0.82rem] leading-5 text-neutral-400 sm:text-sm">{description}</p>
          </div>
        </div>

        {error ? (
          <StatusBanner
            tone="error"
            message={error}
            className="rounded-lg border-white/10 bg-pink-glow/12 text-white"
          />
        ) : null}

        {children}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { StatusBanner } from "@/components/ui/StatusBanner";
import { Surface } from "@/components/ui/Surface";
import { useAuth } from "@/features/auth/context/AuthContext";

interface AuthFormProps {
  variant: "login" | "register";
}

export function AuthForm({ variant }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isRegister = variant === "register";
  const featureItems = isRegister
    ? [
        "Create a local profile and keep a persistent session.",
        "Publish reviews directly from movie detail pages.",
        "Prepare the UX for a later backend migration without reworking components.",
      ]
    : [
        "Resume your local session instantly.",
        "Access saved reviews and profile stats.",
        "Use the same auth contract that later can move to a real provider.",
      ];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim() || (isRegister && !name.trim())) {
      setError("Complete the required fields before continuing.");
      return;
    }

    startTransition(async () => {
      const result = isRegister
        ? await register({ name, email, password })
        : await login({ email, password });

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push("/profile");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Surface className="flex flex-col justify-between gap-8 p-6 lg:min-h-[40rem] lg:p-8">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Authentication
          </p>
          <div className="space-y-4">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {isRegister ? "Create your cinematic profile" : "Welcome back to your movie desk"}
            </h1>
            <p className="text-base leading-8 text-muted-foreground">
              {isRegister
                ? "Set up a local account to keep your profile, ratings, and review activity attached to the same identity."
                : "Sign in with the local auth layer and continue writing reviews, switching themes, and using the profile area."}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {featureItems.map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-white/8 bg-surface-strong px-4 py-4 text-sm leading-7 text-muted-foreground"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="rounded-[1.6rem] border border-gold/18 bg-gold/10 px-4 py-4 text-sm leading-7 text-foreground">
          Demo account: <span className="font-medium">elena@example.com</span> /{" "}
          <span className="font-medium">demo1234</span>
        </div>
      </Surface>

      <Surface className="mx-auto w-full max-w-xl space-y-6 p-6 lg:p-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {isRegister ? "Register" : "Login"}
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            {isRegister ? "Create your account" : "Sign in to continue"}
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            {isRegister
              ? "The account is stored locally for now, but the feature boundaries are already ready for a real auth backend."
              : "Use your existing local account or the seeded demo credentials to explore the full flow."}
          </p>
        </div>

        {error ? <StatusBanner tone="error" message={error} /> : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                className="min-h-13 w-full rounded-[1.4rem] border border-white/10 bg-surface-strong px-4 text-sm outline-none focus:border-primary/40"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="min-h-13 w-full rounded-[1.4rem] border border-white/10 bg-surface-strong px-4 text-sm outline-none focus:border-primary/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="min-h-13 w-full rounded-[1.4rem] border border-white/10 bg-surface-strong px-4 text-sm outline-none focus:border-primary/40"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="min-h-13 w-full rounded-[1.4rem] bg-gradient-to-r from-electric via-primary to-pink-glow px-4 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {isPending ? "Please wait..." : isRegister ? "Create account" : "Login"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground">
          {isRegister ? "Already have an account?" : "Need an account?"}{" "}
          <Link href={isRegister ? "/login" : "/register"} className="font-medium text-primary">
            {isRegister ? "Go to login" : "Go to register"}
          </Link>
        </p>
      </Surface>
    </div>
  );
}

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthCard } from "@/features/auth/components/AuthCard";
import { HeroSection } from "@/features/auth/components/HeroSection";
import { useAuth } from "@/features/auth/context/AuthContext";
import { cn } from "@/utils/cn";

interface AuthFormProps {
  variant: "login" | "register";
}

const featureItems = [
  {
    icon: "play" as const,
    title: "Track favorites",
    description: "Keep your next must-watch titles close.",
  },
  {
    icon: "star" as const,
    title: "Rate instantly",
    description: "Give every film your score in seconds.",
  },
  {
    icon: "chat" as const,
    title: "Share reviews",
    description: "Turn opinions into recommendations worth reading.",
  },
  {
    icon: "spark" as const,
    title: "Find fresh picks",
    description: "Stay one step away from your next great watch.",
  },
] as const;

const authCopy = {
  login: {
    eyebrow: "Welcome Back",
    title: "Welcome back",
    description: "Sign in to continue.",
    submitLabel: "Sign In",
    switchText: "Need an account?",
    switchLabel: "Join Free",
    switchTo: "register" as const,
  },
  register: {
    eyebrow: "Join Free",
    title: "Start your movie profile today",
    description: "Join free and make every review feel personal from day one.",
    submitLabel: "Create My Account",
    switchText: "Already have an account?",
    switchLabel: "Sign In",
    switchTo: "login" as const,
  },
} as const;

export function AuthForm({ variant }: AuthFormProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const requestedMode = searchParams.get("mode");
  const requestedNextPath = searchParams.get("next");
  const activeVariant =
    requestedMode === "login" || requestedMode === "register" ? requestedMode : variant;
  const isRegister = activeVariant === "register";
  const isLoginLayout = variant === "login";
  const copy = authCopy[activeVariant];
  const redirectTarget =
    requestedNextPath && requestedNextPath.startsWith("/") ? requestedNextPath : "/profile";

  // Keep the auth card mode and navbar CTA in sync through one shared query param.
  function buildModeHref(nextVariant: "login" | "register") {
    const params = new URLSearchParams(searchParams.toString());

    if (nextVariant === variant) {
      params.delete("mode");
    } else {
      params.set("mode", nextVariant);
    }

    const query = params.toString();
    return `${pathname}${query ? `?${query}` : ""}#auth-card`;
  }

  function handleVariantChange(nextVariant: "login" | "register") {
    if (nextVariant === activeVariant) {
      return;
    }

    setError(null);
    router.replace(buildModeHref(nextVariant), { scroll: false });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim() || (isRegister && !name.trim())) {
      setError("Please fill in every required field.");
      return;
    }

    if (isRegister && password.trim().length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = isRegister
        ? await register({ name, email, password })
        : await login({ email, password });

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push(redirectTarget);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative z-0 flex w-full flex-1 items-stretch isolate">
      {isLoginLayout ? (
        <div className="bg-aurora" aria-hidden="true" />
      ) : (
        <>
          <div className="pointer-events-none absolute left-4 top-6 h-32 w-32 rounded-full bg-gold/12 blur-3xl sm:left-8" />
          <div className="pointer-events-none absolute bottom-6 right-4 h-40 w-40 rounded-full bg-electric/16 blur-3xl sm:right-8" />
        </>
      )}

      {/* Keep the main hero/auth composition centered and visually contained. */}
      <div
        className={cn(
          "relative grid min-h-full w-full grid-cols-1 items-stretch gap-4",
          isLoginLayout
            ? "lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-center lg:gap-10"
            : "lg:grid-cols-[minmax(0,1.18fr)_minmax(24rem,0.92fr)] lg:gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(27rem,0.96fr)] xl:gap-6",
        )}
      >
        <div className={cn("order-2 flex lg:order-1", isLoginLayout && "lg:justify-start")}>
          <HeroSection featureItems={featureItems} layout={isLoginLayout ? "login" : "default"} />
        </div>

        <div className={cn("order-1 flex lg:order-2", isLoginLayout && "lg:justify-center")}>
          <AuthCard
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
            error={error}
            align={isLoginLayout ? "center" : "edge"}
          >
            <form className="space-y-3" onSubmit={handleSubmit}>
              {isRegister ? (
                <div className="space-y-2">
                  <label className="text-[0.78rem] font-medium text-white" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/42 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-[0.78rem] font-medium text-white" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/42 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-[0.78rem] font-medium text-white" htmlFor="password">
                    Password
                  </label>
                  {isRegister ? (
                    <span className="text-[0.68rem] font-medium text-white/50">At least 8 characters</span>
                  ) : null}
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={isRegister ? "Create your password" : "Enter your password"}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/42 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:scale-[1.03] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {isSubmitting ? "Please wait..." : copy.submitLabel}
              </button>
            </form>

            <p className="text-center text-[0.78rem] leading-5 text-neutral-400">
              {copy.switchText}{" "}
              <button
                type="button"
                onClick={() => handleVariantChange(copy.switchTo)}
                className="font-semibold text-white transition hover:text-primary"
              >
                {copy.switchLabel}
              </button>
            </p>
          </AuthCard>
        </div>
      </div>
    </div>
  );
}

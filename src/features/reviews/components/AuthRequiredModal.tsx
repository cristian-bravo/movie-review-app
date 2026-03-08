"use client";

import { animate } from "animejs";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { StatusBanner } from "@/components/ui/StatusBanner";
import { useAuth } from "@/features/auth/context/AuthContext";

interface AuthRequiredModalProps {
  open: boolean;
  nextPath: string;
  onAuthenticated?: () => void;
  onOpenChange: (open: boolean) => void;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      <rect x="5" y="10" width="14" height="10" rx="3" />
    </svg>
  );
}

function normalizeNextPath(nextPath: string) {
  return nextPath.startsWith("/") ? nextPath : "/profile";
}

export function AuthRequiredModal({
  open,
  nextPath,
  onAuthenticated,
  onOpenChange,
}: AuthRequiredModalProps) {
  const router = useRouter();
  const { login } = useAuth();
  const titleId = useId();
  const descriptionId = useId();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const afterCloseRef = useRef<(() => void) | null>(null);
  const animationsRef = useRef<Array<{ cancel: () => void }>>([]);
  const isClosingRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(open);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const safeNextPath = normalizeNextPath(nextPath);

  const clearAnimations = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.cancel());
    animationsRef.current = [];
  }, []);

  const finalizeClose = useCallback(() => {
    clearAnimations();
    isClosingRef.current = false;
    setRendered(false);
    setError(null);
    setPassword("");
    onOpenChange(false);

    const afterClose = afterCloseRef.current;
    afterCloseRef.current = null;
    afterClose?.();
  }, [clearAnimations, onOpenChange]);

  const runOpenAnimation = useCallback(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;

    if (!overlay || !panel) {
      return;
    }

    clearAnimations();
    isClosingRef.current = false;
    overlay.style.opacity = "0";
    panel.style.opacity = "0";
    panel.style.transform = "translate3d(0, 28px, 0) scale(0.96)";

    animationsRef.current.push(
      animate(overlay, {
        opacity: [0, 1],
        duration: 240,
        easing: "outQuad",
      }),
    );

    animationsRef.current.push(
      animate(panel, {
        opacity: [0, 1],
        translateY: [28, 0],
        scale: [0.96, 1],
        duration: 420,
        easing: "outCubic",
      }),
    );
  }, [clearAnimations]);

  const runCloseAnimation = useCallback(
    (afterClose?: () => void) => {
      const overlay = overlayRef.current;
      const panel = panelRef.current;

      afterCloseRef.current = afterClose ?? null;

      if (isClosingRef.current) {
        return;
      }

      if (!overlay || !panel) {
        finalizeClose();
        return;
      }

      clearAnimations();
      isClosingRef.current = true;

      animationsRef.current.push(
        animate(overlay, {
          opacity: 0,
          duration: 220,
          easing: "inOutQuad",
        }),
      );

      animationsRef.current.push(
        animate(panel, {
          opacity: 0,
          translateY: 18,
          scale: 0.97,
          duration: 260,
          easing: "inCubic",
          onComplete: finalizeClose,
        }),
      );
    },
    [clearAnimations, finalizeClose],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setRendered(true);
    }
  }, [open]);

  useEffect(() => {
    if (!mounted || !rendered) {
      return;
    }

    if (open) {
      const frame = window.requestAnimationFrame(runOpenAnimation);
      return () => window.cancelAnimationFrame(frame);
    }

    runCloseAnimation();
  }, [mounted, open, rendered, runCloseAnimation, runOpenAnimation]);

  useEffect(() => {
    if (!rendered) {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [rendered]);

  useEffect(() => {
    if (!rendered) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        runCloseAnimation();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, rendered, runCloseAnimation]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to sign in.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login({
        email,
        password,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setEmail("");
      setPassword("");
      runCloseAnimation(() => {
        onAuthenticated?.();
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleJoinFree() {
    runCloseAnimation(() => {
      router.push(`/register?next=${encodeURIComponent(safeNextPath)}#auth-card`);
    });
  }

  if (!mounted || !rendered) {
    return null;
  }

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          runCloseAnimation();
        }
      }}
    >
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-full max-w-md overflow-hidden rounded-[1.9rem] border border-white/12 bg-[linear-gradient(180deg,rgba(8,10,14,0.98),rgba(12,16,24,0.94))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-7"
      >
        <div className="pointer-events-none absolute -left-10 top-6 h-28 w-28 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute right-4 top-16 h-32 w-32 rounded-full bg-sky-400/16 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_26%)]" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-gold shadow-[0_0_36px_rgba(250,204,21,0.14)]">
                <LockIcon />
              </div>
              <div className="space-y-2">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-gold">
                  Sign in required
                </p>
                <h3 id={titleId} className="font-display text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
                  Sign in to publish
                </h3>
                <p id={descriptionId} className="max-w-sm text-sm leading-6 text-white/70">
                  Keep your review on your profile, post it under your name, and join the conversation in one step.
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close sign in modal"
              onClick={() => runCloseAnimation()}
              disabled={isSubmitting}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CloseIcon />
            </button>
          </div>

          {error ? (
            <StatusBanner
              tone="error"
              message={error}
              className="rounded-2xl border-white/10 bg-pink-glow/10 text-white"
            />
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[0.8rem] font-medium text-white" htmlFor="modal-login-email">
                Email address
              </label>
              <input
                id="modal-login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[0.8rem] font-medium text-white" htmlFor="modal-login-password">
                Password
              </label>
              <input
                id="modal-login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="grid gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 px-5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing you in..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => runCloseAnimation()}
                disabled={isSubmitting}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Maybe later
              </button>
            </div>
          </form>

          <p className="text-center text-[0.82rem] leading-6 text-white/58">
            No account yet?{" "}
            <button
              type="button"
              onClick={handleJoinFree}
              className="font-semibold text-white transition hover:text-gold"
            >
              Join Free
            </button>
          </p>
        </div>
      </section>
    </div>,
    document.body,
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { reviewService } from "@/services/review.service";
import type { Review } from "@/types";
import { getInitials } from "@/utils/getInitials";

export function ProfileDashboard() {
  const { session, logout } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    function refreshReviews() {
      if (!session.user) {
        setReviews([]);
        return;
      }

      setReviews(reviewService.getReviewsByUserId(session.user.id));
    }

    refreshReviews();

    function handleStorage() {
      refreshReviews();
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [session.user]);

  if (session.status === "loading") {
    return <Surface className="min-h-[20rem] animate-pulse" />;
  }

  if (!session.user) {
    return (
      <EmptyState
        title="You are not signed in"
        description="Create an account or sign in to keep a local profile, track reviews, and personalize the experience."
        actionHref="/login"
        actionLabel="Go to login"
      />
    );
  }

  const statItems = [
    { label: "Email", value: session.user.email },
    { label: "Reviews", value: String(reviews.length) },
    { label: "Created", value: session.user.createdAt ? session.user.createdAt.slice(0, 10) : "Mongo user" },
  ];
  const genres = session.user.favoriteGenres?.length
    ? session.user.favoriteGenres
    : ["Sci-Fi", "Drama", "Action"];

  return (
    <div className="space-y-8">
      <Surface className="overflow-hidden p-5 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="inline-flex h-18 w-18 items-center justify-center rounded-[1.8rem] bg-gradient-to-br from-electric to-pink-glow text-2xl font-semibold text-white">
              {getInitials(session.user.name)}
            </div>

            <SectionHeading
              eyebrow="Profile"
              title={session.user.name}
              description={
                session.user.bio ?? "Profile loaded from MongoDB through the auth API."
              }
            />

            <div className="flex flex-wrap gap-3">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-white/10 bg-surface-strong px-3 py-1 text-sm text-foreground"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/search"
                className="rounded-full bg-gradient-to-r from-electric via-primary to-pink-glow px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Search movies
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-pink-glow/40"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {statItems.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.6rem] border border-white/10 bg-surface-strong p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-3 font-display text-2xl font-semibold text-foreground break-words">
                  {item.value}
                </p>
              </div>
            ))}

            <div className="rounded-[1.6rem] border border-white/10 bg-surface-strong p-5 sm:col-span-3 lg:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Session
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Auth now runs through MongoDB-backed API routes. Reviews are still stored locally in
                the browser for this version.
              </p>
            </div>
          </div>
        </div>
      </Surface>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="My Reviews"
          title="Recent activity"
          description="Reviews written through the current local review form are surfaced here."
        />
        <ReviewList reviews={reviews} />
      </section>
    </div>
  );
}

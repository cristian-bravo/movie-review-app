"use client";

import { usePathname } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import { RatingStars } from "@/components/reviews/RatingStars";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { Surface } from "@/components/ui/Surface";
import { useAuth } from "@/features/auth/context/AuthContext";
import { AuthRequiredModal } from "@/features/reviews/components/AuthRequiredModal";
import { reviewService } from "@/services/review.service";
import type { Review } from "@/types";

interface ReviewFormProps {
  movieId: string;
  onCreated: (review: Review) => void;
}

export function ReviewForm({ movieId, onCreated }: ReviewFormProps) {
  const { session } = useAuth();
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (session.user?.name) {
      setUsername(session.user.name);
    }
  }, [session.user?.name]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (session.status === "loading") {
      setError("Checking your account. Try again in a second.");
      return;
    }

    // Reviews now require a profile so the modal can guide guests into sign-in.
    if (session.status !== "authenticated" || !session.user) {
      setError("Sign in to publish your review and keep it on your profile.");
      setIsAuthModalOpen(true);
      return;
    }

    if (!username.trim()) {
      setError("Your profile needs a display name before publishing.");
      return;
    }

    if (rating < 1) {
      setError("Select a star rating.");
      return;
    }

    if (comment.trim().length < 12) {
      setError("Write a slightly longer review so the card has useful content.");
      return;
    }

    const createdReview = reviewService.createReview({
      movieId,
      username,
      comment,
      rating,
      user: session.user
        ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            avatar: session.user.avatar,
          }
        : null,
    });

    startTransition(() => {
      onCreated(createdReview);
      setComment("");
      setRating(0);
      setSuccessMessage("Your review is live.");
    });
  }

  return (
    <>
      <Surface className="space-y-6 p-5 lg:p-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Write a review
        </p>
        <h3 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Add your own take
        </h3>
        <p className="text-sm leading-7 text-muted-foreground">
          Rate the movie, share your take, and add your voice to the conversation.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.4rem] border border-white/8 bg-surface-strong px-4 py-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Publishing
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">Ready in seconds</p>
        </div>
        <div className="rounded-[1.4rem] border border-white/8 bg-surface-strong px-4 py-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Profile
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {session.user ? "Linked to your profile" : "Sign in required"}
          </p>
        </div>
        <div className="rounded-[1.4rem] border border-white/8 bg-surface-strong px-4 py-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Rating
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">5-star scale</p>
        </div>
      </div>

      {error ? <StatusBanner tone="error" message={error} /> : null}
      {successMessage ? <StatusBanner tone="success" message={successMessage} /> : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="review-username">
            Profile name
          </label>
          <input
            id="review-username"
            value={username}
            readOnly
            disabled
            placeholder={session.user ? undefined : "Available after you sign in"}
            className="min-h-13 w-full rounded-[1.4rem] border border-white/10 bg-surface-strong px-4 text-sm text-foreground outline-none focus:border-primary/40 disabled:cursor-not-allowed disabled:opacity-75"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Rating</label>
          <div className="rounded-[1.4rem] border border-white/10 bg-surface-strong px-4 py-4">
            <RatingStars
              rating={rating}
              scale={5}
              size="md"
              interactive
              onRate={setRating}
              showLabel={false}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="review-comment">
            Review
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={6}
            placeholder="Share what worked, what did not, and whether you would recommend it."
            className="w-full rounded-[1.6rem] border border-white/10 bg-surface-strong px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
          />
        </div>

        <button
          type="submit"
          disabled={session.status === "loading"}
          className="min-h-12 rounded-full bg-gradient-to-r from-electric via-primary to-pink-glow px-5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:brightness-100"
        >
          {session.status === "loading" ? "Checking account..." : "Publish review"}
        </button>
      </form>
      </Surface>

      <AuthRequiredModal
        open={isAuthModalOpen}
        nextPath={pathname}
        onOpenChange={setIsAuthModalOpen}
        onAuthenticated={() => {
          setError(null);
          setSuccessMessage("You are signed in. Publish when you are ready.");
        }}
      />
    </>
  );
}

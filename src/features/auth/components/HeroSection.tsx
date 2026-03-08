import type { ReactNode } from "react";

import type { FeatureIcon } from "@/features/auth/components/FeatureCard";
import { FeatureCard } from "@/features/auth/components/FeatureCard";
import { cn } from "@/utils/cn";

interface HeroFeatureItem {
  icon: FeatureIcon;
  title: string;
  description: string;
}

interface HeroSectionProps {
  artwork?: ReactNode;
  featureItems: ReadonlyArray<HeroFeatureItem>;
  layout?: "default" | "login";
}

export function HeroSection({
  artwork,
  featureItems,
  layout = "default",
}: HeroSectionProps) {
  const isLoginLayout = layout === "login";

  return (
    <section
      className={cn(
        "relative flex w-full flex-1 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,10,14,0.96),rgba(8,10,14,0.82))] shadow-card backdrop-blur-2xl",
        isLoginLayout ? "w-full max-w-[56rem] p-3 lg:p-4" : "p-5 lg:min-h-full lg:p-6",
      )}
    >
      <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-primary/16 blur-3xl" />
      <div className="pointer-events-none absolute left-24 bottom-12 h-56 w-56 rounded-full bg-electric/12 blur-3xl" />
      <div className="pointer-events-none absolute right-16 top-14 h-44 w-44 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 bottom-10 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_24%),radial-gradient(circle_at_75%_28%,rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.1),transparent_30%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/38 to-transparent" />

      <div
        className={cn(
          "relative z-10 flex w-full flex-col justify-center space-y-5",
          isLoginLayout ? "max-w-[44rem]" : "max-w-xl",
        )}
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-white/72">
                Streaming Night
              </span>
            </div>

            <div>
              <h1
                className={cn(
                  "max-w-xl font-display font-bold leading-tight tracking-tight text-white",
                  isLoginLayout ? "text-[2.35rem] lg:max-w-none lg:text-[2.8rem]" : "text-3xl sm:text-4xl lg:text-[2.95rem] xl:text-[3.1rem]",
                )}
              >
                <span className={cn("block", isLoginLayout && "lg:whitespace-nowrap")}>
                  Discover movies.
                </span>
                <span className={cn("block", isLoginLayout && "lg:whitespace-nowrap")}>
                  Rate movies.
                </span>
                <span className={cn("block", isLoginLayout && "lg:whitespace-nowrap")}>
                  Share reviews.
                </span>
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-400 lg:text-[0.96rem]">
                Track what you watch, find new favorites, and share reviews from one cinematic
                space built for movie lovers.
              </p>
            </div>
          </div>

          {/* Keep the feature area compact so the full hero stays visible on desktop. */}
          <div
            className={cn(
              "mt-5 grid gap-3 sm:grid-cols-2",
              isLoginLayout ? "grid-cols-2 gap-4" : "grid-cols-1",
            )}
          >
            {featureItems.map((item) => (
              <FeatureCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>

        {artwork ? <div className="w-full max-w-xl">{artwork}</div> : null}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Surface } from "@/components/ui/Surface";

interface CatalogErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function CatalogError({ error, reset }: CatalogErrorProps) {
  void error;

  return (
    <Container className="section-spacing stack-gap">
      <Surface className="mx-auto max-w-3xl p-6 text-center lg:p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Catalog
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
              Unable to load movies
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              The catalog could not be loaded right now. Retry the request or switch to direct
              search while the feed reconnects.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-electric via-primary to-pink-glow px-5 text-sm font-semibold text-primary-foreground transition duration-300 hover:brightness-110"
            >
              Retry
            </button>
            <Link
              href="/search"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/12 px-5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-white/5"
            >
              Open Search
            </Link>
          </div>
        </div>
      </Surface>
    </Container>
  );
}

import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/constants/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/8 bg-surface/55 backdrop-blur-xl">
      <Container
        variant="wide"
        className="grid gap-8 py-12 md:grid-cols-2 2xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-electric via-primary to-pink-glow text-sm font-black uppercase tracking-[0.2em] text-white">
              MR
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-foreground">{siteConfig.name}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Cinematic review platform
              </p>
            </div>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted-foreground">{siteConfig.tagline}</p>
          <p className="text-sm leading-7 text-muted-foreground">
            Search real titles, inspect richer movie metadata, and keep the review/auth layer
            modular while the project grows toward a backend.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold uppercase tracking-[0.18em] text-foreground">Explore</p>
          <Link href="/catalog" className="block text-muted-foreground transition hover:text-primary">
            Catalog
          </Link>
          <Link href="/search" className="block text-muted-foreground transition hover:text-primary">
            Search movies
          </Link>
          <Link href="/movies" className="block text-muted-foreground transition hover:text-primary">
            Featured collection
          </Link>
          <Link href="/profile" className="block text-muted-foreground transition hover:text-primary">
            Profile
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold uppercase tracking-[0.18em] text-foreground">Platform</p>
          <p className="text-muted-foreground">Responsive dark/light UI with cinematic gradients.</p>
          <p className="text-muted-foreground">Reviews and auth remain local-first in this version.</p>
          <Link href="/auth/session" className="block text-primary transition hover:opacity-80">
            Session debug
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold uppercase tracking-[0.18em] text-foreground">Developer Notes</p>
          <p className="text-muted-foreground">
            API docs and architectural decisions live in <code className="rounded bg-surface-strong px-2 py-1">/docs</code>.
          </p>
          <p className="text-muted-foreground">
            Movie data access stays isolated behind the service layer for maintainable provider changes.
          </p>
        </div>
      </Container>
    </footer>
  );
}

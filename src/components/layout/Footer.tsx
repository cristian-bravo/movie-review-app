import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/constants/site";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { href: "/catalog", label: "Catalog" },
      { href: "/search?q=trending", label: "Trending" },
      { href: "/search?q=popular", label: "Popular" },
      { href: "/search?q=top%20rated", label: "Top Rated" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/movies", label: "Reviews" },
      { href: "/catalog", label: "Lists" },
      { href: "/profile", label: "Favorites" },
      { href: "/profile", label: "Profiles" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/search", label: "Help Center" },
      { href: "mailto:hello@reelreview.app", label: "Contact" },
      { href: "/", label: "Privacy Policy" },
      { href: "/", label: "Terms of Service" },
    ],
  },
] as const;

const socialLinks = [
  { href: "https://twitter.com", label: "Twitter" },
  { href: "https://github.com", label: "GitHub" },
  { href: "https://instagram.com", label: "Instagram" },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_82%,transparent),color-mix(in_srgb,var(--background)_88%,transparent))] backdrop-blur-xl">
      <Container variant="wide" className="py-14 sm:py-16">
        <div className="grid gap-10 border-b border-white/8 pb-10 md:grid-cols-2 xl:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] xl:gap-12">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-transparent">
                <Image
                  src="/logo/logo-movie.png"
                  alt="ReelReview logo"
                  width={44}
                  height={44}
                  className="h-9 w-9 object-contain"
                />
              </span>
              <div className="space-y-0.5">
                <p className="font-display text-[1.34rem] font-semibold tracking-tight text-foreground">
                  {siteConfig.name}
                </p>
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Movie discovery platform
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-muted-foreground">
              Discover movies, share reviews, and keep track of what you love watching.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:border-white/18 hover:bg-white/10 hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                {group.title}
              </p>
              <div className="grid gap-3 text-sm">
                {group.links.map((link) =>
                  link.href.startsWith("mailto:") ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-muted-foreground transition hover:text-primary"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-muted-foreground transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-5 text-sm text-muted-foreground">
          <p>&copy; 2025 ReelReview - Made for movie lovers.</p>
        </div>
      </Container>
    </footer>
  );
}

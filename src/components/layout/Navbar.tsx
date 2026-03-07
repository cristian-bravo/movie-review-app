"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/features/auth/context/AuthContext";
import { authNavigation, primaryNavigation } from "@/lib/constants/navigation";
import { getInitials } from "@/utils/getInitials";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7H20" />
      <path d="M4 12H20" />
      <path d="M4 17H20" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { session, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  const navTone = isHome
    ? "text-white/78 hover:bg-white/8 hover:text-white"
    : "text-muted-foreground hover:bg-white/6 hover:text-foreground";
  const activeNavTone = isHome
    ? "border border-white/14 bg-white/10 text-white shadow-soft"
    : "border border-white/10 bg-white/8 text-foreground shadow-soft";
  const headerChrome = isHome
    ? isMenuOpen || isScrolled
      ? "border-b border-white/10 bg-gradient-to-b from-black/90 via-black/65 to-black/16 backdrop-blur-xl"
      : "bg-gradient-to-b from-black/72 via-black/28 to-transparent"
    : "border-b border-white/8 bg-background/78 backdrop-blur-xl";

  function renderAuthActions(compact = false) {
    if (session.status === "authenticated" && session.user) {
      return (
        <>
          <Link
            href="/profile"
            className={compact ? "stream-button stream-button--secondary w-full justify-center" : "stream-button stream-button--secondary"}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-electric to-pink-glow text-xs font-semibold text-white">
              {getInitials(session.user.name)}
            </span>
            <span>{session.user.name}</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className={compact ? "stream-button stream-button--ghost w-full justify-center" : "stream-button stream-button--ghost"}
          >
            Logout
          </button>
        </>
      );
    }

    return authNavigation.map((item) => {
      const active = isActivePath(pathname, item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`stream-button ${
            active ? "stream-button--primary" : "stream-button--secondary"
          } ${compact ? "w-full justify-center" : ""}`}
        >
          {item.label}
        </Link>
      );
    });
  }

  return (
    <header className={isHome ? "absolute inset-x-0 top-0 z-50" : "sticky top-0 z-40"}>
      <div className={headerChrome}>
        <Container variant="wide" className="py-4">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <Link href="/" className="group inline-flex min-w-0 items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-gradient-to-br from-electric via-primary to-pink-glow text-sm font-black uppercase tracking-[0.22em] text-white shadow-soft transition duration-200 group-hover:scale-[1.03]">
                MR
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className={`truncate font-display text-xl font-semibold tracking-tight ${isHome ? "text-white" : "text-foreground"}`}>
                  Movie Review App
                </p>
                <p className={`hidden text-[0.72rem] font-semibold uppercase tracking-[0.22em] sm:block ${isHome ? "text-white/64" : "text-muted-foreground"}`}>
                  Discover, inspect, review
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-6">
              <nav className="flex items-center gap-2 text-sm">
                {primaryNavigation.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-4 py-2.5 transition ${active ? activeNavTone : navTone}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                {renderAuthActions()}
              </div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition ${isHome ? "border-white/14 bg-white/8 text-white" : "border-white/10 bg-surface text-foreground"}`}
              >
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          {isMenuOpen ? (
            <div className="mt-4 grid gap-4 rounded-[1.75rem] border border-white/12 bg-black/72 p-4 shadow-card backdrop-blur-2xl lg:hidden">
              <nav className="grid gap-2 text-sm">
                {primaryNavigation.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-2xl px-4 py-3 transition ${active ? "border border-white/14 bg-white/10 text-white" : "text-white/78 hover:bg-white/8 hover:text-white"}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="grid gap-2">
                {renderAuthActions(true)}
              </div>
            </div>
          ) : null}
        </Container>
      </div>
    </header>
  );
}

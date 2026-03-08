"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/features/auth/context/AuthContext";
import { primaryNavigation } from "@/lib/constants/navigation";
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

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition duration-300 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 9L12 15L18 9" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2" />
      <path d="M10 16l4-4-4-4" />
      <path d="M14 12H5" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isFloatingNavbar = !isAuthRoute;
  const { session, logout } = useAuth();
  const visiblePrimaryNavigation = primaryNavigation.filter((item) => item.href !== "/profile");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navTone = "text-foreground/78 hover:bg-white/8 hover:text-foreground";
  const activeNavTone = "border border-white/14 bg-white/10 text-foreground shadow-soft";
  const headerChrome = isAuthRoute
    ? isMenuOpen || isScrolled
      ? "border-b border-white/10 bg-gradient-to-b from-black/90 via-black/70 to-black/24 backdrop-blur-xl"
      : "bg-gradient-to-b from-black/82 via-black/42 to-transparent"
    : isMenuOpen
      ? "border-b border-white/10 bg-black/72 backdrop-blur-xl"
      : "bg-transparent";

  function getAuthHref(mode: "login" | "register") {
    if (!isAuthRoute) {
      return mode === "login" ? "/login" : "/register";
    }

    const params = new URLSearchParams(searchParams.toString());

    if ((pathname === "/login" && mode === "login") || (pathname === "/register" && mode === "register")) {
      params.delete("mode");
    } else {
      params.set("mode", mode);
    }

    const query = params.toString();
    return `${pathname}${query ? `?${query}` : ""}#auth-card`;
  }

  function handleLogout() {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    logout();
  }

  function renderAccountMenu(compact = false) {
    if (!session.user) {
      return null;
    }

    const menuPanelClassName = compact
      ? "mt-2 grid gap-1 rounded-[1.35rem] border border-white/12 bg-white/[0.04] p-2 shadow-soft backdrop-blur-xl"
      : "absolute right-0 top-full z-20 mt-3 min-w-[14rem] overflow-hidden rounded-[1.35rem] border border-white/12 bg-[linear-gradient(180deg,rgba(8,10,14,0.96),rgba(8,10,14,0.88))] p-2 shadow-card backdrop-blur-2xl";

    const actionClassName =
      "flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm font-medium text-foreground/82 transition hover:bg-white/8 hover:text-foreground";

    return (
      <div ref={userMenuRef} className={compact ? "w-full" : "relative"}>
        <button
          type="button"
          onClick={() => setIsUserMenuOpen((open) => !open)}
          aria-expanded={isUserMenuOpen}
          aria-haspopup="menu"
          className={
            compact
              ? "inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-full border border-white/14 bg-white/8 px-3.5 py-2.5 text-left text-foreground transition hover:bg-white/10"
              : "inline-flex min-h-11 items-center gap-3 rounded-full border border-white/14 bg-white/8 px-3 py-2 text-left text-foreground transition hover:bg-white/10"
          }
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-electric to-pink-glow text-xs font-semibold text-white shadow-soft">
              {getInitials(session.user.name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.95rem] font-semibold tracking-tight text-foreground">
                {session.user.name}
              </span>
              <span className="block truncate text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Account
              </span>
            </span>
          </span>
          <span className="text-foreground/64">
            <ChevronDownIcon open={isUserMenuOpen} />
          </span>
        </button>

        {isUserMenuOpen ? (
          <div className={menuPanelClassName} role="menu">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => {
                setIsUserMenuOpen(false);
                setIsMenuOpen(false);
              }}
              className={actionClassName}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-foreground/86">
                <ProfileIcon />
              </span>
              <span className="grid">
                <span>View profile</span>
                <span className="text-[0.7rem] font-medium text-muted-foreground">
                  Reviews, favorites, and activity
                </span>
              </span>
            </Link>

            <button type="button" role="menuitem" onClick={handleLogout} className={actionClassName}>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-foreground/86">
                <LogoutIcon />
              </span>
              <span className="grid">
                <span>Logout</span>
                <span className="text-[0.7rem] font-medium text-muted-foreground">
                  Close your current session
                </span>
              </span>
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  function renderAuthActions(compact = false) {
    if (isAuthRoute) {
      const joinFreeHref = getAuthHref("login");

      return (
        <Link
          href={joinFreeHref}
          className={
            compact
              ? "inline-flex min-h-10 w-full items-center justify-center rounded-full border border-primary/35 bg-gradient-to-r from-primary/85 via-electric/80 to-pink-glow/85 px-4 py-2 text-[1rem] font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-card hover:brightness-110"
              : "inline-flex min-h-10 items-center justify-center rounded-full border border-primary/35 bg-gradient-to-r from-primary/85 via-electric/80 to-pink-glow/85 px-4 py-2 text-[1rem] font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-card hover:brightness-110"
          }
        >
          Join Free
        </Link>
      );
    }

    return (
      <Link
        href={getAuthHref("login")}
        className={
          compact
            ? "inline-flex min-h-10 w-full items-center justify-center rounded-full border border-primary/35 bg-gradient-to-r from-primary/85 via-electric/80 to-pink-glow/85 px-4 py-2 text-[1rem] font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-card hover:brightness-110"
            : "inline-flex min-h-10 items-center justify-center rounded-full border border-primary/35 bg-gradient-to-r from-primary/85 via-electric/80 to-pink-glow/85 px-4 py-2 text-[1rem] font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-card hover:brightness-110"
        }
      >
        Join Free
      </Link>
    );
  }

  return (
    <header className={isFloatingNavbar ? "absolute inset-x-0 top-0 z-50" : "sticky inset-x-0 top-0 z-50"}>
      <div className={headerChrome}>
        <Container variant="wide" className="py-4">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <Link href="/" className="group inline-flex min-w-0 items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-transparent transition duration-200 group-hover:scale-[1.03]">
                <Image
                  src="/logo/logo-movie.png"
                  alt="ReelReview logo"
                  width={44}
                  height={44}
                  priority
                  className="h-9 w-9 object-contain"
                />
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className="truncate font-display text-[1.34rem] font-semibold tracking-tight text-foreground">
                  ReelReview
                </p>
                <p className="hidden text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block">
                  Discover, inspect, review
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-6">
              <nav className="flex items-center gap-2 text-[0.98rem]">
                {visiblePrimaryNavigation.map((item) => {
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

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {session.status === "authenticated" && session.user ? renderAccountMenu() : renderAuthActions()}
            </div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/14 bg-white/8 text-foreground transition"
              >
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          {isMenuOpen ? (
            <div className="mt-4 grid gap-4 rounded-[1.75rem] border border-white/12 bg-surface p-4 shadow-card backdrop-blur-2xl lg:hidden">
              <nav className="grid gap-2 text-sm">
                {visiblePrimaryNavigation.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-2xl px-4 py-3 transition ${active ? "border border-white/14 bg-white/10 text-foreground" : "text-foreground/78 hover:bg-white/8 hover:text-foreground"}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="grid gap-2">
                {session.status === "authenticated" && session.user
                  ? renderAccountMenu(true)
                  : renderAuthActions(true)}
              </div>
            </div>
          ) : null}
        </Container>
      </div>
    </header>
  );
}

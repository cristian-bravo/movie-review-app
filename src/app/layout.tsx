import type { Metadata } from "next";
import { Outfit, Sora } from "next/font/google";
import { Suspense } from "react";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { AppProviders } from "@/components/providers/AppProviders";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { siteConfig } from "@/lib/constants/site";

import "@/app/globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

function NavbarFallback() {
  return (
    <header aria-hidden="true" className="absolute inset-x-0 top-0 z-40">
      <Container variant="wide" className="py-4">
        <div className="min-h-16" />
      </Container>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${sora.variable} page-backdrop film-grain flex min-h-screen flex-col antialiased`}
      >
        <ThemeScript />
        <AppProviders>
          <Suspense fallback={<NavbarFallback />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}

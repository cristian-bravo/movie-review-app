"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/utils/cn";

import styles from "@/styles/components/theme-toggle.module.css";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5V5.5M12 18.5V21.5M21.5 12H18.5M5.5 12H2.5M18.7 5.3L16.6 7.4M7.4 16.6L5.3 18.7M18.7 18.7L16.6 16.6M7.4 7.4L5.3 5.3" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.2 15.2A8.8 8.8 0 1 1 8.8 3.8A7.3 7.3 0 0 0 20.2 15.2Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(styles.toggle, !isDark && styles.toggleLight)}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className={styles.track}>
        <span className={styles.thumb}>{isDark ? <SunIcon /> : <MoonIcon />}</span>
      </span>
      <span className={styles.label}>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}

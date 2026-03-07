import Link from "next/link";

import { cn } from "@/utils/cn";

import styles from "@/styles/components/search-bar.module.css";

interface SearchBarProps {
  action?: string;
  defaultValue?: string;
  buttonLabel?: string;
  className?: string;
  placeholder?: string;
  helperText?: string;
  suggestions?: string[];
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16L21 21" />
    </svg>
  );
}

export function SearchBar({
  action = "/search",
  defaultValue,
  buttonLabel = "Search",
  className,
  placeholder = "Search titles like Dune, Interstellar, The Batman...",
  helperText = "Search the live movie catalog and jump directly into full detail pages with real posters, metadata, and reviews.",
  suggestions = ["Dune", "Oppenheimer", "Interstellar", "The Batman"],
}: SearchBarProps) {
  return (
    <div className={cn(styles.shell, className)}>
      <div className={styles.content}>
        <form action={action} className={styles.form}>
          <label className="sr-only" htmlFor="movie-search">
            Search movies
          </label>

          <div className={styles.inputWrap}>
            <SearchIcon />
            <input
              id="movie-search"
              name="q"
              defaultValue={defaultValue}
              placeholder={placeholder}
              className={styles.input}
            />
          </div>

          <button type="submit" className="stream-button stream-button--primary animate-button-glow">
            {buttonLabel}
          </button>
        </form>

        <div className={styles.meta}>
          <p className="text-sm leading-6 text-muted-foreground">{helperText}</p>

          <div className={styles.chips}>
            {suggestions.map((suggestion) => (
              <Link
                key={suggestion}
                href={`${action}?q=${encodeURIComponent(suggestion)}`}
                className={styles.chip}
              >
                {suggestion}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

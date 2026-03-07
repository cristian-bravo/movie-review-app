import { storageKeys } from "@/lib/constants/storage";
import type { ThemeMode } from "@/types";
import { isBrowser } from "@/utils/isBrowser";

const DEFAULT_THEME: ThemeMode = "dark";

class ThemeService {
  getTheme(): ThemeMode {
    if (!isBrowser()) {
      return DEFAULT_THEME;
    }

    const storedTheme = window.localStorage.getItem(storageKeys.theme);

    return storedTheme === "light" ? "light" : DEFAULT_THEME;
  }

  applyTheme(theme: ThemeMode) {
    if (!isBrowser()) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(storageKeys.theme, theme);
  }
}

export const themeService = new ThemeService();


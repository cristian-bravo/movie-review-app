import { storageKeys } from "@/lib/constants/storage";

const themeScript = `
  (function() {
    try {
      var storedTheme = localStorage.getItem("${storageKeys.theme}");
      var theme = storedTheme === "light" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.style.colorScheme = "dark";
    }
  })();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}


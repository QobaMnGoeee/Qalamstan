const TURAN_THEME_STORAGE_KEY = "turan-studio-theme";

function turanGetStoredTheme() {
  try {
    const stored = window.localStorage.getItem(TURAN_THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch (error) {
    return null;
  }
  return null;
}

function turanStoreTheme(theme) {
  try {
    window.localStorage.setItem(TURAN_THEME_STORAGE_KEY, theme);
  } catch (error) {
    return;
  }
}

function turanApplyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  turanStoreTheme(theme);
}

function turanApplyInitialTheme() {
  const stored = turanGetStoredTheme();
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initialTheme);
}

function turanInitThemeToggleButtons() {
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      turanApplyTheme(current === "dark" ? "light" : "dark");
    });
  });
}

turanApplyInitialTheme();
document.addEventListener("DOMContentLoaded", turanInitThemeToggleButtons);

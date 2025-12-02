export type Locale = "de" | "en";

export const defaultLocale: Locale = "de";
export const locales: Locale[] = ["de", "en"];

export function getLocaleFromStorage(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const stored = localStorage.getItem("locale");
  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale;
  }
  return defaultLocale;
}

export function setLocaleToStorage(locale: Locale): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale);
  }
}

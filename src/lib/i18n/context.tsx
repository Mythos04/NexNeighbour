"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  useCallback,
  type ReactNode,
} from "react";
import { de } from "./dictionary.de";
import { en } from "./dictionary.en";
import {
  type Locale,
  defaultLocale,
  getLocaleFromStorage,
  setLocaleToStorage,
} from "./config";

export type TranslationKey = keyof typeof de;
type Dictionary = typeof de;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const dictionaries: Record<Locale, Dictionary> = { de, en };

const I18nContext = createContext<I18nContextType | null>(null);

// Use useSyncExternalStore for SSR-safe localStorage access
function useLocaleFromStorage(): Locale {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, []);

  const getSnapshot = useCallback(() => getLocaleFromStorage(), []);
  const getServerSnapshot = useCallback(() => defaultLocale, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const storedLocale = useLocaleFromStorage();
  const [locale, setLocaleState] = useState<Locale>(storedLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocaleToStorage(newLocale);
  };

  const t = (key: TranslationKey): string => {
    return dictionaries[locale][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

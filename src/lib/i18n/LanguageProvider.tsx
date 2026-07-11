"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import en from "./dictionaries/en.json";
import id from "./dictionaries/id.json";
import { getSettings, setLanguageSetting, type Language } from "@/features/settings/hooks/useSettings";

const dictionaries = { en, id };

export type Dictionary = typeof id;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    setLanguageState(getSettings().language);
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    setLanguageSetting(lang);
    document.documentElement.lang = lang;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: dictionaries[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}

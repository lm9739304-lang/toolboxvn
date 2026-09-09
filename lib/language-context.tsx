"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "@/lib/translations";

type LanguageContextType = {
  lang: Lang;
  t: TranslationKey extends string ? (key: TranslationKey, ...args: unknown[]) => string : never;
  setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANG_KEY = "toolboxvn:lang";

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "vi" || stored === "en") return stored;
  } catch {}
  return "en";
}

function tFunction(lang: Lang) {
  return (key: TranslationKey, ...args: unknown[]): string => {
    const val = translations[lang][key];
    if (typeof val === "function") {
      return (val as (...a: unknown[]) => string)(...args);
    }
    return val as string;
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    setLangState(getInitialLang());
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch {}
  };

  const value: LanguageContextType = {
    lang,
    t: tFunction(lang) as LanguageContextType["t"],
    setLang,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

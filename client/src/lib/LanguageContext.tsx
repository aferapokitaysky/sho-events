import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionaries, type Lang, type SiteContent } from "@/content";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: SiteContent;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "sho-lang";
const LANG_PARAM = "lang";

function isLang(value: string | null): value is Lang {
  return !!value && value in dictionaries;
}

function getLangFromUrl(): Lang | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get(LANG_PARAM);
  return isLang(urlLang) ? urlLang : null;
}

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "ru";
  const urlLang = getLangFromUrl();
  if (urlLang) return urlLang;
  const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (isLang(stored)) return stored;
  const nav = window.navigator.language?.slice(0, 2);
  if (nav === "en") return "en";
  if (nav === "sk" || nav === "cs") return "sk";
  return "ru";
}

function syncUrlLang(lang: Lang) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set(LANG_PARAM, lang);
  window.history.replaceState(window.history.state, "", url);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  const setLang = (next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    syncUrlLang(next);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("font-en", lang === "en");
    syncUrlLang(lang);
  }, [lang]);

  useEffect(() => {
    const syncFromHistory = () => {
      const urlLang = getLangFromUrl();
      if (urlLang) setLangState(urlLang);
    };
    window.addEventListener("popstate", syncFromHistory);
    return () => window.removeEventListener("popstate", syncFromHistory);
  }, []);

  const value = useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

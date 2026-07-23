import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Lang, TKey } from "./translations";
import { runAfterCriticalPaint } from "@/lib/startup";
import { translateLite } from "./translations-lite";

type TranslateFn = (key: TKey, lang: Lang) => string;

type Ctx = {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: TKey) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "saba_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start with "ar" to match SSR, then sync with localStorage after mount
  const [lang, setLangState] = useState<Lang>("ar");
  const [fullTranslate, setFullTranslate] = useState<TranslateFn | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "ar" || v === "en") setLangState(v);
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadFull = () => {
      import("./translations").then((m) => {
        if (!cancelled) setFullTranslate(() => m.translate);
      }).catch(() => {});
    };
    if (window.location.pathname === "/") {
      const cancel = runAfterCriticalPaint(loadFull, 9000);
      window.addEventListener("scroll", loadFull, { once: true, passive: true });
      return () => {
        cancelled = true;
        cancel?.();
        window.removeEventListener("scroll", loadFull);
      };
    }
    loadFull();
    return () => { cancelled = true; };
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "ar" ? "en" : "ar");
  }, [lang, setLang]);

  // Sync <html lang/dir> with current language
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  const value = useMemo<Ctx>(() => ({
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    setLang,
    toggle,
    t: (key) => (fullTranslate ?? translateLite)(key, lang),
  }), [fullTranslate, lang, setLang, toggle]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Safe fallback (e.g. during SSR before provider mounts)
    return {
      lang: "ar" as Lang,
      dir: "rtl" as const,
      setLang: () => {},
      toggle: () => {},
      t: (key: TKey) => translateLite(key, "ar"),
    };
  }
  return ctx;
}
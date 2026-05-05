import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogIn, ShoppingCart, User } from "lucide-react";
import logo from "@/assets/logo.png";
import flagSA from "@/assets/flag-sa.jpg";
import flagUS from "@/assets/flag-us.jpg";
import { useCart } from "@/hooks/useCart";
import { useLang } from "@/i18n/LanguageProvider";
import type { TKey } from "@/i18n/translations";

const navLinks: { to: any; key: TKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/services", key: "nav.services" },
  { to: "/plans", key: "nav.plans" },
  { to: "/portfolio", key: "nav.portfolio" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { lang, toggle: toggleLang, t } = useLang();
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src={logo}
            alt="سابا ديزاين"
            width={120}
            height={48}
            className="h-9 sm:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.key}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="relative py-1 text-sm font-medium text-foreground/80 transition-colors hover:text-primary after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:rounded-full after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100"
              activeProps={{ className: "text-primary font-bold after:scale-x-100" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LangSwitch lang={lang} onClick={toggleLang} />
          <Link
            to={"/cart" as any}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-primary hover:text-primary"
            aria-label={t("nav.cart")}
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-1 -left-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <Link
            to={"/account" as any}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-primary hover:text-primary"
            aria-label={t("nav.account")}
          >
            <User className="h-4 w-4" />
          </Link>
          <Link
            to={"/login" as any}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(30,91,148,0.55)] transition hover:bg-primary-dark"
          >
            <LogIn className="h-4 w-4" />
            {t("nav.login")}
          </Link>
        </div>

        {/* Mobile/Tablet quick actions */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <LangSwitch lang={lang} onClick={toggleLang} compact label={t("nav.toggleLang")} />
          <Link
            to={"/cart" as any}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground/70"
            aria-label={t("nav.cart")}
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-1 -left-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("nav.menu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down sheet */}
      <div className={`lg:hidden overflow-hidden border-t border-border bg-background transition-[max-height,opacity] duration-300 ${open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
          {navLinks.map((l) => (
            <Link
              key={l.key}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-foreground/80 hover:bg-muted"
              activeProps={{ className: "text-primary font-bold bg-primary-light" }}
            >
              {t(l.key)}
            </Link>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              to={"/account" as any}
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-white text-sm font-bold text-foreground/80"
            >
              <User className="h-4 w-4" /> {t("nav.account")}
            </Link>
            <Link
              to={"/login" as any}
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground"
            >
              <LogIn className="h-4 w-4" /> {t("nav.login")}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function LangSwitch({ lang, onClick, compact, label }: { lang: "ar" | "en"; onClick: () => void; compact?: boolean; label?: string }) {
  // Show the flag of the language we will switch TO (next language)
  const next = lang === "ar" ? "en" : "ar";
  const flagSrc = next === "en" ? flagUS : flagSA;
  const code = next === "en" ? "EN" : "AR";
  return (
    <button
      onClick={onClick}
      aria-label={label || "Toggle language"}
      className={
        compact
          ? "group inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-full border border-border bg-white px-2.5 text-[11px] font-bold text-foreground/70 transition hover:border-primary hover:text-primary"
          : "group inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-border bg-white px-3 py-1.5 text-xs font-bold text-foreground/70 transition hover:border-primary hover:text-primary"
      }
    >
      <img
        key={code}
        src={flagSrc}
        alt=""
        aria-hidden
        className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-border/60 transition-transform duration-300 group-hover:scale-110"
      />
      <span className="tracking-wide">{code}</span>
    </button>
  );
}
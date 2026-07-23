import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import flagSA from "@/assets/flag-sa.webp";
import flagUS from "@/assets/flag-us.webp";
import { useLang } from "@/i18n/LanguageProvider";
import type { TKey } from "@/i18n/translations";

const DeferredHeaderActions = lazy(() => import("@/components/layout/HeaderActions").then((m) => ({ default: m.HeaderActions })));

const navLinks: { to: any; key: TKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/services", key: "nav.services" },
  { to: "/plans", key: "nav.plans" },
  { to: "/portfolio", key: "nav.portfolio" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
];

type HeaderIconName = "menu" | "x" | "login" | "cart" | "user" | "heart";

const headerIconPaths: Record<HeaderIconName, string[]> = {
  menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
  x: ["M18 6 6 18", "M6 6l12 12"],
  login: ["M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", "M10 17l5-5-5-5", "M15 12H3"],
  cart: ["M6 6h15l-1.5 8h-12L6 6Z", "M6 6 5 3H2", "M9 20h.01", "M18 20h.01"],
  user: ["M20 21a8 8 0 0 0-16 0", "M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"],
  heart: ["M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"],
};

function HeaderIcon({ name, className = "h-4 w-4" }: { name: HeaderIconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {headerIconPaths[name].map((path) => <path key={path} d={path} />)}
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [actionsReady, setActionsReady] = useState(false);
  const { lang, toggle: toggleLang, t } = useLang();

  useEffect(() => {
    if (actionsReady) return;
    const reveal = () => setActionsReady(true);
    const id = window.setTimeout(reveal, 2600);
    window.addEventListener("pointerdown", reveal, { once: true, passive: true });
    window.addEventListener("keydown", reveal, { once: true });
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("pointerdown", reveal);
      window.removeEventListener("keydown", reveal);
    };
  }, [actionsReady]);

  useEffect(() => {
    if (open) setActionsReady(true);
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src="/logo.webp"
            alt="سابا ديزاين"
            width={120}
            height={64}
            fetchPriority="high"
            decoding="async"
            className="h-9 sm:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

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
          {actionsReady ? (
            <Suspense fallback={<HeaderActionsFallback variant="desktop" loginLabel={t("nav.login")} accountLabel={t("nav.account")} cartLabel={t("nav.cart")} />}>
              <DeferredHeaderActions variant="desktop" />
            </Suspense>
          ) : <HeaderActionsFallback variant="desktop" loginLabel={t("nav.login")} accountLabel={t("nav.account")} cartLabel={t("nav.cart")} />}
        </div>

        <div className="flex items-center gap-1.5 lg:hidden">
          <LangSwitch lang={lang} onClick={toggleLang} compact label={t("nav.toggleLang")} />
          {actionsReady ? (
            <Suspense fallback={<HeaderActionsFallback variant="mobile-quick" loginLabel={t("nav.login")} accountLabel={t("nav.account")} cartLabel={t("nav.cart")} />}>
              <DeferredHeaderActions variant="mobile-quick" />
            </Suspense>
          ) : <HeaderActionsFallback variant="mobile-quick" loginLabel={t("nav.login")} accountLabel={t("nav.account")} cartLabel={t("nav.cart")} />}
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("nav.menu")}
          >
            {open ? <HeaderIcon name="x" className="h-5 w-5" /> : <HeaderIcon name="menu" className="h-5 w-5" />}
          </button>
        </div>
      </div>

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
            {actionsReady ? (
              <Suspense fallback={<HeaderActionsFallback variant="mobile-sheet" loginLabel={t("nav.login")} accountLabel={t("nav.account")} cartLabel={t("nav.cart")} onNavigate={() => setOpen(false)} />}>
                <DeferredHeaderActions variant="mobile-sheet" onNavigate={() => setOpen(false)} />
              </Suspense>
            ) : <HeaderActionsFallback variant="mobile-sheet" loginLabel={t("nav.login")} accountLabel={t("nav.account")} cartLabel={t("nav.cart")} onNavigate={() => setOpen(false)} />}
          </div>
        </nav>
      </div>
    </header>
  );
}

function HeaderActionsFallback({ variant, loginLabel, accountLabel, cartLabel, onNavigate }: { variant: "desktop" | "mobile-quick" | "mobile-sheet"; loginLabel: string; accountLabel: string; cartLabel: string; onNavigate?: () => void }) {
  if (variant === "mobile-sheet") {
    return (
      <>
        <Link to={"/account" as any} onClick={onNavigate} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-white text-sm font-bold text-foreground/80">
          <HeaderIcon name="user" /> {accountLabel}
        </Link>
        <Link to={"/login" as any} onClick={onNavigate} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground">
          <HeaderIcon name="login" /> {loginLabel}
        </Link>
      </>
    );
  }

  const size = variant === "mobile-quick" ? "h-9 w-9" : "h-10 w-10";
  return (
    <>
      <Link to={"/account/favorites" as any} className={`inline-flex ${size} items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-primary hover:text-primary`} aria-label="favorites">
        <HeaderIcon name="heart" />
      </Link>
      <Link to={"/cart" as any} className={`inline-flex ${size} items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-primary hover:text-primary`} aria-label={cartLabel}>
        <HeaderIcon name="cart" />
      </Link>
      {variant === "desktop" && (
        <>
          <Link to={"/account" as any} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-primary hover:text-primary" aria-label={accountLabel}>
            <HeaderIcon name="user" />
          </Link>
          <Link to={"/login" as any} className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(30,91,148,0.55)] transition hover:bg-primary-dark">
            <HeaderIcon name="login" />
            {loginLabel}
          </Link>
        </>
      )}
    </>
  );
}

export function LangSwitch({ lang, onClick, compact, label }: { lang: "ar" | "en"; onClick: () => void; compact?: boolean; label?: string }) {
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
        width={24}
        height={16}
        loading="lazy"
        decoding="async"
        className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-border/60 transition-transform duration-300 group-hover:scale-110"
      />
      <span className="tracking-wide">{code}</span>
    </button>
  );
}
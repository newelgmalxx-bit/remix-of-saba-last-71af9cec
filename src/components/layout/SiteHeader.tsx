import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import flagSA from "@/assets/flag-sa.webp";
import flagUS from "@/assets/flag-us.webp";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
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

type HeaderIconName = "menu" | "x" | "login" | "cart" | "user" | "heart" | "package" | "logout" | "dashboard";

const headerIconPaths: Record<HeaderIconName, string[]> = {
  menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
  x: ["M18 6 6 18", "M6 6l12 12"],
  login: ["M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", "M10 17l5-5-5-5", "M15 12H3"],
  cart: ["M6 6h15l-1.5 8h-12L6 6Z", "M6 6 5 3H2", "M9 20h.01", "M18 20h.01"],
  user: ["M20 21a8 8 0 0 0-16 0", "M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"],
  heart: ["M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"],
  package: ["M21 8 12 3 3 8l9 5 9-5Z", "M3 8v8l9 5 9-5V8", "M12 13v8"],
  logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  dashboard: ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"],
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
  const { count } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { lang, toggle: toggleLang, t } = useLang();
  const navigate = useNavigate();
  const [acctOpen, setAcctOpen] = useState(false);
  const initial = (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();
  async function handleLogout() {
    await logout();
    setAcctOpen(false);
    const { toast } = await import("sonner");
    toast.success(t("account.nav.logout"));
    navigate({ to: "/" });
  }
  const [mounted, setMounted] = useState(false);
  const [favCount, setFavCount] = useState(0);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem("saba_service_favorites_v1");
        const obj = raw ? JSON.parse(raw) : {};
        setFavCount(Object.keys(obj).length);
      } catch { setFavCount(0); }
    };
    sync();
    window.addEventListener("saba:favorites", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("saba:favorites", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
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
            src="/logo.webp"
            alt="سابا ديزاين"
            width={120}
            height={64}
            fetchPriority="high"
            decoding="async"
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
            to={"/account/favorites" as any}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-primary hover:text-primary"
            aria-label="favorites"
          >
            <HeaderIcon name="heart" />
            {mounted && favCount > 0 && (
              <span className="absolute -top-1 -left-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {favCount}
              </span>
            )}
          </Link>
          <Link
            to={"/cart" as any}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-primary hover:text-primary"
            aria-label={t("nav.cart")}
          >
            <HeaderIcon name="cart" />
            {mounted && count > 0 && (
              <span className="absolute -top-1 -left-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          {mounted && isAuthenticated ? (
            <div className="relative">
              <button
                className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(30,91,148,0.55)] transition hover:bg-primary-dark"
                aria-label={t("nav.account")}
                aria-expanded={acctOpen}
                onClick={() => setAcctOpen((v) => !v)}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary text-xs font-bold">{initial}</span>
                <span className="max-w-[120px] truncate">{user?.name || t("nav.account")}</span>
              </button>
              {acctOpen && (
                <div
                  className="absolute end-0 top-full z-50 mt-2 w-60 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  <div className="border-b border-border px-2 pb-2 mb-1">
                    <div className="text-sm font-bold truncate">{user?.name || ""}</div>
                    <div className="text-xs text-muted-foreground truncate">{user?.email || ""}</div>
                  </div>
                  {isAdmin && (
                    <Link to={"/admin" as any} onClick={() => setAcctOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
                      <HeaderIcon name="dashboard" /> {lang === "ar" ? "لوحة التحكم" : "Admin"}
                    </Link>
                  )}
                  <Link to={"/account" as any} onClick={() => setAcctOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
                    <HeaderIcon name="user" /> {t("account.nav.overview")}
                  </Link>
                  <Link to={"/account/orders" as any} onClick={() => setAcctOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
                    <HeaderIcon name="package" /> {t("account.nav.orders")}
                  </Link>
                  <Link to={"/account/favorites" as any} onClick={() => setAcctOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
                    <HeaderIcon name="heart" /> {t("account.nav.favorites")}
                  </Link>
                  <Link to={"/account/profile" as any} onClick={() => setAcctOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
                    <HeaderIcon name="user" /> {t("account.nav.profile")}
                  </Link>
                  <div className="my-1 h-px bg-border" />
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-rose-600 hover:bg-rose-50">
                    <HeaderIcon name="logout" /> {t("account.nav.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to={"/account" as any}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-primary hover:text-primary"
                aria-label={t("nav.account")}
              >
                <HeaderIcon name="user" />
              </Link>
              <Link
                to={"/login" as any}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(30,91,148,0.55)] transition hover:bg-primary-dark"
              >
                <HeaderIcon name="login" />
                {t("nav.login")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile/Tablet quick actions */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <LangSwitch lang={lang} onClick={toggleLang} compact label={t("nav.toggleLang")} />
          <Link
            to={"/account/favorites" as any}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground/70"
            aria-label="favorites"
          >
            <HeaderIcon name="heart" />
            {mounted && favCount > 0 && (
              <span className="absolute -top-1 -left-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {favCount}
              </span>
            )}
          </Link>
          <Link
            to={"/cart" as any}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground/70"
            aria-label={t("nav.cart")}
          >
            <HeaderIcon name="cart" />
            {mounted && count > 0 && (
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
            {open ? <HeaderIcon name="x" className="h-5 w-5" /> : <HeaderIcon name="menu" className="h-5 w-5" />}
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
            {mounted && isAuthenticated ? (
              <div className="col-span-2 rounded-2xl border border-border bg-card p-3">
                <div className="flex items-center gap-3 border-b border-border pb-3 mb-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{initial}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{user?.name || ""}</div>
                    <div className="text-xs text-muted-foreground truncate">{user?.email || ""}</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  {isAdmin && (
                    <Link to={"/admin" as any} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm hover:bg-muted">
                      <HeaderIcon name="dashboard" /> {lang === "ar" ? "لوحة التحكم" : "Admin"}
                    </Link>
                  )}
                  <Link to={"/account" as any} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm hover:bg-muted">
                    <HeaderIcon name="user" /> {t("account.nav.overview")}
                  </Link>
                  <Link to={"/account/orders" as any} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm hover:bg-muted">
                    <HeaderIcon name="package" /> {t("account.nav.orders")}
                  </Link>
                  <Link to={"/account/favorites" as any} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm hover:bg-muted">
                    <HeaderIcon name="heart" /> {t("account.nav.favorites")}
                  </Link>
                  <Link to={"/account/profile" as any} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm hover:bg-muted">
                    <HeaderIcon name="user" /> {t("account.nav.profile")}
                  </Link>
                  <button
                    onClick={() => { setOpen(false); handleLogout(); }}
                    className="mt-1 flex items-center gap-2 rounded-md px-2 py-2.5 text-sm text-rose-600 hover:bg-rose-50 text-start"
                  >
                    <HeaderIcon name="logout" /> {t("account.nav.logout")}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to={"/account" as any}
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-white text-sm font-bold text-foreground/80"
                >
                  <HeaderIcon name="user" /> {t("nav.account")}
                </Link>
                <Link
                  to={"/login" as any}
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground"
                >
                  <HeaderIcon name="login" /> {t("nav.login")}
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
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
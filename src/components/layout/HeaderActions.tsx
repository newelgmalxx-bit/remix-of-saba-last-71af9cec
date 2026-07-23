import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useLang } from "@/i18n/LanguageProvider";

type HeaderIconName = "login" | "cart" | "user" | "heart" | "package" | "logout" | "dashboard";

const headerIconPaths: Record<HeaderIconName, string[]> = {
  login: ["M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", "M10 17l5-5-5-5", "M15 12H3"],
  cart: ["M6 6h15l-1.5 8h-12L6 6Z", "M6 6 5 3H2", "M9 20h.01", "M18 20h.01"],
  user: ["M20 21a8 8 0 0 0-16 0", "M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"],
  heart: ["M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"],
  package: ["M21 8 12 3 3 8l9 5 9-5Z", "M3 8v8l9 5 9-5V8", "M12 13v8"],
  logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  dashboard: ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"],
};

function HeaderActionIcon({ name, className = "h-4 w-4" }: { name: HeaderIconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {headerIconPaths[name].map((path) => <path key={path} d={path} />)}
    </svg>
  );
}

type HeaderActionsProps = {
  variant: "desktop" | "mobile-quick" | "mobile-sheet";
  onNavigate?: () => void;
};

export function HeaderActions({ variant, onNavigate }: HeaderActionsProps) {
  const { count } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const [acctOpen, setAcctOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const initial = (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();

  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem("saba_service_favorites_v1");
        const obj = raw ? JSON.parse(raw) : {};
        setFavCount(Object.keys(obj).length);
      } catch {
        setFavCount(0);
      }
    };
    sync();
    window.addEventListener("saba:favorites", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("saba:favorites", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  async function handleLogout() {
    await logout();
    setAcctOpen(false);
    onNavigate?.();
    const { toast } = await import("sonner");
    toast.success(t("account.nav.logout"));
    navigate({ to: "/" });
  }

  const authLinks = isAuthenticated ? (
    <>
      {isAdmin && (
        <Link to={"/admin" as any} onClick={onNavigate} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
          <HeaderActionIcon name="dashboard" /> {lang === "ar" ? "لوحة التحكم" : "Admin"}
        </Link>
      )}
      <Link to={"/account" as any} onClick={onNavigate} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
        <HeaderActionIcon name="user" /> {t("account.nav.overview")}
      </Link>
      <Link to={"/account/orders" as any} onClick={onNavigate} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
        <HeaderActionIcon name="package" /> {t("account.nav.orders")}
      </Link>
      <Link to={"/account/favorites" as any} onClick={onNavigate} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
        <HeaderActionIcon name="heart" /> {t("account.nav.favorites")}
      </Link>
      <Link to={"/account/profile" as any} onClick={onNavigate} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
        <HeaderActionIcon name="user" /> {t("account.nav.profile")}
      </Link>
      <div className="my-1 h-px bg-border" />
      <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-sm text-rose-600 hover:bg-rose-50">
        <HeaderActionIcon name="logout" /> {t("account.nav.logout")}
      </button>
    </>
  ) : (
    <>
      <Link to={"/account" as any} onClick={onNavigate} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-bold text-foreground/80">
        <HeaderActionIcon name="user" /> {t("nav.account")}
      </Link>
      <Link to={"/login" as any} onClick={onNavigate} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">
        <HeaderActionIcon name="login" /> {t("nav.login")}
      </Link>
    </>
  );

  if (variant === "mobile-sheet") {
    return isAuthenticated ? (
      <div className="col-span-2 rounded-2xl border border-border bg-card p-3">
        <div className="mb-2 flex items-center gap-3 border-b border-border pb-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{initial}</span>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">{user?.name || ""}</div>
            <div className="truncate text-xs text-muted-foreground">{user?.email || ""}</div>
          </div>
        </div>
        <div className="flex flex-col">{authLinks}</div>
      </div>
    ) : <>{authLinks}</>;
  }

  const size = variant === "mobile-quick" ? "h-9 w-9" : "h-10 w-10";
  const badge = variant === "mobile-quick" ? "h-4 min-w-[16px] text-[9px]" : "h-5 min-w-[20px] text-[10px]";

  return (
    <>
      <Link to={"/account/favorites" as any} className={`relative inline-flex ${size} items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-primary hover:text-primary`} aria-label="favorites">
        <HeaderActionIcon name="heart" />
        {favCount > 0 && <span className={`absolute -top-1 -left-1 flex ${badge} items-center justify-center rounded-full bg-red-500 px-1 font-bold text-white`}>{favCount}</span>}
      </Link>
      <Link to={"/cart" as any} className={`relative inline-flex ${size} items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-primary hover:text-primary`} aria-label={t("nav.cart")}>
        <HeaderActionIcon name="cart" />
        {count > 0 && <span className={`absolute -top-1 -left-1 flex ${badge} items-center justify-center rounded-full bg-primary px-1 font-bold text-primary-foreground`}>{count}</span>}
      </Link>
      {variant === "desktop" && (isAuthenticated ? (
        <div className="relative">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(30,91,148,0.55)] transition hover:bg-primary-dark"
            aria-label={t("nav.account")}
            aria-expanded={acctOpen}
            onClick={() => setAcctOpen((v) => !v)}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">{initial}</span>
            <span className="max-w-[120px] truncate">{user?.name || t("nav.account")}</span>
          </button>
          {acctOpen && (
            <div className="absolute end-0 top-full z-50 mt-2 w-60 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md" dir={lang === "ar" ? "rtl" : "ltr"}>
              <div className="mb-1 border-b border-border px-2 pb-2">
                <div className="truncate text-sm font-bold">{user?.name || ""}</div>
                <div className="truncate text-xs text-muted-foreground">{user?.email || ""}</div>
              </div>
              {authLinks}
            </div>
          )}
        </div>
      ) : (
        <>
          <Link to={"/account" as any} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-primary hover:text-primary" aria-label={t("nav.account")}>
            <HeaderActionIcon name="user" />
          </Link>
          <Link to={"/login" as any} className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(30,91,148,0.55)] transition hover:bg-primary-dark">
            <HeaderActionIcon name="login" />
            {t("nav.login")}
          </Link>
        </>
      ))}
    </>
  );
}
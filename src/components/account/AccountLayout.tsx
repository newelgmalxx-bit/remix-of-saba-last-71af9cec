import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  LifeBuoy,
  User,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { mockUser } from "@/data/account";

const nav = [
  { to: "/account", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { to: "/account/orders", label: "طلباتي", icon: Package, exact: false },
  { to: "/account/tickets", label: "الدعم والتذاكر", icon: LifeBuoy, exact: false },
  { to: "/cart", label: "السلة", icon: ShoppingCart, exact: false },
  { to: "/account/profile", label: "الملف الشخصي", icon: User, exact: false },
] as const;

export function AccountLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero strip */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-l from-primary to-primary-dark p-6 sm:p-8 text-white shadow-[0_20px_50px_-25px_rgba(30,91,148,0.6)]">
            <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/75">حساب العميل</p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-bold">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-white/80">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md px-4 py-3 border border-white/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary font-bold text-lg">
                  {mockUser.avatar}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{mockUser.name}</div>
                  <div className="text-xs text-white/75">{mockUser.email}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside className="space-y-2">
              <nav className="rounded-2xl border border-border bg-card p-2 shadow-sm">
                {nav.map((n) => {
                  const active = n.exact ? path === n.to : path.startsWith(n.to);
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.to}
                      to={n.to as any}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{n.label}</span>
                    </Link>
                  );
                })}
                <div className="my-2 h-px bg-border" />
                <Link
                  to={"/" as any}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </Link>
              </nav>
            </aside>

            {/* Content */}
            <div className="min-w-0 space-y-6">{children}</div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${color}`}>
      {label}
    </span>
  );
}
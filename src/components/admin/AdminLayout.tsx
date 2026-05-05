import { Link, useRouterState, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, CalendarCheck, FileText, Users, Image as ImageIcon,
  BarChart3, FileSpreadsheet, Building2, Search, Target, CreditCard, Link2,
  UserCheck, Settings, ChevronDown, Bell, LogOut, Menu, User, Palette, Plug,
  Users2, BellRing, CheckCircle2, AlertCircle, ShoppingBag,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Languages } from "lucide-react";
import logoImg from "@/assets/logo.png";

type NavItem = { to: string; label: string; icon: any; children?: { to: string; label: string; icon: any }[] };

const navGroups: (NavItem | "sep")[] = [
  { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/admin/services", label: "الخدمات", icon: Package },
  { to: "/admin/bookings", label: "الطلبات", icon: CalendarCheck },
  { to: "/admin/invoices", label: "الفواتير", icon: FileText },
  { to: "/admin/clients", label: "العملاء", icon: Users },
  { to: "/admin/portfolio", label: "أعمالنا", icon: ImageIcon },
  { to: "/admin/analytics", label: "التحليلات", icon: BarChart3 },
  { to: "/admin/reports", label: "التقارير", icon: FileSpreadsheet },
  "sep",
  { to: "/admin/site", label: "إعدادات الموقع", icon: Building2 },
  { to: "/admin/seo", label: "إعدادات SEO", icon: Search },
  { to: "/admin/tracking", label: "التتبع والبكسلات", icon: Target },
  { to: "/admin/payment", label: "إعدادات الدفع", icon: CreditCard },
  { to: "/admin/partner", label: "إعدادات API الشريك", icon: Link2 },
  "sep",
  { to: "/admin/users", label: "إدارة المستخدمين", icon: UserCheck },
  "sep",
  {
    to: "/admin/settings", label: "الإعدادات", icon: Settings,
    children: [
      { to: "/admin/settings/profile", label: "الملف الشخصي", icon: User },
      { to: "/admin/settings/appearance", label: "المظهر", icon: Palette },
      { to: "/admin/settings/integrations", label: "التكاملات", icon: Plug },
      { to: "/admin/settings/team", label: "الفريق والصلاحيات", icon: Users2 },
      { to: "/admin/settings/notifications", label: "الإشعارات", icon: BellRing },
    ],
  },
];

export function AdminShell() {
  return <Outlet />;
}

export function AdminLayout({ children, title, subtitle, action }: { children: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [openSettings, setOpenSettings] = useState(path.startsWith("/admin/settings"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string, exact = false) => exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-muted/40 flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`${mobileOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0 fixed lg:sticky top-0 right-0 z-40 h-screen w-72 shrink-0 border-l border-border bg-card transition-transform overflow-y-auto`}>
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <img src={logoImg} alt="سابا ديزاين" className="h-9 w-auto object-contain" />
          <div className="text-[11px] text-muted-foreground">لوحة التحكم</div>
        </div>
        <nav className="p-3 space-y-1 pb-10">
          {navGroups.map((g, i) => {
            if (g === "sep") return <div key={i} className="my-2 h-px bg-border" />;
            const Icon = g.icon;
            const active = g.children
              ? path.startsWith(g.to)
              : isActive(g.to, g.to === "/admin");
            if (g.children) {
              return (
                <div key={g.to}>
                  <button
                    onClick={() => setOpenSettings((v) => !v)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-primary/10 text-primary" : "text-foreground/75 hover:bg-muted"}`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {g.label}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition ${openSettings ? "rotate-180" : ""}`} />
                  </button>
                  {openSettings && (
                    <div className="mt-1 mr-4 space-y-1 border-r border-border pr-3">
                      {g.children.map((c) => {
                        const CIcon = c.icon;
                        const cActive = isActive(c.to);
                        return (
                          <Link key={c.to} to={c.to as any} onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${cActive ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted"}`}>
                            <CIcon className="h-3.5 w-3.5" />
                            {c.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link key={g.to} to={g.to as any} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/75 hover:bg-muted"}`}>
                <Icon className="h-4 w-4" />
                {g.label}
              </Link>
            );
          })}
          <div className="my-3 h-px bg-border" />
          <Link to={"/" as any} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50">
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Link>
        </nav>
      </aside>

      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/80 backdrop-blur px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border">
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {action}
            <LangToggle />
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0" dir="rtl">
                <div className="border-b border-border px-4 py-3 flex items-center justify-between">
                  <div className="font-bold text-sm">الإشعارات</div>
                  <span className="text-[11px] text-primary font-bold">3 جديدة</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-border">
                  {[
                    { i: ShoppingBag, t: "primary", title: "طلب جديد #SD-1024", desc: "أحمد العبدالله — تصميم مواقع", time: "منذ 5 دقائق" },
                    { i: CheckCircle2, t: "emerald", title: "تم استلام دفعة", desc: "فاتورة INV-7820 — 4,025 ر.س", time: "منذ 1 ساعة" },
                    { i: AlertCircle, t: "amber", title: "تذكرة دعم جديدة", desc: "ريم الشهري بحاجة لمراجعة", time: "منذ 3 ساعات" },
                  ].map((n, idx) => {
                    const Ic = n.i;
                    const tone = n.t === "primary" ? "bg-primary/10 text-primary" : n.t === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";
                    return (
                      <div key={idx} className="flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone}`}><Ic className="h-4 w-4" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold truncate">{n.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{n.desc}</div>
                          <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="block w-full border-t border-border px-4 py-3 text-center text-xs font-bold text-primary hover:bg-muted/50">عرض كل الإشعارات</button>
              </PopoverContent>
            </Popover>
            <Link to={"/admin/settings/profile" as any} title="الملف الشخصي" className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 hover:bg-muted transition">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">JD</div>
              <span className="hidden sm:block text-xs font-bold">John Doe</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}

/* === Reusable bits === */

export function StatCard({ label, value, hint, icon: Icon, accent = "primary" }: { label: string; value: React.ReactNode; hint?: React.ReactNode; icon: any; accent?: "primary" | "emerald" | "amber" | "rose" | "violet" | "muted" }) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-600",
    violet: "bg-violet-100 text-violet-700",
    muted: "bg-muted text-foreground/70",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {hint && <div data-ltr-number className="text-[11px] font-bold text-emerald-600">{hint}</div>}
      </div>
      <div data-ltr-number className="mt-4 text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function PanelCard({ title, subtitle, action, children, className = "" }: { title?: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-base font-bold">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Pill({ tone = "muted", children }: { tone?: "primary" | "emerald" | "amber" | "rose" | "violet" | "muted" | "sky"; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-600 border-rose-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    muted: "bg-muted text-foreground/70 border-border",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${tones[tone]}`}>{children}</span>;
}

export function PrimaryButton({ children, onClick, type = "button" }: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return (
    <button type={type} onClick={onClick} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-dark transition">
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold hover:bg-muted">
      {children}
    </button>
  );
}

function LangToggle() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  useEffect(() => {
    try { const v = localStorage.getItem("saba_admin_lang") as "ar" | "en" | null; if (v) setLang(v); } catch {}
  }, []);
  const toggle = () => {
    const next = lang === "ar" ? "en" : "ar";
    setLang(next);
    try { localStorage.setItem("saba_admin_lang", next); } catch {}
  };
  return (
    <button onClick={toggle} title="تبديل اللغة / Toggle language" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-2.5 hover:bg-muted">
      <Languages className="h-4 w-4 text-primary" />
      <span className="text-[11px] font-bold">{lang === "ar" ? "EN" : "AR"}</span>
    </button>
  );
}
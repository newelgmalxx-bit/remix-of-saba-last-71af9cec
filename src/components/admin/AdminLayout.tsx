import { Link, useRouterState, Outlet, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, CalendarCheck, FileText, Users, Image as ImageIcon,
  BarChart3, FileSpreadsheet, Building2, Search, Target, CreditCard, Link2,
  UserCheck, Settings, ChevronDown, Bell, LogOut, Menu, User, Palette, Plug, Tag,
  Users2, BellRing, CheckCircle2, AlertCircle, ShoppingBag, LifeBuoy, Ticket, ExternalLink,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import logoImg from "@/assets/logo.png";
import { useLang } from "@/i18n/LanguageProvider";
import flagSa from "@/assets/flag-sa.jpg";
import flagUs from "@/assets/flag-us.jpg";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { toast } from "sonner";
import { admin } from "@/lib/api/admin";

type NavItem = { to: string; ar: string; en: string; icon: any; children?: { to: string; ar: string; en: string; icon: any }[] };

const navGroups: (NavItem | "sep")[] = [
  { to: "/admin", ar: "لوحة التحكم", en: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/services", ar: "الخدمات", en: "Services", icon: Package },
  { to: "/admin/plans", ar: "الباقات", en: "Plans", icon: Tag },
  { to: "/admin/bookings", ar: "الطلبات", en: "Orders", icon: CalendarCheck },
  { to: "/admin/invoices", ar: "الفواتير", en: "Invoices", icon: FileText },
  { to: "/admin/clients", ar: "العملاء", en: "Clients", icon: Users },
  { to: "/admin/tickets", ar: "التذاكر", en: "Tickets", icon: LifeBuoy },
  // { to: "/admin/coupons", ar: "الكوبونات", en: "Coupons", icon: Ticket },
  { to: "/admin/portfolio", ar: "أعمالنا", en: "Portfolio", icon: ImageIcon },
  { to: "/admin/analytics", ar: "التحليلات", en: "Analytics", icon: BarChart3 },
  { to: "/admin/reports", ar: "التقارير", en: "Reports", icon: FileSpreadsheet },
  "sep",
  { to: "/admin/site", ar: "إعدادات الموقع", en: "Site settings", icon: Building2 },
  { to: "/admin/seo", ar: "إعدادات SEO", en: "SEO settings", icon: Search },
  { to: "/admin/tracking", ar: "التتبع والبكسلات", en: "Tracking & pixels", icon: Target },
  { to: "/admin/payment", ar: "إعدادات الدفع", en: "Payment settings", icon: CreditCard },
  { to: "/admin/partner", ar: "إعدادات API الشريك", en: "Partner API", icon: Link2 },
  "sep",
  { to: "/admin/users", ar: "إدارة المستخدمين", en: "Users", icon: UserCheck },
  "sep",
  {
    to: "/admin/settings", ar: "الإعدادات", en: "Settings", icon: Settings,
    children: [
      { to: "/admin/settings/profile", ar: "الملف الشخصي", en: "Profile", icon: User },
      { to: "/admin/settings/appearance", ar: "المظهر", en: "Appearance", icon: Palette },
      { to: "/admin/settings/integrations", ar: "التكاملات", en: "Integrations", icon: Plug },
      { to: "/admin/settings/team", ar: "الفريق والصلاحيات", en: "Team & roles", icon: Users2 },
      { to: "/admin/settings/notifications", ar: "الإشعارات", en: "Notifications", icon: BellRing },
    ],
  },
];

export function AdminShell() {
  return (
    <AuthGuard requireAdmin>
      <Outlet />
    </AuthGuard>
  );
}

export function AdminLayout({ children, title, subtitle, action }: { children: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [openSettings, setOpenSettings] = useState(path.startsWith("/admin/settings"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    toast.success(L("تم تسجيل الخروج", "Signed out"));
    navigate({ to: "/login" });
  }

  const initials = (user?.name || "U")
    .split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();

  const isActive = (to: string, exact = false) => exact ? path === to : path === to || path.startsWith(to + "/");

  // Notifications
  type Notif = { id: string; type?: string; title: string; desc?: string; time?: string; read?: boolean; link?: string };
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const loadNotifs = async () => {
    setNotifLoading(true);
    try {
      const res: any = await admin.getNotifications(10);
      const list: any[] = res?.data?.items ?? res?.items ?? res?.data ?? [];
      const mapped: Notif[] = (Array.isArray(list) ? list : []).map((n: any, idx: number) => ({
        id: String(n.id ?? idx),
        type: n.type ?? "primary",
        title: n.title ?? n.message ?? L("إشعار", "Notification"),
        desc: n.description ?? n.body ?? n.desc ?? "",
        time: n.time ?? n.created_at ?? n.createdAt ?? "",
        read: !!(n.read ?? n.is_read),
        link: n.link ?? n.url ?? n.href ?? n.action_url ?? n.target ?? "",
      }));
      setNotifs(mapped);
    } catch {
      setNotifs([]);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
    const id = setInterval(loadNotifs, 30000);
    const onFocus = () => loadNotifs();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(id); window.removeEventListener("focus", onFocus); };
  }, []);

  const unread = notifs.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    if (!notifs.length) return;
    try {
      await admin.markNotificationsRead();
      setNotifs((arr) => arr.map((n) => ({ ...n, read: true })));
    } catch (e: any) {
      toast.error(e?.message || L("تعذر التحديث", "Update failed"));
    }
  };

  const inferLink = (n: { type?: string; id: string }) => {
    const tp = (n.type || "").toLowerCase();
    if (tp.includes("order")) return "/admin/bookings";
    if (tp.includes("ticket")) return "/admin/tickets";
    if (tp.includes("invoice")) return "/admin/invoices";
    if (tp.includes("user") || tp.includes("client")) return "/admin/clients";
    return "";
  };
  const fmtTime = (t: string) => {
    if (!t) return "";
    const d = new Date(t);
    if (isNaN(d.getTime())) return t;
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return L("الآن", "Just now");
    if (diff < 3600) return L(`منذ ${Math.floor(diff / 60)} د`, `${Math.floor(diff / 60)}m ago`);
    if (diff < 86400) return L(`منذ ${Math.floor(diff / 3600)} س`, `${Math.floor(diff / 3600)}h ago`);
    return d.toLocaleDateString();
  };

  const iconFor = (type?: string) => {
    if (type === "order") return ShoppingBag;
    if (type === "payment" || type === "success") return CheckCircle2;
    if (type === "warning" || type === "alert") return AlertCircle;
    return BellRing;
  };
  const toneFor = (type?: string) => {
    if (type === "payment" || type === "success") return "bg-emerald-100 text-emerald-700";
    if (type === "warning" || type === "alert") return "bg-amber-100 text-amber-700";
    return "bg-primary/10 text-primary";
  };

  return (
    <div className="min-h-screen bg-muted/40 flex" dir={dir}>
      {/* Sidebar */}
      <aside className={`${mobileOpen ? "translate-x-0" : (dir === "rtl" ? "translate-x-full" : "-translate-x-full")} lg:translate-x-0 fixed lg:sticky top-0 ${dir === "rtl" ? "right-0 border-l" : "left-0 border-r"} z-40 h-screen w-72 shrink-0 border-border bg-card transition-transform overflow-y-auto`}>
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <img src={logoImg} alt="سابا ديزاين" className="h-9 w-auto object-contain" />
          <div className="text-[11px] text-muted-foreground">{L("لوحة التحكم", "Admin panel")}</div>
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
                      {L(g.ar, g.en)}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition ${openSettings ? "rotate-180" : ""}`} />
                  </button>
                  {openSettings && (
                    <div className={`mt-1 ${dir === "rtl" ? "mr-4 border-r pr-3" : "ml-4 border-l pl-3"} space-y-1 border-border`}>
                      {g.children.map((c) => {
                        const CIcon = c.icon;
                        const cActive = isActive(c.to);
                        return (
                          <Link key={c.to} to={c.to as any} onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${cActive ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted"}`}>
                            <CIcon className="h-3.5 w-3.5" />
                            {L(c.ar, c.en)}
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
                {L(g.ar, g.en)}
              </Link>
            );
          })}
          <div className="my-3 h-px bg-border" />
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50">
            <LogOut className="h-4 w-4" />
            {L("تسجيل الخروج", "Sign out")}
          </button>
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
            <Link
              to={"/" as any}
              title={L("عرض الموقع", "View site")}
              className="hidden sm:inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-bold text-foreground/80 hover:border-primary hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{L("عرض الموقع", "View site")}</span>
            </Link>
            <Link
              to={"/" as any}
              aria-label={L("عرض الموقع", "View site")}
              className="sm:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
            <LangToggle />
            <Popover open={notifOpen} onOpenChange={(o) => { setNotifOpen(o); if (o) loadNotifs(); }}>
              <PopoverTrigger asChild>
                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0" dir={dir}>
                <div className="border-b border-border px-4 py-3 flex items-center justify-between">
                  <div className="font-bold text-sm">{L("الإشعارات", "Notifications")}</div>
                  {unread > 0 ? (
                    <button onClick={handleMarkAllRead} className="text-[11px] text-primary font-bold hover:underline">
                      {L("تعليم الكل كمقروء", "Mark all read")}
                    </button>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">{L("لا جديد", "All read")}</span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-border">
                  {notifLoading ? (
                    <div className="px-4 py-8 text-center text-xs text-muted-foreground">{L("جارٍ التحميل…", "Loading…")}</div>
                  ) : notifs.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-muted-foreground">{L("لا توجد إشعارات", "No notifications")}</div>
                  ) : (
                    notifs.map((n) => {
                      const Ic = iconFor(n.type);
                      const handleClick = async () => {
                        if (!n.read) {
                          try { await admin.markNotificationsRead(n.id); } catch { /* ignore */ }
                          setNotifs((arr) => arr.map((x) => x.id === n.id ? { ...x, read: true } : x));
                        }
                        setNotifOpen(false);
                        const target = n.link || inferLink(n);
                        if (target) {
                          if (/^https?:\/\//i.test(target)) window.open(target, "_blank");
                          else navigate({ to: target as any });
                        }
                      };
                      return (
                        <div key={n.id} onClick={handleClick} className={`flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer ${!n.read ? "bg-primary/5" : ""}`}>
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneFor(n.type)}`}>
                            <Ic className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold truncate">{n.title}</div>
                            {n.desc && <div className="text-xs text-muted-foreground truncate">{n.desc}</div>}
                            {n.time && <div className="text-[10px] text-muted-foreground mt-1">{fmtTime(n.time)}</div>}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <Link
                  to={"/admin/settings/notifications" as any}
                  onClick={() => setNotifOpen(false)}
                  className="block w-full border-t border-border px-4 py-3 text-center text-xs font-bold text-primary hover:bg-muted/50"
                >
                  {L("إعدادات الإشعارات", "Notification settings")}
                </Link>
              </PopoverContent>
            </Popover>
            <Link to={"/admin/settings/profile" as any} title={L("الملف الشخصي", "Profile")} className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 hover:bg-muted transition">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{initials}</div>
              <span className="hidden sm:block text-xs font-bold">{user?.name || L("المستخدم", "User")}</span>
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
  const { lang, toggle } = useLang();
  const flag = lang === "ar" ? flagSa : flagUs;
  const code = lang === "ar" ? "AR" : "EN";
  return (
    <button onClick={toggle} title="تبديل اللغة / Toggle language" className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-2 hover:bg-muted">
      <img src={flag} alt={code} className="h-4 w-6 object-cover rounded-sm" />
      <span className="text-[11px] font-bold">{code}</span>
    </button>
  );
}
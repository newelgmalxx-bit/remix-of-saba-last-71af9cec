import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill } from "@/components/admin/AdminLayout";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, Bell } from "lucide-react";
import { bookingStatusMap, fmtSAR } from "@/data/admin";
import { useEffect, useMemo, useState } from "react";
import { admin as adminApi, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "لوحة التحكم | سابا ديزاين" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { lang, dir } = useLang();
  const { user } = useAuth();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const emptyStats = {
    revenue: 0, revenueGrowth: 0, ordersCount: 0, monthlyTarget: 0, remaining: 0,
    totalServices: 0, activeServices: 0, totalBookings: 0, totalClients: 0, vipClients: 0,
  } as any;
  const [stats, setStats] = useState<any>(emptyStats);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [byCat, setByCat] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activity, setActivity] = useState<{ icon: any; text: string; time: string; link?: string | null }[]>([]);

  useEffect(() => {
    adminApi.analytics()
      .then((d: any) => {
        // Don't let analytics zeros overwrite values computed from orders below
        const { totalBookings: _tb, ordersCount: _oc, revenue: _rv, ...rest } = d || {};
        setStats((s: any) => ({
          ...s,
          ...rest,
          totalBookings: s.totalBookings || _tb || 0,
          ordersCount: s.ordersCount || _oc || 0,
          revenue: s.revenue || _rv || 0,
        }));
        if (Array.isArray(d.monthlyRevenue) && d.monthlyRevenue.length) setRevenue(d.monthlyRevenue);
        if (Array.isArray(d.salesByCategory) && d.salesByCategory.length) {
          const palette = ["#1E5B94", "#3a7fbe", "#5fa1d9", "#9bc4e8", "#cbe0f0"];
          setByCat(d.salesByCategory.map((s: any, i: number) => ({ ...s, color: palette[i % palette.length] })));
        }
      })
      .catch((e) => { if (!(e instanceof ApiError) || e.status !== 401) console.warn("[admin.analytics]", e); });
    // One orders fetch — use it for both the latest-orders table and the aggregates
    adminApi.orders.list({ limit: 200 })
      .then((p: any) => {
        const all = (p.items || []) as any[];
        const items = all.slice(0, 5).map((b: any) => ({
          id: b.id,
          number: b.number,
          client: b.contact_name || b.client || "",
          email: b.contact_email || b.email || "",
          phone: b.contact_phone || b.phone,
          city: b.contact_city || b.city,
          service: Array.isArray(b.items) && b.items.length
            ? b.items.map((i: any) => i.service_title || i.serviceTitle).filter(Boolean).join(" • ")
            : (b.service || ""),
          total: Number(b.total) || 0,
          payment: b.payment_method || b.payment,
          status: b.status,
          date: (b.createdAt || "").slice(0, 10),
          source: b.source ?? "direct",
        }));
        setBookings(items as any);
        const totalAll = all.reduce((s, o) => s + (Number(o.total) || 0), 0);
        const totalPaid = all.filter((o) => o.paid || o.payment_status === "paid").reduce((s, o) => s + (Number(o.total) || 0), 0);
        const effectiveRevenue = totalPaid || totalAll;

        // Build last 6 months revenue series
        const now = new Date();
        const months: { key: string; m: string; v: number }[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          const m = d.toLocaleString(lang === "en" ? "en-US" : "ar-SA", { month: "short" });
          months.push({ key, m, v: 0 });
        }
        all.forEach((o) => {
          const raw = (o.createdAt || o.created_at || "").toString();
          const dt = new Date(raw.replace(" ", "T"));
          if (Number.isNaN(dt.getTime())) return;
          const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
          const row = months.find((r) => r.key === key);
          if (row) row.v += Number(o.total) || 0;
        });
        setRevenue(months);

        // Build sales by category from order items
        const catTotals: Record<string, number> = {};
        all.forEach((o) => {
          (o.items || []).forEach((it: any) => {
            const k = it.service_title || it.serviceTitle || it.service_slug || "—";
            catTotals[k] = (catTotals[k] || 0) + (Number(it.price) || 0) * (Number(it.qty) || 1);
          });
        });
        const totalCat = Object.values(catTotals).reduce((s, v) => s + v, 0) || 1;
        const palette = ["#1E5B94", "#3a7fbe", "#5fa1d9", "#9bc4e8", "#cbe0f0"];
        const cats = Object.entries(catTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, v], i) => ({ name, value: Math.round((v / totalCat) * 100), color: palette[i % palette.length] }));
        setByCat(cats);

        setStats((s: any) => ({
          ...s,
          revenue: effectiveRevenue,
          ordersCount: all.length,
          totalBookings: all.length,
          remaining: Math.max(0, (s.monthlyTarget || 0) - effectiveRevenue),
        }));
      })
      .catch(() => setBookings([]));
    adminApi.clients.list({ limit: 1 })
      .then((p: any) => setStats((s: any) => ({ ...s, totalClients: p?.total ?? s.totalClients })))
      .catch(() => {});
    adminApi.services.list({ limit: 1 })
      .then((p: any) => setStats((s: any) => ({
        ...s,
        totalServices: p?.total ?? s.totalServices,
        activeServices: p?.total ?? s.activeServices,
      })))
      .catch(() => {});
    adminApi.notifications.list(5)
      .then((d: any) => {
        const list = d?.items ?? d ?? [];
        setActivity(list.map((n: any) => ({
          icon: Bell,
          text: n.title ? `${n.title}${n.body ? " — " + n.body : ""}` : (n.message || n.text || ""),
          time: (n.createdAt || n.created_at || "").slice(0, 16).replace("T", " "),
          link: n.link || null,
        })));
      })
      .catch(() => setActivity([]));
  }, [lang]);

  const periods = [
    { v: "7", l: L("آخر 7 أيام", "Last 7 days") },
    { v: "30", l: L("آخر 30 يوم", "Last 30 days") },
    { v: "90", l: L("آخر 90 يوم", "Last 90 days") },
    { v: "all", l: L("كل الفترة", "All time") },
  ];
  const [period, setPeriod] = useState("30");
  const filteredRevenue = period === "7" ? revenue.slice(-2)
    : period === "30" ? revenue.slice(-3)
    : period === "90" ? revenue.slice(-6)
    : revenue;

  const bookingStatusLabel = (key: keyof typeof bookingStatusMap) => {
    const m: Record<string, string> = {
      pending: "Pending", in_progress: "In Progress", review: "Review", completed: "Completed", cancelled: "Cancelled",
    };
    const fallback = bookingStatusMap[key]?.label ?? String(key);
    return lang === "en" ? (m[key] ?? fallback) : fallback;
  };

  return (
    <AdminLayout title={L("لوحة التحكم", "Dashboard")} subtitle={L("مرحباً بعودتك! إليك نظرة عامة على نشاط الأعمال", "Welcome back! Here's an overview of your business activity")} action={
      <select value={period} onChange={(e) => setPeriod(e.target.value)} className="hidden sm:inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-bold">
        {periods.map(p => <option key={p.v} value={p.v}>{p.l}</option>)}
      </select>
    }>
      {/* Hero card */}
      <div className={`rounded-2xl bg-gradient-to-l from-primary to-primary-dark p-6 text-white shadow-md mb-6 relative overflow-hidden`}>
        <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-12 -bottom-12 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-2 items-center">
          <div>
            <div className="text-sm text-white/75">{L("مرحباً", "Hello")}, {user?.name || L("المالك", "Owner")} 👋</div>
            <div className="mt-2 text-4xl font-extrabold">{fmtSAR(stats.revenue)}</div>
            <div className="text-sm text-white/80 mt-1">{L("إجمالي إيرادات هذا الشهر", "Total revenue this month")}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                <TrendingUp className="h-3.5 w-3.5" /> +{stats.revenueGrowth}% {L("مقارنة بالشهر الماضي", "vs last month")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                {stats.ordersCount.toLocaleString(lang === "en" ? "en-US" : "ar-SA")} {L("طلب", "orders")}
              </span>
            </div>
          </div>
          <div className={`${dir === "rtl" ? "md:justify-self-end" : "md:justify-self-start"} flex items-center gap-4`}>
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 36 36" className="h-28 w-28 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="white" strokeWidth="3" strokeDasharray="78,100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">{stats.monthlyTarget ? Math.min(100, Math.round((stats.revenue / stats.monthlyTarget) * 100)) : 0}%</div>
                <div className="text-[10px] text-white/75">{L("من الهدف", "of target")}</div>
              </div>
            </div>
            <div className="text-sm">
              <div className="text-white/75">{L("الهدف الشهري", "Monthly target")}</div>
              <div className="text-lg font-bold">{fmtSAR(stats.monthlyTarget)}</div>
              <div className="mt-2 text-white/75">{L("المتبقي", "Remaining")}</div>
              <div className="text-lg font-bold">{fmtSAR(stats.remaining)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("إجمالي الإيرادات", "Total Revenue")} value={fmtSAR(stats.revenue)} icon={DollarSign} accent="primary" />
        <StatCard label={L("إجمالي الطلبات", "Total Orders")} value={stats.totalBookings} icon={ShoppingCart} accent="violet" />
        <StatCard label={L("إجمالي العملاء", "Total Clients")} value={stats.totalClients} icon={Users} accent="emerald" />
        <StatCard label={L("الخدمات النشطة", "Active Services")} value={stats.activeServices} icon={Package} accent="amber" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <PanelCard title={L("نظرة عامة على الإيرادات", "Revenue Overview")} subtitle={L("الأداء الشهري", "Monthly performance")} className="lg:col-span-2">
          <div className="h-72">
            {filteredRevenue.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{L("لا توجد بيانات بعد", "No data yet")}</div>
            ) : (
            <ResponsiveContainer>
              <AreaChart data={filteredRevenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E5B94" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#1E5B94" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3ebf3" />
                <XAxis dataKey="m" stroke="#7c8aa0" fontSize={12} />
                <YAxis stroke="#7c8aa0" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e3ebf3" }} />
                <Area type="monotone" dataKey="v" stroke="#1E5B94" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </PanelCard>

        <PanelCard title={L("المبيعات حسب التصنيف", "Sales by Category")} subtitle={L("توزيع الخدمات", "Service distribution")}>
          <div className="h-44">
            {byCat.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">{L("لا توجد بيانات", "No data")}</div>
            ) : (
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byCat} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {byCat.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>
          <ul className="mt-3 space-y-1.5">
            {byCat.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-bold">{s.value}%</span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>

      {/* Recent bookings + activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <PanelCard title={L("أحدث الطلبات", "Latest Orders")} className="lg:col-span-2" action={<a href="/admin/bookings" className="text-xs font-bold text-primary hover:underline">{L("عرض الكل ←", "View all →")}</a>}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className={`${dir === "rtl" ? "text-right" : "text-left"} text-xs text-muted-foreground`}>
                  <th className="px-3 py-2 font-medium">{L("الطلب", "Order")}</th>
                  <th className="px-3 py-2 font-medium">{L("العميل", "Client")}</th>
                  <th className="px-3 py-2 font-medium">{L("الإجمالي", "Total")}</th>
                  <th className="px-3 py-2 font-medium">{L("الحالة", "Status")}</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && (
                  <tr><td colSpan={4} className="px-3 py-6 text-center text-xs text-muted-foreground">{L("لا توجد طلبات بعد", "No orders yet")}</td></tr>
                )}
                {bookings.slice(0, 5).map((b) => {
                  const s = bookingStatusMap[b.status as keyof typeof bookingStatusMap] ?? { tone: "primary" as const, label: b.status };
                  return (
                    <tr key={b.id} className="border-t border-border">
                      <td className="px-3 py-3 font-bold text-primary">#{b.number}</td>
                      <td className="px-3 py-3"><div className="font-medium">{b.client}</div><div className="text-[11px] text-muted-foreground">{b.service}</div></td>
                      <td className="px-3 py-3 font-bold">{fmtSAR(b.total)}</td>
                      <td className="px-3 py-3"><Pill tone={s.tone}>{bookingStatusLabel(b.status as any)}</Pill></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </PanelCard>

        <PanelCard title={L("آخر الأنشطة", "Recent Activity")}>
          <ul className="space-y-3 text-sm">
            {activity.length === 0 && (
              <li className="text-xs text-muted-foreground text-center py-4">{L("لا توجد أنشطة بعد", "No activity yet")}</li>
            )}
            {activity.map((a, i) => {
              const I = a.icon;
              const inner = (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><I className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.text}</div>
                    <div className="text-[11px] text-muted-foreground">{a.time}</div>
                  </div>
                </>
              );
              return (
                <li key={i}>
                  {a.link ? (
                    <Link to={a.link as any} className="flex items-start gap-3 rounded-xl p-2 -m-2 hover:bg-muted/60 transition">{inner}</Link>
                  ) : (
                    <div className="flex items-start gap-3">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </PanelCard>
      </div>
    </AdminLayout>
  );
}

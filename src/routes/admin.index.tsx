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
          date: ((b.createdAt || b.created_at || "") as string).slice(0, 10),
          source: b.source ?? "direct",
        }));
        setBookings(items as any);
        const nowD = new Date();
        const curY = nowD.getFullYear();
        const curM = nowD.getMonth();
        const prevDate = new Date(curY, curM - 1, 1);
        const prevY = prevDate.getFullYear();
        const prevM = prevDate.getMonth();
        const isPaid = (o: any) => o.paid === true || o.payment_status === "paid" || o.paymentStatus === "paid";
        const orderDate = (o: any) => {
          const raw = (o.createdAt || o.created_at || "").toString();
          const dt = new Date(raw.replace(" ", "T"));
          return Number.isNaN(dt.getTime()) ? null : dt;
        };
        const paidThisMonth = all.filter((o) => {
          if (!isPaid(o)) return false;
          const dt = orderDate(o);
          return !!dt && dt.getFullYear() === curY && dt.getMonth() === curM;
        });
        const paidPrevMonth = all.filter((o) => {
          if (!isPaid(o)) return false;
          const dt = orderDate(o);
          return !!dt && dt.getFullYear() === prevY && dt.getMonth() === prevM;
        });
        const monthRevenue = paidThisMonth.reduce((s, o) => s + (Number(o.total) || 0), 0);
        const prevMonthRevenue = paidPrevMonth.reduce((s, o) => s + (Number(o.total) || 0), 0);
        const revenueGrowth = prevMonthRevenue > 0
          ? Math.round(((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)
          : (monthRevenue > 0 ? 100 : 0);
        const effectiveRevenue = monthRevenue;

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

        // Build sales by category from order items (resolved via services list)
        adminApi.services.list({ limit: 500 }).then((sp: any) => {
          const services: any[] = sp?.items || [];
          const total = services.length || 0;
          const active = services.filter((s) => (s.status || "active") === "active").length;
          setStats((s: any) => ({ ...s, totalServices: total, activeServices: active }));

          const slugToCat: Record<string, string> = {};
          services.forEach((s) => {
            const slug = s.slug || s.service_slug;
            const cat = s.category_ar || s.category_en || s.category || L("بدون تصنيف", "Uncategorized");
            if (slug) slugToCat[slug] = cat;
          });

          const catTotals: Record<string, number> = {};
          all.forEach((o) => {
            const lines = (o.items && o.items.length ? o.items : [{ service_slug: o.service_slug, service_title: o.service, price: o.total, qty: 1 }]);
            lines.forEach((it: any) => {
              const slug = it.service_slug || it.serviceSlug;
              const k = slugToCat[slug] || it.service_title || it.serviceTitle || L("بدون تصنيف", "Uncategorized");
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
        }).catch(() => {});

        const pendingCount = all.filter((o) => o.status === "pending").length;
        const paidAllCount = all.filter(isPaid).length;
        const avgOrderValue = paidAllCount > 0
          ? Math.round(all.filter(isPaid).reduce((s, o) => s + (Number(o.total) || 0), 0) / paidAllCount)
          : 0;
        setStats((s: any) => ({
          ...s,
          revenue: effectiveRevenue,
          revenueGrowth,
          ordersCount: all.length,
          totalBookings: all.length,
          paidThisMonthCount: paidThisMonth.length,
          pendingCount,
          avgOrderValue,
        }));
      })
      .catch(() => setBookings([]));
    adminApi.clients.list({ limit: 1 })
      .then((p: any) => setStats((s: any) => ({ ...s, totalClients: p?.total ?? s.totalClients })))
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
          <div className={`${dir === "rtl" ? "md:justify-self-end" : "md:justify-self-start"} grid grid-cols-3 gap-3 text-center`}>
            <div className="rounded-xl bg-white/10 backdrop-blur px-3 py-3 min-w-[88px]">
              <div className="text-[11px] text-white/75">{L("مدفوع هذا الشهر", "Paid this month")}</div>
              <div className="mt-1 text-2xl font-extrabold">{(stats.paidThisMonthCount || 0).toLocaleString(lang === "en" ? "en-US" : "ar-SA")}</div>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur px-3 py-3 min-w-[88px]">
              <div className="text-[11px] text-white/75">{L("بانتظار التأكيد", "Pending")}</div>
              <div className="mt-1 text-2xl font-extrabold">{(stats.pendingCount || 0).toLocaleString(lang === "en" ? "en-US" : "ar-SA")}</div>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur px-3 py-3 min-w-[88px]">
              <div className="text-[11px] text-white/75">{L("متوسط الطلب", "Avg order")}</div>
              <div className="mt-1 text-lg font-extrabold leading-tight">{fmtSAR(stats.avgOrderValue || 0)}</div>
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

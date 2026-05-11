import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard } from "@/components/admin/AdminLayout";
import { Eye, MousePointerClick, TrendingUp, Clock, ShoppingCart, DollarSign, Users, Activity } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { fmtSAR } from "@/data/admin";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "التحليلات | لوحة التحكم" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { lang } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const [range, setRange] = useState<"7d" | "30d" | "90d" | "year">("30d");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;
      const sinceMs = Date.now() - days * 86400000;
      const sinceIso = new Date(sinceMs).toISOString();

      const [an, op, cp, vq] = await Promise.all([
        adminApi.analytics(range).catch(() => null),
        adminApi.orders.list({ limit: 1000 }).catch(() => ({ items: [] })),
        adminApi.clients.list({ limit: 1000 }).catch(() => ({ items: [] })),
        supabase.from("page_visits").select("path, source, session_id, created_at").gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(5000),
      ]);
      if (cancelled) return;
      const a: any = an || {};
      const orders: any[] = (op as any)?.items || [];
      const clients: any[] = (cp as any)?.items || [];
      const visitRows: any[] = (vq as any)?.data || [];
      const now = Date.now();

      // Visits per day
      const dayMap = new Map<string, number>();
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now - i * 86400000);
        dayMap.set(d.toISOString().slice(0, 10), 0);
      }
      visitRows.forEach((v) => {
        const k = new Date(v.created_at).toISOString().slice(0, 10);
        if (dayMap.has(k)) dayMap.set(k, (dayMap.get(k) || 0) + 1);
      });
      const visits = Array.from(dayMap.entries()).map(([date, views]) => ({ date, views }));
      const uniqueSessions = new Set(visitRows.map((v) => v.session_id).filter(Boolean)).size;

      // Sources
      const sourceCount = new Map<string, number>();
      visitRows.forEach((v) => {
        const s = v.source || "direct";
        sourceCount.set(s, (sourceCount.get(s) || 0) + 1);
      });
      const sourceLabel = (s: string) => {
        const map: Record<string, [string, string]> = {
          google: ["بحث Google", "Google Search"],
          search: ["محركات بحث", "Search Engines"],
          social: ["سوشيال ميديا", "Social Media"],
          referral: ["إحالات", "Referrals"],
          internal: ["داخلي", "Internal"],
          direct: ["مباشر", "Direct"],
        };
        const v = map[s] || [s, s];
        return L(v[0], v[1]);
      };
      const computedSources = Array.from(sourceCount.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => ({ name: sourceLabel(k), value: v }));

      // Sessions / engagement
      const sessionsMap = new Map<string, { times: number[]; paths: string[] }>();
      visitRows.forEach((v) => {
        const sid = v.session_id || `anon-${v.created_at}`;
        const t = new Date(v.created_at).getTime();
        const s = sessionsMap.get(sid) || { times: [], paths: [] };
        s.times.push(t);
        s.paths.push(v.path || "/");
        sessionsMap.set(sid, s);
      });
      const sessionList = Array.from(sessionsMap.values());
      const totalSessions = sessionList.length;
      const bounceSessions = sessionList.filter((s) => s.paths.length <= 1).length;
      const engagedSessions = sessionList.filter((s) => {
        const dur = Math.max(...s.times) - Math.min(...s.times);
        return s.paths.length > 1 || dur >= 30000;
      }).length;
      const totalPages = sessionList.reduce((sum, s) => sum + s.paths.length, 0);
      const totalDurMs = sessionList.reduce((sum, s) => sum + (Math.max(...s.times) - Math.min(...s.times)), 0);
      const avgSessionSec = totalSessions ? Math.round(totalDurMs / totalSessions / 1000) : 0;
      const fmtDuration = (sec: number) => {
        if (!sec) return "0s";
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return m ? `${m}m ${s}s` : `${s}s`;
      };
      const pagesPerSession = totalSessions ? (totalPages / totalSessions).toFixed(1) : "0";
      const bounceRate = totalSessions ? `${Math.round((bounceSessions / totalSessions) * 100)}%` : "0%";

      // Conversions
      const cartVisits = visitRows.filter((v) => String(v.path || "").startsWith("/cart")).length;
      const checkoutVisits = visitRows.filter((v) => String(v.path || "").startsWith("/checkout")).length;

      // Orders / revenue
      const inRange = (d: any) => {
        const t = new Date(d || 0).getTime();
        return Number.isFinite(t) && t >= sinceMs;
      };
      const recentOrders = orders.filter((o) => inRange(o.created_at || o.createdAt || o.date));
      const revenueTotal = recentOrders.reduce((s, o) => s + (Number(o.total ?? o.amount) || 0), 0);
      const avgOrderValue = recentOrders.length ? Math.round(revenueTotal / recentOrders.length) : 0;
      const completedCount = recentOrders.filter((o) => ["completed", "paid", "delivered"].includes(String(o.status))).length;

      // Monthly revenue
      const monthMap = new Map<string, number>();
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        monthMap.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, 0);
      }
      orders.forEach((o) => {
        const t = new Date(o.created_at || o.createdAt || o.date || 0);
        if (!Number.isFinite(t.getTime())) return;
        const k = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
        if (monthMap.has(k)) monthMap.set(k, (monthMap.get(k) || 0) + (Number(o.total ?? o.amount) || 0));
      });
      const months = Array.from(monthMap.entries()).map(([m, v]) => ({ m, v }));

      // Growth (vs previous period)
      const prevSinceMs = sinceMs - days * 86400000;
      const prevOrders = orders.filter((o) => {
        const t = new Date(o.created_at || o.createdAt || o.date || 0).getTime();
        return t >= prevSinceMs && t < sinceMs;
      });
      const prevRevenue = prevOrders.reduce((s, o) => s + (Number(o.total ?? o.amount) || 0), 0);
      const growthRate = prevRevenue > 0
        ? `${(((revenueTotal - prevRevenue) / prevRevenue) * 100).toFixed(1)}%`
        : (revenueTotal > 0 ? "+100%" : "0%");

      setData({
        ...a,
        pageViews: visitRows.length,
        uniqueVisitors: uniqueSessions,
        sessions: totalSessions,
        avgSession: fmtDuration(avgSessionSec),
        bounceRate,
        pagesPerSession,
        engagedSessions,
        addToCart: cartVisits,
        checkoutsStarted: checkoutVisits,
        completed: completedCount,
        ordersCount: recentOrders.length,
        clientsCount: clients.length,
        revenue: revenueTotal,
        avgOrderValue,
        growthRate,
        conversionRate: totalSessions ? `${((completedCount / totalSessions) * 100).toFixed(1)}%` : "0%",
        visits,
        sources: computedSources,
        monthlyRevenue: months,
      });
    })();
    return () => { cancelled = true; };
  }, [range, lang]);

  const monthlyRevenue = data?.monthlyRevenue ?? [];
  const visitsData = (data?.visits ?? []).map((v: any) => ({ d: v.date, v: v.views }));
  const sources = (data?.sources ?? []).map((s: any) => ({ name: s.name, v: s.value ?? s.v }));
  const fmt = (n: any) => (typeof n === "number" ? n.toLocaleString(lang === "en" ? "en-US" : "ar-SA") : (n ?? "—"));

  return (
    <AdminLayout title={L("التحليلات", "Analytics")} subtitle={L("رؤى متقدمة لأداء الموقع والتفاعل", "Advanced insights into site performance and engagement")} action={
      <select value={range} onChange={(e) => setRange(e.target.value as any)} className="hidden sm:inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-bold">
        <option value="7d">{L("آخر 7 أيام", "Last 7 days")}</option>
        <option value="30d">{L("آخر 30 يوم", "Last 30 days")}</option>
        <option value="90d">{L("آخر 90 يوم", "Last 90 days")}</option>
        <option value="year">{L("هذا العام", "This Year")}</option>
      </select>
    }>
      {/* Visits */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("مشاهدات الصفحة", "Page Views")} value={fmt(data?.pageViews ?? 0)} icon={Eye} accent="primary" />
        <StatCard label={L("زوار فريدون", "Unique Visitors")} value={fmt(data?.uniqueVisitors ?? 0)} icon={Eye} accent="violet" />
        <StatCard label={L("جلسات", "Sessions")} value={fmt(data?.sessions ?? 0)} icon={MousePointerClick} accent="emerald" />
        <StatCard label={L("متوسط مدة الزيارة", "Avg. Session Duration")} value={fmt(data?.avgSession ?? "0s")} icon={Clock} accent="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <PanelCard title={L("حركة المرور", "Traffic")} subtitle={L("الزيارات حسب اليوم", "Visits by day")} className="lg:col-span-2">
          <div className="h-72">
            {visitsData.length === 0 || visitsData.every((d: any) => !d.v) ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{L("لا توجد بيانات بعد", "No data yet")}</div>
            ) : (
              <ResponsiveContainer>
                <LineChart data={visitsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3ebf3" />
                  <XAxis dataKey="d" stroke="#7c8aa0" fontSize={12} />
                  <YAxis stroke="#7c8aa0" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" stroke="#1E5B94" strokeWidth={3} dot={{ r: 4, fill: "#1E5B94" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </PanelCard>
        <PanelCard title={L("مصادر الزيارات", "Traffic Sources")} subtitle={L("من أين يأتي العملاء", "Where visitors come from")}>
          {sources.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">{L("لا توجد بيانات بعد", "No data yet")}</div>
          ) : (
            <ul className="space-y-3">
              {sources.map((s: { name: string; v: number }) => (
                <li key={s.name}>
                  <div className="flex justify-between text-xs mb-1"><span className="font-medium">{s.name}</span><span className="font-bold">{s.v}</span></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (s.v / Math.max(...sources.map((x: any) => x.v), 1)) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </PanelCard>
      </div>

      {/* Engagement */}
      <h3 className="text-sm font-bold text-muted-foreground mb-3">{L("التفاعل", "Engagement")}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("معدل الارتداد", "Bounce Rate")} value={fmt(data?.bounceRate ?? "0%")} icon={MousePointerClick} accent="amber" />
        <StatCard label={L("صفحات/جلسة", "Pages / Session")} value={fmt(data?.pagesPerSession ?? 0)} icon={Eye} accent="primary" />
        <StatCard label={L("متوسط مدة الجلسة", "Avg. Session")} value={fmt(data?.avgSession ?? "0s")} icon={Clock} accent="violet" />
        <StatCard label={L("جلسات متفاعلة", "Engaged Sessions")} value={fmt(data?.engagedSessions ?? 0)} icon={TrendingUp} accent="emerald" />
      </div>

      {/* Conversions */}
      <h3 className="text-sm font-bold text-muted-foreground mb-3">{L("التحويلات", "Conversions")}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("معدل التحويل", "Conversion Rate")} value={fmt(data?.conversionRate ?? "0%")} icon={TrendingUp} accent="emerald" />
        <StatCard label={L("إضافات للسلة", "Add to Cart")} value={fmt(data?.addToCart ?? 0)} icon={MousePointerClick} accent="primary" />
        <StatCard label={L("بدء دفع", "Checkouts Started")} value={fmt(data?.checkoutsStarted ?? 0)} icon={Clock} accent="amber" />
        <StatCard label={L("طلبات مكتملة", "Completed Orders")} value={fmt(data?.completed ?? 0)} icon={Eye} accent="violet" />
      </div>

      {/* Revenue */}
      <h3 className="text-sm font-bold text-muted-foreground mb-3">{L("الإيرادات والطلبات", "Revenue & Orders")}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("إجمالي الإيرادات", "Total Revenue")} value={fmtSAR(data?.revenue ?? 0)} icon={DollarSign} accent="primary" />
        <StatCard label={L("الطلبات", "Orders")} value={fmt(data?.ordersCount ?? 0)} icon={ShoppingCart} accent="violet" />
        <StatCard label={L("متوسط الطلب", "Avg. Order")} value={fmtSAR(data?.avgOrderValue ?? 0)} icon={Activity} accent="emerald" />
        <StatCard label={L("معدل النمو", "Growth Rate")} value={fmt(data?.growthRate ?? "0%")} icon={TrendingUp} accent="amber" />
      </div>

      <PanelCard title={L("الإيرادات الشهرية", "Monthly Revenue")} subtitle={L("آخر 12 شهر", "Last 12 months")}>
        <div className="h-72">
          {monthlyRevenue.length === 0 || monthlyRevenue.every((d: any) => !d.v) ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{L("لا توجد بيانات بعد", "No data yet")}</div>
          ) : (
            <ResponsiveContainer>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3ebf3" />
                <XAxis dataKey="m" stroke="#7c8aa0" fontSize={12} />
                <YAxis stroke="#7c8aa0" fontSize={12} />
                <Tooltip />
                <Bar dataKey="v" fill="#1E5B94" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </PanelCard>

      {/* Clients summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 mt-6">
        <StatCard label={L("إجمالي العملاء", "Total Clients")} value={fmt(data?.clientsCount ?? 0)} icon={Users} accent="primary" />
        <StatCard label={L("نشاط عام", "Overall Activity")} value={fmt((data?.pageViews ?? 0) + (data?.ordersCount ?? 0))} icon={Activity} accent="violet" />
      </div>
    </AdminLayout>
  );
}

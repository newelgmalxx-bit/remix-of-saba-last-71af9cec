import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard } from "@/components/admin/AdminLayout";
import { Eye, MousePointerClick, TrendingUp, Clock } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

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
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const [an, op, cp, vis] = await Promise.all([
        adminApi.analytics(range).catch(() => null),
        adminApi.orders.list({ limit: 1000 }).catch(() => ({ items: [] })),
        adminApi.clients.list({ limit: 1000 }).catch(() => ({ items: [] })),
        supabase
          .from("page_visits")
          .select("path, source, session_id, created_at")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(10000)
          .then((r) => r.data || []),
      ]);
      if (cancelled) return;
      const a: any = an || {};
      const orders: any[] = (op as any)?.items || [];
      const clients: any[] = (cp as any)?.items || [];
      const visitRows: any[] = (vis as any) || [];
      const now = Date.now();
      const sinceMs = now - days * 86400000;
      const inRange = (d: any) => {
        const t = new Date(d || 0).getTime();
        return Number.isFinite(t) && t >= sinceMs;
      };
      const recentOrders = orders.filter((o) => inRange(o.created_at || o.createdAt || o.date));
      // Visits per day from page_visits
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
      const computedSources = Array.from(sourceCount.entries()).map(([k, v]) => ({ name: sourceLabel(k), value: v }));
      // Monthly revenue (last 12 months)
      const months: { m: string; v: number }[] = [];
      const monthMap = new Map<string, number>();
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthMap.set(k, 0);
      }
      orders.forEach((o) => {
        const t = new Date(o.created_at || o.createdAt || o.date || 0);
        if (!Number.isFinite(t.getTime())) return;
        const k = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
        if (monthMap.has(k)) monthMap.set(k, (monthMap.get(k) || 0) + (Number(o.total ?? o.amount) || 0));
      });
      monthMap.forEach((v, m) => months.push({ m, v }));
      const completedCount = orders.filter((o) => ["completed", "paid", "delivered"].includes(String(o.status))).length;
      const totalOrders = orders.length;
      const computed = {
        ...a,
        pageViews: visitRows.length || a.pageViews || 0,
        uniqueVisitors: uniqueSessions || a.uniqueVisitors || clients.length,
        sessions: uniqueSessions || a.sessions || 0,
        avgSession: a.avgSession ?? "—",
        bounceRate: a.bounceRate ?? "—",
        pagesPerSession: a.pagesPerSession ?? "—",
        engagedSessions: a.engagedSessions ?? "—",
        addToCart: a.addToCart ?? totalOrders,
        checkoutsStarted: a.checkoutsStarted ?? totalOrders,
        completed: a.completed ?? completedCount,
        conversionRate: a.conversionRate ?? (totalOrders ? `${Math.round((completedCount / totalOrders) * 100)}%` : "0%"),
        visits: visits,
        sources: computedSources.length ? computedSources : (a.sources || []),
        monthlyRevenue: a.monthlyRevenue?.length ? a.monthlyRevenue : months,
      };
      setData(computed);
    })();
    return () => { cancelled = true; };
  }, [range, lang]);
  const monthlyRevenue = data?.monthlyRevenue ?? [];
  const visitsData = data?.visits?.length
    ? data.visits.map((v: any) => ({ d: v.date, v: v.views }))
    : null;
  const sourcesData = data?.sources?.length
    ? data.sources.map((s: any) => ({ name: s.name, v: s.value ?? s.v }))
    : null;
  const sources = sourcesData ?? [];
  const trafficSeries = visitsData ?? [];
  const v = data?.visits ?? {};
  const fmt = (n: any) => (typeof n === "number" ? n.toLocaleString(lang === "en" ? "en-US" : "ar-SA") : (n ?? "—"));
  const [tab, setTab] = useState<"visits" | "engagement" | "conversions" | "revenue">("visits");
  const tabs: [typeof tab, string][] = [["visits", L("الزيارات", "Visits")], ["engagement", L("التفاعل", "Engagement")], ["conversions", L("التحويلات", "Conversions")], ["revenue", L("الإيرادات", "Revenue")]];
  return (
    <AdminLayout title={L("التحليلات", "Analytics")} subtitle={L("رؤى متقدمة لأداء الموقع والتفاعل", "Advanced insights into site performance and engagement")} action={
      <select value={range} onChange={(e) => setRange(e.target.value as any)} className="hidden sm:inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-bold">
        <option value="7d">{L("آخر 7 أيام", "Last 7 days")}</option>
        <option value="30d">{L("آخر 30 يوم", "Last 30 days")}</option>
        <option value="90d">{L("آخر 90 يوم", "Last 90 days")}</option>
        <option value="year">{L("هذا العام", "This Year")}</option>
      </select>
    }>
      <div className="mb-6 inline-flex flex-wrap rounded-xl border border-border bg-card p-1">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
        ))}
      </div>

      {tab === "visits" && (
      <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("مشاهدات الصفحة", "Page Views")} value={fmt(data?.pageViews ?? 0)} icon={Eye} accent="primary" />
        <StatCard label={L("زوار فريدون", "Unique Visitors")} value={fmt(data?.uniqueVisitors ?? 0)} icon={Eye} accent="violet" />
        <StatCard label={L("جلسات", "Sessions")} value={fmt(data?.sessions ?? 0)} icon={MousePointerClick} accent="emerald" />
        <StatCard label={L("متوسط مدة الزيارة", "Avg. Session Duration")} value={fmt(data?.avgSession ?? 0)} icon={Clock} accent="amber" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <PanelCard title={L("حركة المرور الأسبوعية", "Weekly Traffic")} subtitle={L("الزيارات حسب اليوم", "Visits by day")} className="lg:col-span-2">
          <div className="h-72">
            {trafficSeries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{L("لا توجد بيانات بعد", "No data yet")}</div>
            ) : (
            <ResponsiveContainer>
              <LineChart data={trafficSeries}>
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
      </>
      )}

      {tab === "engagement" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard label={L("معدل الارتداد", "Bounce Rate")} value={fmt(data?.bounceRate ?? "—")} icon={MousePointerClick} accent="amber" />
          <StatCard label={L("صفحات/جلسة", "Pages / Session")} value={fmt(data?.pagesPerSession ?? 0)} icon={Eye} accent="primary" />
          <StatCard label={L("متوسط مدة الجلسة", "Avg. Session")} value={fmt(data?.avgSession ?? 0)} icon={Clock} accent="violet" />
          <StatCard label={L("جلسات متفاعلة", "Engaged Sessions")} value={fmt(data?.engagedSessions ?? "—")} icon={TrendingUp} accent="emerald" />
        </div>
      )}

      {tab === "conversions" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard label={L("معدل التحويل", "Conversion Rate")} value={fmt(data?.conversionRate ?? `${data?.growthRate ?? 0}%`)} icon={TrendingUp} accent="emerald" />
          <StatCard label={L("إضافات للسلة", "Add to Cart")} value={fmt(data?.addToCart ?? 0)} icon={MousePointerClick} accent="primary" />
          <StatCard label={L("بدء دفع", "Checkouts Started")} value={fmt(data?.checkoutsStarted ?? 0)} icon={Clock} accent="amber" />
          <StatCard label={L("طلبات مكتملة", "Completed Orders")} value={fmt(data?.completed ?? 0)} icon={Eye} accent="violet" />
        </div>
      )}

      {tab === "revenue" && (
      <PanelCard title={L("الإيرادات الشهرية", "Monthly Revenue")} subtitle={L("آخر 12 شهر", "Last 12 months")}>
        <div className="h-72">
          {monthlyRevenue.length === 0 ? (
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
      )}
    </AdminLayout>
  );
}

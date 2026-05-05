import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard } from "@/components/admin/AdminLayout";
import { Eye, MousePointerClick, TrendingUp, Clock } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { monthlyRevenue } from "@/data/admin";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "التحليلات | لوحة التحكم" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { lang } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const traffic = lang === "en"
    ? [{ d: "Sun", v: 220 }, { d: "Mon", v: 410 }, { d: "Tue", v: 380 }, { d: "Wed", v: 520 }, { d: "Thu", v: 480 }, { d: "Fri", v: 290 }, { d: "Sat", v: 180 }]
    : [{ d: "الأحد", v: 220 }, { d: "الإثنين", v: 410 }, { d: "الثلاثاء", v: 380 }, { d: "الأربعاء", v: 520 }, { d: "الخميس", v: 480 }, { d: "الجمعة", v: 290 }, { d: "السبت", v: 180 }];
  const sources = [
    { name: L("بحث Google", "Google Search"), v: 1840 },
    { name: L("مباشر", "Direct"), v: 1240 },
    { name: "Instagram", v: 980 },
    { name: "Twitter", v: 620 },
    { name: L("إحالات", "Referrals"), v: 420 },
  ];
  const [tab, setTab] = useState<"visits" | "engagement" | "conversions" | "revenue">("visits");
  const tabs: [typeof tab, string][] = [["visits", L("الزيارات", "Visits")], ["engagement", L("التفاعل", "Engagement")], ["conversions", L("التحويلات", "Conversions")], ["revenue", L("الإيرادات", "Revenue")]];
  return (
    <AdminLayout title={L("التحليلات", "Analytics")} subtitle={L("رؤى متقدمة لأداء الموقع والتفاعل", "Advanced insights into site performance and engagement")}>
      <div className="mb-6 inline-flex flex-wrap rounded-xl border border-border bg-card p-1">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
        ))}
      </div>

      {tab === "visits" && (
      <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("مشاهدات الصفحة", "Page Views")} value="48,210" hint="↑ +18.2%" icon={Eye} accent="primary" />
        <StatCard label={L("زوار فريدون", "Unique Visitors")} value="12,840" hint="↑ +9.3%" icon={Eye} accent="violet" />
        <StatCard label={L("جلسات", "Sessions")} value="18,520" hint="↑ +6.1%" icon={MousePointerClick} accent="emerald" />
        <StatCard label={L("متوسط مدة الزيارة", "Avg. Session Duration")} value={L("4م 12ث", "4m 12s")} hint={L("↑ +12ث", "↑ +12s")} icon={Clock} accent="amber" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <PanelCard title={L("حركة المرور الأسبوعية", "Weekly Traffic")} subtitle={L("الزيارات حسب اليوم", "Visits by day")} className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={traffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3ebf3" />
                <XAxis dataKey="d" stroke="#7c8aa0" fontSize={12} />
                <YAxis stroke="#7c8aa0" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#1E5B94" strokeWidth={3} dot={{ r: 4, fill: "#1E5B94" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>
        <PanelCard title={L("مصادر الزيارات", "Traffic Sources")} subtitle={L("من أين يأتي العملاء", "Where visitors come from")}>
          <ul className="space-y-3">
            {sources.map(s => (
              <li key={s.name}>
                <div className="flex justify-between text-xs mb-1"><span className="font-medium">{s.name}</span><span className="font-bold">{s.v}</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(s.v / 2000) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>
      </>
      )}

      {tab === "engagement" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard label={L("معدل الارتداد", "Bounce Rate")} value="32.4%" hint="↓ -2.1%" icon={MousePointerClick} accent="amber" />
          <StatCard label={L("صفحات/جلسة", "Pages / Session")} value="3.8" hint="↑ +0.5" icon={Eye} accent="primary" />
          <StatCard label={L("متوسط مدة الجلسة", "Avg. Session")} value={L("4م 12ث", "4m 12s")} icon={Clock} accent="violet" />
          <StatCard label={L("جلسات متفاعلة", "Engaged Sessions")} value="68%" hint="↑ +4%" icon={TrendingUp} accent="emerald" />
        </div>
      )}

      {tab === "conversions" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard label={L("معدل التحويل", "Conversion Rate")} value="3.8%" hint="↑ +0.4%" icon={TrendingUp} accent="emerald" />
          <StatCard label={L("إضافات للسلة", "Add to Cart")} value="1,240" icon={MousePointerClick} accent="primary" />
          <StatCard label={L("بدء دفع", "Checkouts Started")} value="420" icon={Clock} accent="amber" />
          <StatCard label={L("طلبات مكتملة", "Completed Orders")} value="184" hint="↑ +12.5%" icon={Eye} accent="violet" />
        </div>
      )}

      {tab === "revenue" && (
      <PanelCard title={L("الإيرادات الشهرية", "Monthly Revenue")} subtitle={L("آخر 12 شهر", "Last 12 months")}>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3ebf3" />
              <XAxis dataKey="m" stroke="#7c8aa0" fontSize={12} />
              <YAxis stroke="#7c8aa0" fontSize={12} />
              <Tooltip />
              <Bar dataKey="v" fill="#1E5B94" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </PanelCard>
      )}
    </AdminLayout>
  );
}

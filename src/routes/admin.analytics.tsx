import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard } from "@/components/admin/AdminLayout";
import { Eye, MousePointerClick, TrendingUp, Clock } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { monthlyRevenue } from "@/data/admin";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "التحليلات | لوحة التحكم" }] }),
  component: AnalyticsPage,
});

const traffic = [
  { d: "الأحد", v: 220 }, { d: "الإثنين", v: 410 }, { d: "الثلاثاء", v: 380 },
  { d: "الأربعاء", v: 520 }, { d: "الخميس", v: 480 }, { d: "الجمعة", v: 290 }, { d: "السبت", v: 180 },
];
const sources = [
  { name: "بحث Google", v: 1840 }, { name: "مباشر", v: 1240 }, { name: "Instagram", v: 980 },
  { name: "Twitter", v: 620 }, { name: "إحالات", v: 420 },
];

function AnalyticsPage() {
  return (
    <AdminLayout title="التحليلات" subtitle="رؤى متقدمة لأداء الموقع والتفاعل">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="مشاهدات الصفحة" value="48,210" hint="↑ +18.2%" icon={Eye} accent="primary" />
        <StatCard label="معدل النقر" value="6.4%" hint="↑ +1.1%" icon={MousePointerClick} accent="violet" />
        <StatCard label="معدل التحويل" value="3.8%" hint="↑ +0.4%" icon={TrendingUp} accent="emerald" />
        <StatCard label="متوسط مدة الزيارة" value="4م 12ث" hint="↑ +12ث" icon={Clock} accent="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <PanelCard title="حركة المرور الأسبوعية" subtitle="الزيارات حسب اليوم" className="lg:col-span-2">
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
        <PanelCard title="مصادر الزيارات" subtitle="من أين يأتي العملاء">
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

      <PanelCard title="الإيرادات الشهرية" subtitle="آخر 12 شهر">
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
    </AdminLayout>
  );
}
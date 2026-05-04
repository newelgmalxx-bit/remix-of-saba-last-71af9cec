import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill } from "@/components/admin/AdminLayout";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, Calendar, Bell } from "lucide-react";
import { adminStats, monthlyRevenue, salesByCategory, adminBookings, bookingStatusMap, fmtSAR } from "@/data/admin";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "لوحة التحكم | سابا ديزاين" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <AdminLayout title="لوحة التحكم" subtitle="مرحباً بعودتك! إليك نظرة عامة على نشاط الأعمال" action={
      <button className="hidden sm:inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold">
        <Calendar className="h-4 w-4" /> آخر 30 يوم
      </button>
    }>
      {/* Hero card */}
      <div className="rounded-2xl bg-gradient-to-l from-primary to-primary-dark p-6 text-white shadow-md mb-6 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-12 -bottom-12 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-2 items-center">
          <div>
            <div className="text-sm text-white/75">مرحباً، John 👋</div>
            <div className="mt-2 text-4xl font-extrabold">{fmtSAR(adminStats.revenue)}</div>
            <div className="text-sm text-white/80 mt-1">إجمالي إيرادات هذا الشهر</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                <TrendingUp className="h-3.5 w-3.5" /> +{adminStats.revenueGrowth}% مقارنة بالشهر الماضي
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                {adminStats.ordersCount.toLocaleString("ar-SA")} طلب
              </span>
            </div>
          </div>
          <div className="md:justify-self-end flex items-center gap-4">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 36 36" className="h-28 w-28 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="white" strokeWidth="3" strokeDasharray="78,100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">78%</div>
                <div className="text-[10px] text-white/75">من الهدف</div>
              </div>
            </div>
            <div className="text-sm">
              <div className="text-white/75">الهدف الشهري</div>
              <div className="text-lg font-bold">{fmtSAR(adminStats.monthlyTarget)}</div>
              <div className="mt-2 text-white/75">المتبقي</div>
              <div className="text-lg font-bold">{fmtSAR(adminStats.remaining)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="إجمالي الإيرادات" value={fmtSAR(adminStats.revenue)} hint="↑ +12.5%" icon={DollarSign} accent="primary" />
        <StatCard label="إجمالي الحجوزات" value={adminStats.totalBookings} hint="↑ +8.2%" icon={ShoppingCart} accent="violet" />
        <StatCard label="إجمالي العملاء" value={adminStats.totalClients} hint="↑ +23.1%" icon={Users} accent="emerald" />
        <StatCard label="الخدمات النشطة" value={adminStats.activeServices} hint="من أصل 12" icon={Package} accent="amber" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <PanelCard title="نظرة عامة على الإيرادات" subtitle="الأداء الشهري" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={monthlyRevenue}>
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
          </div>
        </PanelCard>

        <PanelCard title="المبيعات حسب التصنيف" subtitle="توزيع الخدمات">
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={salesByCategory} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {salesByCategory.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5">
            {salesByCategory.map((s) => (
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
        <PanelCard title="أحدث الحجوزات" className="lg:col-span-2" action={<a href="/admin/bookings" className="text-xs font-bold text-primary hover:underline">عرض الكل ←</a>}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">الطلب</th>
                  <th className="px-3 py-2 font-medium">العميل</th>
                  <th className="px-3 py-2 font-medium">الإجمالي</th>
                  <th className="px-3 py-2 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {adminBookings.slice(0, 5).map((b) => {
                  const s = bookingStatusMap[b.status];
                  return (
                    <tr key={b.id} className="border-t border-border">
                      <td className="px-3 py-3 font-bold text-primary">#{b.number}</td>
                      <td className="px-3 py-3"><div className="font-medium">{b.client}</div><div className="text-[11px] text-muted-foreground">{b.service}</div></td>
                      <td className="px-3 py-3 font-bold">{fmtSAR(b.total)}</td>
                      <td className="px-3 py-3"><Pill tone={s.tone}>{s.label}</Pill></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </PanelCard>

        <PanelCard title="آخر الأنشطة">
          <ul className="space-y-3 text-sm">
            {[
              { icon: ShoppingCart, text: "حجز جديد #SD-1024", time: "قبل 2 د" },
              { icon: DollarSign, text: "تأكيد دفع 4,025 ر.س", time: "قبل 15 د" },
              { icon: Users, text: "تسجيل عميل جديد: ريم الشهري", time: "قبل ساعة" },
              { icon: Package, text: "تحديث خدمة تصميم المواقع", time: "قبل 3 س" },
              { icon: Bell, text: "تنبيه: فاتورة معلقة", time: "قبل 5 س" },
            ].map((a, i) => {
              const I = a.icon;
              return (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><I className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.text}</div>
                    <div className="text-[11px] text-muted-foreground">{a.time}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </PanelCard>
      </div>
    </AdminLayout>
  );
}
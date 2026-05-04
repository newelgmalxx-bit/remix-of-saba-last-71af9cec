import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { DollarSign, ShoppingCart, TrendingUp, Users, Package, Activity, Calendar, Download } from "lucide-react";
import { fmtSAR } from "@/data/admin";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "التقارير | لوحة التحكم" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <AdminLayout title="التقارير" subtitle="تحليلات متقدمة وتقارير الأعمال" action={
      <div className="flex gap-2">
        <GhostButton><Calendar className="h-4 w-4" /> آخر 30 يوم</GhostButton>
        <PrimaryButton><Download className="h-4 w-4" /> تصدير CSV</PrimaryButton>
      </div>
    }>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard label="إجمالي المبيعات" value={fmtSAR(284520)} hint="↑ +20.1%" icon={DollarSign} accent="primary" />
        <StatCard label="إجمالي الطلبات" value={184} hint="↑ +15.3%" icon={ShoppingCart} accent="violet" />
        <StatCard label="معدل التحويل" value="40.0%" hint="↑ +2.4%" icon={TrendingUp} accent="emerald" />
        <StatCard label="العملاء النشطون" value={96} hint="↑ +5.2%" icon={Users} accent="amber" />
        <StatCard label="الخدمات النشطة" value={9} hint="↑ +1.1%" icon={Package} accent="primary" />
        <StatCard label="هامش الربح" value="24.8%" hint="↑ +0.5%" icon={Activity} accent="violet" />
      </div>

      <PanelCard title="مولد التقارير المخصصة" subtitle="إنشاء تقارير محددة للمحاسبة والتحليل">
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">نوع التقرير</label>
            <select className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
              <option>الملخص المالي</option><option>تقرير المبيعات</option><option>تقرير العملاء</option><option>تقرير الخدمات</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">الفترة الزمنية</label>
            <select className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
              <option>آخر 30 يوم</option><option>آخر 3 أشهر</option><option>آخر 12 شهر</option><option>هذا العام</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">الصيغة</label>
            <select className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
              <option>CSV (Excel)</option><option>PDF</option><option>JSON</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <PrimaryButton><Download className="h-4 w-4" /> توليد وتنزيل</PrimaryButton>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}
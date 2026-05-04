import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { DollarSign, ShoppingCart, TrendingUp, Users, Package, Activity, Download } from "lucide-react";
import { fmtSAR } from "@/data/admin";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "التقارير | لوحة التحكم" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const [type, setType] = useState("الملخص المالي");
  const [period, setPeriod] = useState("آخر 30 يوم");
  const [format, setFormat] = useState("CSV");
  const [topPeriod, setTopPeriod] = useState("آخر 30 يوم");

  const generate = () => {
    const rows = [
      ["إجمالي المبيعات", "284520"],
      ["إجمالي الطلبات", "184"],
      ["معدل التحويل", "40.0%"],
      ["العملاء النشطون", "96"],
      ["الخدمات النشطة", "9"],
      ["هامش الربح", "24.8%"],
    ];
    let blob: Blob, ext: string, mime: string;
    if (format.startsWith("JSON")) {
      blob = new Blob([JSON.stringify({ type, period, data: Object.fromEntries(rows) }, null, 2)], { type: "application/json" });
      ext = "json"; mime = "json";
    } else if (format.startsWith("PDF")) {
      const html = `<html dir="rtl"><head><meta charset="utf-8"><title>${type}</title><style>body{font-family:Tajawal,sans-serif;padding:24px}h1{color:#1E5B94}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{padding:10px;border:1px solid #ddd;text-align:right}</style></head><body><h1>${type}</h1><p>${period}</p><table><thead><tr><th>المؤشر</th><th>القيمة</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</tbody></table></body></html>`;
      blob = new Blob([html], { type: "text/html" });
      ext = "html"; mime = "html";
    } else {
      const csv = ["Metric,Value", ...rows.map(r => r.join(","))].join("\n");
      blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
      ext = "csv"; mime = "csv";
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `report-${Date.now()}.${ext}`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`تم توليد التقرير (${mime.toUpperCase()})`);
  };

  const exportTopCsv = () => {
    const csv = "Metric,Value\nTotal Sales,284520\nTotal Orders,184\nConversion,40%";
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "summary.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير الملخص");
  };

  return (
    <AdminLayout title="التقارير" subtitle="تحليلات متقدمة وتقارير الأعمال" action={
      <div className="flex gap-2">
        <select value={topPeriod} onChange={(e) => setTopPeriod(e.target.value)} className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-bold">
          <option>آخر 7 أيام</option><option>آخر 30 يوم</option><option>آخر 90 يوم</option><option>هذا العام</option>
        </select>
        <PrimaryButton onClick={exportTopCsv}><Download className="h-4 w-4" /> تصدير CSV</PrimaryButton>
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
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
              <option>الملخص المالي</option><option>تقرير المبيعات</option><option>تقرير العملاء</option><option>تقرير الخدمات</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">الفترة الزمنية</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
              <option>آخر 30 يوم</option><option>آخر 3 أشهر</option><option>آخر 12 شهر</option><option>هذا العام</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">الصيغة</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
              <option>CSV (Excel)</option><option>PDF</option><option>JSON</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <PrimaryButton onClick={generate}><Download className="h-4 w-4" /> توليد وتنزيل</PrimaryButton>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}
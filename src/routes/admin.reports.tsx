import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, PrimaryButton } from "@/components/admin/AdminLayout";
import { DollarSign, ShoppingCart, TrendingUp, Users, Package, Activity, Download } from "lucide-react";
import { fmtSAR } from "@/data/admin";
import { useState } from "react";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "التقارير | لوحة التحكم" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const types = [L("الملخص المالي", "Financial Summary"), L("تقرير المبيعات", "Sales Report"), L("تقرير العملاء", "Clients Report"), L("تقرير الخدمات", "Services Report")];
  const periods = [L("آخر 7 أيام", "Last 7 days"), L("آخر 30 يوم", "Last 30 days"), L("آخر 90 يوم", "Last 90 days"), L("هذا العام", "This Year")];
  const periodsExt = [L("آخر 30 يوم", "Last 30 days"), L("آخر 3 أشهر", "Last 3 months"), L("آخر 12 شهر", "Last 12 months"), L("هذا العام", "This Year")];
  const formats = ["CSV (Excel)", "PDF", "JSON"];
  const [type, setType] = useState(types[0]);
  const [period, setPeriod] = useState(periodsExt[0]);
  const [format, setFormat] = useState(formats[0]);
  const [topPeriod, setTopPeriod] = useState(periods[1]);

  const generate = () => {
    const rows: [string, string][] = [
      [L("إجمالي المبيعات", "Total Sales"), "284520"],
      [L("إجمالي الطلبات", "Total Orders"), "184"],
      [L("معدل التحويل", "Conversion Rate"), "40.0%"],
      [L("العملاء النشطون", "Active Clients"), "96"],
      [L("الخدمات النشطة", "Active Services"), "9"],
      [L("هامش الربح", "Profit Margin"), "24.8%"],
    ];
    let blob: Blob, ext: string, mime: string;
    if (format.startsWith("JSON")) {
      blob = new Blob([JSON.stringify({ type, period, data: Object.fromEntries(rows) }, null, 2)], { type: "application/json" });
      ext = "json"; mime = "json";
    } else if (format.startsWith("PDF")) {
      const html = `<html dir="${dir}"><head><meta charset="utf-8"><title>${type}</title><style>body{font-family:sans-serif;padding:24px}h1{color:#1E5B94}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{padding:10px;border:1px solid #ddd;text-align:${dir === "rtl" ? "right" : "left"}}</style></head><body><h1>${type}</h1><p>${period}</p><table><thead><tr><th>${L("المؤشر", "Metric")}</th><th>${L("القيمة", "Value")}</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</tbody></table></body></html>`;
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
    toast.success(L(`تم توليد التقرير (${mime.toUpperCase()})`, `Report generated (${mime.toUpperCase()})`));
  };

  const exportTopCsv = () => {
    const csv = "Metric,Value\nTotal Sales,284520\nTotal Orders,184\nConversion,40%";
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "summary.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success(L("تم تصدير الملخص", "Summary exported"));
  };

  return (
    <AdminLayout title={L("التقارير", "Reports")} subtitle={L("تحليلات متقدمة وتقارير الأعمال", "Advanced business analytics and reports")} action={
      <div className="flex gap-2">
        <select value={topPeriod} onChange={(e) => setTopPeriod(e.target.value)} className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-bold">
          {periods.map(p => <option key={p}>{p}</option>)}
        </select>
        <PrimaryButton onClick={exportTopCsv}><Download className="h-4 w-4" /> {L("تصدير CSV", "Export CSV")}</PrimaryButton>
      </div>
    }>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard label={L("إجمالي المبيعات", "Total Sales")} value={fmtSAR(284520)} hint="↑ +20.1%" icon={DollarSign} accent="primary" />
        <StatCard label={L("إجمالي الطلبات", "Total Orders")} value={184} hint="↑ +15.3%" icon={ShoppingCart} accent="violet" />
        <StatCard label={L("معدل التحويل", "Conversion Rate")} value="40.0%" hint="↑ +2.4%" icon={TrendingUp} accent="emerald" />
        <StatCard label={L("العملاء النشطون", "Active Clients")} value={96} hint="↑ +5.2%" icon={Users} accent="amber" />
        <StatCard label={L("الخدمات النشطة", "Active Services")} value={9} hint="↑ +1.1%" icon={Package} accent="primary" />
        <StatCard label={L("هامش الربح", "Profit Margin")} value="24.8%" hint="↑ +0.5%" icon={Activity} accent="violet" />
      </div>

      <PanelCard title={L("مولد التقارير المخصصة", "Custom Report Generator")} subtitle={L("إنشاء تقارير محددة للمحاسبة والتحليل", "Create reports for accounting and analysis")}>
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">{L("نوع التقرير", "Report Type")}</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">{L("الفترة الزمنية", "Period")}</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
              {periodsExt.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">{L("الصيغة", "Format")}</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
              {formats.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <PrimaryButton onClick={generate}><Download className="h-4 w-4" /> {L("توليد وتنزيل", "Generate & Download")}</PrimaryButton>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}

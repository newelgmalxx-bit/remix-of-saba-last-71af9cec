import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { Package, CheckCircle2, FileEdit, Archive, Search, Plus, Pencil, Download } from "lucide-react";
import { useState } from "react";
import { adminServices, fmtSAR } from "@/data/admin";

export const Route = createFileRoute("/admin/services")({
  head: () => ({ meta: [{ title: "الخدمات | لوحة التحكم" }] }),
  component: ServicesPage,
});

const statusMap = { active: { l: "نشطة", t: "emerald" as const }, draft: { l: "مسودة", t: "amber" as const }, archived: { l: "مؤرشفة", t: "muted" as const } };

function ServicesPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "active" | "draft">("all");
  const filtered = adminServices.filter(s =>
    (tab === "all" || s.status === tab) &&
    (s.titleAr.includes(q) || s.titleEn.toLowerCase().includes(q.toLowerCase()) || s.sku.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AdminLayout title="الخدمات" subtitle="إدارة كتالوج الخدمات والباقات" action={
      <div className="hidden sm:flex gap-2">
        <GhostButton><Download className="h-4 w-4" /> تصدير</GhostButton>
        <PrimaryButton><Plus className="h-4 w-4" /> إضافة خدمة</PrimaryButton>
      </div>
    }>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="إجمالي الخدمات" value={12} icon={Package} accent="primary" />
        <StatCard label="نشطة" value={9} icon={CheckCircle2} accent="emerald" />
        <StatCard label="مسودات" value={2} icon={FileEdit} accent="amber" />
        <StatCard label="مؤرشفة" value={1} icon={Archive} accent="muted" />
      </div>

      <PanelCard>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث في الخدمات..." className="w-full rounded-xl border border-border bg-background pr-10 pl-3 py-2.5 text-sm" />
          </div>
          <div className="inline-flex rounded-xl border border-border bg-background p-1">
            {[["all", "الكل"], ["active", "نشطة"], ["draft", "مسودات"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-muted-foreground border-b border-border">
                <th className="px-3 py-3 font-medium">الخدمة</th>
                <th className="px-3 py-3 font-medium">SKU</th>
                <th className="px-3 py-3 font-medium">التصنيف</th>
                <th className="px-3 py-3 font-medium">السعر</th>
                <th className="px-3 py-3 font-medium">الحجوزات</th>
                <th className="px-3 py-3 font-medium">الحالة</th>
                <th className="px-3 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const st = statusMap[s.status];
                return (
                  <tr key={s.id} className="border-b border-border hover:bg-muted/40">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Package className="h-5 w-5" /></div>
                        <div>
                          <div className="font-bold">{s.titleAr}</div>
                          <div className="text-[11px] text-muted-foreground">{s.titleEn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{s.sku}</td>
                    <td className="px-3 py-3"><Pill tone="primary">{s.category}</Pill></td>
                    <td className="px-3 py-3 font-bold">{fmtSAR(s.price)}</td>
                    <td className="px-3 py-3">{s.bookings}</td>
                    <td className="px-3 py-3"><Pill tone={st.t}>{st.l}</Pill></td>
                    <td className="px-3 py-3">
                      <Link to="/admin/services/$slug" params={{ slug: slugFor(s.titleEn) }} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted">
                        <Pencil className="h-3 w-3" /> التفاصيل
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}
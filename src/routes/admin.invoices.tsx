import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, GhostButton } from "@/components/admin/AdminLayout";
import { FileText, CheckCircle2, Clock, XCircle, Search, Eye, Download } from "lucide-react";
import { useState } from "react";
import { adminInvoices, fmtSAR } from "@/data/admin";

export const Route = createFileRoute("/admin/invoices")({
  head: () => ({ meta: [{ title: "الفواتير | لوحة التحكم" }] }),
  component: InvoicesPage,
});

const map = { paid: { l: "مدفوعة", t: "emerald" as const }, pending: { l: "معلقة", t: "amber" as const }, void: { l: "ملغاة", t: "rose" as const } };

function InvoicesPage() {
  const [tab, setTab] = useState<"all" | "paid" | "pending" | "void">("all");
  const [q, setQ] = useState("");
  const filtered = adminInvoices.filter(i =>
    (tab === "all" || i.status === tab) &&
    (i.number.toLowerCase().includes(q.toLowerCase()) || i.client.includes(q))
  );

  const total = adminInvoices.reduce((s, i) => s + (i.status === "paid" ? i.amount : 0), 0);

  return (
    <AdminLayout title="الفواتير" subtitle="تتبع وإدارة فواتير العملاء" action={
      <GhostButton><Download className="h-4 w-4" /> تصدير</GhostButton>
    }>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="إجمالي الفواتير" value={adminInvoices.length} icon={FileText} accent="primary" />
        <StatCard label="مدفوعة" value={adminInvoices.filter(i => i.status === "paid").length} icon={CheckCircle2} accent="emerald" />
        <StatCard label="معلقة" value={adminInvoices.filter(i => i.status === "pending").length} icon={Clock} accent="amber" />
        <StatCard label="إجمالي المبالغ" value={fmtSAR(total)} icon={XCircle} accent="violet" />
      </div>

      <PanelCard>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن فاتورة، طلب أو عميل..." className="w-full rounded-xl border border-border bg-background pr-10 pl-3 py-2.5 text-sm" />
          </div>
          <div className="inline-flex rounded-xl border border-border bg-background p-1">
            {[["all", "الكل"], ["paid", "مدفوعة"], ["pending", "معلقة"], ["void", "ملغاة"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-muted-foreground border-b border-border">
                <th className="px-3 py-3 font-medium">الفاتورة</th>
                <th className="px-3 py-3 font-medium">الطلب</th>
                <th className="px-3 py-3 font-medium">العميل</th>
                <th className="px-3 py-3 font-medium">المبلغ</th>
                <th className="px-3 py-3 font-medium">الحالة</th>
                <th className="px-3 py-3 font-medium">التاريخ</th>
                <th className="px-3 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const s = map[i.status];
                return (
                  <tr key={i.id} className="border-b border-border hover:bg-muted/40">
                    <td className="px-3 py-3 font-bold text-primary">{i.number}</td>
                    <td className="px-3 py-3 text-muted-foreground">#{i.orderNumber}</td>
                    <td className="px-3 py-3"><div className="font-medium">{i.client}</div><div className="text-[11px] text-muted-foreground">{i.email}</div></td>
                    <td className="px-3 py-3 font-bold">{fmtSAR(i.amount)}</td>
                    <td className="px-3 py-3"><Pill tone={s.t}>{s.l}</Pill></td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{i.issued}</td>
                    <td className="px-3 py-3"><button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-primary"><Eye className="h-4 w-4" /></button></td>
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
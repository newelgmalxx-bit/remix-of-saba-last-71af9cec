import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { CalendarCheck, Clock, Loader2, CheckCircle2, Search, Eye, Plus, Download } from "lucide-react";
import { useState } from "react";
import { adminBookings, bookingStatusMap, fmtSAR } from "@/data/admin";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({ meta: [{ title: "الحجوزات | لوحة التحكم" }] }),
  component: BookingsPage,
});

function BookingsPage() {
  const [tab, setTab] = useState<"all" | "pending" | "in_progress" | "completed" | "cancelled">("all");
  const [q, setQ] = useState("");
  const filtered = adminBookings.filter(b =>
    (tab === "all" || b.status === tab) &&
    (b.client.includes(q) || b.number.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AdminLayout title="الحجوزات" subtitle="تتبع وإدارة دورة حياة الطلبات" action={
      <div className="hidden sm:flex gap-2">
        <GhostButton><Download className="h-4 w-4" /> تصدير</GhostButton>
        <PrimaryButton><Plus className="h-4 w-4" /> حجز جديد</PrimaryButton>
      </div>
    }>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="إجمالي الحجوزات" value={184} hint="↑ +8.2%" icon={CalendarCheck} accent="primary" />
        <StatCard label="بانتظار التأكيد" value={21} icon={Clock} accent="amber" />
        <StatCard label="قيد التنفيذ" value={38} icon={Loader2} accent="violet" />
        <StatCard label="مكتملة" value={112} hint="↑ +12.5%" icon={CheckCircle2} accent="emerald" />
      </div>

      <PanelCard>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث برقم الطلب أو اسم العميل..." className="w-full rounded-xl border border-border bg-background pr-10 pl-3 py-2.5 text-sm" />
          </div>
          <div className="inline-flex flex-wrap rounded-xl border border-border bg-background p-1">
            {[["all", "الكل"], ["pending", "بانتظار"], ["in_progress", "تنفيذ"], ["completed", "مكتمل"], ["cancelled", "ملغي"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-muted-foreground border-b border-border">
                <th className="px-3 py-3 font-medium">رقم الطلب</th>
                <th className="px-3 py-3 font-medium">العميل</th>
                <th className="px-3 py-3 font-medium">الخدمة</th>
                <th className="px-3 py-3 font-medium">الإجمالي</th>
                <th className="px-3 py-3 font-medium">الدفع</th>
                <th className="px-3 py-3 font-medium">الحالة</th>
                <th className="px-3 py-3 font-medium">التاريخ</th>
                <th className="px-3 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const s = bookingStatusMap[b.status];
                return (
                  <tr key={b.id} className="border-b border-border hover:bg-muted/40">
                    <td className="px-3 py-3 font-bold text-primary">#{b.number}</td>
                    <td className="px-3 py-3"><div className="font-medium">{b.client}</div><div className="text-[11px] text-muted-foreground">{b.email}</div></td>
                    <td className="px-3 py-3">{b.service}</td>
                    <td className="px-3 py-3 font-bold">{fmtSAR(b.total)}</td>
                    <td className="px-3 py-3 text-muted-foreground">{b.payment}</td>
                    <td className="px-3 py-3"><Pill tone={s.tone}>{s.label}</Pill></td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{b.date}</td>
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
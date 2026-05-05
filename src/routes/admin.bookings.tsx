import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { CalendarCheck, Clock, Loader2, CheckCircle2, Search, Eye, Download, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { adminBookings as initialBookings, bookingStatusMap, fmtSAR, paymentMethods, type AdminBooking } from "@/data/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({ meta: [{ title: "الطلبات | لوحة التحكم" }] }),
  component: BookingsPage,
});

const statusKeys: AdminBooking["status"][] = ["pending", "in_progress", "review", "completed", "cancelled"];

function BookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>(initialBookings);
  const [tab, setTab] = useState<"all" | AdminBooking["status"]>("all");
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState<"7" | "30" | "90" | "all">("all");
  const [source, setSource] = useState<"all" | "direct" | "partner">("all");
  const [viewing, setViewing] = useState<AdminBooking | null>(null);
  const [editing, setEditing] = useState<AdminBooking | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdminBooking>>({});

  // crude period filter using index (mock data shares similar dates)
  const limit = period === "7" ? 2 : period === "30" ? 4 : period === "90" ? 6 : bookings.length;

  const filtered = bookings.slice(0, limit).filter(b =>
    (tab === "all" || b.status === tab) &&
    (source === "all" || b.source === source) &&
    (b.client.includes(q) || b.number.toLowerCase().includes(q.toLowerCase()))
  );

  const exportCsv = () => {
    const header = "Number,Client,Email,Phone,City,Service,Total,Payment,Status,Date";
    const rows = filtered.map(b => `${b.number},${b.client},${b.email},${b.phone ?? ""},${b.city ?? ""},${b.service},${b.total},${b.payment},${b.status},${b.date}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bookings.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير الطلبات");
  };

  const openEdit = (b: AdminBooking) => { setEditing(b); setEditForm({ ...b }); };
  const saveEdit = () => {
    if (!editing) return;
    setBookings(bookings.map(b => b.id === editing.id ? { ...b, ...editForm } as AdminBooking : b));
    toast.success("تم تحديث الطلب");
    setEditing(null);
  };
  const remove = (id: string) => { setBookings(bookings.filter(b => b.id !== id)); toast.success("تم الحذف"); };

  return (
    <AdminLayout title="الطلبات" subtitle="تتبع وإدارة دورة حياة الطلبات" action={
      <div className="hidden sm:flex gap-2">
        <select value={source} onChange={(e) => setSource(e.target.value as any)} className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-bold">
          <option value="all">كل المصادر</option>
          <option value="direct">مباشر</option>
          <option value="partner">من الشريك</option>
        </select>
        <select value={period} onChange={(e) => setPeriod(e.target.value as any)} className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-bold">
          <option value="7">آخر 7 أيام</option>
          <option value="30">آخر 30 يوم</option>
          <option value="90">آخر 90 يوم</option>
          <option value="all">كل الفترة</option>
        </select>
        <GhostButton onClick={exportCsv}><Download className="h-4 w-4" /> تصدير</GhostButton>
      </div>
    }>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="إجمالي الطلبات" value={bookings.length} hint="↑ +8.2%" icon={CalendarCheck} accent="primary" />
        <StatCard label="بانتظار التأكيد" value={bookings.filter(b => b.status === "pending").length} icon={Clock} accent="amber" />
        <StatCard label="قيد التنفيذ" value={bookings.filter(b => b.status === "in_progress").length} icon={Loader2} accent="violet" />
        <StatCard label="مكتملة" value={bookings.filter(b => b.status === "completed").length} hint="↑ +12.5%" icon={CheckCircle2} accent="emerald" />
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
                <th className="px-3 py-3 font-medium">الجوال</th>
                <th className="px-3 py-3 font-medium">المدينة</th>
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
                    <td className="px-3 py-3 font-bold text-primary" dir="ltr">#{b.number}</td>
                    <td className="px-3 py-3"><div className="font-medium">{b.client}</div><div className="text-[11px] text-muted-foreground">{b.email}</div></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground" dir="ltr">{b.phone ?? "—"}</td>
                    <td className="px-3 py-3 text-xs">{b.city ?? "—"}</td>
                    <td className="px-3 py-3">{b.service}</td>
                    <td className="px-3 py-3 font-bold" data-ltr-number>{fmtSAR(b.total)}</td>
                    <td className="px-3 py-3">
                      <select value={b.payment} onChange={(e) => setBookings(bookings.map(x => x.id === b.id ? { ...x, payment: e.target.value } : x))} className="rounded-lg border border-border bg-background px-2 py-1 text-xs">
                        {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select value={b.status} onChange={(e) => { setBookings(bookings.map(x => x.id === b.id ? { ...x, status: e.target.value as any } : x)); toast.success("تم تحديث الحالة"); }} className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-bold">
                        {statusKeys.map(k => <option key={k} value={k}>{bookingStatusMap[k].label}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground text-xs" data-ltr-number>{b.date}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setViewing(b)} title="عرض الفاتورة" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-primary"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => openEdit(b)} title="تعديل" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-foreground/70"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(b.id)} title="حذف" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {/* Invoice view */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent dir="rtl" className="max-w-2xl">
          <DialogHeader><DialogTitle>فاتورة الطلب <span dir="ltr">#{viewing?.number}</span></DialogTitle></DialogHeader>
          {viewing && (() => {
            const subtotal = Math.round(viewing.total / 1.15);
            const vat = viewing.total - subtotal;
            return (
              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-l from-primary to-primary-dark text-white p-5">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-xs opacity-80">سابا ديزاين — فاتورة</div>
                      <div className="text-2xl font-extrabold mt-1" dir="ltr">#{viewing.number}</div>
                    </div>
                    <div className="text-left text-xs">
                      <div className="opacity-80">التاريخ</div>
                      <div className="font-bold" data-ltr-number>{viewing.date}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-[11px] text-muted-foreground">العميل</div><div className="font-bold">{viewing.client}</div><div className="text-xs text-muted-foreground">{viewing.email}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">الجوال</div><div className="font-bold" dir="ltr">{viewing.phone ?? "—"}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">المدينة</div><div className="font-bold">{viewing.city ?? "—"}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">طريقة الدفع</div><div className="font-bold">{viewing.payment}</div></div>
                </div>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs"><tr><th className="px-3 py-2 text-right font-medium">الخدمة</th><th className="px-3 py-2 text-right font-medium">الكمية</th><th className="px-3 py-2 text-right font-medium">السعر</th></tr></thead>
                    <tbody><tr className="border-t border-border"><td className="px-3 py-3 font-medium">{viewing.service}</td><td className="px-3 py-3" data-ltr-number>1</td><td className="px-3 py-3 font-bold" data-ltr-number>{fmtSAR(subtotal)}</td></tr></tbody>
                  </table>
                </div>
                <div className="space-y-1.5 text-sm border-t border-border pt-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">المجموع الفرعي</span><span className="font-medium" data-ltr-number>{fmtSAR(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span><span className="font-medium" data-ltr-number>{fmtSAR(vat)}</span></div>
                  <div className="flex justify-between text-base font-extrabold text-primary pt-2 border-t border-border"><span>الإجمالي</span><span data-ltr-number>{fmtSAR(viewing.total)}</span></div>
                </div>
                <div className="flex justify-between items-center">
                  <Pill tone={bookingStatusMap[viewing.status].tone}>{bookingStatusMap[viewing.status].label}</Pill>
                  <button onClick={() => window.print()} className="text-xs font-bold text-primary hover:underline">طباعة</button>
                </div>
              </div>
            );
          })()}
          <DialogFooter><GhostButton onClick={() => setViewing(null)}>إغلاق</GhostButton></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit booking */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent dir="rtl" className="max-w-lg">
          <DialogHeader><DialogTitle>تعديل الطلب <span dir="ltr">#{editing?.number}</span></DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              <Lbl label="العميل"><input className={ic} value={editForm.client ?? ""} onChange={e => setEditForm({ ...editForm, client: e.target.value })} /></Lbl>
              <Lbl label="البريد"><input className={ic} value={editForm.email ?? ""} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></Lbl>
              <Lbl label="رقم الجوال"><input type="tel" inputMode="tel" className={ic} dir="ltr" value={editForm.phone ?? ""} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} /></Lbl>
              <Lbl label="المدينة"><input className={ic} value={editForm.city ?? ""} onChange={e => setEditForm({ ...editForm, city: e.target.value })} /></Lbl>
              <Lbl label="الخدمة" full><input className={ic} value={editForm.service ?? ""} onChange={e => setEditForm({ ...editForm, service: e.target.value })} /></Lbl>
              <Lbl label="الإجمالي (ر.س)"><input type="number" className={ic} dir="ltr" value={editForm.total ?? 0} onChange={e => setEditForm({ ...editForm, total: Number(e.target.value) })} /></Lbl>
              <Lbl label="طريقة الدفع">
                <select className={ic} value={editForm.payment ?? paymentMethods[0]} onChange={e => setEditForm({ ...editForm, payment: e.target.value })}>
                  {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Lbl>
              <Lbl label="المصدر">
                <select className={ic} value={editForm.source ?? "direct"} onChange={e => setEditForm({ ...editForm, source: e.target.value as any })}>
                  <option value="direct">مباشر</option><option value="partner">من الشريك</option>
                </select>
              </Lbl>
              <Lbl label="الحالة" full>
                <select className={ic} value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}>
                  {statusKeys.map(k => <option key={k} value={k}>{bookingStatusMap[k].label}</option>)}
                </select>
              </Lbl>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setEditing(null)}>إلغاء</GhostButton>
            <PrimaryButton onClick={saveEdit}>حفظ التغييرات</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function Lbl({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`text-xs font-bold space-y-1.5 block ${full ? "col-span-2" : ""}`}>{label}{children}</label>;
}
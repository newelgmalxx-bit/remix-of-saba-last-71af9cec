import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, GhostButton, PrimaryButton } from "@/components/admin/AdminLayout";
import { FileText, CheckCircle2, Clock, XCircle, Search, Eye, Download, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { adminInvoices as initialInvoices, paymentMethods, fmtSAR, type AdminInvoice } from "@/data/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/invoices")({
  head: () => ({ meta: [{ title: "الفواتير | لوحة التحكم" }] }),
  component: InvoicesPage,
});

const map = { paid: { l: "مدفوعة", t: "emerald" as const }, pending: { l: "معلقة", t: "amber" as const }, void: { l: "ملغاة", t: "rose" as const } };

function InvoicesPage() {
  const [invoices, setInvoices] = useState<AdminInvoice[]>(initialInvoices);
  const [tab, setTab] = useState<"all" | "paid" | "pending" | "void">("all");
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState<AdminInvoice | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Omit<AdminInvoice, "id" | "number">>({
    orderNumber: "", client: "", email: "", phone: "", city: "", payment: paymentMethods[0],
    amount: 0, status: "pending", issued: new Date().toLocaleDateString("ar-SA"),
  });
  const filtered = invoices.filter(i =>
    (tab === "all" || i.status === tab) &&
    (i.number.toLowerCase().includes(q.toLowerCase()) || i.client.includes(q))
  );

  const total = invoices.reduce((s, i) => s + (i.status === "paid" ? i.amount : 0), 0);

  const exportCsv = () => {
    const csv = ["Number,Order,Client,Email,Phone,City,Payment,Amount,Status,Issued",
      ...invoices.map(i => `${i.number},${i.orderNumber},${i.client},${i.email},${i.phone ?? ""},${i.city ?? ""},${i.payment ?? ""},${i.amount},${i.status},${i.issued}`)
    ].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "invoices.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير الفواتير");
  };

  const handleAdd = () => {
    if (!form.client || !form.amount) { toast.error("الاسم والمبلغ مطلوبان"); return; }
    const num = "INV-" + (7822 + invoices.length);
    setInvoices([{ id: "i" + Date.now(), number: num, ...form }, ...invoices]);
    setAddOpen(false);
    toast.success("تم إنشاء الفاتورة");
  };
  const remove = (id: string) => { setInvoices(invoices.filter(i => i.id !== id)); toast.success("تم الحذف"); };

  return (
    <AdminLayout title="الفواتير" subtitle="تتبع وإدارة فواتير العملاء" action={
      <div className="flex gap-2">
        <GhostButton onClick={exportCsv}><Download className="h-4 w-4" /> تصدير</GhostButton>
        <PrimaryButton onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> فاتورة يدوية</PrimaryButton>
      </div>
    }>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="إجمالي الفواتير" value={invoices.length} icon={FileText} accent="primary" />
        <StatCard label="مدفوعة" value={invoices.filter(i => i.status === "paid").length} icon={CheckCircle2} accent="emerald" />
        <StatCard label="معلقة" value={invoices.filter(i => i.status === "pending").length} icon={Clock} accent="amber" />
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
                <th className="px-3 py-3 font-medium">الجوال</th>
                <th className="px-3 py-3 font-medium">المدينة</th>
                <th className="px-3 py-3 font-medium">الدفع</th>
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
                    <td className="px-3 py-3 font-bold text-primary" dir="ltr">{i.number}</td>
                    <td className="px-3 py-3 text-muted-foreground" dir="ltr">#{i.orderNumber}</td>
                    <td className="px-3 py-3"><div className="font-medium">{i.client}</div><div className="text-[11px] text-muted-foreground">{i.email}</div></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground" dir="ltr">{i.phone ?? "—"}</td>
                    <td className="px-3 py-3 text-xs">{i.city ?? "—"}</td>
                    <td className="px-3 py-3">
                      <select value={i.payment ?? paymentMethods[0]} onChange={(e) => setInvoices(invoices.map(x => x.id === i.id ? { ...x, payment: e.target.value } : x))} className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-bold">
                        {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-3 font-bold" data-ltr-number>{fmtSAR(i.amount)}</td>
                    <td className="px-3 py-3"><Pill tone={s.t}>{s.l}</Pill></td>
                    <td className="px-3 py-3 text-muted-foreground text-xs" data-ltr-number>{i.issued}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setViewing(i)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-primary"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => remove(i.id)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PanelCard>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent dir="rtl" className="max-w-lg">
          <DialogHeader><DialogTitle>الفاتورة {viewing?.number}</DialogTitle></DialogHeader>
          {viewing && (() => {
            const subtotal = Math.round(viewing.amount / 1.15);
            const vat = viewing.amount - subtotal;
            return (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><div className="text-[11px] text-muted-foreground">رقم الطلب</div><div className="font-bold" dir="ltr">#{viewing.orderNumber}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">التاريخ</div><div className="font-bold" data-ltr-number>{viewing.issued}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">العميل</div><div className="font-bold">{viewing.client}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">البريد</div><div className="font-bold">{viewing.email}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">الجوال</div><div className="font-bold" dir="ltr">{viewing.phone ?? "—"}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">المدينة</div><div className="font-bold">{viewing.city ?? "—"}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">طريقة الدفع</div><div className="font-bold">{viewing.payment ?? "—"}</div></div>
                </div>
                <div className="border-t border-border pt-3 space-y-1.5">
                  <div className="flex justify-between"><span className="text-muted-foreground">المجموع الفرعي</span><span data-ltr-number>{fmtSAR(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ضريبة 15%</span><span data-ltr-number>{fmtSAR(vat)}</span></div>
                  <div className="flex justify-between text-base font-extrabold text-primary border-t border-border pt-2"><span>الإجمالي</span><span data-ltr-number>{fmtSAR(viewing.amount)}</span></div>
                </div>
                <Pill tone={map[viewing.status].t}>{map[viewing.status].l}</Pill>
              </div>
            );
          })()}
          <DialogFooter><GhostButton onClick={() => setViewing(null)}>إغلاق</GhostButton></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent dir="rtl" className="max-w-xl">
          <DialogHeader><DialogTitle>فاتورة يدوية جديدة</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <L label="اسم العميل"><input className={ic} value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} /></L>
            <L label="البريد"><input className={ic} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></L>
            <L label="رقم الجوال"><input type="tel" inputMode="tel" className={ic} dir="ltr" value={form.phone ?? ""} onChange={e => setForm({ ...form, phone: e.target.value })} /></L>
            <L label="المدينة"><input className={ic} value={form.city ?? ""} onChange={e => setForm({ ...form, city: e.target.value })} /></L>
            <L label="رقم الطلب"><input className={ic} value={form.orderNumber} onChange={e => setForm({ ...form, orderNumber: e.target.value })} /></L>
            <L label="المبلغ (شامل الضريبة)"><input type="number" className={ic} dir="ltr" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} /></L>
            <L label="طريقة الدفع">
              <select className={ic} value={form.payment} onChange={e => setForm({ ...form, payment: e.target.value })}>
                {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </L>
            <L label="الحالة">
              <select className={ic} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                <option value="pending">معلقة</option><option value="paid">مدفوعة</option><option value="void">ملغاة</option>
              </select>
            </L>
            <L label="تاريخ الإصدار"><input className={ic} value={form.issued} onChange={e => setForm({ ...form, issued: e.target.value })} /></L>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setAddOpen(false)}>إلغاء</GhostButton>
            <PrimaryButton onClick={handleAdd}>إنشاء الفاتورة</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="text-xs font-bold space-y-1.5 block">{label}{children}</label>;
}
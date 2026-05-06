import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, GhostButton, PrimaryButton } from "@/components/admin/AdminLayout";
import { FileText, CheckCircle2, Clock, XCircle, Search, Eye, Download, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { paymentMethods, fmtSAR, type AdminInvoice } from "@/data/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api";
import { renderInvoiceToPdf } from "@/lib/renderInvoice";

export const Route = createFileRoute("/admin/invoices")({
  head: () => ({ meta: [{ title: "الفواتير | لوحة التحكم" }] }),
  component: InvoicesPage,
});

function InvoicesPage() {
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const map = {
    paid: { l: L("مدفوعة", "Paid"), t: "emerald" as const },
    pending: { l: L("معلقة", "Pending"), t: "amber" as const },
    void: { l: L("ملغاة", "Void"), t: "rose" as const },
  };

  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [tab, setTab] = useState<"all" | "paid" | "pending" | "void">("all");
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState<AdminInvoice | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Omit<AdminInvoice, "id" | "number">>({
    orderNumber: "", client: "", email: "", phone: "", city: "", payment: paymentMethods[0],
    amount: 0, status: "pending", issued: new Date().toLocaleDateString(lang === "en" ? "en-US" : "ar-SA"),
  });

  useEffect(() => {
    adminApi.invoices.list({ limit: 100 })
      .then((p) => {
        const items: AdminInvoice[] = (p.items || []).map((i: any) => ({
          id: i.id, number: i.number, orderNumber: i.order_id ?? "",
          client: i.client_name, email: i.client_email,
          phone: i.client_phone ?? "", city: i.client_city ?? "",
          payment: i.payment_method ?? paymentMethods[0],
          amount: Number(i.total) || 0, status: i.status,
          issued: (i.created_at || "").slice(0, 10),
        }));
        setInvoices(items);
      })
      .catch(() => setInvoices([]));
  }, []);

  const filtered = invoices.filter(i => {
    const num = (i.number ?? "").toString().toLowerCase();
    const client = (i.client ?? "").toString();
    const query = (q ?? "").toLowerCase();
    return (tab === "all" || i.status === tab) &&
      (num.includes(query) || client.includes(q));
  });

  const total = invoices.reduce((s, i) => s + (i.status === "paid" ? i.amount : 0), 0);

  const exportCsv = () => {
    const csv = ["Number,Order,Client,Email,Phone,City,Payment,Amount,Status,Issued",
      ...invoices.map(i => `${i.number},${i.orderNumber},${i.client},${i.email},${i.phone ?? ""},${i.city ?? ""},${i.payment ?? ""},${i.amount},${i.status},${i.issued}`)
    ].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "invoices.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success(L("تم تصدير الفواتير", "Invoices exported"));
  };

  const handleAdd = async () => {
    if (!form.client || !form.amount) { toast.error(L("الاسم والمبلغ مطلوبان", "Name and amount are required")); return; }
    try {
      const res = await adminApi.invoices.create({
        client: form.client, email: form.email, phone: form.phone, city: form.city,
        items: [{ desc: "Manual invoice", qty: 1, price: form.amount }],
        payment: form.payment, notes: undefined,
      });
      setInvoices([{ id: res.id, number: res.number, ...form }, ...invoices]);
      toast.success(L("تم إنشاء الفاتورة", "Invoice created"));
    } catch {
      const num = "INV-" + (7822 + invoices.length);
      setInvoices([{ id: "i" + Date.now(), number: num, ...form }, ...invoices]);
      toast.success(L("تم إنشاء الفاتورة", "Invoice created"));
    }
    setAddOpen(false);
  };
  const remove = (id: string) => {
    setInvoices(invoices.filter(i => i.id !== id));
    adminApi.invoices.remove(id).catch(() => {});
    toast.success(L("تم الحذف", "Deleted"));
  };

  const startSide = dir === "rtl" ? "right-3" : "left-3";
  const padStart = dir === "rtl" ? "pr-10 pl-3" : "pl-10 pr-3";
  const textAlign = dir === "rtl" ? "text-right" : "text-left";

  return (
    <AdminLayout title={L("الفواتير", "Invoices")} subtitle={L("تتبع وإدارة فواتير العملاء", "Track and manage client invoices")} action={
      <div className="flex gap-2">
        <GhostButton onClick={exportCsv}><Download className="h-4 w-4" /> {L("تصدير", "Export")}</GhostButton>
        <PrimaryButton onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> {L("فاتورة يدوية", "Manual Invoice")}</PrimaryButton>
      </div>
    }>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("إجمالي الفواتير", "Total Invoices")} value={invoices.length} icon={FileText} accent="primary" />
        <StatCard label={L("مدفوعة", "Paid")} value={invoices.filter(i => i.status === "paid").length} icon={CheckCircle2} accent="emerald" />
        <StatCard label={L("معلقة", "Pending")} value={invoices.filter(i => i.status === "pending").length} icon={Clock} accent="amber" />
        <StatCard label={L("إجمالي المبالغ", "Total Amount")} value={fmtSAR(total)} icon={XCircle} accent="violet" />
      </div>

      <PanelCard>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute ${startSide} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("ابحث عن فاتورة، طلب أو عميل...", "Search invoice, order or client...")} className={`w-full rounded-xl border border-border bg-background ${padStart} py-2.5 text-sm`} />
          </div>
          <div className="inline-flex rounded-xl border border-border bg-background p-1">
            {[["all", L("الكل", "All")], ["paid", L("مدفوعة", "Paid")], ["pending", L("معلقة", "Pending")], ["void", L("ملغاة", "Void")]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className={`${textAlign} text-xs text-muted-foreground border-b border-border`}>
                <th className="px-3 py-3 font-medium">{L("الفاتورة", "Invoice")}</th>
                <th className="px-3 py-3 font-medium">{L("الطلب", "Order")}</th>
                <th className="px-3 py-3 font-medium">{L("العميل", "Client")}</th>
                <th className="px-3 py-3 font-medium">{L("الجوال", "Phone")}</th>
                <th className="px-3 py-3 font-medium">{L("المدينة", "City")}</th>
                <th className="px-3 py-3 font-medium">{L("الدفع", "Payment")}</th>
                <th className="px-3 py-3 font-medium">{L("المبلغ", "Amount")}</th>
                <th className="px-3 py-3 font-medium">{L("الحالة", "Status")}</th>
                <th className="px-3 py-3 font-medium">{L("التاريخ", "Date")}</th>
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
        <DialogContent dir={dir} className="max-w-3xl">
          <DialogHeader><DialogTitle>{L("الفاتورة", "Invoice")} {viewing?.number}</DialogTitle></DialogHeader>
          {viewing && (() => {
            const subtotal = Math.round(viewing.amount / 1.15);
            const vat = viewing.amount - subtotal;
            const data = {
              number: viewing.number,
              date: viewing.issued,
              clientName: viewing.client,
              clientEmail: viewing.email,
              clientPhone: viewing.phone,
              clientCity: viewing.city,
              paymentMethod: viewing.payment,
              paymentStatus: viewing.status === "paid" ? "paid" : viewing.status === "void" ? "refunded" : "unpaid",
              items: [{ title: L("خدمات سابا ديزاين", "Saba Design Services"), qty: 1, price: subtotal }],
              subtotal, vat, total: viewing.amount,
            };
            return (
              <div className="space-y-3">
                <div className="overflow-auto max-h-[70vh] flex justify-center bg-muted/30 rounded-xl p-4">
                  <div style={{ transform: "scale(0.7)", transformOrigin: "top center" }}>
                    <InvoiceDocument data={data as any} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <PrimaryButton onClick={() => renderInvoiceToPdf(data as any)}>
                    <Download className="h-4 w-4" /> {L("تحميل PDF", "Download PDF")}
                  </PrimaryButton>
                </div>
              </div>
            );
          })()}
          <DialogFooter><GhostButton onClick={() => setViewing(null)}>{L("إغلاق", "Close")}</GhostButton></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent dir={dir} className="max-w-xl">
          <DialogHeader><DialogTitle>{L("فاتورة يدوية جديدة", "New Manual Invoice")}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Lb label={L("اسم العميل", "Client Name")}><input className={ic} value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} /></Lb>
            <Lb label={L("البريد", "Email")}><input className={ic} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Lb>
            <Lb label={L("رقم الجوال", "Phone")}><input type="tel" inputMode="tel" className={ic} dir="ltr" value={form.phone ?? ""} onChange={e => setForm({ ...form, phone: e.target.value })} /></Lb>
            <Lb label={L("المدينة", "City")}><input className={ic} value={form.city ?? ""} onChange={e => setForm({ ...form, city: e.target.value })} /></Lb>
            <Lb label={L("رقم الطلب", "Order #")}><input className={ic} value={form.orderNumber} onChange={e => setForm({ ...form, orderNumber: e.target.value })} /></Lb>
            <Lb label={L("المبلغ (شامل الضريبة)", "Amount (incl. VAT)")}><input type="number" className={ic} dir="ltr" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} /></Lb>
            <Lb label={L("طريقة الدفع", "Payment Method")}>
              <select className={ic} value={form.payment} onChange={e => setForm({ ...form, payment: e.target.value })}>
                {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Lb>
            <Lb label={L("الحالة", "Status")}>
              <select className={ic} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                <option value="pending">{L("معلقة", "Pending")}</option><option value="paid">{L("مدفوعة", "Paid")}</option><option value="void">{L("ملغاة", "Void")}</option>
              </select>
            </Lb>
            <Lb label={L("تاريخ الإصدار", "Issue Date")}><input className={ic} value={form.issued} onChange={e => setForm({ ...form, issued: e.target.value })} /></Lb>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setAddOpen(false)}>{L("إلغاء", "Cancel")}</GhostButton>
            <PrimaryButton onClick={handleAdd}>{L("إنشاء الفاتورة", "Create Invoice")}</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function Lb({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="text-xs font-bold space-y-1.5 block">{label}{children}</label>;
}

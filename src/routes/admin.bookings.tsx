import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { CalendarCheck, Clock, Loader2, CheckCircle2, Search, Eye, Download, Pencil, Trash2, BadgeCheck, BadgeDollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { bookingStatusMap, fmtSAR, paymentMethods, type AdminBooking } from "@/data/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api";
import { renderInvoiceToPdf, renderInvoiceToPdfBlob } from "@/lib/renderInvoice";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({ meta: [{ title: "الطلبات | لوحة التحكم" }] }),
  component: BookingsPage,
});

const statusKeys: AdminBooking["status"][] = ["pending", "in_progress", "review", "completed", "cancelled"];

function BookingsPage() {
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const statusLabels: Record<AdminBooking["status"], string> = {
    pending: L("بانتظار التأكيد", "Pending"),
    confirmed: L("مؤكد", "Confirmed"),
    in_progress: L("قيد التنفيذ", "In progress"),
    review: L("قيد المراجعة", "Under review"),
    completed: L("مكتمل", "Completed"),
    cancelled: L("ملغي", "Cancelled"),
  };
  const normalizePay = (v: string) => {
    const s = (v || "").toString().toLowerCase().trim();
    const m = paymentMethods.find(p => p.value === s || p.aliases?.some(a => a.toLowerCase() === s));
    return m?.value ?? s;
  };
  const payLabel = (v: string) => {
    const key = normalizePay(v);
    const m = paymentMethods.find(p => p.value === key);
    return m ? L(m.labelAr, m.labelEn) : v;
  };
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [tab, setTab] = useState<"all" | AdminBooking["status"]>("all");
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState<"7" | "30" | "90" | "all">("all");
  const [source, setSource] = useState<"all" | "direct" | "partner">("all");
  const [viewing, setViewing] = useState<AdminBooking | null>(null);
  const [editing, setEditing] = useState<AdminBooking | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdminBooking>>({});

  const mapOrderToBooking = (b: any): AdminBooking => ({
    id: b.id,
    number: b.number,
    client: b.contact_name || b.userName || b.client || "",
    email: b.contact_email || b.userEmail || b.email || "",
    phone: b.contact_phone || b.phone || undefined,
    city: b.contact_city || b.city || undefined,
    address: b.contact_address || b.address || undefined,
    notes: b.notes || undefined,
    service: Array.isArray(b.items) && b.items.length
      ? b.items.map((i: any) => i.service_title || i.serviceTitle || i.title).filter(Boolean).join(" • ")
      : (b.service || ""),
    subtotal: Number(b.subtotal) || undefined,
    vat: Number(b.vat) || undefined,
    couponDiscount: Number(b.coupon_discount ?? b.couponDiscount) || 0,
    total: Number(b.total) || 0,
    payment: normalizePay(b.payment_method || b.payment || "cod"),
    paymentId: b.payment_id ?? null,
    status: b.status,
    date: ((b.created_at || b.createdAt || "") + "").slice(0, 10),
    source: b.source ?? "direct",
    paymentStatus: (b.payment_status || b.paymentStatus || (b.status === "completed" ? "paid" : "unpaid")) as AdminBooking["paymentStatus"],
  } as AdminBooking);

  useEffect(() => {
    adminApi.orders.list({ limit: 100 })
      .then(async (p) => {
        const list = (p.items || []) as any[];
        setBookings(list.map(mapOrderToBooking));
        // List endpoint omits items[] — fetch each order's details to fill the Service column.
        const needsDetail = list.filter((b) => !Array.isArray(b.items) || !b.items.length);
        if (!needsDetail.length) return;
        const details = await Promise.all(
          needsDetail.map((b) => adminApi.orders.get(b.id).catch(() => null))
        );
        setBookings((prev) => {
          const byId = new Map(prev.map((x) => [x.id, x]));
          details.forEach((d: any) => {
            if (!d || !d.id) return;
            const fresh = mapOrderToBooking(d);
            const ex = byId.get(d.id);
            if (ex) byId.set(d.id, { ...ex, service: fresh.service || ex.service });
          });
          return Array.from(byId.values());
        });
      })
      .catch(() => setBookings([]));
  }, []);

  const periodDays = period === "all" ? null : Number(period);
  const filtered = bookings.filter(b => {
    if (periodDays != null && b.date) {
      const d = new Date(b.date).getTime();
      if (Number.isFinite(d) && (Date.now() - d) / 86400000 > periodDays) return false;
    }
    return true;
  }).filter(b =>
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
    toast.success(L("تم تصدير الطلبات", "Orders exported"));
  };

  const openEdit = (b: AdminBooking) => { setEditing(b); setEditForm({ ...b }); };
  const saveEdit = () => {
    if (!editing) return;
    setBookings(bookings.map(b => b.id === editing.id ? { ...b, ...editForm } as AdminBooking : b));
    toast.success(L("تم تحديث الطلب", "Order updated"));
    setEditing(null);
  };
  const remove = (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
    toast.success(L("تم الحذف", "Deleted"));
  };

  const isCod = (p: string) => {
    const s = (p || "").toLowerCase();
    return s === "cod" || s.includes("كاش") || s.includes("استلام") || s.includes("cash");
  };

  const issueInvoiceForBooking = async (b: AdminBooking) => {
    const subtotal = +(b.total / 1.15).toFixed(2);
    const vat = +(b.total - subtotal).toFixed(2);
    const invoiceData = {
      number: b.number,
      date: b.date,
      orderId: b.id,
      clientName: b.client,
      clientEmail: b.email,
      clientPhone: b.phone,
      clientCity: b.city,
      paymentMethod: payLabel(b.payment),
      paymentStatus: "paid" as const,
      items: [{ title: b.service || "—", qty: 1, price: subtotal }],
      subtotal, vat, total: b.total,
    };
    try {
      const pdf = await renderInvoiceToPdfBlob(invoiceData);
      await adminApi.invoices.create(invoiceData, pdf);
      toast.success(L("تم حفظ الفاتورة", "Invoice saved"));
    } catch (e: any) {
      console.error("Invoice save failed", e);
      toast.error(L("فشل حفظ الفاتورة", "Failed to save invoice"));
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const prev = bookings.find(x => x.id === id);
    const wasPaid = prev?.paymentStatus === "paid" || prev?.status === "completed";
    setBookings(bookings.map(x => x.id === id ? {
      ...x,
      status: status as any,
      paymentStatus: status === "completed" ? "paid" : x.paymentStatus,
    } : x));
    adminApi.orders.setStatus(id, { status }).catch(() => {});
    if (status === "completed") {
      adminApi.orders.setPaymentStatus?.(id, "paid").catch(() => {});
    }
    toast.success(L("تم تحديث الحالة", "Status updated"));
    if (status === "completed" && !wasPaid && prev) {
      await issueInvoiceForBooking({ ...prev, paymentStatus: "paid", status: "completed" });
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: AdminBooking["paymentStatus"]) => {
    const prev = bookings.find(x => x.id === id);
    const wasPaid = prev?.paymentStatus === "paid";
    setBookings(bookings.map(x => x.id === id ? { ...x, paymentStatus } : x));
    try {
      await adminApi.orders.setPaymentStatus?.(id, paymentStatus as string);
    } catch {}

    if (paymentStatus !== "paid") {
      toast.success(L("تم تحديث حالة الدفع", "Payment status updated"));
      return;
    }
    if (wasPaid || !prev) {
      toast.success(L("تم تأكيد الدفع", "Payment confirmed"));
      return;
    }
    toast.success(L("تم تأكيد الدفع", "Payment confirmed"));
    await issueInvoiceForBooking({ ...prev, paymentStatus: "paid" });
  };

  return (
    <AdminLayout title={L("الطلبات", "Orders")} subtitle={L("تتبع وإدارة دورة حياة الطلبات", "Track and manage the order lifecycle")} action={
      <div className="hidden sm:flex gap-2">
        <select value={source} onChange={(e) => setSource(e.target.value as any)} className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-bold">
          <option value="all">{L("كل المصادر", "All sources")}</option>
          <option value="direct">{L("مباشر", "Direct")}</option>
          <option value="partner">{L("من الشريك", "Partner")}</option>
        </select>
        <select value={period} onChange={(e) => setPeriod(e.target.value as any)} className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-bold">
          <option value="7">{L("آخر 7 أيام", "Last 7 days")}</option>
          <option value="30">{L("آخر 30 يوم", "Last 30 days")}</option>
          <option value="90">{L("آخر 90 يوم", "Last 90 days")}</option>
          <option value="all">{L("كل الفترة", "All time")}</option>
        </select>
        <GhostButton onClick={exportCsv}><Download className="h-4 w-4" /> {L("تصدير", "Export")}</GhostButton>
      </div>
    }>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("إجمالي الطلبات", "Total orders")} value={bookings.length} icon={CalendarCheck} accent="primary" />
        <StatCard label={L("بانتظار التأكيد", "Pending")} value={bookings.filter(b => b.status === "pending").length} icon={Clock} accent="amber" />
        <StatCard label={L("قيد التنفيذ", "In progress")} value={bookings.filter(b => b.status === "in_progress").length} icon={Loader2} accent="violet" />
        <StatCard label={L("مكتملة", "Completed")} value={bookings.filter(b => b.status === "completed").length} icon={CheckCircle2} accent="emerald" />
      </div>

      <PanelCard>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${dir === "rtl" ? "right-3" : "left-3"}`} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("ابحث برقم الطلب أو اسم العميل...", "Search by order number or client...")} className={`w-full rounded-xl border border-border bg-background py-2.5 text-sm ${dir === "rtl" ? "pr-10 pl-3" : "pl-10 pr-3"}`} />
          </div>
          <div className="inline-flex flex-wrap rounded-xl border border-border bg-background p-1">
            {([["all", L("الكل", "All")], ["pending", L("بانتظار", "Pending")], ["in_progress", L("تنفيذ", "In progress")], ["completed", L("مكتمل", "Completed")], ["cancelled", L("ملغي", "Cancelled")]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className={`${dir === "rtl" ? "text-right" : "text-left"} text-xs text-muted-foreground border-b border-border`}>
                <th className="px-3 py-3 font-medium">{L("رقم الطلب", "Order #")}</th>
                <th className="px-3 py-3 font-medium">{L("العميل", "Client")}</th>
                <th className="px-3 py-3 font-medium">{L("الجوال", "Phone")}</th>
                <th className="px-3 py-3 font-medium">{L("المدينة", "City")}</th>
                <th className="px-3 py-3 font-medium">{L("الخدمة", "Service")}</th>
                <th className="px-3 py-3 font-medium">{L("الإجمالي", "Total")}</th>
                <th className="px-3 py-3 font-medium">{L("الدفع", "Payment")}</th>
                <th className="px-3 py-3 font-medium">{L("حالة الدفع", "Pay status")}</th>
                <th className="px-3 py-3 font-medium">{L("الحالة", "Status")}</th>
                <th className="px-3 py-3 font-medium">{L("التاريخ", "Date")}</th>
                <th className="px-3 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
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
                        {paymentMethods.map(p => <option key={p.value} value={p.value}>{L(p.labelAr, p.labelEn)}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      {isCod(b.payment) && b.status !== "completed" && b.paymentStatus !== "paid" ? (
                        <button
                          onClick={() => updatePaymentStatus(b.id, "paid")}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                          title={L("تأكيد استلام الدفع وإصدار الفاتورة", "Mark as paid and issue invoice")}
                        >
                          <BadgeDollarSign className="h-3.5 w-3.5" />
                          {L("تأكيد الدفع", "Mark paid")}
                        </button>
                      ) : b.paymentStatus === "paid" || b.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          {L("مدفوع", "Paid")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">
                          <Clock className="h-3.5 w-3.5" />
                          {L("غير مدفوع", "Unpaid")}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)} className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-bold">
                        {statusKeys.map(k => <option key={k} value={k}>{statusLabels[k]}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground text-xs" data-ltr-number>{b.date}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            if (b.paymentStatus !== "paid" && b.status !== "completed") {
                              toast.error(L("لا يمكن إصدار الفاتورة قبل تأكيد الدفع", "Confirm payment before issuing the invoice"));
                              return;
                            }
                            setViewing(b);
                          }}
                          title={L("عرض الفاتورة", "View invoice")}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted ${b.paymentStatus === "paid" || b.status === "completed" ? "text-primary" : "text-muted-foreground/40"}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => openEdit(b)} title={L("تعديل", "Edit")} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-foreground/70"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(b.id)} title={L("حذف", "Delete")} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500"><Trash2 className="h-4 w-4" /></button>
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
        <DialogContent dir={dir} className="max-w-2xl">
          <DialogHeader><DialogTitle>{L("فاتورة الطلب", "Order invoice")} <span dir="ltr">#{viewing?.number}</span></DialogTitle></DialogHeader>
          {viewing && (() => {
            const subtotal = viewing.subtotal && viewing.subtotal > 0 ? viewing.subtotal : Math.round(viewing.total / 1.15);
            const vat = viewing.vat && viewing.vat > 0 ? viewing.vat : viewing.total - subtotal;
            const discount = viewing.couponDiscount || 0;
            return (
              <div className="space-y-4">
                <div className={`rounded-2xl ${dir === "rtl" ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-primary-dark text-white p-5`}>
                  <div className="flex justify-between">
                    <div>
                      <div className="text-xs opacity-80">{L("سابا ديزاين — فاتورة", "SABA DESIGN — Invoice")}</div>
                      <div className="text-2xl font-extrabold mt-1" dir="ltr">#{viewing.number}</div>
                    </div>
                    <div className={`${dir === "rtl" ? "text-left" : "text-right"} text-xs`}>
                      <div className="opacity-80">{L("التاريخ", "Date")}</div>
                      <div className="font-bold" data-ltr-number>{viewing.date}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-[11px] text-muted-foreground">{L("العميل", "Client")}</div><div className="font-bold">{viewing.client}</div><div className="text-xs text-muted-foreground">{viewing.email}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">{L("الجوال", "Phone")}</div><div className="font-bold" dir="ltr">{viewing.phone ?? "—"}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">{L("المدينة", "City")}</div><div className="font-bold">{viewing.city ?? "—"}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">{L("طريقة الدفع", "Payment method")}</div><div className="font-bold">{payLabel(viewing.payment)}</div></div>
                  {viewing.address && (
                    <div className="col-span-2"><div className="text-[11px] text-muted-foreground">{L("العنوان", "Address")}</div><div className="font-medium">{viewing.address}</div></div>
                  )}
                  {viewing.notes && (
                    <div className="col-span-2"><div className="text-[11px] text-muted-foreground">{L("ملاحظات", "Notes")}</div><div className="font-medium whitespace-pre-wrap">{viewing.notes}</div></div>
                  )}
                </div>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs"><tr><th className={`px-3 py-2 ${dir === "rtl" ? "text-right" : "text-left"} font-medium`}>{L("الخدمة", "Service")}</th><th className={`px-3 py-2 ${dir === "rtl" ? "text-right" : "text-left"} font-medium`}>{L("الكمية", "Qty")}</th><th className={`px-3 py-2 ${dir === "rtl" ? "text-right" : "text-left"} font-medium`}>{L("السعر", "Price")}</th></tr></thead>
                    <tbody><tr className="border-t border-border"><td className="px-3 py-3 font-medium">{viewing.service || "—"}</td><td className="px-3 py-3" data-ltr-number>1</td><td className="px-3 py-3 font-bold" data-ltr-number>{fmtSAR(subtotal)}</td></tr></tbody>
                  </table>
                </div>
                <div className="space-y-1.5 text-sm border-t border-border pt-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">{L("المجموع الفرعي", "Subtotal")}</span><span className="font-medium" data-ltr-number>{fmtSAR(subtotal)}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between"><span className="text-muted-foreground">{L("خصم الكوبون", "Coupon discount")}</span><span className="font-medium text-emerald-600" data-ltr-number>-{fmtSAR(discount)}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-muted-foreground">{L("ضريبة القيمة المضافة (15%)", "VAT (15%)")}</span><span className="font-medium" data-ltr-number>{fmtSAR(vat)}</span></div>
                  <div className="flex justify-between text-base font-extrabold text-primary pt-2 border-t border-border"><span>{L("الإجمالي", "Total")}</span><span data-ltr-number>{fmtSAR(viewing.total)}</span></div>
                </div>
                <div className="flex justify-between items-center">
                  <Pill tone={(bookingStatusMap[viewing.status as keyof typeof bookingStatusMap]?.tone) ?? "primary"}>{statusLabels[viewing.status] ?? viewing.status}</Pill>
                  <PrimaryButton
                    onClick={() => renderInvoiceToPdf({
                      number: viewing.number,
                      date: viewing.date,
                      clientName: viewing.client,
                      clientEmail: viewing.email,
                      clientPhone: viewing.phone,
                      clientCity: viewing.city,
                      paymentMethod: payLabel(viewing.payment),
                      paymentStatus: viewing.paymentStatus ?? "unpaid",
                      items: [{ title: viewing.service || "—", qty: 1, price: subtotal }],
                      subtotal, vat, total: viewing.total,
                    })}
                  >
                    <Download className="h-4 w-4" /> {L("تحميل PDF", "Download PDF")}
                  </PrimaryButton>
                </div>
              </div>
            );
          })()}
          <DialogFooter><GhostButton onClick={() => setViewing(null)}>{L("إغلاق", "Close")}</GhostButton></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit booking */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent dir={dir} className="max-w-lg">
          <DialogHeader><DialogTitle>{L("تعديل الطلب", "Edit order")} <span dir="ltr">#{editing?.number}</span></DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              <Lbl label={L("العميل", "Client")}><input className={ic} value={editForm.client ?? ""} onChange={e => setEditForm({ ...editForm, client: e.target.value })} /></Lbl>
              <Lbl label={L("البريد", "Email")}><input className={ic} value={editForm.email ?? ""} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></Lbl>
              <Lbl label={L("رقم الجوال", "Phone")}><input type="tel" inputMode="tel" className={ic} dir="ltr" value={editForm.phone ?? ""} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} /></Lbl>
              <Lbl label={L("المدينة", "City")}><input className={ic} value={editForm.city ?? ""} onChange={e => setEditForm({ ...editForm, city: e.target.value })} /></Lbl>
              <Lbl label={L("الخدمة", "Service")} full><input className={ic} value={editForm.service ?? ""} onChange={e => setEditForm({ ...editForm, service: e.target.value })} /></Lbl>
              <Lbl label={L("الإجمالي (ر.س)", "Total (SAR)")}><input type="number" className={ic} dir="ltr" value={editForm.total ?? 0} onChange={e => setEditForm({ ...editForm, total: Number(e.target.value) })} /></Lbl>
              <Lbl label={L("طريقة الدفع", "Payment method")}>
                <select className={ic} value={editForm.payment ?? paymentMethods[0].value} onChange={e => setEditForm({ ...editForm, payment: e.target.value })}>
                  {paymentMethods.map(p => <option key={p.value} value={p.value}>{L(p.labelAr, p.labelEn)}</option>)}
                </select>
              </Lbl>
              <Lbl label={L("المصدر", "Source")}>
                <select className={ic} value={editForm.source ?? "direct"} onChange={e => setEditForm({ ...editForm, source: e.target.value as any })}>
                  <option value="direct">{L("مباشر", "Direct")}</option><option value="partner">{L("من الشريك", "Partner")}</option>
                </select>
              </Lbl>
              <Lbl label={L("الحالة", "Status")} full>
                <select className={ic} value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}>
                  {statusKeys.map(k => <option key={k} value={k}>{statusLabels[k]}</option>)}
                </select>
              </Lbl>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setEditing(null)}>{L("إلغاء", "Cancel")}</GhostButton>
            <PrimaryButton onClick={saveEdit}>{L("حفظ التغييرات", "Save changes")}</PrimaryButton>
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
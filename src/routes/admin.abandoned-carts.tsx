import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill } from "@/components/admin/AdminLayout";
import { ShoppingCart, DollarSign, Package, Users, Search, Eye, Mail, Loader2, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api/admin";
import { fmtSAR, fmtSARNumber } from "@/data/admin";

export const Route = createFileRoute("/admin/abandoned-carts")({
  head: () => ({ meta: [{ title: "السلات المتروكة | لوحة التحكم" }] }),
  component: AbandonedCartsPage,
});

type CartItem = { serviceTitle?: string; servicetitle?: string; planName?: string | null; planname?: string | null; qty: number; price: number; lineTotal?: number };
type Cart = {
  cart_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  item_count: number;
  total_qty: number;
  subtotal: number;
  updated_at?: string;
  updatedat?: string;
  items: CartItem[];
};

function AbandonedCartsPage() {
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);

  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewing, setViewing] = useState<Cart | null>(null);
  const [remindingId, setRemindingId] = useState<string | null>(null);
  const limit = 20;

  useEffect(() => {
    const t = setTimeout(() => setSearch(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setLoading(true);
    adminApi.getAbandonedCarts({ page, limit, search })
      .then((res: any) => {
        // API can wrap as { data: { data, total, totalPages } } or { data, total, totalPages }
        const payload = res?.data?.data ? res.data : res;
        const data: Cart[] = payload?.data || [];
        setCarts(data);
        setTotal(Number(payload?.total) || data.length);
        setTotalPages(Number(payload?.totalPages) || 1);
      })
      .catch(() => {
        setCarts([]); setTotal(0); setTotalPages(1);
        toast.error(L("تعذّر تحميل السلات المتروكة", "Failed to load abandoned carts"));
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  const stats = useMemo(() => {
    const uniqueEmails = new Set(carts.map(c => (c.customer_email || "").toLowerCase()).filter(Boolean));
    return {
      total,
      value: carts.reduce((s, c) => s + (Number(c.subtotal) || 0), 0),
      items: carts.reduce((s, c) => s + (Number(c.item_count) || 0), 0),
      users: uniqueEmails.size,
    };
  }, [carts, total]);

  async function sendReminder(cart: Cart) {
    setRemindingId(cart.cart_id);
    try {
      const res = await adminApi.remindAbandonedCart(cart.cart_id);
      if (res?.success) toast.success(L("تم إرسال التذكير بنجاح ✅", "Reminder sent successfully ✅"));
      else toast.error(res?.message || L("تعذّر إرسال التذكير", "Failed to send reminder"));
    } catch (e: any) {
      toast.error(e?.message || L("تعذّر إرسال التذكير", "Failed to send reminder"));
    } finally {
      setRemindingId(null);
    }
  }

  const startSide = dir === "rtl" ? "right-3" : "left-3";
  const padStart = dir === "rtl" ? "pr-10 pl-3" : "pl-10 pr-3";
  const textAlign = dir === "rtl" ? "text-right" : "text-left";

  const fmtDate = (s: string) => {
    if (!s) return "—";
    const d = new Date(s.replace(" ", "T"));
    if (isNaN(d.getTime())) return s;
    return d.toLocaleString(lang === "en" ? "en-US" : "ar-EG", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AdminLayout title={L("السلات المتروكة", "Abandoned Carts")} subtitle={L("استرجع المبيعات الضائعة بإرسال تذكيرات للعملاء", "Recover lost sales by sending reminders to customers")}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("إجمالي السلات المتروكة", "Total Abandoned Carts")} value={stats.total} icon={ShoppingCart} accent="primary" />
        <StatCard label={L("إجمالي القيمة الإجمالية", "Total Value")} value={fmtSAR(stats.value)} icon={DollarSign} accent="emerald" />
        <StatCard label={L("إجمالي المنتجات", "Total Products")} value={stats.items} icon={Package} accent="amber" />
        <StatCard label={L("عدد المستخدمين الفريدين", "Unique Customers")} value={stats.users} icon={Users} accent="violet" />
      </div>

      <PanelCard>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-md ms-auto">
            <Search className={`absolute ${startSide} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder={L("ابحث في الجدول", "Search...")} className={`w-full rounded-xl border border-border bg-background ${padStart} py-2.5 text-sm`} />
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : carts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <Inbox className="h-10 w-10 text-muted-foreground" />
              </div>
              <h4 className="text-base font-bold mb-1">{L("لا توجد سلات متروكة حتى الآن", "No abandoned carts yet")}</h4>
              <p className="text-sm text-muted-foreground">{L("ستظهر هنا السلات التي يتركها العملاء دون إتمام الشراء", "Carts left by customers without checkout will appear here")}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className={`${textAlign} text-xs text-muted-foreground border-b border-border`}>
                  <th className="px-3 py-3 font-medium w-8"><input type="checkbox" className="rounded border-border" /></th>
                  <th className="px-3 py-3 font-medium">{L("العميل", "Customer")}</th>
                  <th className="px-3 py-3 font-medium">{L("رقم الجوال", "Phone")}</th>
                  <th className="px-3 py-3 font-medium">{L("الإيميل", "Email")}</th>
                  <th className="px-3 py-3 font-medium">{L("المنتجات", "Products")}</th>
                  <th className="px-3 py-3 font-medium">{L("عدد الخدمات", "Items")}</th>
                  <th className="px-3 py-3 font-medium">{L("إجمالي القيمة", "Total Value")}</th>
                  <th className="px-3 py-3 font-medium">{L("آخر تحديث", "Last Update")}</th>
                  <th className="px-3 py-3 font-medium">{L("الإجراءات", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {carts.map((c) => {
                  const initials = (c.customer_name || "?").trim().charAt(0).toUpperCase();
                  const firstProduct = c.items?.[0]?.serviceTitle || c.items?.[0]?.servicetitle || "—";
                  const extra = (c.items?.length || 0) - 1;
                  return (
                    <tr key={c.cart_id} className="border-b border-border hover:bg-muted/40">
                      <td className="px-3 py-3"><input type="checkbox" className="rounded border-border" /></td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">{initials}</div>
                          <div>
                            <div className="font-bold">{c.customer_name || "—"}</div>
                            <div className="text-[11px] text-muted-foreground">{c.customer_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground" dir="ltr">{c.customer_phone || "—"}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{c.customer_email || "—"}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs truncate max-w-[180px]">{firstProduct}</span>
                          {extra > 0 && <Pill tone="muted">+{extra} {L("أخرى", "more")}</Pill>}
                        </div>
                      </td>
                      <td className="px-3 py-3"><Pill tone="emerald">{c.item_count}</Pill></td>
                      <td className="px-3 py-3 font-bold text-emerald-700" data-ltr-number>{fmtSARNumber(Number(c.subtotal) || 0)} {L("ريال", "SAR")}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground" data-ltr-number>{fmtDate(c.updated_at || c.updatedat || "")}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewing(c)} title={L("عرض التفاصيل", "View details")} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted text-primary">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => sendReminder(c)} disabled={remindingId === c.cart_id} title={L("إرسال تذكير", "Send reminder")} className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60">
                            {remindingId === c.cart_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground" data-ltr-number>
              {L("صفحة", "Page")} {page} {L("من", "of")} {totalPages} — {total} {L("سلة", "carts")}
            </div>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40">
                {dir === "rtl" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40">
                {dir === "rtl" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
      </PanelCard>

      {/* Cart details dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent dir={dir} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{L("تفاصيل السلة المتروكة", "Abandoned Cart Details")}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                    {(viewing.customer_name || "?").trim().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold">{viewing.customer_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{viewing.customer_email}</div>
                    <div className="text-xs text-muted-foreground" dir="ltr">{viewing.customer_phone}</div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr className={`${textAlign} text-xs text-muted-foreground`}>
                      <th className="px-3 py-2 font-medium">{L("الخدمة", "Service")}</th>
                      <th className="px-3 py-2 font-medium">{L("الباقة", "Plan")}</th>
                      <th className="px-3 py-2 font-medium">{L("الكمية", "Qty")}</th>
                      <th className="px-3 py-2 font-medium">{L("السعر", "Unit Price")}</th>
                      <th className="px-3 py-2 font-medium">{L("الإجمالي", "Total")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewing.items.map((it, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-3 py-2">{it.serviceTitle || it.servicetitle || "—"}</td>
                        <td className="px-3 py-2 text-muted-foreground">{it.planName || it.planname || "—"}</td>
                        <td className="px-3 py-2" data-ltr-number>{it.qty}</td>
                        <td className="px-3 py-2" data-ltr-number>{fmtSARNumber(Number(it.price) || 0)} {L("ريال", "SAR")}</td>
                        <td className="px-3 py-2 font-bold text-emerald-700" data-ltr-number>{fmtSARNumber((Number(it.price) || 0) * (Number(it.qty) || 0))} {L("ريال", "SAR")}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/40 font-bold">
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-end">{L("الإجمالي الكلي", "Grand Total")}</td>
                      <td className="px-3 py-2 text-emerald-700" data-ltr-number>{fmtSARNumber(Number(viewing.subtotal) || 0)} {L("ريال", "SAR")}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => viewing && sendReminder(viewing)}
              disabled={!viewing || remindingId === viewing?.cart_id}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-dark transition disabled:opacity-60"
            >
              {remindingId === viewing?.cart_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {L("إرسال تذكير", "Send Reminder")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

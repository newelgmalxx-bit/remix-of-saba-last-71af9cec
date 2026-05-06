import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout, PanelCard, PrimaryButton, GhostButton, Pill } from "@/components/admin/AdminLayout";
import { Plus, Trash2, Save, Pencil, X, Ticket as TicketIcon, Loader2 } from "lucide-react";
import { admin } from "@/lib/api/admin";
import { useLang } from "@/i18n/LanguageProvider";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/coupons")({
  head: () => ({ meta: [{ title: "الكوبونات | لوحة التحكم" }] }),
  component: AdminCouponsPage,
});

type Coupon = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minAmount?: number | null;
  maxUses?: number | null;
  usedCount?: number;
  expiresAt?: string | null;
  active: boolean;
  description?: string | null;
};

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

function emptyCoupon(): Coupon {
  return { id: "", code: "", type: "percent", value: 10, minAmount: null, maxUses: null, expiresAt: null, active: true, description: "" };
}

function AdminCouponsPage() {
  const { lang } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const [items, setItems] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res: any = await admin.getCoupons();
      const list = res?.data?.items ?? res?.data ?? res?.items ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e: any) {
      toast.error(e?.message || L("تعذر تحميل الكوبونات", "Failed to load coupons"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.code.trim()) { toast.error(L("أدخل كود الكوبون", "Enter coupon code")); return; }
    setSaving(true);
    try {
      const body = {
        code: editing.code.trim().toUpperCase(),
        type: editing.type,
        value: Number(editing.value) || 0,
        minAmount: editing.minAmount ? Number(editing.minAmount) : null,
        maxUses: editing.maxUses ? Number(editing.maxUses) : null,
        expiresAt: editing.expiresAt || null,
        active: editing.active,
        description: editing.description || null,
      };
      if (editing.id) await admin.updateCoupon(editing.id, body);
      else await admin.createCoupon(body);
      toast.success(L("تم الحفظ", "Saved"));
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error(e?.message || L("تعذر الحفظ", "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Coupon) => {
    if (!confirm(L(`حذف الكوبون ${c.code}؟`, `Delete coupon ${c.code}?`))) return;
    try {
      await admin.deleteCoupon(c.id);
      toast.success(L("تم الحذف", "Deleted"));
      load();
    } catch (e: any) {
      toast.error(e?.message || L("تعذر الحذف", "Delete failed"));
    }
  };

  const handleToggle = async (c: Coupon) => {
    try {
      await admin.toggleCouponStatus(c.id, !c.active);
      load();
    } catch (e: any) {
      toast.error(e?.message || L("تعذر التحديث", "Update failed"));
    }
  };

  return (
    <AdminLayout
      title={L("الكوبونات", "Coupons")}
      subtitle={L("إنشاء وإدارة كوبونات الخصم", "Create and manage discount coupons")}
      action={
        <PrimaryButton onClick={() => setEditing(emptyCoupon())}>
          <Plus className="h-4 w-4" /> {L("كوبون جديد", "New coupon")}
        </PrimaryButton>
      }
    >
      <PanelCard title={L("قائمة الكوبونات", "Coupons list")}>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
              <TicketIcon className="h-6 w-6" />
            </div>
            <div className="text-sm font-bold">{L("لا توجد كوبونات بعد", "No coupons yet")}</div>
            <div className="text-xs text-muted-foreground mt-1">{L("أنشئ كوبون خصم لعملائك", "Create a discount coupon for your customers")}</div>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-start font-bold p-3">{L("الكود", "Code")}</th>
                  <th className="text-start font-bold p-3">{L("النوع", "Type")}</th>
                  <th className="text-start font-bold p-3">{L("القيمة", "Value")}</th>
                  <th className="text-start font-bold p-3">{L("الاستخدام", "Usage")}</th>
                  <th className="text-start font-bold p-3">{L("ينتهي في", "Expires")}</th>
                  <th className="text-start font-bold p-3">{L("الحالة", "Status")}</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="p-3 font-bold" dir="ltr">{c.code}</td>
                    <td className="p-3 text-xs text-muted-foreground">{c.type === "percent" ? L("نسبة", "Percent") : L("ثابت", "Fixed")}</td>
                    <td className="p-3 font-bold" dir="ltr">{c.type === "percent" ? `${c.value}%` : `${c.value} SAR`}</td>
                    <td className="p-3 text-xs" dir="ltr">{c.usedCount ?? 0}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                    <td className="p-3 text-xs text-muted-foreground" dir="ltr">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}</td>
                    <td className="p-3">
                      <button onClick={() => handleToggle(c)}>
                        <Pill tone={c.active ? "emerald" : "muted"}>
                          {c.active ? L("مفعّل", "Active") : L("متوقف", "Inactive")}
                        </Pill>
                      </button>
                    </td>
                    <td className="p-3 text-end">
                      <div className="inline-flex gap-1">
                        <button onClick={() => setEditing(c)} className="rounded-lg p-1.5 hover:bg-muted">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(c)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PanelCard>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-bold">{editing.id ? L("تعديل كوبون", "Edit coupon") : L("كوبون جديد", "New coupon")}</h3>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1.5 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <label className="block">
                <div className="mb-1.5 text-xs font-bold">{L("الكود", "Code")}</div>
                <input className={inputCls} dir="ltr" placeholder="SAVE10" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <div className="mb-1.5 text-xs font-bold">{L("نوع الخصم", "Discount type")}</div>
                  <select className={inputCls} value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as any })}>
                    <option value="percent">{L("نسبة %", "Percent %")}</option>
                    <option value="fixed">{L("مبلغ ثابت", "Fixed amount")}</option>
                  </select>
                </label>
                <label className="block">
                  <div className="mb-1.5 text-xs font-bold">{L("القيمة", "Value")}</div>
                  <input className={inputCls} dir="ltr" type="number" value={editing.value} onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <div className="mb-1.5 text-xs font-bold">{L("أقل مبلغ (اختياري)", "Min amount (optional)")}</div>
                  <input className={inputCls} dir="ltr" type="number" value={editing.minAmount ?? ""} onChange={(e) => setEditing({ ...editing, minAmount: e.target.value ? Number(e.target.value) : null })} />
                </label>
                <label className="block">
                  <div className="mb-1.5 text-xs font-bold">{L("الحد الأقصى للاستخدام", "Max uses")}</div>
                  <input className={inputCls} dir="ltr" type="number" placeholder="∞" value={editing.maxUses ?? ""} onChange={(e) => setEditing({ ...editing, maxUses: e.target.value ? Number(e.target.value) : null })} />
                </label>
              </div>
              <label className="block">
                <div className="mb-1.5 text-xs font-bold">{L("تاريخ الانتهاء (اختياري)", "Expiry date (optional)")}</div>
                <input className={inputCls} dir="ltr" type="date" value={editing.expiresAt ? editing.expiresAt.slice(0, 10) : ""} onChange={(e) => setEditing({ ...editing, expiresAt: e.target.value || null })} />
              </label>
              <label className="block">
                <div className="mb-1.5 text-xs font-bold">{L("وصف (اختياري)", "Description (optional)")}</div>
                <textarea rows={2} className={inputCls} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                <span className="text-sm">{L("الكوبون مفعّل", "Coupon active")}</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
              <GhostButton onClick={() => setEditing(null)}>{L("إلغاء", "Cancel")}</GhostButton>
              <PrimaryButton onClick={handleSave}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {L("حفظ", "Save")}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
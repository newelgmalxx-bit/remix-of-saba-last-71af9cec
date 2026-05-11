import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, PanelCard, PrimaryButton, GhostButton, Pill, StatCard } from "@/components/admin/AdminLayout";
import { Plus, Trash2, Save, Star, Eye, Pencil, Tag, CheckCircle2, X } from "lucide-react";
import { usePlans, type Plan } from "@/hooks/usePlans";
import { useLang } from "@/i18n/LanguageProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/plans")({
  head: () => ({ meta: [{ title: "الباقات والأسعار | لوحة التحكم" }] }),
  component: AdminPlansPage,
});

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

const emptyPlan = (): Plan => ({
  id: `p_${Date.now()}`,
  name: "",
  nameEn: "",
  price: "",
  originalPrice: "",
  featured: false,
  badge: "",
  badgeEn: "",
  description: "",
  descriptionEn: "",
  feats: [""],
  featsEn: [""],
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-bold text-foreground/80">{label}</div>
      {children}
    </label>
  );
}

function AdminPlansPage() {
  const { lang, dir } = useLang();
  const isAr = lang !== "en";
  const L = (a: string, e: string) => (isAr ? a : e);
  const { plans, save } = usePlans({ source: "admin" });
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Plan>(emptyPlan());

  const openAdd = () => { setEditId(null); setForm(emptyPlan()); setOpen(true); };
  const openEdit = (p: Plan) => {
    setEditId(p.id);
    setForm({
      ...p,
      feats: p.feats?.length ? [...p.feats] : [""],
      featsEn: p.featsEn?.length ? [...p.featsEn] : (p.feats?.map(() => "") ?? [""]),
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() && !form.nameEn?.trim()) {
      toast.error(L("اسم الباقة مطلوب", "Plan name is required"));
      return;
    }
    const cleaned: Plan = {
      ...form,
      feats: (form.feats || []).filter((f) => f.trim()),
      featsEn: (form.featsEn || []).filter((f) => f.trim()),
    };
    let next: Plan[];
    if (editId) {
      next = plans.map((p) => (p.id === editId ? { ...cleaned, id: editId } : p));
    } else {
      next = [...plans, { ...cleaned, id: cleaned.id || `p_${Date.now()}` }];
    }
    save(next);
    setOpen(false);
    toast.success(editId ? L("تم تحديث الباقة", "Plan updated") : L("تم إضافة الباقة", "Plan added"));
  };

  const handleDelete = (id: string) => {
    if (!confirm(L("متأكد من حذف الباقة؟", "Confirm delete?"))) return;
    save(plans.filter((p) => p.id !== id));
    toast.success(L("تم حذف الباقة", "Plan deleted"));
  };

  const toggleFeatured = (id: string) => {
    save(plans.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));
  };

  const fmt = (v?: string) => {
    const n = parseInt((v || "").replace(/[^\d]/g, ""), 10);
    return n ? n.toLocaleString() : "—";
  };

  const updateForm = (patch: Partial<Plan>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <AdminLayout
      title={L("الباقات والأسعار", "Plans & Pricing")}
      subtitle={L("إدارة الباقات اللي تظهر في صفحة الباقات العامة", "Manage the plans shown on the public plans page")}
      action={
        <div className="hidden sm:flex gap-2">
          <Link to={"/plans" as any}><GhostButton><Eye className="h-4 w-4" /> {L("معاينة", "Preview")}</GhostButton></Link>
          <PrimaryButton onClick={openAdd}><Plus className="h-4 w-4" /> {L("إضافة باقة", "Add plan")}</PrimaryButton>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("إجمالي الباقات", "Total plans")} value={plans.length} icon={Tag} accent="primary" />
        <StatCard label={L("الباقات المميزة", "Featured")} value={plans.filter(p => p.featured).length} icon={Star} accent="amber" />
        <StatCard label={L("بخصومات", "With discount")} value={plans.filter(p => p.originalPrice && p.price && parseInt(p.originalPrice.replace(/[^\d]/g,""),10) > parseInt(p.price.replace(/[^\d]/g,""),10)).length} icon={CheckCircle2} accent="emerald" />
        <StatCard label={L("بدون مميزات", "No features")} value={plans.filter(p => !p.feats?.length).length} icon={X} accent="muted" />
      </div>

      <PanelCard>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className={`${isAr ? "text-right" : "text-left"} text-xs text-muted-foreground border-b border-border`}>
                <th className="px-3 py-3 font-medium">{L("الباقة", "Plan")}</th>
                <th className="px-3 py-3 font-medium">{L("السعر", "Price")}</th>
                <th className="px-3 py-3 font-medium">{L("قبل الخصم", "Original")}</th>
                <th className="px-3 py-3 font-medium">{L("المميزات", "Features")}</th>
                <th className="px-3 py-3 font-medium">{L("الحالة", "Status")}</th>
                <th className="px-3 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${p.featured ? "bg-primary/15 text-primary" : "bg-muted text-foreground/60"}`}>
                        <Tag className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {isAr ? p.name : (p.nameEn || p.name)}
                          {p.badge && isAr && <span className="text-[10px] rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 font-bold">{p.badge}</span>}
                          {p.badgeEn && !isAr && <span className="text-[10px] rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 font-bold">{p.badgeEn}</span>}
                        </div>
                        <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-[280px]">
                          {isAr ? (p.description || p.nameEn) : (p.descriptionEn || p.name)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-bold" data-ltr-number>{fmt(p.price)} {L("ر.س", "SAR")}</td>
                  <td className="px-3 py-3 text-muted-foreground" data-ltr-number>
                    {p.originalPrice ? <span className="line-through">{fmt(p.originalPrice)} {L("ر.س", "SAR")}</span> : "—"}
                  </td>
                  <td className="px-3 py-3" data-ltr-number>{p.feats?.length ?? 0}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => toggleFeatured(p.id)} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${p.featured ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/60"}`}>
                      <Star className="h-3 w-3" /> {p.featured ? L("مميزة", "Featured") : L("عادية", "Regular")}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} title={L("تعديل", "Edit")} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-primary">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} title={L("حذف", "Delete")} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!plans.length && (
                <tr><td colSpan={6} className="px-3 py-12 text-center text-muted-foreground">{L("لا توجد باقات بعد. اضغط إضافة باقة.", "No plans yet. Click Add plan.")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </PanelCard>

      <div className="flex sm:hidden gap-2 sticky bottom-4 mt-4">
        <PrimaryButton onClick={openAdd}><Plus className="h-4 w-4" /> {L("إضافة باقة", "Add plan")}</PrimaryButton>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir={dir} className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? L("تعديل الباقة", "Edit plan") : L("إضافة باقة جديدة", "Add new plan")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label={L("الاسم (عربي)", "Name (Arabic)")}>
                <input className={inputCls} value={form.name} onChange={(e) => updateForm({ name: e.target.value })} />
              </Field>
              <Field label={L("الاسم (English)", "Name (English)")}>
                <input className={inputCls} dir="ltr" value={form.nameEn ?? ""} onChange={(e) => updateForm({ nameEn: e.target.value })} />
              </Field>
              <Field label={L("السعر بعد الخصم (ر.س)", "Sale price (SAR)")}>
                <input className={inputCls} dir="ltr" value={form.price} onChange={(e) => updateForm({ price: e.target.value })} />
              </Field>
              <Field label={L("السعر قبل الخصم", "Original price")}>
                <input className={inputCls} dir="ltr" placeholder={L("اختياري", "Optional")} value={form.originalPrice ?? ""} onChange={(e) => updateForm({ originalPrice: e.target.value })} />
              </Field>
              <Field label={L("الشارة (عربي)", "Badge (Arabic)")}>
                <input className={inputCls} placeholder={L("مثال: الأكثر طلباً", "e.g. Most popular")} value={form.badge ?? ""} onChange={(e) => updateForm({ badge: e.target.value })} />
              </Field>
              <Field label={L("الشارة (English)", "Badge (English)")}>
                <input className={inputCls} dir="ltr" placeholder="e.g. Most popular" value={form.badgeEn ?? ""} onChange={(e) => updateForm({ badgeEn: e.target.value })} />
              </Field>
            </div>
            <Field label={L("الوصف المختصر (عربي)", "Short description (Arabic)")}>
              <textarea rows={2} className={inputCls} value={form.description ?? ""} onChange={(e) => updateForm({ description: e.target.value })} />
            </Field>
            <Field label={L("الوصف المختصر (English)", "Short description (English)")}>
              <textarea rows={2} className={inputCls} dir="ltr" value={form.descriptionEn ?? ""} onChange={(e) => updateForm({ descriptionEn: e.target.value })} />
            </Field>

            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
              <input type="checkbox" checked={!!form.featured} onChange={(e) => updateForm({ featured: e.target.checked })} className="h-4 w-4" />
              <Star className="h-4 w-4 text-amber-500" /> {L("باقة مميزة", "Mark as featured")}
            </label>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground/80">{L("المميزات", "Features")}</span>
                <button
                  onClick={() => updateForm({
                    feats: [...(form.feats || []), ""],
                    featsEn: [...(form.featsEn || (form.feats || []).map(() => "")), ""],
                  })}
                  className="text-[11px] text-primary font-bold inline-flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> {L("إضافة ميزة", "Add feature")}
                </button>
              </div>
              <div className="space-y-2">
                {(form.feats || []).map((f, fi) => (
                  <div key={fi} className="grid grid-cols-[1fr_1fr_auto] gap-1.5">
                    <input
                      className={inputCls + " text-xs"}
                      placeholder={L("ميزة (عربي)", "Feature (Arabic)")}
                      value={f}
                      onChange={(e) => {
                        const feats = [...(form.feats || [])]; feats[fi] = e.target.value; updateForm({ feats });
                      }}
                    />
                    <input
                      className={inputCls + " text-xs"}
                      dir="ltr"
                      placeholder={L("ميزة (English)", "Feature (English)")}
                      value={(form.featsEn ?? [])[fi] ?? ""}
                      onChange={(e) => {
                        const featsEn = [...(form.featsEn ?? (form.feats || []).map(() => ""))];
                        featsEn[fi] = e.target.value;
                        updateForm({ featsEn });
                      }}
                    />
                    <button
                      onClick={() => updateForm({
                        feats: (form.feats || []).filter((_, x) => x !== fi),
                        featsEn: (form.featsEn || []).filter((_, x) => x !== fi),
                      })}
                      className="shrink-0 text-rose-500 hover:bg-rose-50 rounded-lg p-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <GhostButton onClick={() => setOpen(false)}>{L("إلغاء", "Cancel")}</GhostButton>
            <PrimaryButton onClick={handleSave}><Save className="h-4 w-4" /> {L("حفظ", "Save")}</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

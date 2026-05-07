import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, PanelCard, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { Plus, Trash2, Save, RotateCcw, Star, Eye, CheckCircle2 } from "lucide-react";
import { usePlans, type Plan, defaultPlans } from "@/hooks/usePlans";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/admin/plans")({
  head: () => ({ meta: [{ title: "الباقات والأسعار | لوحة التحكم" }] }),
  component: AdminPlansPage,
});

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-bold text-foreground/80">{label}</div>
      {children}
    </label>
  );
}

function AdminPlansPage() {
  const { lang } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const { plans: stored, save, reset } = usePlans({ source: "admin" });
  const [plans, setPlans] = useState<Plan[]>(stored);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => { setPlans(stored); }, [stored]);

  const handleSave = () => {
    save(plans);
    setSavedAt(new Date().toLocaleTimeString(lang === "en" ? "en-US" : "ar-SA"));
  };
  const handleReset = () => {
    reset();
    setPlans(defaultPlans);
    setSavedAt(null);
  };
  const update = (i: number, patch: Partial<Plan>) => {
    const n = [...plans]; n[i] = { ...n[i], ...patch }; setPlans(n);
  };
  const addPlan = () => setPlans([...plans, { id: `p_${Date.now()}`, name: "باقة جديدة", nameEn: "New Plan", price: "0", originalPrice: "", featured: false, badge: "", badgeEn: "", description: "", descriptionEn: "", feats: [""], featsEn: [""] }]);
  const removePlan = (i: number) => setPlans(plans.filter((_, x) => x !== i));

  const discountPct = (p: Plan) => {
    const cur = parseInt((p.price || "").replace(/[^\d]/g, ""), 10) || 0;
    const orig = parseInt((p.originalPrice || "").replace(/[^\d]/g, ""), 10) || 0;
    if (!orig || !cur || orig <= cur) return 0;
    return Math.round(((orig - cur) / orig) * 100);
  };

  return (
    <AdminLayout
      title={L("الباقات والأسعار", "Plans & Pricing")}
      subtitle={L("أضف وعدّل الباقات التي تظهر في صفحة الباقات العامة", "Add and edit the plans shown on the public plans page")}
      action={
        <div className="hidden sm:flex gap-2">
          <Link to={"/plans" as any}><GhostButton><Eye className="h-4 w-4" /> {L("معاينة", "Preview")}</GhostButton></Link>
          <GhostButton onClick={handleReset}><RotateCcw className="h-4 w-4" /> {L("استعادة", "Reset")}</GhostButton>
          <PrimaryButton onClick={handleSave}><Save className="h-4 w-4" /> {L("حفظ", "Save")}</PrimaryButton>
        </div>
      }
    >
      {savedAt && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> {L("تم حفظ التعديلات في", "Changes saved at")} {savedAt}
        </div>
      )}

      <PanelCard
        title={L("قائمة الباقات", "Plans list")}
        action={
          <button onClick={addPlan} className="text-xs text-primary font-bold inline-flex items-center gap-1">
            <Plus className="h-3 w-3" /> {L("إضافة باقة", "Add plan")}
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          {plans.map((p, pi) => (
            <div key={p.id} className={`rounded-2xl border p-4 space-y-3 ${p.featured ? "border-primary bg-primary/5" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => update(pi, { featured: !p.featured })}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold ${p.featured ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/60"}`}
                >
                  <Star className="h-3 w-3" /> {p.featured ? L("مميزة", "Featured") : L("عادية", "Regular")}
                </button>
                <button onClick={() => removePlan(pi)} className="text-rose-500 hover:bg-rose-50 rounded-lg p-1.5">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label={L("اسم الباقة (عربي)", "Plan name (Arabic)")}><input className={inputCls} value={p.name} onChange={(e) => update(pi, { name: e.target.value })} /></Field>
                <Field label={L("اسم الباقة (English)", "Plan name (English)")}><input className={inputCls} dir="ltr" value={p.nameEn ?? ""} onChange={(e) => update(pi, { nameEn: e.target.value })} /></Field>
                <Field label={L("السعر بعد الخصم (ر.س)", "Sale price (SAR)")}><input className={inputCls} dir="ltr" value={p.price} onChange={(e) => update(pi, { price: e.target.value })} /></Field>
                <Field label={L("السعر قبل الخصم (اختياري)", "Original price (optional)")}>
                  <input className={inputCls} dir="ltr" placeholder={L("اتركه فارغ لو مفيش خصم", "Leave empty if no discount")} value={p.originalPrice ?? ""} onChange={(e) => update(pi, { originalPrice: e.target.value })} />
                </Field>
              </div>
              {discountPct(p) > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-[11px] font-bold text-rose-600">
                  🔥 {L("خصم", "Discount")}: <span dir="ltr">-{discountPct(p)}%</span>
                  <span className="text-muted-foreground font-normal mx-2">|</span>
                  <span className="text-foreground/70 font-normal">{L("توفير", "You save")}:</span>
                  <span dir="ltr">{(parseInt((p.originalPrice||"").replace(/[^\d]/g,""),10) - parseInt((p.price||"").replace(/[^\d]/g,""),10)).toLocaleString()} {L("ر.س", "SAR")}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Field label={L("الشارة (عربي)", "Badge (Arabic)")}><input className={inputCls} placeholder={L("مثال: الأكثر طلباً", "e.g. Most popular")} value={p.badge ?? ""} onChange={(e) => update(pi, { badge: e.target.value })} /></Field>
                <Field label={L("الشارة (English)", "Badge (English)")}><input className={inputCls} dir="ltr" placeholder="e.g. Most popular" value={p.badgeEn ?? ""} onChange={(e) => update(pi, { badgeEn: e.target.value })} /></Field>
              </div>
              <Field label={L("الوصف المختصر (عربي)", "Short description (Arabic)")}><textarea rows={2} className={inputCls} value={p.description ?? ""} onChange={(e) => update(pi, { description: e.target.value })} /></Field>
              <Field label={L("الوصف المختصر (English)", "Short description (English)")}><textarea rows={2} className={inputCls} dir="ltr" value={p.descriptionEn ?? ""} onChange={(e) => update(pi, { descriptionEn: e.target.value })} /></Field>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground/80">{L("المميزات", "Features")}</span>
                  <button onClick={() => update(pi, { feats: [...p.feats, ""], featsEn: [...(p.featsEn ?? p.feats.map(()=>"")) , ""] })} className="text-[11px] text-primary font-bold inline-flex items-center gap-1">
                    <Plus className="h-3 w-3" /> {L("إضافة", "Add")}
                  </button>
                </div>
                <div className="space-y-2">
                  {p.feats.map((f, fi) => (
                    <div key={fi} className="grid grid-cols-[1fr_1fr_auto] gap-1.5">
                      <input
                        className={inputCls + " text-xs"}
                        placeholder={L("ميزة (عربي)", "Feature (Arabic)")}
                        value={f}
                        onChange={(e) => {
                          const feats = [...p.feats]; feats[fi] = e.target.value; update(pi, { feats });
                        }}
                      />
                      <input
                        className={inputCls + " text-xs"}
                        dir="ltr"
                        placeholder={L("ميزة (English)", "Feature (English)")}
                        value={(p.featsEn ?? [])[fi] ?? ""}
                        onChange={(e) => {
                          const featsEn = [...(p.featsEn ?? p.feats.map(()=>"")) ];
                          featsEn[fi] = e.target.value;
                          update(pi, { featsEn });
                        }}
                      />
                      <button
                        onClick={() => {
                          const feats = p.feats.filter((_, x) => x !== fi);
                          const featsEn = (p.featsEn ?? []).filter((_, x) => x !== fi);
                          update(pi, { feats, featsEn });
                        }}
                        className="shrink-0 text-rose-500 hover:bg-rose-50 rounded-lg p-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </PanelCard>

      <div className="flex sm:hidden gap-2 sticky bottom-4 mt-4">
        <GhostButton onClick={handleReset}><RotateCcw className="h-4 w-4" /> {L("استعادة", "Reset")}</GhostButton>
        <PrimaryButton onClick={handleSave}><Save className="h-4 w-4" /> {L("حفظ", "Save")}</PrimaryButton>
      </div>
    </AdminLayout>
  );
}
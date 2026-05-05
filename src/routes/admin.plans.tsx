import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, PanelCard, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { Plus, Trash2, Save, RotateCcw, Star, Eye, CheckCircle2 } from "lucide-react";
import { usePlans, type Plan, defaultPlans } from "@/hooks/usePlans";

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
  const { plans: stored, save, reset } = usePlans();
  const [plans, setPlans] = useState<Plan[]>(stored);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => { setPlans(stored); }, [stored]);

  const handleSave = () => {
    save(plans);
    setSavedAt(new Date().toLocaleTimeString("ar-SA"));
  };
  const handleReset = () => {
    reset();
    setPlans(defaultPlans);
    setSavedAt(null);
  };
  const update = (i: number, patch: Partial<Plan>) => {
    const n = [...plans]; n[i] = { ...n[i], ...patch }; setPlans(n);
  };
  const addPlan = () => setPlans([...plans, { id: `p_${Date.now()}`, name: "باقة جديدة", price: "0", featured: false, badge: "", description: "", feats: [""] }]);
  const removePlan = (i: number) => setPlans(plans.filter((_, x) => x !== i));

  return (
    <AdminLayout
      title="الباقات والأسعار"
      subtitle="أضف وعدّل الباقات التي تظهر في صفحة الباقات العامة"
      action={
        <div className="hidden sm:flex gap-2">
          <Link to={"/plans" as any}><GhostButton><Eye className="h-4 w-4" /> معاينة</GhostButton></Link>
          <GhostButton onClick={handleReset}><RotateCcw className="h-4 w-4" /> استعادة</GhostButton>
          <PrimaryButton onClick={handleSave}><Save className="h-4 w-4" /> حفظ</PrimaryButton>
        </div>
      }
    >
      {savedAt && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> تم حفظ التعديلات في {savedAt}
        </div>
      )}

      <PanelCard
        title="قائمة الباقات"
        action={
          <button onClick={addPlan} className="text-xs text-primary font-bold inline-flex items-center gap-1">
            <Plus className="h-3 w-3" /> إضافة باقة
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
                  <Star className="h-3 w-3" /> {p.featured ? "مميزة" : "عادية"}
                </button>
                <button onClick={() => removePlan(pi)} className="text-rose-500 hover:bg-rose-50 rounded-lg p-1.5">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="اسم الباقة"><input className={inputCls} value={p.name} onChange={(e) => update(pi, { name: e.target.value })} /></Field>
                <Field label="السعر (ر.س)"><input className={inputCls} value={p.price} onChange={(e) => update(pi, { price: e.target.value })} /></Field>
              </div>
              <Field label="الشارة (اختياري)"><input className={inputCls} placeholder="مثال: الأكثر طلباً" value={p.badge ?? ""} onChange={(e) => update(pi, { badge: e.target.value })} /></Field>
              <Field label="الوصف المختصر"><textarea rows={2} className={inputCls} value={p.description ?? ""} onChange={(e) => update(pi, { description: e.target.value })} /></Field>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground/80">المميزات</span>
                  <button onClick={() => update(pi, { feats: [...p.feats, ""] })} className="text-[11px] text-primary font-bold inline-flex items-center gap-1">
                    <Plus className="h-3 w-3" /> إضافة
                  </button>
                </div>
                <div className="space-y-2">
                  {p.feats.map((f, fi) => (
                    <div key={fi} className="flex gap-1.5">
                      <input
                        className={inputCls + " text-xs"}
                        value={f}
                        onChange={(e) => {
                          const feats = [...p.feats]; feats[fi] = e.target.value; update(pi, { feats });
                        }}
                      />
                      <button
                        onClick={() => update(pi, { feats: p.feats.filter((_, x) => x !== fi) })}
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
        <GhostButton onClick={handleReset}><RotateCcw className="h-4 w-4" /> استعادة</GhostButton>
        <PrimaryButton onClick={handleSave}><Save className="h-4 w-4" /> حفظ</PrimaryButton>
      </div>
    </AdminLayout>
  );
}
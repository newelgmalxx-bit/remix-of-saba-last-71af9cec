import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AdminLayout, PanelCard, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { ArrowRight, Plus, Trash2, RotateCcw, Save, Eye, Star, CheckCircle2 } from "lucide-react";
import { serviceMap } from "@/data/services";
import { mergeService, useServiceOverrideEditor, type ServiceOverride } from "@/hooks/useServiceContent";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/services/$slug")({
  head: () => ({ meta: [{ title: "تعديل الخدمة | لوحة التحكم" }] }),
  component: ServiceEditorPage,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-bold text-foreground/80">{label}</div>
      {children}
    </label>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

function ServiceEditorPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { override, save, reset } = useServiceOverrideEditor(slug);
  const base = serviceMap[slug];
  const initial = useMemo(() => mergeService(slug, override) ?? base, [slug, override, base]);
  const isCustom = !base && !!initial;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [breadcrumb, setBreadcrumb] = useState(initial?.breadcrumb ?? "");
  const [heroHighlights, setHeroHighlights] = useState<string[]>(initial?.heroHighlights ?? []);
  const [overview, setOverview] = useState(initial?.overview.map(o => ({ title: o.title, desc: o.desc })) ?? []);
  const [benefits, setBenefits] = useState(initial?.benefits.map(b => ({ title: b.title, desc: b.desc })) ?? []);
  const [plans, setPlans] = useState(initial?.plans.map(p => ({ ...p, feats: [...p.feats] })) ?? []);
  const [steps, setSteps] = useState<{ title: string }[]>(
    initial?.steps?.map(s => ({ title: s.title })) ?? [
      { title: "فهم المتطلبات" }, { title: "تحليل وتجهيز الفكرة" }, { title: "التصميم الأولي" }, { title: "المراجعة والتعديل" }, { title: "التسليم النهائي" },
    ]
  );
  const [stats, setStats] = useState<{ v: string; l: string }[]>(
    initial?.stats ?? [
      { v: "+260", l: "عدد المشاريع المنفذة" }, { v: "98%", l: "نسبة رضا العملاء" }, { v: "14 يوم", l: "متوسط مدة التسليم" }, { v: "+180", l: "عدد العملاء" },
    ]
  );
  const [testimonials, setTestimonials] = useState<{ name: string; role: string; text: string }[]>(
    initial?.testimonials ?? []
  );
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(
    initial?.faqs ?? [
      { q: "كم يستغرق تنفيذ الخدمة؟", a: "بين 2 إلى 4 أسابيع حسب حجم المشروع." },
    ]
  );
  const [savedAt, setSavedAt] = useState<string | null>(null);

  if (!base && !initial) {
    return (
      <AdminLayout title="خدمة غير موجودة">
        <PanelCard>
          <p className="text-sm text-muted-foreground mb-4">لا توجد خدمة بهذا المعرّف.</p>
          <Link to="/admin/services"><GhostButton>عودة للخدمات</GhostButton></Link>
        </PanelCard>
      </AdminLayout>
    );
  }

  const handleSave = () => {
    const next: ServiceOverride = { title, subtitle, category, breadcrumb, heroHighlights, overview, benefits, plans, steps, stats, testimonials, faqs, isCustom: isCustom || override?.isCustom };
    save(next);
    setSavedAt(new Date().toLocaleTimeString("ar-SA"));
  };

  const handleReset = () => {
    if (!base) { toast.info("لا توجد نسخة افتراضية لاستعادتها"); return; }
    reset();
    setTitle(base.title);
    setSubtitle(base.subtitle);
    setCategory(base.category);
    setBreadcrumb(base.breadcrumb);
    setHeroHighlights(base.heroHighlights);
    setOverview(base.overview.map(o => ({ title: o.title, desc: o.desc })));
    setBenefits(base.benefits.map(b => ({ title: b.title, desc: b.desc })));
    setPlans(base.plans.map(p => ({ ...p, feats: [...p.feats] })));
    setSteps(base.steps?.map(s => ({ title: s.title })) ?? []);
    setStats(base.stats ?? []);
    setTestimonials(base.testimonials ?? []);
    setFaqs(base.faqs ?? []);
    setSavedAt(null);
  };

  return (
    <AdminLayout
      title={`تعديل: ${initial?.title ?? slug}`}
      subtitle="تحديث جميع تفاصيل الخدمة التي تظهر في صفحة التفاصيل"
      action={
        <div className="hidden sm:flex gap-2">
          <Link to="/services/$slug" params={{ slug }}>
            <GhostButton><Eye className="h-4 w-4" /> معاينة</GhostButton>
          </Link>
          <GhostButton onClick={handleReset}><RotateCcw className="h-4 w-4" /> استعادة</GhostButton>
          <PrimaryButton onClick={handleSave}><Save className="h-4 w-4" /> حفظ</PrimaryButton>
        </div>
      }
    >
      <button onClick={() => navigate({ to: "/admin/services" })} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowRight className="h-4 w-4" /> رجوع لقائمة الخدمات
      </button>

      {savedAt && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> تم حفظ التعديلات في {savedAt}
        </div>
      )}

      <div className="grid gap-6">
        {/* Basic */}
        <PanelCard title="المعلومات الأساسية">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="عنوان الخدمة"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
            <Field label="مسار العرض (Breadcrumb)"><input className={inputCls} value={breadcrumb} onChange={(e) => setBreadcrumb(e.target.value)} /></Field>
            <Field label="التصنيف"><input className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} /></Field>
            <Field label="المعرّف (slug)"><input className={inputCls} value={slug} disabled /></Field>
            <div className="md:col-span-2">
              <Field label="الوصف المختصر"><textarea rows={3} className={inputCls} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></Field>
            </div>
          </div>
        </PanelCard>

        {/* Hero highlights */}
        <PanelCard title="نقاط الـ Hero" action={
          <button onClick={() => setHeroHighlights([...heroHighlights, ""])} className="text-xs text-primary font-bold inline-flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة نقطة</button>
        }>
          <div className="space-y-2">
            {heroHighlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input className={inputCls} value={h} onChange={(e) => { const n = [...heroHighlights]; n[i] = e.target.value; setHeroHighlights(n); }} />
                <button onClick={() => setHeroHighlights(heroHighlights.filter((_, x) => x !== i))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Overview */}
        <PanelCard title="نظرة عامة (3 بطاقات)">
          <div className="grid gap-4 md:grid-cols-3">
            {overview.map((o, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <Field label={`عنوان ${i + 1}`}><input className={inputCls} value={o.title} onChange={(e) => { const n = [...overview]; n[i] = { ...n[i], title: e.target.value }; setOverview(n); }} /></Field>
                <Field label="الوصف"><textarea rows={3} className={inputCls} value={o.desc} onChange={(e) => { const n = [...overview]; n[i] = { ...n[i], desc: e.target.value }; setOverview(n); }} /></Field>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Benefits */}
        <PanelCard title="المميزات" action={
          <span className="text-xs text-muted-foreground">يُنصح بإبقاء العدد كما هو للحفاظ على الأيقونات</span>
        }>
          <div className="grid gap-4 md:grid-cols-2">
            {benefits.map((b, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <Field label={`ميزة ${i + 1}`}><input className={inputCls} value={b.title} onChange={(e) => { const n = [...benefits]; n[i] = { ...n[i], title: e.target.value }; setBenefits(n); }} /></Field>
                <Field label="الوصف"><textarea rows={2} className={inputCls} value={b.desc} onChange={(e) => { const n = [...benefits]; n[i] = { ...n[i], desc: e.target.value }; setBenefits(n); }} /></Field>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Plans */}
        <PanelCard title="الباقات والأسعار" action={
          <button onClick={() => setPlans([...plans, { name: "باقة جديدة", price: "0", featured: false, feats: [""] }])} className="text-xs text-primary font-bold inline-flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة باقة</button>
        }>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((p, pi) => (
              <div key={pi} className={`rounded-2xl border p-4 space-y-3 ${p.featured ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex items-center justify-between">
                  <button onClick={() => { const n = [...plans]; n[pi] = { ...n[pi], featured: !n[pi].featured }; setPlans(n); }} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold ${p.featured ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/60"}`}>
                    <Star className="h-3 w-3" /> {p.featured ? "مميزة" : "عادية"}
                  </button>
                  <button onClick={() => setPlans(plans.filter((_, x) => x !== pi))} className="text-rose-500 hover:bg-rose-50 rounded-lg p-1.5"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <Field label="اسم الباقة"><input className={inputCls} value={p.name} onChange={(e) => { const n = [...plans]; n[pi] = { ...n[pi], name: e.target.value }; setPlans(n); }} /></Field>
                <Field label="السعر (ر.س)"><input className={inputCls} value={p.price} onChange={(e) => { const n = [...plans]; n[pi] = { ...n[pi], price: e.target.value }; setPlans(n); }} /></Field>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground/80">المميزات</span>
                    <button onClick={() => { const n = [...plans]; n[pi] = { ...n[pi], feats: [...n[pi].feats, ""] }; setPlans(n); }} className="text-[11px] text-primary font-bold inline-flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة</button>
                  </div>
                  <div className="space-y-2">
                    {p.feats.map((f, fi) => (
                      <div key={fi} className="flex gap-1.5">
                        <input className={inputCls + " text-xs"} value={f} onChange={(e) => { const n = [...plans]; const feats = [...n[pi].feats]; feats[fi] = e.target.value; n[pi] = { ...n[pi], feats }; setPlans(n); }} />
                        <button onClick={() => { const n = [...plans]; n[pi] = { ...n[pi], feats: n[pi].feats.filter((_, x) => x !== fi) }; setPlans(n); }} className="shrink-0 text-rose-500 hover:bg-rose-50 rounded-lg p-2"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Mobile actions */}
        {/* Steps */}
        <PanelCard title="خطوات العمل" action={
          <button onClick={() => setSteps([...steps, { title: "" }])} className="text-xs text-primary font-bold inline-flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة خطوة</button>
        }>
          <div className="grid gap-3 md:grid-cols-2">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                <input className={inputCls} value={s.title} onChange={(e) => { const n = [...steps]; n[i] = { title: e.target.value }; setSteps(n); }} />
                <button onClick={() => setSteps(steps.filter((_, x) => x !== i))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Stats */}
        <PanelCard title="أرقام تعكس الثقة" action={
          <button onClick={() => setStats([...stats, { v: "", l: "" }])} className="text-xs text-primary font-bold inline-flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة رقم</button>
        }>
          <div className="grid gap-3 md:grid-cols-2">
            {stats.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
                <Field label="القيمة"><input className={inputCls} value={s.v} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], v: e.target.value }; setStats(n); }} /></Field>
                <Field label="الوصف"><input className={inputCls} value={s.l} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], l: e.target.value }; setStats(n); }} /></Field>
                <button onClick={() => setStats(stats.filter((_, x) => x !== i))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Testimonials */}
        <PanelCard title="آراء العملاء" action={
          <button onClick={() => setTestimonials([...testimonials, { name: "", role: "", text: "" }])} className="text-xs text-primary font-bold inline-flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة رأي</button>
        }>
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="الاسم"><input className={inputCls} value={t.name} onChange={(e) => { const n = [...testimonials]; n[i] = { ...n[i], name: e.target.value }; setTestimonials(n); }} /></Field>
                  <Field label="المسمى"><input className={inputCls} value={t.role} onChange={(e) => { const n = [...testimonials]; n[i] = { ...n[i], role: e.target.value }; setTestimonials(n); }} /></Field>
                </div>
                <Field label="النص"><textarea rows={2} className={inputCls} value={t.text} onChange={(e) => { const n = [...testimonials]; n[i] = { ...n[i], text: e.target.value }; setTestimonials(n); }} /></Field>
                <button onClick={() => setTestimonials(testimonials.filter((_, x) => x !== i))} className="text-xs text-rose-500 inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> حذف</button>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* FAQs */}
        <PanelCard title="الأسئلة الشائعة" action={
          <button onClick={() => setFaqs([...faqs, { q: "", a: "" }])} className="text-xs text-primary font-bold inline-flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة سؤال</button>
        }>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <Field label="السؤال"><input className={inputCls} value={f.q} onChange={(e) => { const n = [...faqs]; n[i] = { ...n[i], q: e.target.value }; setFaqs(n); }} /></Field>
                <Field label="الإجابة"><textarea rows={2} className={inputCls} value={f.a} onChange={(e) => { const n = [...faqs]; n[i] = { ...n[i], a: e.target.value }; setFaqs(n); }} /></Field>
                <button onClick={() => setFaqs(faqs.filter((_, x) => x !== i))} className="text-xs text-rose-500 inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> حذف</button>
              </div>
            ))}
          </div>
        </PanelCard>

        <div className="flex sm:hidden gap-2 sticky bottom-4">
          <GhostButton onClick={handleReset}><RotateCcw className="h-4 w-4" /> استعادة</GhostButton>
          <PrimaryButton onClick={handleSave}><Save className="h-4 w-4" /> حفظ</PrimaryButton>
        </div>
      </div>
    </AdminLayout>
  );
}
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { AdminLayout, PanelCard, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { ArrowRight, Plus, Trash2, RotateCcw, Save, Eye, CheckCircle2 } from "lucide-react";
import { serviceMap } from "@/data/services";
import { mergeService, useServiceOverrideEditor, type ServiceOverride } from "@/hooks/useServiceContent";
import { toast } from "sonner";
import { uploadImage } from "@/lib/image";
import api from "@/lib/api";

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
  const [remoteLoaded, setRemoteLoaded] = useState(false);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleEn, setTitleEn] = useState(override?.titleEn ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [subtitleEn, setSubtitleEn] = useState(override?.subtitleEn ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [categoryEn, setCategoryEn] = useState(override?.categoryEn ?? "");
  const [breadcrumb, setBreadcrumb] = useState(initial?.breadcrumb ?? "");
  const [breadcrumbEn, setBreadcrumbEn] = useState(override?.breadcrumbEn ?? "");
  const [heroHighlights, setHeroHighlights] = useState<string[]>(initial?.heroHighlights ?? []);
  const [heroHighlightsEn, setHeroHighlightsEn] = useState<string[]>(override?.heroHighlightsEn ?? []);
  const [bannerImage, setBannerImage] = useState<string>(initial?.bannerImage ?? "");
  const [overviewDescription, setOverviewDescription] = useState<string>(initial?.overviewDescription ?? "");
  const [overviewDescriptionEn, setOverviewDescriptionEn] = useState<string>(override?.overviewDescriptionEn ?? "");
  const [price, setPrice] = useState<string>(override?.price ?? "");
  const [originalPrice, setOriginalPrice] = useState<string>(override?.originalPrice ?? "");
  const [seo, setSeo] = useState({
    title: initial?.seo?.title ?? "",
    description: initial?.seo?.description ?? "",
    keywords: initial?.seo?.keywords ?? "",
    ogImage: initial?.seo?.ogImage ?? "",
  });
  const [overview, setOverview] = useState(initial?.overview.map(o => ({ title: o.title, desc: o.desc })) ?? []);
  const [benefits, setBenefits] = useState(initial?.benefits.map(b => ({ title: b.title, desc: b.desc })) ?? []);
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
  const [status, setStatus] = useState<string>("active");

  // Load fresh data from API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const svc: any = await api.admin.services.get(slug);
        if (cancelled || !svc) return;
        const amt = svc?.price?.amount;
        const orig = svc?.price?.originalAmount;
        if (svc.titleAr) setTitle(svc.titleAr);
        if (svc.titleEn) setTitleEn(svc.titleEn);
        if (svc.subtitleAr) setSubtitle(svc.subtitleAr);
        if (svc.subtitleEn) setSubtitleEn(svc.subtitleEn);
        if (svc.category) setCategory(svc.category);
        if (svc.breadcrumbAr) setBreadcrumb(svc.breadcrumbAr);
        if (svc.breadcrumbEn) setBreadcrumbEn(svc.breadcrumbEn);
        if (svc.cover || svc.bannerImage) setBannerImage(svc.bannerImage || svc.cover);
        const ovAr = svc.overviewDescriptionAr ?? svc.overview_description_ar ?? svc.overviewDescription;
        const ovEn = svc.overviewDescriptionEn ?? svc.overview_description_en;
        if (ovAr) setOverviewDescription(ovAr);
        if (ovEn) setOverviewDescriptionEn(ovEn);
        if (amt != null) setPrice(String(amt));
        if (orig != null) setOriginalPrice(String(orig));
        if (svc.status) setStatus(svc.status);
      } catch { /* ignore */ }
      finally { if (!cancelled) setRemoteLoaded(true); }
    })();
    return () => { cancelled = true; };
  }, [slug]);

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

  const handleSave = async () => {
    const next: ServiceOverride = {
      title, titleEn, subtitle, subtitleEn, category, categoryEn, breadcrumb, breadcrumbEn,
      heroHighlights, heroHighlightsEn, bannerImage, overviewDescription, overviewDescriptionEn,
      price, originalPrice, seo, overview, benefits, steps, stats, testimonials, faqs,
      isCustom: isCustom || override?.isCustom,
    };
    save(next);
    // Persist to API
    try {
      await api.admin.updateService(slug, {
        titleAr: title,
        titleEn: titleEn || title,
        subtitleAr: subtitle,
        subtitleEn,
        category,
        breadcrumbAr: breadcrumb,
        breadcrumbEn,
        price: Number(price) || 0,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        cover: bannerImage || null,
        bannerImage: bannerImage || null,
        overviewDescriptionAr: overviewDescription,
        overviewDescriptionEn,
        overview_description_ar: overviewDescription,
        overview_description_en: overviewDescriptionEn,
        benefits: benefits.map((b) => ({ titleAr: b.title, titleEn: b.title, descAr: b.desc, descEn: b.desc })),
        overview: overview.map((o) => ({ titleAr: o.title, titleEn: o.title, descAr: o.desc, descEn: o.desc })),
        status,
      });
      toast.success("تم الحفظ على السيرفر");
    } catch (e: any) {
      toast.error(e?.message || "تعذّر الحفظ على السيرفر");
    }
    setSavedAt(new Date().toLocaleTimeString("ar-SA"));
  };

  const handleReset = () => {
    if (!base) { toast.info("لا توجد نسخة افتراضية لاستعادتها"); return; }
    reset();
    setTitle(base.title);
    setTitleEn("");
    setSubtitle(base.subtitle);
    setSubtitleEn("");
    setCategory(base.category);
    setCategoryEn("");
    setBreadcrumb(base.breadcrumb);
    setBreadcrumbEn("");
    setHeroHighlights(base.heroHighlights);
    setHeroHighlightsEn([]);
    setBannerImage(base.bannerImage ?? "");
    setOverviewDescription(base.overviewDescription ?? "");
    setOverviewDescriptionEn("");
    setPrice("");
    setOriginalPrice("");
    setSeo({ title: base.seo?.title ?? "", description: base.seo?.description ?? "", keywords: base.seo?.keywords ?? "", ogImage: base.seo?.ogImage ?? "" });
    setOverview(base.overview.map(o => ({ title: o.title, desc: o.desc })));
    setBenefits(base.benefits.map(b => ({ title: b.title, desc: b.desc })));
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
            <Field label="عنوان الخدمة (AR)"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
            <Field label="Service Title (EN)"><input className={inputCls} dir="ltr" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} /></Field>
            <Field label="مسار العرض (Breadcrumb AR)"><input className={inputCls} value={breadcrumb} onChange={(e) => setBreadcrumb(e.target.value)} /></Field>
            <Field label="Breadcrumb (EN)"><input className={inputCls} dir="ltr" value={breadcrumbEn} onChange={(e) => setBreadcrumbEn(e.target.value)} /></Field>
            <Field label="التصنيف (AR)"><input className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} /></Field>
            <Field label="Category (EN)"><input className={inputCls} dir="ltr" value={categoryEn} onChange={(e) => setCategoryEn(e.target.value)} /></Field>
            <Field label="المعرّف (slug)"><input className={inputCls} value={slug} disabled /></Field>
            <div className="md:col-span-2">
              <Field label="الوصف المختصر (AR)"><textarea rows={3} className={inputCls} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Short Description (EN)"><textarea rows={3} className={inputCls} dir="ltr" value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)} /></Field>
            </div>
            <div className="md:col-span-2">
              <Field label="صورة البنر (Hero)">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 text-xs font-bold text-primary cursor-pointer hover:bg-primary/10">
                      رفع من الجهاز
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const f = e.target.files?.[0]; if (!f) return;
                        const url = await uploadImage(f);
                        setBannerImage(url);
                      }} />
                    </label>
                    <input type="text" placeholder="أو ألصق رابط https://..." className={`${inputCls} flex-1 min-w-[200px]`} value={bannerImage.startsWith("data:") ? "" : bannerImage} onChange={(e) => setBannerImage(e.target.value)} />
                    {bannerImage && <button type="button" onClick={() => setBannerImage("")} className="text-xs text-rose-600 font-bold">حذف</button>}
                  </div>
                  {bannerImage && <img loading="lazy" decoding="async" src={bannerImage} alt="banner preview" className="h-32 w-full object-cover rounded-xl border border-border" />}
                </div>
              </Field>
            </div>
          </div>
        </PanelCard>

        {/* SEO */}
        <PanelCard title="إعدادات SEO للخدمة">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="عنوان الصفحة (Title)"><input className={inputCls} placeholder={`${title} | سابا ديزاين`} value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} /></Field>
            <Field label="الكلمات المفتاحية (Keywords)"><input className={inputCls} placeholder="افصل بفواصل" value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} /></Field>
            <div className="md:col-span-2">
              <Field label="وصف الصفحة (Meta Description)"><textarea rows={3} className={inputCls} value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })} /></Field>
            </div>
            <div className="md:col-span-2">
              <Field label="صورة المشاركة (Open Graph)">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 text-xs font-bold text-primary cursor-pointer hover:bg-primary/10">
                      رفع من الجهاز
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const f = e.target.files?.[0]; if (!f) return;
                        const url = await uploadImage(f);
                        setSeo((prev) => ({ ...prev, ogImage: url }));
                      }} />
                    </label>
                    <input type="text" placeholder="أو ألصق رابط https://..." className={`${inputCls} flex-1 min-w-[200px]`} value={(seo.ogImage || "").startsWith("data:") ? "" : (seo.ogImage || "")} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })} />
                  </div>
                  {seo.ogImage && <img loading="lazy" decoding="async" src={seo.ogImage} alt="og preview" className="h-28 w-full object-cover rounded-xl border border-border" />}
                </div>
              </Field>
            </div>
          </div>
        </PanelCard>

        {/* Hero highlights */}
        <PanelCard title="نقاط الـ Hero" action={
          <button onClick={() => setHeroHighlights([...heroHighlights, ""])} className="text-xs text-primary font-bold inline-flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة نقطة</button>
        }>
          <div className="space-y-2">
            {heroHighlights.map((h, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
                <input className={inputCls} placeholder="عربي" value={h} onChange={(e) => { const n = [...heroHighlights]; n[i] = e.target.value; setHeroHighlights(n); }} />
                <input className={inputCls} dir="ltr" placeholder="English" value={heroHighlightsEn[i] ?? ""} onChange={(e) => { const n = [...heroHighlightsEn]; n[i] = e.target.value; setHeroHighlightsEn(n); }} />
                <button onClick={() => { setHeroHighlights(heroHighlights.filter((_, x) => x !== i)); setHeroHighlightsEn(heroHighlightsEn.filter((_, x) => x !== i)); }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Overview */}
        <PanelCard title="نظرة عامة عن الخدمة">
          <div className="mb-4">
            <Field label="وصف عام للخدمة (AR)">
              <textarea rows={5} className={inputCls} placeholder="اكتب وصفًا تفصيليًا واضحًا عن الخدمة..." value={overviewDescription} onChange={(e) => setOverviewDescription(e.target.value)} />
            </Field>
            <div className="mt-3">
              <Field label="Overview Description (EN)">
                <textarea rows={5} className={inputCls} dir="ltr" placeholder="Detailed description of the service..." value={overviewDescriptionEn} onChange={(e) => setOverviewDescriptionEn(e.target.value)} />
              </Field>
            </div>
          </div>
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
        <PanelCard title="المميزات (ماذا ستحصل عليه)" action={
          <button onClick={() => setBenefits([...benefits, { title: "", desc: "" }])} className="text-xs text-primary font-bold inline-flex items-center gap-1"><Plus className="h-3 w-3" /> إضافة ميزة</button>
        }>
          {benefits.length === 0 && (
            <p className="mb-3 text-xs text-muted-foreground">لا توجد مميزات بعد. اضغط "إضافة ميزة" لإضافة أول ميزة.</p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {benefits.map((b, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <Field label={`ميزة ${i + 1}`}><input className={inputCls} placeholder="عنوان الميزة" value={b.title} onChange={(e) => { const n = [...benefits]; n[i] = { ...n[i], title: e.target.value }; setBenefits(n); }} /></Field>
                <Field label="الوصف"><textarea rows={2} className={inputCls} placeholder="وصف مختصر للميزة" value={b.desc} onChange={(e) => { const n = [...benefits]; n[i] = { ...n[i], desc: e.target.value }; setBenefits(n); }} /></Field>
                <button onClick={() => setBenefits(benefits.filter((_, x) => x !== i))} className="text-xs text-rose-500 inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> حذف</button>
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard title="الباقات والأسعار">
          <div className="mb-5 grid gap-4 md:grid-cols-2">
            <Field label="السعر الحالي للخدمة (ر.س)">
              <input className={inputCls} dir="ltr" type="number" placeholder="3500" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Field>
            <Field label="السعر قبل الخصم (ر.س — اختياري)">
              <input className={inputCls} dir="ltr" type="number" placeholder="اتركه فارغ لو مفيش خصم" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
            </Field>
            {originalPrice && price && Number(originalPrice) > Number(price) && (
              <div className="md:col-span-2 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                نسبة الخصم: {Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)}% — توفير {(Number(originalPrice) - Number(price)).toLocaleString()} ر.س
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            تفاصيل باقات الاشتراك العامة (Plans) تتم إدارتها من صفحة منفصلة.
          </p>
          <div className="mt-3">
            <Link to={"/admin/plans" as any}>
              <GhostButton><Eye className="h-4 w-4" /> فتح إدارة الباقات</GhostButton>
            </Link>
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
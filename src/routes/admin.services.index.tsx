import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { Package, CheckCircle2, FileEdit, Archive, Search, Plus, Pencil, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { adminServices as initialServices, fmtSAR, type AdminService } from "@/data/admin";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { fileToWebp } from "@/lib/image";

export const Route = createFileRoute("/admin/services/")({
  head: () => ({ meta: [{ title: "الخدمات | لوحة التحكم" }] }),
  component: ServicesPage,
});

const statusMap = { active: { l: "نشطة", t: "emerald" as const }, draft: { l: "مسودة", t: "amber" as const }, archived: { l: "مؤرشفة", t: "muted" as const } };

function ServicesPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "active" | "draft">("all");
  const [items, setItems] = useState<AdminService[]>(initialServices);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    titleAr: "", titleEn: "", sku: "", category: "", price: "", slug: "",
    subtitle: "", breadcrumb: "", bannerImage: "",
    seoTitle: "", seoDescription: "", seoKeywords: "", seoOgImage: "",
    heroHighlights: ["", "", ""],
    overview: [
      { title: "لمن هذه الخدمة", desc: "" },
      { title: "لماذا تهم؟", desc: "" },
      { title: "القيمة الأساسية", desc: "" },
    ],
    benefits: [
      { title: "", desc: "" },
      { title: "", desc: "" },
      { title: "", desc: "" },
    ],
    plans: [
      { name: "Basic", price: "", featured: false, feats: [""] },
      { name: "Pro", price: "", featured: true, feats: [""] },
      { name: "Premium", price: "", featured: false, feats: [""] },
    ],
    steps: [
      { title: "فهم المتطلبات" },
      { title: "تحليل وتجهيز الفكرة" },
      { title: "التصميم الأولي" },
      { title: "المراجعة والتعديل" },
      { title: "التسليم النهائي" },
    ],
    stats: [
      { v: "+260", l: "عدد المشاريع المنفذة" },
      { v: "98%", l: "نسبة رضا العملاء" },
      { v: "14 يوم", l: "متوسط مدة التسليم" },
      { v: "+180", l: "عدد العملاء" },
    ],
    testimonials: [
      { name: "", role: "", text: "" },
    ],
    faqs: [
      { q: "كم يستغرق تنفيذ الخدمة؟", a: "" },
      { q: "هل يمكن التعديل بعد التسليم؟", a: "" },
    ],
  });
  const navigate = useNavigate();

  const filtered = items.filter(s =>
    (tab === "all" || s.status === tab) &&
    (s.titleAr.includes(q) || s.titleEn.toLowerCase().includes(q.toLowerCase()) || s.sku.toLowerCase().includes(q.toLowerCase()))
  );

  const handleAdd = () => {
    if (!form.titleAr || !form.sku) { toast.error("الاسم والـ SKU مطلوبان"); return; }
    const slug = (form.slug || form.titleEn || form.titleAr).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "service-" + Date.now();
    const newSvc: AdminService = {
      id: "s" + (items.length + 1),
      sku: form.sku, slug,
      titleAr: form.titleAr, titleEn: form.titleEn || form.titleAr,
      category: form.category || "عام",
      price: Number(form.price) || 0, bookings: 0, status: "draft",
    };
    setItems([newSvc, ...items]);
    setOpen(false);
    // Seed a custom override so the editor & public page can render this new service
    try {
      const KEY = "saba_service_overrides_v1";
      const raw = localStorage.getItem(KEY);
      const store = raw ? JSON.parse(raw) : {};
      store[slug] = {
        isCustom: true,
        title: newSvc.titleAr,
        subtitle: form.subtitle,
        category: newSvc.category,
        breadcrumb: form.breadcrumb || newSvc.titleAr,
        bannerImage: form.bannerImage,
        seo: {
          title: form.seoTitle,
          description: form.seoDescription,
          keywords: form.seoKeywords,
          ogImage: form.seoOgImage || form.bannerImage,
        },
        heroHighlights: form.heroHighlights.filter(h => h.trim()),
        overview: form.overview.filter(o => o.title.trim()),
        benefits: form.benefits.filter(b => b.title.trim()),
        plans: form.plans
          .filter(p => p.name.trim())
          .map(p => ({ ...p, feats: p.feats.filter(f => f.trim()) })),
        steps: form.steps.filter(s => s.title.trim()),
        stats: form.stats.filter(s => s.v.trim() || s.l.trim()),
        testimonials: form.testimonials.filter(t => t.name.trim() || t.text.trim()),
        faqs: form.faqs.filter(f => f.q.trim()),
      };
      localStorage.setItem(KEY, JSON.stringify(store));
    } catch {}
    toast.success("تم إضافة الخدمة — أكمل التفاصيل");
    navigate({ to: "/admin/services/$slug", params: { slug } });
  };

  const handleDelete = (id: string) => { setItems(items.filter(s => s.id !== id)); toast.success("تم حذف الخدمة"); };

  const handleExport = () => {
    const csv = ["SKU,Title,Category,Price,Bookings,Status", ...items.map(s => `${s.sku},${s.titleAr},${s.category},${s.price},${s.bookings},${s.status}`)].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "services.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير الخدمات");
  };

  return (
    <AdminLayout title="الخدمات" subtitle="إدارة كتالوج الخدمات والباقات" action={
      <div className="hidden sm:flex gap-2">
        <GhostButton onClick={handleExport}><Download className="h-4 w-4" /> تصدير</GhostButton>
        <PrimaryButton onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> إضافة خدمة</PrimaryButton>
      </div>
    }>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="إجمالي الخدمات" value={12} icon={Package} accent="primary" />
        <StatCard label="نشطة" value={9} icon={CheckCircle2} accent="emerald" />
        <StatCard label="مسودات" value={2} icon={FileEdit} accent="amber" />
        <StatCard label="مؤرشفة" value={1} icon={Archive} accent="muted" />
      </div>

      <PanelCard>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث في الخدمات..." className="w-full rounded-xl border border-border bg-background pr-10 pl-3 py-2.5 text-sm" />
          </div>
          <div className="inline-flex rounded-xl border border-border bg-background p-1">
            {[["all", "الكل"], ["active", "نشطة"], ["draft", "مسودات"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-muted-foreground border-b border-border">
                <th className="px-3 py-3 font-medium">الخدمة</th>
                <th className="px-3 py-3 font-medium">SKU</th>
                <th className="px-3 py-3 font-medium">التصنيف</th>
                <th className="px-3 py-3 font-medium">السعر</th>
                <th className="px-3 py-3 font-medium">الطلبات</th>
                <th className="px-3 py-3 font-medium">الحالة</th>
                <th className="px-3 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const st = statusMap[s.status];
                return (
                  <tr key={s.id} className="border-b border-border hover:bg-muted/40">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Package className="h-5 w-5" /></div>
                        <div>
                          <div className="font-bold">{s.titleAr}</div>
                          <div className="text-[11px] text-muted-foreground">{s.titleEn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{s.sku}</td>
                    <td className="px-3 py-3"><Pill tone="primary">{s.category}</Pill></td>
                    <td className="px-3 py-3 font-bold">{fmtSAR(s.price)}</td>
                    <td className="px-3 py-3">{s.bookings}</td>
                    <td className="px-3 py-3"><Pill tone={st.t}>{st.l}</Pill></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <Link to="/admin/services/$slug" params={{ slug: s.slug }} title="تعديل التفاصيل" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-primary">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(s.id)} title="حذف" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PanelCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>إضافة خدمة جديدة</DialogTitle></DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">املأ كل تفاصيل الخدمة. يمكنك التعديل لاحقًا من محرر التفاصيل.</p>
          <div className="grid gap-5">
            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">المعلومات الأساسية</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold space-y-1.5">الاسم (عربي)
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">الاسم (English)
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">SKU
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">التصنيف
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">السعر (ر.س)
                <input type="number" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">المعرّف (slug — اختياري)
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="auto" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">المسار (Breadcrumb)
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.breadcrumb} onChange={(e) => setForm({ ...form, breadcrumb: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 col-span-2">الوصف المختصر
                <textarea rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 col-span-2">صورة البنر (رابط الصورة)
                <input type="url" placeholder="https://..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.bannerImage} onChange={(e) => setForm({ ...form, bannerImage: e.target.value })} />
                <input type="file" accept="image/*" className="w-full text-[11px]" onChange={async (e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  setForm({ ...form, bannerImage: await fileToWebp(f) });
                }} />
                {form.bannerImage && <img src={form.bannerImage} alt="banner preview" className="mt-1 h-24 w-full object-cover rounded-md border border-border" />}
              </label>
            </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">إعدادات SEO</div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-bold space-y-1.5">عنوان الصفحة (SEO Title)
                  <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
                </label>
                <label className="text-xs font-bold space-y-1.5">الكلمات المفتاحية
                  <input placeholder="كلمة، كلمة، ..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} />
                </label>
                <label className="text-xs font-bold space-y-1.5 col-span-2">وصف الميتا (Meta Description)
                  <textarea rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
                </label>
                <label className="text-xs font-bold space-y-1.5 col-span-2">صورة المشاركة (OG Image)
                  <input type="url" placeholder="https://..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.seoOgImage} onChange={(e) => setForm({ ...form, seoOgImage: e.target.value })} />
                  <input type="file" accept="image/*" className="w-full text-[11px]" onChange={async (e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    setForm({ ...form, seoOgImage: await fileToWebp(f) });
                  }} />
                </label>
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">نقاط الـ Hero (3 نقاط)</div>
              <div className="space-y-2">
                {form.heroHighlights.map((h, i) => (
                  <input key={i} placeholder={`نقطة ${i + 1}`} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={h} onChange={(e) => { const n = [...form.heroHighlights]; n[i] = e.target.value; setForm({ ...form, heroHighlights: n }); }} />
                ))}
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">نظرة عامة (3 بطاقات)</div>
              <div className="grid gap-3 md:grid-cols-3">
                {form.overview.map((o, i) => (
                  <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                    <input placeholder="العنوان" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={o.title} onChange={(e) => { const n = [...form.overview]; n[i] = { ...n[i], title: e.target.value }; setForm({ ...form, overview: n }); }} />
                    <textarea rows={2} placeholder="الوصف" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={o.desc} onChange={(e) => { const n = [...form.overview]; n[i] = { ...n[i], desc: e.target.value }; setForm({ ...form, overview: n }); }} />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">المميزات</div>
              <div className="grid gap-3 md:grid-cols-2">
                {form.benefits.map((b, i) => (
                  <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                    <input placeholder="عنوان الميزة" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={b.title} onChange={(e) => { const n = [...form.benefits]; n[i] = { ...n[i], title: e.target.value }; setForm({ ...form, benefits: n }); }} />
                    <textarea rows={2} placeholder="الوصف" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={b.desc} onChange={(e) => { const n = [...form.benefits]; n[i] = { ...n[i], desc: e.target.value }; setForm({ ...form, benefits: n }); }} />
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, benefits: [...form.benefits, { title: "", desc: "" }] })} className="rounded-lg border border-dashed border-border py-3 text-xs font-bold text-primary hover:bg-primary/5">+ إضافة ميزة</button>
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">الباقات والأسعار</div>
              <div className="grid gap-3 md:grid-cols-3">
                {form.plans.map((p, pi) => (
                  <div key={pi} className={`rounded-lg border p-3 space-y-2 ${p.featured ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="flex items-center justify-between">
                      <input placeholder="اسم الباقة" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-bold" value={p.name} onChange={(e) => { const n = [...form.plans]; n[pi] = { ...n[pi], name: e.target.value }; setForm({ ...form, plans: n }); }} />
                    </div>
                    <input placeholder="السعر" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={p.price} onChange={(e) => { const n = [...form.plans]; n[pi] = { ...n[pi], price: e.target.value }; setForm({ ...form, plans: n }); }} />
                    <label className="flex items-center gap-1 text-[11px] font-bold">
                      <input type="checkbox" checked={p.featured} onChange={(e) => { const n = [...form.plans]; n[pi] = { ...n[pi], featured: e.target.checked }; setForm({ ...form, plans: n }); }} /> مميزة
                    </label>
                    <div className="space-y-1">
                      {p.feats.map((f, fi) => (
                        <input key={fi} placeholder={`ميزة ${fi + 1}`} className="w-full rounded-lg border border-border bg-background px-2 py-1 text-[11px]" value={f} onChange={(e) => { const n = [...form.plans]; const feats = [...n[pi].feats]; feats[fi] = e.target.value; n[pi] = { ...n[pi], feats }; setForm({ ...form, plans: n }); }} />
                      ))}
                      <button onClick={() => { const n = [...form.plans]; n[pi] = { ...n[pi], feats: [...n[pi].feats, ""] }; setForm({ ...form, plans: n }); }} className="text-[11px] text-primary font-bold">+ إضافة بند</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">خطوات العمل</div>
              <div className="grid gap-2 md:grid-cols-2">
                {form.steps.map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                    <input placeholder="الخطوة" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={s.title} onChange={(e) => { const n = [...form.steps]; n[i] = { title: e.target.value }; setForm({ ...form, steps: n }); }} />
                    <button onClick={() => setForm({ ...form, steps: form.steps.filter((_, x) => x !== i) })} className="text-rose-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, steps: [...form.steps, { title: "" }] })} className="rounded-lg border border-dashed border-border py-2 text-xs font-bold text-primary hover:bg-primary/5">+ إضافة خطوة</button>
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">الأرقام (إحصائيات)</div>
              <div className="grid gap-2 md:grid-cols-2">
                {form.stats.map((s, i) => (
                  <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
                    <input placeholder="القيمة" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={s.v} onChange={(e) => { const n = [...form.stats]; n[i] = { ...n[i], v: e.target.value }; setForm({ ...form, stats: n }); }} />
                    <input placeholder="الوصف" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={s.l} onChange={(e) => { const n = [...form.stats]; n[i] = { ...n[i], l: e.target.value }; setForm({ ...form, stats: n }); }} />
                    <button onClick={() => setForm({ ...form, stats: form.stats.filter((_, x) => x !== i) })} className="text-rose-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, stats: [...form.stats, { v: "", l: "" }] })} className="rounded-lg border border-dashed border-border py-2 text-xs font-bold text-primary hover:bg-primary/5 md:col-span-2">+ إضافة رقم</button>
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">آراء العملاء</div>
              <div className="grid gap-3 md:grid-cols-2">
                {form.testimonials.map((t, i) => (
                  <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input placeholder="الاسم" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={t.name} onChange={(e) => { const n = [...form.testimonials]; n[i] = { ...n[i], name: e.target.value }; setForm({ ...form, testimonials: n }); }} />
                      <input placeholder="المسمى" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={t.role} onChange={(e) => { const n = [...form.testimonials]; n[i] = { ...n[i], role: e.target.value }; setForm({ ...form, testimonials: n }); }} />
                    </div>
                    <textarea rows={2} placeholder="النص" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={t.text} onChange={(e) => { const n = [...form.testimonials]; n[i] = { ...n[i], text: e.target.value }; setForm({ ...form, testimonials: n }); }} />
                    <button onClick={() => setForm({ ...form, testimonials: form.testimonials.filter((_, x) => x !== i) })} className="text-[11px] text-rose-500 inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> حذف</button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, testimonials: [...form.testimonials, { name: "", role: "", text: "" }] })} className="rounded-lg border border-dashed border-border py-3 text-xs font-bold text-primary hover:bg-primary/5">+ إضافة رأي</button>
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">الأسئلة الشائعة</div>
              <div className="space-y-2">
                {form.faqs.map((f, i) => (
                  <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                    <input placeholder="السؤال" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-bold" value={f.q} onChange={(e) => { const n = [...form.faqs]; n[i] = { ...n[i], q: e.target.value }; setForm({ ...form, faqs: n }); }} />
                    <textarea rows={2} placeholder="الإجابة" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={f.a} onChange={(e) => { const n = [...form.faqs]; n[i] = { ...n[i], a: e.target.value }; setForm({ ...form, faqs: n }); }} />
                    <button onClick={() => setForm({ ...form, faqs: form.faqs.filter((_, x) => x !== i) })} className="text-[11px] text-rose-500 inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> حذف</button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, faqs: [...form.faqs, { q: "", a: "" }] })} className="w-full rounded-lg border border-dashed border-border py-2 text-xs font-bold text-primary hover:bg-primary/5">+ إضافة سؤال</button>
              </div>
            </section>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setOpen(false)}>إلغاء</GhostButton>
            <PrimaryButton onClick={handleAdd}>إضافة</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
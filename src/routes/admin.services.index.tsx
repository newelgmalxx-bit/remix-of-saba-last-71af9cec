import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { Package, CheckCircle2, FileEdit, Archive, Search, Plus, Pencil, Download, Trash2, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { adminServices as initialServices, fmtSAR, type AdminService } from "@/data/admin";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { fileToWebp } from "@/lib/image";
import { useLang } from "@/i18n/LanguageProvider";
import api from "@/lib/api";

export const Route = createFileRoute("/admin/services/")({
  head: () => ({ meta: [{ title: "الخدمات | لوحة التحكم" }] }),
  component: ServicesPage,
});

function ServicesPage() {
  const { dir } = useLang();
  const isAr = dir === "rtl";
  const L = (ar: string, en: string) => (isAr ? ar : en);
  const statusMap = {
    active: { l: L("نشطة", "Active"), t: "emerald" as const },
    draft: { l: L("مسودة", "Draft"), t: "amber" as const },
    archived: { l: L("مؤرشفة", "Archived"), t: "muted" as const },
  };
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "active" | "draft">("all");
  const [items, setItems] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      const res: any = await api.admin.getServices();
      const list = res?.items || res?.data?.items || [];
      const mapped: AdminService[] = list.map((s: any, i: number) => ({
        id: String(s.id ?? `s${i + 1}`),
        sku: s.sku || s.slug.toUpperCase(),
        slug: s.slug,
        titleAr: s.titleAr || s.slug,
        titleEn: s.titleEn || s.slug,
        category: s.category || "عام",
        price: Number(s?.price?.amount ?? s?.price ?? 0),
        bookings: 0,
        status: (s.status as AdminService["status"]) || "active",
      }));
      setItems(mapped);
    } catch {
      setItems(initialServices);
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchList(); }, []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    titleAr: "", titleEn: "", sku: "", category: "", price: "", originalPrice: "", slug: "",
    subtitle: "", breadcrumb: "", bannerImage: "",
    overviewDescription: "",
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
      { name: "Basic", price: "", originalPrice: "", featured: false, feats: [""] },
      { name: "Pro", price: "", originalPrice: "", featured: true, feats: [""] },
      { name: "Premium", price: "", originalPrice: "", featured: false, feats: [""] },
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

  const handleAdd = async () => {
    if (!form.titleAr || !form.sku) { toast.error(L("الاسم والـ SKU مطلوبان", "Name and SKU are required")); return; }
    const slug = (form.slug || form.titleEn || form.titleAr).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "service-" + Date.now();
    try {
      await api.admin.createService({
        slug,
        sku: form.sku,
        titleAr: form.titleAr,
        titleEn: form.titleEn || form.titleAr,
        subtitleAr: form.subtitle || "",
        subtitleEn: "",
        category: form.category || "عام",
        price: Number(form.price) || 0,
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        status: "draft",
        cover: form.bannerImage || null,
        bannerImage: form.bannerImage || null,
        overviewDescriptionAr: form.overviewDescription || "",
        breadcrumbAr: form.breadcrumb || form.titleAr,
      });
    } catch (e: any) {
      toast.error(e?.message || L("فشل إضافة الخدمة", "Failed to add service"));
      return;
    }
    setOpen(false);
    await fetchList();
    // Seed a custom override so the editor & public page can render this new service
    try {
      const KEY = "saba_service_overrides_v1";
      const raw = localStorage.getItem(KEY);
      const store = raw ? JSON.parse(raw) : {};
      store[slug] = {
        isCustom: true,
        title: form.titleAr,
        subtitle: form.subtitle,
        category: form.category || "عام",
        breadcrumb: form.breadcrumb || form.titleAr,
        bannerImage: form.bannerImage,
        price: form.price,
        originalPrice: form.originalPrice,
        overviewDescription: form.overviewDescription,
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
    toast.success(L("تم إضافة الخدمة — أكمل التفاصيل", "Service added — complete the details"));
    navigate({ to: "/admin/services/$slug", params: { slug } });
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(L("متأكد من الحذف؟", "Confirm delete?"))) return;
    try {
      await api.admin.deleteService(slug);
      toast.success(L("تم حذف الخدمة", "Service deleted"));
      await fetchList();
    } catch (e: any) { toast.error(e?.message || L("فشل الحذف", "Delete failed")); }
  };

  const handleToggleStatus = async (slug: string, current: AdminService["status"]) => {
    const next = current === "active" ? "draft" : "active";
    try {
      await api.admin.updateService(slug, { status: next });
      toast.success(next === "active" ? L("تم نشر الخدمة", "Service published") : L("تم تحويلها لمسودة", "Moved to draft"));
      await fetchList();
    } catch (e: any) { toast.error(e?.message || L("فشل التحديث", "Update failed")); }
  };

  const handleExport = () => {
    const csv = ["SKU,Title,Category,Price,Bookings,Status", ...items.map(s => `${s.sku},${s.titleAr},${s.category},${s.price},${s.bookings},${s.status}`)].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "services.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success(L("تم تصدير الخدمات", "Services exported"));
  };

  return (
    <AdminLayout title={L("الخدمات", "Services")} subtitle={L("إدارة كتالوج الخدمات والباقات", "Manage services catalog and packages")} action={
      <div className="hidden sm:flex gap-2">
        <GhostButton onClick={handleExport}><Download className="h-4 w-4" /> {L("تصدير", "Export")}</GhostButton>
        <PrimaryButton onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> {L("إضافة خدمة", "Add Service")}</PrimaryButton>
      </div>
    }>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("إجمالي الخدمات", "Total Services")} value={items.length} icon={Package} accent="primary" />
        <StatCard label={L("نشطة", "Active")} value={items.filter(s => s.status === "active").length} icon={CheckCircle2} accent="emerald" />
        <StatCard label={L("مسودات", "Drafts")} value={items.filter(s => s.status === "draft").length} icon={FileEdit} accent="amber" />
        <StatCard label={L("مؤرشفة", "Archived")} value={items.filter(s => s.status === "archived").length} icon={Archive} accent="muted" />
      </div>

      <PanelCard>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("ابحث في الخدمات...", "Search services...")} className={`w-full rounded-xl border border-border bg-background ${isAr ? "pr-10 pl-3" : "pl-10 pr-3"} py-2.5 text-sm`} />
          </div>
          <div className="inline-flex rounded-xl border border-border bg-background p-1">
            {[["all", L("الكل", "All")], ["active", L("نشطة", "Active")], ["draft", L("مسودات", "Drafts")]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className={`${isAr ? "text-right" : "text-left"} text-xs text-muted-foreground border-b border-border`}>
                <th className="px-3 py-3 font-medium">{L("الخدمة", "Service")}</th>
                <th className="px-3 py-3 font-medium">SKU</th>
                <th className="px-3 py-3 font-medium">{L("التصنيف", "Category")}</th>
                <th className="px-3 py-3 font-medium">{L("السعر", "Price")}</th>
                <th className="px-3 py-3 font-medium">{L("الطلبات", "Orders")}</th>
                <th className="px-3 py-3 font-medium">{L("الحالة", "Status")}</th>
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
                          <div className="font-bold">{isAr ? s.titleAr : s.titleEn}</div>
                          <div className="text-[11px] text-muted-foreground">{isAr ? s.titleEn : s.titleAr}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground" dir="ltr">{s.sku}</td>
                    <td className="px-3 py-3"><Pill tone="primary">{s.category}</Pill></td>
                    <td className="px-3 py-3 font-bold" data-ltr-number>{fmtSAR(s.price)}</td>
                    <td className="px-3 py-3" data-ltr-number>{s.bookings}</td>
                    <td className="px-3 py-3"><Pill tone={st.t}>{st.l}</Pill></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleToggleStatus(s.slug, s.status)} title={s.status === "active" ? L("تحويل لمسودة", "Move to draft") : L("نشر", "Publish")} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-emerald-600">
                          {s.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <Link to="/admin/services/$slug" params={{ slug: s.slug }} title={L("تعديل التفاصيل", "Edit details")} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-primary">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(s.slug)} title={L("حذف", "Delete")} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500">
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
        <DialogContent dir={dir} className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{L("إضافة خدمة جديدة", "Add New Service")}</DialogTitle></DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">{L("املأ كل تفاصيل الخدمة. يمكنك التعديل لاحقًا من محرر التفاصيل.", "Fill in all service details. You can edit later from the details editor.")}</p>
          <div className="grid gap-5">
            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">{L("المعلومات الأساسية", "Basic Information")}</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold space-y-1.5">{L("الاسم (عربي)", "Name (Arabic)")}
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">{L("الاسم (English)", "Name (English)")}
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">SKU
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">{L("التصنيف", "Category")}
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">{L("السعر (ر.س)", "Price (SAR)")}
                <input type="number" dir="ltr" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">{L("السعر قبل الخصم (اختياري)", "Original Price (optional)")}
                <input type="number" dir="ltr" placeholder={L("اتركه فارغ لو مفيش خصم", "Leave empty if no discount")} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">{L("المعرّف (slug — اختياري)", "Identifier (slug — optional)")}
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="auto" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">{L("المسار (Breadcrumb)", "Path (Breadcrumb)")}
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.breadcrumb} onChange={(e) => setForm({ ...form, breadcrumb: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 col-span-2">{L("الوصف المختصر", "Short Description")}
                <textarea rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 col-span-2">{L("نظرة عامة عن الخدمة (وصف تفصيلي)", "Service Overview (detailed description)")}
                <textarea rows={4} placeholder={L("وصف تفصيلي يظهر في قسم نظرة عامة بصفحة الخدمة", "Detailed description shown in the overview section on the service page")} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.overviewDescription} onChange={(e) => setForm({ ...form, overviewDescription: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 col-span-2">{L("صورة البنر (رابط الصورة)", "Banner Image (URL)")}
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
              <div className="text-xs font-extrabold mb-2 text-primary">{L("إعدادات SEO", "SEO Settings")}</div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-bold space-y-1.5">{L("عنوان الصفحة (SEO Title)", "Page Title (SEO Title)")}
                  <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
                </label>
                <label className="text-xs font-bold space-y-1.5">{L("الكلمات المفتاحية", "Keywords")}
                  <input placeholder={L("كلمة، كلمة، ...", "word, word, ...")} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} />
                </label>
                <label className="text-xs font-bold space-y-1.5 col-span-2">{L("وصف الميتا (Meta Description)", "Meta Description")}
                  <textarea rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
                </label>
                <label className="text-xs font-bold space-y-1.5 col-span-2">{L("صورة المشاركة (OG Image)", "Share Image (OG Image)")}
                  <input type="url" placeholder="https://..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.seoOgImage} onChange={(e) => setForm({ ...form, seoOgImage: e.target.value })} />
                  <input type="file" accept="image/*" className="w-full text-[11px]" onChange={async (e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    setForm({ ...form, seoOgImage: await fileToWebp(f) });
                  }} />
                </label>
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">{L("نقاط الـ Hero (3 نقاط)", "Hero Highlights (3 points)")}</div>
              <div className="space-y-2">
                {form.heroHighlights.map((h, i) => (
                  <input key={i} placeholder={L(`نقطة ${i + 1}`, `Point ${i + 1}`)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={h} onChange={(e) => { const n = [...form.heroHighlights]; n[i] = e.target.value; setForm({ ...form, heroHighlights: n }); }} />
                ))}
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">{L("نظرة عامة (3 بطاقات)", "Overview (3 cards)")}</div>
              <div className="grid gap-3 md:grid-cols-3">
                {form.overview.map((o, i) => (
                  <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                    <input placeholder={L("العنوان", "Title")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={o.title} onChange={(e) => { const n = [...form.overview]; n[i] = { ...n[i], title: e.target.value }; setForm({ ...form, overview: n }); }} />
                    <textarea rows={2} placeholder={L("الوصف", "Description")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={o.desc} onChange={(e) => { const n = [...form.overview]; n[i] = { ...n[i], desc: e.target.value }; setForm({ ...form, overview: n }); }} />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">{L("المميزات", "Benefits")}</div>
              <div className="grid gap-3 md:grid-cols-2">
                {form.benefits.map((b, i) => (
                  <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                    <input placeholder={L("عنوان الميزة", "Benefit title")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={b.title} onChange={(e) => { const n = [...form.benefits]; n[i] = { ...n[i], title: e.target.value }; setForm({ ...form, benefits: n }); }} />
                    <textarea rows={2} placeholder={L("الوصف", "Description")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={b.desc} onChange={(e) => { const n = [...form.benefits]; n[i] = { ...n[i], desc: e.target.value }; setForm({ ...form, benefits: n }); }} />
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, benefits: [...form.benefits, { title: "", desc: "" }] })} className="rounded-lg border border-dashed border-border py-3 text-xs font-bold text-primary hover:bg-primary/5">+ {L("إضافة ميزة", "Add Benefit")}</button>
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">{L("الباقات والأسعار", "Packages & Pricing")}</div>
              <div className="grid gap-3 md:grid-cols-3">
                {form.plans.map((p, pi) => (
                  <div key={pi} className={`rounded-lg border p-3 space-y-2 ${p.featured ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="flex items-center justify-between">
                      <input placeholder={L("اسم الباقة", "Package name")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-bold" value={p.name} onChange={(e) => { const n = [...form.plans]; n[pi] = { ...n[pi], name: e.target.value }; setForm({ ...form, plans: n }); }} />
                    </div>
                    <input placeholder={L("السعر", "Price")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={p.price} onChange={(e) => { const n = [...form.plans]; n[pi] = { ...n[pi], price: e.target.value }; setForm({ ...form, plans: n }); }} />
                    <input placeholder={L("السعر قبل الخصم", "Original price")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={p.originalPrice ?? ""} onChange={(e) => { const n = [...form.plans]; n[pi] = { ...n[pi], originalPrice: e.target.value }; setForm({ ...form, plans: n }); }} />
                    <label className="flex items-center gap-1 text-[11px] font-bold">
                      <input type="checkbox" checked={p.featured} onChange={(e) => { const n = [...form.plans]; n[pi] = { ...n[pi], featured: e.target.checked }; setForm({ ...form, plans: n }); }} /> {L("مميزة", "Featured")}
                    </label>
                    <div className="space-y-1">
                      {p.feats.map((f, fi) => (
                        <input key={fi} placeholder={L(`ميزة ${fi + 1}`, `Feature ${fi + 1}`)} className="w-full rounded-lg border border-border bg-background px-2 py-1 text-[11px]" value={f} onChange={(e) => { const n = [...form.plans]; const feats = [...n[pi].feats]; feats[fi] = e.target.value; n[pi] = { ...n[pi], feats }; setForm({ ...form, plans: n }); }} />
                      ))}
                      <button onClick={() => { const n = [...form.plans]; n[pi] = { ...n[pi], feats: [...n[pi].feats, ""] }; setForm({ ...form, plans: n }); }} className="text-[11px] text-primary font-bold">+ {L("إضافة بند", "Add item")}</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">{L("خطوات العمل", "Workflow Steps")}</div>
              <div className="grid gap-2 md:grid-cols-2">
                {form.steps.map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                    <input placeholder={L("الخطوة", "Step")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={s.title} onChange={(e) => { const n = [...form.steps]; n[i] = { title: e.target.value }; setForm({ ...form, steps: n }); }} />
                    <button onClick={() => setForm({ ...form, steps: form.steps.filter((_, x) => x !== i) })} className="text-rose-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, steps: [...form.steps, { title: "" }] })} className="rounded-lg border border-dashed border-border py-2 text-xs font-bold text-primary hover:bg-primary/5">+ {L("إضافة خطوة", "Add Step")}</button>
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">{L("الأرقام (إحصائيات)", "Numbers (Stats)")}</div>
              <div className="grid gap-2 md:grid-cols-2">
                {form.stats.map((s, i) => (
                  <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
                    <input placeholder={L("القيمة", "Value")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={s.v} onChange={(e) => { const n = [...form.stats]; n[i] = { ...n[i], v: e.target.value }; setForm({ ...form, stats: n }); }} />
                    <input placeholder={L("الوصف", "Description")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={s.l} onChange={(e) => { const n = [...form.stats]; n[i] = { ...n[i], l: e.target.value }; setForm({ ...form, stats: n }); }} />
                    <button onClick={() => setForm({ ...form, stats: form.stats.filter((_, x) => x !== i) })} className="text-rose-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, stats: [...form.stats, { v: "", l: "" }] })} className="rounded-lg border border-dashed border-border py-2 text-xs font-bold text-primary hover:bg-primary/5 md:col-span-2">+ {L("إضافة رقم", "Add Number")}</button>
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">{L("آراء العملاء", "Testimonials")}</div>
              <div className="grid gap-3 md:grid-cols-2">
                {form.testimonials.map((t, i) => (
                  <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input placeholder={L("الاسم", "Name")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={t.name} onChange={(e) => { const n = [...form.testimonials]; n[i] = { ...n[i], name: e.target.value }; setForm({ ...form, testimonials: n }); }} />
                      <input placeholder={L("المسمى", "Role")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={t.role} onChange={(e) => { const n = [...form.testimonials]; n[i] = { ...n[i], role: e.target.value }; setForm({ ...form, testimonials: n }); }} />
                    </div>
                    <textarea rows={2} placeholder={L("النص", "Text")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={t.text} onChange={(e) => { const n = [...form.testimonials]; n[i] = { ...n[i], text: e.target.value }; setForm({ ...form, testimonials: n }); }} />
                    <button onClick={() => setForm({ ...form, testimonials: form.testimonials.filter((_, x) => x !== i) })} className="text-[11px] text-rose-500 inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> {L("حذف", "Delete")}</button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, testimonials: [...form.testimonials, { name: "", role: "", text: "" }] })} className="rounded-lg border border-dashed border-border py-3 text-xs font-bold text-primary hover:bg-primary/5">+ {L("إضافة رأي", "Add Testimonial")}</button>
              </div>
            </section>

            <section>
              <div className="text-xs font-extrabold mb-2 text-primary">{L("الأسئلة الشائعة", "FAQs")}</div>
              <div className="space-y-2">
                {form.faqs.map((f, i) => (
                  <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                    <input placeholder={L("السؤال", "Question")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-bold" value={f.q} onChange={(e) => { const n = [...form.faqs]; n[i] = { ...n[i], q: e.target.value }; setForm({ ...form, faqs: n }); }} />
                    <textarea rows={2} placeholder={L("الإجابة", "Answer")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" value={f.a} onChange={(e) => { const n = [...form.faqs]; n[i] = { ...n[i], a: e.target.value }; setForm({ ...form, faqs: n }); }} />
                    <button onClick={() => setForm({ ...form, faqs: form.faqs.filter((_, x) => x !== i) })} className="text-[11px] text-rose-500 inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> {L("حذف", "Delete")}</button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, faqs: [...form.faqs, { q: "", a: "" }] })} className="w-full rounded-lg border border-dashed border-border py-2 text-xs font-bold text-primary hover:bg-primary/5">+ {L("إضافة سؤال", "Add Question")}</button>
              </div>
            </section>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setOpen(false)}>{L("إلغاء", "Cancel")}</GhostButton>
            <PrimaryButton onClick={handleAdd}>{L("إضافة", "Add")}</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
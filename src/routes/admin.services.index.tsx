import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { Package, CheckCircle2, FileEdit, Archive, Search, Plus, Pencil, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { adminServices as initialServices, fmtSAR, type AdminService } from "@/data/admin";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
  const [form, setForm] = useState({ titleAr: "", titleEn: "", sku: "", category: "", price: "", slug: "" });
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
    setForm({ titleAr: "", titleEn: "", sku: "", category: "", price: "", slug: "" });
    // Seed a custom override so the editor & public page can render this new service
    try {
      const KEY = "saba_service_overrides_v1";
      const raw = localStorage.getItem(KEY);
      const store = raw ? JSON.parse(raw) : {};
      store[slug] = {
        isCustom: true,
        title: newSvc.titleAr,
        subtitle: "",
        category: newSvc.category,
        breadcrumb: newSvc.titleAr,
        heroHighlights: [],
        overview: [{ title: "نظرة عامة", desc: "" }],
        benefits: [{ title: "ميزة 1", desc: "" }],
        plans: [{ name: "Basic", price: String(newSvc.price), featured: false, feats: [] }],
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
                <th className="px-3 py-3 font-medium">الحجوزات</th>
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
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>إضافة خدمة جديدة</DialogTitle></DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">بعد الإضافة سيتم نقلك لمحرر التفاصيل لإكمال الوصف والباقات والمميزات.</p>
          <div className="grid gap-3">
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
            </div>
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
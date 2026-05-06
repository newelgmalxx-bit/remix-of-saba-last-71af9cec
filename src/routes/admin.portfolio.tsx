import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { ImageIcon, Eye, EyeOff, Tag, Plus, Search, Edit, Trash2, X, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { portfolioCategories, type AdminPortfolio } from "@/data/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { uploadImage } from "@/lib/image";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api";

export const Route = createFileRoute("/admin/portfolio")({
  head: () => ({ meta: [{ title: "أعمالنا | لوحة التحكم" }] }),
  component: PortfolioPage,
});

type FormState = {
  titleAr: string; titleEn: string; category: string; image: string; link: string; visible: boolean;
  cover: string; description: string; tech: string[]; client: string; year: string;
};

const empty: FormState = {
  titleAr: "", titleEn: "", category: portfolioCategories[0], image: "🎨", link: "#",
  visible: true, cover: "", description: "", tech: [], client: "", year: String(new Date().getFullYear()),
};

function PortfolioPage() {
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const [items, setItems] = useState<AdminPortfolio[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    adminApi.portfolio.list()
      .then((d) => {
        const list: AdminPortfolio[] = (d.items || []).map((p: any) => ({
          id: p.id, titleAr: p.titleAr, titleEn: p.titleEn, category: p.category,
          image: "🎨", visible: !!p.visible, link: p.link ?? "#",
          cover: p.cover ?? "", description: p.descriptionAr ?? p.descriptionEn ?? "",
          tech: p.tech ?? [], client: p.client_name ?? "", year: p.year ?? "",
        }));
        setItems(list);
      })
      .catch(() => setItems([]));
  }, []);

  const onPickFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error(L("اختر صورة فقط", "Pick an image only")); return; }
    const webp = await uploadImage(file);
    setForm((f) => ({ ...f, cover: webp }));
  };

  const filtered = items.filter(i => i.titleAr.includes(q) || i.titleEn.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id: string) => {
    const next = items.map(i => i.id === id ? { ...i, visible: !i.visible } : i);
    setItems(next);
    const v = next.find(i => i.id === id)?.visible ?? true;
    adminApi.portfolio.setVisibility(id, v).catch(() => {});
  };
  const remove = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    adminApi.portfolio.remove(id).catch(() => {});
    toast.success(L("تم الحذف", "Deleted"));
  };

  const openAdd = () => { setEditId(null); setForm(empty); setTechInput(""); setOpen(true); };
  const openEdit = (id: string) => {
    const it = items.find(i => i.id === id); if (!it) return;
    setEditId(id);
    setForm({
      titleAr: it.titleAr, titleEn: it.titleEn, category: it.category, image: it.image,
      link: it.link, visible: it.visible, cover: it.cover ?? "", description: it.description ?? "",
      tech: it.tech ?? [], client: it.client ?? "", year: it.year ?? "",
    });
    setTechInput("");
    setOpen(true);
  };

  const addTech = () => {
    const v = techInput.trim();
    if (!v) return;
    setForm({ ...form, tech: [...form.tech, v] });
    setTechInput("");
  };

  const handleSave = async () => {
    if (!form.titleAr) { toast.error(L("العنوان مطلوب", "Title is required")); return; }
    const payload: any = {
      titleAr: form.titleAr, titleEn: form.titleEn, category: form.category,
      cover: form.cover, descriptionAr: form.description, descriptionEn: form.description,
      tech: form.tech, client_name: form.client, year: form.year, link: form.link, visible: form.visible,
    };
    if (editId) {
      setItems(items.map(i => i.id === editId ? { ...i, ...form } : i));
      adminApi.portfolio.update(editId, payload).catch(() => {});
      toast.success(L("تم التحديث", "Updated"));
    } else {
      const localId = "p" + Date.now();
      setItems([{ id: localId, ...form }, ...items]);
      adminApi.portfolio.create(payload).catch(() => {});
      toast.success(L("تم إضافة العمل", "Project added"));
    }
    setOpen(false);
  };

  const visible = items.filter(i => i.visible).length;
  const cats = new Set(items.map(i => i.category)).size;
  const startSide = dir === "rtl" ? "right-3" : "left-3";
  const padStart = dir === "rtl" ? "pr-10 pl-3" : "pl-10 pr-3";
  const textAlign = dir === "rtl" ? "text-right" : "text-left";
  const knobOn = dir === "rtl" ? "right-0.5" : "left-0.5";
  const knobOff = dir === "rtl" ? "right-5" : "left-5";

  return (
    <AdminLayout title={L("أعمالنا", "Portfolio")} subtitle={L("إدارة معرض الأعمال والمشاريع", "Manage portfolio and projects")} action={<PrimaryButton onClick={openAdd}><Plus className="h-4 w-4" /> {L("إضافة عمل", "Add Project")}</PrimaryButton>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("إجمالي الأعمال", "Total Projects")} value={items.length} icon={ImageIcon} accent="primary" />
        <StatCard label={L("منشورة", "Published")} value={visible} icon={Eye} accent="emerald" />
        <StatCard label={L("مخفية", "Hidden")} value={items.length - visible} icon={EyeOff} accent="muted" />
        <StatCard label={L("تصنيفات", "Categories")} value={cats} icon={Tag} accent="violet" />
      </div>

      <PanelCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className={`absolute ${startSide} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("ابحث عن عمل...", "Search projects...")} className={`w-full rounded-xl border border-border bg-background ${padStart} py-2.5 text-sm`} />
          </div>
        </div>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className={`${textAlign} text-xs text-muted-foreground border-b border-border`}>
                <th className="px-3 py-3 font-medium">{L("العمل", "Project")}</th>
                <th className="px-3 py-3 font-medium">{L("التصنيف", "Category")}</th>
                <th className="px-3 py-3 font-medium">{L("التقنيات", "Tech")}</th>
                <th className="px-3 py-3 font-medium">{L("السنة", "Year")}</th>
                <th className="px-3 py-3 font-medium">{L("الظهور", "Visibility")}</th>
                <th className="px-3 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id} className="border-b border-border hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      {i.cover ? (
                        <img src={i.cover} alt={i.titleAr} className="h-12 w-16 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-primary/10 text-2xl">{i.image}</div>
                      )}
                      <div>
                        <div className="font-bold">{lang === "en" ? i.titleEn : i.titleAr}</div>
                        <div className="text-[11px] text-muted-foreground">{lang === "en" ? i.titleAr : i.titleEn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><Pill tone="primary">{i.category}</Pill></td>
                  <td className="px-3 py-3 text-[11px] text-muted-foreground">{(i.tech ?? []).slice(0, 3).join(lang === "en" ? ", " : "، ")}</td>
                  <td className="px-3 py-3 text-xs" data-ltr-number>{i.year ?? "—"}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => toggle(i.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${i.visible ? "bg-primary" : "bg-muted"}`}>
                      <span className={`absolute inline-block h-5 w-5 rounded-full bg-white shadow transition ${i.visible ? knobOn : knobOff}`} />
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(i.id)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-primary"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => remove(i.id)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir={dir} className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? L("تعديل عمل", "Edit Project") : L("إضافة عمل جديد", "Add New Project")}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold space-y-1.5 block">{L("العنوان (عربي)", "Title (Arabic)")}
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 block">{L("العنوان (English)", "Title (English)")}
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 block">{L("التصنيف", "Category")}
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {portfolioCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="text-xs font-bold space-y-1.5 block">{L("السنة", "Year")}
                <input dir="ltr" inputMode="numeric" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </label>
              <div className="col-span-2 space-y-2">
                <div className="text-xs font-bold">{L("صورة الغلاف", "Cover Image")}</div>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 text-xs font-bold text-primary cursor-pointer hover:bg-primary/10">
                    <Upload className="h-3.5 w-3.5" /> {L("رفع من الجهاز", "Upload from device")}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0])} />
                  </label>
                  <input className="flex-1 min-w-[200px] rounded-lg border border-border bg-background px-3 py-2 text-xs" placeholder={L("أو ألصق رابط https://...", "Or paste URL https://...")} value={form.cover.startsWith("data:") ? "" : form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} />
                  {form.cover && <button type="button" onClick={() => setForm({ ...form, cover: "" })} className="text-xs text-rose-600 font-bold">{L("حذف", "Delete")}</button>}
                </div>
              </div>
              {form.cover && <img src={form.cover} alt={L("معاينة", "Preview")} className="col-span-2 h-40 w-full rounded-lg object-cover border border-border" />}
              <label className="text-xs font-bold space-y-1.5 block col-span-2">{L("وصف العمل", "Description")}
                <textarea rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 block">{L("العميل", "Client")}
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 block">{L("الرابط", "Link")}
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
              </label>
              <div className="col-span-2">
                <div className="text-xs font-bold mb-1.5">{L("التقنيات المستخدمة", "Tech Stack")}</div>
                <div className="flex gap-2 mb-2">
                  <input className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder={L("مثلاً React", "e.g. React")} value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }} />
                  <button type="button" onClick={addTech} className="rounded-lg bg-primary text-primary-foreground px-3 text-xs font-bold">{L("إضافة", "Add")}</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.tech.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-1 text-[11px] font-bold">
                      {t}
                      <button type="button" onClick={() => setForm({ ...form, tech: form.tech.filter((_, x) => x !== i) })}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} /> {L("ظاهر للعرض", "Visible")}
            </label>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setOpen(false)}>{L("إلغاء", "Cancel")}</GhostButton>
            <PrimaryButton onClick={handleSave}>{editId ? L("حفظ", "Save") : L("إضافة", "Add")}</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

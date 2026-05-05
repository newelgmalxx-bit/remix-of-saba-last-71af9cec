import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { ImageIcon, Eye, EyeOff, Tag, Plus, Search, Edit, Trash2, X, Upload } from "lucide-react";
import { useState } from "react";
import { adminPortfolio, portfolioCategories, type AdminPortfolio } from "@/data/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { fileToWebp } from "@/lib/image";

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
  const [items, setItems] = useState<AdminPortfolio[]>(adminPortfolio);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [techInput, setTechInput] = useState("");

  const onPickFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("اختر صورة فقط"); return; }
    const webp = await fileToWebp(file);
    setForm((f) => ({ ...f, cover: webp }));
  };

  const filtered = items.filter(i => i.titleAr.includes(q) || i.titleEn.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id: string) => setItems(items.map(i => i.id === id ? { ...i, visible: !i.visible } : i));
  const remove = (id: string) => { setItems(items.filter(i => i.id !== id)); toast.success("تم الحذف"); };

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

  const handleSave = () => {
    if (!form.titleAr) { toast.error("العنوان مطلوب"); return; }
    if (editId) {
      setItems(items.map(i => i.id === editId ? { ...i, ...form } : i));
      toast.success("تم التحديث");
    } else {
      setItems([{ id: "p" + Date.now(), ...form }, ...items]);
      toast.success("تم إضافة العمل");
    }
    setOpen(false);
  };

  const visible = items.filter(i => i.visible).length;
  const cats = new Set(items.map(i => i.category)).size;

  return (
    <AdminLayout title="أعمالنا" subtitle="إدارة معرض الأعمال والمشاريع" action={<PrimaryButton onClick={openAdd}><Plus className="h-4 w-4" /> إضافة عمل</PrimaryButton>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="إجمالي الأعمال" value={items.length} icon={ImageIcon} accent="primary" />
        <StatCard label="منشورة" value={visible} icon={Eye} accent="emerald" />
        <StatCard label="مخفية" value={items.length - visible} icon={EyeOff} accent="muted" />
        <StatCard label="تصنيفات" value={cats} icon={Tag} accent="violet" />
      </div>

      <PanelCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن عمل..." className="w-full rounded-xl border border-border bg-background pr-10 pl-3 py-2.5 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-muted-foreground border-b border-border">
                <th className="px-3 py-3 font-medium">العمل</th>
                <th className="px-3 py-3 font-medium">التصنيف</th>
                <th className="px-3 py-3 font-medium">التقنيات</th>
                <th className="px-3 py-3 font-medium">السنة</th>
                <th className="px-3 py-3 font-medium">الظهور</th>
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
                        <div className="font-bold">{i.titleAr}</div>
                        <div className="text-[11px] text-muted-foreground">{i.titleEn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><Pill tone="primary">{i.category}</Pill></td>
                  <td className="px-3 py-3 text-[11px] text-muted-foreground">{(i.tech ?? []).slice(0, 3).join("، ")}</td>
                  <td className="px-3 py-3 text-xs" data-ltr-number>{i.year ?? "—"}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => toggle(i.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${i.visible ? "bg-primary" : "bg-muted"}`}>
                      <span className={`absolute inline-block h-5 w-5 rounded-full bg-white shadow transition ${i.visible ? "right-0.5" : "right-5"}`} />
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
        <DialogContent dir="rtl" className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "تعديل عمل" : "إضافة عمل جديد"}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold space-y-1.5 block">العنوان (عربي)
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 block">العنوان (English)
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 block">التصنيف
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {portfolioCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="text-xs font-bold space-y-1.5 block">السنة
                <input dir="ltr" inputMode="numeric" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </label>
              <div className="col-span-2 space-y-2">
                <div className="text-xs font-bold">صورة الغلاف</div>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 text-xs font-bold text-primary cursor-pointer hover:bg-primary/10">
                    <Upload className="h-3.5 w-3.5" /> رفع من الجهاز
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0])} />
                  </label>
                  <input className="flex-1 min-w-[200px] rounded-lg border border-border bg-background px-3 py-2 text-xs" placeholder="أو ألصق رابط https://..." value={form.cover.startsWith("data:") ? "" : form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} />
                  {form.cover && <button type="button" onClick={() => setForm({ ...form, cover: "" })} className="text-xs text-rose-600 font-bold">حذف</button>}
                </div>
              </div>
              {form.cover && <img src={form.cover} alt="معاينة" className="col-span-2 h-40 w-full rounded-lg object-cover border border-border" />}
              <label className="text-xs font-bold space-y-1.5 block col-span-2">وصف العمل
                <textarea rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 block">العميل
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 block">الرابط
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
              </label>
              <div className="col-span-2">
                <div className="text-xs font-bold mb-1.5">التقنيات المستخدمة</div>
                <div className="flex gap-2 mb-2">
                  <input className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="مثلاً React" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }} />
                  <button type="button" onClick={addTech} className="rounded-lg bg-primary text-primary-foreground px-3 text-xs font-bold">إضافة</button>
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
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} /> ظاهر للعرض
            </label>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setOpen(false)}>إلغاء</GhostButton>
            <PrimaryButton onClick={handleSave}>{editId ? "حفظ" : "إضافة"}</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
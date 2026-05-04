import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton } from "@/components/admin/AdminLayout";
import { ImageIcon, Eye, EyeOff, Tag, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { adminPortfolio } from "@/data/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { GhostButton } from "@/components/admin/AdminLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/portfolio")({
  head: () => ({ meta: [{ title: "أعمالنا | لوحة التحكم" }] }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [items, setItems] = useState(adminPortfolio);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const empty = { titleAr: "", titleEn: "", category: "", image: "🎨", link: "#", visible: true };
  const [form, setForm] = useState(empty);

  const filtered = items.filter(i => i.titleAr.includes(q) || i.titleEn.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id: string) => setItems(items.map(i => i.id === id ? { ...i, visible: !i.visible } : i));
  const remove = (id: string) => { setItems(items.filter(i => i.id !== id)); toast.success("تم الحذف"); };
  const openAdd = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (id: string) => {
    const it = items.find(i => i.id === id); if (!it) return;
    setEditId(id); setForm({ titleAr: it.titleAr, titleEn: it.titleEn, category: it.category, image: it.image, link: it.link, visible: it.visible });
    setOpen(true);
  };
  const handleSave = () => {
    if (!form.titleAr) { toast.error("العنوان مطلوب"); return; }
    if (editId) {
      setItems(items.map(i => i.id === editId ? { ...i, ...form } : i));
      toast.success("تم التحديث");
    } else {
      setItems([{ id: "p" + (items.length + 1 + Date.now()), ...form }, ...items]);
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
                <th className="px-3 py-3 font-medium">الرابط</th>
                <th className="px-3 py-3 font-medium">الظهور</th>
                <th className="px-3 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id} className="border-b border-border hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">{i.image}</div>
                      <div>
                        <div className="font-bold">{i.titleAr}</div>
                        <div className="text-[11px] text-muted-foreground">{i.titleEn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><Pill tone="primary">{i.category}</Pill></td>
                  <td className="px-3 py-3 text-muted-foreground text-xs">{i.link}</td>
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
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editId ? "تعديل عمل" : "إضافة عمل جديد"}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold space-y-1.5">العنوان (عربي)
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">العنوان (English)
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">التصنيف
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5">الأيقونة (Emoji)
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </label>
              <label className="text-xs font-bold space-y-1.5 col-span-2">الرابط
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
              </label>
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
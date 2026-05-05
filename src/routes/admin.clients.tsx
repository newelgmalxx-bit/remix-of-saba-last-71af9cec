import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { Users, Star, TrendingUp, ShoppingBag, Search, Plus, MoreHorizontal, Eye, Mail, Trash2, Phone, MapPin, Calendar, Globe } from "lucide-react";
import { useState } from "react";
import { adminClients as initialClients, fmtSAR, type AdminClient } from "@/data/admin";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/clients")({
  head: () => ({ meta: [{ title: "العملاء | لوحة التحكم" }] }),
  component: ClientsPage,
});

const segMap = { vip: { l: "VIP", t: "amber" as const }, regular: { l: "منتظم", t: "primary" as const }, new: { l: "جديد", t: "emerald" as const } };

const growth = [
  { m: "يون", n: 4, r: 8 }, { m: "يول", n: 6, r: 10 }, { m: "أغس", n: 7, r: 12 },
  { m: "سبت", n: 9, r: 15 }, { m: "أكت", n: 11, r: 18 }, { m: "نوف", n: 10, r: 22 },
  { m: "ديس", n: 14, r: 25 }, { m: "ينا", n: 12, r: 28 }, { m: "فبر", n: 15, r: 32 },
];

type AddForm = { name: string; email: string; phone: string; city: string; region: string; language: string; address: string; segment: AdminClient["segment"]; notes: string };
const emptyAdd: AddForm = { name: "", email: "", phone: "", city: "", region: "", language: "العربية", address: "", segment: "new", notes: "" };

function ClientsPage() {
  const [clients, setClients] = useState<AdminClient[]>(initialClients);
  const [tab, setTab] = useState<"all" | "vip" | "regular" | "new">("all");
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [add, setAdd] = useState<AddForm>(emptyAdd);
  const [viewing, setViewing] = useState<AdminClient | null>(null);

  const filtered = clients.filter(c =>
    (tab === "all" || c.segment === tab) && (c.name.includes(q) || c.email.toLowerCase().includes(q.toLowerCase()))
  );

  const handleAdd = () => {
    if (!add.name || !add.email) { toast.error("الاسم والبريد مطلوبان"); return; }
    const month = new Date().toLocaleDateString("ar-SA", { month: "long", year: "numeric" });
    setClients([
      { id: "c" + Date.now(), name: add.name, email: add.email, phone: add.phone, orders: 0, totalSpent: 0,
        segment: add.segment, joinedAt: month, region: add.region, city: add.city, language: add.language, address: add.address, notes: add.notes },
      ...clients,
    ]);
    setAdd(emptyAdd); setAddOpen(false);
    toast.success("تم إضافة العميل");
  };

  const remove = (id: string) => { setClients(clients.filter(c => c.id !== id)); toast.success("تم حذف العميل"); };

  return (
    <AdminLayout title="العملاء" subtitle="رؤى وشرائح وإحصائيات الاحتفاظ بالعملاء" action={<PrimaryButton onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> إضافة عميل</PrimaryButton>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="إجمالي العملاء" value={clients.length} icon={Users} accent="emerald" />
        <StatCard label="عملاء VIP" value={clients.filter(c => c.segment === "vip").length} icon={Star} accent="amber" />
        <StatCard label="معدل النمو" value="+23.1%" icon={TrendingUp} accent="primary" />
        <StatCard label="متوسط الطلب" value={fmtSAR(1420)} icon={ShoppingBag} accent="violet" />
      </div>

      <PanelCard title="نمو العملاء" subtitle="جدد مقابل عائدين عبر الوقت" className="mb-6">
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3ebf3" />
              <XAxis dataKey="m" stroke="#7c8aa0" fontSize={12} />
              <YAxis stroke="#7c8aa0" fontSize={12} />
              <Tooltip />
              <Bar dataKey="r" name="عائدون" fill="#1E5B94" radius={[6, 6, 0, 0]} />
              <Bar dataKey="n" name="جدد" fill="#9bc4e8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </PanelCard>

      <PanelCard>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن العملاء..." className="w-full rounded-xl border border-border bg-background pr-10 pl-3 py-2.5 text-sm" />
          </div>
          <div className="inline-flex rounded-xl border border-border bg-background p-1">
            {[["all", "الكل"], ["vip", "VIP"], ["regular", "منتظم"], ["new", "جدد"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-muted-foreground border-b border-border">
                <th className="px-3 py-3 font-medium">العميل</th>
                <th className="px-3 py-3 font-medium">البريد</th>
                <th className="px-3 py-3 font-medium">الجوال</th>
                <th className="px-3 py-3 font-medium">المدينة</th>
                <th className="px-3 py-3 font-medium">الطلبات</th>
                <th className="px-3 py-3 font-medium">إجمالي الإنفاق</th>
                <th className="px-3 py-3 font-medium">الشريحة</th>
                <th className="px-3 py-3 font-medium">الانضمام</th>
                <th className="px-3 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const s = segMap[c.segment];
                const initials = c.name.split(" ").map(n => n[0]).slice(0, 2).join("");
                return (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/40">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">{initials}</div>
                        <div>
                          <div className="font-bold">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground" dir="ltr">{c.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{c.email}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground" dir="ltr">{c.phone}</td>
                    <td className="px-3 py-3 text-xs">{c.city ?? "—"}</td>
                    <td className="px-3 py-3" data-ltr-number>{c.orders}</td>
                    <td className="px-3 py-3 font-bold" data-ltr-number>{fmtSAR(c.totalSpent)}</td>
                    <td className="px-3 py-3"><Pill tone={s.t}>{s.l}</Pill></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground" data-ltr-number>{c.joinedAt}</td>
                    <td className="px-3 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewing(c)}><Eye className="ml-2 h-4 w-4" /> عرض التفاصيل</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { window.location.href = `mailto:${c.email}`; }}><Mail className="ml-2 h-4 w-4" /> إرسال بريد</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => remove(c.id)} className="text-rose-600 focus:text-rose-600"><Trash2 className="ml-2 h-4 w-4" /> حذف العميل</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {/* Add client */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent dir="rtl" className="max-w-xl">
          <DialogHeader><DialogTitle>إضافة عميل جديد</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Lbl label="الاسم الكامل"><input className={ic} value={add.name} onChange={e => setAdd({ ...add, name: e.target.value })} /></Lbl>
            <Lbl label="رقم الجوال"><input type="tel" inputMode="tel" className={ic} dir="ltr" value={add.phone} onChange={e => setAdd({ ...add, phone: e.target.value })} /></Lbl>
            <Lbl label="البريد الإلكتروني"><input type="email" className={ic} value={add.email} onChange={e => setAdd({ ...add, email: e.target.value })} /></Lbl>
            <Lbl label="المدينة"><input className={ic} value={add.city} onChange={e => setAdd({ ...add, city: e.target.value })} /></Lbl>
            <Lbl label="المنطقة / الدولة"><input className={ic} value={add.region} onChange={e => setAdd({ ...add, region: e.target.value })} /></Lbl>
            <Lbl label="اللغة المفضلة">
              <input className={ic} value={add.language} onChange={e => setAdd({ ...add, language: e.target.value })} />
            </Lbl>
            <Lbl label="الشريحة">
              <select className={ic} value={add.segment} onChange={e => setAdd({ ...add, segment: e.target.value as any })}>
                <option value="new">جديد</option><option value="regular">منتظم</option><option value="vip">VIP</option>
              </select>
            </Lbl>
            <Lbl label="العنوان" full><input className={ic} value={add.address} onChange={e => setAdd({ ...add, address: e.target.value })} /></Lbl>
            <Lbl label="ملاحظات" full><textarea rows={2} className={ic} value={add.notes} onChange={e => setAdd({ ...add, notes: e.target.value })} /></Lbl>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setAddOpen(false)}>إلغاء</GhostButton>
            <PrimaryButton onClick={handleAdd}>إضافة</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View client */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent dir="rtl" className="max-w-xl">
          <DialogHeader><DialogTitle>تفاصيل العميل</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {viewing.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="font-bold text-base">{viewing.name}</div>
                  <Pill tone={segMap[viewing.segment].t}>{segMap[viewing.segment].l}</Pill>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info icon={Mail} label="البريد" value={viewing.email} />
                <Info icon={Phone} label="الجوال" value={viewing.phone} />
                <Info icon={MapPin} label="المدينة" value={viewing.city ?? "—"} />
                <Info icon={MapPin} label="المنطقة" value={viewing.region ?? "—"} />
                <Info icon={Globe} label="اللغة" value={viewing.language ?? "—"} />
                <Info icon={MapPin} label="العنوان" value={viewing.address ?? "—"} />
                <Info icon={Calendar} label="الانضمام" value={viewing.joinedAt} />
                <Info icon={ShoppingBag} label="عدد الطلبات" value={String(viewing.orders)} />
                <Info icon={Star} label="إجمالي الإنفاق" value={fmtSAR(viewing.totalSpent)} />
              </div>
              {viewing.notes && (
                <div className="rounded-xl bg-muted/50 p-3 text-sm">
                  <div className="text-[11px] font-bold text-muted-foreground mb-1">ملاحظات</div>
                  {viewing.notes}
                </div>
              )}
            </div>
          )}
          <DialogFooter><GhostButton onClick={() => setViewing(null)}>إغلاق</GhostButton></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function Lbl({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`text-xs font-bold space-y-1.5 block ${full ? "col-span-2" : ""}`}>{label}{children}</label>;
}
function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  const ltr = label.includes("الجوال") || label.includes("عدد") || label.includes("إجمالي");

  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div dir={ltr ? "ltr" : undefined} className="font-medium truncate">{value}</div>
      </div>
    </div>
  );
}
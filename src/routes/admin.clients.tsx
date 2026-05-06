import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { Users, Star, TrendingUp, ShoppingBag, Search, Plus, MoreHorizontal, Eye, Mail, Trash2, Phone, MapPin, Calendar, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { fmtSAR, type AdminClient } from "@/data/admin";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api";

export const Route = createFileRoute("/admin/clients")({
  head: () => ({ meta: [{ title: "العملاء | لوحة التحكم" }] }),
  component: ClientsPage,
});

type AddForm = { name: string; email: string; phone: string; city: string; region: string; language: string; address: string; segment: AdminClient["segment"]; notes: string };
const emptyAdd: AddForm = { name: "", email: "", phone: "", city: "", region: "", language: "العربية", address: "", segment: "new", notes: "" };

function ClientsPage() {
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const segMap = {
    vip: { l: "VIP", t: "amber" as const },
    regular: { l: L("منتظم", "Regular"), t: "primary" as const },
    new: { l: L("جديد", "New"), t: "emerald" as const },
  };

  const [clients, setClients] = useState<AdminClient[]>([]);
  const [growthRate, setGrowthRate] = useState<string>("0%");
  const [avgOrder, setAvgOrder] = useState<number>(0);
  const [growthSeries, setGrowthSeries] = useState<{ m: string; n: number; r: number }[]>([]);
  const [tab, setTab] = useState<"all" | "vip" | "regular" | "new">("all");
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [add, setAdd] = useState<AddForm>(emptyAdd);
  const [viewing, setViewing] = useState<AdminClient | null>(null);

  useEffect(() => {
    Promise.all([
      adminApi.clients.list({ limit: 200 }).catch(() => ({ items: [] })),
      adminApi.invoices.list({ limit: 500 }).catch(() => ({ items: [] })),
      adminApi.orders.list({ limit: 500 }).catch(() => ({ items: [] })),
    ]).then(([cp, ip, op]: any) => {
      const invoices: any[] = ip?.items || [];
      const orders: any[] = op?.items || [];
      // Aggregate per-client from orders + invoices, matching by email OR name
      const byEmail = new Map<string, { orders: number; spent: number }>();
      const byName = new Map<string, { orders: number; spent: number }>();
      const bump = (m: Map<string, any>, key: string, amount: number) => {
        if (!key) return;
        const k = key.trim().toLowerCase();
        if (!k) return;
        const cur = m.get(k) || { orders: 0, spent: 0 };
        cur.orders += 1;
        cur.spent += Number(amount) || 0;
        m.set(k, cur);
      };
      const sources = [
        ...orders.map((o) => ({ email: o.client_email || o.email || o.user_email, name: o.client_name || o.client, total: o.total ?? o.amount, paid: true })),
        ...invoices.map((i) => ({ email: i.client_email, name: i.client_name, total: i.total, paid: i.status === "paid" })),
      ];
      sources.forEach((s) => {
        bump(byEmail, String(s.email || ""), Number(s.total) || 0);
        bump(byName, String(s.name || ""), Number(s.total) || 0);
      });
      const items: AdminClient[] = (cp.items || []).map((c: any) => {
        const a =
          byEmail.get((c.email || "").trim().toLowerCase()) ||
          byName.get((c.name || "").trim().toLowerCase()) ||
          { orders: 0, spent: 0 };
        return {
          id: c.id, name: c.name, email: c.email, phone: c.phone ?? "",
          orders: Number(c.orders) || a.orders,
          totalSpent: Number(c.totalSpent) || a.spent,
          segment: (c.segment as any) || "new",
          joinedAt: (c.joinedAt || "").slice(0, 10) || "—",
          city: c.city ?? undefined,
          _joinedRaw: c.joinedAt || "",
        };
      });
      setClients(items);
      // Build client-growth series from joinedAt months if backend didn't supply it
      const monthMap = new Map<string, number>();
      (cp.items || []).forEach((c: any) => {
        const m = (c.joinedAt || "").slice(0, 7);
        if (m) monthMap.set(m, (monthMap.get(m) || 0) + 1);
      });
      const series = Array.from(monthMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([m, n]) => ({ m, n, r: 0 }));
      if (series.length) setGrowthSeries((prev) => (prev.length ? prev : series));
    });
    adminApi.analytics().then((a: any) => {
      if (!a) return;
      setGrowthRate(`${a.growthRate ?? 0}%`);
      setAvgOrder(Number(a.avgOrder) || 0);
      if (Array.isArray(a.clientGrowth)) setGrowthSeries(a.clientGrowth);
    }).catch(() => {});
  }, []);

  const filtered = clients.filter(c =>
    (tab === "all" || c.segment === tab) && (c.name.includes(q) || c.email.toLowerCase().includes(q.toLowerCase()))
  );

  const handleAdd = async () => {
    if (!add.name || !add.email) { toast.error(L("الاسم والبريد مطلوبان", "Name and email are required")); return; }
    let id = "c" + Date.now();
    try {
      const res = await adminApi.clients.create({ name: add.name, email: add.email, phone: add.phone, segment: add.segment as any });
      id = res.id;
    } catch { /* tolerate */ }
    const month = new Date().toLocaleDateString(lang === "en" ? "en-US" : "ar-SA", { month: "long", year: "numeric" });
    setClients([
      { id, name: add.name, email: add.email, phone: add.phone, orders: 0, totalSpent: 0,
        segment: add.segment, joinedAt: month, region: add.region, city: add.city, language: add.language, address: add.address, notes: add.notes },
      ...clients,
    ]);
    setAdd(emptyAdd); setAddOpen(false);
    toast.success(L("تم إضافة العميل", "Client added"));
  };

  const remove = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    adminApi.clients.remove(id).catch(() => {});
    toast.success(L("تم حذف العميل", "Client deleted"));
  };

  const startSide = dir === "rtl" ? "right-3" : "left-3";
  const padStart = dir === "rtl" ? "pr-10 pl-3" : "pl-10 pr-3";
  const textAlign = dir === "rtl" ? "text-right" : "text-left";
  const iconMargin = dir === "rtl" ? "ml-2" : "mr-2";

  return (
    <AdminLayout title={L("العملاء", "Clients")} subtitle={L("رؤى وشرائح وإحصائيات الاحتفاظ بالعملاء", "Insights, segments and retention stats")} action={<PrimaryButton onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> {L("إضافة عميل", "Add Client")}</PrimaryButton>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("إجمالي العملاء", "Total Clients")} value={clients.length} icon={Users} accent="emerald" />
        <StatCard label={L("عملاء VIP", "VIP Clients")} value={clients.filter(c => c.segment === "vip").length} icon={Star} accent="amber" />
        <StatCard label={L("معدل النمو", "Growth Rate")} value={growthRate} icon={TrendingUp} accent="primary" />
        <StatCard label={L("متوسط الطلب", "Avg. Order")} value={fmtSAR(avgOrder)} icon={ShoppingBag} accent="violet" />
      </div>

      <PanelCard title={L("نمو العملاء", "Client Growth")} subtitle={L("جدد مقابل عائدين عبر الوقت", "New vs returning over time")} className="mb-6">
        <div className="h-64">
          {growthSeries.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{L("لا توجد بيانات بعد", "No data yet")}</div>
          ) : (
          <ResponsiveContainer>
            <BarChart data={growthSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3ebf3" />
              <XAxis dataKey="m" stroke="#7c8aa0" fontSize={12} />
              <YAxis stroke="#7c8aa0" fontSize={12} />
              <Tooltip />
              <Bar dataKey="r" name={L("عائدون", "Returning")} fill="#1E5B94" radius={[6, 6, 0, 0]} />
              <Bar dataKey="n" name={L("جدد", "New")} fill="#9bc4e8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>
      </PanelCard>

      <PanelCard>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute ${startSide} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("ابحث عن العملاء...", "Search clients...")} className={`w-full rounded-xl border border-border bg-background ${padStart} py-2.5 text-sm`} />
          </div>
          <div className="inline-flex rounded-xl border border-border bg-background p-1">
            {[["all", L("الكل", "All")], ["vip", "VIP"], ["regular", L("منتظم", "Regular")], ["new", L("جدد", "New")]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className={`${textAlign} text-xs text-muted-foreground border-b border-border`}>
                <th className="px-3 py-3 font-medium">{L("العميل", "Client")}</th>
                <th className="px-3 py-3 font-medium">{L("البريد", "Email")}</th>
                <th className="px-3 py-3 font-medium">{L("الجوال", "Phone")}</th>
                <th className="px-3 py-3 font-medium">{L("المدينة", "City")}</th>
                <th className="px-3 py-3 font-medium">{L("الطلبات", "Orders")}</th>
                <th className="px-3 py-3 font-medium">{L("إجمالي الإنفاق", "Total Spent")}</th>
                <th className="px-3 py-3 font-medium">{L("الشريحة", "Segment")}</th>
                <th className="px-3 py-3 font-medium">{L("الانضمام", "Joined")}</th>
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
                          <DropdownMenuItem onClick={() => setViewing(c)}><Eye className={`${iconMargin} h-4 w-4`} /> {L("عرض التفاصيل", "View details")}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { window.location.href = `mailto:${c.email}`; }}><Mail className={`${iconMargin} h-4 w-4`} /> {L("إرسال بريد", "Send email")}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => remove(c.id)} className="text-rose-600 focus:text-rose-600"><Trash2 className={`${iconMargin} h-4 w-4`} /> {L("حذف العميل", "Delete client")}</DropdownMenuItem>
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
        <DialogContent dir={dir} className="max-w-xl">
          <DialogHeader><DialogTitle>{L("إضافة عميل جديد", "Add New Client")}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Lbl label={L("الاسم الكامل", "Full Name")}><input className={ic} value={add.name} onChange={e => setAdd({ ...add, name: e.target.value })} /></Lbl>
            <Lbl label={L("رقم الجوال", "Phone")}><input type="tel" inputMode="tel" className={ic} dir="ltr" value={add.phone} onChange={e => setAdd({ ...add, phone: e.target.value })} /></Lbl>
            <Lbl label={L("البريد الإلكتروني", "Email")}><input type="email" className={ic} value={add.email} onChange={e => setAdd({ ...add, email: e.target.value })} /></Lbl>
            <Lbl label={L("المدينة", "City")}><input className={ic} value={add.city} onChange={e => setAdd({ ...add, city: e.target.value })} /></Lbl>
            <Lbl label={L("المنطقة / الدولة", "Region / Country")}><input className={ic} value={add.region} onChange={e => setAdd({ ...add, region: e.target.value })} /></Lbl>
            <Lbl label={L("اللغة المفضلة", "Preferred Language")}>
              <input className={ic} value={add.language} onChange={e => setAdd({ ...add, language: e.target.value })} />
            </Lbl>
            <Lbl label={L("الشريحة", "Segment")}>
              <select className={ic} value={add.segment} onChange={e => setAdd({ ...add, segment: e.target.value as any })}>
                <option value="new">{L("جديد", "New")}</option><option value="regular">{L("منتظم", "Regular")}</option><option value="vip">VIP</option>
              </select>
            </Lbl>
            <Lbl label={L("العنوان", "Address")} full><input className={ic} value={add.address} onChange={e => setAdd({ ...add, address: e.target.value })} /></Lbl>
            <Lbl label={L("ملاحظات", "Notes")} full><textarea rows={2} className={ic} value={add.notes} onChange={e => setAdd({ ...add, notes: e.target.value })} /></Lbl>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setAddOpen(false)}>{L("إلغاء", "Cancel")}</GhostButton>
            <PrimaryButton onClick={handleAdd}>{L("إضافة", "Add")}</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View client */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent dir={dir} className="max-w-xl">
          <DialogHeader><DialogTitle>{L("تفاصيل العميل", "Client Details")}</DialogTitle></DialogHeader>
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
                <Info icon={Mail} label={L("البريد", "Email")} value={viewing.email} />
                <Info icon={Phone} label={L("الجوال", "Phone")} value={viewing.phone} ltr />
                <Info icon={MapPin} label={L("المدينة", "City")} value={viewing.city ?? "—"} />
                <Info icon={MapPin} label={L("المنطقة", "Region")} value={viewing.region ?? "—"} />
                <Info icon={Globe} label={L("اللغة", "Language")} value={viewing.language ?? "—"} />
                <Info icon={MapPin} label={L("العنوان", "Address")} value={viewing.address ?? "—"} />
                <Info icon={Calendar} label={L("الانضمام", "Joined")} value={viewing.joinedAt} />
                <Info icon={ShoppingBag} label={L("عدد الطلبات", "Orders")} value={String(viewing.orders)} ltr />
                <Info icon={Star} label={L("إجمالي الإنفاق", "Total Spent")} value={fmtSAR(viewing.totalSpent)} ltr />
              </div>
              {viewing.notes && (
                <div className="rounded-xl bg-muted/50 p-3 text-sm">
                  <div className="text-[11px] font-bold text-muted-foreground mb-1">{L("ملاحظات", "Notes")}</div>
                  {viewing.notes}
                </div>
              )}
            </div>
          )}
          <DialogFooter><GhostButton onClick={() => setViewing(null)}>{L("إغلاق", "Close")}</GhostButton></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function Lbl({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`text-xs font-bold space-y-1.5 block ${full ? "col-span-2" : ""}`}>{label}{children}</label>;
}
function Info({ icon: Icon, label, value, ltr }: { icon: any; label: string; value: React.ReactNode; ltr?: boolean }) {
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

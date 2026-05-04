import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, StatCard, PanelCard, Pill, PrimaryButton } from "@/components/admin/AdminLayout";
import { Users, Star, TrendingUp, ShoppingBag, Search, Plus, MoreHorizontal, Eye, Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import { adminClients, fmtSAR } from "@/data/admin";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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

function ClientsPage() {
  const [tab, setTab] = useState<"all" | "vip" | "regular" | "new">("all");
  const [q, setQ] = useState("");
  const filtered = adminClients.filter(c =>
    (tab === "all" || c.segment === tab) && (c.name.includes(q) || c.email.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AdminLayout title="العملاء" subtitle="رؤى وشرائح وإحصائيات الاحتفاظ بالعملاء" action={<PrimaryButton><Plus className="h-4 w-4" /> إضافة عميل</PrimaryButton>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="إجمالي العملاء" value={96} icon={Users} accent="emerald" />
        <StatCard label="عملاء VIP" value={14} icon={Star} accent="amber" />
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
                          <div className="text-[11px] text-muted-foreground">{c.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{c.email}</td>
                    <td className="px-3 py-3">{c.orders}</td>
                    <td className="px-3 py-3 font-bold">{fmtSAR(c.totalSpent)}</td>
                    <td className="px-3 py-3"><Pill tone={s.t}>{s.l}</Pill></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{c.joinedAt}</td>
                    <td className="px-3 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info(`عرض بيانات: ${c.name}`)}><Eye className="ml-2 h-4 w-4" /> عرض التفاصيل</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { window.location.href = `mailto:${c.email}`; }}><Mail className="ml-2 h-4 w-4" /> إرسال بريد</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toast.success("تم الحذف")} className="text-rose-600 focus:text-rose-600"><Trash2 className="ml-2 h-4 w-4" /> حذف العميل</DropdownMenuItem>
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
    </AdminLayout>
  );
}
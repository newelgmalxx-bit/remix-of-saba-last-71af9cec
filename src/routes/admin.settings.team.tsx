import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton, Pill } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Check, Users2 } from "lucide-react";
import { adminUsers } from "@/data/admin";

export const Route = createFileRoute("/admin/settings/team")({
  head: () => ({ meta: [{ title: "الفريق والصلاحيات | الإعدادات" }] }),
  component: TeamPage,
});

const roles = [
  { key: "owner", label: "مالك", desc: "صلاحيات كاملة بما فيها الفوترة وحذف الحساب", tone: "amber" as const },
  { key: "admin", label: "مدير", desc: "إدارة كل المحتوى والإعدادات والمستخدمين", tone: "primary" as const },
  { key: "manager", label: "مشرف", desc: "إدارة الطلبات والعملاء والخدمات بدون إعدادات حسّاسة", tone: "violet" as const },
  { key: "support", label: "دعم", desc: "عرض الطلبات والرد على العملاء فقط", tone: "emerald" as const },
];

const matrix = [
  { feature: "لوحة التحكم", owner: true, admin: true, manager: true, support: true },
  { feature: "إدارة الخدمات", owner: true, admin: true, manager: true, support: false },
  { feature: "إدارة الطلبات", owner: true, admin: true, manager: true, support: true },
  { feature: "إدارة الفواتير", owner: true, admin: true, manager: true, support: false },
  { feature: "إدارة العملاء", owner: true, admin: true, manager: true, support: true },
  { feature: "إدارة المستخدمين", owner: true, admin: true, manager: false, support: false },
  { feature: "إعدادات الموقع/SEO", owner: true, admin: true, manager: false, support: false },
  { feature: "إعدادات الدفع/API", owner: true, admin: false, manager: false, support: false },
];

function TeamPage() {
  const [tab, setTab] = useState<"members" | "roles">("members");
  return (
    <AdminLayout title="الإعدادات" subtitle="الفريق والصلاحيات" action={<Link to="/admin/users" className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold">إدارة المستخدمين</Link>}>
      <div className="mb-6 inline-flex rounded-xl border border-border bg-card p-1">
        {[["members", "الأعضاء"], ["roles", "الأدوار والصلاحيات"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${tab === k ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>{l}</button>
        ))}
      </div>

      {tab === "members" && (
        <PanelCard title="أعضاء الفريق" subtitle={`${adminUsers.length} مستخدم`} action={<Link to="/admin/users" className="text-xs font-bold text-primary hover:underline">إدارة كاملة ←</Link>}>
          <div className="space-y-2">
            {adminUsers.map(u => {
              const initials = u.name.split(" ").map(n => n[0]).slice(0, 2).join("");
              const role = roles.find(r => r.key === u.role)!;
              return (
                <div key={u.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">{initials}</div>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{u.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Pill tone={role.tone}>{role.label}</Pill>
                    <Pill tone={u.active ? "emerald" : "muted"}>{u.active ? "نشط" : "موقوف"}</Pill>
                  </div>
                </div>
              );
            })}
          </div>
        </PanelCard>
      )}

      {tab === "roles" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {roles.map(r => (
              <div key={r.key} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Users2 className="h-4 w-4" /></div>
                  <Pill tone={r.tone}>{r.label}</Pill>
                </div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </div>
            ))}
          </div>
          <PanelCard title="مصفوفة الصلاحيات">
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right text-xs text-muted-foreground border-b border-border">
                    <th className="px-3 py-3 font-medium">الميزة</th>
                    {roles.map(r => <th key={r.key} className="px-3 py-3 font-medium text-center">{r.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map(m => (
                    <tr key={m.feature} className="border-b border-border">
                      <td className="px-3 py-3 font-medium">{m.feature}</td>
                      {(["owner","admin","manager","support"] as const).map(k => (
                        <td key={k} className="px-3 py-3 text-center">
                          {m[k] ? <Check className="inline h-4 w-4 text-emerald-600" /> : <span className="text-muted-foreground">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PanelCard>
        </>
      )}
    </AdminLayout>
  );
}
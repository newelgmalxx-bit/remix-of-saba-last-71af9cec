import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton, Pill, GhostButton, StatCard } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Plus, Trash2, Edit, UserCheck, Users, Shield, ShieldCheck } from "lucide-react";
import { adminUsers as initial, type AdminUser } from "@/data/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "إدارة المستخدمين | لوحة التحكم" }] }),
  component: UsersPage,
});

type Form = { name: string; email: string; phone: string; role: AdminUser["role"]; active: boolean; password: string };
const empty: Form = { name: "", email: "", phone: "", role: "support", active: true, password: "" };

function UsersPage() {
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const roleMap = {
    owner: { l: L("مالك", "Owner"), t: "amber" as const },
    admin: { l: L("مدير", "Admin"), t: "primary" as const },
    manager: { l: L("مشرف", "Manager"), t: "violet" as const },
    support: { l: L("دعم", "Support"), t: "emerald" as const },
  };
  const [users, setUsers] = useState<AdminUser[]>(initial);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [f, setF] = useState<Form>(empty);

  const openAdd = () => { setEditId(null); setF(empty); setOpen(true); };
  const openEdit = (u: AdminUser) => { setEditId(u.id); setF({ name: u.name, email: u.email, phone: u.phone, role: u.role, active: u.active, password: "" }); setOpen(true); };

  const save = () => {
    if (!f.name || !f.email) { toast.error(L("الاسم والبريد مطلوبان", "Name and email are required")); return; }
    if (editId) {
      setUsers(users.map(u => u.id === editId ? { ...u, name: f.name, email: f.email, phone: f.phone, role: f.role, active: f.active } : u));
      toast.success(L("تم التحديث", "Updated"));
    } else {
      setUsers([{ id: "u" + Date.now(), name: f.name, email: f.email, phone: f.phone, role: f.role, active: f.active, joinedAt: new Date().toLocaleDateString(lang === "en" ? "en-US" : "ar-SA") }, ...users]);
      toast.success(L("تم إضافة المستخدم", "User added"));
    }
    setOpen(false);
  };
  const remove = (id: string) => { setUsers(users.filter(u => u.id !== id)); toast.success(L("تم الحذف", "Deleted")); };
  const toggle = (id: string) => setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  const knobOn = dir === "rtl" ? "right-0.5" : "left-0.5";
  const knobOff = dir === "rtl" ? "right-5" : "left-5";
  const textAlign = dir === "rtl" ? "text-right" : "text-left";

  return (
    <AdminLayout title={L("إدارة المستخدمين", "User Management")} subtitle={L("إدارة فريق العمل والصلاحيات", "Manage team and permissions")} action={<PrimaryButton onClick={openAdd}><Plus className="h-4 w-4" /> {L("إضافة مستخدم", "Add User")}</PrimaryButton>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={L("إجمالي المستخدمين", "Total Users")} value={users.length} icon={Users} accent="primary" />
        <StatCard label={L("نشطون", "Active")} value={users.filter(u => u.active).length} icon={UserCheck} accent="emerald" />
        <StatCard label={L("مدراء", "Admins")} value={users.filter(u => u.role === "admin" || u.role === "owner").length} icon={ShieldCheck} accent="amber" />
        <StatCard label={L("موقوفون", "Suspended")} value={users.filter(u => !u.active).length} icon={Shield} accent="rose" />
      </div>

      <PanelCard>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className={`${textAlign} text-xs text-muted-foreground border-b border-border`}>
                <th className="px-3 py-3 font-medium">{L("المستخدم", "User")}</th>
                <th className="px-3 py-3 font-medium">{L("البريد", "Email")}</th>
                <th className="px-3 py-3 font-medium">{L("الجوال", "Phone")}</th>
                <th className="px-3 py-3 font-medium">{L("الدور", "Role")}</th>
                <th className="px-3 py-3 font-medium">{L("الحالة", "Status")}</th>
                <th className="px-3 py-3 font-medium">{L("انضم", "Joined")}</th>
                <th className="px-3 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const r = roleMap[u.role];
                const initials = u.name.split(" ").map(n => n[0]).slice(0, 2).join("");
                return (
                  <tr key={u.id} className="border-b border-border hover:bg-muted/40">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">{initials}</div>
                        <div className="font-bold">{u.name}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground" dir="ltr">{u.phone}</td>
                    <td className="px-3 py-3"><Pill tone={r.t}>{r.l}</Pill></td>
                    <td className="px-3 py-3">
                      <button onClick={() => toggle(u.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${u.active ? "bg-emerald-500" : "bg-muted"}`}>
                        <span className={`absolute inline-block h-5 w-5 rounded-full bg-white shadow transition ${u.active ? knobOn : knobOff}`} />
                      </button>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground" data-ltr-number>{u.joinedAt}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(u)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-primary"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => remove(u.id)} disabled={u.role === "owner"} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
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
        <DialogContent dir={dir} className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? L("تعديل مستخدم", "Edit User") : L("إضافة مستخدم جديد", "Add New User")}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Lb label={L("الاسم", "Name")}><input className={ic} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></Lb>
            <Lb label={L("البريد", "Email")}><input className={ic} value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></Lb>
            <Lb label={L("الجوال", "Phone")}><input type="tel" inputMode="tel" className={ic} dir="ltr" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></Lb>
            <Lb label={L("الدور", "Role")}>
              <select className={ic} value={f.role} onChange={e => setF({ ...f, role: e.target.value as any })}>
                <option value="admin">{L("مدير", "Admin")}</option><option value="manager">{L("مشرف", "Manager")}</option><option value="support">{L("دعم", "Support")}</option><option value="owner">{L("مالك", "Owner")}</option>
              </select>
            </Lb>
            {!editId && <Lb label={L("كلمة المرور", "Password")} full><input type="password" className={ic} value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></Lb>}
            <Lb label={L("الحالة", "Status")} full>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={f.active} onChange={e => setF({ ...f, active: e.target.checked })} /> {L("نشط", "Active")}</label>
            </Lb>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setOpen(false)}>{L("إلغاء", "Cancel")}</GhostButton>
            <PrimaryButton onClick={save}>{editId ? L("حفظ", "Save") : L("إضافة", "Add")}</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function Lb({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`text-xs font-bold space-y-1.5 block ${full ? "col-span-2" : ""}`}>{label}{children}</label>;
}

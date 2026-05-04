import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton, Pill, GhostButton, StatCard } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Plus, Trash2, Edit, UserCheck, Users, Shield, ShieldCheck } from "lucide-react";
import { adminUsers as initial, type AdminUser } from "@/data/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "إدارة المستخدمين | لوحة التحكم" }] }),
  component: UsersPage,
});

const roleMap = {
  owner: { l: "مالك", t: "amber" as const },
  admin: { l: "مدير", t: "primary" as const },
  manager: { l: "مشرف", t: "violet" as const },
  support: { l: "دعم", t: "emerald" as const },
};

type Form = { name: string; email: string; phone: string; role: AdminUser["role"]; active: boolean; password: string };
const empty: Form = { name: "", email: "", phone: "", role: "support", active: true, password: "" };

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(initial);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [f, setF] = useState<Form>(empty);

  const openAdd = () => { setEditId(null); setF(empty); setOpen(true); };
  const openEdit = (u: AdminUser) => { setEditId(u.id); setF({ name: u.name, email: u.email, phone: u.phone, role: u.role, active: u.active, password: "" }); setOpen(true); };

  const save = () => {
    if (!f.name || !f.email) { toast.error("الاسم والبريد مطلوبان"); return; }
    if (editId) {
      setUsers(users.map(u => u.id === editId ? { ...u, name: f.name, email: f.email, phone: f.phone, role: f.role, active: f.active } : u));
      toast.success("تم التحديث");
    } else {
      setUsers([{ id: "u" + Date.now(), name: f.name, email: f.email, phone: f.phone, role: f.role, active: f.active, joinedAt: new Date().toLocaleDateString("ar-SA") }, ...users]);
      toast.success("تم إضافة المستخدم");
    }
    setOpen(false);
  };
  const remove = (id: string) => { setUsers(users.filter(u => u.id !== id)); toast.success("تم الحذف"); };
  const toggle = (id: string) => setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));

  return (
    <AdminLayout title="إدارة المستخدمين" subtitle="إدارة فريق العمل والصلاحيات" action={<PrimaryButton onClick={openAdd}><Plus className="h-4 w-4" /> إضافة مستخدم</PrimaryButton>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="إجمالي المستخدمين" value={users.length} icon={Users} accent="primary" />
        <StatCard label="نشطون" value={users.filter(u => u.active).length} icon={UserCheck} accent="emerald" />
        <StatCard label="مدراء" value={users.filter(u => u.role === "admin" || u.role === "owner").length} icon={ShieldCheck} accent="amber" />
        <StatCard label="موقوفون" value={users.filter(u => !u.active).length} icon={Shield} accent="rose" />
      </div>

      <PanelCard>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-muted-foreground border-b border-border">
                <th className="px-3 py-3 font-medium">المستخدم</th>
                <th className="px-3 py-3 font-medium">البريد</th>
                <th className="px-3 py-3 font-medium">الجوال</th>
                <th className="px-3 py-3 font-medium">الدور</th>
                <th className="px-3 py-3 font-medium">الحالة</th>
                <th className="px-3 py-3 font-medium">انضم</th>
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
                        <span className={`absolute inline-block h-5 w-5 rounded-full bg-white shadow transition ${u.active ? "right-0.5" : "right-5"}`} />
                      </button>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{u.joinedAt}</td>
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
        <DialogContent dir="rtl" className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? "تعديل مستخدم" : "إضافة مستخدم جديد"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <L label="الاسم"><input className={ic} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></L>
            <L label="البريد"><input className={ic} value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></L>
            <L label="الجوال"><input className={ic} dir="ltr" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></L>
            <L label="الدور">
              <select className={ic} value={f.role} onChange={e => setF({ ...f, role: e.target.value as any })}>
                <option value="admin">مدير</option><option value="manager">مشرف</option><option value="support">دعم</option><option value="owner">مالك</option>
              </select>
            </L>
            {!editId && <L label="كلمة المرور" full><input type="password" className={ic} value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></L>}
            <L label="الحالة" full>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={f.active} onChange={e => setF({ ...f, active: e.target.checked })} /> نشط</label>
            </L>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <GhostButton onClick={() => setOpen(false)}>إلغاء</GhostButton>
            <PrimaryButton onClick={save}>{editId ? "حفظ" : "إضافة"}</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function L({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`text-xs font-bold space-y-1.5 block ${full ? "col-span-2" : ""}`}>{label}{children}</label>;
}
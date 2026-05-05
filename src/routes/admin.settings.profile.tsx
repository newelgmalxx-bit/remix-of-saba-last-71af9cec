import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton, GhostButton, Pill } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Upload, Camera, Mail, Phone, Lock } from "lucide-react";
import { toast } from "sonner";
import { fileToWebp } from "@/lib/image";

export const Route = createFileRoute("/admin/settings/profile")({
  head: () => ({ meta: [{ title: "الملف الشخصي | الإعدادات" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [p, setP] = useState({
    avatar: "", name: "John Doe", email: "john@saba.sa", phone: "+966 55 111 0001",
    title: "مدير عام", bio: "", language: "ar", timezone: "Asia/Riyadh",
  });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setP({ ...p, avatar: await fileToWebp(f) });
  };
  const initials = p.name.split(" ").map(n => n[0]).slice(0, 2).join("");

  const changePwd = () => {
    if (!pwd.current || !pwd.next) { toast.error("املأ جميع الحقول"); return; }
    if (pwd.next !== pwd.confirm) { toast.error("كلمتا المرور غير متطابقتين"); return; }
    toast.success("تم تحديث كلمة المرور");
    setPwd({ current: "", next: "", confirm: "" });
  };

  return (
    <AdminLayout title="الإعدادات" subtitle="إدارة حسابك وتفضيلاتك" action={<PrimaryButton onClick={() => toast.success("تم حفظ التغييرات")}>حفظ التغييرات</PrimaryButton>}>
      <PanelCard className="mb-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative">
            {p.avatar
              ? <img src={p.avatar} alt={p.name} className="h-24 w-24 rounded-2xl object-cover" />
              : <div className="h-24 w-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-extrabold">{initials}</div>
            }
            <label className="absolute -bottom-1 -left-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow cursor-pointer">
              <Camera className="h-4 w-4" />
              <input type="file" accept="image/*" className="hidden" onChange={upload} />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl font-extrabold">{p.name}</div>
            <div className="text-sm text-muted-foreground">{p.title}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Pill tone="amber">مالك</Pill>
              <Pill tone="primary">مدير</Pill>
            </div>
          </div>
          <label className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-xs font-bold text-primary cursor-pointer hover:bg-primary/10">
            <Upload className="h-3.5 w-3.5" /> تغيير الصورة
            <input type="file" accept="image/*" className="hidden" onChange={upload} />
          </label>
        </div>
      </PanelCard>

      <PanelCard title="المعلومات الشخصية" className="mb-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <L label="الاسم الكامل"><input className={ic} value={p.name} onChange={e => setP({ ...p, name: e.target.value })} /></L>
          <L label="المسمى الوظيفي"><input className={ic} value={p.title} onChange={e => setP({ ...p, title: e.target.value })} /></L>
          <L label="البريد الإلكتروني"><div className="relative"><Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><input className={ic + " pr-9"} value={p.email} onChange={e => setP({ ...p, email: e.target.value })} /></div></L>
          <L label="رقم الجوال"><div className="relative"><Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><input type="tel" inputMode="tel" className={ic + " pr-9"} dir="ltr" value={p.phone} onChange={e => setP({ ...p, phone: e.target.value })} /></div></L>
          <L label="اللغة">
            <select className={ic} value={p.language} onChange={e => setP({ ...p, language: e.target.value })}>
              <option value="ar">العربية</option><option value="en">English</option>
            </select>
          </L>
          <L label="المنطقة الزمنية">
            <select className={ic} value={p.timezone} onChange={e => setP({ ...p, timezone: e.target.value })}>
              <option value="Asia/Riyadh">الرياض (GMT+3)</option>
              <option value="Asia/Dubai">دبي (GMT+4)</option>
              <option value="Africa/Cairo">القاهرة (GMT+2)</option>
            </select>
          </L>
          <L label="نبذة" full><textarea rows={3} className={ic} value={p.bio} onChange={e => setP({ ...p, bio: e.target.value })} /></L>
        </div>
      </PanelCard>

      <PanelCard title="تغيير كلمة المرور">
        <div className="grid gap-3 sm:grid-cols-3">
          <L label="كلمة المرور الحالية"><div className="relative"><Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><input type="password" className={ic + " pr-9"} value={pwd.current} onChange={e => setPwd({ ...pwd, current: e.target.value })} /></div></L>
          <L label="كلمة المرور الجديدة"><input type="password" className={ic} value={pwd.next} onChange={e => setPwd({ ...pwd, next: e.target.value })} /></L>
          <L label="تأكيد كلمة المرور"><input type="password" className={ic} value={pwd.confirm} onChange={e => setPwd({ ...pwd, confirm: e.target.value })} /></L>
        </div>
        <div className="mt-4 flex gap-2">
          <PrimaryButton onClick={changePwd}>تحديث كلمة المرور</PrimaryButton>
          <GhostButton onClick={() => setPwd({ current: "", next: "", confirm: "" })}>إلغاء</GhostButton>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}
const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function L({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`text-xs font-bold space-y-1.5 block ${full ? "sm:col-span-2" : ""}`}>{label}{children}</label>;
}
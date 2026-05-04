import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Save, Lock } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { mockUser } from "@/data/account";

export const Route = createFileRoute("/account/profile")({
  head: () => ({ meta: [{ title: "ملفي الشخصي | سابا ديزاين" }] }),
  component: Profile,
});

function Profile() {
  const [form, setForm] = useState({ ...mockUser });
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <AccountLayout title="الملف الشخصي" subtitle="حدّث بياناتك ومعلوماتك الشخصية.">
      <form onSubmit={save} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-3xl font-bold text-white shadow-lg">
            {form.avatar}
          </div>
          <div className="flex-1 text-center sm:text-right">
            <h2 className="text-lg font-bold">{form.name}</h2>
            <p className="text-sm text-muted-foreground">عضو منذ {form.joinedAt}</p>
          </div>
          <button type="button" className="rounded-full border border-border px-4 py-2 text-xs font-bold hover:bg-muted">
            تغيير الصورة
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field icon={User} label="الاسم الكامل" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field icon={Mail} label="البريد الإلكتروني" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
          <Field icon={Phone} label="رقم الجوال" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field icon={MapPin} label="المدينة" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          {saved ? (
            <span className="text-sm font-bold text-emerald-600">✓ تم الحفظ بنجاح</span>
          ) : <span />}
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-dark">
            <Save className="h-4 w-4" />
            حفظ التعديلات
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">كلمة المرور</h3>
            <p className="text-xs text-muted-foreground">آخر تعديل قبل 3 أشهر</p>
          </div>
          <button type="button" className="ms-auto rounded-full border border-border px-4 py-2 text-xs font-bold hover:bg-muted">
            تغيير كلمة المرور
          </button>
        </div>
      </div>
    </AccountLayout>
  );
}

function Field({ icon: Icon, label, value, onChange, type = "text" }: { icon: any; label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold">{label}</label>
      <div className="relative">
        <Icon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background py-2.5 pr-10 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </div>
  );
}
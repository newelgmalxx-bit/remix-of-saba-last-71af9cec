import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Save, Lock } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { mockUser } from "@/data/account";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/account/profile")({
  head: () => ({ meta: [{ title: "ملفي الشخصي | سابا ديزاين" }] }),
  component: Profile,
});

function Profile() {
  const { t, dir } = useLang();
  const [form, setForm] = useState({ ...mockUser });
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <AccountLayout title={t("account.profile.title")} subtitle={t("account.profile.subtitle")}>
      <form onSubmit={save} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-3xl font-bold text-white shadow-lg">
            {form.avatar}
          </div>
          <div className={`flex-1 text-center ${dir === "rtl" ? "sm:text-right" : "sm:text-left"}`}>
            <h2 className="text-lg font-bold">{form.name}</h2>
            <p className="text-sm text-muted-foreground">{t("account.profile.memberSince")} {form.joinedAt}</p>
          </div>
          <button type="button" className="rounded-full border border-border px-4 py-2 text-xs font-bold hover:bg-muted">
            {t("account.profile.changeAvatar")}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field icon={User} label={t("account.profile.fullName")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} dir={dir} />
          <Field icon={Mail} label={t("account.profile.email")} value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" dir={dir} />
          <Field icon={Phone} label={t("account.profile.phone")} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" dir={dir} />
          <Field icon={MapPin} label={t("account.profile.city")} value={form.city} onChange={(v) => setForm({ ...form, city: v })} dir={dir} />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          {saved ? (
            <span className="text-sm font-bold text-emerald-600">{t("account.profile.saved")}</span>
          ) : <span />}
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-dark">
            <Save className="h-4 w-4" />
            {t("account.profile.save")}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">{t("account.profile.password")}</h3>
            <p className="text-xs text-muted-foreground">{t("account.profile.passwordMeta")}</p>
          </div>
          <button type="button" className="ms-auto rounded-full border border-border px-4 py-2 text-xs font-bold hover:bg-muted">
            {t("account.profile.changePassword")}
          </button>
        </div>
      </div>
    </AccountLayout>
  );
}

function Field({ icon: Icon, label, value, onChange, type = "text", dir = "rtl" }: { icon: any; label: string; value: string; onChange: (v: string) => void; type?: string; dir?: "rtl" | "ltr" }) {
  const isPhone = type === "tel";
  const sideClass = dir === "rtl" ? "right-3" : "left-3";
  const padSide = dir === "rtl" ? "pr-10 pl-3" : "pl-10 pr-3";
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold">{label}</label>
      <div className="relative">
        <Icon className={`absolute ${sideClass} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`} />
        <input
          type={isPhone ? "tel" : type}
          dir={isPhone ? "ltr" : undefined}
          inputMode={isPhone ? "tel" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border border-border bg-background py-2.5 ${padSide} text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${isPhone ? "text-left" : ""}`}
        />
      </div>
    </div>
  );
}
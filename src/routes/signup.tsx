import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Phone, User, MapPin, Globe, Check, ChevronDown } from "lucide-react";
import { AuthHero } from "@/components/auth/AuthHero";

function SignupPage() {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [agree, setAgree] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] lg:grid-cols-2">
        <AuthHero />

        <div className="flex items-center px-6 py-10 sm:px-12 lg:py-14">
          <div className="mx-auto w-full max-w-md">
            <div className="text-right">
              <h1 className="text-3xl font-extrabold text-foreground">إنشاء حساب جديد</h1>
              <p className="mt-2 text-sm text-muted-foreground">أدخل بياناتك لإنشاء حسابك في دقائق</p>
              <div className="mt-3 h-0.5 w-16 rounded-full bg-primary mr-0 ml-auto" />
            </div>

            <form className="mt-7 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <Field label="الاسم الكامل" type="text" placeholder="أدخل اسمك الكامل" icon={<User className="h-4 w-4" />} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="رقم الجوال" type="tel" placeholder="05XXXXXXXX" icon={<Phone className="h-4 w-4" />} />
                <Field label="البريد الإلكتروني" type="email" placeholder="example@email.com" icon={<Mail className="h-4 w-4" />} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField label="المنطقة / الدولة" placeholder="اختر منطقتك" icon={<MapPin className="h-4 w-4" />} />
                <SelectField label="اللغة المفضلة" placeholder="العربية" icon={<Globe className="h-4 w-4" />} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <PasswordField label="كلمة المرور" show={show1} onToggle={() => setShow1(!show1)} />
                <PasswordField label="تأكيد كلمة المرور" show={show2} onToggle={() => setShow2(!show2)} />
              </div>

              <label className="flex cursor-pointer items-center justify-start gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAgree(!agree)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                    agree ? "border-primary bg-primary text-white" : "border-border bg-white"
                  }`}
                >
                  {agree && <Check className="h-3 w-3" />}
                </button>
                <span className="text-muted-foreground">
                  أوافق على{" "}
                  <a href="#" className="font-bold text-primary hover:underline">سياسة الخصوصية</a>
                  {" و "}
                  <a href="#" className="font-bold text-primary hover:underline">شروط الاستخدام</a>
                </span>
              </label>

              <button type="submit" className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-primary-dark">
                إنشاء الحساب
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground">أو سجّل دخولك باستخدام</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SocialBtn provider="microsoft" />
              <SocialBtn provider="apple" />
              <SocialBtn provider="google" />
            </div>

            <p className="mt-7 text-center text-xs text-muted-foreground">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="font-bold text-primary hover:underline">تسجيل الدخول</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder, icon }: { label: string; type: string; placeholder: string; icon: React.ReactNode }) {
  const isPhone = type === "tel";

  return (
    <div className="text-right">
      <label className="mb-1.5 block text-xs font-bold text-foreground">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">{icon}</span>
        <input type={type} dir={isPhone ? "ltr" : undefined} inputMode={isPhone ? "tel" : undefined} placeholder={placeholder} className={`w-full rounded-xl border border-border bg-white px-10 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${isPhone ? "text-left placeholder:text-left" : "text-right"}`} />
      </div>
    </div>
  );
}

function SelectField({ label, placeholder, icon }: { label: string; placeholder: string; icon: React.ReactNode }) {
  return (
    <div className="text-right">
      <label className="mb-1.5 block text-xs font-bold text-foreground">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">{icon}</span>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
          <ChevronDown className="h-4 w-4" />
        </span>
        <SelectOptions placeholder={placeholder} label={label} />
      </div>
    </div>
  );
}

function SelectOptions({ placeholder, label }: { placeholder: string; label: string }) {
  const isLang = label.includes("اللغة");
  const opts = isLang ? ["العربية", "English"] : ["السعودية", "الإمارات", "مصر", "الكويت", "قطر", "البحرين", "عُمان", "الأردن"];
  return (
    <select className="w-full appearance-none rounded-xl border border-border bg-white px-10 py-3 text-right text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
      <option value="">{placeholder}</option>
      {opts.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function PasswordField({ label, show, onToggle }: { label: string; show: boolean; onToggle: () => void }) {
  return (
    <div className="text-right">
      <label className="mb-1.5 block text-xs font-bold text-foreground">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          <Lock className="h-4 w-4" />
        </span>
        <button type="button" onClick={onToggle} className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-primary">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <input type={show ? "text" : "password"} placeholder="••••••••" className="w-full rounded-xl border border-border bg-white px-10 py-3 text-right text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>
    </div>
  );
}

function SocialBtn({ provider }: { provider: "google" | "apple" | "microsoft" }) {
  const icons = {
    google: (
      <svg viewBox="0 0 48 48" className="h-5 w-5"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.3 0-11.5-5.2-11.5-11.5S17.7 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C40.7 36.6 43.5 30.8 43.5 24c0-1.2-.1-2.3 .1-3.5z"/></svg>
    ),
    apple: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 814 1000" className="h-5 w-5 fill-foreground"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
    ),
    microsoft: (
      <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>
    ),
  };
  return (
    <button type="button" className="flex items-center justify-center rounded-xl border border-border bg-white py-2.5 transition hover:border-primary hover:bg-secondary/40">
      {icons[provider]}
    </button>
  );
}

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "إنشاء حساب جديد | سابا ديزاين" },
      { name: "description", content: "أنشئ حسابك في سابا ديزاين وابدأ بإدارة مشاريعك بسهولة." },
    ],
  }),
  component: SignupPage,
});
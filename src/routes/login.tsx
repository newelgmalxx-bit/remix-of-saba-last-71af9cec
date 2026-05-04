import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Phone, Check, ShieldCheck, Headphones, BarChart3, CloudCog } from "lucide-react";
import { AuthHero } from "@/components/auth/AuthHero";

function LoginPage() {
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] lg:grid-cols-2">
        <AuthHero />

        {/* Form side */}
        <div className="flex items-center px-6 py-10 sm:px-12 lg:py-14">
          <div className="mx-auto w-full max-w-md">
            <div className="text-right">
              <h1 className="text-3xl font-extrabold text-foreground">تسجيل الدخول</h1>
              <p className="mt-2 text-sm text-muted-foreground">أدخل بياناتك للمتابعة إلى حسابك</p>
              <div className="mt-3 h-0.5 w-16 rounded-full bg-primary mr-0 ml-auto" />
            </div>

            {/* Tabs */}
            <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl bg-secondary/40 p-1.5">
              <button
                onClick={() => setTab("email")}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  tab === "email" ? "bg-white text-primary shadow-sm ring-1 ring-primary/30" : "text-muted-foreground"
                }`}
              >
                <Mail className="h-4 w-4" />
                البريد الإلكتروني
              </button>
              <button
                onClick={() => setTab("phone")}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  tab === "phone" ? "bg-white text-primary shadow-sm ring-1 ring-primary/30" : "text-muted-foreground"
                }`}
              >
                <Phone className="h-4 w-4" />
                رقم الجوال
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <Field
                label={tab === "email" ? "البريد الإلكتروني" : "رقم الجوال"}
                type={tab === "email" ? "email" : "tel"}
                placeholder={tab === "email" ? "example@email.com" : "05XXXXXXXX"}
                icon={tab === "email" ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
              />

              <div className="text-right">
                <label className="mb-1.5 block text-xs font-bold text-foreground">كلمة المرور</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-primary"
                    aria-label="إظهار كلمة المرور"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-white px-10 py-3 text-right text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <a href="#" className="text-xs font-bold text-primary hover:underline">نسيت كلمة المرور؟</a>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
                  <span>تذكرني</span>
                  <button
                    type="button"
                    onClick={() => setRemember(!remember)}
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                      remember ? "border-primary bg-primary text-white" : "border-border bg-white"
                    }`}
                  >
                    {remember && <Check className="h-3 w-3" />}
                  </button>
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-primary-dark"
              >
                تسجيل الدخول
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
              ليس لديك حساب؟{" "}
              <Link to="/signup" className="font-bold text-primary hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder, icon }: { label: string; type: string; placeholder: string; icon: React.ReactNode }) {
  return (
    <div className="text-right">
      <label className="mb-1.5 block text-xs font-bold text-foreground">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-white px-10 py-3 text-right text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
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
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M16.365 1.43c0 1.14-.51 2.23-1.34 3.02-.86.83-2.05 1.46-3.13 1.38-.13-1.1.4-2.27 1.21-3.05.87-.85 2.34-1.49 3.26-1.35zM20.5 17.06c-.74 1.7-1.1 2.46-2.05 3.95-1.32 2.1-3.18 4.71-5.49 4.73-2.05.02-2.58-1.34-5.36-1.32-2.78.01-3.36 1.34-5.42 1.32C-.13 25.7-1.88 23.34-3.2 21.24-6.93 15.4-7.32 8.55-4.95 4.9c1.69-2.61 4.36-4.14 6.86-4.14 2.55 0 4.15 1.4 6.26 1.4 2.04 0 3.28-1.4 6.23-1.4 2.23 0 4.6 1.22 6.29 3.32-5.53 3.03-4.63 10.94.81 12.98z"/></svg>
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

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | سابا ديزاين" },
      { name: "description", content: "سجل دخولك للوصول إلى لوحة التحكم وإدارة مشاريعك بسهولة." },
    ],
  }),
  component: LoginPage,
});

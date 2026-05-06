import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Phone, Check, ShieldCheck, Headphones, BarChart3, CloudCog } from "lucide-react";
import { AuthHero } from "@/components/auth/AuthHero";
import { LangSwitch } from "@/components/layout/SiteHeader";
import { useLang } from "@/i18n/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import api, { ApiError, setToken } from "@/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const { t, dir, lang, toggle } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading, refresh } = useAuth();
  const search = useSearch({ from: "/login" }) as { redirect?: string };
  const redirectTo = search?.redirect;

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      navigate({ to: (redirectTo && !isAdmin ? redirectTo : (isAdmin ? "/admin" : "/account")) as any });
    }
  }, [loading, isAuthenticated, isAdmin, navigate, redirectTo]);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error(lang === "ar" ? "يرجى تعبئة جميع الحقول" : "Please fill all fields");
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^\+?\d[\d\s-]{6,}$/;
    if (tab === "email" && !emailRe.test(identifier.trim())) {
      toast.error(lang === "ar" ? "أدخل بريدًا إلكترونيًا صحيحًا" : "Enter a valid email");
      return;
    }
    if (tab === "phone" && !phoneRe.test(identifier.trim())) {
      toast.error(lang === "ar" ? "أدخل رقم جوال صحيح" : "Enter a valid phone number");
      return;
    }
    setSubmitting(true);
    try {
      const user = await login(
        tab === "email" ? { email: identifier, password } : { phone: identifier, password },
      );
      toast.success(lang === "ar" ? "تم تسجيل الدخول" : "Logged in");
      const isAdmin = ["admin", "owner", "manager", "support"].includes(user.role);
      navigate({ to: (redirectTo && !isAdmin ? redirectTo : (isAdmin ? "/admin" : "/account")) as any });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : (lang === "ar" ? "فشل تسجيل الدخول" : "Login failed");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8" dir={dir}>
      <div className={`absolute top-4 z-20 ${dir === "rtl" ? "left-4" : "right-4"} sm:top-6 ${dir === "rtl" ? "sm:left-6" : "sm:right-6"}`}>
        <LangSwitch lang={lang} onClick={toggle} />
      </div>
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] lg:grid-cols-2">
        <AuthHero />

        {/* Form side */}
        <div className="flex items-center px-6 py-10 sm:px-12 lg:py-14">
          <div className="mx-auto w-full max-w-md">
            <div className="text-start">
              <h1 className="text-3xl font-extrabold text-foreground">{t("auth.login.title")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t("auth.login.subtitleAlt")}</p>
              <div className={`mt-3 h-0.5 w-16 rounded-full bg-primary ${dir === "rtl" ? "mr-0 ml-auto" : "ml-0 mr-auto"}`} />
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
                {t("auth.tab.email")}
              </button>
              <button
                onClick={() => setTab("phone")}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  tab === "phone" ? "bg-white text-primary shadow-sm ring-1 ring-primary/30" : "text-muted-foreground"
                }`}
              >
                <Phone className="h-4 w-4" />
                {t("auth.tab.phone")}
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={onSubmit}>
              <Field
                label={tab === "email" ? t("auth.tab.email") : t("auth.tab.phone")}
                type={tab === "email" ? "email" : "tel"}
                placeholder={tab === "email" ? t("auth.emailPh") : t("auth.phonePh")}
                icon={tab === "email" ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                dirCtx={dir}
                value={identifier}
                onChange={setIdentifier}
              />

              <div className="text-start">
                <label className="mb-1.5 block text-xs font-bold text-foreground">{t("auth.password")}</label>
                <div className="relative">
                  <span className={`pointer-events-none absolute inset-y-0 ${dir === "rtl" ? "left-3" : "right-3"} flex items-center text-muted-foreground`}>
                    <Lock className="h-4 w-4" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className={`absolute inset-y-0 ${dir === "rtl" ? "right-3" : "left-3"} flex items-center text-muted-foreground transition hover:text-primary`}
                    aria-label={t("auth.show")}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder={t("auth.passwordPh")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-10 py-3 text-start text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <a href="#" className="text-xs font-bold text-primary hover:underline">{t("auth.forgot")}</a>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
                  <span>{t("auth.remember")}</span>
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
                disabled={submitting}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-primary-dark"
              >
                {submitting ? (lang === "ar" ? "جاري الدخول..." : "Signing in...") : t("auth.signIn")}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground">{t("auth.orSocial")}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex w-full justify-center [&>div]:w-full [&>div>div]:!w-full [&_iframe]:!w-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const idToken = credentialResponse.credential;
                  if (!idToken) {
                    toast.error(lang === "ar" ? "فشل تسجيل الدخول بجوجل" : "Google sign-in failed");
                    return;
                  }
                  try {
                    const { user, token } = await api.auth.oauthGoogle(idToken);
                    setToken(token);
                    await refresh();
                    toast.success(lang === "ar" ? "تم تسجيل الدخول" : "Logged in");
                    const isAdmin = ["admin", "owner", "manager", "support"].includes(user.role);
                    navigate({ to: (redirectTo && !isAdmin ? redirectTo : (isAdmin ? "/admin" : "/account")) as any });
                  } catch (err) {
                    const msg = err instanceof ApiError ? err.message : (lang === "ar" ? "فشل تسجيل الدخول بجوجل" : "Google sign-in failed");
                    toast.error(msg);
                  }
                }}
                onError={() => {
                  toast.error(lang === "ar" ? "فشل تسجيل الدخول بجوجل" : "Google sign-in failed");
                }}
                useOneTap={false}
                theme="outline"
                size="large"
                shape="rectangular"
                text="signin_with"
                width="400"
              />
            </div>

            <p className="mt-7 text-center text-xs text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <Link to="/signup" className="font-bold text-primary hover:underline">
                {t("auth.signup.cta")}
              </Link>
            </p>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              <Link to="/" className="font-bold text-primary hover:underline">{t("auth.backHome")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder, icon, dirCtx, value, onChange }: { label: string; type: string; placeholder: string; icon: React.ReactNode; dirCtx?: "rtl" | "ltr"; value?: string; onChange?: (v: string) => void }) {
  const isPhone = type === "tel";
  const d = dirCtx || "rtl";

  return (
    <div className="text-start">
      <label className="mb-1.5 block text-xs font-bold text-foreground">{label}</label>
      <div className="relative">
        <span className={`pointer-events-none absolute inset-y-0 ${d === "rtl" ? "left-3" : "right-3"} flex items-center text-muted-foreground`}>{icon}</span>
        <input
          type={type}
          dir={isPhone ? "ltr" : undefined}
          inputMode={isPhone ? "tel" : undefined}
          placeholder={placeholder}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className={`w-full rounded-xl border border-border bg-white px-10 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${isPhone ? "text-left placeholder:text-left" : "text-start"}`}
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

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | سابا ديزاين" },
      { name: "description", content: "سجل دخولك للوصول إلى لوحة التحكم وإدارة مشاريعك بسهولة." },
    ],
  }),
  component: LoginPage,
});

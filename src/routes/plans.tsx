import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowLeft, Sparkles, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { usePlans, type Plan } from "@/hooks/usePlans";
import { useLang } from "@/i18n/LanguageProvider";
import { SarIcon } from "@/components/ui/SarIcon";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "الباقات والأسعار | سابا ديزاين" },
      { name: "description", content: "اختر الباقة المناسبة لمشروعك من باقات سابا ديزاين المرنة." },
      { property: "og:title", content: "الباقات والأسعار | سابا ديزاين" },
      { property: "og:description", content: "باقات مرنة لكل مشاريعك الرقمية." },
    ],
  }),
  component: PlansPage,
});

function PlansPage() {
  const { plans } = usePlans();
  const { t, dir } = useLang();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-l from-primary-dark via-primary to-primary-dark text-white">
          <div className="pointer-events-none absolute -top-24 -right-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> {t("plansPage.badge")}
            </div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">{t("plansPage.title")}</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 sm:text-base">{t("plansPage.desc")}</p>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map((p) => (
                <PlanCard key={p.id} plan={p} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-l from-primary to-primary-dark px-8 py-10 text-center text-white shadow-lg">
              <h2 className="text-xl font-extrabold sm:text-2xl">{t("plansPage.custom.title")}</h2>
              <p className="mt-2 text-sm text-white/80">{t("plansPage.custom.desc")}</p>
              <Link to={"/contact" as any} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-primary shadow-md transition hover:-translate-y-0.5">
                {t("common.contactUs")} <ArrowLeft className={`h-4 w-4 ${dir === "ltr" ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const { t, dir, lang } = useLang();
  const priceNum = parseInt(plan.price.replace(/[^\d]/g, ""), 10) || 0;
  const origNum = parseInt((plan.originalPrice || "").replace(/[^\d]/g, ""), 10) || 0;
  const discountPct = origNum > priceNum && priceNum > 0 ? Math.round(((origNum - priceNum) / origNum) * 100) : 0;
  const name = lang === "en" ? (plan.nameEn || plan.name) : plan.name;
  const badge = lang === "en" ? (plan.badgeEn || plan.badge) : plan.badge;
  const description = lang === "en" ? (plan.descriptionEn || plan.description) : plan.description;
  const feats = lang === "en" && plan.featsEn?.length ? plan.featsEn : plan.feats;
  const contactMsg = lang === "ar"
    ? `مرحبًا، أرغب بطلب ${name}.`
    : `Hi, I'd like to order ${name}.`;
  const contactLink = `/contact?plan=${encodeURIComponent(plan.id)}&message=${encodeURIComponent(contactMsg)}`;

  return (
    <div
      className={`relative rounded-2xl border bg-white p-6 ${dir === "rtl" ? "text-right" : "text-left"} shadow-sm transition ${
        plan.featured
          ? "border-2 border-primary lg:-translate-y-3 shadow-md"
          : "border-border hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
      }`}
    >
      {badge && (
        <span className={`absolute -top-3 ${dir === "rtl" ? "right-6" : "left-6"} rounded-full px-3 py-1 text-[10px] font-bold ${plan.featured ? "bg-primary text-white" : "bg-primary-light text-primary"}`}>
          {badge}
        </span>
      )}
      <div className="text-sm font-bold text-foreground">{name}</div>
      <div className="mt-2 flex items-baseline gap-2 flex-wrap" dir="ltr">
        <div className="text-3xl font-extrabold text-primary">
          {plan.price} <SarIcon className="h-[0.7em]" />
        </div>
        {discountPct > 0 && (
          <>
            <div className="text-sm text-muted-foreground line-through">{plan.originalPrice}</div>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">-{discountPct}%</span>
          </>
        )}
      </div>
      {description && <p className="mt-2 text-xs leading-6 text-muted-foreground">{description}</p>}
      <ul className="mt-5 space-y-2.5 border-t border-border/60 pt-5">
        {feats.map((f) => (
          <li key={f} className="flex items-center justify-between gap-2 text-xs text-foreground/80">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <Check className="h-3 w-3" />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-col gap-2">
        <Link
          to={contactLink as any}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${
            plan.featured
              ? "bg-primary text-primary-foreground hover:bg-primary-dark shadow-[0_8px_20px_-8px_rgba(30,91,148,0.55)]"
              : "bg-primary-dark text-white hover:opacity-90"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {lang === "ar" ? "تواصل معنا للطلب" : "Contact us to order"}
        </Link>
        <p className="text-center text-[11px] leading-5 text-muted-foreground">
          {lang === "ar"
            ? "هذه الباقة تُطلب عبر التواصل المباشر مع فريقنا."
            : "This plan is ordered by contacting our team directly."}
        </p>
      </div>
    </div>
  );
}
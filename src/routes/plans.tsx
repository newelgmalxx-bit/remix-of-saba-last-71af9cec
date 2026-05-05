import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ShoppingCart, Zap, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { usePlans, type Plan } from "@/hooks/usePlans";
import { useCart } from "@/hooks/useCart";

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
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-l from-primary-dark via-primary to-primary-dark text-white">
          <div className="pointer-events-none absolute -top-24 -right-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> باقات مرنة لكل احتياج
            </div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">الباقات والأسعار</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
              اختر الباقة الأنسب لمشروعك من باقاتنا المتكاملة، أو تواصل معنا لتفصيل عرض خاص.
            </p>
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
              <h2 className="text-xl font-extrabold sm:text-2xl">تحتاج عرض مخصص؟</h2>
              <p className="mt-2 text-sm text-white/80">نصمم لك باقة على قياس مشروعك ومتطلباتك.</p>
              <Link to={"/contact" as any} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-primary shadow-md transition hover:-translate-y-0.5">
                تواصل معنا <ArrowLeft className="h-4 w-4" />
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
  const { add } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const priceNum = parseInt(plan.price.replace(/[^\d]/g, ""), 10) || 0;

  const handleAdd = () => {
    add({ serviceSlug: `plan:${plan.id}`, serviceTitle: `باقة ${plan.name}`, planName: plan.name, price: priceNum });
    toast.success("تمت الإضافة للسلة", { description: `باقة ${plan.name}` });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  const handleBuyNow = () => {
    add({ serviceSlug: `plan:${plan.id}`, serviceTitle: `باقة ${plan.name}`, planName: plan.name, price: priceNum });
    navigate({ to: "/checkout" as any });
  };

  return (
    <div
      className={`relative rounded-2xl border bg-white p-6 text-right shadow-sm transition ${
        plan.featured
          ? "border-2 border-primary lg:-translate-y-3 shadow-md"
          : "border-border hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
      }`}
    >
      {plan.badge && (
        <span className={`absolute -top-3 right-6 rounded-full px-3 py-1 text-[10px] font-bold ${plan.featured ? "bg-primary text-white" : "bg-primary-light text-primary"}`}>
          {plan.badge}
        </span>
      )}
      <div className="text-sm font-bold text-foreground">{plan.name}</div>
      <div className="mt-2 text-3xl font-extrabold text-primary" dir="ltr">
        {plan.price} <span className="text-sm font-bold">ر.س</span>
      </div>
      {plan.description && <p className="mt-2 text-xs leading-6 text-muted-foreground">{plan.description}</p>}
      <ul className="mt-5 space-y-2.5 border-t border-border/60 pt-5">
        {plan.feats.map((f) => (
          <li key={f} className="flex items-center justify-between gap-2 text-xs text-foreground/80">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <Check className="h-3 w-3" />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-col gap-2">
        <button
          onClick={handleBuyNow}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${
            plan.featured
              ? "bg-primary text-primary-foreground hover:bg-primary-dark shadow-[0_8px_20px_-8px_rgba(30,91,148,0.55)]"
              : "bg-primary-dark text-white hover:opacity-90"
          }`}
        >
          <Zap className="h-4 w-4" /> اطلب الآن
        </button>
        <button
          onClick={handleAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-white text-sm font-bold text-foreground/80 hover:border-primary hover:text-primary transition"
        >
          <ShoppingCart className="h-4 w-4" />
          {added ? "✓ تمت الإضافة للسلة" : "أضف للسلة"}
        </button>
      </div>
    </div>
  );
}
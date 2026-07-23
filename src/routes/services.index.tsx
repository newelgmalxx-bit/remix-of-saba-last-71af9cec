import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, ChevronLeft, MessageSquare, ScanSearch, Wrench, RefreshCw, ShieldCheck, ChevronDown,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import servicesHero from "@/assets/services-hero.webp";
import { useAllServices } from "@/hooks/useServiceContent";
import { ServiceCard } from "@/components/sections/ServicesGrid";
import { useLang } from "@/i18n/LanguageProvider";
import type { TKey } from "@/i18n/translations";
import { buildSeo, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const tabs: { key: TKey; cat: string }[] = [
  { key: "servicesPage.tab.all", cat: "الكل" },
  { key: "servicesPage.tab.design", cat: "تصميم" },
  { key: "servicesPage.tab.dev", cat: "برمجة" },
  { key: "servicesPage.tab.marketing", cat: "تسويق" },
  { key: "servicesPage.tab.social", cat: "سوشيال ميديا" },
];

const steps: { n: number; icon: typeof MessageSquare; key: TKey }[] = [
  { n: 1, icon: MessageSquare, key: "servicesPage.step.1" },
  { n: 2, icon: ScanSearch, key: "servicesPage.step.2" },
  { n: 3, icon: Wrench, key: "servicesPage.step.3" },
  { n: 4, icon: RefreshCw, key: "servicesPage.step.4" },
  { n: 5, icon: ShieldCheck, key: "servicesPage.step.5" },
];

const faqs: { q: TKey; a: TKey }[] = [
  { q: "servicesPage.faq1.q", a: "servicesPage.faq1.a" },
  { q: "servicesPage.faq2.q", a: "servicesPage.faq2.a" },
  { q: "servicesPage.faq3.q", a: "servicesPage.faq3.a" },
  { q: "servicesPage.faq4.q", a: "servicesPage.faq4.a" },
];

function ServicesPage() {
  const { t, dir } = useLang();
  const [activeCat, setActiveCat] = useState<string>("الكل");
  const [open, setOpen] = useState<number | null>(0);
  const services = useAllServices();
  const filtered = activeCat === "الكل" ? services : services.filter((s) => s.category === activeCat);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero banner */}
        <section className="relative overflow-hidden text-white">
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${servicesHero})`, backgroundPosition: "right center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-primary-dark/70 to-primary-dark/95" />
          <div className="relative mx-auto flex max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
            <div className={`max-w-md ${dir === "rtl" ? "ml-auto text-right" : "mr-auto text-left"}`}>
              <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
                <Link to="/" className="hover:underline">{t("common.home")}</Link>
                <ChevronLeft className={`h-3 w-3 ${dir === "ltr" ? "rotate-180" : ""}`} />
                <span>{t("servicesPage.breadcrumb")}</span>
              </div>
              <h1 className="text-5xl font-extrabold sm:text-6xl">{t("servicesPage.title")}</h1>
              <p className="mt-3 text-sm text-white/80 sm:text-base">{t("servicesPage.subtitle")}</p>
            </div>
          </div>
        </section>

        {/* Filter tabs */}
        <section className="bg-background py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-start gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveCat(tab.cat)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      activeCat === tab.cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary/50 text-foreground/70 hover:text-primary"
                    }`}
                  >
                    {t(tab.key)}
                  </button>
                ))}
              </div>
            </div>

            {/* Services grid */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((s) => (
                <ServiceCard
                  key={s.slug}
                  slug={s.slug}
                  title={s.title}
                  desc={s.subtitle}
                  banner={s.bannerImage || servicesHero}
                  category={s.category}
                  price={s.price}
                  originalPrice={s.originalPrice}
                  discountPercent={s.discountPercent}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="bg-background py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
              <h2 className="text-center text-2xl font-extrabold text-foreground">{t("servicesPage.howWeWork")}</h2>
              <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-5">
                {steps.map((s) => (
                  <div
                    key={s.n}
                    className="group relative flex flex-col items-center rounded-2xl border border-border bg-secondary/30 p-6 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-md"
                  >
                    <div className="relative">
                      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
                        <s.icon className="h-6 w-6" />
                      </span>
                      <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow">
                        {s.n}
                      </span>
                    </div>
                    <div className="mt-4 text-sm font-bold text-foreground">{t(s.key)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-background pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary to-primary-dark px-8 py-12 text-center shadow-lg">
              <div className="pointer-events-none absolute -top-20 -right-10 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{t("servicesPage.cta.title")}</h2>
              <p className="mt-3 text-sm text-white/80">{t("servicesPage.cta.desc")}</p>
              <Link
                to={"/contact" as any}
                className="group mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-primary shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                {t("common.requestQuote")}
                <ArrowLeft className={`h-4 w-4 transition-transform group-hover:-translate-x-1 ${dir === "ltr" ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-background pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-start text-2xl font-extrabold text-foreground">{t("servicesPage.faqs")}</h2>
              <div className="mt-6 space-y-3">
                {faqs.map((f, i) => (
                  <div key={f.q} className="rounded-xl border border-border bg-secondary/30 transition hover:border-primary/30">
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                    >
                      <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
                      <span className="text-sm font-bold text-foreground">{t(f.q)}</span>
                    </button>
                    {open === i && (
                      <div className="border-t border-border/60 bg-white px-5 py-4 text-start text-xs leading-6 text-muted-foreground">
                        {t(f.a)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export const Route = createFileRoute("/services/")({
  head: () => {
    const seo = buildSeo({
      title: "خدمات تصميم وتطوير المواقع والتطبيقات | سابا ديزاين",
      description:
        "خدمات تصميم وتطوير المواقع، تطبيقات الجوال، المتاجر الإلكترونية، الهوية البصرية، التسويق الرقمي والسيو بأسعار تنافسية.",
      keywords:
        "خدمات تصميم مواقع، تطوير تطبيقات، متجر إلكتروني، هوية بصرية، تسويق رقمي، سوشيال ميديا، سيو، السعودية",
      path: "/services",
    });
    const faqPairs = [
      { q: "كم يستغرق تنفيذ الموقع؟", a: "عادةً من أسبوعين إلى ستة أسابيع حسب حجم المشروع ومتطلباته." },
      { q: "هل تقدمون دعم بعد التسليم؟", a: "نعم، نوفر دعمًا فنيًا وصيانة دورية بعد إطلاق المشروع." },
      { q: "هل التصميم متوافق مع الجوال؟", a: "جميع تصاميمنا Responsive وتعمل على جميع الأجهزة والمتصفحات." },
      { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل جميع البطاقات الائتمانية، مدى، Apple Pay، STC Pay، تابي وتمارا." },
    ];
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "الرئيسية", path: "/" },
              { name: "الخدمات", path: "/services" },
            ])
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(faqPairs)) },
      ],
    };
  },
  component: ServicesPage,
});

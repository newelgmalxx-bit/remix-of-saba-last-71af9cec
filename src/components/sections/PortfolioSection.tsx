import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import type { TKey } from "@/i18n/translations";

const tabs: { key: TKey; cats: string[] }[] = [
  { key: "portfolio.tab.all", cats: [] },
  { key: "portfolio.tab.web", cats: ["تطوير ويب"] },
  { key: "portfolio.tab.apps", cats: ["تطبيقات موبايل"] },
  { key: "portfolio.tab.brand", cats: ["هوية بصرية"] },
  { key: "portfolio.tab.ui", cats: ["تصميم واجهات"] },
];

type Project = {
  title: { ar: string; en: string };
  cat: string;
  catLabel: { ar: string; en: string };
  brand: string;
  year: string;
  tags: string[];
  img?: string;
  dark?: boolean;
  span: string;
};

const projects: Project[] = [
  {
    title: { ar: "تطبيق توصيل ذكي", en: "Smart Delivery App" },
    cat: "تطبيقات موبايل",
    catLabel: { ar: "تطبيقات موبايل", en: "Mobile Apps" },
    brand: "SHIFT GO",
    year: "2025",
    tags: ["Maps", "React Native"],
    img: "https://images.unsplash.com/photo-1601972602288-3be527b4f18c?w=900&auto=format&fit=crop&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: { ar: "منصة متجر إلكتروني متكاملة", en: "Full E-commerce Platform" },
    cat: "تطوير ويب",
    catLabel: { ar: "تطوير ويب", en: "Web Development" },
    brand: "NOVA STORE",
    year: "2025",
    tags: ["Tailwind", "Stripe", "Next.js"],
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&auto=format&fit=crop&q=80",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: { ar: "هوية بصرية لعلامة تقنية", en: "Tech Brand Identity" },
    cat: "هوية بصرية",
    catLabel: { ar: "هوية بصرية", en: "Branding" },
    brand: "PULSE LABS",
    year: "2024",
    tags: ["Brand Book", "Logo"],
    dark: true,
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: { ar: "تطبيق لياقة بدنية", en: "Fitness App" },
    cat: "تطبيقات موبايل",
    catLabel: { ar: "تطبيقات موبايل", en: "Mobile Apps" },
    brand: "FITMOVE",
    year: "2025",
    tags: ["Android", "iOS"],
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    span: "md:col-span-1",
  },
  {
    title: { ar: "موقع شركة عقارات فاخرة", en: "Luxury Real Estate Site" },
    cat: "تطوير ويب",
    catLabel: { ar: "تطوير ويب", en: "Web Development" },
    brand: "MARKET ESTATES",
    year: "2024",
    tags: ["SEO", "CMS"],
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&auto=format&fit=crop&q=80",
    span: "md:col-span-1",
  },
  {
    title: { ar: "لوحة تحكم تحليلات", en: "Analytics Dashboard" },
    cat: "تصميم واجهات",
    catLabel: { ar: "تصميم واجهات", en: "UI/UX Design" },
    brand: "INSIGHT.CRM",
    year: "2025",
    tags: ["UX", "Dashboard"],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80",
    span: "md:col-span-1",
  },
];

export function PortfolioSection() {
  const { t, lang, dir } = useLang();
  const [active, setActive] = useState(tabs[0]);
  const filtered = active.cats.length === 0
    ? projects
    : projects.filter((p) => active.cats.includes(p.cat));
  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="text-center md:text-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{t("portfolio.kicker")}</span>
            <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
              {t("portfolio.title")}
            </h2>
            <div className="mt-3 h-1 w-16 rounded-full bg-primary/70" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  active.key === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-white text-foreground/70 hover:text-primary"
                }`}
              >
                {t(tab.key)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((p) => (
            <article
              key={p.brand}
              className={`group relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-border ${p.span}`}
            >
              {p.dark ? (
                <div className="absolute inset-0 bg-[#0d2540]" />
              ) : (
                <img
                  src={p.img}
                  alt={p.title[lang]}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <span className="absolute left-4 top-4 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white/90 backdrop-blur">
                {p.year}
              </span>
              <span className="absolute right-4 top-4 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                {p.catLabel[lang]}
              </span>

              <div className={`absolute inset-x-4 bottom-4 text-white ${dir === "rtl" ? "text-right" : "text-left"}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">{p.brand}</div>
                <h3 className="mt-1 text-base font-extrabold">{p.title[lang]}</h3>
                <div className={`mt-2 flex flex-wrap gap-1.5 ${dir === "rtl" ? "justify-end" : "justify-start"}`}>
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-white px-8 py-6 text-center md:flex-row md:text-start">
          <div>
            <p className="text-xl font-extrabold text-foreground sm:text-2xl">
              {t("portfolio.cta.title.lead")} <span className="text-primary">{t("portfolio.cta.title.tail")}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("portfolio.cta.desc")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="group inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(30,91,148,0.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_14px_28px_-10px_rgba(30,91,148,0.7)]">
              {t("portfolio.cta.start")}
              <ArrowLeft className={`h-4 w-4 transition-transform group-hover:-translate-x-1 ${dir === "ltr" ? "rotate-180" : ""}`} />
            </button>
            <button className="inline-flex h-11 items-center rounded-full border border-border bg-white px-6 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md">
              {t("portfolio.cta.more")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
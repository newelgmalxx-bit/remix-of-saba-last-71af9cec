import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import portfolioBg from "@/assets/portfolio-bg.jpg";
import {
  ArrowLeft, ChevronLeft, ExternalLink, Sparkles, Layout, Smartphone,
  Megaphone, Palette, Search, Star, Award, Briefcase,
  Users, Globe2, Eye, Tag as TagIcon,
} from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { publicApi } from "@/lib/api/public";

import { buildSeo, breadcrumbJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
  head: () => {
    const seo = buildSeo({
      title: "أعمالنا | سابا ديزاين",
      description: "استعرض نماذج من أعمالنا في تصميم المواقع، تطبيقات الموبايل، الهوية البصرية، والتسويق الرقمي.",
      keywords: "أعمال، portfolio، تصميم مواقع، تطبيقات، هوية بصرية، سابا ديزاين",
      path: "/portfolio",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "الرئيسية", path: "/" },
              { name: "أعمالنا", path: "/portfolio" },
            ])
          ),
        },
      ],
    };
  },
});

type Project = {
  id: string;
  title: string;
  client: string;
  category: string;
  catLabel: string;
  img: string;
  year: string;
  featured?: boolean;
};

const catLabelsEn: Record<string, string> = {
  "ويب": "Web",
  "تطوير ويب": "Web Development",
  "تطبيقات موبايل": "Mobile Apps",
  "هوية بصرية": "Branding",
  "تصميم واجهات": "UI/UX Design",
  "سوشيال ميديا": "Social Media",
  "تسويق": "Marketing",
  "فيديو": "Video",
  "أخرى": "Other",
};

const categoryIconFor = (cat: string) => {
  if (/(ويب|web)/i.test(cat)) return Layout;
  if (/(تطبيق|app|mobile)/i.test(cat)) return Smartphone;
  if (/(هوية|brand)/i.test(cat)) return Palette;
  if (/(واجه|ui|ux)/i.test(cat)) return Layout;
  if (/(سوشيال|social|فيديو|video)/i.test(cat)) return Sparkles;
  if (/(تسويق|market|ads)/i.test(cat)) return Megaphone;
  return TagIcon;
};

function mapApiItem(it: any, lang: "ar" | "en"): Project {
  const rawCat: string = (it.category ?? "").toString().trim();
  const labelAr = rawCat || "أخرى";
  const labelEn = catLabelsEn[rawCat] || rawCat || "Other";
  return {
    id: String(it.id ?? it._id ?? Math.random()),
    title: lang === "en" ? (it.titleEn || it.titleAr || "") : (it.titleAr || it.titleEn || ""),
    client: it.client ?? "",
    category: rawCat,
    catLabel: lang === "en" ? labelEn : labelAr,
    img: it.cover || it.image || "",
    year: it.year ?? String(new Date().getFullYear()),
    featured: !!it.featured,
  };
}

function PortfolioPage() {
  const { t, dir, lang } = useLang();
  const [activeCat, setActiveCat] = useState<string>("__all__");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    publicApi.getPortfolio()
      .then((res: any) => {
        if (cancelled) return;
        const items = res?.data?.items ?? res?.items ?? [];
        setProjects(items.map((it: any) => mapApiItem(it, lang)));
      })
      .catch(() => { if (!cancelled) setProjects([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [lang]);

  const dynamicCats = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach((p) => {
      if (!p.category) return;
      if (!map.has(p.category)) map.set(p.category, p.catLabel);
    });
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [projects]);

  const filtered = useMemo(
    () => (activeCat === "__all__" ? projects : projects.filter((p) => p.category === activeCat)),
    [activeCat, projects],
  );

  const stats = [
    { icon: Briefcase, value: "+260", label: t("portfolioPage.stat.projects") },
    { icon: Users, value: "+180", label: t("portfolioPage.stat.clients") },
    { icon: Globe2, value: "+15", label: t("portfolioPage.stat.countries") },
    { icon: Award, value: "+12", label: t("portfolioPage.stat.awards") },
  ];

  const ChevronInline = dir === "rtl" ? ChevronLeft : ChevronLeft;
  const ArrowInline = ArrowLeft;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${portfolioBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-primary-dark/70 via-primary-dark/85 to-primary-dark/95" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-bold backdrop-blur">
                <Link to="/" className="hover:underline">{t("portfolioPage.crumb.home")}</Link>
                <ChevronInline className={`h-3 w-3 ${dir === "ltr" ? "rotate-180" : ""}`} />
                <span>{t("portfolioPage.crumb.work")}</span>
              </div>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                {t("portfolioPage.hero.title")}
              </h1>
              <p className="mt-5 text-base text-white/85 sm:text-lg">
                {t("portfolioPage.hero.desc")}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to={"/contact" as any}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-primary shadow-md transition hover:-translate-y-0.5"
                >
                  {t("portfolioPage.hero.start")}
                </Link>
                <a
                  href="#works"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  {t("portfolioPage.hero.browse")}
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 text-center backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <s.icon className="mx-auto h-6 w-6 text-white/80" />
                  <div className="mt-2 text-2xl font-extrabold sm:text-3xl">{s.value}</div>
                  <div className="mt-1 text-[11px] text-white/75 sm:text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters + grid */}
        <section id="works" className="scroll-mt-24 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{t("portfolioPage.gallery.kicker")}</span>
              <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
                {t("portfolioPage.gallery.title")}
              </h2>
              <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
              <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
                {t("portfolioPage.gallery.desc")}
              </p>
            </div>

            {/* Tabs */}
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveCat("__all__")}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  activeCat === "__all__"
                    ? "bg-primary text-white shadow-md"
                    : "bg-secondary/60 text-foreground/70 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {t("portfolioPage.cat.all")}
              </button>
              {dynamicCats.map((c) => {
                const active = activeCat === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setActiveCat(c.key)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      active
                        ? "bg-primary text-white shadow-md"
                        : "bg-secondary/60 text-foreground/70 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => {
                const CatIcon = categoryIconFor(p.category);
                const projectTitle = p.title;
                const catLabel = p.catLabel;
                return (
                  <article
                    key={p.id}
                    className="group relative overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_20px_50px_-15px_rgba(30,91,148,0.35)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={p.img}
                        alt={projectTitle}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-primary-dark/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className={`absolute top-3 flex gap-2 ${dir === "rtl" ? "right-3" : "left-3"}`}>
                        <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-primary backdrop-blur">
                          {catLabel}
                        </span>
                        {p.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-amber-950">
                            <Star className="h-3 w-3 fill-current" /> {t("portfolioPage.featured")}
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-x-4 bottom-4 flex translate-y-4 items-center justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-bold text-primary shadow-md">
                          <Eye className="h-3.5 w-3.5" />
                          {t("portfolioPage.viewProject")}
                        </button>
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-primary shadow-md">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className={`p-5 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                      <div className={`flex items-center text-[11px] text-muted-foreground ${dir === "rtl" ? "justify-end" : "justify-start"}`}>
                        <span className="inline-flex items-center gap-1.5">
                          <CatIcon className="h-3.5 w-3.5 text-primary" />
                          {catLabel}
                        </span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-foreground transition group-hover:text-primary">
                        {projectTitle}
                      </h3>
                    </div>
                  </article>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                {t("portfolioPage.empty")}
              </div>
            )}
          </div>
        </section>

        {/* Capabilities strip */}
        <section className="bg-secondary/40 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {[
                { icon: Layout, label: t("portfolioPage.cap.web") },
                { icon: Smartphone, label: t("portfolioPage.cap.apps") },
                { icon: Palette, label: t("portfolioPage.cap.brand") },
                { icon: Megaphone, label: t("portfolioPage.cap.ads") },
                { icon: Search, label: t("portfolioPage.cap.seo") },
              ].map((c) => (
                <div
                  key={c.label}
                  className="group flex items-center justify-center gap-3 rounded-2xl border border-border bg-white p-4 text-center text-sm font-bold text-foreground transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
                    <c.icon className="h-4 w-4" />
                  </span>
                  {c.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-20 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${portfolioBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-primary-dark/85 via-primary-dark/90 to-primary-dark/95" />
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Sparkles className="mx-auto h-8 w-8 text-white/80" />
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              {t("portfolioPage.cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 sm:text-base">
              {t("portfolioPage.cta.desc")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={"/contact" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-primary shadow-lg transition hover:-translate-y-0.5"
              >
                {t("portfolioPage.cta.start")} <ArrowInline className={`h-4 w-4 ${dir === "ltr" ? "rotate-180" : ""}`} />
              </Link>
              <Link
                to={"/services" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 text-sm font-bold backdrop-blur transition hover:bg-white/20"
              >
                {t("portfolioPage.cta.services")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

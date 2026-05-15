import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";
import { publicApi } from "@/lib/api/public";

type Project = {
  id: string;
  title: { ar: string; en: string };
  cat: string;
  catLabel: { ar: string; en: string };
  brand: string;
  tags: string[];
  img?: string;
  dark?: boolean;
  span: string;
  link?: string;
};

const SPANS = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-1",
];

const catLabelsEn: Record<string, string> = {
  "ويب": "Web Development",
  "تطوير ويب": "Web Development",
  "تطبيقات موبايل": "Mobile Apps",
  "هوية بصرية": "Branding",
  "تصميم واجهات": "UI/UX Design",
  "سوشيال ميديا": "Social Media",
  "تسويق": "Marketing",
  "فيديو": "Video",
  "أخرى": "Other",
};

export function PortfolioSection() {
  const { t, lang, dir } = useLang();
  const [active, setActive] = useState<string>("__all__");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;
    publicApi.getPortfolio()
      .then((res: any) => {
        if (cancelled) return;
        const items = res?.data?.items ?? res?.items ?? [];
        const mapped: Project[] = items.map((it: any, idx: number) => {
          const ar = it.titleAr || it.titleEn || "";
          const en = it.titleEn || it.titleAr || "";
          const cat = (it.category || "").toString().trim();
          return {
            id: String(it.id ?? it._id ?? idx),
            title: { ar, en },
            cat,
            catLabel: { ar: cat || "أخرى", en: catLabelsEn[cat] || cat || "Other" },
            brand: (en || ar).toString().toUpperCase(),
            tags: Array.isArray(it.tech) ? it.tech.slice(0, 3) : [],
            img: it.cover || it.image || undefined,
            dark: !it.cover && !it.image,
            span: SPANS[idx % SPANS.length],
            link: it.link || it.url || "",
          };
        });
        setProjects(mapped);
      })
      .catch(() => { if (!cancelled) setProjects([]); });
    return () => { cancelled = true; };
  }, []);

  const cats = useMemo(() => {
    const set = new Map<string, { ar: string; en: string }>();
    projects.forEach((p) => {
      if (!p.cat) return;
      if (!set.has(p.cat)) set.set(p.cat, p.catLabel);
    });
    return Array.from(set.entries()).map(([key, label]) => ({ key, label }));
  }, [projects]);

  const filtered = active === "__all__" ? projects : projects.filter((p) => p.cat === active);

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
            <button
              onClick={() => setActive("__all__")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                active === "__all__"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-white text-foreground/70 hover:text-primary"
              }`}
            >
              {t("portfolio.tab.all")}
            </button>
            {cats.map((c) => (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  active === c.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-white text-foreground/70 hover:text-primary"
                }`}
              >
                {c.label[lang]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((p) => {
            const hasLink = !!p.link && p.link !== "#";
            const Tag: any = hasLink ? "a" : "article";
            const linkProps = hasLink
              ? { href: p.link, target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
            <Tag
              key={p.id}
              {...linkProps}
              className={`group relative block overflow-hidden rounded-2xl shadow-sm ring-1 ring-border ${p.span} ${hasLink ? "cursor-pointer" : ""}`}
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

              <span className="absolute right-4 top-4 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                {p.catLabel[lang]}
              </span>

              <div className={`absolute inset-x-4 bottom-4 text-white ${dir === "rtl" ? "text-right" : "text-left"}`}>
                <h3 className="text-base font-extrabold">{p.title[lang]}</h3>
                <div className={`mt-2 flex flex-wrap gap-1.5 ${dir === "rtl" ? "justify-end" : "justify-start"}`}>
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Tag>
            );
          })}
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
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <Link to="/contact" className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(30,91,148,0.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_14px_28px_-10px_rgba(30,91,148,0.7)] sm:w-auto">
              {t("portfolio.cta.start")}
              <ArrowLeft className={`h-4 w-4 transition-transform group-hover:-translate-x-1 ${dir === "ltr" ? "rotate-180" : ""}`} />
            </Link>
            <Link to="/about" className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md sm:w-auto">
              {t("portfolio.cta.more")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

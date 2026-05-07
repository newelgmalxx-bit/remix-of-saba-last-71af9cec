import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import aboutHero from "@/assets/about-hero.jpg";
import aboutBg from "@/assets/about-bg.jpg";
import {
  Sparkles, Target, Eye, Heart, Award, Users, Rocket, Globe2,
  Lightbulb, ShieldCheck, Handshake, TrendingUp, ArrowLeft, Quote,
  Briefcase, Code2, Palette, Megaphone, CheckCircle2, Star, Zap, Layers,
  ChevronRight, ChevronLeft,
} from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import type { TKey } from "@/i18n/translations";
import { buildSeo, breadcrumbJsonLd, SITE } from "@/lib/seo";

const tools = ["Figma", "React", "Next.js", "Webflow", "Shopify", "TypeScript", "Node.js", "Tailwind", "Framer", "Adobe"];

const journeyItems: { year: string; tKey: TKey; dKey: TKey }[] = [
  { year: "2017", tKey: "aboutPage.journey.start.t", dKey: "aboutPage.journey.start.d" },
  { year: "2019", tKey: "aboutPage.journey.expand.t", dKey: "aboutPage.journey.expand.d" },
  { year: "2022", tKey: "aboutPage.journey.recog.t", dKey: "aboutPage.journey.recog.d" },
  { year: "2025", tKey: "aboutPage.journey.global.t", dKey: "aboutPage.journey.global.d" },
];

const testimonialKeys: { n: TKey; r: TKey; q: TKey }[] = [
  { n: "aboutPage.t1.name", r: "aboutPage.t1.role", q: "aboutPage.t1.q" },
  { n: "aboutPage.t2.name", r: "aboutPage.t2.role", q: "aboutPage.t2.q" },
  { n: "aboutPage.t3.name", r: "aboutPage.t3.role", q: "aboutPage.t3.q" },
  { n: "aboutPage.t4.name", r: "aboutPage.t4.role", q: "aboutPage.t4.q" },
  { n: "aboutPage.t5.name", r: "aboutPage.t5.role", q: "aboutPage.t5.q" },
];

function AboutPage() {
  const { t, dir, lang } = useLang();
  const arrowFlip = dir === "ltr" ? "rotate-180" : "";

  const stats = [
    { value: "+250", label: t("aboutPage.stats.projects"), icon: Briefcase },
    { value: "+120", label: t("aboutPage.stats.clients"), icon: Users },
    { value: "+15", label: t("aboutPage.stats.countries"), icon: Globe2 },
    { value: "+8", label: t("aboutPage.stats.years"), icon: Award },
  ];
  const values = [
    { icon: Lightbulb, title: t("aboutPage.value.creativity.t"), desc: t("aboutPage.value.creativity.d") },
    { icon: ShieldCheck, title: t("aboutPage.value.quality.t"), desc: t("aboutPage.value.quality.d") },
    { icon: Handshake, title: t("aboutPage.value.partnership.t"), desc: t("aboutPage.value.partnership.d") },
    { icon: TrendingUp, title: t("aboutPage.value.growth.t"), desc: t("aboutPage.value.growth.d") },
  ];
  const services = [
    { icon: Code2, title: t("aboutPage.svc.web") },
    { icon: Palette, title: t("aboutPage.svc.brand") },
    { icon: Megaphone, title: t("aboutPage.svc.marketing") },
    { icon: Rocket, title: t("aboutPage.svc.launch") },
  ];
  const processArr = [
    { icon: Lightbulb, title: t("aboutPage.process.discover.t"), desc: t("aboutPage.process.discover.d") },
    { icon: Layers, title: t("aboutPage.process.design.t"), desc: t("aboutPage.process.design.d") },
    { icon: Code2, title: t("aboutPage.process.dev.t"), desc: t("aboutPage.process.dev.d") },
    { icon: Rocket, title: t("aboutPage.process.launch.t"), desc: t("aboutPage.process.launch.d") },
  ];
  const journey = journeyItems.map((j) => ({ year: j.year, title: t(j.tKey), desc: t(j.dKey) }));
  const testimonials = testimonialKeys.map((k) => ({ name: t(k.n), role: t(k.r), quote: t(k.q) }));

  return (
    <div dir={dir} className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <img src={aboutBg} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,40,75,0.85) 0%, rgba(30,91,148,0.78) 50%, rgba(15,40,75,0.92) 100%)" }} />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse-glow" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl animate-pulse-glow" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 lg:py-32">
            <div className="mx-auto max-w-3xl text-center text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {t("aboutPage.kicker")}
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
                {t("aboutPage.hero.title.l1")} <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">{t("aboutPage.hero.title.highlight")}</span>
                <br />
                {t("aboutPage.hero.title.l2")}
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/85">{t("aboutPage.hero.desc")}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/contact" className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-xl transition hover:bg-white/90">
                  {t("aboutPage.startProject")}
                  <ArrowLeft className={`h-4 w-4 transition ${arrowFlip} group-hover:-translate-x-1`} />
                </Link>
                <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
                  {t("aboutPage.viewWork")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-background px-6 py-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-extrabold text-gradient-primary">{s.value}</div>
                <div className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* STORY */}
        <section className="mx-auto max-w-7xl px-4 py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{t("aboutPage.story.kicker")}</span>
              <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
                {t("aboutPage.story.title.l1")}
                <br />
                {t("aboutPage.story.title.l2")}
              </h2>
              <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
                <p>{t("aboutPage.story.p1")}</p>
                <p>{t("aboutPage.story.p2")}</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <div key={s.title} className="card-hover flex items-center gap-3 rounded-xl border border-border bg-white p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <s.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-foreground">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-square overflow-hidden rounded-3xl shadow-lg">
                <img src={aboutHero} alt={t("aboutPage.story.imageAlt")} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(30,91,148,0) 30%, rgba(15,40,75,0.85) 100%)" }} />
                <div className="relative flex h-full flex-col justify-end p-8 text-white md:p-10">
                  <Quote className="mb-4 h-10 w-10 opacity-70" />
                  <p className="text-xl font-bold leading-relaxed md:text-2xl whitespace-pre-line">{`"${t("aboutPage.story.quote")}"`}</p>
                  <div className="mt-5 h-0.5 w-16 bg-white/70" />
                  <span className="mt-2 text-sm text-white/85">{t("aboutPage.story.quoteBy")}</span>
                </div>
              </div>
              <div className={`absolute -bottom-6 hidden h-32 w-32 rounded-2xl border-4 border-background bg-white p-4 shadow-lg lg:block ${dir === "rtl" ? "-left-6" : "-right-6"}`}>
                <div className="flex h-full flex-col justify-between">
                  <Award className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-2xl font-extrabold text-foreground">+15</div>
                    <div className="text-[10px] font-bold text-muted-foreground">{t("aboutPage.story.awardBadge")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION / VISION */}
        <section className="bg-secondary/30 py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Target, title: t("aboutPage.mvp.mission.t"), desc: t("aboutPage.mvp.mission.d") },
                { icon: Eye, title: t("aboutPage.mvp.vision.t"), desc: t("aboutPage.mvp.vision.d") },
                { icon: Heart, title: t("aboutPage.mvp.promise.t"), desc: t("aboutPage.mvp.promise.d") },
              ].map((c) => (
                <div key={c.title} className="card-hover group relative overflow-hidden rounded-3xl border border-border bg-background p-8">
                  <div className={`absolute -top-8 h-24 w-24 rounded-full bg-primary/5 transition group-hover:scale-150 ${dir === "rtl" ? "-right-8" : "-left-8"}`} />
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                      <c.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-extrabold text-foreground">{c.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="mx-auto max-w-7xl px-4 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{t("aboutPage.values.kicker")}</span>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">{t("aboutPage.values.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("aboutPage.values.desc")}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} className="card-hover relative rounded-3xl border border-border bg-white p-6">
                <div className={`absolute -top-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white shadow-md ${dir === "rtl" ? "right-6" : "left-6"}`}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* JOURNEY */}
        <section className="bg-secondary/30 py-24">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{t("aboutPage.journey.kicker")}</span>
              <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">{t("aboutPage.journey.title")}</h2>
            </div>
            <div className="relative mt-16">
              <div className="absolute right-1/2 top-0 hidden h-full w-0.5 translate-x-1/2 bg-gradient-to-b from-primary via-primary/30 to-transparent md:block" />
              <div className="space-y-10">
                {journey.map((j, i) => (
                  <div key={j.year} className={`flex flex-col gap-4 md:flex-row md:items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="flex-1">
                      <div className={`card-hover rounded-2xl border border-border bg-background p-6 shadow-sm ${i % 2 === 0 ? "md:mr-12 md:text-right" : "md:ml-12 md:text-left"}`}>
                        <div className="text-2xl font-extrabold text-primary">{j.year}</div>
                        <h3 className="mt-1 text-lg font-bold text-foreground">{j.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{j.desc}</p>
                      </div>
                    </div>
                    <div className="relative z-10 mx-auto hidden h-5 w-5 shrink-0 rounded-full border-4 border-background bg-primary shadow-md md:block" />
                    <div className="hidden flex-1 md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="mx-auto max-w-7xl px-4 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{t("aboutPage.process.kicker")}</span>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">{t("aboutPage.process.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("aboutPage.process.desc")}</p>
          </div>
          <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processArr.map((p, i) => (
              <div key={p.title} className="card-hover group relative rounded-3xl border border-border bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <span className="text-4xl font-extrabold text-primary/10 transition group-hover:text-primary/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <TestimonialsSlider testimonials={testimonials} />

        {/* TOOLS / TECH */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{t("aboutPage.tools.kicker")}</span>
            <h2 className="mt-3 text-2xl font-extrabold text-foreground md:text-3xl">{t("aboutPage.tools.title")}</h2>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {tools.map((tt) => (
              <span key={tt} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md">
                <Zap className="h-3.5 w-3.5 text-primary" />
                {tt}
              </span>
            ))}
          </div>
        </section>

        {/* WHY US */}
        <section className="bg-secondary/30 py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{t("aboutPage.why.kicker")}</span>
                <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">{t("aboutPage.why.title")}</h2>
                <p className="mt-4 leading-8 text-muted-foreground">{t("aboutPage.why.desc")}</p>
                <ul className="mt-6 space-y-3">
                  {[t("aboutPage.why.b1"), t("aboutPage.why.b2"), t("aboutPage.why.b3"), t("aboutPage.why.b4"), t("aboutPage.why.b5")].map((tt) => (
                    <li key={tt} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{tt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: "98%", l: t("aboutPage.why.kpi.satisfaction") },
                  { v: "24h", l: t("aboutPage.why.kpi.response") },
                  { v: "100%", l: t("aboutPage.why.kpi.quality") },
                  { v: "+50", l: t("aboutPage.why.kpi.experts") },
                ].map((b) => (
                  <div key={b.l} className="card-hover rounded-3xl border border-border bg-background p-6 text-center shadow-sm">
                    <div className="text-3xl font-extrabold text-gradient-primary">{b.v}</div>
                    <div className="mt-2 text-xs font-bold text-muted-foreground">{b.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-24">
          <div className="relative overflow-hidden rounded-3xl p-10 text-white md:p-16" style={{ background: "linear-gradient(135deg, #5482AE 0%, #1E5B94 100%)" }}>
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">{t("aboutPage.cta.title")}</h2>
                <p className="mt-3 text-white/85">{t("aboutPage.cta.desc")}</p>
              </div>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-extrabold text-primary shadow-xl transition hover:bg-white/90">
                {t("aboutPage.cta.btn")}
                <ArrowLeft className={`h-4 w-4 ${arrowFlip}`} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export const Route = createFileRoute("/about")({
  head: () => {
    const seo = buildSeo({
      title: "من نحن | سابا ديزاين — وكالة رقمية ببصمة عربية",
      description:
        "تعرّف على فريق سابا ديزاين، قصتنا، قيمنا، ورؤيتنا في صناعة تجارب رقمية تترك أثراً يدوم. أكثر من 250 مشروع و120 عميل في السعودية والخليج.",
      keywords: "من نحن، سابا ديزاين، فريق سابا، وكالة تصميم، قصة سابا، رؤية سابا",
      path: "/about",
      image: `${SITE.url}/logo.png`,
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
              { name: "من نحن", path: "/about" },
            ])
          ),
        },
      ],
    };
  },
  component: AboutPage,
});

function TestimonialsSlider({ testimonials }: { testimonials: { name: string; role: string; quote: string }[] }) {
  const { t, dir } = useLang();
  const [start, setStart] = useState(0);
  const total = testimonials.length;
  const pageCount = Math.max(1, total - 2);

  useEffect(() => {
    const id = setInterval(() => setStart((p) => (p + 1) % pageCount), 5500);
    return () => clearInterval(id);
  }, [pageCount]);

  const prev = () => setStart((p) => (p - 1 + pageCount) % pageCount);
  const next = () => setStart((p) => (p + 1) % pageCount);
  const visible = [0, 1, 2].map((o) => testimonials[(start + o) % total]);

  return (
    <section className="relative overflow-hidden bg-secondary/30 py-24">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{t("aboutPage.testimonials.kicker")}</span>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">{t("aboutPage.testimonials.title")}</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3" key={start}>
          {visible.map((tt, i) => (
            <div key={`${start}-${i}`} className="card-hover relative rounded-3xl border border-border bg-background p-7 shadow-sm animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <Quote className={`absolute top-6 h-9 w-9 text-primary/15 ${dir === "rtl" ? "right-6" : "left-6"}`} />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-foreground">"{tt.quote}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-sm font-extrabold text-white">
                  {tt.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-foreground">{tt.name}</div>
                  <div className="text-xs text-muted-foreground">{tt.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-5">
          <button onClick={prev} className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md" aria-label="prev">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button key={i} onClick={() => setStart(i)} className={`h-2 rounded-full transition-all ${i === start ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/40"}`} aria-label={`${i + 1}`} />
            ))}
          </div>
          <button onClick={next} className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md" aria-label="next">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

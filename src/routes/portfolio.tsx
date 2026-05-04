import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import portfolioBg from "@/assets/portfolio-bg.jpg";
import {
  ArrowLeft, ChevronLeft, ExternalLink, Sparkles, Layout, Smartphone,
  Megaphone, Palette, Search, Star, Award, Briefcase,
  Users, Globe2, Eye,
} from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "أعمالنا | سابا ديزاين" },
      { name: "description", content: "استعرض نماذج من أعمالنا في تصميم المواقع، تطبيقات الموبايل، الهوية البصرية، والتسويق الرقمي." },
    ],
  }),
});

type Category =
  | "الكل"
  | "مواقع"
  | "تطبيقات"
  | "هوية"
  | "سوشيال"
  | "تسويق";

const categories: Category[] = ["الكل", "مواقع", "تطبيقات", "هوية", "سوشيال", "تسويق"];

const projects: {
  id: string;
  title: string;
  client: string;
  category: Exclude<Category, "الكل">;
  tag: string;
  img: string;
  year: string;
  featured?: boolean;
}[] = [
  { id: "p1", title: "منصة متجر إلكتروني متكامل", client: "نور ستور", category: "مواقع", tag: "E-commerce", year: "2025", featured: true,
    img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&auto=format&fit=crop&q=80" },
  { id: "p2", title: "تطبيق حجز خدمات الموبايل", client: "كويك سيرف", category: "تطبيقات", tag: "Mobile App", year: "2025", featured: true,
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop&q=80" },
  { id: "p3", title: "هوية بصرية متكاملة لمطعم", client: "بيت اللوز", category: "هوية", tag: "Branding", year: "2024",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1200&auto=format&fit=crop&q=80" },
  { id: "p4", title: "حملة سوشيال ميديا موسمية", client: "علامة نمط", category: "سوشيال", tag: "Social Media", year: "2025",
    img: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=1200&auto=format&fit=crop&q=80" },
  { id: "p5", title: "نظام إدارة مشاريع داخلي", client: "تك ستارت", category: "مواقع", tag: "SaaS", year: "2024",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80" },
  { id: "p6", title: "حملة إعلانية مدفوعة Google Ads", client: "مجموعة الأفق", category: "تسويق", tag: "Performance", year: "2025",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80" },
  { id: "p7", title: "تطبيق توصيل طلبات للمطاعم", client: "ذوق", category: "تطبيقات", tag: "Mobile App", year: "2024",
    img: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=1200&auto=format&fit=crop&q=80" },
  { id: "p8", title: "هوية بصرية لشركة عقارية", client: "دار العمارة", category: "هوية", tag: "Branding", year: "2024",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80" },
  { id: "p9", title: "تصميم محتوى انستقرام شهري", client: "متجر بلوم", category: "سوشيال", tag: "Content", year: "2025",
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&auto=format&fit=crop&q=80" },
  { id: "p10", title: "موقع تعليمي للمساقات الإلكترونية", client: "أكاديمية رواق", category: "مواقع", tag: "EdTech", year: "2024",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80" },
  { id: "p11", title: "حملة تسويق رقمي لإطلاق منتج", client: "براند جلوب", category: "تسويق", tag: "Launch", year: "2025",
    img: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&auto=format&fit=crop&q=80" },
  { id: "p12", title: "تطبيق إدارة لياقة شخصية", client: "فِت بلس", category: "تطبيقات", tag: "Health", year: "2024",
    img: "https://images.unsplash.com/photo-1540206395-68808572332f?w=1200&auto=format&fit=crop&q=80" },
];

const stats = [
  { icon: Briefcase, value: "+260", label: "مشروع منجز" },
  { icon: Users, value: "+180", label: "عميل سعيد" },
  { icon: Globe2, value: "+15", label: "دولة حول العالم" },
  { icon: Award, value: "+12", label: "جائزة وتكريم" },
];

const categoryIcons: Record<Exclude<Category, "الكل">, typeof Layout> = {
  مواقع: Layout,
  تطبيقات: Smartphone,
  هوية: Palette,
  سوشيال: Sparkles,
  تسويق: Megaphone,
};

function PortfolioPage() {
  const [activeCat, setActiveCat] = useState<Category>("الكل");
  const filtered = useMemo(
    () => (activeCat === "الكل" ? projects : projects.filter((p) => p.category === activeCat)),
    [activeCat],
  );

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
                <Link to="/" className="hover:underline">الرئيسية</Link>
                <ChevronLeft className="h-3 w-3" />
                <span>أعمالنا</span>
              </div>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                مشاريع تتحدث عن نفسها
              </h1>
              <p className="mt-5 text-base text-white/85 sm:text-lg">
                مجموعة مختارة من أعمالنا في التصميم والتطوير والتسويق الرقمي،
                صنعناها بشغف لعملاء يؤمنون بالجودة والتميّز.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to={"/contact" as any}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-primary shadow-md transition hover:-translate-y-0.5"
                >
                  ابدأ مشروعك معنا
                </Link>
                <a
                  href="#works"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  استعرض الأعمال
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
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">المعرض</span>
              <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
                مختارات من مشاريعنا
              </h2>
              <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
              <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
                صنّفنا الأعمال حسب التخصص لتسهّل عليك تصفّح ما يهمّك.
              </p>
            </div>

            {/* Tabs */}
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {categories.map((c) => {
                const active = activeCat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      active
                        ? "bg-primary text-white shadow-md"
                        : "bg-secondary/60 text-foreground/70 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => {
                const CatIcon = categoryIcons[p.category];
                return (
                  <article
                    key={p.id}
                    className="group relative overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_20px_50px_-15px_rgba(30,91,148,0.35)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={p.img}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-primary-dark/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute right-3 top-3 flex gap-2">
                        <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-primary backdrop-blur">
                          {p.tag}
                        </span>
                        {p.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-amber-950">
                            <Star className="h-3 w-3 fill-current" /> مميّز
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-x-4 bottom-4 flex translate-y-4 items-center justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-bold text-primary shadow-md">
                          <Eye className="h-3.5 w-3.5" />
                          عرض المشروع
                        </button>
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-primary shadow-md">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5 text-right">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{p.year}</span>
                        <span className="inline-flex items-center gap-1.5">
                          <CatIcon className="h-3.5 w-3.5 text-primary" />
                          {p.category}
                        </span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-foreground transition group-hover:text-primary">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">العميل: {p.client}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                لا توجد مشاريع في هذا التصنيف حالياً.
              </div>
            )}
          </div>
        </section>

        {/* Capabilities strip */}
        <section className="bg-secondary/40 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {[
                { icon: Layout, label: "تصميم مواقع" },
                { icon: Smartphone, label: "تطبيقات الموبايل" },
                { icon: Palette, label: "هوية بصرية" },
                { icon: Megaphone, label: "إعلانات وحملات" },
                { icon: Search, label: "تحسين SEO" },
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
              مشروعك القادم يستحق نفس الاحترافية
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 sm:text-base">
              تواصل معنا اليوم واحصل على استشارة مجانية لتحويل فكرتك إلى منتج رقمي ناجح.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={"/contact" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-primary shadow-lg transition hover:-translate-y-0.5"
              >
                ابدأ مشروعك الآن <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                to={"/services" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 text-sm font-bold backdrop-blur transition hover:bg-white/20"
              >
                استعرض خدماتنا
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

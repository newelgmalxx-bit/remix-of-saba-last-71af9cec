import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const tabs = ["كل الأعمال", "تطوير ويب", "تطبيقات", "هوية بصرية", "واجهات UI/UX"];

const projects = [
  {
    title: "تطبيق توصيل ذكي",
    cat: "تطبيقات موبايل",
    brand: "SHIFT GO",
    year: "2025",
    tags: ["Maps", "React Native"],
    img: "https://images.unsplash.com/photo-1601972602288-3be527b4f18c?w=900&auto=format&fit=crop&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "منصة متجر إلكتروني متكاملة",
    cat: "تطوير ويب",
    brand: "NOVA STORE",
    year: "2025",
    tags: ["Tailwind", "Stripe", "Next.js"],
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&auto=format&fit=crop&q=80",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "هوية بصرية لعلامة تقنية",
    cat: "هوية بصرية",
    brand: "PULSE LABS",
    year: "2024",
    tags: ["Brand Book", "Logo"],
    dark: true,
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "تطبيق لياقة بدنية",
    cat: "تطبيقات موبايل",
    brand: "FITMOVE",
    year: "2025",
    tags: ["Android", "iOS"],
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    span: "md:col-span-1",
  },
  {
    title: "موقع شركة عقارات فاخرة",
    cat: "تطوير ويب",
    brand: "MARKET ESTATES",
    year: "2024",
    tags: ["SEO", "CMS"],
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&auto=format&fit=crop&q=80",
    span: "md:col-span-1",
  },
  {
    title: "لوحة تحكم تحليلات",
    cat: "تصميم واجهات",
    brand: "INSIGHT.CRM",
    year: "2025",
    tags: ["UX", "Dashboard"],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80",
    span: "md:col-span-1",
  },
];

export function PortfolioSection() {
  const [active, setActive] = useState(tabs[0]);
  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  active === t
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-white text-foreground/70 hover:text-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="text-center md:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">نماذج الأعمال</span>
            <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
              مشاريع نفخر بها وعملاء يثقون بنا
            </h2>
            <div className="ms-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
          </div>
        </div>

        <div className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {projects.map((p) => (
            <article
              key={p.title}
              className={`group relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-border ${p.span}`}
            >
              {p.dark ? (
                <div className="absolute inset-0 bg-[#0d2540]" />
              ) : (
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Year — top left */}
              <span className="absolute left-4 top-4 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white/90 backdrop-blur">
                {p.year}
              </span>
              {/* Category — top right */}
              <span className="absolute right-4 top-4 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                {p.cat}
              </span>

              <div className="absolute inset-x-4 bottom-4 text-right text-white">
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">{p.brand}</div>
                <h3 className="mt-1 text-base font-extrabold">{p.title}</h3>
                <div className="mt-2 flex flex-wrap justify-end gap-1.5">
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

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-white px-8 py-6 text-center md:flex-row md:text-right">
          <div className="order-2 flex flex-wrap items-center gap-3 md:order-1">
            <button className="group inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(30,91,148,0.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_14px_28px_-10px_rgba(30,91,148,0.7)]">
              ابدأ مشروعك
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </button>
            <button className="inline-flex h-11 items-center rounded-full border border-border bg-white px-6 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md">
              عرض المزيد
            </button>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-xl font-extrabold text-foreground sm:text-2xl">
              لديك فكرة مشروع؟ <span className="text-primary">نحوّلها لواقع.</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              تواصل معنا اليوم واحصل على استشارة مجانية لمشروعك القادم.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

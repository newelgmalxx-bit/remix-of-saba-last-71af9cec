import { useState } from "react";

const tabs = ["الكل", "مواقع", "تطبيقات", "متاجر", "هويات بصرية"];

const projects = [
  {
    title: "تطبيق توصيل ذكي",
    cat: "تطبيق",
    img: "https://images.unsplash.com/photo-1601972602288-3be527b4f18c?w=800&auto=format&fit=crop&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "منصة متجر إلكتروني متكاملة",
    cat: "متجر",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "هوية بصرية لعلامة تجارية",
    cat: "هوية",
    img: "",
    dark: true,
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "تطبيق رياضي للياقة بدنية",
    cat: "تطبيق",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    span: "md:col-span-1",
  },
  {
    title: "موقع شركة عقارات فاخرة",
    cat: "موقع",
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=80",
    span: "md:col-span-1",
  },
  {
    title: "لوحة تحكم تحليلات",
    cat: "تطبيق",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    span: "md:col-span-1",
  },
];

export function PortfolioSection() {
  const [active, setActive] = useState(tabs[0]);
  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="text-center md:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              معرض أعمالنا
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
              مشاريع نفخر بها وعملاء يثقون بنا
            </h2>
          </div>
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
        </div>

        <div className="mt-10 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {projects.map((p) => (
            <article
              key={p.title}
              className={`group relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-border ${p.span}`}
            >
              {p.dark ? (
                <div className="absolute inset-0 bg-primary-dark" />
              ) : (
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute right-4 top-4">
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                  {p.cat}
                </span>
              </div>
              <div className="absolute inset-x-4 bottom-4 text-right text-white">
                <h3 className="text-sm font-bold">{p.title}</h3>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-white p-6 text-center md:flex-row md:text-right">
          <p className="text-base font-semibold text-foreground">
            لديك فكرة مشروع؟ <span className="text-primary">نحوّلها لواقع.</span>
            <span className="block text-sm font-normal text-muted-foreground">
              تواصل معنا اليوم وابدأ رحلتك الرقمية مع فريقنا الإبداعي.
            </span>
          </p>
          <button className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-dark">
            ابدأ مشروعك
          </button>
        </div>
      </div>
    </section>
  );
}
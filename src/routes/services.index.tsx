import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Layout, MonitorSmartphone, Megaphone, Sparkles, Users2, Video, TrendingUp, Code2, Search,
  ArrowLeft, ChevronLeft, MessageSquare, ScanSearch, Wrench, RefreshCw, ShieldCheck, ChevronDown,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import servicesHero from "@/assets/services-hero.png";

const tabs = ["الكل", "تصميم", "برمجة", "تسويق", "سوشيال ميديا"];

const services = [
  { slug: "web-design", icon: Layout, title: "تصميم مواقع إلكترونية", desc: "مواقع سريعة ومتجاوبة تعكس هوية البراند.", cat: "برمجة" },
  { slug: "ui-design", icon: MonitorSmartphone, title: "تصميم واجهات مستخدم", desc: "واجهة سهلة وتركّز على التحويل.", cat: "تصميم" },
  { slug: "ad-banners", icon: Megaphone, title: "تصميم بنرات إعلانية", desc: "أصول بصرية جذابة لحملاتك الرقمية.", cat: "تصميم" },
  { slug: "social-media-design", icon: Sparkles, title: "تصميم سوشيال ميديا", desc: "منشورات احترافية متناسقة مع الهوية.", cat: "سوشيال ميديا" },
  { slug: "social-media-setup", icon: Users2, title: "إنشاء حسابات سوشيال ميديا", desc: "تهيئة الحسابات وبناء حضور قوي.", cat: "سوشيال ميديا" },
  { slug: "ad-videos", icon: Video, title: "تصميم فيديوهات إعلانية", desc: "فيديوهات مختصرة عالية التأثير.", cat: "تصميم" },
  { slug: "ad-campaigns", icon: Megaphone, title: "إطلاق حملات إعلانية", desc: "حملات ممولة مدروسة وموجهة.", cat: "تسويق" },
  { slug: "digital-marketing", icon: TrendingUp, title: "تسويق إلكتروني", desc: "استراتيجية نمو تجمع المحتوى والتحول.", cat: "تسويق" },
  { slug: "debugging", icon: Code2, title: "تصحيح أخطاء برمجية", desc: "حل الأعطال وتحسين الاستقرار والأداء.", cat: "برمجة" },
  { slug: "seo", icon: Search, title: "SEO", desc: "رفع الظهور العضوي وتحسين البنية.", cat: "تسويق" },
];

const steps = [
  { n: 1, icon: MessageSquare, title: "تواصل واستشارة" },
  { n: 2, icon: ScanSearch, title: "تحليل وتخطيط" },
  { n: 3, icon: Wrench, title: "تنفيذ وتطوير" },
  { n: 4, icon: RefreshCw, title: "مراجعة وتعديل" },
  { n: 5, icon: ShieldCheck, title: "تسليم ودعم" },
];

const faqs = [
  { q: "كم يستغرق تنفيذ المشروع؟", a: "تختلف المدة حسب نوع المشروع، وتتراوح غالبًا بين 2 إلى 8 أسابيع." },
  { q: "هل يوجد دعم بعد التسليم؟", a: "نعم، نوفر دعمًا فنيًا وضمانًا لمدة محددة بعد التسليم." },
  { q: "هل يمكن تعديل التصميم؟", a: "بكل تأكيد، نوفر جولات مراجعة ضمن باقة المشروع." },
  { q: "ما طرق الدفع المتاحة؟", a: "تحويل بنكي، مدى، فيزا/ماستركارد، وApple Pay." },
];

function ServicesPage() {
  const [active, setActive] = useState("الكل");
  const [open, setOpen] = useState<number | null>(0);
  const filtered = active === "الكل" ? services : services.filter((s) => s.cat === active);

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
            <div className="ml-auto max-w-md text-right">
              <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
                <Link to="/" className="hover:underline">الرئيسية</Link>
                <ChevronLeft className="h-3 w-3" />
                <span>خدماتنا</span>
              </div>
              <h1 className="text-5xl font-extrabold sm:text-6xl">خدماتنا</h1>
              <p className="mt-3 text-sm text-white/80 sm:text-base">حلول متكاملة لنمو أعمالك الرقمية</p>
            </div>
          </div>
        </section>

        {/* Filter tabs */}
        <section className="bg-background py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-start gap-2">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActive(t)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      active === t
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary/50 text-foreground/70 hover:text-primary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Services grid */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((s) => (
                <div
                  key={s.title}
                  className="group rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">{s.desc}</p>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-4 py-2 text-[11px] font-bold text-primary transition hover:bg-primary hover:text-white"
                  >
                    عرض التفاصيل <ArrowLeft className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="bg-background py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
              <h2 className="text-center text-2xl font-extrabold text-foreground">كيف نعمل</h2>
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
                    <div className="mt-4 text-sm font-bold text-foreground">{s.title}</div>
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
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">جاهز للبدء في مشروعك القادم؟</h2>
              <p className="mt-3 text-sm text-white/80">دعنا نحوّل فكرتك إلى واقع رقمي ناجح.</p>
              <Link
                to={"/contact" as any}
                className="group mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-primary shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                اطلب عرض سعر
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-background pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-right text-2xl font-extrabold text-foreground">الأسئلة الشائعة</h2>
              <div className="mt-6 space-y-3">
                {faqs.map((f, i) => (
                  <div key={f.q} className="rounded-xl border border-border bg-secondary/30 transition hover:border-primary/30">
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
                    >
                      <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
                      <span className="text-sm font-bold text-foreground">{f.q}</span>
                    </button>
                    {open === i && (
                      <div className="border-t border-border/60 bg-white px-5 py-4 text-right text-xs leading-6 text-muted-foreground">
                        {f.a}
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
  head: () => ({
    meta: [
      { title: "خدماتنا | سابا ديزاين" },
      { name: "description", content: "حلول رقمية متكاملة لنمو أعمالك: تصميم، برمجة، تسويق وسوشيال ميديا." },
      { property: "og:title", content: "خدماتنا | سابا ديزاين" },
      { property: "og:description", content: "حلول رقمية متكاملة لنمو أعمالك." },
    ],
  }),
  component: ServicesPage,
});

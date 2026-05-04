import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, Check, Star,
  MessageSquare, ScanSearch, Wrench, RefreshCw, ShieldCheck, ShoppingCart, Zap,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import servicesHero from "@/assets/services-hero.png";
import { serviceMap } from "@/data/services";

const steps = [
  { n: 1, icon: MessageSquare, title: "فهم المتطلبات" },
  { n: 2, icon: ScanSearch, title: "تحليل وتجهيز الفكرة" },
  { n: 3, icon: Wrench, title: "التصميم الأولي" },
  { n: 4, icon: RefreshCw, title: "المراجعة والتعديل" },
  { n: 5, icon: ShieldCheck, title: "التسليم النهائي" },
];

const workTabs = ["الكل", "تصميم", "برمجة", "سوشيال", "تسويق"];
const works = [
  { tag: "Web", title: "منصة متجر إلكتروني", img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&auto=format&fit=crop&q=80" },
  { tag: "Mobile", title: "تطبيق حجز خدمات", img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80" },
  { tag: "UI/UX", title: "لوحة إدارة الطلبات", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80" },
  { tag: "Web", title: "نظام إدارة فواتير", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80" },
  { tag: "Brand", title: "هوية بصرية", img: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800&auto=format&fit=crop&q=80" },
  { tag: "Mobile", title: "تطبيق تتبع مشاريع", img: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=800&auto=format&fit=crop&q=80" },
];

const stats = [
  { v: "+260", l: "عدد المشاريع المنفذة" },
  { v: "98%", l: "نسبة رضا العملاء" },
  { v: "14 يوم", l: "متوسط مدة التسليم" },
  { v: "+180", l: "عدد العملاء" },
];

const testimonials = [
  { name: "خالد العتيبي", role: "Founder", text: "تجربة احترافية، التسليم في الموعد المحدد ودعم ممتاز." },
  { name: "نورة الحربي", role: "Marketing Lead", text: "تصميم رفع تحويلات الموقع بشكل واضح خلال أسبوع." },
  { name: "سعد القحطاني", role: "Product Manager", text: "فريق متعاون وسريع الاستجابة، النتيجة فاقت توقعاتنا." },
  { name: "ريم السبيعي", role: "Owner – Bloom", text: "هوية وموقع كاملين باحترافية عالية وبدقة في التفاصيل." },
  { name: "فهد المطيري", role: "CTO", text: "كود نظيف وموثّق، تكاملنا معه بسهولة في فريقنا التقني." },
  { name: "هاجر العتيبي", role: "Marketing Director", text: "حملاتنا الرقمية تحسّنت بعد إطلاق الموقع الجديد." },
];

const faqs = [
  { q: "كم يستغرق تنفيذ الخدمة؟", a: "بين 2 إلى 4 أسابيع حسب حجم المشروع." },
  { q: "هل يمكن التعديل بعد التسليم؟", a: "نعم، تشمل كل الباقات جولات تعديل مجانية." },
  { q: "هل يتم التسليم بصيغة قابلة للتطوير؟", a: "بالتأكيد — نسلّم كود نظيف وملفات تصميم قابلة للتعديل." },
  { q: "كيف يتم التواصل أثناء المشروع؟", a: "عبر منصة إدارة مشاريع وقنوات مباشرة مع مدير الحساب." },
];

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const service = serviceMap[slug];
  const [tab, setTab] = useState("الكل");
  const [open, setOpen] = useState<number | null>(0);
  const filteredWorks = works;

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-24 text-center">
            <h1 className="text-2xl font-extrabold text-foreground">الخدمة غير موجودة</h1>
            <p className="mt-3 text-sm text-muted-foreground">قد يكون الرابط منتهي الصلاحية أو غير صحيح.</p>
            <Link to="/services" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white">
              العودة لكل الخدمات <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const { overview, benefits, plans, title, subtitle, breadcrumb, heroHighlights } = service;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden text-white">
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${servicesHero})`, backgroundPosition: "right center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-primary-dark/60 to-primary-dark/95" />
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
            {/* Headline first (right side in RTL) */}
            <div className="order-1 text-right">
              <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
                <Link to="/" className="hover:underline">الرئيسية</Link>
                <ChevronLeft className="h-3 w-3" />
                <Link to="/services" className="hover:underline">خدماتنا</Link>
                <ChevronLeft className="h-3 w-3" />
                <span>{breadcrumb}</span>
              </div>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">
                {subtitle}
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-primary shadow-md transition hover:-translate-y-0.5">
                  اطلب الخدمة الآن
                </button>
                <button className="inline-flex h-11 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
                  نموذج لأعمالنا
                </button>
              </div>
            </div>

            {/* Feature card */}
            <div className="order-2">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
                <div className="text-center text-sm font-bold text-white/90">{title}</div>
                <div className="mt-4 space-y-2">
                  {heroHighlights.map((f) => (
                    <div key={f} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs">
                      <Check className="h-4 w-4 text-white/80" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className="text-right">
                <h2 className="text-2xl font-extrabold text-foreground">نظرة عامة عن الخدمة</h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  ما الخدمة، لمن تناسب، وما القيمة التي تحققها.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {overview.map((o) => (
                  <div key={o.title} className="group rounded-2xl border border-border bg-secondary/30 p-6 text-center transition hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-md">
                    <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
                      <o.icon className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-sm font-bold text-foreground">{o.title}</div>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">{o.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className="text-right">
                <h2 className="text-2xl font-extrabold text-foreground">ماذا ستحصل عليه</h2>
                <p className="mt-2 text-xs text-muted-foreground">مخرجات واضحة تضمن لك جودة الناتج وسهولة التطوير.</p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((b) => (
                  <div key={b.title} className="group flex items-start gap-4 rounded-2xl border border-border bg-secondary/30 p-5 text-right transition hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-md">
                    <div className="flex-1">
                      <div className="text-sm font-bold text-foreground">{b.title}</div>
                      <p className="mt-1 text-xs leading-6 text-muted-foreground">{b.desc}</p>
                    </div>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
                      <b.icon className="h-5 w-5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-8 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]">
              <div className="text-right">
                <h2 className="text-2xl font-extrabold text-foreground">كيف نعمل</h2>
                <p className="mt-2 text-xs text-muted-foreground">خطوات بسيطة منظمة من البداية حتى التسليم النهائي.</p>
              </div>
              <div className="relative mt-12 grid grid-cols-2 gap-6 md:grid-cols-5">
                <div className="pointer-events-none absolute right-[10%] left-[10%] top-9 hidden h-0.5 bg-gradient-to-l from-primary/10 via-primary/40 to-primary/10 md:block" />
                {steps.map((s) => (
                  <div key={s.n} className="relative flex flex-col items-center text-center">
                    <div className="relative">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-[0_10px_25px_-10px_rgba(30,91,148,0.45)] ring-2 ring-primary">
                        <s.icon className="h-7 w-7" />
                      </span>
                      <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-white shadow-md ring-2 ring-white">
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

        {/* Previous works */}
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className="flex flex-col items-end justify-between gap-4 md:flex-row-reverse md:items-center">
                <div className="text-right">
                  <h2 className="text-2xl font-extrabold text-foreground">أعمال سابقة</h2>
                  <p className="mt-1 text-xs text-muted-foreground">نماذج حقيقية من مشاريعنا السابقة.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {workTabs.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                        tab === t ? "bg-primary text-white" : "bg-secondary/60 text-foreground/70 hover:text-primary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWorks.map((w) => (
                  <article key={w.title} className="group overflow-hidden rounded-2xl border border-border bg-secondary/30 transition hover:-translate-y-1 hover:shadow-md">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={w.img} alt={w.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-primary">{w.tag}</span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <button className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                        عرض المشروع <ArrowLeft className="h-3 w-3" />
                      </button>
                      <h3 className="text-sm font-bold text-foreground">{w.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className="text-right">
                <h2 className="text-2xl font-extrabold text-foreground">أرقام تعكس الثقة</h2>
                <p className="mt-1 text-xs text-muted-foreground">مؤشرات من أداء فريقنا الفعلي.</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.l} className="rounded-2xl border border-border bg-secondary/30 p-6 text-center">
                    <div className="text-2xl font-extrabold text-primary sm:text-3xl">{s.v}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
                <div className="text-right">
                <h2 className="text-2xl font-extrabold text-foreground">الباقات والأسعار</h2>
                <p className="mt-1 text-xs text-muted-foreground">اختر الباقة المناسبة لمشروعك.</p>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                {plans.map((p) => (
                  <PlanCard key={p.name} plan={p} serviceSlug={service.slug} serviceTitle={title} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className="text-right">
                <h2 className="text-2xl font-extrabold text-foreground">آراء العملاء</h2>
                <p className="mt-1 text-xs text-muted-foreground">تجارب حقيقية من فرق اعتمدت علينا.</p>
              </div>
              <TestimonialsSlider />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-8">
              <div className="text-right">
                <h2 className="text-2xl font-extrabold text-foreground">الأسئلة الشائعة</h2>
                <p className="mt-1 text-xs text-muted-foreground">إجابات سريعة على ما يهمك.</p>
              </div>
              <div className="mt-6 space-y-3">
                {faqs.map((f, i) => (
                  <div key={f.q} className="rounded-xl border border-border bg-secondary/30 transition hover:border-primary/30">
                    <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right">
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

        {/* CTA */}
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary to-primary-dark px-8 py-12 text-center shadow-lg">
              <div className="pointer-events-none absolute -top-20 -right-10 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">جاهز نبدأ مشروعك؟</h2>
              <p className="mt-3 text-sm text-white/80">احصل على تصميم احترافي يرفع جودة حضورك الرقمي.</p>
              <Link to={"/contact" as any} className="group mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-primary shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl">
                ابدأ الآن
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function TestimonialsSlider() {
  const [i, setI] = useState(0);
  // group into pairs (2 per slide on md+)
  const pages = Math.ceil(testimonials.length / 2);
  const prev = () => setI((v) => (v - 1 + pages) % pages);
  const next = () => setI((v) => (v + 1) % pages);

  return (
    <div className="mt-6">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(${i * 100}%)` }}
        >
          {Array.from({ length: pages }).map((_, p) => {
            const pair = testimonials.slice(p * 2, p * 2 + 2);
            return (
              <div key={p} className="w-full shrink-0">
                <div className="grid grid-cols-1 gap-4 px-1 md:grid-cols-2">
                  {pair.map((t) => (
                    <div key={t.name} className="rounded-2xl border border-border/60 bg-white p-6 text-right shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]">
                      <div className="flex justify-end gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, k) => (
                          <Star key={k} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-foreground/80">"{t.text}"</p>
                      <div className="mt-4 text-xs">
                        <div className="font-bold text-foreground">{t.name}</div>
                        <div className="text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={prev}
          aria-label="السابق"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: pages }).map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`الشريحة ${k + 1}`}
              className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="التالي"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const s = serviceMap[params.slug];
    const t = s ? `${s.title} | سابا ديزاين` : "خدمة | سابا ديزاين";
    const d = s?.subtitle ?? "حلول رقمية متكاملة لنمو أعمالك.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: ServiceDetailPage,
});
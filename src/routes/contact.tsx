import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ContactSection } from "@/components/sections/ContactSection";
import aboutBg from "@/assets/about-bg.jpg";
import {
  Sparkles, MessageCircle, Phone, Mail, MapPin, Clock,
  Headphones, Zap, ShieldCheck, ChevronDown, ArrowLeft,
} from "lucide-react";
import { useState } from "react";

const quickChannels = [
  {
    icon: MessageCircle,
    label: "واتساب",
    value: "محادثة مباشرة الآن",
    href: "https://wa.me/966501234567",
    accent: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Phone,
    label: "اتصال هاتفي",
    value: "+966 50 123 4567",
    href: "tel:+966501234567",
    accent: "from-primary to-primary-dark",
  },
  {
    icon: Mail,
    label: "البريد الإلكتروني",
    value: "info@sabadesign.com",
    href: "mailto:info@sabadesign.com",
    accent: "from-sky-500 to-sky-700",
  },
];

const promises = [
  { icon: Zap, title: "رد خلال 24 ساعة", desc: "فريقنا يجيب على كل طلب بسرعة وبخطة واضحة." },
  { icon: ShieldCheck, title: "خصوصية تامة", desc: "كل ما تشاركه يبقى محفوظاً بسرية كاملة بيننا." },
  { icon: Headphones, title: "استشارة مجانية", desc: "نناقش فكرتك ونقدم اقتراحات قبل أي التزام." },
];

const faqs = [
  { q: "كم يستغرق تنفيذ المشروع عادة؟", a: "يعتمد على حجم المشروع. الموقع التعريفي من 2-4 أسابيع، التطبيقات والمتاجر الإلكترونية من 6-12 أسبوع." },
  { q: "هل تقدمون دعم بعد إطلاق المشروع؟", a: "نعم، نقدم دعم فني مجاني لمدة 30 يوماً بعد الإطلاق، مع باقات صيانة شهرية اختيارية." },
  { q: "ما هي طريقة الدفع المعتمدة؟", a: "ندعم التحويل البنكي، البطاقات الائتمانية، ومدى. نبدأ بدفعة 50% ودفعة 50% عند التسليم." },
  { q: "هل يمكنني تعديل التصميم بعد البدء؟", a: "بالتأكيد، نسمح بجولتي تعديل في كل مرحلة من المشروع لضمان رضاك الكامل عن النتيجة." },
  { q: "هل تعملون مع عملاء خارج المملكة؟", a: "نعم، نخدم عملاء في أكثر من 15 دولة حول العالم بنفس مستوى الجودة والاحترافية." },
];

function ContactPage() {
  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <img src={aboutBg} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(15,40,75,0.88) 0%, rgba(30,91,148,0.80) 50%, rgba(15,40,75,0.94) 100%)" }}
          />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse-glow" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl animate-pulse-glow" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 lg:py-32">
            <div className="mx-auto max-w-3xl text-center text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                تواصل معنا
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
                لنبدأ <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">مشروعك</span>
                <br />
                خطوة بخطوة
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/85">
                لديك فكرة؟ سؤال؟ أو حتى مجرد فضول لمعرفة المزيد؟ نحن هنا للاستماع لك
                ومساعدتك في تحويل الرؤية إلى منتج رقمي حقيقي.
              </p>
            </div>
          </div>
        </section>

        {/* QUICK CHANNELS */}
        <section className="relative -mt-12 mb-4 px-4">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {quickChannels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="card-hover group relative overflow-hidden rounded-3xl border border-border bg-background p-6 shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${c.accent} text-white shadow-lg`}>
                    <c.icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{c.label}</div>
                    <div className="mt-1 truncate text-base font-extrabold text-foreground" dir={c.label === "البريد الإلكتروني" || c.label === "اتصال هاتفي" ? "ltr" : undefined}>
                      {c.value}
                    </div>
                  </div>
                  <ArrowLeft className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:-translate-x-1 group-hover:text-primary" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* PROMISES */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {promises.map((p) => (
              <div key={p.title} className="card-hover relative rounded-3xl border border-border bg-white p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT FORM (reused) */}
        <ContactSection />

        {/* MAP + LOCATION */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-6 overflow-hidden rounded-3xl border border-border bg-white shadow-sm lg:grid-cols-[1fr_1.4fr]">
            <div className="p-8 md:p-10">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">موقعنا</span>
              <h2 className="mt-3 text-2xl font-extrabold text-foreground md:text-3xl">
                زرنا في مكتبنا
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                نسعد باستقبالك في مكتبنا بالرياض. ننصح بالحجز المسبق لضمان توفر فريق
                مختص يستقبلك ويناقش مشروعك.
              </p>
              <ul className="mt-6 space-y-4">
                <Row icon={MapPin} label="العنوان" value="حي الملقا، طريق الملك فهد، الرياض" />
                <Row icon={Clock} label="ساعات الزيارة" value="السبت - الخميس | 9:00 ص - 6:00 م" />
                <Row icon={Phone} label="هاتف المكتب" value="+966 11 123 4567" ltr />
              </ul>
              <a
                href="https://maps.google.com/?q=Riyadh,Saudi+Arabia"
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-dark"
              >
                فتح في الخرائط
                <ArrowLeft className="h-4 w-4" />
              </a>
            </div>
            <div className="relative min-h-[320px] overflow-hidden">
              <iframe
                title="موقع سابا ديزاين"
                src="https://www.google.com/maps?q=Riyadh,Saudi+Arabia&hl=ar&z=12&output=embed"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-secondary/30 py-24">
          <div className="mx-auto max-w-4xl px-4">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">الأسئلة الشائعة</span>
              <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
                إجابات سريعة لاستفساراتك
              </h2>
              <p className="mt-4 text-muted-foreground">
                لم تجد إجابتك؟ تواصل معنا مباشرة وسنرد عليك خلال 24 ساعة.
              </p>
            </div>
            <div className="mt-12 space-y-3">
              {faqs.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div
            className="relative overflow-hidden rounded-3xl p-10 text-white md:p-14"
            style={{ background: "linear-gradient(135deg, #5482AE 0%, #1E5B94 100%)" }}
          >
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
                  جاهز للبدء؟ نحن جاهزون لاستقبال فكرتك
                </h2>
                <p className="mt-3 text-white/85">
                  استشارة مجانية بدون أي التزامات — فقط تحدث معنا.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-extrabold text-primary shadow-xl transition hover:bg-white/90"
              >
                استعرض خدماتنا
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({ icon: Icon, label, value, ltr }: { icon: any; label: string; value: string; ltr?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm font-bold text-foreground" dir={ltr ? "ltr" : undefined}>{value}</div>
      </div>
    </li>
  );
}

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={`overflow-hidden rounded-2xl border bg-background transition ${open ? "border-primary/40 shadow-md" : "border-border"}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right"
      >
        <span className="text-sm font-extrabold text-foreground md:text-base">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-sm leading-7 text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | سابا ديزاين" },
      { name: "description", content: "تواصل مع فريق سابا ديزاين عبر الواتساب، الهاتف، أو البريد الإلكتروني — استشارة مجانية ورد خلال 24 ساعة." },
    ],
  }),
  component: ContactPage,
});

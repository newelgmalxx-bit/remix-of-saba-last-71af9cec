import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ContactSection } from "@/components/sections/ContactSection";
import aboutBg from "@/assets/about-bg.webp";
import {
  Sparkles, MessageCircle, Phone, Mail, MapPin, Clock,
  Headphones, Zap, ShieldCheck, ChevronDown, ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { useSiteSettings, telHref, waHref, mailHref } from "@/hooks/useSiteSettings";
import { buildSeo, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

function ContactPage() {
  const { t, dir, lang } = useLang();
  const site = useSiteSettings();
  const waNumber = site.whatsapp || site.phone;
  const quickChannels = [
    waNumber ? { icon: MessageCircle, label: t("contactPage.ch.whatsapp"), value: waNumber, href: waHref(waNumber)!, accent: "from-emerald-500 to-emerald-600", ltr: true } : null,
    site.phone ? { icon: Phone, label: t("contactPage.ch.phone"), value: site.phone, href: telHref(site.phone)!, accent: "from-primary to-primary-dark", ltr: true } : null,
    site.email ? { icon: Mail, label: t("contactPage.ch.email"), value: site.email, href: mailHref(site.email)!, accent: "from-sky-500 to-sky-700", ltr: true } : null,
  ].filter(Boolean) as { icon: any; label: string; value: string; href: string; accent: string; ltr?: boolean }[];
  const promises = [
    { icon: Zap, title: t("contactPage.promise1.t"), desc: t("contactPage.promise1.d") },
    { icon: ShieldCheck, title: t("contactPage.promise2.t"), desc: t("contactPage.promise2.d") },
    { icon: Headphones, title: t("contactPage.promise3.t"), desc: t("contactPage.promise3.d") },
  ];
  const faqs = [
    { q: t("contactPage.faq1.q"), a: t("contactPage.faq1.a") },
    { q: t("contactPage.faq2.q"), a: t("contactPage.faq2.a") },
    { q: t("contactPage.faq3.q"), a: t("contactPage.faq3.a") },
    { q: t("contactPage.faq4.q"), a: t("contactPage.faq4.a") },
    { q: t("contactPage.faq5.q"), a: t("contactPage.faq5.a") },
  ];
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <img src={aboutBg} alt="" width={1200} height={800} className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" decoding="async" />
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
                {t("contactPage.badge")}
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
                {t("contactPage.title.l1")} <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">{t("contactPage.title.highlight")}</span>
                <br />
                {t("contactPage.title.l2")}
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/85">
                {t("contactPage.subtitle")}
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
                    <div className="mt-1 truncate text-base font-extrabold text-foreground" dir={c.ltr ? "ltr" : undefined}>
                      {c.value}
                    </div>
                  </div>
                  <ArrowLeft className={`h-5 w-5 shrink-0 text-muted-foreground transition group-hover:-translate-x-1 group-hover:text-primary ${dir === "ltr" ? "rotate-180" : ""}`} />
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
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{t("contactPage.location.kicker")}</span>
              <h2 className="mt-3 text-2xl font-extrabold text-foreground md:text-3xl">
                {t("contactPage.location.title")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {t("contactPage.location.desc")}
              </p>
              <ul className="mt-6 space-y-4">
                {site.address && <Row icon={MapPin} label={t("contactPage.row.address")} value={site.address} />}
                {site.workHours && <Row icon={Clock} label={t("contactPage.row.hours")} value={site.workHours} />}
                {site.phone && <Row icon={Phone} label={t("contactPage.row.officePhone")} value={site.phone} ltr />}
              </ul>
              <a
                href="https://maps.google.com/?q=Riyadh,Saudi+Arabia"
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-dark"
              >
                {t("common.openInMaps")}
                <ArrowLeft className={`h-4 w-4 ${dir === "ltr" ? "rotate-180" : ""}`} />
              </a>
            </div>
            <div className="relative min-h-[320px] overflow-hidden">
              <iframe
                title="SABA Design location"
                src={`https://www.google.com/maps?q=Riyadh,Saudi+Arabia&hl=${lang}&z=12&output=embed`}
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
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{t("contactPage.faqs.kicker")}</span>
              <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
                {t("contactPage.faqs.title")}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t("contactPage.faqs.desc")}
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
                  {t("contactPage.cta.title")}
                </h2>
                <p className="mt-3 text-white/85">
                  {t("contactPage.cta.desc")}
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-extrabold text-primary shadow-xl transition hover:bg-white/90"
              >
                {t("contactPage.cta.btn")}
                <ArrowLeft className={`h-4 w-4 ${dir === "ltr" ? "rotate-180" : ""}`} />
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
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
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
  head: () => {
    const seo = buildSeo({
      title: "تواصل معنا | سابا ديزاين — استشارة رقمية مجانية",
      description: "تواصل مع فريق سابا ديزاين عبر الواتساب أو الهاتف أو البريد الإلكتروني للحصول على استشارة رقمية مجانية ورد سريع.",
      keywords: "تواصل سابا ديزاين، استشارة تصميم مواقع، وكالة رقمية الرياض، دعم سابا ديزاين",
      path: "/contact",
    });
    const faqPairs = [
      { q: "كيف أبدأ مشروعاً مع سابا ديزاين؟", a: "أرسل تفاصيل مشروعك عبر نموذج التواصل أو واتساب، وسنقترح عليك الخطة المناسبة." },
      { q: "هل تقدمون استشارة مجانية؟", a: "نعم، نوفر استشارة أولية مجانية لتحديد احتياجك الرقمي." },
    ];
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: "الرئيسية", path: "/" }, { name: "تواصل معنا", path: "/contact" }])) },
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(faqPairs)) },
      ],
    };
  },
  component: ContactPage,
});

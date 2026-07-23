import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FileText, ChevronLeft } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { buildSeo, breadcrumbJsonLd } from "@/lib/seo-lite";

export const Route = createFileRoute("/terms")({
  head: () => {
    const seo = buildSeo({
      title: "الشروط والأحكام | سابا ديزاين",
      description: "تعرف على شروط وأحكام استخدام خدمات سابا ديزاين الرقمية، حقوق العملاء، آلية الطلب، الدفع، التسليم والدعم.",
      path: "/terms",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ name: "الرئيسية", path: "/" }, { name: "الشروط والأحكام", path: "/terms" }])) },
      ],
    };
  },
  component: TermsPage,
});

function TermsPage() {
  const { t, dir, lang } = useLang();
  const settings = useSiteSettings() as any;
  const page = settings.legalTerms as any;
  const pick = (ar?: string, en?: string) => (lang === "en" ? (en || ar || "") : (ar || en || ""));

  const badge = pick(page?.badgeAr, page?.badgeEn) || t("legal.terms.badge");
  const title = pick(page?.titleAr, page?.titleEn) || t("legal.terms.title");
  const subtitle = pick(page?.subtitleAr, page?.subtitleEn) || t("legal.terms.subtitle");
  const lastUpdated = pick(page?.lastUpdatedAr, page?.lastUpdatedEn) || t("legal.lastUpdatedDate");
  const sections: Array<{ titleAr?: string; titleEn?: string; bodyAr?: string; bodyEn?: string }> = page?.sections || [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-l from-primary-dark via-primary to-primary-dark text-white">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
              <FileText className="h-3.5 w-3.5" /> {badge}
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85">{subtitle}</p>
            <p className="mt-2 text-[11px] text-white/70">{lastUpdated}</p>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 rounded-3xl border border-border/60 bg-white p-8 text-start shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-10">
              {sections.length > 0 ? (
                sections.map((sec, i) => (
                  <Section key={i} title={pick(sec.titleAr, sec.titleEn)}>
                    {pick(sec.bodyAr, sec.bodyEn)}
                  </Section>
                ))
              ) : (
                <>
                  <Section title={t("legal.terms.s1.t")}>{t("legal.terms.s1.b")}</Section>
                  <Section title={t("legal.terms.s2.t")}>{t("legal.terms.s2.b")}</Section>
                  <Section title={t("legal.terms.s3.t")}>{t("legal.terms.s3.b")}</Section>
                  <Section title={t("legal.terms.s4.t")}>{t("legal.terms.s4.b")}</Section>
                  <Section title={t("legal.terms.s5.t")}>{t("legal.terms.s5.b")}</Section>
                  <Section title={t("legal.terms.s6.t")}>{t("legal.terms.s6.b")}</Section>
                  <Section title={t("legal.terms.s7.t")}>{t("legal.terms.s7.b")}</Section>
                  <Section title={t("legal.terms.s8.t")}>{t("legal.terms.s8.b")}</Section>
                  <Section title={t("legal.terms.s9.t")}>{t("legal.terms.s9.b")}</Section>
                  <Section title={t("legal.terms.s10.t")}>{t("legal.terms.s10.b")}</Section>
                </>
              )}

              <div className="mt-2 flex justify-end">
                <Link to={"/privacy" as any} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                  {t("legal.gotoPrivacy")} <ChevronLeft className={`h-3 w-3 ${dir === "ltr" ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-lg font-extrabold text-foreground">{title}</h2>
      <p className="whitespace-pre-line text-sm leading-8 text-foreground/75">{children}</p>
    </div>
  );
}

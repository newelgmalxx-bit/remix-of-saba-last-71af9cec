import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Instagram, Music2, Ghost, MessageCircle } from "lucide-react";
import logo from "@/assets/logo-white.png";
import payVisa from "@/assets/pay-visa.webp";
import payMastercard from "@/assets/pay-mastercard.png";
import payMada from "@/assets/pay-mada.webp";
import payStcpay from "@/assets/pay-stcpay.webp";
import payTabby from "@/assets/pay-tabby.webp";
import payTamara from "@/assets/pay-tamara.webp";
import { useLang } from "@/i18n/LanguageProvider";
import type { TKey } from "@/i18n/translations";
import { useSiteSettings, waHref } from "@/hooks/useSiteSettings";

export function SiteFooter() {
  const { t } = useLang();
  const site = useSiteSettings();
  const socials = ([
    [site.instagram, Instagram],
    [site.tiktok, Music2],
    [site.snapchat, Ghost],
    [waHref(site.whatsapp), MessageCircle],
  ] as const).filter(([u]) => !!u);
  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="lg:col-span-1">
          <img src={logo} alt={t("footer.brand")} width={180} height={72} className="mb-5 h-14 w-auto object-contain sm:h-16" />
          <p className="text-base leading-8 text-white/80">{t("footer.tagline")}</p>
          <div className="mt-6 flex items-center gap-3">
            {socials.map(([url, Icon], i) => (
              <a
                key={i}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          titleKey="footer.quickLinks"
          links={[
            { key: "nav.home", to: "/" },
            { key: "nav.about", to: "/about" },
            { key: "nav.services", to: "/services" },
            { key: "nav.portfolio", to: "/portfolio" },
            { key: "footer.contactUs", to: "/contact" },
          ]}
        />
        <FooterCol
          titleKey="footer.ourServices"
          links={[
            { key: "footer.svc.web", to: "/services" },
            { key: "footer.svc.ui", to: "/services" },
            { key: "footer.svc.ads", to: "/services" },
            { key: "footer.svc.seo", to: "/services" },
            { key: "footer.svc.social", to: "/services" },
          ]}
        />

        <div>
          <h4 className="mb-5 text-lg font-bold">{t("footer.contactUs")}</h4>
          <ul className="space-y-3">
            {([
              site.phone ? { Icon: Phone, text: site.phone } : null,
              site.email ? { Icon: Mail, text: site.email } : null,
              { Icon: MapPin, text: site.address || t("footer.location") },
            ].filter(Boolean) as { Icon: any; text: string }[]).map(({ Icon, text }, i) => (
              <li key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                <span dir="ltr" className="flex-1 text-start text-sm text-white/85">{text}</span>
              </li>
            ))}
          </ul>
          <Link
            to={"/contact" as any}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-white text-sm font-bold text-primary-dark shadow-md transition hover:-translate-y-0.5"
          >
            {t("footer.requestQuote")}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-sm text-white/70 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2021 {t("footer.brand")}. {t("footer.rights")}</p>
          <div className="flex items-center gap-2 sm:gap-3">
            {[
              { src: payVisa, alt: "Visa" },
              { src: payMastercard, alt: "Mastercard" },
              { src: payMada, alt: "mada" },
              { src: payStcpay, alt: "STC Pay" },
              { src: payTabby, alt: "Tabby" },
              { src: payTamara, alt: "Tamara" },
            ].map((p) => (
              <span key={p.alt} className="flex h-8 items-center justify-center rounded-md bg-white px-2 shadow-sm">
                <img src={p.src} alt={p.alt} className="h-5 w-auto object-contain" loading="lazy" />
              </span>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <Link to={"/privacy" as any} className="hover:text-white">{t("footer.privacy")}</Link>
            <Link to={"/terms" as any} className="hover:text-white">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ titleKey, links }: { titleKey: TKey; links: { key: TKey; to: string }[] }) {
  const { t } = useLang();
  return (
    <div>
      <h4 className="mb-5 text-lg font-bold">{t(titleKey)}</h4>
      <ul className="space-y-3 text-base text-white/85">
        {links.map((l) => (
          <li key={l.key}>
            <Link to={l.to as any} className="transition hover:text-white">
              {t(l.key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
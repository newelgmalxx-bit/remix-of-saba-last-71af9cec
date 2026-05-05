import { Link } from "@tanstack/react-router";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { useAllServices } from "@/hooks/useServiceContent";
import servicesHero from "@/assets/services-hero.png";
import { useLang } from "@/i18n/LanguageProvider";

export function ServicesGrid() {
  const services = useAllServices();
  const { t } = useLang();
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{t("services.kicker")}</span>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            {t("services.title")}
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <ServiceCard
              key={s.slug}
              slug={s.slug}
              title={s.title}
              desc={s.subtitle}
              banner={s.bannerImage || servicesHero}
              category={s.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceCard({
  slug, title, desc, banner, category,
}: { slug: string; title: string; desc: string; banner?: string; category?: string }) {
  const { t } = useLang();
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary/40">
        {banner ? (
          <img
            src={banner}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 via-transparent to-transparent" />
        {category && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-primary shadow-sm">
            {category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 text-start">
        <h3 className="text-base font-extrabold text-foreground">{title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">{desc}</p>
        <div className="mt-5 flex flex-1 items-end justify-end gap-2">
          <Link
            to="/services/$slug"
            params={{ slug }}
            className="inline-flex h-9 items-center gap-1 rounded-full border border-border bg-secondary/40 px-3 text-[11px] font-bold text-foreground/80 transition hover:border-primary/40 hover:text-primary"
          >
            {t("services.details")} <ArrowLeft className="h-3 w-3" />
          </Link>
          <Link
            to="/services/$slug"
            params={{ slug }}
            className="inline-flex h-9 items-center gap-1 rounded-full bg-primary px-4 text-[11px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {t("services.order")}
          </Link>
        </div>
      </div>
    </article>
  );
}

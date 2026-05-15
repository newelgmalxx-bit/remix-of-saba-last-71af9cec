import { Link } from "@tanstack/react-router";
import { ArrowLeft, ImageIcon, Star, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useAllServices } from "@/hooks/useServiceContent";
import { useReviewsSummary } from "@/hooks/useReviewsSummary";
import servicesHero from "@/assets/services-hero.png";
import { useLang } from "@/i18n/LanguageProvider";
import { SarIcon } from "@/components/ui/SarIcon";

const FAV_KEY = "saba_service_favorites_v1";

function readFavs(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "{}"); } catch { return {}; }
}
function writeFavs(f: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAV_KEY, JSON.stringify(f));
  window.dispatchEvent(new Event("saba:favorites"));
}
export function useFavorite(slug: string) {
  const [fav, setFav] = useState(false);
  useEffect(() => {
    const sync = () => setFav(!!readFavs()[slug]);
    sync();
    window.addEventListener("saba:favorites", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("saba:favorites", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);
  const toggle = () => {
    const cur = readFavs();
    cur[slug] = !cur[slug];
    if (!cur[slug]) delete cur[slug];
    writeFavs(cur);
  };
  return { fav, toggle };
}

export function ServicesGrid() {
  const services = useAllServices();
  const { t } = useLang();
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-base sm:text-lg font-bold uppercase tracking-wider text-primary">{t("services.kicker")}</span>
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
              price={s.price}
              originalPrice={s.originalPrice}
              discountPercent={s.discountPercent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceCard({
  slug, title, desc, banner, category, price, originalPrice, discountPercent,
}: { slug: string; title: string; desc: string; banner?: string; category?: string; price?: string; originalPrice?: string; discountPercent?: number }) {
  const { t } = useLang();
  const { average, count } = useReviewsSummary(slug);
  const { fav, toggle } = useFavorite(slug);
  const computedDiscount =
    discountPercent != null
      ? discountPercent
      : price && originalPrice
        ? Math.round(((+originalPrice.replace(/[^\d.]/g, "") - +price.replace(/[^\d.]/g, "")) /
            (+originalPrice.replace(/[^\d.]/g, "") || 1)) * 100)
        : 0;
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
        {computedDiscount > 0 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white shadow ring-1 ring-white/40">
            -{computedDiscount}%
          </span>
        )}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
          aria-label="favorite"
          className="absolute left-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-foreground shadow-sm transition hover:scale-105"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-red-500 text-red-500" : "text-foreground/70"}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center p-5 text-center">
        <h3 className="text-base font-extrabold text-foreground">{title}</h3>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-xs">
          <span className="text-muted-foreground">({count})</span>
          <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
          <div className="flex items-center gap-0.5 text-amber-500">
            {[0,1,2,3,4].map((i) => (
              <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(rating) ? "fill-amber-500" : "fill-none text-amber-300"}`} />
            ))}
          </div>
        </div>
        {desc && <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">{desc}</p>}
        {price && (
          <div className="mt-3 flex items-baseline justify-center gap-2" dir="ltr">
            {originalPrice && computedDiscount > 0 && (
              <span className="text-xs font-bold text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
            <span className="text-base font-extrabold text-primary">
              {price} <SarIcon className="h-[0.8em]" />
            </span>
          </div>
        )}
        <div className="mt-5 flex flex-1 w-full items-end justify-center gap-2">
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

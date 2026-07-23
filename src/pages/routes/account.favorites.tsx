import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { useAllServices } from "@/hooks/useServiceContent";
import { useFavorite } from "@/components/sections/ServicesGrid";
import { useLang } from "@/i18n/LanguageProvider";
import servicesHero from "@/assets/services-hero.webp";

function FavoritesPage() {
  const services = useAllServices();
  const [mounted, setMounted] = useState(false);
  const [favs, setFavs] = useState<Record<string, boolean>>({});
  const { dir } = useLang();

  useEffect(() => {
    setMounted(true);
    const sync = () => {
      try {
        const raw = localStorage.getItem("saba_service_favorites_v1");
        setFavs(raw ? JSON.parse(raw) : {});
      } catch { setFavs({}); }
    };
    sync();
    window.addEventListener("saba:favorites", sync);
    return () => window.removeEventListener("saba:favorites", sync);
  }, []);

  const items = mounted ? services.filter((s) => favs[s.slug]) : [];

  return (
    <AccountLayout title="المفضلة" subtitle="الخدمات اللي حفظتها">
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">لا توجد خدمات في المفضلة بعد.</p>
          <Link to="/services" className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-xs font-bold text-primary-foreground">
            تصفح الخدمات <ArrowLeft className={`h-4 w-4 ${dir === "ltr" ? "rotate-180" : ""}`} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <FavCard key={s.slug} slug={s.slug} title={s.title} desc={s.subtitle} banner={s.bannerImage || servicesHero} />
          ))}
        </div>
      )}
    </AccountLayout>
  );
}

function FavCard({ slug, title, desc, banner }: { slug: string; title: string; desc: string; banner: string }) {
  const { fav, toggle } = useFavorite(slug);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary/40">
        <img src={banner} alt={title} loading="lazy" width={640} height={400} decoding="async" className="h-full w-full object-cover" />
        <button
          onClick={(e) => { e.preventDefault(); toggle(); }}
          className="absolute left-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm"
          aria-label="favorite"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-red-500 text-red-500" : "text-foreground/70"}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-extrabold text-foreground">{title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">{desc}</p>
        <div className="mt-4 flex justify-end">
          <Link to="/services/$slug" params={{ slug }} className="inline-flex h-9 items-center gap-1 rounded-full bg-primary px-4 text-[11px] font-bold text-white">
            عرض الخدمة
          </Link>
        </div>
      </div>
    </article>
  );
}

export const Route = createFileRoute("/account/favorites")({
  component: FavoritesPage,
});

export { FavoritesPage };

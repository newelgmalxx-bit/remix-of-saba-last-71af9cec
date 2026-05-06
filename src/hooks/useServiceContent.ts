import { useEffect, useState, useCallback } from "react";
import { serviceMap, type ServiceContent } from "@/data/services";
import { Sparkles } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { services as servicesApi } from "@/lib/api";

const KEY = "saba_service_overrides_v1";
const REMOTE_KEY = "saba_service_remote_v1";
const REMOTE_SLUGS_KEY = "saba_service_remote_slugs_v1";

async function refreshRemoteServices() {
  try {
    const res = await servicesApi.list();
    const items = res?.items || [];
    const store = readStore();
    const remoteSlugs: string[] = [];
    for (const s of items) {
      const slug = s.slug;
      remoteSlugs.push(slug);
      const cur = store[slug] || {};
      const priceObj: any = (s as any).price || {};
      const amount = priceObj.amount;
      const originalAmount = priceObj.originalAmount;
      const discountPercent = priceObj.discountPercent;
      store[slug] = {
        ...cur,
        isCustom: !serviceMap[slug] ? true : cur.isCustom,
        title: s.titleAr || cur.title,
        titleEn: s.titleEn || cur.titleEn,
        subtitle: s.subtitleAr || cur.subtitle,
        subtitleEn: s.subtitleEn || cur.subtitleEn,
        category: s.category || cur.category,
        bannerImage: s.cover || cur.bannerImage,
        price: amount != null ? String(amount) : cur.price,
        originalPrice: originalAmount != null ? String(originalAmount) : cur.originalPrice,
        discountPercent: discountPercent != null ? Number(discountPercent) : cur.discountPercent,
      };
    }
    writeStore(store);
    if (typeof window !== "undefined") {
      localStorage.setItem(REMOTE_KEY, "1");
      localStorage.setItem(REMOTE_SLUGS_KEY, JSON.stringify(remoteSlugs));
      window.dispatchEvent(new Event("saba:service-overrides"));
    }
  } catch {}
}

export type ServiceOverride = {
  title?: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  category?: string;
  categoryEn?: string;
  breadcrumb?: string;
  breadcrumbEn?: string;
  price?: string;
  originalPrice?: string;
  discountPercent?: number;
  heroHighlights?: string[];
  heroHighlightsEn?: string[];
  bannerImage?: string;
  overviewDescription?: string;
  overviewDescriptionEn?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
  overview?: { title: string; titleEn?: string; desc: string; descEn?: string }[];
  benefits?: { title: string; titleEn?: string; desc: string; descEn?: string }[];
  plans?: { name: string; nameEn?: string; price: string; originalPrice?: string; featured: boolean; feats: string[]; featsEn?: string[] }[];
  steps?: { title: string; titleEn?: string }[];
  stats?: { v: string; l: string; lEn?: string }[];
  testimonials?: { name: string; role: string; text: string; nameEn?: string; roleEn?: string; textEn?: string }[];
  faqs?: { q: string; a: string; qEn?: string; aEn?: string }[];
  isCustom?: boolean;
};

type Store = Record<string, ServiceOverride>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function writeStore(s: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("saba:service-overrides"));
}

export function mergeService(slug: string, override?: ServiceOverride, lang: "ar" | "en" = "ar"): ServiceContent | undefined {
  const base = serviceMap[slug];
  const o = override ?? readStore()[slug];
  const en = lang === "en";
  const pick = (ar?: string, ene?: string) => (en && ene ? ene : ar ?? "");
  if (!base) {
    if (!o || !o.isCustom) return undefined;
    // Build minimal content from override only
    return {
      slug,
      category: pick(o.category ?? "عام", o.categoryEn),
      breadcrumb: pick(o.breadcrumb ?? o.title ?? slug, o.breadcrumbEn),
      title: pick(o.title ?? slug, o.titleEn),
      subtitle: pick(o.subtitle ?? "", o.subtitleEn),
      heroHighlights: en && o.heroHighlightsEn?.length ? o.heroHighlightsEn : (o.heroHighlights ?? []),
      bannerImage: o.bannerImage,
      overviewDescription: pick(o.overviewDescription, o.overviewDescriptionEn),
      seo: o.seo,
      overview: (o.overview ?? []).map((x) => ({ icon: Sparkles, title: pick(x.title, x.titleEn), desc: pick(x.desc, x.descEn) })),
      benefits: (o.benefits ?? []).map((x) => ({ icon: Sparkles, title: pick(x.title, x.titleEn), desc: pick(x.desc, x.descEn) })),
      plans: o.plans ?? [],
      steps: o.steps?.map((s) => ({ title: pick(s.title, s.titleEn) })),
      stats: o.stats?.map((s) => ({ v: s.v, l: pick(s.l, s.lEn) })),
      testimonials: o.testimonials?.map((tt) => ({ name: pick(tt.name, tt.nameEn), role: pick(tt.role, tt.roleEn), text: pick(tt.text, tt.textEn) })),
      faqs: o.faqs?.map((f) => ({ q: pick(f.q, f.qEn), a: pick(f.a, f.aEn) })),
    } as ServiceContent;
  }
  if (!o) return base;
  return {
    ...base,
    title: en ? (o.titleEn || o.title || base.title) : (o.title ?? base.title),
    subtitle: en ? (o.subtitleEn || o.subtitle || base.subtitle) : (o.subtitle ?? base.subtitle),
    category: en ? (o.categoryEn || o.category || base.category) : (o.category ?? base.category),
    breadcrumb: en ? (o.breadcrumbEn || o.breadcrumb || base.breadcrumb) : (o.breadcrumb ?? base.breadcrumb),
    heroHighlights: en && o.heroHighlightsEn?.length ? o.heroHighlightsEn : (o.heroHighlights ?? base.heroHighlights),
    bannerImage: o.bannerImage ?? base.bannerImage,
    overviewDescription: en ? (o.overviewDescriptionEn || o.overviewDescription || base.overviewDescription) : (o.overviewDescription ?? base.overviewDescription),
    seo: { ...(base.seo ?? {}), ...(o.seo ?? {}) },
    overview: o.overview
      ? base.overview.map((b, i) => ({
          ...b,
          title: en ? (o.overview![i]?.titleEn || o.overview![i]?.title || b.title) : (o.overview![i]?.title ?? b.title),
          desc: en ? (o.overview![i]?.descEn || o.overview![i]?.desc || b.desc) : (o.overview![i]?.desc ?? b.desc),
        }))
      : base.overview,
    benefits: o.benefits
      ? base.benefits.map((b, i) => ({
          ...b,
          title: en ? (o.benefits![i]?.titleEn || o.benefits![i]?.title || b.title) : (o.benefits![i]?.title ?? b.title),
          desc: en ? (o.benefits![i]?.descEn || o.benefits![i]?.desc || b.desc) : (o.benefits![i]?.desc ?? b.desc),
        }))
      : base.benefits,
    plans: o.plans ?? base.plans,
    steps: o.steps ? o.steps.map((s) => ({ title: en ? (s.titleEn || s.title) : s.title })) : base.steps,
    stats: o.stats ? o.stats.map((s) => ({ v: s.v, l: en ? (s.lEn || s.l) : s.l })) : base.stats,
    testimonials: o.testimonials
      ? o.testimonials.map((tt) => ({
          name: en ? (tt.nameEn || tt.name) : tt.name,
          role: en ? (tt.roleEn || tt.role) : tt.role,
          text: en ? (tt.textEn || tt.text) : tt.text,
        }))
      : base.testimonials,
    faqs: o.faqs
      ? o.faqs.map((f) => ({ q: en ? (f.qEn || f.q) : f.q, a: en ? (f.aEn || f.a) : f.a }))
      : base.faqs,
  };
}

export function useServiceContent(slug: string): ServiceContent | undefined {
  const [, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { lang } = useLang();
  useEffect(() => {
    setMounted(true);
    const fn = () => setTick((t) => t + 1);
    window.addEventListener("saba:service-overrides", fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener("saba:service-overrides", fn);
      window.removeEventListener("storage", fn);
    };
  }, []);
  return mergeService(slug, mounted ? undefined : {}, lang);
}

export function useAllServices(): ServiceContent[] {
  const [, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { lang } = useLang();
  useEffect(() => {
    setMounted(true);
    const fn = () => setTick((t) => t + 1);
    window.addEventListener("saba:service-overrides", fn);
    window.addEventListener("storage", fn);
    refreshRemoteServices();
    return () => {
      window.removeEventListener("saba:service-overrides", fn);
      window.removeEventListener("storage", fn);
    };
  }, []);
  // If we have a remote services list, ONLY show those slugs (DB is source of truth).
  // Otherwise fall back to local hardcoded services.
  let remoteSlugs: string[] | null = null;
  if (mounted && typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(REMOTE_SLUGS_KEY);
      if (raw) remoteSlugs = JSON.parse(raw);
    } catch {}
  }
  const slugs = remoteSlugs && remoteSlugs.length > 0
    ? remoteSlugs
    : Object.keys(serviceMap);
  return slugs
    .map((s) => mergeService(s, undefined, lang))
    .filter((x): x is ServiceContent => !!x);
}

export function useServiceOverrideEditor(slug: string) {
  const [override, setOverride] = useState<ServiceOverride>(() => readStore()[slug] ?? {});

  const save = useCallback((next: ServiceOverride) => {
    const store = readStore();
    store[slug] = next;
    writeStore(store);
    setOverride(next);
  }, [slug]);

  const reset = useCallback(() => {
    const store = readStore();
    delete store[slug];
    writeStore(store);
    setOverride({});
  }, [slug]);

  return { override, save, reset };
}
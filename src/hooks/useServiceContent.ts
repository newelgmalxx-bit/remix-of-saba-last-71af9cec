import { useEffect, useState, useCallback } from "react";
import { serviceMap, type ServiceContent } from "@/data/services";
import { Sparkles } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { services as servicesApi } from "@/lib/api";
import { runAfterCriticalPaint } from "@/lib/startup";

const KEY = "saba_service_overrides_v1";
const REMOTE_KEY = "saba_service_remote_v1";
const REMOTE_SLUGS_KEY = "saba_service_remote_slugs_v1";

function formatPriceStr(v: any): string {
  if (v == null || v === "") return "";
  const n = Number(String(v).replace(/[^\d.\-]/g, ""));
  if (!Number.isNaN(n) && Number.isFinite(n)) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));
  }
  return String(v).replace(/[.,]0+$/, "");
}

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
      const rawPrice: any = (s as any).price;
      const rawOriginal: any = (s as any).originalPrice;
      const rawDiscount: any = (s as any).discountPercent;
      // API may return flat numbers (price / originalPrice) OR nested { amount, originalAmount, discountPercent }
      const priceObj = rawPrice && typeof rawPrice === "object" ? rawPrice : {};
      const amount = priceObj.amount ?? (typeof rawPrice === "number" || typeof rawPrice === "string" ? rawPrice : undefined);
      const originalAmount = priceObj.originalAmount ?? rawOriginal;
      const discountPercent = priceObj.discountPercent ?? rawDiscount;
      store[slug] = {
        ...cur,
        isCustom: !serviceMap[slug] ? true : cur.isCustom,
        title: s.titleAr || cur.title,
        titleEn: s.titleEn || cur.titleEn,
        subtitle: s.subtitleAr || cur.subtitle,
        subtitleEn: s.subtitleEn || cur.subtitleEn,
        category: s.category || cur.category,
        bannerImage: (s as any).bannerImage || s.cover || cur.bannerImage,
        price: amount != null ? formatPriceStr(amount) : cur.price,
        originalPrice: originalAmount != null ? formatPriceStr(originalAmount) : cur.originalPrice,
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
      price: o.price,
      originalPrice: o.originalPrice,
      discountPercent: o.discountPercent,
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
  // Built-in English overlay shipped with the base content (services.ts → i18n.en).
  // Applied only when active language is English and the user override hasn't supplied an EN value.
  const baseEn = en ? base.i18n?.en : undefined;
  const o2 = o ?? {};
  return {
    ...base,
    title: en ? (o2.titleEn || baseEn?.title || o2.title || base.title) : (o2.title ?? base.title),
    subtitle: en ? (o2.subtitleEn || baseEn?.subtitle || o2.subtitle || base.subtitle) : (o2.subtitle ?? base.subtitle),
    category: en ? (o2.categoryEn || baseEn?.category || o2.category || base.category) : (o2.category ?? base.category),
    breadcrumb: en ? (o2.breadcrumbEn || baseEn?.breadcrumb || o2.breadcrumb || base.breadcrumb) : (o2.breadcrumb ?? base.breadcrumb),
    heroHighlights: en
      ? (o2.heroHighlightsEn?.length ? o2.heroHighlightsEn : (baseEn?.heroHighlights?.length ? baseEn.heroHighlights : (o2.heroHighlights ?? base.heroHighlights)))
      : (o2.heroHighlights ?? base.heroHighlights),
    bannerImage: o2.bannerImage ?? base.bannerImage,
    price: o2.price ?? base.price,
    originalPrice: o2.originalPrice ?? base.originalPrice,
    discountPercent: o2.discountPercent ?? base.discountPercent,
    overviewDescription: en ? (o2.overviewDescriptionEn || baseEn?.overviewDescription || o2.overviewDescription || base.overviewDescription) : (o2.overviewDescription ?? base.overviewDescription),
    seo: { ...(base.seo ?? {}), ...(o2.seo ?? {}) },
    overview: o2.overview
      ? base.overview.map((b, i) => ({
          ...b,
          title: en ? (o2.overview![i]?.titleEn || baseEn?.overview?.[i]?.title || o2.overview![i]?.title || b.title) : (o2.overview![i]?.title ?? b.title),
          desc: en ? (o2.overview![i]?.descEn || baseEn?.overview?.[i]?.desc || o2.overview![i]?.desc || b.desc) : (o2.overview![i]?.desc ?? b.desc),
        }))
      : base.overview.map((b, i) => ({
          ...b,
          title: en ? (baseEn?.overview?.[i]?.title || b.title) : b.title,
          desc: en ? (baseEn?.overview?.[i]?.desc || b.desc) : b.desc,
        })),
    benefits: o2.benefits
      ? base.benefits.map((b, i) => ({
          ...b,
          title: en ? (o2.benefits![i]?.titleEn || baseEn?.benefits?.[i]?.title || o2.benefits![i]?.title || b.title) : (o2.benefits![i]?.title ?? b.title),
          desc: en ? (o2.benefits![i]?.descEn || baseEn?.benefits?.[i]?.desc || o2.benefits![i]?.desc || b.desc) : (o2.benefits![i]?.desc ?? b.desc),
        }))
      : base.benefits.map((b, i) => ({
          ...b,
          title: en ? (baseEn?.benefits?.[i]?.title || b.title) : b.title,
          desc: en ? (baseEn?.benefits?.[i]?.desc || b.desc) : b.desc,
        })),
    plans: o2.plans
      ? o2.plans.map((p, i) => ({
          ...p,
          feats: en ? (p.featsEn?.length ? p.featsEn : (baseEn?.plans?.[i]?.feats ?? p.feats)) : p.feats,
        }))
      : base.plans.map((p, i) => ({
          ...p,
          feats: en && baseEn?.plans?.[i]?.feats ? baseEn.plans[i].feats! : p.feats,
        })),
    steps: o2.steps ? o2.steps.map((s, i) => ({ title: en ? (s.titleEn || baseEn?.steps?.[i]?.title || s.title) : s.title })) : base.steps,
    stats: o2.stats ? o2.stats.map((s, i) => ({ v: s.v, l: en ? (s.lEn || baseEn?.stats?.[i]?.l || s.l) : s.l })) : base.stats,
    testimonials: o2.testimonials
      ? o2.testimonials.map((tt, i) => ({
          name: en ? (tt.nameEn || baseEn?.testimonials?.[i]?.name || tt.name) : tt.name,
          role: en ? (tt.roleEn || baseEn?.testimonials?.[i]?.role || tt.role) : tt.role,
          text: en ? (tt.textEn || baseEn?.testimonials?.[i]?.text || tt.text) : tt.text,
        }))
      : base.testimonials,
    faqs: o2.faqs
      ? o2.faqs.map((f, i) => ({
          q: en ? (f.qEn || baseEn?.faqs?.[i]?.q || f.q) : f.q,
          a: en ? (f.aEn || baseEn?.faqs?.[i]?.a || f.a) : f.a,
        }))
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
    const cancel = runAfterCriticalPaint(() => void refreshRemoteServices(), 10000);
    return () => {
      window.removeEventListener("saba:service-overrides", fn);
      window.removeEventListener("storage", fn);
      cancel?.();
    };
  }, []);
  if (typeof window === "undefined") return [];
  let remoteSlugs: string[] = [];
  try {
    const raw = localStorage.getItem(REMOTE_SLUGS_KEY);
    if (raw) remoteSlugs = JSON.parse(raw);
  } catch {}
  // Fallback to static service map so we can render immediately (before mount) instead of blank.
  if (remoteSlugs.length === 0) remoteSlugs = Object.keys(serviceMap);
  return remoteSlugs
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
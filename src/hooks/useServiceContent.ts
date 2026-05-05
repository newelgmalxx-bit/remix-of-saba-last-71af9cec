import { useEffect, useState, useCallback } from "react";
import { serviceMap, type ServiceContent } from "@/data/services";
import { Sparkles } from "lucide-react";

const KEY = "saba_service_overrides_v1";

export type ServiceOverride = {
  title?: string;
  subtitle?: string;
  category?: string;
  breadcrumb?: string;
  heroHighlights?: string[];
  bannerImage?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
  overview?: { title: string; desc: string }[];
  benefits?: { title: string; desc: string }[];
  plans?: { name: string; price: string; featured: boolean; feats: string[] }[];
  steps?: { title: string }[];
  stats?: { v: string; l: string }[];
  testimonials?: { name: string; role: string; text: string }[];
  faqs?: { q: string; a: string }[];
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

export function mergeService(slug: string, override?: ServiceOverride): ServiceContent | undefined {
  const base = serviceMap[slug];
  const o = override ?? readStore()[slug];
  if (!base) {
    if (!o || !o.isCustom) return undefined;
    // Build minimal content from override only
    return {
      slug,
      category: o.category ?? "عام",
      breadcrumb: o.breadcrumb ?? o.title ?? slug,
      title: o.title ?? slug,
      subtitle: o.subtitle ?? "",
      heroHighlights: o.heroHighlights ?? [],
      bannerImage: o.bannerImage,
      seo: o.seo,
      overview: (o.overview ?? []).map((x) => ({ icon: Sparkles, title: x.title, desc: x.desc })),
      benefits: (o.benefits ?? []).map((x) => ({ icon: Sparkles, title: x.title, desc: x.desc })),
      plans: o.plans ?? [],
      steps: o.steps,
      stats: o.stats,
      testimonials: o.testimonials,
      faqs: o.faqs,
    } as ServiceContent;
  }
  if (!o) return base;
  return {
    ...base,
    title: o.title ?? base.title,
    subtitle: o.subtitle ?? base.subtitle,
    category: o.category ?? base.category,
    breadcrumb: o.breadcrumb ?? base.breadcrumb,
    heroHighlights: o.heroHighlights ?? base.heroHighlights,
    bannerImage: o.bannerImage ?? base.bannerImage,
    seo: { ...(base.seo ?? {}), ...(o.seo ?? {}) },
    overview: o.overview
      ? base.overview.map((b, i) => ({ ...b, title: o.overview![i]?.title ?? b.title, desc: o.overview![i]?.desc ?? b.desc }))
      : base.overview,
    benefits: o.benefits
      ? base.benefits.map((b, i) => ({ ...b, title: o.benefits![i]?.title ?? b.title, desc: o.benefits![i]?.desc ?? b.desc }))
      : base.benefits,
    plans: o.plans ?? base.plans,
    steps: o.steps ?? base.steps,
    stats: o.stats ?? base.stats,
    testimonials: o.testimonials ?? base.testimonials,
    faqs: o.faqs ?? base.faqs,
  };
}

export function useServiceContent(slug: string): ServiceContent | undefined {
  const [, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick((t) => t + 1);
    window.addEventListener("saba:service-overrides", fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener("saba:service-overrides", fn);
      window.removeEventListener("storage", fn);
    };
  }, []);
  return mergeService(slug);
}

export function useAllServices(): ServiceContent[] {
  const [, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick((t) => t + 1);
    window.addEventListener("saba:service-overrides", fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener("saba:service-overrides", fn);
      window.removeEventListener("storage", fn);
    };
  }, []);
  const store = readStore();
  const baseSlugs = Object.keys(serviceMap);
  const customSlugs = Object.keys(store).filter((s) => !serviceMap[s] && store[s]?.isCustom);
  return [...baseSlugs, ...customSlugs]
    .map((s) => mergeService(s))
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
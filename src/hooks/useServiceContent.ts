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
  overview?: { title: string; desc: string }[];
  benefits?: { title: string; desc: string }[];
  plans?: { name: string; price: string; featured: boolean; feats: string[] }[];
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
      overview: (o.overview ?? []).map((x) => ({ icon: Sparkles, title: x.title, desc: x.desc })),
      benefits: (o.benefits ?? []).map((x) => ({ icon: Sparkles, title: x.title, desc: x.desc })),
      plans: o.plans ?? [],
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
    overview: o.overview
      ? base.overview.map((b, i) => ({ ...b, title: o.overview![i]?.title ?? b.title, desc: o.overview![i]?.desc ?? b.desc }))
      : base.overview,
    benefits: o.benefits
      ? base.benefits.map((b, i) => ({ ...b, title: o.benefits![i]?.title ?? b.title, desc: o.benefits![i]?.desc ?? b.desc }))
      : base.benefits,
    plans: o.plans ?? base.plans,
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
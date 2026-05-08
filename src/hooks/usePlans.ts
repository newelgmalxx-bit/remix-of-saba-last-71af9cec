import { useEffect, useState, useCallback } from "react";
import { admin as adminApi, publicApi } from "@/lib/api";
import type { Plan as ApiPlan } from "@/lib/api/types";

export type Plan = {
  id: string;
  name: string;
  nameEn?: string;
  price: string;
  originalPrice?: string;
  featured: boolean;
  badge?: string;
  badgeEn?: string;
  description?: string;
  descriptionEn?: string;
  feats: string[];
  featsEn?: string[];
  status?: string;
};

const KEY = "saba_plans_v1";

export const defaultPlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "1,500",
    originalPrice: "1,800",
    featured: false,
    badge: "للبداية",
    description: "مناسبة للمشاريع الصغيرة والأفكار الأولية.",
    feats: ["باقة أساسية", "تسليم خلال 7 أيام", "جولة تعديل واحدة", "دعم لمدة أسبوع"],
  },
  {
    id: "basic",
    name: "Basic",
    price: "3,500",
    originalPrice: "4,200",
    featured: false,
    description: "حلّ متكامل للشركات الصغيرة والمتوسطة.",
    feats: ["كل ما في Starter", "جولتان تعديل", "هوية بسيطة", "دعم لمدة شهر"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "6,500",
    originalPrice: "8,500",
    featured: true,
    badge: "الأكثر طلباً",
    description: "الباقة الأمثل للنمو الفعلي وتحقيق نتائج أسرع.",
    feats: ["كل ما في Basic", "ربط مع قنواتك", "أولوية في التنفيذ", "تقارير دورية", "دعم لمدة 3 أشهر"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "9,900",
    originalPrice: "12,900",
    featured: false,
    badge: "متكاملة",
    description: "حل شامل بتخصيص كامل للشركات الكبرى.",
    feats: ["كل ما في Pro", "تخصيص متقدم", "مدير حساب مخصص", "دعم أولوية 24/7"],
  },
];

function read(): Plan[] {
  if (typeof window === "undefined") return defaultPlans;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultPlans;
    const parsed = JSON.parse(raw) as Plan[];
    return Array.isArray(parsed) && parsed.length ? parsed : defaultPlans;
  } catch {
    return defaultPlans;
  }
}

function write(plans: Plan[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(plans));
  window.dispatchEvent(new Event("saba:plans"));
}

function fromApi(p: ApiPlan): Plan {
  const amount = (p.price as any)?.amount ?? p.price ?? 0;
  const original = (p.price as any)?.originalAmount ?? null;
  return {
    id: p.id,
    name: p.nameAr || p.nameEn || "",
    nameEn: p.nameEn || p.nameAr || "",
    price: String(amount ?? ""),
    originalPrice: original != null ? String(original) : undefined,
    featured: !!p.highlighted,
    feats: Array.isArray(p.featuresAr) && p.featuresAr.length ? p.featuresAr : [],
    featsEn: Array.isArray(p.featuresEn) && p.featuresEn.length ? p.featuresEn : [],
    status: p.status || "active",
    badge: p.badgeAr || undefined,
    badgeEn: p.badgeEn || undefined,
  };
}

function toApi(p: Plan, idx: number): any {
  return {
    id: p.id,
    nameAr: p.name,
    nameEn: p.nameEn || p.name,
    price: parseInt((p.price || "").replace(/[^\d]/g, ""), 10) || 0,
    originalPrice: p.originalPrice ? parseInt(p.originalPrice.replace(/[^\d]/g, ""), 10) : undefined,
    featuresAr: p.feats,
    featuresEn: p.featsEn ?? p.feats,
    highlighted: p.featured,
    sortOrder: idx,
    status: "active",
  };
}

export function usePlans(opts?: { source?: "public" | "admin" }) {
  const source = opts?.source ?? "public";
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);

  useEffect(() => {
    setPlans(read());
    // try to refresh from backend
    (async () => {
      try {
        const res: any = source === "admin"
          ? await adminApi.plans.list()
          : await publicApi.getPlans();
        const items: ApiPlan[] | undefined = res?.items ?? res?.data?.items;
        if (items?.length) {
          const mapped = items.map(fromApi);
          write(mapped);
          setPlans(mapped);
        }
      } catch {}
    })();
    const fn = () => setPlans(read());
    window.addEventListener("saba:plans", fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener("saba:plans", fn);
      window.removeEventListener("storage", fn);
    };
  }, [source]);

  const save = useCallback((next: Plan[]) => {
    write(next);
    setPlans(next);
    (async () => {
      try {
        await Promise.all(next.map((p, i) => adminApi.plans.update(p.id, toApi(p, i) as any).catch(async () => {
          await adminApi.plans.create(toApi(p, i) as any);
        })));
      } catch {}
    })();
  }, []);

  const reset = useCallback(() => {
    write(defaultPlans);
    setPlans(defaultPlans);
  }, []);

  return { plans, save, reset };
}
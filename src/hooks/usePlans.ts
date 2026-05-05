import { useEffect, useState, useCallback } from "react";

export type Plan = {
  id: string;
  name: string;
  price: string;
  featured: boolean;
  badge?: string;
  description?: string;
  feats: string[];
};

const KEY = "saba_plans_v1";

export const defaultPlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "1,500",
    featured: false,
    badge: "للبداية",
    description: "مناسبة للمشاريع الصغيرة والأفكار الأولية.",
    feats: ["باقة أساسية", "تسليم خلال 7 أيام", "جولة تعديل واحدة", "دعم لمدة أسبوع"],
  },
  {
    id: "basic",
    name: "Basic",
    price: "3,500",
    featured: false,
    description: "حلّ متكامل للشركات الصغيرة والمتوسطة.",
    feats: ["كل ما في Starter", "جولتان تعديل", "هوية بسيطة", "دعم لمدة شهر"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "6,500",
    featured: true,
    badge: "الأكثر طلباً",
    description: "الباقة الأمثل للنمو الفعلي وتحقيق نتائج أسرع.",
    feats: ["كل ما في Basic", "ربط مع قنواتك", "أولوية في التنفيذ", "تقارير دورية", "دعم لمدة 3 أشهر"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "9,900",
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

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);

  useEffect(() => {
    setPlans(read());
    const fn = () => setPlans(read());
    window.addEventListener("saba:plans", fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener("saba:plans", fn);
      window.removeEventListener("storage", fn);
    };
  }, []);

  const save = useCallback((next: Plan[]) => {
    write(next);
    setPlans(next);
  }, []);

  const reset = useCallback(() => {
    write(defaultPlans);
    setPlans(defaultPlans);
  }, []);

  return { plans, save, reset };
}
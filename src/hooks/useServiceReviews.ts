import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";

export type ServiceReview = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const KEY = "saba_service_reviews_v1";

function readAll(): Record<string, ServiceReview[]> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function writeAll(d: Record<string, ServiceReview[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(d));
  window.dispatchEvent(new Event("saba:reviews"));
}

function seed(slug: string): ServiceReview[] {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const names = ["أحمد م.", "سارة ع.", "خالد ر.", "نورة س.", "فهد أ."];
  return Array.from({ length: 3 }).map((_, i) => ({
    id: `seed_${slug}_${i}`,
    userName: names[(h + i) % names.length],
    rating: 4 + ((h + i) % 2),
    comment: ["تجربة ممتازة وفريق محترف.", "تسليم في الموعد وجودة عالية.", "أنصح بالتعامل معهم بقوة."][i],
    createdAt: new Date(Date.now() - (i + 1) * 86400000 * 7).toISOString(),
  }));
}

export function useServiceReviews(slug: string) {
  const { user, isAuthenticated } = useAuth();
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fn = () => setTick((t) => t + 1);
    window.addEventListener("saba:reviews", fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener("saba:reviews", fn);
      window.removeEventListener("storage", fn);
    };
  }, []);

  const all = mounted ? readAll() : {};
  const stored = all[slug];
  const reviews: ServiceReview[] = stored && stored.length ? stored : (mounted ? seed(slug) : []);

  const summary = (() => {
    if (!reviews.length) return { average: 0, count: 0 };
    const sum = reviews.reduce((a, r) => a + r.rating, 0);
    return { average: sum / reviews.length, count: reviews.length };
  })();

  const addReview = useCallback((rating: number, comment: string) => {
    if (!isAuthenticated) return false;
    const cur = readAll();
    const list = cur[slug] && cur[slug].length ? cur[slug] : seed(slug);
    const nr: ServiceReview = {
      id: `rv_${Date.now()}`,
      userName: user?.name || "مستخدم",
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    cur[slug] = [nr, ...list];
    writeAll(cur);
    setTick((t) => t + 1);
    return true;
  }, [slug, isAuthenticated, user]);

  // suppress unused tick warning
  void tick;

  return { reviews, summary, addReview };
}
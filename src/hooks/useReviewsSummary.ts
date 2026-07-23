import { useEffect, useState } from "react";
import { reviews as reviewsApi } from "@/lib/api/services";

export type ReviewSummary = { average: number; count: number };

let cache: Map<string, ReviewSummary> | null = null;
let inflight: Promise<Map<string, ReviewSummary>> | null = null;
const listeners = new Set<() => void>();

async function loadAll(): Promise<Map<string, ReviewSummary>> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const map = new Map<string, ReviewSummary>();
    try {
      const res: any = await reviewsApi.list();
      const items: any[] = res?.data?.items ?? res?.items ?? [];
      const grouped: Record<string, number[]> = {};
      for (const r of items) {
        const slug = r?.serviceSlug || r?.service_slug;
        const rating = Number(r?.rating);
        if (!slug || !rating) continue;
        (grouped[slug] ||= []).push(rating);
      }
      for (const [slug, arr] of Object.entries(grouped)) {
        map.set(slug, {
          average: arr.reduce((a, b) => a + b, 0) / arr.length,
          count: arr.length,
        });
      }
    } catch {
      /* ignore */
    }
    cache = map;
    inflight = null;
    listeners.forEach((fn) => fn());
    return map;
  })();
  return inflight;
}

export function useReviewsSummary(slug: string): ReviewSummary {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    listeners.add(fn);
    if (!cache) {
      const w = window as any;
      const start = () => {
        if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(() => void loadAll(), { timeout: 4000 });
        else setTimeout(() => void loadAll(), 2000);
      };
      if (document.readyState === "complete") start();
      else window.addEventListener("load", start, { once: true });
    }
    return () => { listeners.delete(fn); };
  }, []);
  return cache?.get(slug) || { average: 0, count: 0 };
}

export function refreshReviewsSummary() {
  cache = null;
  inflight = null;
  loadAll();
}

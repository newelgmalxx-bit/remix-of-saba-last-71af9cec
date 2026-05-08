import { useEffect, useState, useCallback, useRef } from "react";
import api from "@/lib/api";
import type { CartLine } from "@/lib/api";

export type CartItem = {
  id: string;
  serviceSlug: string;
  serviceTitle: string;
  planId: string;
  planName: string;
  price: number;
  qty: number;
  // Standalone-plan support (optional, doesn't affect service items)
  type?: "service" | "plan";
  badge?: string | null;
  highlighted?: boolean;
  features?: string[];
};

const STORAGE_KEY = "saba_cart_v1";
const VAT_RATE = 0.15;

function normalizeFromApi(line: CartLine): CartItem {
  const anyLine = line as any;
  const type: "service" | "plan" = anyLine.type === "plan" ? "plan" : "service";
  const isPlan = type === "plan";
  const slug = isPlan
    ? `plan:${anyLine.planId ?? line.plan_id ?? line.id}`
    : line.service_slug;
  return {
    id: String(line.id),
    serviceSlug: slug,
    serviceTitle: anyLine.title ?? line.service_title ?? "",
    planId: isPlan ? String(anyLine.planId ?? line.plan_id ?? "") : (line.plan_id ?? "default"),
    planName: line.plan_name ?? "",
    price: Number(line.price) || 0,
    qty: Number(line.qty) || 1,
    type,
    badge: anyLine.badge ?? null,
    highlighted: !!anyLine.highlighted,
    features: Array.isArray(anyLine.features) ? anyLine.features : [],
  };
}

type State = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  loading: boolean;
  error: string | null;
};

function computeTotals(
  items: CartItem[],
): Pick<State, "subtotal" | "discount" | "vat" | "total"> {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = 0;
  const taxable = Math.max(0, subtotal - discount);
  const vat = +(taxable * VAT_RATE).toFixed(2);
  const total = +(taxable + vat).toFixed(2);
  return { subtotal, discount, vat, total };
}

function loadLocal(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function saveLocal(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

const initialItems = loadLocal();
let cache: State = {
  items: initialItems,
  ...computeTotals(initialItems),
  loading: false,
  error: null,
};
const listeners = new Set<(s: State) => void>();
function setCache(next: State) {
  cache = next;
  saveLocal(next.items);
  listeners.forEach((fn) => fn(next));
}

async function trySyncFromApi(): Promise<void> {
  try {
    const res = await api.cart.get();
    const remoteItems = (res.items || []).map(normalizeFromApi);
    // Preserve local-only fallback plan items (created before the backend
    // accepted plans). Anything the backend returned takes precedence.
    const remoteSlugs = new Set(remoteItems.map((i) => i.serviceSlug));
    const localOnly = cache.items.filter(
      (i) => i.serviceSlug.startsWith("plan:") && i.id.startsWith("local-") && !remoteSlugs.has(i.serviceSlug),
    );
    const merged = [...remoteItems, ...localOnly];
    setCache({
      items: merged,
      ...computeTotals(merged),
      loading: false,
      error: null,
    });
  } catch { /* silent — local cart still works */ }
}

export function useCart() {
  // Start with empty state to match SSR; hydrate from localStorage after mount.
  const [state, setState] = useState<State>({ items: [], subtotal: 0, discount: 0, vat: 0, total: 0, loading: false, error: null });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    // Sync from cache (loaded from localStorage) after hydration.
    setState(cache);
    const fn = (s: State) => mounted.current && setState(s);
    listeners.add(fn);
    trySyncFromApi();
    return () => { mounted.current = false; listeners.delete(fn); };
  }, []);

  const add = useCallback(
    async (item: { serviceSlug: string; serviceTitle?: string; planId?: string; planName?: string; price?: number; qty?: number }) => {
      const qty = item.qty ?? 1;
      const planId = item.planId || "default";
      const existingIdx = cache.items.findIndex(
        (i) => i.serviceSlug === item.serviceSlug && i.planId === planId,
      );
      let nextItems: CartItem[];
      if (existingIdx >= 0) {
        nextItems = cache.items.map((i, idx) => idx === existingIdx ? { ...i, qty: i.qty + qty } : i);
      } else {
        nextItems = [
          ...cache.items,
          {
            id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            serviceSlug: item.serviceSlug,
            serviceTitle: item.serviceTitle || item.serviceSlug,
            planId,
            planName: item.planName || "أساسي",
            price: Number(item.price) || 0,
            qty,
          },
        ];
      }
      setCache({ ...cache, items: nextItems, ...computeTotals(nextItems), error: null });
      if (item.serviceSlug.startsWith("plan:")) {
        const planUuid = item.serviceSlug.slice("plan:".length);
        try {
          await api.cart.addPlanItem({ planId: planUuid, qty });
          await trySyncFromApi();
        } catch { /* keep local fallback */ }
      } else {
        try {
          await api.cart.addItem({ serviceSlug: item.serviceSlug, planId: item.planId, qty });
          await trySyncFromApi();
        } catch { /* keep local fallback */ }
      }
    },
    [],
  );

  const addPlan = useCallback(
    async (planId: string, qty: number = 1) => {
      // Optimistic — server will return canonical fields on next sync.
      const slug = `plan:${planId}`;
      const existingIdx = cache.items.findIndex((i) => i.serviceSlug === slug);
      let nextItems: CartItem[];
      if (existingIdx >= 0) {
        nextItems = cache.items.map((i, idx) => idx === existingIdx ? { ...i, qty: i.qty + qty } : i);
      } else {
        nextItems = [
          ...cache.items,
          {
            id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            serviceSlug: slug,
            serviceTitle: "",
            planId,
            planName: "",
            price: 0,
            qty,
            type: "plan",
          },
        ];
      }
      setCache({ ...cache, items: nextItems, ...computeTotals(nextItems), error: null });
      try {
        await api.cart.addPlanItem({ planId, qty });
        await trySyncFromApi();
      } catch { /* keep local fallback */ }
    },
    [],
  );

  const remove = useCallback(async (lineId: string) => {
    const nextItems = cache.items.filter((i) => i.id !== lineId);
    setCache({ ...cache, items: nextItems, ...computeTotals(nextItems) });
    if (!lineId.startsWith("local-")) {
      try { await api.cart.removeItem(lineId); await trySyncFromApi(); } catch {}
    }
  }, []);

  const updateQty = useCallback(async (lineId: string, qty: number) => {
    if (qty < 1) return remove(lineId);
    const nextItems = cache.items.map((i) => i.id === lineId ? { ...i, qty } : i);
    setCache({ ...cache, items: nextItems, ...computeTotals(nextItems) });
    if (!lineId.startsWith("local-")) {
      try { await api.cart.updateItem(lineId, qty); await trySyncFromApi(); } catch {}
    }
  }, [remove]);

  const clear = useCallback(async () => {
    const ids = cache.items.map((i) => i.id);
    setCache({ items: [], subtotal: 0, discount: 0, vat: 0, total: 0, loading: false, error: null });
    for (const id of ids) {
      api.cart.removeItem(id).catch(() => {});
    }
  }, []);

  const refresh = useCallback(() => trySyncFromApi(), []);

  const count = state.items.reduce((s, i) => s + i.qty, 0);

  return {
    items: state.items,
    subtotal: state.subtotal,
    discount: state.discount,
    vat: state.vat,
    total: state.total,
    loading: state.loading,
    error: state.error,
    count,
    add,
    addPlan,
    remove,
    updateQty,
    clear,
    refresh,
  };
}

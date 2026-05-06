import { useEffect, useState, useCallback, useRef } from "react";
import api from "@/lib/api";
import type { CartLine } from "@/lib/api";
import { validateCouponFn, incrementCouponUsageFn } from "@/functions/coupons.functions";

export type CartItem = {
  id: string;
  serviceSlug: string;
  serviceTitle: string;
  planId: string;
  planName: string;
  price: number;
  qty: number;
};

const STORAGE_KEY = "saba_cart_v1";
const COUPON_KEY = "saba_cart_coupon_v1";
const VAT_RATE = 0.15;

function normalizeFromApi(line: CartLine): CartItem {
  return {
    id: String(line.id),
    serviceSlug: line.service_slug,
    serviceTitle: line.service_title,
    planId: line.plan_id ?? "default",
    planName: line.plan_name ?? "",
    price: Number(line.price) || 0,
    qty: Number(line.qty) || 1,
  };
}

export type AppliedCoupon = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  discount: number;
};

type State = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  coupon: AppliedCoupon | null;
  loading: boolean;
  error: string | null;
};

function computeTotals(
  items: CartItem[],
  coupon: AppliedCoupon | null = null,
): Pick<State, "subtotal" | "discount" | "vat" | "total"> {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;
  if (coupon) {
    discount =
      coupon.type === "percent"
        ? +(subtotal * (coupon.value / 100)).toFixed(2)
        : Math.min(coupon.value, subtotal);
  }
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

function loadCoupon(): AppliedCoupon | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COUPON_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveCoupon(c: AppliedCoupon | null) {
  if (typeof window === "undefined") return;
  try {
    if (c) localStorage.setItem(COUPON_KEY, JSON.stringify(c));
    else localStorage.removeItem(COUPON_KEY);
  } catch {}
}

const initialItems = loadLocal();
const initialCoupon = loadCoupon();
let cache: State = {
  items: initialItems,
  ...computeTotals(initialItems, initialCoupon),
  coupon: initialCoupon,
  loading: false,
  error: null,
};
const listeners = new Set<(s: State) => void>();
function setCache(next: State) {
  cache = next;
  saveLocal(next.items);
  saveCoupon(next.coupon);
  listeners.forEach((fn) => fn(next));
}

async function trySyncFromApi(): Promise<void> {
  try {
    const res = await api.cart.get();
    const remoteItems = (res.items || []).map(normalizeFromApi);
    setCache({
      items: remoteItems,
      ...computeTotals(remoteItems, cache.coupon),
      coupon: cache.coupon,
      loading: false,
      error: null,
    });
  } catch { /* silent — local cart still works */ }
}

export function useCart() {
  // Start with empty state to match SSR; hydrate from localStorage after mount.
  const [state, setState] = useState<State>({ items: [], subtotal: 0, discount: 0, vat: 0, total: 0, coupon: null, loading: false, error: null });
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
      setCache({ ...cache, items: nextItems, ...computeTotals(nextItems, cache.coupon), error: null });
      try {
        await api.cart.addItem({ serviceSlug: item.serviceSlug, planId: item.planId, qty });
        await trySyncFromApi();
      } catch { /* keep local fallback */ }
    },
    [],
  );

  const remove = useCallback(async (lineId: string) => {
    const nextItems = cache.items.filter((i) => i.id !== lineId);
    setCache({ ...cache, items: nextItems, ...computeTotals(nextItems, cache.coupon) });
    try { await api.cart.removeItem(lineId); await trySyncFromApi(); } catch {}
  }, []);

  const updateQty = useCallback(async (lineId: string, qty: number) => {
    if (qty < 1) return remove(lineId);
    const nextItems = cache.items.map((i) => i.id === lineId ? { ...i, qty } : i);
    setCache({ ...cache, items: nextItems, ...computeTotals(nextItems, cache.coupon) });
    try { await api.cart.updateItem(lineId, qty); await trySyncFromApi(); } catch {}
  }, [remove]);

  const clear = useCallback(async () => {
    const ids = cache.items.map((i) => i.id);
    setCache({ items: [], subtotal: 0, discount: 0, vat: 0, total: 0, coupon: null, loading: false, error: null });
    for (const id of ids) {
      api.cart.removeItem(id).catch(() => {});
    }
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    const subtotal = cache.items.reduce((s, i) => s + i.price * i.qty, 0);
    const res = await validateCouponFn({ data: { code, subtotal } });
    if (!res.valid) {
      throw new Error(res.message || "INVALID");
    }
    const coupon: AppliedCoupon = {
      id: res.id,
      code: res.code,
      type: res.type,
      value: res.value,
      discount: res.discount,
    };
    setCache({ ...cache, coupon, ...computeTotals(cache.items, coupon) });
    return coupon;
  }, []);

  const removeCoupon = useCallback(() => {
    setCache({ ...cache, coupon: null, ...computeTotals(cache.items, null) });
  }, []);

  const markCouponUsed = useCallback(async () => {
    if (cache.coupon) {
      try { await incrementCouponUsageFn({ data: { id: cache.coupon.id } }); } catch {}
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
    coupon: state.coupon,
    loading: state.loading,
    error: state.error,
    count,
    add,
    remove,
    updateQty,
    clear,
    applyCoupon,
    removeCoupon,
    markCouponUsed,
    refresh,
  };
}

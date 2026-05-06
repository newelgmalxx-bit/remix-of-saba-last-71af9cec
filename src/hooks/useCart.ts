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
};

const STORAGE_KEY = "saba_cart_v1";
const VAT_RATE = 0.15;

function normalizeFromApi(line: CartLine): CartItem {
  return {
    id: String(line.id),
    serviceSlug: line.service_slug,
    serviceTitle: line.service_title,
    planId: line.plan_id,
    planName: line.plan_name,
    price: Number(line.price) || 0,
    qty: Number(line.qty) || 1,
  };
}

type State = {
  items: CartItem[];
  subtotal: number;
  vat: number;
  total: number;
  loading: boolean;
  error: string | null;
};

function computeTotals(items: CartItem[]): Pick<State, "subtotal" | "vat" | "total"> {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const vat = +(subtotal * VAT_RATE).toFixed(2);
  const total = +(subtotal + vat).toFixed(2);
  return { subtotal, vat, total };
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
let cache: State = { items: initialItems, ...computeTotals(initialItems), loading: false, error: null };
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
    if (remoteItems.length > 0) {
      setCache({
        items: remoteItems,
        subtotal: Number(res.subtotal) || computeTotals(remoteItems).subtotal,
        vat: Number(res.vat) || computeTotals(remoteItems).vat,
        total: Number(res.total) || computeTotals(remoteItems).total,
        loading: false,
        error: null,
      });
    }
  } catch { /* silent — local cart still works */ }
}

export function useCart() {
  const [state, setState] = useState<State>(cache);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
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
      // Fire-and-forget API sync
      api.cart.addItem({ serviceSlug: item.serviceSlug, planId: item.planId, qty }).catch(() => {});
    },
    [],
  );

  const remove = useCallback(async (lineId: string) => {
    const nextItems = cache.items.filter((i) => i.id !== lineId);
    setCache({ ...cache, items: nextItems, ...computeTotals(nextItems) });
    api.cart.removeItem(lineId).catch(() => {});
  }, []);

  const updateQty = useCallback(async (lineId: string, qty: number) => {
    if (qty < 1) return remove(lineId);
    const nextItems = cache.items.map((i) => i.id === lineId ? { ...i, qty } : i);
    setCache({ ...cache, items: nextItems, ...computeTotals(nextItems) });
    api.cart.updateItem(lineId, qty).catch(() => {});
  }, [remove]);

  const clear = useCallback(async () => {
    const ids = cache.items.map((i) => i.id);
    setCache({ items: [], subtotal: 0, vat: 0, total: 0, loading: false, error: null });
    for (const id of ids) {
      api.cart.removeItem(id).catch(() => {});
    }
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const res = await api.cart.applyCoupon(code);
      const items = (res.items || []).map(normalizeFromApi);
      if (items.length) {
        setCache({
          ...cache,
          items,
          subtotal: Number(res.subtotal) || 0,
          vat: cache.vat,
          total: Number(res.total) || 0,
        });
      }
      return res;
    } catch (e) {
      throw e;
    }
  }, []);

  const refresh = useCallback(() => trySyncFromApi(), []);

  const count = state.items.reduce((s, i) => s + i.qty, 0);

  return {
    items: state.items,
    subtotal: state.subtotal,
    vat: state.vat,
    total: state.total,
    loading: state.loading,
    error: state.error,
    count,
    add,
    remove,
    updateQty,
    clear,
    applyCoupon,
    refresh,
  };
}

import { useEffect, useState, useCallback, useRef } from "react";
import api from "@/lib/api";
import type { CartLine } from "@/lib/api";

// Frontend-friendly shape (camelCase) — matches existing component usage.
export type CartItem = {
  id: string;
  serviceSlug: string;
  serviceTitle: string;
  planId: string;
  planName: string;
  price: number;
  qty: number;
};

function normalize(line: CartLine): CartItem {
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

const initial: State = { items: [], subtotal: 0, vat: 0, total: 0, loading: false, error: null };

// Module-level cache so all components share the same cart state.
let cache: State = initial;
const listeners = new Set<(s: State) => void>();
function setCache(next: State) {
  cache = next;
  listeners.forEach((fn) => fn(next));
}

let inflight: Promise<void> | null = null;

async function refresh(): Promise<void> {
  if (inflight) return inflight;
  inflight = (async () => {
    setCache({ ...cache, loading: true, error: null });
    try {
      const res = await api.cart.get();
      setCache({
        items: (res.items || []).map(normalize),
        subtotal: Number(res.subtotal) || 0,
        vat: Number(res.vat) || 0,
        total: Number(res.total) || 0,
        loading: false,
        error: null,
      });
    } catch (e: any) {
      setCache({ ...cache, loading: false, error: e?.message || "Failed to load cart" });
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function useCart() {
  const [state, setState] = useState<State>(cache);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const fn = (s: State) => mounted.current && setState(s);
    listeners.add(fn);
    // Initial load: only if we don't already have items cached.
    if (cache === initial) refresh();
    return () => {
      mounted.current = false;
      listeners.delete(fn);
    };
  }, []);

  const add = useCallback(
    async (item: { serviceSlug: string; serviceTitle?: string; planId?: string; planName?: string; price?: number; qty?: number }) => {
      try {
        await api.cart.addItem({
          serviceSlug: item.serviceSlug,
          planId: item.planId,
          qty: item.qty ?? 1,
        });
        await refresh();
      } catch (e: any) {
        setCache({ ...cache, error: e?.message || "Failed to add to cart" });
        throw e;
      }
    },
    [],
  );

  const remove = useCallback(async (lineId: string) => {
    try { await api.cart.removeItem(lineId); await refresh(); }
    catch (e: any) { setCache({ ...cache, error: e?.message || "Failed to remove" }); }
  }, []);

  const updateQty = useCallback(async (lineId: string, qty: number) => {
    if (qty < 1) return remove(lineId);
    try { await api.cart.updateItem(lineId, qty); await refresh(); }
    catch (e: any) { setCache({ ...cache, error: e?.message || "Failed to update" }); }
  }, [remove]);

  const clear = useCallback(async () => {
    // No bulk-clear endpoint; remove items one by one.
    const ids = cache.items.map((i) => i.id);
    for (const id of ids) {
      try { await api.cart.removeItem(id); } catch { /* ignore */ }
    }
    await refresh();
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    const res = await api.cart.applyCoupon(code);
    setCache({
      ...cache,
      items: (res.items || []).map(normalize),
      subtotal: Number(res.subtotal) || 0,
      total: Number(res.total) || 0,
    });
    return res;
  }, []);

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

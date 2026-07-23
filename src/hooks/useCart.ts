import { useEffect, useState, useCallback, useRef } from "react";
import { runAfterCriticalPaint } from "@/lib/startup";

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

function normalizeFromApi(line: any): CartItem {
  return {
    id: String(line.id),
    serviceSlug: line.serviceSlug ?? line.service_slug ?? "",
    serviceTitle: line.serviceTitle ?? line.service_title ?? "",
    planId: line.planId ?? line.plan_id ?? line.servicePlanId ?? "default",
    planName: line.planName ?? line.plan_name ?? "",
    price: Number(line.price) || 0,
    qty: Number(line.qty) || 1,
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

function saveLocal(_items: CartItem[]) {
  // Cart state is the source of truth on the backend. We intentionally do
  // NOT persist items to localStorage — keeping them around caused "ghost"
  // items to appear on the cart page when the backend cart was empty.
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

const initialItems: CartItem[] = [];
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

let didInitialSync = false;
const getCartApi = async () => (await import("@/lib/api/cart")).cart;
async function trySyncFromApi(initial = false): Promise<void> {
  if (initial) setCache({ ...cache, loading: true, error: null });
  try {
    const cartApi = await getCartApi();
    const res: any = await cartApi.get();
    const remoteItems = (res?.data?.items ?? res?.items ?? []).map(normalizeFromApi);
    setCache({
      items: remoteItems,
      ...computeTotals(remoteItems),
      loading: false,
      error: null,
    });
  } catch (err: any) {
    setCache({
      ...cache,
      loading: false,
      error: initial ? (err?.message || "Couldn't load cart") : cache.error,
    });
  }
}

export function useCart() {
  // Start with empty state to match SSR; hydrate from localStorage after mount.
  const [state, setState] = useState<State>({ items: [], subtotal: 0, discount: 0, vat: 0, total: 0, loading: false, error: null });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setState(cache);
    const fn = (s: State) => mounted.current && setState(s);
    listeners.add(fn);
    let cancel: (() => void) | undefined;
    if (!didInitialSync) {
      didInitialSync = true;
      cancel = runAfterCriticalPaint(() => void trySyncFromApi(true), 10000);
    }
    return () => { mounted.current = false; listeners.delete(fn); cancel?.(); };
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
      // Plan items (Starter/Basic/Pro/Premium) come from the standalone /plans endpoint.
      // We send them with `servicePlanId` (from the `plan:<id>` slug) and no serviceId.
      const isPlanLine = item.serviceSlug.startsWith("plan:");
      const servicePlanId = isPlanLine ? item.serviceSlug.slice(5) : undefined;
        try {
          const cartApi = await getCartApi();
          await cartApi.add({
            serviceSlug: item.serviceSlug,
            serviceTitle: item.serviceTitle,
            planName: item.planName,
            qty,
            price: Number(item.price) || 0,
            servicePlanId,
          });
          await trySyncFromApi();
        } catch { /* keep local fallback */ }
    },
    [],
  );

  const remove = useCallback(async (lineId: string) => {
    const nextItems = cache.items.filter((i) => i.id !== lineId);
    setCache({ ...cache, items: nextItems, ...computeTotals(nextItems) });
    if (!lineId.startsWith("local-")) {
      try { const cartApi = await getCartApi(); await cartApi.remove(lineId); await trySyncFromApi(); } catch {}
    }
  }, []);

  const updateQty = useCallback(async (lineId: string, qty: number) => {
    if (qty < 1) return remove(lineId);
    const nextItems = cache.items.map((i) => i.id === lineId ? { ...i, qty } : i);
    setCache({ ...cache, items: nextItems, ...computeTotals(nextItems) });
    if (!lineId.startsWith("local-")) {
      try { const cartApi = await getCartApi(); await cartApi.updateQty(lineId, qty); await trySyncFromApi(); } catch {}
    }
  }, [remove]);

  const clear = useCallback(async () => {
    const ids = cache.items.map((i) => i.id);
    setCache({ items: [], subtotal: 0, discount: 0, vat: 0, total: 0, loading: false, error: null });
    for (const id of ids) {
      getCartApi().then((cartApi) => cartApi.remove(id)).catch(() => {});
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
    remove,
    updateQty,
    clear,
    refresh,
  };
}

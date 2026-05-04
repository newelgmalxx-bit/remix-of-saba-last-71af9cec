import { useEffect, useState, useCallback } from "react";
import type { CartItem } from "@/data/account";

const KEY = "saba_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("saba:cart"));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const onChange = () => setItems(read());
    window.addEventListener("saba:cart", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("saba:cart", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = useCallback((item: Omit<CartItem, "id" | "qty"> & { qty?: number }) => {
    const cur = read();
    const existing = cur.find(
      (c) => c.serviceSlug === item.serviceSlug && c.planName === item.planName,
    );
    if (existing) {
      existing.qty += item.qty ?? 1;
    } else {
      cur.push({
        ...item,
        qty: item.qty ?? 1,
        id: `ci_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      });
    }
    write(cur);
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((c) => c.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    const cur = read().map((c) => (c.id === id ? { ...c, qty: Math.max(1, qty) } : c));
    write(cur);
  }, []);

  const clear = useCallback(() => write([]), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const vat = Math.round(subtotal * 0.15);
  const total = subtotal + vat;

  return { items, add, remove, updateQty, clear, subtotal, vat, total, count: items.reduce((s, i) => s + i.qty, 0) };
}
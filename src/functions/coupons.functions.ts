import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type CouponInput = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minAmount?: number | null;
  maxUses?: number | null;
  expiresAt?: string | null;
  active?: boolean;
  description?: string | null;
};

function rowToCoupon(r: any) {
  return {
    id: r.id,
    code: r.code,
    type: r.type,
    value: Number(r.value),
    minAmount: r.min_amount != null ? Number(r.min_amount) : null,
    maxUses: r.max_uses,
    usedCount: r.used_count ?? 0,
    expiresAt: r.expires_at,
    active: !!r.active,
    description: r.description,
  };
}

function toRow(input: CouponInput) {
  return {
    code: input.code.trim().toUpperCase(),
    type: input.type,
    value: Number(input.value) || 0,
    min_amount: input.minAmount ?? null,
    max_uses: input.maxUses ?? null,
    expires_at: input.expiresAt || null,
    active: input.active ?? true,
    description: input.description ?? null,
  };
}

export const listCoupons = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { items: (data ?? []).map(rowToCoupon) };
});

export const createCouponFn = createServerFn({ method: "POST" })
  .inputValidator((input: CouponInput) => input)
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("coupons")
      .insert(toRow(data))
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { coupon: rowToCoupon(row) };
  });

export const updateCouponFn = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string } & CouponInput) => input)
  .handler(async ({ data }) => {
    const { id, ...rest } = data;
    const { data: row, error } = await supabaseAdmin
      .from("coupons")
      .update(toRow(rest))
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { coupon: rowToCoupon(row) };
  });

export const deleteCouponFn = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("coupons").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toggleCouponFn = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; active: boolean }) => input)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("coupons")
      .update({ active: data.active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const validateCouponFn = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string; subtotal: number }) => input)
  .handler(async ({ data }) => {
    const code = (data.code || "").trim().toUpperCase();
    if (!code) return { valid: false as const, message: "Empty code" };
    const { data: row, error } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .eq("code", code)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return { valid: false as const, message: "NOT_FOUND" };
    if (!row.active) return { valid: false as const, message: "INACTIVE" };
    if (row.expires_at && new Date(row.expires_at).getTime() < Date.now())
      return { valid: false as const, message: "EXPIRED" };
    if (row.max_uses != null && (row.used_count ?? 0) >= row.max_uses)
      return { valid: false as const, message: "MAX_USES" };
    const sub = Number(data.subtotal) || 0;
    if (row.min_amount != null && sub < Number(row.min_amount))
      return { valid: false as const, message: "MIN_AMOUNT", minAmount: Number(row.min_amount) };
    const value = Number(row.value) || 0;
    const discount =
      row.type === "percent"
        ? +(sub * (value / 100)).toFixed(2)
        : Math.min(value, sub);
    return {
      valid: true as const,
      id: row.id as string,
      code: row.code as string,
      type: row.type as "percent" | "fixed",
      value,
      discount,
    };
  });

export const incrementCouponUsageFn = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const { data: row } = await supabaseAdmin
      .from("coupons")
      .select("used_count")
      .eq("id", data.id)
      .maybeSingle();
    const next = (row?.used_count ?? 0) + 1;
    await supabaseAdmin.from("coupons").update({ used_count: next }).eq("id", data.id);
    return { ok: true };
  });
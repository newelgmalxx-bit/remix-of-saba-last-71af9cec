import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, X } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/data/account";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "سلة المشتريات | سابا ديزاين" }, { name: "description", content: "راجع طلباتك وأكمل عملية الشراء." }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, updateQty, subtotal, discount, vat, total, count, coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [applying, setApplying] = useState(false);
  const { t, lang, dir } = useLang();

  const L = (a: string, e: string) => (lang === "en" ? e : a);

  const couponErrorText = (m: string) => {
    switch (m) {
      case "NOT_FOUND": return L("الكوبون غير صحيح", "Invalid coupon");
      case "INACTIVE": return L("الكوبون غير مفعّل", "Coupon is inactive");
      case "EXPIRED": return L("الكوبون منتهي الصلاحية", "Coupon expired");
      case "MAX_USES": return L("تم استنفاد الكوبون", "Coupon usage limit reached");
      case "MIN_AMOUNT": return L("لم تصل إلى الحد الأدنى للطلب", "Order does not meet minimum amount");
      default: return L("الكوبون غير صحيح", "Invalid coupon");
    }
  };

  const handleApply = async () => {
    if (!code.trim()) return;
    setApplying(true);
    setCouponMsg(null);
    try {
      const c = await applyCoupon(code);
      setCouponMsg({ type: "ok", text: L(`تم تطبيق ${c.code}`, `Applied ${c.code}`) });
      setCode("");
    } catch (e: any) {
      setCouponMsg({ type: "err", text: couponErrorText(e?.message || "") });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">{t("common.home")}</Link>
            <span>/</span>
            <span className="text-foreground">{t("cart.title")}</span>
          </div>

          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t("cart.title")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{count} {t("cart.itemCount")}</p>
            </div>
            <Link to={"/services" as any} className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <ArrowLeft className={`h-4 w-4 ${dir === "ltr" ? "rotate-180" : ""}`} />
              {t("cart.continueShopping")}
            </Link>
          </div>

          {items.length === 0 ? (
            <EmptyCart t={t} />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-3">
                {items.map((it) => (
                  <div key={it.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm card-hover">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">{t("cart.planLabel")} {it.planName}</div>
                        <h3 className="mt-1 text-base font-bold text-foreground line-clamp-1">{it.serviceTitle}</h3>
                        <Link
                          to="/services/$slug"
                          params={{ slug: it.serviceSlug }}
                          className="mt-1 inline-block text-xs text-primary hover:underline"
                        >
                          {t("cart.viewService")}
                        </Link>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:gap-6">
                        <div className="inline-flex items-center rounded-full border border-border bg-background">
                          <button
                            onClick={() => updateQty(it.id, it.qty - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
                            aria-label={t("cart.dec")}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold" data-ltr-number>{it.qty}</span>
                          <button
                            onClick={() => updateQty(it.id, it.qty + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
                            aria-label={t("cart.inc")}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="min-w-[100px] text-left">
                          <div className="text-base font-bold text-primary" data-ltr-number>{formatCurrency(it.price * it.qty)}</div>
                          <div className="text-[11px] text-muted-foreground" data-ltr-number>{formatCurrency(it.price)} {t("cart.perUnit")}</div>
                        </div>
                        <button
                          onClick={() => remove(it.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-rose-500 hover:bg-rose-50"
                          aria-label={t("cart.delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <aside className="space-y-4">
                <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="text-lg font-bold">{t("cart.summaryTitle")}</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <Row label={t("cart.subtotal")} value={formatCurrency(subtotal)} />
                    {coupon && discount > 0 && (
                      <div className="flex items-center justify-between text-emerald-600">
                        <span className="flex items-center gap-1">
                          {L("خصم", "Discount")} ({coupon.code})
                        </span>
                        <span data-ltr-number>− {formatCurrency(discount)}</span>
                      </div>
                    )}
                    <Row label={t("cart.vat")} value={formatCurrency(vat)} />
                    <div className="my-2 h-px bg-border" />
                    <div className="flex items-center justify-between text-base font-bold">
                      <span>{t("cart.total")}</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <Tag className="h-3.5 w-3.5" /> {t("cart.coupon")}
                    </label>
                    {coupon ? (
                      <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
                        <span className="font-bold text-emerald-700" dir="ltr">{coupon.code}</span>
                        <button
                          type="button"
                          onClick={() => { removeCoupon(); setCouponMsg(null); }}
                          className="rounded-md p-1 text-emerald-700 hover:bg-emerald-100"
                          aria-label={L("إزالة الكوبون", "Remove coupon")}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          value={code}
                          onChange={(e) => setCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => { if (e.key === "Enter") handleApply(); }}
                          placeholder={t("cart.couponPh")}
                          dir="ltr"
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleApply}
                          disabled={applying || !code.trim()}
                          className="rounded-lg border border-border bg-secondary px-4 text-sm font-bold hover:bg-accent disabled:opacity-50"
                        >
                          {applying ? "…" : t("cart.apply")}
                        </button>
                      </div>
                    )}
                    {couponMsg && (
                      <p className={`mt-2 text-xs ${couponMsg.type === "ok" ? "text-emerald-600" : "text-rose-500"}`}>
                        {couponMsg.text}
                      </p>
                    )}
                  </div>

                  <Link
                    to={"/checkout" as any}
                    className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-[0_10px_30px_-10px_rgba(30,91,148,0.6)] hover:bg-primary-dark transition"
                  >
                    {t("cart.checkout")}
                  </Link>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    {t("cart.summarySubtitle")}
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium" data-ltr-number>{value}</span>
    </div>
  );
}

function EmptyCart({ t }: { t: (k: any) => string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-primary">
        <ShoppingBag className="h-9 w-9" />
      </div>
      <h3 className="mt-5 text-xl font-bold">{t("cart.empty.title")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t("cart.empty.alt")}</p>
      <Link
        to={"/services" as any}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
      >
        {t("cart.empty.cta")}
      </Link>
    </div>
  );
}
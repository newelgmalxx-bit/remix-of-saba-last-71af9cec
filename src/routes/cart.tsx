import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/data/account";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "سلة المشتريات | سابا ديزاين" }, { name: "description", content: "راجع طلباتك وأكمل عملية الشراء." }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, updateQty, subtotal, vat, total, count } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const applyCoupon = () => {
    if (!coupon.trim()) return;
    if (coupon.trim().toUpperCase() === "SABA10") setCouponMsg("تم تطبيق خصم 10% (تجريبي)");
    else setCouponMsg("الكوبون غير صالح");
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">الرئيسية</Link>
            <span>/</span>
            <span className="text-foreground">سلة المشتريات</span>
          </div>

          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold">سلة المشتريات</h1>
              <p className="mt-1 text-sm text-muted-foreground">{count} عنصر في السلة</p>
            </div>
            <Link to={"/services" as any} className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              متابعة التسوق
            </Link>
          </div>

          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-3">
                {items.map((it) => (
                  <div key={it.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm card-hover">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">باقة {it.planName}</div>
                        <h3 className="mt-1 text-base font-bold text-foreground line-clamp-1">{it.serviceTitle}</h3>
                        <Link
                          to="/services/$slug"
                          params={{ slug: it.serviceSlug }}
                          className="mt-1 inline-block text-xs text-primary hover:underline"
                        >
                          عرض تفاصيل الخدمة
                        </Link>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:gap-6">
                        <div className="inline-flex items-center rounded-full border border-border bg-background">
                          <button
                            onClick={() => updateQty(it.id, it.qty - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
                            aria-label="نقص"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold" data-ltr-number>{it.qty}</span>
                          <button
                            onClick={() => updateQty(it.id, it.qty + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
                            aria-label="زيادة"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="min-w-[100px] text-left">
                          <div className="text-base font-bold text-primary" data-ltr-number>{formatCurrency(it.price * it.qty)}</div>
                          <div className="text-[11px] text-muted-foreground" data-ltr-number>{formatCurrency(it.price)} / للوحدة</div>
                        </div>
                        <button
                          onClick={() => remove(it.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-rose-500 hover:bg-rose-50"
                          aria-label="حذف"
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
                  <h3 className="text-lg font-bold">ملخّص الطلب</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <Row label="المجموع الفرعي" value={formatCurrency(subtotal)} />
                    <Row label="ضريبة القيمة المضافة (15%)" value={formatCurrency(vat)} />
                    <div className="my-2 h-px bg-border" />
                    <div className="flex items-center justify-between text-base font-bold">
                      <span>الإجمالي</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <Tag className="h-3.5 w-3.5" /> كوبون خصم
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="مثال: SABA10"
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      />
                      <button
                        onClick={applyCoupon}
                        className="rounded-lg border border-border bg-secondary px-4 text-sm font-bold hover:bg-accent"
                      >
                        تطبيق
                      </button>
                    </div>
                    {couponMsg && (
                      <p className={`mt-2 text-xs ${couponMsg.includes("تم") ? "text-emerald-600" : "text-rose-500"}`}>
                        {couponMsg}
                      </p>
                    )}
                  </div>

                  <Link
                    to={"/checkout" as any}
                    className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-[0_10px_30px_-10px_rgba(30,91,148,0.6)] hover:bg-primary-dark transition"
                  >
                    إتمام الطلب
                  </Link>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    دفع آمن • فاتورة ضريبية • دعم متواصل
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

function EmptyCart() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-primary">
        <ShoppingBag className="h-9 w-9" />
      </div>
      <h3 className="mt-5 text-xl font-bold">سلتك فارغة</h3>
      <p className="mt-2 text-sm text-muted-foreground">ابدأ بإضافة باقة من خدماتنا الاحترافية.</p>
      <Link
        to={"/services" as any}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
      >
        تصفح الخدمات
      </Link>
    </div>
  );
}
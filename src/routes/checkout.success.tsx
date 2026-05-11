import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, Download, FileText, Loader2, Receipt, Calendar } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { account } from "@/lib/api";
import { normalizeOrder } from "@/lib/api/normalize";
import { downloadInvoice } from "@/lib/invoice";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, paymentName, type Order } from "@/data/account";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: z.object({
    o: z.string().optional(),
    orderId: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "تم استلام طلبك | سابا ديزاين" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { o, orderId } = Route.useSearch();
  const { t, lang } = useLang();
  const { user } = useAuth();
  const id = orderId || o;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    account.orderDetail(id)
      .then((res: any) => {
        const raw = res?.data?.order ?? res?.order ?? res;
        if (alive && raw) setOrder(normalizeOrder(raw));
      })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.6)]">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-bold">{t("checkout.success.h1")}</h1>
          <p className="mt-2 max-w-md text-muted-foreground">{t("checkout.success.body")}</p>
          {(order?.number || o) && (
            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm">
              <span className="text-sm text-muted-foreground">{t("checkout.success.orderLabel")}</span>
              <span className="text-base font-bold text-primary" dir="ltr">{order?.number || o}</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {order && (
          <div className="mt-8 space-y-5">
            {/* Items */}
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
              <h3 className="mb-4 text-base font-bold">{t("account.order.items")}</h3>
              <div className="space-y-3">
                {order.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold line-clamp-1">{it.serviceTitle}</div>
                        <p className="text-xs text-muted-foreground">
                          {t("account.order.plan")} {it.planName} • {t("account.order.qty")} <span data-ltr-number>{it.qty}</span>
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-end">
                      <div className="text-sm font-bold text-primary" data-ltr-number>{formatCurrency(it.price * it.qty, lang)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Summary */}
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
              <h3 className="text-base font-bold">{t("account.order.summary")}</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("account.order.subtotal")}</span>
                  <span className="font-medium" data-ltr-number>{formatCurrency(order.subtotal, lang)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("account.order.vat")}</span>
                  <span className="font-medium" data-ltr-number>{formatCurrency(order.vat, lang)}</span>
                </div>
                <div className="my-2 h-px bg-border" />
                <div className="flex justify-between text-base font-bold">
                  <span>{t("account.order.total")}</span>
                  <span className="text-primary" data-ltr-number>{formatCurrency(order.total, lang)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" />
                  <span>{paymentName(order.payment, lang)}</span>
                  {order.paid && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {t("account.orders.paid")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span data-ltr-number>{order.createdAt}</span>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {order.paid && (
                <button
                  onClick={() => downloadInvoice(order, user?.name || "")}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
                >
                  <Download className="h-4 w-4" />
                  {t("account.orders.downloadInvoice")}
                </button>
              )}
              <Link
                to={"/account/orders/$orderId" as any}
                params={{ orderId: order.id } as any}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
              >
                <Package className="h-4 w-4" />
                {lang === "ar" ? "تفاصيل الطلب" : "Order details"}
              </Link>
              <Link
                to={"/account/orders" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
              >
                {t("checkout.success.orders")}
              </Link>
            </div>
          </div>
        )}

        {!loading && !order && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={"/account/orders" as any}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
            >
              <Package className="h-4 w-4" />
              {t("checkout.success.orders")}
            </Link>
            <Link
              to={"/" as any}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
            >
              {t("checkout.success.home")}
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

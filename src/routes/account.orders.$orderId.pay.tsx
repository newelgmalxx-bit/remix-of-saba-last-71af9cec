import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Loader2, ShieldCheck, Check, Wallet } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { paymentMethods, type PaymentMethod, formatCurrency, type Order } from "@/data/account";
import { account } from "@/lib/api";
import { normalizeOrder } from "@/lib/api/normalize";
import { useLang } from "@/i18n/LanguageProvider";
import { toast } from "sonner";

export const Route = createFileRoute("/account/orders/$orderId/pay" as any)({
  head: () => ({ meta: [{ title: "إتمام الدفع | سابا ديزاين" }] }),
  component: PayOrderPage,
});

function PayOrderPage() {
  const { orderId } = Route.useParams();
  const { t, lang, dir } = useLang();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("mayfatoorah");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    account.orderDetail(orderId)
      .then((res: any) => {
        const raw = res?.data?.order ?? res?.order ?? res;
        if (alive) {
          const o = normalizeOrder(raw);
          setOrder(o);
          if (o.payment) setPayment(o.payment);
        }
      })
      .catch((e) => { if (alive) setError(e?.message || "error"); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [orderId]);

  const handlePay = async () => {
    if (!order) return;
    setPaying(true);
    try {
      const res: any = await account.payOrder(order.id, { paymentMethod: payment });
      const url = res?.data?.paymentUrl || res?.paymentUrl;
      if (url) {
        window.location.href = url;
        return;
      }
      toast.error(lang === "ar" ? "تعذّر الحصول على رابط الدفع" : "Could not get payment URL");
    } catch (e: any) {
      if (e?.status === 409) {
        toast.error(e.message || (lang === "ar" ? "لا يمكن الدفع لهذا الطلب" : "Cannot pay this order"));
        navigate({ to: "/account/orders/$orderId" as any, params: { orderId: order.id } as any });
        return;
      }
      toast.error(e?.message || (lang === "ar" ? "تعذّر بدء عملية الدفع" : "Could not start payment"));
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <AccountLayout title={lang === "ar" ? "إتمام الدفع" : "Complete payment"}>
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AccountLayout>
    );
  }

  if (error || !order) {
    return (
      <AccountLayout title={lang === "ar" ? "إتمام الدفع" : "Complete payment"}>
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          {error || (lang === "ar" ? "الطلب غير موجود" : "Order not found")}
        </div>
      </AccountLayout>
    );
  }

  if (order.paid) {
    return (
      <AccountLayout title={lang === "ar" ? "إتمام الدفع" : "Complete payment"}>
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {lang === "ar" ? "هذا الطلب مدفوع بالفعل." : "This order is already paid."}
          </p>
          <Link
            to={"/account/orders/$orderId" as any}
            params={{ orderId: order.id } as any}
            className="mt-4 inline-flex items-center text-sm text-primary hover:underline"
          >
            {lang === "ar" ? "عرض الطلب" : "View order"}
          </Link>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      title={lang === "ar" ? `دفع الطلب ${order.number}` : `Pay order ${order.number}`}
      subtitle={lang === "ar" ? "اختر وسيلة الدفع لإتمام السداد" : "Choose a payment method to complete"}
    >
      <Link
        to={"/account/orders/$orderId" as any}
        params={{ orderId: order.id } as any}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className={`h-4 w-4 ${dir === "ltr" ? "rotate-180" : ""}`} />
        {lang === "ar" ? "العودة لتفاصيل الطلب" : "Back to order"}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
          <h2 className="text-lg font-bold">{t("checkout.payment.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("checkout.payment.desc")}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {paymentMethods.map((m) => {
              const Icon = m.icon;
              const active = payment === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPayment(m.id)}
                  className={`relative text-right rounded-2xl border-2 p-4 transition-all ${
                    active
                      ? "border-primary bg-primary/5 shadow-[0_10px_30px_-15px_rgba(30,91,148,0.5)]"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {m.badge && (
                    <span className="absolute -top-2 right-4 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                      {m.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl ${m.logo ? "bg-white border border-border p-1" : active ? "bg-primary text-white" : "bg-primary-light text-primary"}`}>
                      {m.logo ? (
                        <img src={m.logo} alt={m.name} className="max-h-8 w-auto object-contain" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.desc}</div>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        active ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {active && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-primary-light/60 p-3 text-xs text-primary-dark">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{t("checkout.payment.note")}</span>
          </div>

          <button
            onClick={handlePay}
            disabled={paying}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-60"
          >
            {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            {lang === "ar"
              ? `ادفع الآن • ${formatCurrency(order.total, lang)}`
              : `Pay now • ${formatCurrency(order.total, lang)}`}
          </button>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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
                <span>{lang === "ar" ? "المبلغ المستحق" : "Amount due"}</span>
                <span className="text-primary" data-ltr-number>{formatCurrency(order.total, lang)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold">{lang === "ar" ? "عناصر الطلب" : "Order items"}</h3>
            <div className="space-y-2">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <div className="font-medium line-clamp-1">{it.serviceTitle}</div>
                    <div className="text-muted-foreground">{it.planName} × {it.qty}</div>
                  </div>
                  <div className="font-bold text-primary shrink-0" data-ltr-number>
                    {formatCurrency(it.price * it.qty, lang)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AccountLayout>
  );
}
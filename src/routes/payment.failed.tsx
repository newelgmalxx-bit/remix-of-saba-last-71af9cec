import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle, RotateCcw, Home, Wallet, Loader2, Package } from "lucide-react";
import { z } from "zod";
import { useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useLang } from "@/i18n/LanguageProvider";
import { account } from "@/lib/api";
import { toast } from "sonner";

type PayMethod = "myfatoorah" | "tabby" | "tamara" | "cod";

export const Route = createFileRoute("/payment/failed")({
  validateSearch: z.object({
    // `order` is the LOCAL order id from our DB — the only safe value to pass
    // to /api/account/orders/{id}/pay. Never use gateway-returned ids here.
    order: z.string().optional(),
    message: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "فشل الدفع | سابا ديزاين" }] }),
  component: PaymentFailedPage,
});

function PaymentFailedPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const { order: localOrderId, message } = Route.useSearch();
  const [retrying, setRetrying] = useState(false);
  const [method, setMethod] = useState<PayMethod>("myfatoorah");

  const retryPayment = async () => {
    if (!localOrderId) {
      toast.error(ar ? "رقم الطلب غير متوفر" : "Order reference is missing");
      return;
    }
    setRetrying(true);
    try {
      const res: any = await account.payOrder(localOrderId, { paymentMethod: method });
      const ok = res?.success !== false;
      const url = res?.data?.paymentUrl || res?.paymentUrl;
      if (ok && url) {
        window.location.href = url;
        return;
      }
      if (ok && method === "cod") {
        toast.success(ar ? "تم تأكيد الطلب" : "Order confirmed");
        return;
      }
      const msg = res?.message || res?.error || (ar ? "تعذر بدء الدفع" : "Could not start payment");
      toast.error(msg);
    } catch (e: any) {
      toast.error(e?.message || (ar ? "تعذر بدء الدفع" : "Could not start payment"));
    } finally {
      setRetrying(false);
    }
  };

  const methods: { id: PayMethod; label: string }[] = [
    { id: "myfatoorah", label: ar ? "بطاقة / MyFatoorah" : "Card / MyFatoorah" },
    { id: "tamara", label: ar ? "تمارا — قسّمها" : "Tamara — Split it" },
    { id: "cod", label: ar ? "الدفع عند الاستلام" : "Cash on Delivery" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-[0_20px_50px_-15px_rgba(244,63,94,0.6)]">
          <XCircle className="h-14 w-14 text-white" />
        </div>
        <h1 className="mt-8 text-3xl font-bold">
          {ar ? "فشل عملية الدفع" : "Payment Failed"}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          {message || (ar
            ? "حدث خطأ أثناء معالجة الدفع. يمكنك المحاولة مرة أخرى أو اختيار وسيلة دفع مختلفة."
            : "Something went wrong while processing your payment. Please try again or choose a different method.")}
        </p>
        {localOrderId && (
          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm">
            <span className="text-sm text-muted-foreground">
              {ar ? "رقم الطلب" : "Order"}
            </span>
            <span className="text-base font-bold text-primary" dir="ltr">{localOrderId}</span>
          </div>
        )}

        {localOrderId && (
          <div className="mt-6 w-full max-w-md rounded-2xl border border-border bg-card p-4 text-start shadow-sm">
            <p className="mb-3 text-sm font-semibold">
              {ar ? "اختر وسيلة الدفع" : "Choose a payment method"}
            </p>
            <div className="grid gap-2">
              {methods.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition ${
                    method === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                  }`}
                >
                  <span className="text-sm font-medium">{m.label}</span>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {localOrderId ? (
            <button
              onClick={retryPayment}
              disabled={retrying}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-6 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-60"
            >
              {retrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
              {ar ? "أعد محاولة الدفع" : "Retry payment"}
            </button>
          ) : (
            <Link
              to={"/cart" as any}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
            >
              <RotateCcw className="h-4 w-4" />
              {ar ? "حاول مرة أخرى" : "Try Again"}
            </Link>
          )}
          {localOrderId && (
            <Link
              to={"/account/orders/$orderId" as any}
              params={{ orderId: localOrderId } as any}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
            >
              <Package className="h-4 w-4" />
              {ar ? "تفاصيل الطلب" : "Order details"}
            </Link>
          )}
          <Link
            to={"/" as any}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            {ar ? "الرئيسية" : "Home"}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

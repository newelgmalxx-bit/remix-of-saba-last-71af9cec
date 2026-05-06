import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Package, Home, RotateCcw } from "lucide-react";
import { z } from "zod";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/payment/result")({
  validateSearch: z.object({
    status: z.string().optional(),
    order: z.string().optional(),
    message: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "نتيجة الدفع | سابا ديزاين" }] }),
  component: PaymentResultPage,
});

function PaymentResultPage() {
  const { status, order, message } = Route.useSearch();
  const { lang } = useLang();
  const success = status === "success" || status === "paid" || status === "completed";

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="relative">
          {success ? (
            <>
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.6)]">
                <CheckCircle2 className="h-14 w-14 text-white" />
              </div>
            </>
          ) : (
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-[0_20px_50px_-15px_rgba(244,63,94,0.6)]">
              <XCircle className="h-14 w-14 text-white" />
            </div>
          )}
        </div>
        <h1 className="mt-8 text-3xl font-bold">
          {success
            ? lang === "ar" ? "تم الدفع بنجاح" : "Payment Successful"
            : lang === "ar" ? "فشل عملية الدفع" : "Payment Failed"}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          {success
            ? lang === "ar"
              ? "تم استلام دفعتك وتأكيد طلبك. سنتواصل معك قريبًا لبدء التنفيذ."
              : "We received your payment and confirmed your order. We'll be in touch shortly."
            : message ||
              (lang === "ar"
                ? "لم يكتمل الدفع. يمكنك المحاولة مرة أخرى أو اختيار وسيلة دفع مختلفة."
                : "Your payment was not completed. You can try again or pick a different method.")}
        </p>
        {order && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm">
            <span className="text-sm text-muted-foreground">
              {lang === "ar" ? "رقم الطلب" : "Order #"}
            </span>
            <span className="text-base font-bold text-primary">{order}</span>
          </div>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {success ? (
            <>
              <Link
                to={"/account/orders" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
              >
                <Package className="h-4 w-4" />
                {lang === "ar" ? "طلباتي" : "My Orders"}
              </Link>
              <Link
                to={"/" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
              >
                <Home className="h-4 w-4" />
                {lang === "ar" ? "الرئيسية" : "Home"}
              </Link>
            </>
          ) : (
            <>
              <Link
                to={"/cart" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
              >
                <RotateCcw className="h-4 w-4" />
                {lang === "ar" ? "حاول مرة أخرى" : "Try Again"}
              </Link>
              <Link
                to={"/" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
              >
                <Home className="h-4 w-4" />
                {lang === "ar" ? "الرئيسية" : "Home"}
              </Link>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
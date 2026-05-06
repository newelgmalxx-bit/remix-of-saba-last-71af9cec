import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle, RotateCcw, Home } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/payment/failed")({
  head: () => ({ meta: [{ title: "فشل الدفع | سابا ديزاين" }] }),
  component: PaymentFailedPage,
});

function PaymentFailedPage() {
  const { lang } = useLang();
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-[0_20px_50px_-15px_rgba(244,63,94,0.6)]">
          <XCircle className="h-14 w-14 text-white" />
        </div>
        <h1 className="mt-8 text-3xl font-bold">
          {lang === "ar" ? "فشل عملية الدفع" : "Payment Failed"}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          {lang === "ar"
            ? "حدث خطأ أثناء معالجة الدفع. يمكنك المحاولة مرة أخرى أو اختيار وسيلة دفع مختلفة."
            : "Something went wrong while processing your payment. Please try again or choose a different method."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
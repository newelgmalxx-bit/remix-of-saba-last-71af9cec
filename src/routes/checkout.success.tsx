import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, FileText } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { z } from "zod";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: z.object({ o: z.string().optional() }),
  head: () => ({ meta: [{ title: "تم استلام طلبك | سابا ديزاين" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { o } = Route.useSearch();
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.6)]">
            <CheckCircle2 className="h-14 w-14 text-white" />
          </div>
        </div>
        <h1 className="mt-8 text-3xl font-bold">تم استلام طلبك بنجاح! 🎉</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          شكراً لثقتك. تم إرسال تفاصيل الطلب على بريدك الإلكتروني، وسيقوم فريقنا بالتواصل معك خلال 24 ساعة.
        </p>
        {o && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm">
            <span className="text-sm text-muted-foreground">رقم الطلب:</span>
            <span className="text-base font-bold text-primary">{o}</span>
          </div>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={"/account/orders" as any}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
          >
            <Package className="h-4 w-4" />
            متابعة طلباتي
          </Link>
          <Link
            to={"/" as any}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
          >
            <FileText className="h-4 w-4" />
            العودة للرئيسية
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
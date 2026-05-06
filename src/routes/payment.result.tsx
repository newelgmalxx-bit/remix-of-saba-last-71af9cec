import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Package, Home, RotateCcw, Loader2, AlertTriangle } from "lucide-react";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useLang } from "@/i18n/LanguageProvider";

type StatusKind = "success" | "pending" | "failed" | "error";

export const Route = createFileRoute("/payment/result")({
  validateSearch: z.object({
    status: z.string().optional(),
    order: z.string().optional(),
    pid: z.string().optional(),
    message: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "نتيجة الدفع | سابا ديزاين" }] }),
  component: PaymentResultPage,
});

function normalize(s?: string): StatusKind {
  const v = (s || "").toLowerCase();
  if (["success", "paid", "completed", "confirmed"].includes(v)) return "success";
  if (["pending", "processing", "in_progress"].includes(v)) return "pending";
  if (["failed", "failure", "declined", "cancelled", "canceled"].includes(v)) return "failed";
  return v ? "error" : "error";
}

function PaymentResultPage() {
  const search = Route.useSearch();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [kind, setKind] = useState<StatusKind>(() => normalize(search.status));
  const [orderNumber, setOrderNumber] = useState<string | undefined>(search.order);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(search.message);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setKind(normalize(search.status));
    setOrderNumber(search.order);
  }, [search.status, search.order]);

  useEffect(() => {
    if (kind !== "pending" || !search.pid) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/checkout/status/${encodeURIComponent(search.pid!)}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled || !json?.success) return;
        const d = json.data || {};
        if (d.orderNumber) setOrderNumber(d.orderNumber);
        const ps = String(d.paymentStatus || d.status || "").toLowerCase();
        if (d.paid || ["paid", "success", "completed", "confirmed"].includes(ps)) {
          setKind("success");
          if (timerRef.current) clearInterval(timerRef.current);
          navigate({
            to: "/payment/result",
            search: { status: "success", order: d.orderNumber || orderNumber },
            replace: true,
          });
        } else if (["failed", "failure", "declined", "cancelled", "canceled"].includes(ps)) {
          setKind("failed");
          if (timerRef.current) clearInterval(timerRef.current);
        }
      } catch {
        /* keep polling */
      }
    };

    poll();
    timerRef.current = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [kind, search.pid]);

  const ar = lang === "ar";

  const config = {
    success: {
      title: ar ? "تم الدفع بنجاح" : "Payment Successful",
      body: ar
        ? "تم استلام دفعتك وتأكيد طلبك. سنتواصل معك قريبًا لبدء التنفيذ."
        : "We received your payment and confirmed your order. We'll be in touch shortly.",
      Icon: CheckCircle2,
      iconBg: "from-emerald-400 to-emerald-600",
      shadow: "shadow-[0_20px_50px_-15px_rgba(16,185,129,0.6)]",
      ping: "bg-emerald-400/30",
      spin: false,
    },
    pending: {
      title: ar ? "جارٍ تأكيد الدفع" : "Confirming Payment",
      body: ar
        ? "جارٍ تأكيد الدفع، يرجى الانتظار..."
        : "We're confirming your payment, please wait...",
      Icon: Loader2,
      iconBg: "from-amber-400 to-amber-500",
      shadow: "shadow-[0_20px_50px_-15px_rgba(245,158,11,0.55)]",
      ping: "bg-amber-400/30",
      spin: true,
    },
    failed: {
      title: ar ? "لم يتم الدفع" : "Payment Failed",
      body:
        errorMsg ||
        (ar
          ? "لم يكتمل الدفع. يمكنك المحاولة مرة أخرى أو اختيار وسيلة دفع مختلفة."
          : "Your payment was not completed. You can try again or pick a different method."),
      Icon: XCircle,
      iconBg: "from-rose-400 to-rose-600",
      shadow: "shadow-[0_20px_50px_-15px_rgba(244,63,94,0.6)]",
      ping: "",
      spin: false,
    },
    error: {
      title: ar ? "حدث خطأ" : "Something Went Wrong",
      body:
        errorMsg ||
        (ar
          ? "تعذّر معالجة طلبك. حاول مرة أخرى أو تواصل مع الدعم."
          : "We couldn't process your request. Please try again or contact support."),
      Icon: AlertTriangle,
      iconBg: "from-orange-400 to-orange-600",
      shadow: "shadow-[0_20px_50px_-15px_rgba(249,115,22,0.55)]",
      ping: "",
      spin: false,
    },
  }[kind];

  const { Icon } = config;

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="relative">
          {config.ping && (
            <div className={`absolute inset-0 animate-ping rounded-full ${config.ping}`} />
          )}
          <div
            className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${config.iconBg} ${config.shadow}`}
          >
            <Icon className={`h-14 w-14 text-white ${config.spin ? "animate-spin" : ""}`} />
          </div>
        </div>
        <h1 className="mt-8 text-3xl font-bold">{config.title}</h1>
        <p className="mt-3 max-w-md text-muted-foreground">{config.body}</p>

        {orderNumber && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm">
            <span className="text-sm text-muted-foreground">
              {ar ? "رقم الطلب" : "Order #"}
            </span>
            <span className="text-base font-bold text-primary">{orderNumber}</span>
          </div>
        )}

        {kind === "pending" && (
          <p className="mt-4 text-xs text-muted-foreground">
            {ar ? "يتم التحديث تلقائيًا كل 3 ثوانٍ" : "Auto-refreshing every 3 seconds"}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {kind === "success" && (
            <>
              <Link
                to={"/account/orders" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
              >
                <Package className="h-4 w-4" />
                {ar ? "طلباتي" : "My Orders"}
              </Link>
              <Link
                to={"/" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
              >
                <Home className="h-4 w-4" />
                {ar ? "الرئيسية" : "Home"}
              </Link>
            </>
          )}

          {(kind === "failed" || kind === "error") && (
            <>
              <Link
                to={"/cart" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
              >
                <RotateCcw className="h-4 w-4" />
                {ar ? "حاول مرة أخرى" : "Try Again"}
              </Link>
              <Link
                to={"/" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
              >
                <Home className="h-4 w-4" />
                {ar ? "الرئيسية" : "Home"}
              </Link>
            </>
          )}

          {kind === "pending" && (
            <Link
              to={"/account/orders" as any}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
            >
              <Package className="h-4 w-4" />
              {ar ? "طلباتي" : "My Orders"}
            </Link>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

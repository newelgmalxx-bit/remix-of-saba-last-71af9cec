import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2, Package, Download, FileText, Loader2, Receipt, Calendar, Wallet,
  User, Mail, Phone, Building2, StickyNote, Hash, CreditCard,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { z } from "zod";
import { useLang } from "@/i18n/LanguageProvider";
import { account } from "@/lib/api";
import { normalizeOrder } from "@/lib/api/normalize";
import { downloadInvoice } from "@/lib/invoice";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, paymentName, type Order } from "@/data/account";

export const Route = createFileRoute("/order-summary/$orderId")({
  validateSearch: z.object({
    o: z.string().optional(),
    payUrl: z.string().optional(),
    paid: z.coerce.number().optional(),
  }),
  head: () => ({
    meta: [
      { title: "ملخص الطلب | سابا ديزاين" },
      { name: "description", content: "ملخص الطلب الكامل، حالة الدفع، بيانات العميل والفاتورة." },
    ],
  }),
  component: OrderSummaryPage,
});

type CachedInfo = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
};

function OrderSummaryPage() {
  const { orderId } = Route.useParams();
  const { o, payUrl, paid: paidFlag } = Route.useSearch();
  const { t, lang, dir } = useLang();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [info, setInfo] = useState<CachedInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const cached = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("saba_last_order") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setInfo(cached?.info || null);

    const buildFallback = (): Order | null => {
      if (!cached) return null;
      const items = (cached.items || []).map((it: any, i: number) => ({
        id: it.id || `i${i}`,
        serviceSlug: it.serviceSlug,
        serviceTitle: it.serviceTitle,
        planName: it.planName,
        price: Number(it.price) || 0,
        qty: Number(it.qty) || 1,
      }));
      const subtotal = items.reduce((s: number, it: any) => s + it.price * it.qty, 0);
      const vat = +(subtotal * 0.15).toFixed(2);
      return {
        id: orderId,
        number: cached.number || o || "",
        createdAt: new Date().toISOString().slice(0, 10),
        status: "pending",
        payment: cached.payment || "cod",
        paid: false,
        items,
        subtotal,
        vat,
        total: cached.total ?? subtotal + vat,
        timeline: [],
      };
    };

    account.orderDetail(orderId)
      .then((res: any) => {
        const raw = res?.data?.order ?? res?.order ?? res;
        if (!alive) return;
        try {
          if (raw) setOrder(normalizeOrder(raw));
          else setOrder(buildFallback());
        } catch {
          setOrder(buildFallback());
        }
      })
      .catch(() => {
        if (alive) setOrder(buildFallback());
      })
      .finally(() => {
        if (!alive) return;
        setOrder((prev) => prev ?? buildFallback());
        setLoading(false);
      });

    return () => { alive = false; };
  }, [orderId, o, cached]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/30" dir={dir}>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.6)]">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-bold">
            {lang === "ar" ? "ملخص الطلب" : "Order Summary"}
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            {lang === "ar"
              ? "تم استلام طلبك بنجاح. تجد أدناه التفاصيل الكاملة وحالة الدفع."
              : "Your order has been received. Below are the full details and payment status."}
          </p>
          {(order?.number || o) && (
            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {lang === "ar" ? "رقم الطلب" : "Order #"}
              </span>
              <span className="text-base font-bold text-primary" dir="ltr">
                {order?.number || o}
              </span>
            </div>
          )}
          {order && (
            <div className="mt-3">
              {(order.paid || paidFlag === 1) ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {lang === "ar" ? "تم الدفع بنجاح" : "Payment received"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-800">
                  <Wallet className="h-3.5 w-3.5" />
                  {lang === "ar" ? "الدفع لم يكتمل بعد" : "Payment pending"}
                </span>
              )}
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-12 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {order && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left column */}
            <div className="space-y-6">
              {/* Customer info */}
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                  <User className="h-4 w-4 text-primary" />
                  {lang === "ar" ? "بيانات العميل" : "Customer details"}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoRow icon={User} label={lang === "ar" ? "الاسم" : "Name"} value={info?.name || user?.name || "—"} />
                  <InfoRow icon={Mail} label={lang === "ar" ? "البريد" : "Email"} value={info?.email || user?.email || "—"} ltr />
                  <InfoRow icon={Phone} label={lang === "ar" ? "الجوال" : "Phone"} value={info?.phone || (user as any)?.phone || "—"} ltr />
                  {info?.company && (
                    <InfoRow icon={Building2} label={lang === "ar" ? "الشركة" : "Company"} value={info.company} />
                  )}
                </div>
                {info?.notes && (
                  <div className={`mt-4 rounded-xl ${dir === "rtl" ? "border-r-4" : "border-l-4"} border-primary bg-primary-light/40 p-4`}>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-primary">
                      <StickyNote className="h-3.5 w-3.5" />
                      {lang === "ar" ? "ملاحظات العميل" : "Notes"}
                    </h4>
                    <p className="mt-1 text-sm text-foreground/80">{info.notes}</p>
                  </div>
                )}
              </section>

              {/* Items */}
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                  <Package className="h-4 w-4 text-primary" />
                  {t("account.order.items")}
                </h3>
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
                      <div className={`shrink-0 ${dir === "rtl" ? "text-left" : "text-right"}`}>
                        <div className="text-sm font-bold text-primary" data-ltr-number>{formatCurrency(it.price * it.qty, lang)}</div>
                        <div className="text-[11px] text-muted-foreground" data-ltr-number>{formatCurrency(it.price, lang)} {t("account.order.perUnit")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Invoice card */}
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold">
                        {lang === "ar" ? "الفاتورة" : "Invoice"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {order.paid
                          ? (lang === "ar" ? "فاتورة ضريبية جاهزة للتنزيل" : "Tax invoice ready to download")
                          : (lang === "ar" ? "ستتوفر الفاتورة بعد إتمام الدفع" : "Invoice will be available after payment")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadInvoice(order, info?.name || user?.name || "")}
                    disabled={!order.paid}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    {lang === "ar" ? "تنزيل الفاتورة" : "Download invoice"}
                  </button>
                </div>
              </section>
            </div>

            {/* Right column — summary + payment */}
            <aside className="space-y-4">
              <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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
              </section>

              <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="flex items-center gap-2 text-base font-bold">
                  <CreditCard className="h-4 w-4 text-primary" />
                  {lang === "ar" ? "حالة الدفع" : "Payment status"}
                </h3>
                <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-background p-3">
                  <div>
                    <div className="text-sm font-bold">{paymentName(order.payment, lang)}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.paid
                        ? (lang === "ar" ? "تم الدفع" : "Paid")
                        : (lang === "ar" ? "في انتظار الدفع" : "Awaiting payment")}
                    </div>
                  </div>
                  {order.paid ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {lang === "ar" ? "مكتمل" : "Completed"}
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      {lang === "ar" ? "غير مكتمل" : "Pending"}
                    </span>
                  )}
                </div>
                {!order.paid && (
                  payUrl ? (
                    <a
                      href={payUrl}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-95"
                    >
                      <Wallet className="h-4 w-4" />
                      {lang === "ar" ? "ادفع الآن" : "Pay now"}
                    </a>
                  ) : (
                    <Link
                      to={"/account/orders/$orderId/pay" as any}
                      params={{ orderId: order.id } as any}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-95"
                    >
                      <Wallet className="h-4 w-4" />
                      {lang === "ar" ? "ادفع الآن" : "Pay now"}
                    </Link>
                  )
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span data-ltr-number>{order.createdAt}</span>
                </div>
              </section>

              <div className="space-y-2">
                <Link
                  to={"/account/orders/$orderId" as any}
                  params={{ orderId: order.id } as any}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold hover:bg-muted"
                >
                  <Package className="h-4 w-4" />
                  {lang === "ar" ? "تفاصيل الطلب الكاملة" : "Full order details"}
                </Link>
                <Link
                  to={"/account/orders" as any}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold hover:bg-muted"
                >
                  {lang === "ar" ? "كل طلباتي" : "All my orders"}
                </Link>
              </div>
            </aside>
          </div>
        )}

        {!loading && !order && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">
              {lang === "ar" ? "تعذر العثور على بيانات الطلب." : "Order details not found."}
            </p>
            <Link
              to={"/account/orders" as any}
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
            >
              <Package className="h-4 w-4" />
              {lang === "ar" ? "عرض كل الطلبات" : "View all orders"}
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoRow({
  icon: Icon, label, value, ltr,
}: { icon: any; label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium" dir={ltr ? "ltr" : undefined}>{value}</div>
      </div>
    </div>
  );
}

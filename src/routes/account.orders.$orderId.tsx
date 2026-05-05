import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Package, Download, MessageSquarePlus, ChevronLeft, Calendar, CreditCard,
  CheckCircle2, Circle, FileText, Receipt,
} from "lucide-react";
import { AccountLayout, StatusBadge } from "@/components/account/AccountLayout";
import { mockOrders, statusLabels, statusFlow, formatCurrency, paymentName, paymentIcon, mockUser, type Order } from "@/data/account";
import { downloadInvoice } from "@/lib/invoice";

export const Route = createFileRoute("/account/orders/$orderId")({
  head: () => ({ meta: [{ title: "تفاصيل الطلب | سابا ديزاين" }] }),
  loader: ({ params }) => {
    const order = mockOrders.find((o) => o.id === params.orderId);
    if (!order) throw notFound();
    return { order };
  },
  notFoundComponent: () => (
    <AccountLayout title="الطلب غير موجود">
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">لم نعثر على هذا الطلب.</p>
        <Link to={"/account/orders" as any} className="mt-4 inline-flex items-center text-sm text-primary hover:underline">
          العودة لقائمة الطلبات
        </Link>
      </div>
    </AccountLayout>
  ),
  errorComponent: ({ error }) => (
    <AccountLayout title="حدث خطأ">
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">{error.message}</div>
    </AccountLayout>
  ),
  component: OrderDetail,
});

function OrderDetail() {
  const { order } = Route.useLoaderData() as { order: Order };
  const s = statusLabels[order.status];
  const PayIcon = paymentIcon(order.payment);
  const currentIdx = statusFlow.indexOf(order.status);

  return (
    <AccountLayout title={`الطلب ${order.number}`} subtitle={`أُنشئ بتاريخ ${order.createdAt}`}>
      <Link
        to={"/account/orders" as any}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        العودة لقائمة الطلبات
      </Link>

      {/* Header card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold" dir="ltr">{order.number}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <StatusBadge label={s.label} color={s.color} />
                {order.paid ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">مدفوع</span>
                ) : (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">غير مدفوع</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {order.paid && (
              <button
                onClick={() => downloadInvoice(order, mockUser.name)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
              >
                <Download className="h-4 w-4" />
                تنزيل الفاتورة PDF
              </button>
            )}
            <Link
              to={"/account/tickets/new" as any}
              search={{ order: order.id } as any}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-bold hover:bg-muted"
            >
              <MessageSquarePlus className="h-4 w-4" />
              فتح تذكرة دعم
            </Link>
          </div>
        </div>
      </div>

      {/* Progress */}
      {order.status !== "cancelled" && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h3 className="mb-5 text-base font-bold">مراحل الطلب</h3>
          <div className="relative grid grid-cols-5 gap-2">
            <div className="absolute right-[10%] left-[10%] top-4 h-1 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-l from-primary to-primary-dark transition-all"
                style={{ width: `${(currentIdx / (statusFlow.length - 1)) * 100}%` }}
              />
            </div>
            {statusFlow.map((st, i) => {
              const done = i <= currentIdx;
              const label = statusLabels[st].label;
              return (
                <div key={st} className="relative flex flex-col items-center gap-2">
                  <div
                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                      done
                        ? "bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_8px_20px_-6px_rgba(30,91,148,0.5)]"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </div>
                  <span className={`text-[10px] sm:text-xs text-center font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Items + timeline */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold">عناصر الطلب</h3>
            <div className="space-y-3">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to="/services/$slug"
                        params={{ slug: it.serviceSlug }}
                        className="text-sm font-bold hover:text-primary line-clamp-1"
                      >
                        {it.serviceTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground">باقة {it.planName} • الكمية: <span data-ltr-number>{it.qty}</span></p>
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <div className="text-sm font-bold text-primary" data-ltr-number>{formatCurrency(it.price * it.qty)}</div>
                    <div className="text-[11px] text-muted-foreground" data-ltr-number>{formatCurrency(it.price)} / للوحدة</div>
                  </div>
                </div>
              ))}
            </div>

            {order.notes && (
              <div className="mt-5 rounded-xl border-r-4 border-primary bg-primary-light/40 p-4">
                <h4 className="text-xs font-bold text-primary">ملاحظات العميل</h4>
                <p className="mt-1 text-sm text-foreground/80">{order.notes}</p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold">سجل الطلب</h3>
            <ol className="relative space-y-5 border-r-2 border-border pr-5">
              {[...order.timeline].reverse().map((t, i) => {
                const ts = statusLabels[t.status];
                return (
                  <li key={i} className="relative">
                    <div className="absolute -right-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge label={ts.label} color={ts.color} />
                      <span className="text-xs text-muted-foreground">{t.at}</span>
                    </div>
                    {t.note && <p className="mt-1 text-sm text-foreground/80">{t.note}</p>}
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        {/* Summary */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-base font-bold">ملخّص الفاتورة</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="المجموع" value={formatCurrency(order.subtotal)} />
              <Row label="ض. القيمة المضافة" value={formatCurrency(order.vat)} />
              <div className="my-2 h-px bg-border" />
              <div className="flex justify-between text-base font-bold">
                <span>الإجمالي</span>
                <span className="text-primary" data-ltr-number>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-base font-bold">معلومات الدفع</h3>
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-background p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <PayIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold">{paymentName(order.payment)}</div>
                <div className="text-xs text-muted-foreground">{order.paid ? "الدفع مكتمل" : "بانتظار الدفع"}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span data-ltr-number>{order.createdAt}</span>
            </div>
          </div>
          {order.paid && (
            <button
              onClick={() => downloadInvoice(order, mockUser.name)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-light/30 p-4 text-sm font-bold text-primary hover:bg-primary-light/60 transition"
            >
              <Receipt className="h-4 w-4" />
              تنزيل الفاتورة الضريبية (PDF)
            </button>
          )}
        </aside>
      </div>
    </AccountLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium" data-ltr-number>{value}</span>
    </div>
  );
}
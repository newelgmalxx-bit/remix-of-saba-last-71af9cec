import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Filter, Package, Download, Eye } from "lucide-react";
import { AccountLayout, StatusBadge } from "@/components/account/AccountLayout";
import { mockOrders, statusLabels, formatCurrency, paymentName, mockUser, type OrderStatus } from "@/data/account";
import { downloadInvoice } from "@/lib/invoice";

export const Route = createFileRoute("/account/orders/")({
  head: () => ({ meta: [{ title: "طلباتي | سابا ديزاين" }] }),
  component: OrdersList,
});

const filters: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "in_progress", label: "قيد التنفيذ" },
  { id: "review", label: "قيد المراجعة" },
  { id: "completed", label: "مكتملة" },
  { id: "cancelled", label: "ملغية" },
];

function OrdersList() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    return mockOrders.filter((o) => {
      const matchQ = !q || o.number.toLowerCase().includes(q.toLowerCase()) || o.items.some((i) => i.serviceTitle.includes(q));
      const matchF = filter === "all" || o.status === filter;
      return matchQ && matchF;
    });
  }, [q, filter]);

  return (
    <AccountLayout title="طلباتي" subtitle="جميع طلباتك السابقة والحالية في مكان واحد.">
      {/* Filters bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث برقم الطلب أو الخدمة..."
              className="w-full rounded-lg border border-border bg-background py-2.5 pr-10 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                  filter === f.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-accent"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">لا توجد طلبات مطابقة.</p>
          </div>
        )}
        {filtered.map((o) => {
          const s = statusLabels[o.status];
          return (
            <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm card-hover">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold" dir="ltr">{o.number}</h3>
                      <StatusBadge label={s.label} color={s.color} />
                      {!o.paid && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">غير مدفوع</span>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {o.items.length} خدمة • {o.items.map((i) => `${i.serviceTitle} (${i.planName})`).join(" • ")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      تاريخ: <span data-ltr-number>{o.createdAt}</span> • الدفع عبر {paymentName(o.payment)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">الإجمالي</div>
                    <div className="text-lg font-bold text-primary" data-ltr-number>{formatCurrency(o.total)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {o.paid && (
                      <button
                        onClick={() => downloadInvoice(o, mockUser.name)}
                        title="تنزيل الفاتورة PDF"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-muted hover:text-primary transition"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                    <Link
                      to="/account/orders/$orderId"
                      params={{ orderId: o.id }}
                      className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
                    >
                      <Eye className="h-4 w-4" />
                      التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AccountLayout>
  );
}
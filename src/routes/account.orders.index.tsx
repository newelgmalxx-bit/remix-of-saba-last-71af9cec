import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Package, Download, Eye, Loader2 } from "lucide-react";
import { AccountLayout, StatusBadge } from "@/components/account/AccountLayout";
import { statusLabels, formatCurrency, paymentName, type OrderStatus, type Order } from "@/data/account";
import { downloadInvoice } from "@/lib/invoice";
import { useLang } from "@/i18n/LanguageProvider";
import type { TKey } from "@/i18n/translations";
import { account } from "@/lib/api";
import { normalizeOrder } from "@/lib/api/normalize";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/account/orders/")({
  head: () => ({ meta: [{ title: "طلباتي | سابا ديزاين" }] }),
  component: OrdersList,
});

const filters: { id: OrderStatus | "all"; key: TKey }[] = [
  { id: "all", key: "account.orders.filter.all" },
  { id: "in_progress", key: "account.orders.filter.in_progress" },
  { id: "review", key: "account.orders.filter.review" },
  { id: "completed", key: "account.orders.filter.completed" },
  { id: "cancelled", key: "account.orders.filter.cancelled" },
];

function OrdersList() {
  const { t, lang, dir } = useLang();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    account.listOrders({ status: filter === "all" ? undefined : filter, limit: 50 })
      .then((res) => { if (alive) setOrders((res.items || []).map(normalizeOrder)); })
      .catch(() => { if (alive) setOrders([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [filter]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchQ = !q || o.number.toLowerCase().includes(q.toLowerCase()) || o.items.some((i) => i.serviceTitle.includes(q));
      const matchF = filter === "all" || o.status === filter;
      return matchQ && matchF;
    });
  }, [q, filter, orders]);

  const sideClass = dir === "rtl" ? "right-3" : "left-3";
  const padSide = dir === "rtl" ? "pr-10 pl-3" : "pl-10 pr-3";
  return (
    <AccountLayout title={t("account.orders.title")} subtitle={t("account.orders.subtitle")}>
      {/* Filters bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className={`absolute ${sideClass} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("account.orders.search")}
              className={`w-full rounded-lg border border-border bg-background py-2.5 ${padSide} text-sm focus:outline-none focus:ring-2 focus:ring-primary/30`}
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
                {t(f.key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {loading && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">{t("account.orders.empty")}</p>
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
                      <StatusBadge label={t(`order.status.${o.status}` as TKey)} color={s.color} />
                      {!o.paid && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">{t("account.orders.unpaid")}</span>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {o.items.length} {t("account.orders.servicesCount")} • {o.items.map((i) => `${i.serviceTitle} (${i.planName})`).join(" • ")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("account.orders.dateLabel")} <span data-ltr-number>{o.createdAt}</span> • {t("account.orders.payVia")} {paymentName(o.payment, lang)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <div className={dir === "rtl" ? "text-left" : "text-right"}>
                    <div className="text-xs text-muted-foreground">{t("account.orders.totalLabel")}</div>
                    <div className="text-lg font-bold text-primary" data-ltr-number>{formatCurrency(o.total, lang)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {o.paid && (
                      <button
                        onClick={() => downloadInvoice(o, user?.name || "")}
                        title={t("account.orders.downloadInvoice")}
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
                      {t("account.orders.details")}
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
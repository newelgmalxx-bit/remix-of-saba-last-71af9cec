import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, CheckCircle2, Clock, Wallet, ArrowLeft } from "lucide-react";
import { AccountLayout, StatusBadge } from "@/components/account/AccountLayout";
import { mockOrders, mockTickets, statusLabels, formatCurrency, mockUser } from "@/data/account";

export const Route = createFileRoute("/account/")({
  head: () => ({ meta: [{ title: "حسابي | سابا ديزاين" }] }),
  component: AccountHome,
});

function AccountHome() {
  const total = mockOrders.length;
  const active = mockOrders.filter((o) => ["pending", "confirmed", "in_progress", "review"].includes(o.status)).length;
  const completed = mockOrders.filter((o) => o.status === "completed").length;
  const spent = mockOrders.filter((o) => o.paid).reduce((s, o) => s + o.total, 0);
  const openTickets = mockTickets.filter((t) => t.status !== "closed").length;

  return (
    <AccountLayout title={`أهلاً بعودتك، ${mockUser.name.split(" ")[0]} 👋`} subtitle="هذه نظرة سريعة على نشاط حسابك.">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat icon={Package} label="إجمالي الطلبات" value={total.toString()} tone="primary" />
        <Stat icon={Clock} label="نشطة الآن" value={active.toString()} tone="amber" />
        <Stat icon={CheckCircle2} label="مكتملة" value={completed.toString()} tone="emerald" />
        <Stat icon={Wallet} label="إجمالي الإنفاق" value={formatCurrency(spent)} tone="primary" />
      </div>

      {/* Recent orders */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">آخر الطلبات</h2>
          <Link to={"/account/orders" as any} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            عرض الكل <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-2">
          {mockOrders.slice(0, 3).map((o) => {
            const s = statusLabels[o.status];
            return (
              <Link
                key={o.id}
                to="/account/orders/$orderId"
                params={{ orderId: o.id }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 sm:p-4 transition hover:border-primary/50 hover:shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground">{o.number}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{o.items.map((i) => i.serviceTitle).join(" • ")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge label={s.label} color={s.color} />
                  <div className="hidden sm:block text-sm font-bold text-primary">{formatCurrency(o.total)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tickets summary */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold">الدعم الفني</h3>
          <p className="mt-1 text-sm text-muted-foreground">{openTickets} تذاكر مفتوحة</p>
          <Link
            to={"/account/tickets" as any}
            className="mt-4 inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
          >
            إدارة التذاكر
          </Link>
        </div>
        <div className="rounded-2xl border border-dashed border-primary/40 bg-primary-light/40 p-5">
          <h3 className="text-base font-bold text-primary-dark">هل تحتاج خدمة جديدة؟</h3>
          <p className="mt-1 text-sm text-muted-foreground">تصفح باقاتنا واطلب الخدمة المناسبة لك.</p>
          <Link
            to={"/services" as any}
            className="mt-4 inline-flex h-10 items-center rounded-full bg-primary-dark px-4 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            تصفح الخدمات
          </Link>
        </div>
      </section>
    </AccountLayout>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: "primary" | "amber" | "emerald" }) {
  const tones = {
    primary: "from-primary/10 to-primary/5 text-primary",
    amber: "from-amber-100 to-amber-50 text-amber-600",
    emerald: "from-emerald-100 to-emerald-50 text-emerald-600",
  } as const;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm card-hover">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}
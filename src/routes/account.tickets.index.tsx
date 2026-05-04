import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, Plus, MessageCircle, Clock, CheckCircle2, Eye } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { mockTickets } from "@/data/account";

export const Route = createFileRoute("/account/tickets/")({
  head: () => ({ meta: [{ title: "تذاكر الدعم | سابا ديزاين" }] }),
  component: TicketsList,
});

const statusMap = {
  open: { label: "مفتوحة", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  answered: { label: "تم الرد", color: "bg-sky-100 text-sky-700 border-sky-200", icon: MessageCircle },
  closed: { label: "مغلقة", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
} as const;

function TicketsList() {
  return (
    <AccountLayout title="تذاكر الدعم" subtitle="تواصل مع فريقنا الفني وتابع تذاكرك في مكان واحد.">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{mockTickets.length} تذكرة إجمالاً</p>
        <Link
          to={"/account/tickets/new" as any}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary-dark shadow-[0_8px_20px_-8px_rgba(30,91,148,0.55)]"
        >
          <Plus className="h-4 w-4" />
          تذكرة جديدة
        </Link>
      </div>

      <div className="space-y-3">
        {mockTickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <LifeBuoy className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">لا توجد تذاكر بعد.</p>
          </div>
        ) : (
          mockTickets.map((t) => {
            const s = statusMap[t.status];
            const Icon = s.icon;
            const last = t.messages[t.messages.length - 1];
            return (
              <Link
                key={t.id}
                to="/account/tickets/$ticketId"
                params={{ ticketId: t.id }}
                className="block rounded-2xl border border-border bg-card p-5 shadow-sm card-hover"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <LifeBuoy className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold line-clamp-1">{t.subject}</h3>
                        <span className="text-xs text-muted-foreground">#{t.number}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        <span className="font-bold">{last.author}:</span> {last.text}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span>أُنشئت {t.createdAt}</span>
                        <span>•</span>
                        <span>{t.messages.length} رسالة</span>
                        {t.orderId && (
                          <>
                            <span>•</span>
                            <span>مرتبطة بطلب</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${s.color}`}>
                      <Icon className="h-3 w-3" />
                      {s.label}
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Eye className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </AccountLayout>
  );
}
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Send, Paperclip, LifeBuoy, Package } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { mockTickets, mockOrders, mockUser, type Ticket, type TicketMessage } from "@/data/account";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/account/tickets/$ticketId")({
  head: () => ({ meta: [{ title: "تذكرة دعم | سابا ديزاين" }] }),
  loader: ({ params }) => {
    const ticket = mockTickets.find((t) => t.id === params.ticketId);
    if (!ticket) throw notFound();
    return { ticket };
  },
  notFoundComponent: NotFoundTicket,
  errorComponent: ({ error }) => <ErrorTicket message={error.message} />,
  component: TicketDetail,
});

function NotFoundTicket() {
  const { t } = useLang();
  return (
    <AccountLayout title={t("account.ticket.notFound.title")}>
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        {t("account.ticket.notFound.desc")}
      </div>
    </AccountLayout>
  );
}

function ErrorTicket({ message }: { message: string }) {
  const { t } = useLang();
  return (
    <AccountLayout title={t("account.order.error")}>
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">{message}</div>
    </AccountLayout>
  );
}

function TicketDetail() {
  const { t, lang, dir } = useLang();
  const { ticket: initial } = Route.useLoaderData() as { ticket: Ticket };
  const [messages, setMessages] = useState<TicketMessage[]>(initial.messages);
  const [text, setText] = useState("");

  const order = initial.orderId ? mockOrders.find((o) => o.id === initial.orderId) : null;

  const send = () => {
    if (!text.trim()) return;
    const newMsg: TicketMessage = {
      id: `m_${Date.now()}`,
      from: "client",
      author: mockUser.name.split(" ")[0],
      text: text.trim(),
      at: new Date().toLocaleString(lang === "en" ? "en-US" : "ar-SA"),
    };
    setMessages((m) => [...m, newMsg]);
    setText("");
    // simulate support reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `m_${Date.now()}`,
          from: "support",
          author: t("account.ticket.supportTeam"),
          text: t("account.ticket.supportReply"),
          at: new Date().toLocaleString(lang === "en" ? "en-US" : "ar-SA"),
        },
      ]);
    }, 1400);
  };

  const ChevBack = dir === "rtl" ? ChevronLeft : ChevronRight;
  const ChevFwd = dir === "rtl" ? ChevronLeft : ChevronRight;
  const priorityLabel = initial.priority === "high" ? t("account.ticket.priority.high") : initial.priority === "low" ? t("account.ticket.priority.low") : t("account.ticket.priority.normal");
  const statusLabel = initial.status === "open" ? t("ticket.status.open") : initial.status === "answered" ? t("ticket.status.answered") : t("ticket.status.closed");

  return (
    <AccountLayout title={initial.subject} subtitle={`${t("account.ticket.subtitleTpl")}${initial.number}`}>
      <Link to={"/account/tickets" as any} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ChevronLeft className={`h-4 w-4 ${dir === "ltr" ? "rotate-180" : ""}`} />
        {t("account.ticket.backAll")}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Conversation */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <LifeBuoy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">{t("account.ticket.conversation")}</h3>
                <p className="text-xs text-muted-foreground"><span data-ltr-number>{messages.length}</span> {t("account.tickets.messages")}</p>
              </div>
            </div>
          </div>

          <div className="max-h-[500px] space-y-4 overflow-auto p-5">
            {messages.map((m) => {
              const isClient = m.from === "client";
              return (
                <div key={m.id} className={`flex gap-3 ${isClient ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isClient ? "bg-primary text-primary-foreground" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {m.author.charAt(0)}
                  </div>
                  <div className={`max-w-[75%] ${isClient ? "items-end" : "items-start"} flex flex-col`}>
                    <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-bold text-foreground">{m.author}</span>
                      <span>•</span>
                      <span data-ltr-number>{m.at}</span>
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isClient
                          ? "bg-primary text-primary-foreground rounded-bl-none"
                          : "bg-muted text-foreground rounded-br-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          {initial.status !== "closed" ? (
            <div className="border-t border-border p-4">
              <div className="flex items-end gap-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={2}
                  placeholder={t("account.ticket.placeholder")}
                  className="flex-1 rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground"
                  title={t("account.ticket.attach")}
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  onClick={send}
                  disabled={!text.trim()}
                  className="flex h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                  {t("account.ticket.send")}
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-border bg-muted/40 p-4 text-center text-xs text-muted-foreground">
              {t("account.ticket.closedNote.1")}{" "}
              <Link to={"/account/tickets/new" as any} className="text-primary font-bold hover:underline">
                {t("account.ticket.closedNote.link")}
              </Link>.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-bold">{t("account.ticket.info")}</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label={t("account.ticket.number")} value={`#${initial.number}`} ltr />
              <Row label={t("account.ticket.date")} value={initial.createdAt} ltr />
              <Row label={t("account.ticket.priority")} value={priorityLabel} />
              <Row label={t("account.ticket.status")} value={statusLabel} />
            </dl>
          </div>

          {order && (
            <Link
              to="/account/orders/$orderId"
              params={{ orderId: order.id }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Package className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">{t("account.ticket.linkedOrder")}</div>
                <div className="text-sm font-bold" dir="ltr">{order.number}</div>
              </div>
              <ChevronLeft className={`h-4 w-4 text-muted-foreground ${dir === "ltr" ? "rotate-180" : ""}`} />
            </Link>
          )}
        </aside>
      </div>
    </AccountLayout>
  );
}

function Row({ label, value, ltr = false }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd dir={ltr ? "ltr" : undefined} className="font-medium">{value}</dd>
    </div>
  );
}
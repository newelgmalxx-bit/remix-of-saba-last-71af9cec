import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ChevronLeft, Send } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { mockOrders } from "@/data/account";

export const Route = createFileRoute("/account/tickets/new")({
  validateSearch: z.object({ order: z.string().optional() }),
  head: () => ({ meta: [{ title: "تذكرة جديدة | سابا ديزاين" }] }),
  component: NewTicket,
});

function NewTicket() {
  const { order: presetOrder } = Route.useSearch();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [orderId, setOrderId] = useState(presetOrder ?? "");
  const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    setTimeout(() => navigate({ to: "/account/tickets" as any }), 800);
  };

  return (
    <AccountLayout title="تذكرة دعم جديدة" subtitle="فريقنا سيرد عليك خلال أقل من 24 ساعة.">
      <Link to={"/account/tickets" as any} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ChevronLeft className="h-4 w-4" /> العودة لكل التذاكر
      </Link>

      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-bold">الموضوع</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            maxLength={120}
            placeholder="اكتب موضوع التذكرة باختصار..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-bold">طلب مرتبط (اختياري)</label>
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">— لا يوجد —</option>
              {mockOrders.map((o) => (
                <option key={o.id} value={o.id}>{o.number}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold">الأولوية</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="low">منخفضة</option>
              <option value="normal">عادية</option>
              <option value="high">عالية</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold">الرسالة</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            maxLength={2000}
            placeholder="اشرح المشكلة أو الاستفسار بالتفصيل..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
          <Link to={"/account/tickets" as any} className="rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:bg-muted">
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {submitting ? "جارِ الإرسال..." : "إرسال التذكرة"}
          </button>
        </div>
      </form>
    </AccountLayout>
  );
}
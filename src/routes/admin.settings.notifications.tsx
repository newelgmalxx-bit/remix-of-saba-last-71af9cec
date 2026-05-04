import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings/notifications")({
  head: () => ({ meta: [{ title: "الإشعارات | الإعدادات" }] }),
  component: NotificationsPage,
});

type Channel = { email: boolean; sms: boolean; push: boolean };
type Item = { key: string; label: string; desc: string; ch: Channel };

const initial: Item[] = [
  { key: "new_order", label: "طلب جديد", desc: "عند استلام حجز جديد", ch: { email: true, sms: true, push: true } },
  { key: "payment_received", label: "تأكيد دفع", desc: "عند استلام دفعة من العميل", ch: { email: true, sms: false, push: true } },
  { key: "order_completed", label: "اكتمال طلب", desc: "عند تحديث حالة الطلب إلى مكتمل", ch: { email: true, sms: false, push: false } },
  { key: "new_client", label: "عميل جديد", desc: "عند تسجيل عميل جديد", ch: { email: false, sms: false, push: true } },
  { key: "ticket", label: "تذكرة دعم", desc: "عند إنشاء تذكرة دعم جديدة", ch: { email: true, sms: false, push: true } },
  { key: "invoice_overdue", label: "فاتورة متأخرة", desc: "عند تأخر فاتورة عن السداد", ch: { email: true, sms: true, push: true } },
  { key: "weekly_report", label: "تقرير أسبوعي", desc: "ملخّص الأداء كل يوم أحد", ch: { email: true, sms: false, push: false } },
  { key: "marketing", label: "تحديثات وتسويق", desc: "أخبار وميزات جديدة", ch: { email: false, sms: false, push: false } },
];

function NotificationsPage() {
  const [items, setItems] = useState<Item[]>(initial);
  const [quiet, setQuiet] = useState({ enabled: false, from: "22:00", to: "07:00" });

  const toggle = (key: string, ch: keyof Channel) =>
    setItems(items.map(i => i.key === key ? { ...i, ch: { ...i.ch, [ch]: !i.ch[ch] } } : i));

  return (
    <AdminLayout title="الإعدادات" subtitle="تفضيلات الإشعارات" action={<PrimaryButton onClick={() => toast.success("تم حفظ التفضيلات")}>حفظ</PrimaryButton>}>
      <PanelCard title="قنوات الإشعارات" subtitle="اختر القنوات لكل نوع تنبيه" className="mb-6">
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-muted-foreground border-b border-border">
                <th className="px-3 py-3 font-medium">النوع</th>
                <th className="px-3 py-3 font-medium text-center">بريد</th>
                <th className="px-3 py-3 font-medium text-center">SMS</th>
                <th className="px-3 py-3 font-medium text-center">إشعار فوري</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.key} className="border-b border-border">
                  <td className="px-3 py-3">
                    <div className="font-bold">{i.label}</div>
                    <div className="text-[11px] text-muted-foreground">{i.desc}</div>
                  </td>
                  {(["email", "sms", "push"] as const).map(c => (
                    <td key={c} className="px-3 py-3 text-center">
                      <button onClick={() => toggle(i.key, c)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${i.ch[c] ? "bg-primary" : "bg-muted"}`}>
                        <span className={`absolute inline-block h-5 w-5 rounded-full bg-white shadow transition ${i.ch[c] ? "right-0.5" : "right-5"}`} />
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>

      <PanelCard title="ساعات الهدوء" subtitle="إيقاف الإشعارات خلال فترة محددة">
        <div className="grid gap-3 sm:grid-cols-3 items-end">
          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" className="h-4 w-4" checked={quiet.enabled} onChange={e => setQuiet({ ...quiet, enabled: e.target.checked })} />
            تفعيل
          </label>
          <L label="من"><input type="time" className={ic} value={quiet.from} onChange={e => setQuiet({ ...quiet, from: e.target.value })} /></L>
          <L label="إلى"><input type="time" className={ic} value={quiet.to} onChange={e => setQuiet({ ...quiet, to: e.target.value })} /></L>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}
const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="text-xs font-bold space-y-1.5 block">{label}{children}</label>;
}
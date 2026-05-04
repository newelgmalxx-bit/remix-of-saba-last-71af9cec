import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton, Pill, GhostButton } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Copy, RefreshCw, Plus, Trash2, Webhook } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/partner")({
  head: () => ({ meta: [{ title: "إعدادات API الشريك | لوحة التحكم" }] }),
  component: PartnerApiPage,
});

const genKey = () => "sk_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

type Key = { id: string; name: string; key: string; created: string; lastUsed: string; active: boolean; scopes: string[] };
type Hook = { id: string; url: string; events: string[]; active: boolean };

function PartnerApiPage() {
  const [keys, setKeys] = useState<Key[]>([
    { id: "k1", name: "إنتاج - الشريك الرئيسي", key: "sk_live_a1b2c3d4e5f6g7h8", created: "1 يناير 2026", lastUsed: "منذ ساعة", active: true, scopes: ["bookings.read", "bookings.write", "services.read"] },
    { id: "k2", name: "اختبار", key: "sk_test_x9y8z7w6v5u4t3s2", created: "10 يناير 2026", lastUsed: "—", active: false, scopes: ["bookings.read"] },
  ]);
  const [hooks, setHooks] = useState<Hook[]>([
    { id: "w1", url: "https://partner.example.com/webhooks/saba", events: ["booking.created", "booking.completed"], active: true },
  ]);
  const [base, setBase] = useState("https://api.saba.sa/v1");
  const [pull, setPull] = useState({ enabled: true, url: "https://partner.example.com/api/services", token: "", interval: 60 });

  const addKey = () => {
    const name = prompt("اسم المفتاح:"); if (!name) return;
    setKeys([{ id: "k" + Date.now(), name, key: genKey(), created: new Date().toLocaleDateString("ar-SA"), lastUsed: "—", active: true, scopes: ["bookings.read"] }, ...keys]);
    toast.success("تم إنشاء المفتاح");
  };
  const rotate = (id: string) => { setKeys(keys.map(k => k.id === id ? { ...k, key: genKey() } : k)); toast.success("تم تجديد المفتاح"); };
  const copy = (s: string) => { navigator.clipboard.writeText(s); toast.success("تم النسخ"); };

  const addHook = () => {
    const url = prompt("Webhook URL:"); if (!url) return;
    setHooks([...hooks, { id: "w" + Date.now(), url, events: ["booking.created"], active: true }]);
  };

  return (
    <AdminLayout title="إعدادات API الشريك" subtitle="مفاتيح API والـ Webhooks وسحب البيانات من الشريك">
      <PanelCard title="عنوان الـ API الأساسي" className="mb-6">
        <div className="flex gap-2">
          <input className={ic} dir="ltr" value={base} onChange={e => setBase(e.target.value)} />
          <GhostButton onClick={() => copy(base)}><Copy className="h-4 w-4" /></GhostButton>
        </div>
      </PanelCard>

      <PanelCard title="مفاتيح API" action={<PrimaryButton onClick={addKey}><Plus className="h-4 w-4" /> مفتاح جديد</PrimaryButton>} className="mb-6">
        <div className="space-y-3">
          {keys.map(k => (
            <div key={k.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <div className="font-bold">{k.name}</div>
                  <div className="text-[11px] text-muted-foreground">أُنشئ: {k.created} · آخر استخدام: {k.lastUsed}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone={k.active ? "emerald" : "muted"}>{k.active ? "نشط" : "موقوف"}</Pill>
                  <button onClick={() => rotate(k.id)} className="rounded-lg border border-border px-2 py-1 text-xs font-bold inline-flex items-center gap-1"><RefreshCw className="h-3 w-3" /> تجديد</button>
                  <button onClick={() => setKeys(keys.filter(x => x.id !== k.id))} className="rounded-lg border border-rose-200 text-rose-600 px-2 py-1 text-xs font-bold"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
              <div className="flex gap-2">
                <input className={ic + " font-mono text-xs"} dir="ltr" readOnly value={k.key} />
                <GhostButton onClick={() => copy(k.key)}><Copy className="h-4 w-4" /></GhostButton>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {k.scopes.map(s => <span key={s} className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-bold">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard title="Webhooks" action={<PrimaryButton onClick={addHook}><Plus className="h-4 w-4" /> إضافة</PrimaryButton>} className="mb-6">
        <div className="space-y-3">
          {hooks.map(h => (
            <div key={h.id} className="rounded-xl border border-border p-4 flex flex-wrap items-center gap-3">
              <Webhook className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs truncate" dir="ltr">{h.url}</div>
                <div className="mt-1 flex flex-wrap gap-1">{h.events.map(e => <span key={e} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">{e}</span>)}</div>
              </div>
              <Pill tone={h.active ? "emerald" : "muted"}>{h.active ? "نشط" : "موقوف"}</Pill>
              <button onClick={() => setHooks(hooks.filter(x => x.id !== h.id))} className="text-rose-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard title="السحب من الشريك (Pull)" subtitle="جلب الخدمات والطلبات من API الشريك">
        <div className="grid gap-3 sm:grid-cols-2">
          <L label="رابط API الشريك"><input className={ic} dir="ltr" value={pull.url} onChange={e => setPull({ ...pull, url: e.target.value })} /></L>
          <L label="Bearer Token"><input className={ic} dir="ltr" type="password" value={pull.token} onChange={e => setPull({ ...pull, token: e.target.value })} /></L>
          <L label="فاصل المزامنة (دقيقة)"><input type="number" className={ic} value={pull.interval} onChange={e => setPull({ ...pull, interval: Number(e.target.value) })} /></L>
          <L label="الحالة">
            <button onClick={() => setPull({ ...pull, enabled: !pull.enabled })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${pull.enabled ? "bg-primary" : "bg-muted"}`}>
              <span className={`absolute inline-block h-5 w-5 rounded-full bg-white shadow transition ${pull.enabled ? "right-0.5" : "right-5"}`} />
            </button>
          </L>
        </div>
        <div className="mt-4 flex gap-2">
          <PrimaryButton onClick={() => toast.success("تم بدء المزامنة")}>مزامنة الآن</PrimaryButton>
          <GhostButton onClick={() => toast.success("تم الحفظ")}>حفظ</GhostButton>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}
const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="text-xs font-bold space-y-1.5 block">{label}{children}</label>;
}
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton, Pill, GhostButton } from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { Copy, RefreshCw, Plus, Trash2, Webhook } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api";

export const Route = createFileRoute("/admin/partner")({
  head: () => ({ meta: [{ title: "إعدادات API الشريك | لوحة التحكم" }] }),
  component: PartnerApiPage,
});

const genKey = () => "sk_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

type Key = { id: string; name: string; key: string; created: string; lastUsed: string; active: boolean; scopes: string[] };
type Hook = { id: string; url: string; events: string[]; active: boolean };

function PartnerApiPage() {
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const [keys, setKeys] = useState<Key[]>([
    { id: "k1", name: L("إنتاج - الشريك الرئيسي", "Production - Main Partner"), key: "sk_live_a1b2c3d4e5f6g7h8", created: L("1 يناير 2026", "Jan 1, 2026"), lastUsed: L("منذ ساعة", "1h ago"), active: true, scopes: ["bookings.read", "bookings.write", "services.read"] },
    { id: "k2", name: L("اختبار", "Test"), key: "sk_test_x9y8z7w6v5u4t3s2", created: L("10 يناير 2026", "Jan 10, 2026"), lastUsed: "—", active: false, scopes: ["bookings.read"] },
  ]);
  const [hooks, setHooks] = useState<Hook[]>([
    { id: "w1", url: "https://partner.example.com/webhooks/saba", events: ["booking.created", "booking.completed"], active: true },
  ]);
  const [base, setBase] = useState("https://api.saba.sa/v1");
  const [pull, setPull] = useState({ enabled: true, url: "https://partner.example.com/api/services", token: "", interval: 60 });

  useEffect(() => {
    (async () => {
      try {
        const s = await adminApi.settings.get<any>("partner");
        if (s?.base) setBase(s.base);
        if (Array.isArray(s?.keys)) setKeys(s.keys);
        if (Array.isArray(s?.hooks)) setHooks(s.hooks);
        if (s?.pull) setPull((c) => ({ ...c, ...s.pull }));
      } catch {}
    })();
  }, []);

  const persist = async (next?: { keys?: Key[]; hooks?: Hook[]; base?: string; pull?: typeof pull }) => {
    try {
      await adminApi.settings.update("partner", {
        base: next?.base ?? base,
        keys: next?.keys ?? keys,
        hooks: next?.hooks ?? hooks,
        pull: next?.pull ?? pull,
      });
    } catch {}
  };

  const knobOn = dir === "rtl" ? "right-0.5" : "left-0.5";
  const knobOff = dir === "rtl" ? "right-5" : "left-5";

  const addKey = () => {
    const name = prompt(L("اسم المفتاح:", "Key name:")); if (!name) return;
    const next = [{ id: "k" + Date.now(), name, key: genKey(), created: new Date().toLocaleDateString(lang === "en" ? "en-US" : "ar-SA"), lastUsed: "—", active: true, scopes: ["bookings.read"] }, ...keys];
    setKeys(next); persist({ keys: next });
    toast.success(L("تم إنشاء المفتاح", "Key created"));
  };
  const rotate = (id: string) => { const next = keys.map(k => k.id === id ? { ...k, key: genKey() } : k); setKeys(next); persist({ keys: next }); toast.success(L("تم تجديد المفتاح", "Key rotated")); };
  const copy = (s: string) => { navigator.clipboard.writeText(s); toast.success(L("تم النسخ", "Copied")); };

  const addHook = () => {
    const url = prompt("Webhook URL:"); if (!url) return;
    const next = [...hooks, { id: "w" + Date.now(), url, events: ["booking.created"], active: true }];
    setHooks(next); persist({ hooks: next });
  };

  return (
    <AdminLayout title={L("إعدادات API الشريك", "Partner API Settings")} subtitle={L("مفاتيح API والـ Webhooks وسحب البيانات من الشريك", "API keys, webhooks, and partner data pull")}>
      <PanelCard title={L("عنوان الـ API الأساسي", "Base API URL")} className="mb-6">
        <div className="flex gap-2">
          <input className={ic} dir="ltr" value={base} onChange={e => setBase(e.target.value)} />
          <GhostButton onClick={() => copy(base)}><Copy className="h-4 w-4" /></GhostButton>
        </div>
      </PanelCard>

      <PanelCard title={L("مفاتيح API", "API Keys")} action={<PrimaryButton onClick={addKey}><Plus className="h-4 w-4" /> {L("مفتاح جديد", "New Key")}</PrimaryButton>} className="mb-6">
        <div className="space-y-3">
          {keys.map(k => (
            <div key={k.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <div className="font-bold">{k.name}</div>
                  <div className="text-[11px] text-muted-foreground">{L("أُنشئ", "Created")}: {k.created} · {L("آخر استخدام", "Last used")}: {k.lastUsed}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone={k.active ? "emerald" : "muted"}>{k.active ? L("نشط", "Active") : L("موقوف", "Disabled")}</Pill>
                  <button onClick={() => rotate(k.id)} className="rounded-lg border border-border px-2 py-1 text-xs font-bold inline-flex items-center gap-1"><RefreshCw className="h-3 w-3" /> {L("تجديد", "Rotate")}</button>
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

      <PanelCard title="Webhooks" action={<PrimaryButton onClick={addHook}><Plus className="h-4 w-4" /> {L("إضافة", "Add")}</PrimaryButton>} className="mb-6">
        <div className="space-y-3">
          {hooks.map(h => (
            <div key={h.id} className="rounded-xl border border-border p-4 flex flex-wrap items-center gap-3">
              <Webhook className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs truncate" dir="ltr">{h.url}</div>
                <div className="mt-1 flex flex-wrap gap-1">{h.events.map(e => <span key={e} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">{e}</span>)}</div>
              </div>
              <Pill tone={h.active ? "emerald" : "muted"}>{h.active ? L("نشط", "Active") : L("موقوف", "Disabled")}</Pill>
              <button onClick={() => setHooks(hooks.filter(x => x.id !== h.id))} className="text-rose-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard title={L("السحب من الشريك (Pull)", "Pull from Partner")} subtitle={L("جلب الخدمات والطلبات من API الشريك", "Fetch services and orders from partner API")}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Lb label={L("رابط API الشريك", "Partner API URL")}><input className={ic} dir="ltr" value={pull.url} onChange={e => setPull({ ...pull, url: e.target.value })} /></Lb>
          <Lb label="Bearer Token"><input className={ic} dir="ltr" type="password" value={pull.token} onChange={e => setPull({ ...pull, token: e.target.value })} /></Lb>
          <Lb label={L("فاصل المزامنة (دقيقة)", "Sync interval (min)")}><input type="number" className={ic} value={pull.interval} onChange={e => setPull({ ...pull, interval: Number(e.target.value) })} /></Lb>
          <Lb label={L("الحالة", "Status")}>
            <button onClick={() => setPull({ ...pull, enabled: !pull.enabled })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${pull.enabled ? "bg-primary" : "bg-muted"}`}>
              <span className={`absolute inline-block h-5 w-5 rounded-full bg-white shadow transition ${pull.enabled ? knobOn : knobOff}`} />
            </button>
          </Lb>
        </div>
        <div className="mt-4 flex gap-2">
          <PrimaryButton onClick={() => toast.success(L("تم بدء المزامنة", "Sync started"))}>{L("مزامنة الآن", "Sync now")}</PrimaryButton>
          <GhostButton onClick={async () => { await persist(); toast.success(L("تم الحفظ", "Saved")); }}>{L("حفظ", "Save")}</GhostButton>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}
const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function Lb({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="text-xs font-bold space-y-1.5 block">{label}{children}</label>;
}

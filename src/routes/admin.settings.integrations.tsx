import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminLayout, PanelCard, PrimaryButton, GhostButton } from "@/components/admin/AdminLayout";
import { CreditCard, Calendar, BarChart3, Facebook, Tag, Music, Link2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings/integrations")({
  head: () => ({ meta: [{ title: "التكاملات | الإعدادات" }] }),
  component: IntegrationsPage,
});

type Field = { key: string; label: string; type?: "text" | "password" | "url"; placeholder?: string; help?: string };
type Item = { id: string; icon: any; name: string; desc: string; connected: boolean; fields: Field[]; docs?: string };

const initialItems: Item[] = [
  {
    id: "moyasar", icon: CreditCard, name: "Moyasar (ميسر)", desc: "بوابة الدفع الإلكتروني", connected: true,
    fields: [
      { key: "publishable", label: "المفتاح العام (Publishable Key)", placeholder: "pk_live_..." },
      { key: "secret", label: "المفتاح السري (Secret Key)", type: "password", placeholder: "sk_live_..." },
      { key: "webhook", label: "Webhook URL", type: "url", placeholder: "https://..." },
    ],
    docs: "https://moyasar.com/docs",
  },
  {
    id: "tabby", icon: Calendar, name: "Tabby (تابي)", desc: "الدفع بالتقسيط", connected: true,
    fields: [
      { key: "public", label: "Public Key", placeholder: "pk_..." },
      { key: "secret", label: "Secret Key", type: "password", placeholder: "sk_..." },
      { key: "merchant", label: "Merchant Code" },
    ],
  },
  {
    id: "tamara", icon: Calendar, name: "Tamara (تمارا)", desc: "الدفع بالتقسيط", connected: false,
    fields: [
      { key: "token", label: "API Token", type: "password" },
      { key: "notification", label: "Notification Token" },
    ],
  },
  {
    id: "ga4", icon: BarChart3, name: "Google Analytics (GA4)", desc: "تتبع الزيارات والتحليلات", connected: true,
    fields: [
      { key: "id", label: "Measurement ID", placeholder: "G-XXXXXXXXXX" },
      { key: "stream", label: "Stream ID (اختياري)" },
    ],
  },
  {
    id: "fbpixel", icon: Facebook, name: "Facebook Pixel", desc: "تتبع الإعلانات والتحويلات", connected: false,
    fields: [
      { key: "pixel", label: "Pixel ID", placeholder: "123456789012345" },
      { key: "capi", label: "Conversions API Token", type: "password" },
    ],
  },
  {
    id: "gtm", icon: Tag, name: "Google Tag Manager", desc: "إدارة أكواد التتبع", connected: false,
    fields: [{ key: "id", label: "Container ID", placeholder: "GTM-XXXXXXX" }],
  },
  {
    id: "tiktok", icon: Music, name: "TikTok Pixel", desc: "تتبع إعلانات تيك توك", connected: false,
    fields: [
      { key: "pixel", label: "Pixel ID" },
      { key: "token", label: "Access Token", type: "password" },
    ],
  },
  {
    id: "partner", icon: Link2, name: "Partner API", desc: "ربط مع شركة الشريك لتبادل الطلبات", connected: false,
    fields: [
      { key: "endpoint", label: "Endpoint URL", type: "url", placeholder: "https://api.partner.com" },
      { key: "key", label: "API Key", type: "password" },
      { key: "webhook", label: "Webhook Secret", type: "password" },
    ],
  },
];

function IntegrationsPage() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [active, setActive] = useState<Item | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const openSetup = (it: Item) => {
    setActive(it);
    setValues({});
  };

  const save = () => {
    if (!active) return;
    setItems(items.map(x => x.id === active.id ? { ...x, connected: true } : x));
    toast.success(`تم ربط ${active.name}`);
    setActive(null);
  };

  const disconnect = () => {
    if (!active) return;
    setItems(items.map(x => x.id === active.id ? { ...x, connected: false } : x));
    toast.success(`تم فصل ${active.name}`);
    setActive(null);
  };

  return (
    <AdminLayout title="الإعدادات" subtitle="إدارة التكاملات والربط الخارجي">
      <PanelCard title="التكاملات" subtitle="اربط أدواتك وخدماتك المفضلة">
        <div className="space-y-3">
          {items.map(it => {
            const I = it.icon;
            return (
              <div key={it.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><I className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">{it.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{it.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs">
                    <span className={`h-2 w-2 rounded-full ${it.connected ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                    {it.connected ? "متصل" : "غير متصل"}
                  </span>
                  <button onClick={() => openSetup(it)} className={`rounded-xl px-4 py-2 text-xs font-bold ${it.connected ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}`}>
                    {it.connected ? "إدارة" : "إعداد"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </PanelCard>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent dir="rtl" className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {active && <active.icon className="h-5 w-5 text-primary" />}
              ربط {active?.name}
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">
            {active?.desc}. أدخل بيانات الربط الخاصة بحسابك.
          </p>
          <div className="grid gap-3">
            {active?.fields.map(f => (
              <label key={f.key} className="text-xs font-bold space-y-1.5 block">
                {f.label}
                <input
                  type={f.type ?? "text"}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal"
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                />
                {f.help && <span className="block text-[11px] font-normal text-muted-foreground">{f.help}</span>}
              </label>
            ))}
            {active?.docs && (
              <a href={active.docs} target="_blank" rel="noreferrer" className="text-[11px] text-primary font-bold">عرض التوثيق ↗</a>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            {active?.connected && (
              <button onClick={disconnect} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-600 hover:bg-rose-100">
                <Trash2 className="h-4 w-4" /> فصل الاتصال
              </button>
            )}
            <GhostButton onClick={() => setActive(null)}>إلغاء</GhostButton>
            <PrimaryButton onClick={save}>{active?.connected ? "تحديث" : "ربط"}</PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

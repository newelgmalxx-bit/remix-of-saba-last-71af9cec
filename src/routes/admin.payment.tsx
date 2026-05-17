import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton, Pill } from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { Wallet, Banknote, Truck } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api";

export const Route = createFileRoute("/admin/payment")({
  head: () => ({ meta: [{ title: "إعدادات الدفع | لوحة التحكم" }] }),
  component: PaymentSettingsPage,
});

type Gateway = {
  key: string;
  label: string;
  icon: any;
  enabled: boolean;
  mode: "test" | "live";
  publicKey: string;
  secretKey: string;
  merchantId?: string;
  comingSoon?: boolean;
  noKeys?: boolean;
  desc?: string;
};

function PaymentSettingsPage() {
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const initial: Gateway[] = [
    { key: "myfatoorah", label: "MyFatoorah", icon: Banknote, enabled: true, mode: "test", publicKey: "", secretKey: "", desc: L("فيزا / ماستر / مدى / Apple Pay", "Visa / Mastercard / mada / Apple Pay") },
    { key: "tamara", label: "Tamara", icon: Wallet, enabled: true, mode: "test", publicKey: "", secretKey: "", desc: L("الدفع لاحقًا أو 3 دفعات", "Buy now, pay later (3 instalments)") },
    { key: "cod", label: L("الدفع عند الاستلام", "Cash on Delivery"), icon: Truck, enabled: true, mode: "live", publicKey: "", secretKey: "", noKeys: true, desc: L("لا يحتاج مفاتيح", "No keys required") },
    { key: "tabby", label: "Tabby", icon: Wallet, enabled: false, mode: "test", publicKey: "", secretKey: "", comingSoon: true, desc: L("قريبًا — قسّمها على 4 دفعات", "Coming soon — split into 4 instalments") },
  ];
  const [gateways, setGateways] = useState<Gateway[]>(initial);
  const [vat, setVat] = useState(15);
  const [currency, setCurrency] = useState("SAR");
  useEffect(() => {
    (async () => {
      try {
        const s = await adminApi.settings.get<any>("payment");
        if (s?.gateways) {
          setGateways((cur) =>
            cur.map((g) => {
              const saved = s.gateways[g.key] || {};
              // Tabby remains forcibly disabled while "coming soon".
              if (g.comingSoon) return { ...g, ...saved, enabled: false };
              return { ...g, ...saved };
            })
          );
        }
        if (typeof s?.vat === "number") setVat(s.vat);
        if (s?.currency) setCurrency(s.currency);
      } catch {}
    })();
  }, []);
  const save = async () => {
    try {
      const payload = { vat, currency, gateways: Object.fromEntries(gateways.map((g) => [g.key, g])) };
      await adminApi.settings.update("payment", payload);
      toast.success(L("تم الحفظ", "Saved"));
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    }
  };
  const update = (k: string, patch: Partial<Gateway>) =>
    setGateways(gateways.map((g) => (g.key === k ? { ...g, ...patch } : g)));
  const knobOn = dir === "rtl" ? "right-0.5" : "left-0.5";
  const knobOff = dir === "rtl" ? "right-5" : "left-5";
  return (
    <AdminLayout
      title={L("إعدادات الدفع", "Payment Settings")}
      subtitle={L("بوابات الدفع والعملة والضريبة", "Payment gateways, currency, and VAT")}
      action={<PrimaryButton onClick={save}>{L("حفظ", "Save")}</PrimaryButton>}
    >
      <PanelCard title={L("إعدادات عامة", "General Settings")} className="mb-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Lb label={L("العملة", "Currency")}>
            <select className={ic} value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="SAR">{L("ريال سعودي", "Saudi Riyal")} (SAR)</option>
              <option value="USD">USD</option>
              <option value="AED">AED</option>
            </select>
          </Lb>
          <Lb label={L("نسبة ضريبة القيمة المضافة %", "VAT Rate %")}>
            <input type="number" className={ic} value={vat} onChange={(e) => setVat(Number(e.target.value))} />
          </Lb>
          <Lb label={L("الرقم الضريبي", "Tax Number")}>
            <input className={ic} dir="ltr" placeholder="3000XXXXXX" />
          </Lb>
        </div>
      </PanelCard>

      <PanelCard title={L("بوابات الدفع", "Payment Gateways")}>
        <div className="space-y-3">
          {gateways.map((g) => {
            const I = g.icon;
            const locked = !!g.comingSoon;
            return (
              <div
                key={g.key}
                className={`rounded-xl border border-border p-4 ${locked ? "opacity-70" : ""}`}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <I className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="font-bold">{g.label}</div>
                        {locked && <Pill tone="amber">{L("قريباً", "Coming soon")}</Pill>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill tone={g.enabled ? "emerald" : "muted"}>
                          {g.enabled ? L("مفعّل", "Enabled") : L("متوقف", "Disabled")}
                        </Pill>
                        {g.desc && <span className="text-xs text-muted-foreground">{g.desc}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!g.noKeys && !locked && (
                      <select
                        value={g.mode}
                        onChange={(e) => update(g.key, { mode: e.target.value as any })}
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-bold"
                      >
                        <option value="test">{L("تجريبي", "Test")}</option>
                        <option value="live">{L("مباشر", "Live")}</option>
                      </select>
                    )}
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => !locked && update(g.key, { enabled: !g.enabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        g.enabled ? "bg-primary" : "bg-muted"
                      } ${locked ? "cursor-not-allowed opacity-50" : ""}`}
                      aria-label="toggle"
                    >
                      <span
                        className={`absolute inline-block h-5 w-5 rounded-full bg-white shadow transition ${
                          g.enabled ? knobOn : knobOff
                        }`}
                      />
                    </button>
                  </div>
                </div>
                {g.enabled && !g.noKeys && !locked && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Lb label="Public Key">
                      <input
                        className={ic}
                        dir="ltr"
                        value={g.publicKey}
                        onChange={(e) => update(g.key, { publicKey: e.target.value })}
                      />
                    </Lb>
                    <Lb label="Secret Key">
                      <input
                        className={ic}
                        dir="ltr"
                        type="password"
                        value={g.secretKey}
                        onChange={(e) => update(g.key, { secretKey: e.target.value })}
                      />
                    </Lb>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PanelCard>
    </AdminLayout>
  );
}
const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function Lb({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`text-xs font-bold space-y-1.5 block ${full ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton, Pill } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { CreditCard, Smartphone, Wallet, Building, Banknote } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/payment")({
  head: () => ({ meta: [{ title: "إعدادات الدفع | لوحة التحكم" }] }),
  component: PaymentSettingsPage,
});

type Gateway = { key: string; label: string; icon: any; enabled: boolean; mode: "test" | "live"; publicKey: string; secretKey: string; merchantId?: string };

const initial: Gateway[] = [
  { key: "mada", label: "مدى", icon: CreditCard, enabled: true, mode: "test", publicKey: "", secretKey: "" },
  { key: "visa", label: "Visa / Mastercard", icon: CreditCard, enabled: true, mode: "test", publicKey: "", secretKey: "" },
  { key: "applepay", label: "Apple Pay", icon: Smartphone, enabled: true, mode: "test", publicKey: "", secretKey: "", merchantId: "" },
  { key: "tabby", label: "تابي (Tabby)", icon: Wallet, enabled: true, mode: "test", publicKey: "", secretKey: "" },
  { key: "tamara", label: "تمارا (Tamara)", icon: Wallet, enabled: false, mode: "test", publicKey: "", secretKey: "" },
  { key: "myfatoorah", label: "ماي فاتورة (MyFatoorah)", icon: Wallet, enabled: false, mode: "test", publicKey: "", secretKey: "" },
  { key: "stripe", label: "Stripe", icon: CreditCard, enabled: false, mode: "test", publicKey: "", secretKey: "" },
  { key: "paypal", label: "PayPal", icon: CreditCard, enabled: false, mode: "test", publicKey: "", secretKey: "" },
  { key: "bank", label: "تحويل بنكي", icon: Building, enabled: true, mode: "live", publicKey: "", secretKey: "" },
  { key: "cash", label: "كاش عند الاستلام", icon: Banknote, enabled: false, mode: "live", publicKey: "", secretKey: "" },
];

function PaymentSettingsPage() {
  const [gateways, setGateways] = useState<Gateway[]>(initial);
  const [vat, setVat] = useState(15);
  const [currency, setCurrency] = useState("SAR");
  const update = (k: string, patch: Partial<Gateway>) => setGateways(gateways.map(g => g.key === k ? { ...g, ...patch } : g));
  return (
    <AdminLayout title="إعدادات الدفع" subtitle="بوابات الدفع والعملة والضريبة" action={<PrimaryButton onClick={() => toast.success("تم الحفظ")}>حفظ</PrimaryButton>}>
      <PanelCard title="إعدادات عامة" className="mb-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <L label="العملة">
            <select className={ic} value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="SAR">ريال سعودي (SAR)</option><option value="USD">USD</option><option value="AED">AED</option>
            </select>
          </L>
          <L label="نسبة ضريبة القيمة المضافة %"><input type="number" className={ic} value={vat} onChange={e => setVat(Number(e.target.value))} /></L>
          <L label="الرقم الضريبي"><input className={ic} dir="ltr" placeholder="3000XXXXXX" /></L>
        </div>
      </PanelCard>

      <PanelCard title="بوابات الدفع">
        <div className="space-y-3">
          {gateways.map(g => {
            const I = g.icon;
            return (
              <div key={g.key} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><I className="h-5 w-5" /></div>
                    <div>
                      <div className="font-bold">{g.label}</div>
                      <Pill tone={g.enabled ? "emerald" : "muted"}>{g.enabled ? "مفعّل" : "متوقف"}</Pill>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={g.mode} onChange={e => update(g.key, { mode: e.target.value as any })} className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-bold">
                      <option value="test">تجريبي</option><option value="live">مباشر</option>
                    </select>
                    <button onClick={() => update(g.key, { enabled: !g.enabled })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${g.enabled ? "bg-primary" : "bg-muted"}`}>
                      <span className={`absolute inline-block h-5 w-5 rounded-full bg-white shadow transition ${g.enabled ? "right-0.5" : "right-5"}`} />
                    </button>
                  </div>
                </div>
                {g.enabled && g.key !== "cash" && g.key !== "bank" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <L label="Public Key"><input className={ic} dir="ltr" value={g.publicKey} onChange={e => update(g.key, { publicKey: e.target.value })} /></L>
                    <L label="Secret Key"><input className={ic} dir="ltr" type="password" value={g.secretKey} onChange={e => update(g.key, { secretKey: e.target.value })} /></L>
                    {"merchantId" in g && <L label="Merchant ID" full><input className={ic} dir="ltr" value={g.merchantId ?? ""} onChange={e => update(g.key, { merchantId: e.target.value })} /></L>}
                  </div>
                )}
                {g.enabled && g.key === "bank" && <textarea rows={3} placeholder="بيانات الحساب البنكي..." className={ic} />}
              </div>
            );
          })}
        </div>
      </PanelCard>
    </AdminLayout>
  );
}
const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function L({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`text-xs font-bold space-y-1.5 block ${full ? "sm:col-span-2" : ""}`}>{label}{children}</label>;
}
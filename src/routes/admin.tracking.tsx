import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton, Pill } from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api";

export const Route = createFileRoute("/admin/tracking")({
  head: () => ({ meta: [{ title: "التتبع والبكسلات | لوحة التحكم" }] }),
  component: TrackingPage,
});

type Pixel = { key: string; label: string; placeholder: string; value: string; enabled: boolean };

const initial: Pixel[] = [
  { key: "ga4", label: "Google Analytics 4", placeholder: "G-XXXXXXXXXX", value: "", enabled: false },
  { key: "gtm", label: "Google Tag Manager", placeholder: "GTM-XXXXXXX", value: "", enabled: false },
  { key: "google_ads", label: "Google Ads Conversion ID", placeholder: "AW-XXXXXXXXX", value: "", enabled: false },
  { key: "meta", label: "Meta (Facebook) Pixel", placeholder: "1234567890", value: "", enabled: false },
  { key: "tiktok", label: "TikTok Pixel", placeholder: "C0XXXXXXXXXX", value: "", enabled: false },
  { key: "snapchat", label: "Snapchat Pixel", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx", value: "", enabled: false },
  { key: "linkedin", label: "LinkedIn Insight Tag", placeholder: "1234567", value: "", enabled: false },
  { key: "hotjar", label: "Hotjar Site ID", placeholder: "1234567", value: "", enabled: false },
  { key: "clarity", label: "Microsoft Clarity", placeholder: "abcdefghij", value: "", enabled: false },
];

function TrackingPage() {
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const [pixels, setPixels] = useState<Pixel[]>(initial);
  const [head, setHead] = useState("");
  const [body, setBody] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const s = await adminApi.settings.get<any>("tracking");
        if (Array.isArray(s?.pixels)) setPixels((cur) => cur.map(p => ({ ...p, ...(s.pixels.find((x: any) => x.key === p.key) || {}) })));
        if (typeof s?.head === "string") setHead(s.head);
        if (typeof s?.body === "string") setBody(s.body);
      } catch {}
    })();
  }, []);
  const save = async () => {
    try { await adminApi.settings.update("tracking", { pixels, head, body }); toast.success(L("تم حفظ البكسلات", "Pixels saved")); }
    catch (e: any) { toast.error(e?.message || "Save failed"); }
  };
  const update = (k: string, patch: Partial<Pixel>) => setPixels(pixels.map(p => p.key === k ? { ...p, ...patch } : p));
  const active = pixels.filter(p => p.enabled && p.value).length;
  const knobOn = dir === "rtl" ? "right-0.5" : "left-0.5";
  const knobOff = dir === "rtl" ? "right-5" : "left-5";
  const iconMs = dir === "rtl" ? "ml-1" : "mr-1";
  return (
    <AdminLayout title={L("التتبع والبكسلات", "Tracking & Pixels")} subtitle={L("ربط أدوات التحليل والإعلانات", "Connect analytics and ad tools")} action={<PrimaryButton onClick={save}>{L("حفظ", "Save")}</PrimaryButton>}>
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground">{L("بكسلات نشطة", "Active Pixels")}</div>
          <div className="text-2xl font-bold mt-2">{active}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground">{L("إجمالي البكسلات المتاحة", "Total Available")}</div>
          <div className="text-2xl font-bold mt-2">{pixels.length}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground">{L("سكربتات مخصصة", "Custom Scripts")}</div>
          <div className="text-2xl font-bold mt-2">{(head ? 1 : 0) + (body ? 1 : 0)}</div>
        </div>
      </div>

      <PanelCard title={L("بكسلات الجاهزة", "Ready Pixels")} className="mb-6">
        <div className="space-y-3">
          {pixels.map(p => (
            <div key={p.key} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] items-center rounded-xl border border-border p-3">
              <div>
                <div className="font-bold text-sm">{p.label}</div>
                <Pill tone={p.enabled && p.value ? "emerald" : "muted"}>
                  {p.enabled && p.value ? <><CheckCircle2 className={`h-3 w-3 ${iconMs}`} /> {L("مفعّل", "Enabled")}</> : <><XCircle className={`h-3 w-3 ${iconMs}`} /> {L("غير مفعّل", "Disabled")}</>}
                </Pill>
              </div>
              <input className={ic} dir="ltr" placeholder={p.placeholder} value={p.value} onChange={e => update(p.key, { value: e.target.value })} />
              <button onClick={() => update(p.key, { enabled: !p.enabled })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${p.enabled ? "bg-primary" : "bg-muted"}`}>
                <span className={`absolute inline-block h-5 w-5 rounded-full bg-white shadow transition ${p.enabled ? knobOn : knobOff}`} />
              </button>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard title={L("سكربتات مخصصة", "Custom Scripts")}>
        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold mb-1.5">{L("سكربت داخل", "Script inside")} &lt;head&gt;</div>
            <textarea rows={5} dir="ltr" className={ic + " font-mono text-xs"} value={head} onChange={e => setHead(e.target.value)} placeholder="<script>...</script>" />
          </div>
          <div>
            <div className="text-xs font-bold mb-1.5">{L("سكربت قبل إغلاق", "Script before closing")} &lt;/body&gt;</div>
            <textarea rows={5} dir="ltr" className={ic + " font-mono text-xs"} value={body} onChange={e => setBody(e.target.value)} placeholder="<script>...</script>" />
          </div>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}
const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";

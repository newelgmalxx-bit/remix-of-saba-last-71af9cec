import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton, Pill } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

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
  const [pixels, setPixels] = useState<Pixel[]>(initial);
  const [head, setHead] = useState("");
  const [body, setBody] = useState("");
  const update = (k: string, patch: Partial<Pixel>) => setPixels(pixels.map(p => p.key === k ? { ...p, ...patch } : p));
  const active = pixels.filter(p => p.enabled && p.value).length;
  return (
    <AdminLayout title="التتبع والبكسلات" subtitle="ربط أدوات التحليل والإعلانات" action={<PrimaryButton onClick={() => toast.success("تم حفظ البكسلات")}>حفظ</PrimaryButton>}>
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground">بكسلات نشطة</div>
          <div className="text-2xl font-bold mt-2">{active}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground">إجمالي البكسلات المتاحة</div>
          <div className="text-2xl font-bold mt-2">{pixels.length}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground">سكربتات مخصصة</div>
          <div className="text-2xl font-bold mt-2">{(head ? 1 : 0) + (body ? 1 : 0)}</div>
        </div>
      </div>

      <PanelCard title="بكسلات الجاهزة" className="mb-6">
        <div className="space-y-3">
          {pixels.map(p => (
            <div key={p.key} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] items-center rounded-xl border border-border p-3">
              <div>
                <div className="font-bold text-sm">{p.label}</div>
                <Pill tone={p.enabled && p.value ? "emerald" : "muted"}>
                  {p.enabled && p.value ? <><CheckCircle2 className="h-3 w-3 ml-1" /> مفعّل</> : <><XCircle className="h-3 w-3 ml-1" /> غير مفعّل</>}
                </Pill>
              </div>
              <input className={ic} dir="ltr" placeholder={p.placeholder} value={p.value} onChange={e => update(p.key, { value: e.target.value })} />
              <button onClick={() => update(p.key, { enabled: !p.enabled })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${p.enabled ? "bg-primary" : "bg-muted"}`}>
                <span className={`absolute inline-block h-5 w-5 rounded-full bg-white shadow transition ${p.enabled ? "right-0.5" : "right-5"}`} />
              </button>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard title="سكربتات مخصصة">
        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold mb-1.5">سكربت داخل &lt;head&gt;</div>
            <textarea rows={5} dir="ltr" className={ic + " font-mono text-xs"} value={head} onChange={e => setHead(e.target.value)} placeholder="<script>...</script>" />
          </div>
          <div>
            <div className="text-xs font-bold mb-1.5">سكربت قبل إغلاق &lt;/body&gt;</div>
            <textarea rows={5} dir="ltr" className={ic + " font-mono text-xs"} value={body} onChange={e => setBody(e.target.value)} placeholder="<script>...</script>" />
          </div>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}
const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
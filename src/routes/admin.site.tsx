import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { fileToWebp } from "@/lib/image";

export const Route = createFileRoute("/admin/site")({
  head: () => ({ meta: [{ title: "إعدادات الموقع | لوحة التحكم" }] }),
  component: SiteSettingsPage,
});

function SiteSettingsPage() {
  const [s, setS] = useState({
    name: "سابا ديزاين", tagline: "وكالتك الإبداعية لتصميم وتطوير المواقع والتطبيقات",
    email: "info@saba.sa", phone: "+966 55 000 0000", address: "الرياض، المملكة العربية السعودية",
    logo: "", favicon: "",
    facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "", tiktok: "",
    workHours: "الأحد - الخميس · 9 ص - 6 م",
    maintenance: false, primaryLang: "ar", currency: "SAR",
  });
  const upload = (k: "logo" | "favicon") => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setS({ ...s, [k]: await fileToWebp(f) });
  };
  return (
    <AdminLayout title="إعدادات الموقع" subtitle="معلومات الشركة والهوية والتواصل" action={<PrimaryButton onClick={() => toast.success("تم حفظ الإعدادات")}>حفظ التغييرات</PrimaryButton>}>
      <div className="grid gap-6 lg:grid-cols-3">
        <PanelCard title="الهوية والشعار" className="lg:col-span-1">
          <div className="space-y-4">
            <Img label="الشعار" value={s.logo} onChange={upload("logo")} onClear={() => setS({ ...s, logo: "" })} />
            <Img label="أيقونة المتصفح Favicon" value={s.favicon} onChange={upload("favicon")} onClear={() => setS({ ...s, favicon: "" })} small />
          </div>
        </PanelCard>

        <PanelCard title="معلومات أساسية" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <Lbl label="اسم الموقع"><input className={ic} value={s.name} onChange={e => setS({ ...s, name: e.target.value })} /></Lbl>
            <Lbl label="الشعار النصي (Tagline)"><input className={ic} value={s.tagline} onChange={e => setS({ ...s, tagline: e.target.value })} /></Lbl>
            <Lbl label="البريد الإلكتروني"><input className={ic} value={s.email} onChange={e => setS({ ...s, email: e.target.value })} /></Lbl>
            <Lbl label="رقم الجوال"><input type="tel" inputMode="tel" className={ic} dir="ltr" value={s.phone} onChange={e => setS({ ...s, phone: e.target.value })} /></Lbl>
            <Lbl label="العنوان" full><input className={ic} value={s.address} onChange={e => setS({ ...s, address: e.target.value })} /></Lbl>
            <Lbl label="ساعات العمل" full><input className={ic} value={s.workHours} onChange={e => setS({ ...s, workHours: e.target.value })} /></Lbl>
            <Lbl label="اللغة الافتراضية">
              <select className={ic} value={s.primaryLang} onChange={e => setS({ ...s, primaryLang: e.target.value })}>
                <option value="ar">العربية</option><option value="en">English</option>
              </select>
            </Lbl>
            <Lbl label="العملة">
              <select className={ic} value={s.currency} onChange={e => setS({ ...s, currency: e.target.value })}>
                <option value="SAR">ريال سعودي (SAR)</option><option value="USD">دولار أمريكي (USD)</option><option value="AED">درهم إماراتي (AED)</option>
              </select>
            </Lbl>
          </div>
        </PanelCard>

        <PanelCard title="روابط التواصل الاجتماعي" className="lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(["facebook","instagram","twitter","linkedin","youtube","tiktok"] as const).map(k => (
              <Lbl key={k} label={k}><input className={ic} dir="ltr" placeholder={`https://${k}.com/...`} value={(s as any)[k]} onChange={e => setS({ ...s, [k]: e.target.value })} /></Lbl>
            ))}
          </div>
        </PanelCard>

        <PanelCard title="وضع الصيانة" className="lg:col-span-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4" checked={s.maintenance} onChange={e => setS({ ...s, maintenance: e.target.checked })} />
            <span className="text-sm font-medium">تفعيل وضع الصيانة (سيظهر للزوار صفحة "الموقع تحت الصيانة")</span>
          </label>
        </PanelCard>
      </div>
    </AdminLayout>
  );
}

const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function Lbl({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`text-xs font-bold space-y-1.5 block ${full ? "sm:col-span-2 lg:col-span-3" : ""}`}>{label}{children}</label>;
}
function Img({ label, value, onChange, onClear, small }: { label: string; value: string; onChange: (e: any) => void; onClear: () => void; small?: boolean }) {
  return (
    <div>
      <div className="text-xs font-bold mb-2">{label}</div>
      <div className={`flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 ${small ? "h-20" : "h-32"}`}>
        {value ? <img src={value} alt={label} className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-muted-foreground">لا توجد صورة</span>}
      </div>
      <div className="mt-2 flex gap-2">
        <label className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary cursor-pointer hover:bg-primary/10">
          <Upload className="h-3.5 w-3.5" /> رفع
          <input type="file" accept="image/*" className="hidden" onChange={onChange} />
        </label>
        {value && <button onClick={onClear} className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-rose-600">حذف</button>}
      </div>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { fileToWebp } from "@/lib/image";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/admin/site")({
  head: () => ({ meta: [{ title: "إعدادات الموقع | لوحة التحكم" }] }),
  component: SiteSettingsPage,
});

function SiteSettingsPage() {
  const { lang } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const [s, setS] = useState({
    name: "سابا ديزاين", tagline: L("وكالتك الإبداعية لتصميم وتطوير المواقع والتطبيقات", "Your creative agency for web and app design & development"),
    email: "info@saba.sa", phone: "+966 55 000 0000", address: L("الرياض، المملكة العربية السعودية", "Riyadh, Saudi Arabia"),
    logo: "", favicon: "",
    facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "", tiktok: "",
    workHours: L("الأحد - الخميس · 9 ص - 6 م", "Sun - Thu · 9 AM - 6 PM"),
    maintenance: false, primaryLang: "ar", currency: "SAR",
  });
  const upload = (k: "logo" | "favicon") => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setS({ ...s, [k]: await fileToWebp(f) });
  };
  return (
    <AdminLayout title={L("إعدادات الموقع", "Site Settings")} subtitle={L("معلومات الشركة والهوية والتواصل", "Company info, identity, and contact")} action={<PrimaryButton onClick={() => toast.success(L("تم حفظ الإعدادات", "Settings saved"))}>{L("حفظ التغييرات", "Save Changes")}</PrimaryButton>}>
      <div className="grid gap-6 lg:grid-cols-3">
        <PanelCard title={L("الهوية والشعار", "Identity & Logo")} className="lg:col-span-1">
          <div className="space-y-4">
            <Img label={L("الشعار", "Logo")} value={s.logo} onChange={upload("logo")} onClear={() => setS({ ...s, logo: "" })} t={L} />
            <Img label={L("أيقونة المتصفح Favicon", "Favicon")} value={s.favicon} onChange={upload("favicon")} onClear={() => setS({ ...s, favicon: "" })} small t={L} />
          </div>
        </PanelCard>

        <PanelCard title={L("معلومات أساسية", "Basic Information")} className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <Lbl label={L("اسم الموقع", "Site Name")}><input className={ic} value={s.name} onChange={e => setS({ ...s, name: e.target.value })} /></Lbl>
            <Lbl label={L("الشعار النصي (Tagline)", "Tagline")}><input className={ic} value={s.tagline} onChange={e => setS({ ...s, tagline: e.target.value })} /></Lbl>
            <Lbl label={L("البريد الإلكتروني", "Email")}><input className={ic} value={s.email} onChange={e => setS({ ...s, email: e.target.value })} /></Lbl>
            <Lbl label={L("رقم الجوال", "Phone")}><input type="tel" inputMode="tel" className={ic} dir="ltr" value={s.phone} onChange={e => setS({ ...s, phone: e.target.value })} /></Lbl>
            <Lbl label={L("العنوان", "Address")} full><input className={ic} value={s.address} onChange={e => setS({ ...s, address: e.target.value })} /></Lbl>
            <Lbl label={L("ساعات العمل", "Work Hours")} full><input className={ic} value={s.workHours} onChange={e => setS({ ...s, workHours: e.target.value })} /></Lbl>
            <Lbl label={L("اللغة الافتراضية", "Default Language")}>
              <select className={ic} value={s.primaryLang} onChange={e => setS({ ...s, primaryLang: e.target.value })}>
                <option value="ar">العربية</option><option value="en">English</option>
              </select>
            </Lbl>
            <Lbl label={L("العملة", "Currency")}>
              <select className={ic} value={s.currency} onChange={e => setS({ ...s, currency: e.target.value })}>
                <option value="SAR">{L("ريال سعودي", "Saudi Riyal")} (SAR)</option><option value="USD">{L("دولار أمريكي", "US Dollar")} (USD)</option><option value="AED">{L("درهم إماراتي", "UAE Dirham")} (AED)</option>
              </select>
            </Lbl>
          </div>
        </PanelCard>

        <PanelCard title={L("روابط التواصل الاجتماعي", "Social Media Links")} className="lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(["facebook","instagram","twitter","linkedin","youtube","tiktok"] as const).map(k => (
              <Lbl key={k} label={k}><input className={ic} dir="ltr" placeholder={`https://${k}.com/...`} value={(s as any)[k]} onChange={e => setS({ ...s, [k]: e.target.value })} /></Lbl>
            ))}
          </div>
        </PanelCard>

        <PanelCard title={L("وضع الصيانة", "Maintenance Mode")} className="lg:col-span-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4" checked={s.maintenance} onChange={e => setS({ ...s, maintenance: e.target.checked })} />
            <span className="text-sm font-medium">{L("تفعيل وضع الصيانة (سيظهر للزوار صفحة \"الموقع تحت الصيانة\")", "Enable maintenance mode (visitors will see \"Site under maintenance\")")}</span>
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
function Img({ label, value, onChange, onClear, small, t }: { label: string; value: string; onChange: (e: any) => void; onClear: () => void; small?: boolean; t: (a: string, e: string) => string }) {
  return (
    <div>
      <div className="text-xs font-bold mb-2">{label}</div>
      <div className={`flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 ${small ? "h-20" : "h-32"}`}>
        {value ? <img src={value} alt={label} className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-muted-foreground">{t("لا توجد صورة", "No image")}</span>}
      </div>
      <div className="mt-2 flex gap-2">
        <label className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary cursor-pointer hover:bg-primary/10">
          <Upload className="h-3.5 w-3.5" /> {t("رفع", "Upload")}
          <input type="file" accept="image/*" className="hidden" onChange={onChange} />
        </label>
        {value && <button onClick={onClear} className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-rose-600">{t("حذف", "Delete")}</button>}
      </div>
    </div>
  );
}

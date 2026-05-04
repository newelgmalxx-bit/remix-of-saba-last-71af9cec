import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/seo")({
  head: () => ({ meta: [{ title: "إعدادات SEO | لوحة التحكم" }] }),
  component: SeoPage,
});

const defaultPages = [
  { key: "home", label: "الرئيسية", title: "سابا ديزاين | تصميم وتطوير المواقع والتطبيقات", desc: "وكالة إبداعية متخصصة في تصميم وتطوير المواقع والتطبيقات والهويات البصرية في السعودية." },
  { key: "services", label: "الخدمات", title: "خدماتنا | سابا ديزاين", desc: "اكتشف خدماتنا في تصميم المواقع، تطبيقات الموبايل، الهويات البصرية، والتسويق الرقمي." },
  { key: "portfolio", label: "أعمالنا", title: "أعمالنا | سابا ديزاين", desc: "معرض مختار من أحدث مشاريعنا في تصميم المواقع وتطوير التطبيقات." },
  { key: "about", label: "من نحن", title: "من نحن | سابا ديزاين", desc: "تعرف على قصتنا وفريقنا ورؤيتنا." },
  { key: "contact", label: "تواصل معنا", title: "تواصل معنا | سابا ديزاين", desc: "نسعد بالتواصل معك." },
];

function SeoPage() {
  const [global, setGlobal] = useState({ siteName: "سابا ديزاين", separator: "|", twitter: "@sabadesign", ogImage: "", canonicalBase: "https://saba.sa" });
  const [pages, setPages] = useState(defaultPages.map(p => ({ ...p, keywords: "تصميم مواقع، تطبيقات، هوية بصرية" })));
  const [robots, setRobots] = useState("User-agent: *\nAllow: /\nSitemap: https://saba.sa/sitemap.xml");
  return (
    <AdminLayout title="إعدادات SEO" subtitle="تحكم في عناوين الصفحات والوصف والكلمات الدلالية" action={<PrimaryButton onClick={() => toast.success("تم الحفظ")}>حفظ</PrimaryButton>}>
      <PanelCard title="إعدادات عامة" className="mb-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <L label="اسم الموقع"><input className={ic} value={global.siteName} onChange={e => setGlobal({ ...global, siteName: e.target.value })} /></L>
          <L label="فاصل العنوان"><input className={ic} value={global.separator} onChange={e => setGlobal({ ...global, separator: e.target.value })} /></L>
          <L label="حساب تويتر"><input className={ic} dir="ltr" value={global.twitter} onChange={e => setGlobal({ ...global, twitter: e.target.value })} /></L>
          <L label="رابط Canonical الأساسي"><input className={ic} dir="ltr" value={global.canonicalBase} onChange={e => setGlobal({ ...global, canonicalBase: e.target.value })} /></L>
          <L label="صورة Open Graph الافتراضية" full><input className={ic} dir="ltr" placeholder="https://..." value={global.ogImage} onChange={e => setGlobal({ ...global, ogImage: e.target.value })} /></L>
        </div>
      </PanelCard>

      <PanelCard title="عناوين الصفحات" className="mb-6">
        <div className="space-y-4">
          {pages.map((p, i) => (
            <div key={p.key} className="rounded-xl border border-border p-4">
              <div className="text-sm font-bold text-primary mb-3">{p.label}</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <L label="عنوان الصفحة (Title)"><input className={ic} value={p.title} onChange={e => setPages(pages.map((x, j) => i === j ? { ...x, title: e.target.value } : x))} /></L>
                <L label="الكلمات الدلالية"><input className={ic} value={p.keywords} onChange={e => setPages(pages.map((x, j) => i === j ? { ...x, keywords: e.target.value } : x))} /></L>
                <L label="وصف الصفحة (Meta Description)" full><textarea rows={2} className={ic} value={p.desc} onChange={e => setPages(pages.map((x, j) => i === j ? { ...x, desc: e.target.value } : x))} /></L>
              </div>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard title="ملف robots.txt">
        <textarea rows={6} className={ic + " font-mono text-xs"} dir="ltr" value={robots} onChange={e => setRobots(e.target.value)} />
      </PanelCard>
    </AdminLayout>
  );
}
const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
function L({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`text-xs font-bold space-y-1.5 block ${full ? "sm:col-span-2" : ""}`}>{label}{children}</label>;
}
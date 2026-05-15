import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton } from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api";

export const Route = createFileRoute("/admin/legal")({
  head: () => ({ meta: [{ title: "الصفحات القانونية | لوحة التحكم" }] }),
  component: LegalPagesAdmin,
});

type LegalState = {
  legalPrivacyTitle?: string;
  legalPrivacySubtitle?: string;
  legalPrivacyContent?: string;
  legalTermsTitle?: string;
  legalTermsSubtitle?: string;
  legalTermsContent?: string;
  legalLastUpdated?: string;
};

function LegalPagesAdmin() {
  const { lang } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const [s, setS] = useState<LegalState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"privacy" | "terms">("privacy");

  useEffect(() => {
    (async () => {
      try {
        const raw: any = await adminApi.settings.get<any>("site");
        const data = raw?.items ?? raw?.settings?.site ?? raw?.site ?? raw ?? {};
        setS({
          legalPrivacyTitle: data.legalPrivacyTitle || "",
          legalPrivacySubtitle: data.legalPrivacySubtitle || "",
          legalPrivacyContent: data.legalPrivacyContent || "",
          legalTermsTitle: data.legalTermsTitle || "",
          legalTermsSubtitle: data.legalTermsSubtitle || "",
          legalTermsContent: data.legalTermsContent || "",
          legalLastUpdated: data.legalLastUpdated || "",
        });
      } catch (e: any) {
        toast.error(e?.message || L("تعذر التحميل", "Load failed"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.settings.update("site", s);
      toast.success(L("تم الحفظ بنجاح", "Saved successfully"));
    } catch (e: any) {
      toast.error(e?.message || L("فشل الحفظ", "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof LegalState) => (v: string) => setS((cur) => ({ ...cur, [k]: v }));

  const ic = "w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm outline-none transition focus:border-primary";

  return (
    <AdminLayout
      title={L("الصفحات القانونية", "Legal pages")}
      subtitle={L("تعديل سياسة الخصوصية والشروط والأحكام", "Edit privacy policy and terms & conditions")}
      action={<PrimaryButton onClick={save}>{saving ? L("جارٍ الحفظ...", "Saving...") : L("حفظ التغييرات", "Save Changes")}</PrimaryButton>}
    >
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("privacy")}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "privacy" ? "bg-primary text-white" : "bg-muted text-foreground/70 hover:bg-muted/70"}`}
        >
          {L("سياسة الخصوصية", "Privacy Policy")}
        </button>
        <button
          type="button"
          onClick={() => setTab("terms")}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "terms" ? "bg-primary text-white" : "bg-muted text-foreground/70 hover:bg-muted/70"}`}
        >
          {L("الشروط والأحكام", "Terms & Conditions")}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {tab === "privacy" ? (
          <>
            <PanelCard title={L("بيانات الصفحة", "Page details")}>
              <div className="space-y-3">
                <Field label={L("عنوان الصفحة", "Page title")}>
                  <input className={ic} value={s.legalPrivacyTitle || ""} onChange={(e) => set("legalPrivacyTitle")(e.target.value)} placeholder={L("سياسة الخصوصية", "Privacy Policy")} />
                </Field>
                <Field label={L("نص توضيحي قصير", "Short subtitle")}>
                  <input className={ic} value={s.legalPrivacySubtitle || ""} onChange={(e) => set("legalPrivacySubtitle")(e.target.value)} />
                </Field>
                <Field label={L("تاريخ آخر تحديث (نص)", "Last updated (text)")}>
                  <input className={ic} value={s.legalLastUpdated || ""} onChange={(e) => set("legalLastUpdated")(e.target.value)} placeholder="2025-01-01" />
                </Field>
              </div>
            </PanelCard>
            <PanelCard title={L("محتوى الصفحة (HTML)", "Page content (HTML)")}>
              <p className="mb-2 text-xs text-foreground/60">{L("يمكنك استخدام HTML بسيط مثل <h2> و<p> و<a> و<ul>.", "You can use simple HTML like <h2>, <p>, <a>, <ul>.")}</p>
              <textarea
                className={`${ic} font-mono`}
                rows={20}
                dir="ltr"
                value={s.legalPrivacyContent || ""}
                onChange={(e) => set("legalPrivacyContent")(e.target.value)}
                placeholder="<h2>المقدمة</h2>\n<p>...</p>"
              />
            </PanelCard>
          </>
        ) : (
          <>
            <PanelCard title={L("بيانات الصفحة", "Page details")}>
              <div className="space-y-3">
                <Field label={L("عنوان الصفحة", "Page title")}>
                  <input className={ic} value={s.legalTermsTitle || ""} onChange={(e) => set("legalTermsTitle")(e.target.value)} placeholder={L("الشروط والأحكام", "Terms & Conditions")} />
                </Field>
                <Field label={L("نص توضيحي قصير", "Short subtitle")}>
                  <input className={ic} value={s.legalTermsSubtitle || ""} onChange={(e) => set("legalTermsSubtitle")(e.target.value)} />
                </Field>
                <Field label={L("تاريخ آخر تحديث (نص)", "Last updated (text)")}>
                  <input className={ic} value={s.legalLastUpdated || ""} onChange={(e) => set("legalLastUpdated")(e.target.value)} placeholder="2025-01-01" />
                </Field>
              </div>
            </PanelCard>
            <PanelCard title={L("محتوى الصفحة (HTML)", "Page content (HTML)")}>
              <p className="mb-2 text-xs text-foreground/60">{L("يمكنك استخدام HTML بسيط مثل <h2> و<p> و<a> و<ul>.", "You can use simple HTML like <h2>, <p>, <a>, <ul>.")}</p>
              <textarea
                className={`${ic} font-mono`}
                rows={20}
                dir="ltr"
                value={s.legalTermsContent || ""}
                onChange={(e) => set("legalTermsContent")(e.target.value)}
                placeholder="<h2>القبول بالشروط</h2>\n<p>...</p>"
              />
            </PanelCard>
          </>
        )}
      </div>

      {/* Live preview */}
      <div className="mt-6">
        <PanelCard title={L("معاينة مباشرة", "Live preview")}>
          <div className="rounded-2xl border border-border/60 bg-white p-6">
            <h2 className="mb-2 text-2xl font-extrabold">
              {tab === "privacy" ? (s.legalPrivacyTitle || L("سياسة الخصوصية", "Privacy Policy")) : (s.legalTermsTitle || L("الشروط والأحكام", "Terms & Conditions"))}
            </h2>
            {(tab === "privacy" ? s.legalPrivacySubtitle : s.legalTermsSubtitle) && (
              <p className="mb-4 text-sm text-foreground/70">{tab === "privacy" ? s.legalPrivacySubtitle : s.legalTermsSubtitle}</p>
            )}
            <div
              className="prose prose-sm max-w-none text-foreground/80"
              dangerouslySetInnerHTML={{ __html: (tab === "privacy" ? s.legalPrivacyContent : s.legalTermsContent) || `<p class="text-foreground/40">${L("لا يوجد محتوى بعد", "No content yet")}</p>` }}
            />
          </div>
        </PanelCard>
      </div>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-foreground/70">{label}</span>
      {children}
    </label>
  );
}

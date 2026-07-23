import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, PanelCard, PrimaryButton } from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";
import { admin as adminApi } from "@/lib/api";
import { Trash2, ArrowDown, ArrowUp, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/legal")({
  head: () => ({ meta: [{ title: "الصفحات القانونية | لوحة التحكم" }] }),
  component: LegalPagesAdmin,
});

type Section = {
  titleAr?: string;
  titleEn?: string;
  bodyAr?: string;
  bodyEn?: string;
};

type LegalPage = {
  badgeAr?: string;
  badgeEn?: string;
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  lastUpdatedAr?: string;
  lastUpdatedEn?: string;
  sections?: Section[];
};

type LegalState = {
  legalPrivacy?: LegalPage;
  legalTerms?: LegalPage;
};

const emptyPage = (): LegalPage => ({
  badgeAr: "",
  badgeEn: "",
  titleAr: "",
  titleEn: "",
  subtitleAr: "",
  subtitleEn: "",
  lastUpdatedAr: "",
  lastUpdatedEn: "",
  sections: [],
});

function LegalPagesAdmin() {
  const { lang } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const [s, setS] = useState<LegalState>({ legalPrivacy: emptyPage(), legalTerms: emptyPage() });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"privacy" | "terms">("privacy");

  useEffect(() => {
    (async () => {
      try {
        const raw: any = await adminApi.settings.get<any>("site");
        const data = raw?.items ?? raw?.settings?.site ?? raw?.site ?? raw ?? {};
        setS({
          legalPrivacy: { ...emptyPage(), ...(data.legalPrivacy || {}) },
          legalTerms: { ...emptyPage(), ...(data.legalTerms || {}) },
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

  const key: "legalPrivacy" | "legalTerms" = tab === "privacy" ? "legalPrivacy" : "legalTerms";
  const page = s[key] || emptyPage();

  const setPage = (patch: Partial<LegalPage>) =>
    setS((cur) => ({ ...cur, [key]: { ...(cur[key] || emptyPage()), ...patch } }));

  const setSections = (next: Section[]) => setPage({ sections: next });

  const addSection = () =>
    setSections([...(page.sections || []), { titleAr: "", titleEn: "", bodyAr: "", bodyEn: "" }]);

  const removeSection = (i: number) => setSections((page.sections || []).filter((_, idx) => idx !== i));

  const moveSection = (i: number, dir: -1 | 1) => {
    const arr = [...(page.sections || [])];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setSections(arr);
  };

  const updateSection = (i: number, patch: Partial<Section>) => {
    const arr = [...(page.sections || [])];
    arr[i] = { ...arr[i], ...patch };
    setSections(arr);
  };

  const ic =
    "w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm outline-none transition focus:border-primary";

  if (loading) {
    return (
      <AdminLayout title={L("الصفحات القانونية", "Legal pages")}>
        <div className="py-20 text-center text-sm text-foreground/60">{L("جارٍ التحميل...", "Loading...")}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={L("الصفحات القانونية", "Legal pages")}
      subtitle={L("تعديل سياسة الخصوصية والشروط والأحكام", "Edit privacy policy and terms & conditions")}
      action={
        <PrimaryButton onClick={save}>
          {saving ? L("جارٍ الحفظ...", "Saving...") : L("حفظ التغييرات", "Save Changes")}
        </PrimaryButton>
      }
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

      {/* Header card */}
      <PanelCard title={L("الترويسة (الهيدر)", "Header")}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={L("الشارة (عربي)", "Badge (Arabic)")}>
            <input className={ic} value={page.badgeAr || ""} onChange={(e) => setPage({ badgeAr: e.target.value })} />
          </Field>
          <Field label={L("الشارة (إنجليزي)", "Badge (English)")}>
            <input className={ic} value={page.badgeEn || ""} onChange={(e) => setPage({ badgeEn: e.target.value })} />
          </Field>
          <Field label={L("العنوان (عربي)", "Title (Arabic)")}>
            <input className={ic} value={page.titleAr || ""} onChange={(e) => setPage({ titleAr: e.target.value })} />
          </Field>
          <Field label={L("العنوان (إنجليزي)", "Title (English)")}>
            <input className={ic} value={page.titleEn || ""} onChange={(e) => setPage({ titleEn: e.target.value })} />
          </Field>
          <Field label={L("النبذة (عربي)", "Subtitle (Arabic)")}>
            <textarea className={ic} rows={2} value={page.subtitleAr || ""} onChange={(e) => setPage({ subtitleAr: e.target.value })} />
          </Field>
          <Field label={L("النبذة (إنجليزي)", "Subtitle (English)")}>
            <textarea className={ic} rows={2} value={page.subtitleEn || ""} onChange={(e) => setPage({ subtitleEn: e.target.value })} />
          </Field>
          <Field label={L("آخر تحديث (عربي)", "Last updated (Arabic)")}>
            <input className={ic} value={page.lastUpdatedAr || ""} onChange={(e) => setPage({ lastUpdatedAr: e.target.value })} />
          </Field>
          <Field label={L("آخر تحديث (إنجليزي)", "Last updated (English)")}>
            <input className={ic} value={page.lastUpdatedEn || ""} onChange={(e) => setPage({ lastUpdatedEn: e.target.value })} />
          </Field>
        </div>
      </PanelCard>

      {/* Sections card */}
      <div className="mt-6">
        <PanelCard
          title={L("الأقسام", "Sections")}
          action={
            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" /> {L("إضافة قسم", "Add section")}
            </button>
          }
        >
          <p className="mb-4 text-xs text-foreground/60">
            {L("كل قسم يظهر في الصفحة بعنوان ونص.", "Each section appears on the page with a title and body.")}
          </p>
          <div className="space-y-4">
            {(page.sections || []).length === 0 && (
              <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-foreground/50">
                {L("لا توجد أقسام بعد. اضغط إضافة قسم.", "No sections yet. Click Add section.")}
              </div>
            )}
            {(page.sections || []).map((sec, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">#{i + 1} {L("قسم", "Section")}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveSection(i, -1)} className="rounded-lg border border-border/60 p-1.5 hover:bg-muted" title={L("لأعلى", "Up")}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => moveSection(i, 1)} className="rounded-lg border border-border/60 p-1.5 hover:bg-muted" title={L("لأسفل", "Down")}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => removeSection(i)} className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50" title={L("حذف", "Delete")}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label={L("العنوان (عربي)", "Title (Arabic)")}>
                    <input className={ic} value={sec.titleAr || ""} onChange={(e) => updateSection(i, { titleAr: e.target.value })} />
                  </Field>
                  <Field label={L("العنوان (إنجليزي)", "Title (English)")}>
                    <input className={ic} value={sec.titleEn || ""} onChange={(e) => updateSection(i, { titleEn: e.target.value })} />
                  </Field>
                  <Field label={L("النص (عربي)", "Body (Arabic)")}>
                    <textarea className={ic} rows={5} value={sec.bodyAr || ""} onChange={(e) => updateSection(i, { bodyAr: e.target.value })} />
                  </Field>
                  <Field label={L("النص (إنجليزي)", "Body (English)")}>
                    <textarea className={ic} rows={5} value={sec.bodyEn || ""} onChange={(e) => updateSection(i, { bodyEn: e.target.value })} />
                  </Field>
                </div>
              </div>
            ))}
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

export { LegalPagesAdmin };

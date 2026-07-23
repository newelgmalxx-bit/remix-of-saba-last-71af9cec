import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Star, Check, X, Trash2, Loader2, MessageSquare } from "lucide-react";
import { AdminLayout, PanelCard, Pill } from "@/components/admin/AdminLayout";
import { useLang } from "@/i18n/LanguageProvider";
import { admin } from "@/lib/api";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({ meta: [{ title: "التقييمات | لوحة التحكم" }] }),
  component: AdminReviewsPage,
});

type ReviewStatus = "pending" | "published" | "rejected";
type Review = {
  id: string;
  user_id?: string;
  service_id?: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  created_at?: string;
  userName?: string | null;
  userEmail?: string | null;
  serviceTitle?: string | null;
  serviceSlug?: string | null;
};

const TABS: { key: "all" | ReviewStatus; ar: string; en: string }[] = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "pending", ar: "قيد المراجعة", en: "Pending" },
  { key: "published", ar: "منشور", en: "Published" },
  { key: "rejected", ar: "مرفوض", en: "Rejected" },
];

function AdminReviewsPage() {
  const { lang, dir } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | ReviewStatus>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<Review | null>(null);
  const [confirmReject, setConfirmReject] = useState<Review | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (tab !== "all") params.status = tab;
      const r: any = await admin.reviews.list(params);
      const list: Review[] = r?.items ?? r?.data?.items ?? r ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e: any) {
      toast.error(e?.message || L("تعذر تحميل التقييمات", "Failed to load reviews"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (r: Review) => {
    setBusyId(r.id);
    try {
      const res: any = await admin.reviews.approve(r.id);
      toast.success(res?.message || L("تم نشر التقييم", "Review approved"));
      setItems((arr) => arr.map((x) => x.id === r.id ? { ...x, status: "published" } : x));
      if (tab !== "all" && tab !== "published") setItems((arr) => arr.filter((x) => x.id !== r.id));
    } catch (e: any) {
      toast.error(e?.message || L("فشل التحديث", "Failed"));
    } finally { setBusyId(null); }
  };

  const handleReject = async (r: Review) => {
    setBusyId(r.id);
    try {
      const res: any = await admin.reviews.reject(r.id);
      toast.success(res?.message || L("تم رفض التقييم", "Review rejected"));
      setItems((arr) => arr.map((x) => x.id === r.id ? { ...x, status: "rejected" } : x));
      if (tab !== "all" && tab !== "rejected") setItems((arr) => arr.filter((x) => x.id !== r.id));
    } catch (e: any) {
      toast.error(e?.message || L("فشل التحديث", "Failed"));
    } finally { setBusyId(null); setConfirmReject(null); }
  };

  const handleDelete = async (r: Review) => {
    setBusyId(r.id);
    try {
      const res: any = await admin.reviews.remove(r.id);
      toast.success(res?.message || L("تم حذف التقييم", "Review deleted"));
      setItems((arr) => arr.filter((x) => x.id !== r.id));
    } catch (e: any) {
      toast.error(e?.message || L("فشل الحذف", "Failed"));
    } finally { setBusyId(null); setConfirmDel(null); }
  };

  const statusPill = (s: ReviewStatus) => {
    if (s === "published") return <Pill tone="emerald">{L("منشور", "Published")}</Pill>;
    if (s === "rejected") return <Pill tone="rose">{L("مرفوض", "Rejected")}</Pill>;
    return <Pill tone="amber">{L("قيد المراجعة", "Pending")}</Pill>;
  };

  const fmtDate = (s?: string) => {
    if (!s) return "—";
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleDateString();
  };

  return (
    <AdminLayout title={L("التقييمات", "Reviews")} subtitle={L("إدارة تقييمات العملاء", "Manage customer reviews")}>
      <PanelCard>
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 border-b border-border pb-3" dir={dir}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                tab === t.key ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-muted/80"
              }`}
            >
              {L(t.ar, t.en)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">{L("لا توجد تقييمات", "No reviews found")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-sm">{r.userName || L("مستخدم", "User")}</span>
                      {r.userEmail && <span className="text-xs text-muted-foreground">· {r.userEmail}</span>}
                      {statusPill(r.status)}
                    </div>
                    {r.serviceTitle && (
                      <div className="text-xs text-muted-foreground mb-2">
                        {L("الخدمة:", "Service:")} <span className="font-medium text-foreground/80">{r.serviceTitle}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                      ))}
                      <span className="ms-2 text-xs text-muted-foreground">{r.rating}/5</span>
                    </div>
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap">{r.comment}</p>
                    <div className="text-[11px] text-muted-foreground mt-2">{fmtDate(r.created_at)}</div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {(r.status === "pending" || r.status === "rejected") && (
                      <button
                        onClick={() => handleApprove(r)}
                        disabled={busyId === r.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {busyId === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        {L("اعتماد", "Approve")}
                      </button>
                    )}
                    {(r.status === "pending" || r.status === "published") && (
                      <button
                        onClick={() => setConfirmReject(r)}
                        disabled={busyId === r.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5" />
                        {L("رفض", "Reject")}
                      </button>
                    )}
                    {(r.status === "published" || r.status === "rejected") && (
                      <button
                        onClick={() => setConfirmDel(r)}
                        disabled={busyId === r.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {L("حذف", "Delete")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PanelCard>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent dir={dir}>
          <AlertDialogHeader>
            <AlertDialogTitle>{L("حذف التقييم؟", "Delete review?")}</AlertDialogTitle>
            <AlertDialogDescription>{L("لا يمكن التراجع عن هذا الإجراء.", "This action cannot be undone.")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{L("إلغاء", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDel && handleDelete(confirmDel)} className="bg-rose-600 hover:bg-rose-700">
              {L("حذف", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReject} onOpenChange={(o) => !o && setConfirmReject(null)}>
        <AlertDialogContent dir={dir}>
          <AlertDialogHeader>
            <AlertDialogTitle>{L("رفض التقييم؟", "Reject review?")}</AlertDialogTitle>
            <AlertDialogDescription>{L("لن يظهر التقييم للعملاء.", "The review will be hidden from customers.")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{L("إلغاء", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmReject && handleReject(confirmReject)}>
              {L("رفض", "Reject")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

export { AdminReviewsPage };

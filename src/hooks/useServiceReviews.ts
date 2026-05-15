import { useEffect, useState, useCallback } from "react";
import { reviews as reviewsApi } from "@/lib/api/services";
import { refreshReviewsSummary } from "@/hooks/useReviewsSummary";

export type ServiceReview = {
  id: string;
  userName: string;
  userAvatar?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
};

function normalize(r: any): ServiceReview {
  return {
    id: String(r.id ?? ""),
    userName: r.userName || r.user_name || "مستخدم",
    userAvatar: r.userAvatar ?? r.user_avatar ?? null,
    rating: Number(r.rating) || 0,
    comment: r.comment || r.text || "",
    createdAt: String(r.created_at || r.createdAt || new Date().toISOString()),
  };
}

export function useServiceReviews(slug: string) {
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [summary, setSummary] = useState<{ average: number; count: number }>({ average: 0, count: 0 });

  const load = useCallback(async () => {
    if (!slug) return;
    try {
      const res: any = await reviewsApi.list({ serviceSlug: slug });
      const data = res?.data ?? res;
      const items: any[] = data?.items ?? [];
      const list = items.map(normalize);
      setReviews(list);
      setSummary({
        average: typeof data?.average === "number" ? data.average : (list.length ? list.reduce((a, r) => a + r.rating, 0) / list.length : 0),
        count: typeof data?.total === "number" ? data.total : list.length,
      });
    } catch {
      setReviews([]);
      setSummary({ average: 0, count: 0 });
    }
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  const addReview = useCallback(async (rating: number, comment: string): Promise<boolean> => {
    if (!slug || rating < 1 || !comment.trim() || comment.trim().length < 5) return false;
    try {
      await reviewsApi.create({ serviceSlug: slug, rating, text: comment.trim() });
      await load();
      return true;
    } catch {
      return false;
    }
  }, [slug, load]);

  return { reviews, summary, addReview };
}

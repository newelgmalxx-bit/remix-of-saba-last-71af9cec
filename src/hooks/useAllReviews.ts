import { useEffect, useState } from "react";
import { reviews as reviewsApi } from "@/lib/api/services";

export type AllReview = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  serviceSlug?: string;
};

export function useAllReviews() {
  const [items, setItems] = useState<AllReview[]>([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res: any = await reviewsApi.list();
        const data = res?.data ?? res;
        const list: AllReview[] = (data?.items ?? []).map((r: any) => ({
          id: String(r.id ?? ""),
          userName: r.userName || r.user_name || "مستخدم",
          rating: Number(r.rating) || 0,
          comment: r.comment || r.text || "",
          serviceSlug: r.serviceSlug || r.service_slug,
        }));
        if (alive) setItems(list);
      } catch {
        if (alive) setItems([]);
      }
    })();
    return () => { alive = false; };
  }, []);
  return items;
}

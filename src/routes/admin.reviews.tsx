import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({
    meta: [
      { title: 'التقييمات | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.reviews"), "AdminReviewsPage"),
});

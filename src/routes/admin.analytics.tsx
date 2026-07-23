import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: 'التحليلات | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.analytics"), "AnalyticsPage"),
});

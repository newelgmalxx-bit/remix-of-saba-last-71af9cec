import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: 'التقارير | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.reports"), "ReportsPage"),
});

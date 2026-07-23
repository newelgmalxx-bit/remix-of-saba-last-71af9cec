import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/plans")({
  head: () => ({
    meta: [
      { title: 'الباقات والأسعار | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.plans"), "AdminPlansPage"),
});

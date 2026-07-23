import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/legal")({
  head: () => ({
    meta: [
      { title: 'الصفحات القانونية | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.legal"), "LegalPagesAdmin"),
});

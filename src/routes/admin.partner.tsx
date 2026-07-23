import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/partner")({
  head: () => ({
    meta: [
      { title: 'إدارة API الشريك | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.partner"), "PartnerApiPage"),
});

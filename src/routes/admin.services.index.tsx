import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/services/")({
  head: () => ({
    meta: [
      { title: 'الخدمات | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.services.index"), "ServicesPage"),
});

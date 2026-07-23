import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/abandoned-carts")({
  head: () => ({
    meta: [
      { title: 'السلات المتروكة | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.abandoned-carts"), "AbandonedCartsPage"),
});

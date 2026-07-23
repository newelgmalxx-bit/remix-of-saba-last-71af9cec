import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/tracking")({
  head: () => ({
    meta: [
      { title: 'التتبع والبكسلات | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.tracking"), "TrackingPage"),
});

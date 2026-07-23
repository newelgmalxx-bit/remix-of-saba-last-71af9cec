import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings/notifications")({
  head: () => ({
    meta: [
      { title: 'الإشعارات | الإعدادات' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.settings.notifications"), "NotificationsPage"),
});

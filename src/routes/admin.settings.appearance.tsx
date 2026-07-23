import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings/appearance")({
  head: () => ({
    meta: [
      { title: 'المظهر | الإعدادات' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.settings.appearance"), "AppearancePage"),
});

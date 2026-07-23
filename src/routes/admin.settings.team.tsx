import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings/team")({
  head: () => ({
    meta: [
      { title: 'الفريق والصلاحيات | الإعدادات' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.settings.team"), "TeamPage"),
});

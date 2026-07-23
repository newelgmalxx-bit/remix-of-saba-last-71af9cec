import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings/profile")({
  head: () => ({
    meta: [
      { title: 'الملف الشخصي | الإعدادات' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.settings.profile"), "ProfilePage"),
});

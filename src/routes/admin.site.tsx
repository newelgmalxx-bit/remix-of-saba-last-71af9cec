import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/site")({
  head: () => ({
    meta: [
      { title: 'إعدادات الموقع | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.site"), "SiteSettingsPage"),
});

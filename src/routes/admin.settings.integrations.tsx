import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings/integrations")({
  head: () => ({
    meta: [
      { title: 'التكاملات | الإعدادات' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.settings.integrations"), "IntegrationsPage"),
});

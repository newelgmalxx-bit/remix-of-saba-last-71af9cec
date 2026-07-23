import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/clients")({
  head: () => ({
    meta: [
      { title: 'العملاء | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.clients"), "ClientsPage"),
});

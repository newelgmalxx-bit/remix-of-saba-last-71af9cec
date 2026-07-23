import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/tickets/")({
  head: () => ({
    meta: [
      { title: 'التذاكر | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.tickets.index"), "AdminTicketsList"),
});

import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/tickets/$ticketId")({
  head: () => ({
    meta: [
      { title: 'تذكرة | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.tickets.$ticketId"), "AdminTicketDetail"),
});

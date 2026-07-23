import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/account/tickets/")({
  head: () => ({
    meta: [
      { title: 'تذاكر الدعم | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/account.tickets.index"), "TicketsList"),
});

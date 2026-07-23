import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/account/tickets/$ticketId")({
  head: () => ({
    meta: [
      { title: 'تذكرة دعم | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/account.tickets.$ticketId"), "TicketDetail"),
});

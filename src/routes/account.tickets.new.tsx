import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/account/tickets/new")({
  head: () => ({
    meta: [
      { title: 'تذكرة جديدة | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/account.tickets.new"), "NewTicket"),
});

import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/account/orders/")({
  head: () => ({
    meta: [
      { title: 'طلباتي | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/account.orders.index"), "OrdersList"),
});

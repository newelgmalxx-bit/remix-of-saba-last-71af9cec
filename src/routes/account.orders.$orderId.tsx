import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/account/orders/$orderId")({
  head: () => ({
    meta: [
      { title: 'تفاصيل الطلب | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/account.orders.$orderId"), "OrderDetail"),
});

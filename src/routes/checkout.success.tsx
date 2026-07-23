import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: 'تم استلام طلبك | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/checkout.success"), "SuccessPage"),
});

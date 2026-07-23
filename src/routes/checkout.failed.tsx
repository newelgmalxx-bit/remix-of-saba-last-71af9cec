import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/failed")({
  head: () => ({
    meta: [
      { title: 'فشل الدفع | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/checkout.failed"), "CheckoutFailedPage"),
});

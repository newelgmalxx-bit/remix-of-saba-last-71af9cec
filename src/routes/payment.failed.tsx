import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/payment/failed")({
  head: () => ({
    meta: [
      { title: 'فشل الدفع | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/payment.failed"), "PaymentFailedPage"),
});

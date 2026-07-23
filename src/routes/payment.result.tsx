import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/payment/result")({
  head: () => ({
    meta: [
      { title: 'نتيجة الدفع | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/payment.result"), "PaymentResultPage"),
});

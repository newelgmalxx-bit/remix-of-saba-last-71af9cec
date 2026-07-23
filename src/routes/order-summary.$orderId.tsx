import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/order-summary/$orderId")({
  head: () => ({
    meta: [
      { title: 'ملخص الطلب | سابا ديزاين' },
      { name: "description", content: 'ملخص الطلب الكامل، حالة الدفع، بيانات العميل والفاتورة.' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/order-summary.$orderId"), "OrderSummaryPage"),
});

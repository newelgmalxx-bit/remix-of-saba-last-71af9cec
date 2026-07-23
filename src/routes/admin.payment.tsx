import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/payment")({
  head: () => ({
    meta: [
      { title: 'إعدادات الدفع | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.payment"), "PaymentSettingsPage"),
});

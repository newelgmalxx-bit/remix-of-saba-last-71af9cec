import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/invoices")({
  head: () => ({
    meta: [
      { title: 'الفواتير | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.invoices"), "InvoicesPage"),
});

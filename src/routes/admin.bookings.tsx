import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({
    meta: [
      { title: 'الطلبات | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.bookings"), "BookingsPage"),
});

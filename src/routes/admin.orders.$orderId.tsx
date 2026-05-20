import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders/$orderId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/admin/bookings",
      search: { orderId: params.orderId } as any,
    });
  },
});
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders")({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: "/admin/bookings",
      search: location.search,
    });
  },
});
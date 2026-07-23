import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: 'سلة المشتريات | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/cart"), "CartPage"),
});

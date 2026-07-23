import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/account/")({
  head: () => ({
    meta: [
      { title: 'حسابي | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/account.index"), "AccountHome"),
});

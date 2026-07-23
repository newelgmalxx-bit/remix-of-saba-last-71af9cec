import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: 'باقات تصميم المواقع والتطبيقات | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/plans"), "PlansPage"),
});

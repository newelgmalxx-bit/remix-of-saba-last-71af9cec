import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: 'من نحن | سابا ديزاين — وكالة رقمية ببصمة عربية' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/about"), "AboutPage"),
});

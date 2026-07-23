import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: 'تواصل معنا | سابا ديزاين — استشارة رقمية مجانية' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/contact"), "ContactPage"),
});

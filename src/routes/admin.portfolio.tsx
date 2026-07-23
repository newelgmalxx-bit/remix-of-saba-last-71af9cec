import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/portfolio")({
  head: () => ({
    meta: [
      { title: 'أعمالنا | لوحة التحكم' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin.portfolio"), "PortfolioPage"),
});

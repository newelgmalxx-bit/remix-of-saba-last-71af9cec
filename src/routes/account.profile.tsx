import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/account/profile")({
  head: () => ({
    meta: [
      { title: 'ملفي الشخصي | سابا ديزاين' },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/routes/account.profile"), "Profile"),
});
